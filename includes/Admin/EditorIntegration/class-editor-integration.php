<?php
/**
 * Editor Integration handler.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Admin;

/**
 * Integrates the builder with the WordPress post editor.
 *
 * @since 1.0.0
 */
class Editor_Integration {

    /**
     * Supported post types.
     *
     * @var array
     */
    private array $post_types = [ 'page', 'post' ];

    /**
     * Initialize the editor integration.
     *
     * @since 1.0.0
     */
    public function init(): void {
        // Get supported post types from settings.
        $this->post_types = $this->get_supported_post_types();

        // Add meta box.
        add_action( 'add_meta_boxes', [ $this, 'register_meta_box' ] );

        // Handle builder redirect.
        add_action( 'admin_init', [ $this, 'maybe_redirect_to_builder' ] );

        // Add admin bar link.
        add_action( 'admin_bar_menu', [ $this, 'add_admin_bar_link' ], 100 );

        // Enqueue editor styles.
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_editor_styles' ] );

        // Save post meta.
        add_action( 'save_post', [ $this, 'save_post_meta' ], 10, 2 );

        // Add row action to posts list.
        add_filter( 'page_row_actions', [ $this, 'add_row_action' ], 10, 2 );
        add_filter( 'post_row_actions', [ $this, 'add_row_action' ], 10, 2 );
    }

    /**
     * Get supported post types.
     *
     * @since 1.0.0
     *
     * @return array
     */
    private function get_supported_post_types(): array {
        $settings = get_option( 'polymorphic_settings', [] );
        $defaults = [ 'page', 'post' ];

        /**
         * Filter supported post types.
         *
         * @since 1.0.0
         *
         * @param array $post_types Supported post types.
         */
        return apply_filters(
            'polymorphic/settings/post_types',
            $settings['enabled_post_types'] ?? $defaults
        );
    }

    /**
     * Register the meta box.
     *
     * @since 1.0.0
     */
    public function register_meta_box(): void {
        foreach ( $this->post_types as $post_type ) {
            add_meta_box(
                'polymorphic-builder',
                __( 'Polymorphic Builder', 'polymorphic' ),
                [ $this, 'render_meta_box' ],
                $post_type,
                'side',
                'high'
            );
        }
    }

