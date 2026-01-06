<?php
/**
 * REST API Controller.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Api;

use Polymorphic\Components\Component_Registry;
use Polymorphic\Cache\Transient_Cache;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * REST API endpoints for the builder.
 *
 * @since 1.0.0
 */
class Rest_Controller extends WP_REST_Controller {

    /**
     * REST namespace.
     *
     * @var string
     */
    protected $namespace = 'polymorphic/v1';

    /**
     * Component registry.
     *
     * @var Component_Registry
     */
    private Component_Registry $registry;

    /**
     * Cache handler.
     *
     * @var Transient_Cache
     */
    private Transient_Cache $cache;

    /**
     * Constructor.
     *
     * @since 1.0.0
     *
     * @param Component_Registry $registry Component registry.
     */
    public function __construct( Component_Registry $registry ) {
        $this->registry = $registry;
        $this->cache    = new Transient_Cache();
    }

    /**
     * Register REST routes.
     *
     * @since 1.0.0
     */
    public function register_routes(): void {
        // Save builder data.
        register_rest_route(
            $this->namespace,
            '/posts/(?P<id>\d+)/builder',
            [
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'save_builder_data' ],
                    'permission_callback' => [ $this, 'can_edit_post' ],
                    'args'                => $this->get_save_args(),
                ],
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_builder_data' ],
                    'permission_callback' => [ $this, 'can_edit_post' ],
                ],
            ]
        );

        // Get component defaults.
        register_rest_route(
            $this->namespace,
            '/components/(?P<type>[a-z-]+)/defaults',
            [
                'methods'             => 'GET',
                'callback'            => [ $this, 'get_component_defaults' ],
                'permission_callback' => [ $this, 'can_edit_posts' ],
            ]
        );

        // List all components.
        register_rest_route(
            $this->namespace,
            '/components',
            [
                'methods'             => 'GET',
                'callback'            => [ $this, 'list_components' ],
                'permission_callback' => [ $this, 'can_edit_posts' ],
            ]
        );

        // Render preview.
        register_rest_route(
            $this->namespace,
            '/preview',
            [
                'methods'             => 'POST',
                'callback'            => [ $this, 'render_preview' ],
                'permission_callback' => [ $this, 'can_edit_posts' ],
                'args'                => [
                    'post_id' => [
                        'required'          => true,
                        'type'              => 'integer',
                        'sanitize_callback' => 'absint',
                    ],
                    'data'    => [
                        'required' => true,
                        'type'     => 'object',
                    ],
                ],
            ]
        );
    }

    /**
     * Save builder data for a post.
     *
     * @since 1.0.0
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function save_builder_data( WP_REST_Request $request ) {
        $post_id = $request->get_param( 'id' );
        $data    = $request->get_param( 'data' );

        // Validate post exists.
        $post = get_post( $post_id );
        if ( ! $post ) {
            return new WP_Error(
                'polymorphic_invalid_post',
                __( 'Invalid post ID.', 'polymorphic' ),
                [ 'status' => 404 ]
            );
        }

        // Sanitize and validate the data.
        $sanitized_data = $this->sanitize_builder_data( $data );

        if ( is_wp_error( $sanitized_data ) ) {
            return $sanitized_data;
        }

        // Add metadata.
        $sanitized_data['version']  = POLYMORPHIC_VERSION;
        $sanitized_data['modified'] = current_time( 'mysql' );

        if ( empty( $sanitized_data['created'] ) ) {
            $sanitized_data['created'] = current_time( 'mysql' );
        }

        // Save to post meta.
        $json = wp_json_encode( $sanitized_data );

        if ( false === $json ) {
            return new WP_Error(
                'polymorphic_encode_error',
                __( 'Failed to encode builder data.', 'polymorphic' ),
                [ 'status' => 500 ]
            );
        }

        update_post_meta( $post_id, '_polymorphic_data', $json );
        update_post_meta( $post_id, '_polymorphic_enabled', true );
        update_post_meta( $post_id, '_polymorphic_version', POLYMORPHIC_VERSION );

        // Invalidate cache.
        $this->cache->invalidate( $post_id );

        /**
         * Fires after builder data is saved.
         *
         * @since 1.0.0
         *
         * @param int   $post_id Post ID.
         * @param array $data    Saved data.
         */
        do_action( 'polymorphic/save/after', $post_id, $sanitized_data );

        return new WP_REST_Response(
            [
                'success'  => true,
                'data'     => [
                    'modified'  => $sanitized_data['modified'],
                    'cache_key' => get_post_meta( $post_id, '_polymorphic_cache_key', true ),
                ],
                'message'  => __( 'Builder data saved successfully.', 'polymorphic' ),
            ],
            200
        );
    }

    /**
     * Get builder data for a post.
     *
     * @since 1.0.0
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function get_builder_data( WP_REST_Request $request ) {
        $post_id = $request->get_param( 'id' );

        // Validate post exists.
        $post = get_post( $post_id );
        if ( ! $post ) {
            return new WP_Error(
                'polymorphic_invalid_post',
                __( 'Invalid post ID.', 'polymorphic' ),
                [ 'status' => 404 ]
            );
        }

        // Get stored data.
        $json = get_post_meta( $post_id, '_polymorphic_data', true );

        if ( empty( $json ) ) {
            // Return default structure for new pages.
            return new WP_REST_Response(
                [
                    'success' => true,
                    'data'    => [
                        'version'    => POLYMORPHIC_VERSION,
                        'created'    => '',
                        'modified'   => '',
                        'settings'   => $this->get_default_settings(),
                        'components' => [],
                        'customCss'  => '',
                    ],
                ],
                200
            );
        }

        $data = json_decode( $json, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return new WP_Error(
                'polymorphic_decode_error',
                __( 'Failed to decode builder data.', 'polymorphic' ),
                [ 'status' => 500 ]
            );
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $data,
            ],
            200
        );
    }

    /**
     * Get component defaults.
     *
     * @since 1.0.0
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function get_component_defaults( WP_REST_Request $request ) {
        $type = $request->get_param( 'type' );

        if ( ! $this->registry->has( $type ) ) {
            return new WP_Error(
                'polymorphic_invalid_component',
                __( 'Invalid component type.', 'polymorphic' ),
                [ 'status' => 404 ]
            );
        }

        $component = $this->registry->get( $type );
        $defaults  = $component ? $component->get_defaults() : [];

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => [
                    'type'     => $type,
                    'defaults' => $defaults,
                ],
            ],
            200
        );
    }

    /**
     * List all registered components.
     *
     * @since 1.0.0
     *
     * @return WP_REST_Response
     */
    public function list_components(): WP_REST_Response {
        $components = $this->registry->get_all();

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $components,
            ],
            200
        );
    }

    /**
     * Render preview HTML.
     *
     * @since 1.0.0
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function render_preview( WP_REST_Request $request ) {
        $post_id = $request->get_param( 'post_id' );
        $data    = $request->get_param( 'data' );

        if ( empty( $data['components'] ) ) {
            return new WP_REST_Response(
                [
                    'success' => true,
                    'data'    => [
                        'html' => '',
                        'css'  => '',
                    ],
                ],
                200
            );
        }

        $html = '<div class="polymorphic-content polymorphic-preview">';

        foreach ( $data['components'] as $component ) {
            $html .= $this->registry->render( $component, 'preview' );
        }

        $html .= '</div>';

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => [
                    'html' => $html,
                    'css'  => '',
                ],
            ],
            200
        );
    }

    /**
     * Check if user can edit the specific post.
     *
     * @since 1.0.0
     *
     * @param WP_REST_Request $request Request object.
     * @return bool|WP_Error
     */
    public function can_edit_post( WP_REST_Request $request ) {
        $post_id = $request->get_param( 'id' );

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return new WP_Error(
                'polymorphic_forbidden',
                __( 'You do not have permission to edit this post.', 'polymorphic' ),
                [ 'status' => 403 ]
            );
        }

        return true;
    }

    /**
     * Check if user can edit posts.
     *
     * @since 1.0.0
     *
     * @return bool|WP_Error
     */
    public function can_edit_posts() {
        if ( ! current_user_can( 'edit_posts' ) ) {
            return new WP_Error(
                'polymorphic_forbidden',
                __( 'You do not have permission to access the builder.', 'polymorphic' ),
                [ 'status' => 403 ]
            );
        }

        return true;
    }

    /**
     * Get save endpoint arguments.
     *
     * @since 1.0.0
     *
     * @return array
     */
    private function get_save_args(): array {
        return [
            'data' => [
                'required'    => true,
                'type'        => 'object',
                'description' => __( 'Builder data object.', 'polymorphic' ),
                'properties'  => [
                    'components' => [
                        'type'  => 'array',
                        'items' => [
                            'type' => 'object',
                        ],
                    ],
                    'settings'   => [
                        'type' => 'object',
                    ],
                    'customCss'  => [
                        'type' => 'string',
                    ],
                ],
            ],
        ];
    }

    /**
     * Sanitize builder data.
     *
     * @since 1.0.0
     *
     * @param array $data Raw data.
     * @return array|WP_Error Sanitized data or error.
     */
    private function sanitize_builder_data( array $data ) {
        $sanitized = [
            'version'    => POLYMORPHIC_VERSION,
            'created'    => $data['created'] ?? '',
            'modified'   => '',
            'settings'   => $this->sanitize_settings( $data['settings'] ?? [] ),
            'components' => [],
            'customCss'  => $this->sanitize_custom_css( $data['customCss'] ?? '' ),
        ];

        // Sanitize components recursively.
        if ( ! empty( $data['components'] ) && is_array( $data['components'] ) ) {
            foreach ( $data['components'] as $component ) {
                $sanitized_component = $this->sanitize_component( $component );
                if ( $sanitized_component ) {
                    $sanitized['components'][] = $sanitized_component;
                }
            }
        }

        return $sanitized;
    }

    /**
     * Sanitize a single component.
     *
     * @since 1.0.0
     *
     * @param array $component Component data.
     * @return array|null Sanitized component or null if invalid.
     */
    private function sanitize_component( array $component ): ?array {
        if ( empty( $component['id'] ) || empty( $component['type'] ) ) {
            return null;
        }

        $sanitized = [
            'id'    => preg_replace( '/[^a-zA-Z0-9_-]/', '', $component['id'] ),
            'type'  => sanitize_key( $component['type'] ),
            'props' => [],
        ];

        // Sanitize props.
        if ( ! empty( $component['props'] ) && is_array( $component['props'] ) ) {
            foreach ( $component['props'] as $key => $value ) {
                $sanitized['props'][ sanitize_key( $key ) ] = $this->sanitize_prop_value( $value );
            }
        }

        // Sanitize responsive overrides.
        if ( ! empty( $component['responsive'] ) && is_array( $component['responsive'] ) ) {
            $sanitized['responsive'] = [];
            foreach ( $component['responsive'] as $breakpoint => $overrides ) {
                if ( in_array( $breakpoint, [ 'tablet', 'mobile' ], true ) && is_array( $overrides ) ) {
                    $sanitized['responsive'][ $breakpoint ] = [];
                    foreach ( $overrides as $key => $value ) {
                        $sanitized['responsive'][ $breakpoint ][ sanitize_key( $key ) ] = $this->sanitize_prop_value( $value );
                    }
                }
            }
        }

        // Sanitize children recursively.
        if ( ! empty( $component['children'] ) && is_array( $component['children'] ) ) {
            $sanitized['children'] = [];
            foreach ( $component['children'] as $child ) {
                $sanitized_child = $this->sanitize_component( $child );
                if ( $sanitized_child ) {
                    $sanitized['children'][] = $sanitized_child;
                }
            }
        }

        return $sanitized;
    }

    /**
     * Sanitize a property value.
     *
     * @since 1.0.0
     *
     * @param mixed $value Raw value.
     * @return mixed Sanitized value.
     */
    private function sanitize_prop_value( $value ) {
        if ( is_string( $value ) ) {
            // Allow basic HTML in content fields.
            return wp_kses_post( $value );
        }

        if ( is_array( $value ) ) {
            $sanitized = [];
            foreach ( $value as $key => $item ) {
                $sanitized[ sanitize_key( $key ) ] = $this->sanitize_prop_value( $item );
            }
            return $sanitized;
        }

        if ( is_bool( $value ) ) {
            return $value;
        }

        if ( is_numeric( $value ) ) {
            return $value;
        }

        return '';
    }

    /**
     * Sanitize page settings.
     *
     * @since 1.0.0
     *
     * @param array $settings Raw settings.
     * @return array Sanitized settings.
     */
    private function sanitize_settings( array $settings ): array {
        $defaults = $this->get_default_settings();

        return [
            'pageBackground' => sanitize_text_field( $settings['pageBackground'] ?? $defaults['pageBackground'] ),
            'contentWidth'   => sanitize_text_field( $settings['contentWidth'] ?? $defaults['contentWidth'] ),
            'bodyFont'       => sanitize_text_field( $settings['bodyFont'] ?? $defaults['bodyFont'] ),
            'headingFont'    => sanitize_text_field( $settings['headingFont'] ?? $defaults['headingFont'] ),
        ];
    }

    /**
     * Get default page settings.
     *
     * @since 1.0.0
     *
     * @return array
     */
    private function get_default_settings(): array {
        return [
            'pageBackground' => '#ffffff',
            'contentWidth'   => '1200px',
            'bodyFont'       => 'Inter, sans-serif',
            'headingFont'    => 'Inter, sans-serif',
        ];
    }

    /**
     * Sanitize custom CSS.
     *
     * @since 1.0.0
     *
     * @param string $css Raw CSS.
     * @return string Sanitized CSS.
     */
    private function sanitize_custom_css( string $css ): string {
        // Remove potential script injections.
        $css = preg_replace( '/expression\s*\(/i', '', $css );
        $css = preg_replace( '/javascript\s*:/i', '', $css );
        $css = preg_replace( '/@import/i', '', $css );

        return wp_strip_all_tags( $css );
    }
}
