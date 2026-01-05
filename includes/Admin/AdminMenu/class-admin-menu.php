<?php
/**
 * Admin Menu handler.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Admin;

/**
 * Registers admin menu items and pages.
 *
 * @since 1.0.0
 */
class Admin_Menu {

    /**
     * Initialize the admin menu.
     *
     * @since 1.0.0
     */
    public function init(): void {
        add_action( 'admin_menu', [ $this, 'register_menus' ] );
        add_action( 'admin_init', [ $this, 'handle_builder_redirect' ] );
    }

    /**
     * Register admin menu items.
     *
     * @since 1.0.0
     */
    public function register_menus(): void {
        // Main menu page.
        add_menu_page(
            __( 'Polymorphic', 'polymorphic' ),
            __( 'Polymorphic', 'polymorphic' ),
            'edit_posts',
            'polymorphic',
            [ $this, 'render_dashboard_page' ],
            $this->get_menu_icon(),
            30
        );

        // Dashboard submenu.
        add_submenu_page(
            'polymorphic',
            __( 'Dashboard', 'polymorphic' ),
            __( 'Dashboard', 'polymorphic' ),
            'edit_posts',
            'polymorphic',
            [ $this, 'render_dashboard_page' ]
        );

        // Settings submenu.
        add_submenu_page(
            'polymorphic',
            __( 'Settings', 'polymorphic' ),
            __( 'Settings', 'polymorphic' ),
            'manage_options',
            'polymorphic-settings',
            [ $this, 'render_settings_page' ]
        );
    }

    /**
     * Get the menu icon SVG.
     *
     * @since 1.0.0
     *
     * @return string Base64 encoded SVG icon.
     */
    private function get_menu_icon(): string {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5"/><path d="M12 12v9"/><path d="M12 12L4 7.5"/></svg>';

        return 'data:image/svg+xml;base64,' . base64_encode( $svg );
    }

    /**
     * Render the dashboard page.
     *
     * @since 1.0.0
     */
    public function render_dashboard_page(): void {
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Polymorphic', 'polymorphic' ); ?></h1>
            <p><?php esc_html_e( 'Welcome to Polymorphic - the lightweight page builder.', 'polymorphic' ); ?></p>
            
            <div class="polymorphic-dashboard">
                <h2><?php esc_html_e( 'Quick Actions', 'polymorphic' ); ?></h2>
                <p>
                    <a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=page' ) ); ?>" class="button button-primary">
                        <?php esc_html_e( 'Create New Page', 'polymorphic' ); ?>
                    </a>
                    <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>" class="button">
                        <?php esc_html_e( 'View All Pages', 'polymorphic' ); ?>
                    </a>
                </p>
            </div>
        </div>
        <?php
    }

    /**
     * Render the settings page.
     *
     * @since 1.0.0
     */
    public function render_settings_page(): void {
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Polymorphic Settings', 'polymorphic' ); ?></h1>
            <p><?php esc_html_e( 'Configure your Polymorphic page builder settings.', 'polymorphic' ); ?></p>
            <!-- Settings form will go here -->
        </div>
        <?php
    }

    /**
     * Handle redirect to builder page.
     *
     * @since 1.0.0
     */
    public function handle_builder_redirect(): void {
        // Check if accessing builder.
        if ( isset( $_GET['page'] ) && 'polymorphic-builder' === $_GET['page'] ) {
            $post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : 0;

            if ( $post_id && current_user_can( 'edit_post', $post_id ) ) {
                // Load the builder page.
                $this->render_builder_page( $post_id );
                exit;
            }
        }
    }

    /**
     * Render the full-screen builder page.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID to edit.
     */
    private function render_builder_page( int $post_id ): void {
        include POLYMORPHIC_PATH . 'templates/builder-page.php';
    }
}
