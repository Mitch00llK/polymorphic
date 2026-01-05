<?php
/**
 * Admin Assets handler.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Admin;

/**
 * Registers and enqueues admin scripts and styles.
 *
 * @since 1.0.0
 */
class Assets {

    /**
     * Initialize the assets handler.
     *
     * @since 1.0.0
     */
    public function init(): void {
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_builder_assets' ] );
        add_filter( 'script_loader_tag', [ $this, 'add_module_attribute' ], 10, 3 );
    }

    /**
     * Enqueue general admin assets.
     *
     * @since 1.0.0
     *
     * @param string $hook_suffix Current admin page hook.
     */
    public function enqueue_admin_assets( string $hook_suffix ): void {
        // Only on Polymorphic pages.
        if ( strpos( $hook_suffix, 'polymorphic' ) === false ) {
            return;
        }

        wp_enqueue_style(
            'polymorphic-admin',
            POLYMORPHIC_URL . 'assets/admin/admin.css',
            [],
            POLYMORPHIC_VERSION
        );
    }

    /**
     * Enqueue builder-specific assets.
     *
     * @since 1.0.0
     *
     * @param string $hook_suffix Current admin page hook.
     */
    public function enqueue_builder_assets( string $hook_suffix ): void {
        // Check if we're on the builder page.
        if ( ! $this->is_builder_page() ) {
            return;
        }

        $asset_file = POLYMORPHIC_PATH . 'assets/admin/builder.asset.php';
        $asset      = file_exists( $asset_file ) 
            ? require $asset_file 
            : [ 'dependencies' => [], 'version' => POLYMORPHIC_VERSION ];

        // Enqueue builder script.
        wp_enqueue_script(
            'polymorphic-builder',
            POLYMORPHIC_URL . 'assets/admin/builder.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        // Enqueue builder styles.
        wp_enqueue_style(
            'polymorphic-builder',
            POLYMORPHIC_URL . 'assets/admin/builder.css',
            [ 'wp-components' ],
            $asset['version']
        );

        // Localize script with settings.
        wp_localize_script( 'polymorphic-builder', 'polymorphicSettings', [
            'nonce'     => wp_create_nonce( 'wp_rest' ),
            'postId'    => $this->get_current_post_id(),
            'apiBase'   => rest_url( 'polymorphic/v1/' ),
            'isNewPost' => $this->is_new_post(),
            'siteUrl'   => get_site_url(),
            'adminUrl'  => admin_url(),
        ]);
    }

    /**
     * Check if current page is the builder.
     *
     * @since 1.0.0
     *
     * @return bool
     */
    private function is_builder_page(): bool {
        // Check for builder page parameter.
        if ( isset( $_GET['page'] ) && 'polymorphic-builder' === $_GET['page'] ) {
            return true;
        }

        // Check for post editor with builder enabled.
        global $pagenow;
        if ( in_array( $pagenow, [ 'post.php', 'post-new.php' ], true ) ) {
            // Could add meta box builder trigger here.
            return false;
        }

        return false;
    }

    /**
     * Get current post ID.
     *
     * @since 1.0.0
     *
     * @return int
     */
    private function get_current_post_id(): int {
        return isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : 0;
    }

    /**
     * Check if this is a new post.
     *
     * @since 1.0.0
     *
     * @return bool
     */
    private function is_new_post(): bool {
        $post_id = $this->get_current_post_id();
        if ( ! $post_id ) {
            return true;
        }

        $data = get_post_meta( $post_id, '_polymorphic_data', true );
        return empty( $data );
    }

    /**
     * Add type="module" to builder script for ES modules support.
     *
     * @since 1.0.0
     *
     * @param string $tag    Script tag.
     * @param string $handle Script handle.
     * @param string $src    Script source.
     * @return string Modified script tag.
     */
    public function add_module_attribute( string $tag, string $handle, string $src ): string {
        if ( 'polymorphic-builder' === $handle ) {
            $tag = str_replace( '<script ', '<script type="module" ', $tag );
        }
        return $tag;
    }
}
