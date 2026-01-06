<?php
/**
 * Global Blocks REST Controller.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Api;

use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * REST API endpoints for global reusable blocks.
 *
 * @since 1.0.0
 */
class Global_Blocks_Controller extends WP_REST_Controller {

    /**
     * REST namespace.
     *
     * @var string
     */
    protected $namespace = 'polymorphic/v1';

    /**
     * Option name for storing global blocks.
     *
     * @var string
     */
    private string $option_name = 'polymorphic_global_blocks';

    /**
     * Register REST routes.
     *
     * @since 1.0.0
     */
    public function register_routes(): void {
        // List all / Create new
        register_rest_route(
            $this->namespace,
            '/global-blocks',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_items' ],
                    'permission_callback' => [ $this, 'can_edit_posts' ],
                ],
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'create_item' ],
                    'permission_callback' => [ $this, 'can_edit_posts' ],
                    'args'                => [
                        'name'      => [ 'required' => true, 'type' => 'string' ],
                        'component' => [ 'required' => true, 'type' => 'object' ],
                    ],
                ],
            ]
        );

        // Get / Update / Delete single
        register_rest_route(
            $this->namespace,
            '/global-blocks/(?P<id>\d+)',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_item' ],
                    'permission_callback' => [ $this, 'can_edit_posts' ],
                ],
                [
                    'methods'             => 'PUT',
                    'callback'            => [ $this, 'update_item' ],
                    'permission_callback' => [ $this, 'can_edit_posts' ],
                ],
                [
                    'methods'             => 'DELETE',
                    'callback'            => [ $this, 'delete_item' ],
                    'permission_callback' => [ $this, 'can_edit_posts' ],
                ],
            ]
        );
    }

    /**
     * Get all global blocks.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response
     */
    public function get_items( $request ): WP_REST_Response {
        $blocks = $this->get_blocks();

        return new WP_REST_Response(
            [
                'success' => true,
                'data'    => array_values( $blocks ),
            ],
            200
        );
    }

    /**
     * Get a single global block.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function get_item( $request ) {
        $id     = (int) $request->get_param( 'id' );
        $blocks = $this->get_blocks();

        if ( ! isset( $blocks[ $id ] ) ) {
            return new WP_Error( 'not_found', __( 'Global block not found.', 'polymorphic' ), [ 'status' => 404 ] );
        }

        return new WP_REST_Response( [ 'success' => true, 'data' => $blocks[ $id ] ], 200 );
    }

    /**
     * Create a global block.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response
     */
    public function create_item( $request ): WP_REST_Response {
        $name      = sanitize_text_field( $request->get_param( 'name' ) );
        $component = $request->get_param( 'component' );

        $blocks = $this->get_blocks();
        $id     = time();

        $blocks[ $id ] = [
            'id'         => $id,
            'name'       => $name,
            'component'  => $component,
            'created'    => current_time( 'mysql' ),
            'modified'   => current_time( 'mysql' ),
            'usageCount' => 0,
        ];

        $this->save_blocks( $blocks );

        return new WP_REST_Response( [ 'success' => true, 'data' => $blocks[ $id ] ], 201 );
    }

    /**
     * Update a global block.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function update_item( $request ) {
        $id     = (int) $request->get_param( 'id' );
        $blocks = $this->get_blocks();

        if ( ! isset( $blocks[ $id ] ) ) {
            return new WP_Error( 'not_found', __( 'Global block not found.', 'polymorphic' ), [ 'status' => 404 ] );
        }

        $component = $request->get_param( 'component' );
        if ( $component ) {
            $blocks[ $id ]['component'] = $component;
        }

        $name = $request->get_param( 'name' );
        if ( $name ) {
            $blocks[ $id ]['name'] = sanitize_text_field( $name );
        }

        $blocks[ $id ]['modified'] = current_time( 'mysql' );

        $this->save_blocks( $blocks );

        return new WP_REST_Response( [ 'success' => true, 'data' => $blocks[ $id ] ], 200 );
    }

    /**
     * Delete a global block.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response|WP_Error
     */
    public function delete_item( $request ) {
        $id     = (int) $request->get_param( 'id' );
        $blocks = $this->get_blocks();

        if ( ! isset( $blocks[ $id ] ) ) {
            return new WP_Error( 'not_found', __( 'Global block not found.', 'polymorphic' ), [ 'status' => 404 ] );
        }

        unset( $blocks[ $id ] );
        $this->save_blocks( $blocks );

        return new WP_REST_Response( [ 'success' => true, 'data' => null ], 200 );
    }

    /**
     * Check if user can edit posts.
     *
     * @return bool|WP_Error
     */
    public function can_edit_posts() {
        if ( ! current_user_can( 'edit_posts' ) ) {
            return new WP_Error( 'forbidden', __( 'Permission denied.', 'polymorphic' ), [ 'status' => 403 ] );
        }
        return true;
    }

    /**
     * Get all blocks from storage.
     *
     * @return array
     */
    private function get_blocks(): array {
        $blocks = get_option( $this->option_name, [] );
        return is_array( $blocks ) ? $blocks : [];
    }

    /**
     * Save blocks to storage.
     *
     * @param array $blocks Blocks to save.
     */
    private function save_blocks( array $blocks ): void {
        update_option( $this->option_name, $blocks );
    }
}
