<?php
/**
 * Admin Menu handler.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Admin;

use Polymorphic\Settings\Global_Settings;

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

        // Hidden builder page (null parent = hidden from menu but accessible).
        add_submenu_page(
            null, // No parent - hidden from menu.
            __( 'Edit with Polymorphic', 'polymorphic' ),
            __( 'Builder', 'polymorphic' ),
            'edit_posts',
            'polymorphic-builder',
            [ $this, 'render_builder_page_wrapper' ]
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
        $global_settings = Global_Settings::get_instance();
        $settings = $global_settings->get_all();
        $defaults = $global_settings->get_defaults();

        // Handle form submission.
        // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if ( isset( $_POST['polymorphic_settings_nonce'] ) ) {
            if ( wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['polymorphic_settings_nonce'] ) ), 'polymorphic_save_settings' ) ) {
                // phpcs:ignore WordPress.Security.NonceVerification.Missing
                $new_settings = isset( $_POST['polymorphic'] ) ? $this->sanitize_form_settings( wp_unslash( $_POST['polymorphic'] ) ) : [];
                $global_settings->update_all( $new_settings );
                $settings = $global_settings->get_all();
                echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings saved successfully.', 'polymorphic' ) . '</p></div>';
            }
        }

        // Handle reset.
        // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if ( isset( $_POST['polymorphic_reset_nonce'] ) ) {
            if ( wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['polymorphic_reset_nonce'] ) ), 'polymorphic_reset_settings' ) ) {
                $global_settings->reset();
                $settings = $global_settings->get_all();
                echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings reset to defaults.', 'polymorphic' ) . '</p></div>';
            }
        }
        ?>
        <div class="wrap polymorphic-settings">
            <h1><?php esc_html_e( 'Polymorphic Settings', 'polymorphic' ); ?></h1>
            <p class="description"><?php esc_html_e( 'Configure global settings for your Polymorphic page builder. These settings define CSS variables used across all pages.', 'polymorphic' ); ?></p>

            <style>
                .polymorphic-settings { max-width: 900px; }
                .polymorphic-settings .nav-tab-wrapper { margin-bottom: 20px; }
                .polymorphic-settings .settings-section { display: none; background: #fff; padding: 20px; border: 1px solid #ccd0d4; border-radius: 4px; }
                .polymorphic-settings .settings-section.active { display: block; }
                .polymorphic-settings .settings-section h2 { margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #eee; }
                .polymorphic-settings .form-table th { width: 200px; font-weight: 500; }
                .polymorphic-settings .form-table td input[type="text"] { width: 300px; }
                .polymorphic-settings .color-field-wrap { display: flex; align-items: center; gap: 10px; }
                .polymorphic-settings .color-field-wrap input[type="color"] { width: 40px; height: 40px; padding: 2px; border: 1px solid #8c8f94; border-radius: 4px; cursor: pointer; }
                .polymorphic-settings .color-field-wrap input[type="text"] { width: 120px; font-family: monospace; }
                .polymorphic-settings .field-description { color: #646970; font-size: 13px; margin-top: 4px; }
                .polymorphic-settings .submit-wrap { display: flex; gap: 10px; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
            </style>

            <nav class="nav-tab-wrapper">
                <a href="#layout" class="nav-tab nav-tab-active" data-tab="layout"><?php esc_html_e( 'Layout', 'polymorphic' ); ?></a>
                <a href="#typography" class="nav-tab" data-tab="typography"><?php esc_html_e( 'Typography', 'polymorphic' ); ?></a>
                <a href="#colors" class="nav-tab" data-tab="colors"><?php esc_html_e( 'Colors', 'polymorphic' ); ?></a>
                <a href="#buttons" class="nav-tab" data-tab="buttons"><?php esc_html_e( 'Buttons', 'polymorphic' ); ?></a>
                <a href="#breakpoints" class="nav-tab" data-tab="breakpoints"><?php esc_html_e( 'Breakpoints', 'polymorphic' ); ?></a>
            </nav>

            <form method="post" action="">
                <?php wp_nonce_field( 'polymorphic_save_settings', 'polymorphic_settings_nonce' ); ?>

                <!-- Layout Section -->
                <div id="layout" class="settings-section active">
                    <h2><?php esc_html_e( 'Layout Settings', 'polymorphic' ); ?></h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label for="containerWidth"><?php esc_html_e( 'Container Width', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="containerWidth" name="polymorphic[layout][containerWidth]" value="<?php echo esc_attr( $settings['layout']['containerWidth'] ); ?>" />
                                <p class="field-description"><?php esc_html_e( 'Default container max-width (e.g., 1200px)', 'polymorphic' ); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="containerWidthWide"><?php esc_html_e( 'Wide Container Width', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="containerWidthWide" name="polymorphic[layout][containerWidthWide]" value="<?php echo esc_attr( $settings['layout']['containerWidthWide'] ); ?>" />
                                <p class="field-description"><?php esc_html_e( 'Wide container max-width (e.g., 1400px)', 'polymorphic' ); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="containerWidthNarrow"><?php esc_html_e( 'Narrow Container Width', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="containerWidthNarrow" name="polymorphic[layout][containerWidthNarrow]" value="<?php echo esc_attr( $settings['layout']['containerWidthNarrow'] ); ?>" />
                                <p class="field-description"><?php esc_html_e( 'Narrow container max-width (e.g., 768px)', 'polymorphic' ); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="defaultGap"><?php esc_html_e( 'Default Gap', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="defaultGap" name="polymorphic[layout][defaultGap]" value="<?php echo esc_attr( $settings['layout']['defaultGap'] ); ?>" />
                                <p class="field-description"><?php esc_html_e( 'Default spacing between elements (e.g., 20px)', 'polymorphic' ); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="sectionPaddingTop"><?php esc_html_e( 'Section Padding Top', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="sectionPaddingTop" name="polymorphic[layout][sectionPaddingTop]" value="<?php echo esc_attr( $settings['layout']['sectionPaddingTop'] ); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="sectionPaddingBottom"><?php esc_html_e( 'Section Padding Bottom', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="sectionPaddingBottom" name="polymorphic[layout][sectionPaddingBottom]" value="<?php echo esc_attr( $settings['layout']['sectionPaddingBottom'] ); ?>" />
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Typography Section -->
                <div id="typography" class="settings-section">
                    <h2><?php esc_html_e( 'Typography Settings', 'polymorphic' ); ?></h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label for="bodyFont"><?php esc_html_e( 'Body Font', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="bodyFont" name="polymorphic[typography][bodyFont]" value="<?php echo esc_attr( $settings['typography']['bodyFont'] ); ?>" />
                                <p class="field-description"><?php esc_html_e( 'Font family for body text', 'polymorphic' ); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="headingFont"><?php esc_html_e( 'Heading Font', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="headingFont" name="polymorphic[typography][headingFont]" value="<?php echo esc_attr( $settings['typography']['headingFont'] ); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="baseFontSize"><?php esc_html_e( 'Base Font Size', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="baseFontSize" name="polymorphic[typography][baseFontSize]" value="<?php echo esc_attr( $settings['typography']['baseFontSize'] ); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="baseLineHeight"><?php esc_html_e( 'Line Height', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="baseLineHeight" name="polymorphic[typography][baseLineHeight]" value="<?php echo esc_attr( $settings['typography']['baseLineHeight'] ); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><?php esc_html_e( 'Heading Sizes', 'polymorphic' ); ?></th>
                            <td>
                                <p><label>H1: <input type="text" name="polymorphic[typography][h1Size]" value="<?php echo esc_attr( $settings['typography']['h1Size'] ); ?>" style="width:100px" /></label></p>
                                <p><label>H2: <input type="text" name="polymorphic[typography][h2Size]" value="<?php echo esc_attr( $settings['typography']['h2Size'] ); ?>" style="width:100px" /></label></p>
                                <p><label>H3: <input type="text" name="polymorphic[typography][h3Size]" value="<?php echo esc_attr( $settings['typography']['h3Size'] ); ?>" style="width:100px" /></label></p>
                                <p><label>H4: <input type="text" name="polymorphic[typography][h4Size]" value="<?php echo esc_attr( $settings['typography']['h4Size'] ); ?>" style="width:100px" /></label></p>
                                <p><label>H5: <input type="text" name="polymorphic[typography][h5Size]" value="<?php echo esc_attr( $settings['typography']['h5Size'] ); ?>" style="width:100px" /></label></p>
                                <p><label>H6: <input type="text" name="polymorphic[typography][h6Size]" value="<?php echo esc_attr( $settings['typography']['h6Size'] ); ?>" style="width:100px" /></label></p>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Colors Section -->
                <div id="colors" class="settings-section">
                    <h2><?php esc_html_e( 'Color Settings', 'polymorphic' ); ?></h2>
                    <table class="form-table">
                        <?php
                        $color_fields = [
                            'primary'    => __( 'Primary Color', 'polymorphic' ),
                            'secondary'  => __( 'Secondary Color', 'polymorphic' ),
                            'accent'     => __( 'Accent Color', 'polymorphic' ),
                            'text'       => __( 'Text Color', 'polymorphic' ),
                            'textMuted'  => __( 'Muted Text Color', 'polymorphic' ),
                            'background' => __( 'Background Color', 'polymorphic' ),
                            'surface'    => __( 'Surface Color', 'polymorphic' ),
                            'border'     => __( 'Border Color', 'polymorphic' ),
                            'error'      => __( 'Error Color', 'polymorphic' ),
                            'warning'    => __( 'Warning Color', 'polymorphic' ),
                            'success'    => __( 'Success Color', 'polymorphic' ),
                            'info'       => __( 'Info Color', 'polymorphic' ),
                        ];
                        foreach ( $color_fields as $key => $label ) :
                            ?>
                            <tr>
                                <th scope="row"><label for="color_<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></label></th>
                                <td>
                                    <div class="color-field-wrap">
                                        <input type="color" id="color_<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $settings['colors'][ $key ] ); ?>" onchange="document.getElementById('color_text_<?php echo esc_attr( $key ); ?>').value = this.value" />
                                        <input type="text" id="color_text_<?php echo esc_attr( $key ); ?>" name="polymorphic[colors][<?php echo esc_attr( $key ); ?>]" value="<?php echo esc_attr( $settings['colors'][ $key ] ); ?>" onchange="document.getElementById('color_<?php echo esc_attr( $key ); ?>').value = this.value" />
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </table>
                </div>

                <!-- Buttons Section -->
                <div id="buttons" class="settings-section">
                    <h2><?php esc_html_e( 'Button Settings', 'polymorphic' ); ?></h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label for="borderRadius"><?php esc_html_e( 'Border Radius', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="borderRadius" name="polymorphic[buttons][borderRadius]" value="<?php echo esc_attr( $settings['buttons']['borderRadius'] ); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="paddingX"><?php esc_html_e( 'Horizontal Padding', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="paddingX" name="polymorphic[buttons][paddingX]" value="<?php echo esc_attr( $settings['buttons']['paddingX'] ); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="paddingY"><?php esc_html_e( 'Vertical Padding', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="paddingY" name="polymorphic[buttons][paddingY]" value="<?php echo esc_attr( $settings['buttons']['paddingY'] ); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="btn_fontSize"><?php esc_html_e( 'Font Size', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="btn_fontSize" name="polymorphic[buttons][fontSize]" value="<?php echo esc_attr( $settings['buttons']['fontSize'] ); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="fontWeight"><?php esc_html_e( 'Font Weight', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="fontWeight" name="polymorphic[buttons][fontWeight]" value="<?php echo esc_attr( $settings['buttons']['fontWeight'] ); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="transition"><?php esc_html_e( 'Transition', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="transition" name="polymorphic[buttons][transition]" value="<?php echo esc_attr( $settings['buttons']['transition'] ); ?>" />
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Breakpoints Section -->
                <div id="breakpoints" class="settings-section">
                    <h2><?php esc_html_e( 'Breakpoint Settings', 'polymorphic' ); ?></h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label for="tablet"><?php esc_html_e( 'Tablet Breakpoint', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="tablet" name="polymorphic[breakpoints][tablet]" value="<?php echo esc_attr( $settings['breakpoints']['tablet'] ); ?>" />
                                <p class="field-description"><?php esc_html_e( 'Below this width, tablet styles apply', 'polymorphic' ); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="mobile"><?php esc_html_e( 'Mobile Breakpoint', 'polymorphic' ); ?></label></th>
                            <td>
                                <input type="text" id="mobile" name="polymorphic[breakpoints][mobile]" value="<?php echo esc_attr( $settings['breakpoints']['mobile'] ); ?>" />
                                <p class="field-description"><?php esc_html_e( 'Below this width, mobile styles apply', 'polymorphic' ); ?></p>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="submit-wrap">
                    <?php submit_button( __( 'Save Settings', 'polymorphic' ), 'primary', 'submit', false ); ?>
                </div>
            </form>

            <form method="post" action="" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccd0d4;">
                <?php wp_nonce_field( 'polymorphic_reset_settings', 'polymorphic_reset_nonce' ); ?>
                <p class="description"><?php esc_html_e( 'Reset all settings to their default values.', 'polymorphic' ); ?></p>
                <?php submit_button( __( 'Reset to Defaults', 'polymorphic' ), 'secondary', 'reset', false, [ 'onclick' => "return confirm('" . esc_js( __( 'Are you sure you want to reset all settings?', 'polymorphic' ) ) . "');" ] ); ?>
            </form>

            <script>
            document.addEventListener('DOMContentLoaded', function() {
                const tabs = document.querySelectorAll('.nav-tab');
                const sections = document.querySelectorAll('.settings-section');

                tabs.forEach(function(tab) {
                    tab.addEventListener('click', function(e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('data-tab');

                        tabs.forEach(t => t.classList.remove('nav-tab-active'));
                        sections.forEach(s => s.classList.remove('active'));

                        this.classList.add('nav-tab-active');
                        document.getElementById(targetId).classList.add('active');
                    });
                });
            });
            </script>
        </div>
        <?php
    }

    /**
     * Sanitize form settings.
     *
     * @since 1.0.0
     *
     * @param array $input Raw form input.
     * @return array Sanitized settings.
     */
    private function sanitize_form_settings( array $input ): array {
        $sanitized = [];

        // Layout.
        if ( isset( $input['layout'] ) ) {
            $sanitized['layout'] = array_map( 'sanitize_text_field', $input['layout'] );
        }

        // Typography.
        if ( isset( $input['typography'] ) ) {
            $sanitized['typography'] = array_map( 'sanitize_text_field', $input['typography'] );
        }

        // Colors.
        if ( isset( $input['colors'] ) ) {
            $sanitized['colors'] = [];
            foreach ( $input['colors'] as $key => $value ) {
                $sanitized['colors'][ $key ] = sanitize_hex_color( $value ) ?: $value;
            }
        }

        // Buttons.
        if ( isset( $input['buttons'] ) ) {
            $sanitized['buttons'] = array_map( 'sanitize_text_field', $input['buttons'] );
        }

        // Breakpoints.
        if ( isset( $input['breakpoints'] ) ) {
            $sanitized['breakpoints'] = array_map( 'sanitize_text_field', $input['breakpoints'] );
        }

        return $sanitized;
    }

    /**
     * Handle redirect to builder page.
     *
     * @since 1.0.0
     * @deprecated Use render_builder_page_wrapper instead.
     */
    public function handle_builder_redirect(): void {
        // No longer needed - WordPress handles page access via registered menu page.
    }

    /**
     * Render the builder page wrapper.
     *
     * This is called by WordPress when the builder page is accessed.
     *
     * @since 1.0.0
     */
    public function render_builder_page_wrapper(): void {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : 0;

        if ( ! $post_id ) {
            wp_die( esc_html__( 'No post ID provided. Please select a page to edit.', 'polymorphic' ) );
        }

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            wp_die( esc_html__( 'You do not have permission to edit this post.', 'polymorphic' ) );
        }

        // Mark as enabled when entering builder.
        update_post_meta( $post_id, '_polymorphic_enabled', true );

        // Enqueue builder assets.
        $this->enqueue_builder_assets( $post_id );

        // Render the builder template directly (full-screen).
        include POLYMORPHIC_PATH . 'templates/builder-page.php';
        exit;
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
            'editorUrl'  => get_edit_post_link( $post_id, 'raw' ),
            'previewUrl' => get_preview_post_link( $post_id ),
        ]);
    }

    /**
     * Render the full-screen builder page.
     *
     * @since 1.0.0
     * @deprecated Use render_builder_page_wrapper instead.
     *
     * @param int $post_id Post ID to edit.
     */
    private function render_builder_page( int $post_id ): void {
        include POLYMORPHIC_PATH . 'templates/builder-page.php';
    }
}