    /**
     * Render the meta box content.
     *
     * @since 1.0.0
     *
     * @param \WP_Post $post Current post.
     */
    public function render_meta_box( \WP_Post $post ): void {
        $is_enabled = (bool) get_post_meta( $post->ID, '_polymorphic_enabled', true );
        $builder_url = $this->get_builder_url( $post->ID );

        wp_nonce_field( 'polymorphic_meta_box', 'polymorphic_meta_box_nonce' );
        ?>
        <div class="polymorphic-meta-box">
            <p class="polymorphic-meta-box__description">
                <?php esc_html_e( 'Use Polymorphic to design this page with a visual drag-and-drop builder.', 'polymorphic' ); ?>
            </p>

            <p>
                <a href="<?php echo esc_url( $builder_url ); ?>" class="button button-primary button-large polymorphic-edit-button">
                    <?php if ( $is_enabled ) : ?>
                        <span class="dashicons dashicons-edit" style="margin-top: 4px;"></span>
                        <?php esc_html_e( 'Edit with Polymorphic', 'polymorphic' ); ?>
                    <?php else : ?>
                        <span class="dashicons dashicons-plus-alt" style="margin-top: 4px;"></span>
                        <?php esc_html_e( 'Start with Polymorphic', 'polymorphic' ); ?>
                    <?php endif; ?>
                </a>
            </p>

            <?php if ( $is_enabled ) : ?>
                <p class="polymorphic-meta-box__status polymorphic-meta-box__status--enabled">
                    <span class="dashicons dashicons-yes-alt"></span>
                    <?php esc_html_e( 'This page is using Polymorphic', 'polymorphic' ); ?>
                </p>
            <?php endif; ?>

            <p class="polymorphic-meta-box__toggle">
                <label>
                    <input type="checkbox" 
                           name="polymorphic_enabled" 
                           value="1" 
                           <?php checked( $is_enabled ); ?>>
                    <?php esc_html_e( 'Enable Polymorphic for this page', 'polymorphic' ); ?>
                </label>
            </p>
        </div>

        <style>
            .polymorphic-meta-box__description {
                color: #666;
                margin-bottom: 12px;
            }
            .polymorphic-edit-button {
                display: flex !important;
                align-items: center;
                justify-content: center;
                gap: 6px;
                width: 100%;
                height: auto !important;
                padding: 10px 16px !important;
                font-size: 14px !important;
                background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
                border-color: #6366f1 !important;
                box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3) !important;
            }
            .polymorphic-edit-button:hover {
                background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
                border-color: #4f46e5 !important;
            }
            .polymorphic-meta-box__status {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                margin: 12px 0;
            }
            .polymorphic-meta-box__status--enabled {
                background: #e7f7e7;
                color: #1e7e1e;
            }
            .polymorphic-meta-box__toggle {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #eee;
            }
        </style>
        <?php
    }

    /**
     * Get the builder URL for a post.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID.
     * @return string Builder URL.
     */
    public function get_builder_url( int $post_id ): string {
        return add_query_arg(
            [
                'page'    => 'polymorphic-builder',
                'post_id' => $post_id,
            ],
            admin_url( 'admin.php' )
        );
    }

    /**
     * Get the editor URL for a post.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID.
     * @return string Editor URL.
     */
    public function get_editor_url( int $post_id ): string {
        return get_edit_post_link( $post_id, 'raw' );
    }

    /**
     * Handle redirect to builder.
     *
     * @since 1.0.0
     */
    public function maybe_redirect_to_builder(): void {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if ( ! isset( $_GET['page'] ) || 'polymorphic-builder' !== $_GET['page'] ) {
            return;
        }

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : 0;

        if ( ! $post_id ) {
            wp_die( esc_html__( 'No post ID provided.', 'polymorphic' ) );
        }

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            wp_die( esc_html__( 'You do not have permission to edit this post.', 'polymorphic' ) );
        }

        // Mark as enabled when entering builder.
        update_post_meta( $post_id, '_polymorphic_enabled', true );

        // Load the builder template.
        $this->render_builder( $post_id );
        exit;
    }

    /**
     * Render the full-screen builder.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID.
     */
    private function render_builder( int $post_id ): void {
        // Enqueue builder assets.
        $this->enqueue_builder_assets( $post_id );

        // Get post for title.
        $post = get_post( $post_id );

        include POLYMORPHIC_PATH . 'templates/builder-page.php';
    }

    /**
     * Enqueue builder assets.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID.
     */
    private function enqueue_builder_assets( int $post_id ): void {
        $asset_file = POLYMORPHIC_PATH . 'assets/admin/builder.asset.php';
        $asset      = file_exists( $asset_file )
            ? require $asset_file
            : [ 'dependencies' => [ 'wp-element', 'wp-api-fetch' ], 'version' => POLYMORPHIC_VERSION ];

        wp_enqueue_script(
            'polymorphic-builder',
            POLYMORPHIC_URL . 'assets/admin/builder.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        wp_enqueue_style(
            'polymorphic-builder',
            POLYMORPHIC_URL . 'assets/admin/builder.css',
            [],
            $asset['version']
        );

        wp_localize_script( 'polymorphic-builder', 'polymorphicSettings', [
            'nonce'      => wp_create_nonce( 'wp_rest' ),
            'postId'     => $post_id,
            'postTitle'  => get_the_title( $post_id ),
            'apiBase'    => rest_url( 'polymorphic/v1/' ),
            'isNewPost'  => empty( get_post_meta( $post_id, '_polymorphic_data', true ) ),
            'siteUrl'    => get_site_url(),
            'adminUrl'   => admin_url(),
            'editorUrl'  => $this->get_editor_url( $post_id ),
            'previewUrl' => get_preview_post_link( $post_id ),
        ]);
    }

    /**
     * Enqueue editor styles on post edit screens.
     *
     * @since 1.0.0
     *
     * @param string $hook_suffix Admin page hook.
     */
    public function enqueue_editor_styles( string $hook_suffix ): void {
        if ( ! in_array( $hook_suffix, [ 'post.php', 'post-new.php' ], true ) ) {
            return;
        }

        // Simple inline styles for meta box.
        wp_add_inline_style( 'wp-admin', '
            #polymorphic-builder .inside {
                padding: 0;
                margin: 0;
            }
            .polymorphic-meta-box {
                padding: 12px;
            }
        ' );
    }

    /**
     * Save post meta from meta box.
     *
     * @since 1.0.0
     *
     * @param int      $post_id Post ID.
     * @param \WP_Post $post    Post object.
     */
    public function save_post_meta( int $post_id, \WP_Post $post ): void {
        // Verify nonce.
        if ( ! isset( $_POST['polymorphic_meta_box_nonce'] ) ) {
            return;
        }

        if ( ! wp_verify_nonce( $_POST['polymorphic_meta_box_nonce'], 'polymorphic_meta_box' ) ) {
            return;
        }

        // Check autosave.
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        // Check permissions.
        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        // Save enabled state.
        $enabled = isset( $_POST['polymorphic_enabled'] ) ? 1 : 0;
        update_post_meta( $post_id, '_polymorphic_enabled', $enabled );
    }

    /**
     * Add admin bar link when viewing a polymorphic page.
     *
     * @since 1.0.0
     *
     * @param \WP_Admin_Bar $admin_bar Admin bar instance.
     */
    public function add_admin_bar_link( \WP_Admin_Bar $admin_bar ): void {
        if ( ! is_singular() || is_admin() ) {
            return;
        }

        $post_id = get_the_ID();

        if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        $is_enabled = (bool) get_post_meta( $post_id, '_polymorphic_enabled', true );

        if ( ! $is_enabled ) {
            return;
        }

        $admin_bar->add_node([
            'id'    => 'polymorphic-edit',
            'title' => '<span class="ab-icon dashicons dashicons-edit"></span>' . __( 'Edit with Polymorphic', 'polymorphic' ),
            'href'  => $this->get_builder_url( $post_id ),
            'meta'  => [
                'title' => __( 'Edit this page with Polymorphic', 'polymorphic' ),
            ],
        ]);
    }

    /**
     * Add row action to posts list.
     *
     * @since 1.0.0
     *
     * @param array    $actions Row actions.
     * @param \WP_Post $post    Post object.
     * @return array Modified actions.
     */
    public function add_row_action( array $actions, \WP_Post $post ): array {
        if ( ! in_array( $post->post_type, $this->post_types, true ) ) {
            return $actions;
        }

        if ( ! current_user_can( 'edit_post', $post->ID ) ) {
            return $actions;
        }

        $builder_url = $this->get_builder_url( $post->ID );
        $is_enabled  = (bool) get_post_meta( $post->ID, '_polymorphic_enabled', true );

        $label = $is_enabled
            ? __( 'Edit with Polymorphic', 'polymorphic' )
            : __( 'Polymorphic', 'polymorphic' );

        $actions['polymorphic'] = sprintf(
            '<a href="%s" style="color: #6366f1; font-weight: 500;">%s</a>',
            esc_url( $builder_url ),
            esc_html( $label )
        );

        return $actions;
    }
}
