<?php
/**
 * Component Registry REST Controller.
 *
 * Provides REST API endpoints for component operations.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Api;

use Polymorphic\Components\Component_Registry;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

/**
 * Component Registry Controller class.
 *
 * @since 1.0.0
 */
class Component_Registry_Controller extends WP_REST_Controller {

    /**
     * Namespace for the REST API.
     *
     * @var string
     */
    protected $namespace = 'polymorphic/v1';

    /**
     * Resource name.
     *
     * @var string
     */
    protected $rest_base = 'components';

    /**
     * Component registry instance.
     *
     * @var Component_Registry
     */
    private Component_Registry $registry;

    /**
     * Constructor.
     *
     * @param Component_Registry $registry Component registry instance.
     */
    public function __construct( Component_Registry $registry ) {
        $this->registry = $registry;
    }

    /**
     * Register routes.
     *
     * @since 1.0.0
     */
    public function register_routes(): void {
        // GET /components - List all available components.
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_items' ],
                    'permission_callback' => [ $this, 'get_items_permissions_check' ],
                    'args'                => $this->get_collection_params(),
                ],
                'schema' => [ $this, 'get_public_item_schema' ],
            ]
        );

        // GET /components/{type} - Get a specific component.
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/(?P<type>[a-zA-Z0-9_\-\/]+)',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_item' ],
                    'permission_callback' => [ $this, 'get_item_permissions_check' ],
                    'args'                => [
                        'type' => [
                            'description' => __( 'Component type identifier.', 'polymorphic' ),
                            'type'        => 'string',
                            'required'    => true,
                        ],
                    ],
                ],
            ]
        );

        // POST /components/render - Render a component (for preview).
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/render',
            [
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'render_component' ],
                    'permission_callback' => [ $this, 'render_permissions_check' ],
                    'args'                => [
                        'type' => [
                            'description' => __( 'Component type identifier.', 'polymorphic' ),
                            'type'        => 'string',
                            'required'    => true,
                        ],
                        'props' => [
                            'description' => __( 'Component properties.', 'polymorphic' ),
                            'type'        => 'object',
                            'default'     => [],
                        ],
                        'context' => [
                            'description' => __( 'Render context.', 'polymorphic' ),
                            'type'        => 'string',
                            'enum'        => [ 'editor', 'frontend' ],
                            'default'     => 'editor',
                        ],
                    ],
                ],
            ]
        );
    }

    /**
     * Check if a given request has access to get items.
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return bool|WP_Error
     */
    public function get_items_permissions_check( $request ) {
        // Allow any authenticated user who can edit posts.
        return current_user_can( 'edit_posts' );
    }

    /**
     * Check if a given request has access to get a single item.
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return bool|WP_Error
     */
    public function get_item_permissions_check( $request ) {
        return $this->get_items_permissions_check( $request );
    }

    /**
     * Check if a given request has access to render a component.
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return bool|WP_Error
     */
    public function render_permissions_check( $request ) {
        return current_user_can( 'edit_posts' );
    }

    /**
     * Get all available components.
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_REST_Response|WP_Error
     */
    public function get_items( $request ) {
        $components = $this->registry->to_api_response();

        // Filter by category if specified.
        $category = $request->get_param( 'category' );
        if ( $category ) {
            $components = array_filter(
                $components,
                fn( $c ) => $c['category'] === $category
            );
            $components = array_values( $components );
        }

        // Filter by source if specified.
        $source = $request->get_param( 'source' );
        if ( $source ) {
            $components = array_filter(
                $components,
                fn( $c ) => $c['source'] === $source
            );
            $components = array_values( $components );
        }

        return rest_ensure_response( [
            'components' => $components,
        ] );
    }

    /**
     * Get a single component.
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_REST_Response|WP_Error
     */
    public function get_item( $request ) {
        $type = $request->get_param( 'type' );

        // Check core components first.
        if ( $this->registry->has( $type ) ) {
            $component = $this->registry->get( $type );
            if ( $component ) {
                return rest_ensure_response( [
                    'type'         => $type,
                    'label'        => $component->get_label(),
                    'icon'         => $component->get_icon(),
                    'category'     => $component->get_category(),
                    'source'       => 'core',
                    'supports'     => [],
                    'defaultProps' => $component->get_defaults(),
                    'assets'       => [
                        'css' => [ 'inline' => null, 'url' => null ],
                        'js'  => [ 'editor' => null, 'frontend' => null ],
                    ],
                ] );
            }
        }

        // Check third-party components.
        $third_party = $this->registry->get_third_party( $type );
        if ( $third_party ) {
            return rest_ensure_response( [
                'type'         => $type,
                'label'        => $third_party['label'],
                'icon'         => $third_party['icon'],
                'category'     => $third_party['category'],
                'source'       => $third_party['source'],
                'supports'     => $third_party['supports'],
                'defaultProps' => $third_party['default_props'],
                'assets'       => $third_party['assets'],
            ] );
        }

        return new WP_Error(
            'rest_component_not_found',
            __( 'Component not found.', 'polymorphic' ),
            [ 'status' => 404 ]
        );
    }

    /**
     * Render a component.
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_REST_Response|WP_Error
     */
    public function render_component( $request ) {
        $type    = $request->get_param( 'type' );
        $props   = $request->get_param( 'props' );
        $context = $request->get_param( 'context' );

        $component_data = [
            'id'    => 'preview-' . uniqid(),
            'type'  => $type,
            'props' => $props,
        ];

        // Try third-party render first.
        $html = $this->registry->render_third_party( $component_data, $context );

        // Fall back to core component.
        if ( $html === null ) {
            $html = $this->registry->render( $component_data, $context );
        }

        if ( empty( $html ) ) {
            return new WP_Error(
                'rest_component_render_failed',
                __( 'Failed to render component.', 'polymorphic' ),
                [ 'status' => 500 ]
            );
        }

        // Get inline CSS for third-party component.
        $css = '';
        $third_party = $this->registry->get_third_party( $type );
        if ( $third_party && ! empty( $third_party['assets']['css']['inline'] ) ) {
            $css = $third_party['assets']['css']['inline'];
        }

        return rest_ensure_response( [
            'html' => $html,
            'css'  => $css,
        ] );
    }

    /**
     * Get collection parameters.
     *
     * @return array
     */
    public function get_collection_params(): array {
        return [
            'category' => [
                'description' => __( 'Filter by category.', 'polymorphic' ),
                'type'        => 'string',
            ],
            'source' => [
                'description' => __( 'Filter by source (core, third-party, plugin slug).', 'polymorphic' ),
                'type'        => 'string',
            ],
        ];
    }

    /**
     * Get item schema.
     *
     * @return array
     */
    public function get_public_item_schema(): array {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'component',
            'type'       => 'object',
            'properties' => [
                'type' => [
                    'description' => __( 'Component type identifier.', 'polymorphic' ),
                    'type'        => 'string',
                    'readonly'    => true,
                ],
                'label' => [
                    'description' => __( 'Human-readable component label.', 'polymorphic' ),
                    'type'        => 'string',
                    'readonly'    => true,
                ],
                'icon' => [
                    'description' => __( 'Icon identifier.', 'polymorphic' ),
                    'type'        => 'string',
                    'readonly'    => true,
                ],
                'category' => [
                    'description' => __( 'Component category.', 'polymorphic' ),
                    'type'        => 'string',
                    'readonly'    => true,
                ],
                'source' => [
                    'description' => __( 'Component source (core or plugin slug).', 'polymorphic' ),
                    'type'        => 'string',
                    'readonly'    => true,
                ],
                'supports' => [
                    'description' => __( 'Supported features.', 'polymorphic' ),
                    'type'        => 'array',
                    'items'       => [ 'type' => 'string' ],
                    'readonly'    => true,
                ],
                'defaultProps' => [
                    'description' => __( 'Default component properties.', 'polymorphic' ),
                    'type'        => 'object',
                    'readonly'    => true,
                ],
                'assets' => [
                    'description' => __( 'Component CSS and JS assets.', 'polymorphic' ),
                    'type'        => 'object',
                    'readonly'    => true,
                ],
            ],
        ];
    }
}
