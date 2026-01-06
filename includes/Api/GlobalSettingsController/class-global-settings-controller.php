<?php
/**
 * Global Settings REST API Controller.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Api;

use Polymorphic\Settings\Global_Settings;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * REST API endpoints for global settings.
 *
 * @since 1.0.0
 */
class Global_Settings_Controller extends WP_REST_Controller {

    /**
     * REST namespace.
     *
     * @var string
     */
    protected $namespace = 'polymorphic/v1';

    /**
     * Settings instance.
     *
     * @var Global_Settings
     */
    private Global_Settings $settings;

    /**
     * Constructor.
     *
     * @since 1.0.0
     */
    public function __construct() {
        $this->settings = Global_Settings::get_instance();
    }

    /**
     * Register REST routes.
     *
     * @since 1.0.0
     */
    public function register_routes(): void {
        // Get all settings.
        register_rest_route(
            $this->namespace,
            '/settings',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_settings' ],
                    'permission_callback' => [ $this, 'can_manage_settings' ],
                ],
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'update_settings' ],
                    'permission_callback' => [ $this, 'can_manage_settings' ],
                    'args'                => $this->get_update_args(),
                ],
            ]
        );

        // Get/update specific group.
        register_rest_route(
            $this->namespace,
            '/settings/(?P<group>[a-z]+)',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_group' ],
                    'permission_callback' => [ $this, 'can_manage_settings' ],
                ],
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'update_group' ],
                    'permission_callback' => [ $this, 'can_manage_settings' ],
                ],
            ]
        );

        // Reset settings.
        register_rest_route(
            $this->namespace,
            '/settings/reset',
            [
                'methods'             => 'POST',
                'callback'            => [ $this, 'reset_settings' ],
                'permission_callback' => [ $this, 'can_manage_settings' ],
            ]
        );

        // Export settings.
        register_rest_route(
            $this->namespace,
            '/settings/export',
            [
                'methods'             => 'GET',
                'callback'            => [ $this, 'export_settings' ],
                'permission_callback' => [ $this, 'can_manage_settings' ],
            ]
        );

        // Import settings.
        register_rest_route(
            $this->namespace,
            '/settings/import',
            [
                'methods'             => 'POST',
                'callback'            => [ $this, 'import_settings' ],
                'permission_callback' => [ $this, 'can_manage_settings' ],
                'args'                => [
                    'settings' => [
                        'required'    => true,
                        'type'        => 'object',
                        'description' => __( 'Settings object to import.', 'polymorphic' ),
                    ],
                ],
            ]
        );

        // Get defaults.
        register_rest_route(
            $this->namespace,
            '/settings/defaults',
            [
                'methods'             => 'GET',
                'callback'            => [ $this, 'get_defaults' ],
                'permission_callback' => [ $this, 'can_manage_settings' ],
            ]
        );

        // Get generated CSS.
        register_rest_route(
            $this->namespace,
            '/settings/css',
            [
                'methods'             => 'GET',
                'callback'            => [ $this, 'get_css' ],
                'permission_callback' => '__return_true', // Public for frontend.
            ]
        );
    }

    /**
     * Get all settings.
     *
     * @since 1.0.0
     *
     * @return WP_REST_Response
     */
    public function get_settings(): WP_REST_Response {
        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $this->settings->get_all(),
            ],
            200
        );
    }

    /**
     * Update all settings.
     *
     * @since 1.0.0
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function update_settings( WP_REST_Request $request ) {
        $settings = $request->get_param( 'settings' );

        if ( empty( $settings ) || ! is_array( $settings ) ) {
            return new WP_Error(
                'polymorphic_invalid_settings',
                __( 'Invalid settings data.', 'polymorphic' ),
                [ 'status' => 400 ]
            );
        }

        $result = $this->settings->update_all( $settings );

        if ( ! $result ) {
            return new WP_Error(
                'polymorphic_update_failed',
                __( 'Failed to update settings.', 'polymorphic' ),
                [ 'status' => 500 ]
            );
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $this->settings->get_all(),
                'message' => __( 'Settings updated successfully.', 'polymorphic' ),
            ],
            200
        );
    }

    /**
     * Get a specific settings group.
     *
     * @since 1.0.0
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function get_group( WP_REST_Request $request ) {
        $group = $request->get_param( 'group' );
        $valid_groups = [ 'layout', 'typography', 'colors', 'buttons', 'breakpoints' ];

        if ( ! in_array( $group, $valid_groups, true ) ) {
            return new WP_Error(
                'polymorphic_invalid_group',
                __( 'Invalid settings group.', 'polymorphic' ),
                [ 'status' => 404 ]
            );
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $this->settings->get_group( $group ),
            ],
            200
        );
    }

    /**
     * Update a specific settings group.
     *
     * @since 1.0.0
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function update_group( WP_REST_Request $request ) {
        $group = $request->get_param( 'group' );
        $settings = $request->get_json_params();

        $valid_groups = [ 'layout', 'typography', 'colors', 'buttons', 'breakpoints' ];

        if ( ! in_array( $group, $valid_groups, true ) ) {
            return new WP_Error(
                'polymorphic_invalid_group',
                __( 'Invalid settings group.', 'polymorphic' ),
                [ 'status' => 404 ]
            );
        }

        $result = $this->settings->update_group( $group, $settings );

        if ( ! $result ) {
            return new WP_Error(
                'polymorphic_update_failed',
                __( 'Failed to update settings.', 'polymorphic' ),
                [ 'status' => 500 ]
            );
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $this->settings->get_group( $group ),
                'message' => __( 'Settings updated successfully.', 'polymorphic' ),
            ],
            200
        );
    }

    /**
     * Reset settings to defaults.
     *
     * @since 1.0.0
     *
     * @return WP_REST_Response
     */
    public function reset_settings(): WP_REST_Response {
        $this->settings->reset();

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $this->settings->get_all(),
                'message' => __( 'Settings reset to defaults.', 'polymorphic' ),
            ],
            200
        );
    }

    /**
     * Export settings as JSON.
     *
     * @since 1.0.0
     *
     * @return WP_REST_Response
     */
    public function export_settings(): WP_REST_Response {
        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $this->settings->get_all(),
                'json'    => $this->settings->export(),
            ],
            200
        );
    }

    /**
     * Import settings from JSON.
     *
     * @since 1.0.0
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function import_settings( WP_REST_Request $request ) {
        $settings = $request->get_param( 'settings' );

        if ( empty( $settings ) ) {
            return new WP_Error(
                'polymorphic_invalid_import',
                __( 'No settings data provided.', 'polymorphic' ),
                [ 'status' => 400 ]
            );
        }

        // If it's a string (JSON), decode it.
        if ( is_string( $settings ) ) {
            $result = $this->settings->import( $settings );
        } else {
            $result = $this->settings->update_all( $settings );
        }

        if ( ! $result ) {
            return new WP_Error(
                'polymorphic_import_failed',
                __( 'Failed to import settings.', 'polymorphic' ),
                [ 'status' => 500 ]
            );
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $this->settings->get_all(),
                'message' => __( 'Settings imported successfully.', 'polymorphic' ),
            ],
            200
        );
    }

    /**
     * Get default settings.
     *
     * @since 1.0.0
     *
     * @return WP_REST_Response
     */
    public function get_defaults(): WP_REST_Response {
        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => $this->settings->get_defaults(),
            ],
            200
        );
    }

    /**
     * Get generated CSS variables.
     *
     * @since 1.0.0
     *
     * @return WP_REST_Response
     */
    public function get_css(): WP_REST_Response {
        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => [
                    'css' => $this->settings->generate_css_variables(),
                ],
            ],
            200
        );
    }

    /**
     * Check if user can manage settings.
     *
     * @since 1.0.0
     *
     * @return bool|WP_Error
     */
    public function can_manage_settings() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return new WP_Error(
                'polymorphic_forbidden',
                __( 'You do not have permission to manage settings.', 'polymorphic' ),
                [ 'status' => 403 ]
            );
        }

        return true;
    }

    /**
     * Get update endpoint arguments.
     *
     * @since 1.0.0
     *
     * @return array
     */
    private function get_update_args(): array {
        return [
            'settings' => [
                'required'    => true,
                'type'        => 'object',
                'description' => __( 'Settings object.', 'polymorphic' ),
            ],
        ];
    }
}

