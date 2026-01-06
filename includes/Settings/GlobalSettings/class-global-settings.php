<?php
/**
 * Global Settings Manager.
 *
 * Handles site-wide settings for Polymorphic similar to Elementor's Site Settings.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Settings;

/**
 * Manages global settings stored in wp_options.
 *
 * @since 1.0.0
 */
class Global_Settings {

    /**
     * Option name for storing global settings.
     */
    public const OPTION_NAME = 'polymorphic_global_settings';

    /**
     * Singleton instance.
     *
     * @var Global_Settings|null
     */
    private static ?Global_Settings $instance = null;

    /**
     * Cached settings.
     *
     * @var array|null
     */
    private ?array $settings = null;

    /**
     * Get singleton instance.
     *
     * @return Global_Settings
     */
    public static function get_instance(): Global_Settings {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Private constructor for singleton.
     */
    private function __construct() {}

    /**
     * Get all settings with defaults.
     *
     * @since 1.0.0
     *
     * @return array All settings merged with defaults.
     */
    public function get_all(): array {
        if ( null === $this->settings ) {
            $saved = get_option( self::OPTION_NAME, [] );
            $this->settings = $this->merge_with_defaults( $saved );
        }

        return $this->settings;
    }

    /**
     * Get a specific setting group.
     *
     * @since 1.0.0
     *
     * @param string $group Setting group (layout, typography, colors, etc.).
     * @return array Group settings.
     */
    public function get_group( string $group ): array {
        $all = $this->get_all();
        return $all[ $group ] ?? [];
    }

    /**
     * Get a specific setting value.
     *
     * @since 1.0.0
     *
     * @param string $group   Setting group.
     * @param string $key     Setting key.
     * @param mixed  $default Default value if not set.
     * @return mixed Setting value.
     */
    public function get( string $group, string $key, $default = null ) {
        $group_settings = $this->get_group( $group );
        return $group_settings[ $key ] ?? $default;
    }

    /**
     * Update all settings.
     *
     * @since 1.0.0
     *
     * @param array $settings New settings.
     * @return bool Whether the update was successful.
     */
    public function update_all( array $settings ): bool {
        $sanitized = $this->sanitize_settings( $settings );
        $result = update_option( self::OPTION_NAME, $sanitized );

        if ( $result ) {
            $this->settings = $this->merge_with_defaults( $sanitized );
            $this->invalidate_css_cache();

            /**
             * Fires after global settings are updated.
             *
             * @since 1.0.0
             *
             * @param array $settings The updated settings.
             */
            do_action( 'polymorphic/global_settings/updated', $this->settings );
        }

        return $result;
    }

    /**
     * Update a specific setting group.
     *
     * @since 1.0.0
     *
     * @param string $group    Setting group.
     * @param array  $settings Group settings.
     * @return bool Whether the update was successful.
     */
    public function update_group( string $group, array $settings ): bool {
        $all = $this->get_all();
        $all[ $group ] = $settings;
        return $this->update_all( $all );
    }

    /**
     * Reset settings to defaults.
     *
     * @since 1.0.0
     *
     * @return bool Whether the reset was successful.
     */
    public function reset(): bool {
        delete_option( self::OPTION_NAME );
        $this->settings = null;
        $this->invalidate_css_cache();
        return true;
    }

    /**
     * Get default settings.
     *
     * @since 1.0.0
     *
     * @return array Default settings structure.
     */
    public function get_defaults(): array {
        $defaults = [
            'layout' => [
                'containerWidth'       => '1200px',
                'containerWidthWide'   => '1400px',
                'containerWidthNarrow' => '768px',
                'defaultGap'           => '20px',
                'sectionPaddingTop'    => '60px',
                'sectionPaddingBottom' => '60px',
            ],
            'typography' => [
                'bodyFont'       => 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                'headingFont'    => 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                'baseFontSize'   => '16px',
                'baseLineHeight' => '1.6',
                'h1Size'         => '3rem',
                'h2Size'         => '2.25rem',
                'h3Size'         => '1.875rem',
                'h4Size'         => '1.5rem',
                'h5Size'         => '1.25rem',
                'h6Size'         => '1rem',
            ],
            'colors' => [
                'primary'    => '#6366f1',
                'secondary'  => '#64748b',
                'accent'     => '#22c55e',
                'text'       => '#1a1a1a',
                'textMuted'  => '#6b7280',
                'background' => '#ffffff',
                'surface'    => '#f9fafb',
                'border'     => '#e5e7eb',
                'error'      => '#ef4444',
                'warning'    => '#f59e0b',
                'success'    => '#22c55e',
                'info'       => '#3b82f6',
            ],
            'buttons' => [
                'borderRadius'  => '6px',
                'paddingX'      => '1.5rem',
                'paddingY'      => '0.75rem',
                'fontSize'      => '1rem',
                'fontWeight'    => '500',
                'transition'    => '0.2s ease',
            ],
            'breakpoints' => [
                'tablet' => '1024px',
                'mobile' => '768px',
            ],
        ];

        /**
         * Filter default global settings.
         *
         * @since 1.0.0
         *
         * @param array $defaults Default settings.
         */
        return apply_filters( 'polymorphic/global_settings/defaults', $defaults );
    }

    /**
     * Merge saved settings with defaults.
     *
     * @since 1.0.0
     *
     * @param array $saved Saved settings.
     * @return array Merged settings.
     */
    private function merge_with_defaults( array $saved ): array {
        $defaults = $this->get_defaults();
        $merged = [];

        foreach ( $defaults as $group => $group_defaults ) {
            $merged[ $group ] = wp_parse_args(
                $saved[ $group ] ?? [],
                $group_defaults
            );
        }

        return $merged;
    }

    /**
     * Sanitize settings before saving.
     *
     * @since 1.0.0
     *
     * @param array $settings Raw settings.
     * @return array Sanitized settings.
     */
    private function sanitize_settings( array $settings ): array {
        $sanitized = [];
        $defaults = $this->get_defaults();

        foreach ( $defaults as $group => $group_defaults ) {
            if ( ! isset( $settings[ $group ] ) ) {
                continue;
            }

            $sanitized[ $group ] = [];

            foreach ( $group_defaults as $key => $default ) {
                if ( ! isset( $settings[ $group ][ $key ] ) ) {
                    continue;
                }

                $value = $settings[ $group ][ $key ];

                // Sanitize based on the type of default value.
                if ( $this->is_color_key( $key ) ) {
                    $sanitized[ $group ][ $key ] = sanitize_hex_color( $value ) ?: $default;
                } elseif ( $this->is_size_key( $key ) ) {
                    $sanitized[ $group ][ $key ] = $this->sanitize_css_size( $value );
                } elseif ( $this->is_font_key( $key ) ) {
                    $sanitized[ $group ][ $key ] = sanitize_text_field( $value );
                } else {
                    $sanitized[ $group ][ $key ] = sanitize_text_field( $value );
                }
            }
        }

        return $sanitized;
    }

    /**
     * Check if key is a color setting.
     *
     * @param string $key Setting key.
     * @return bool
     */
    private function is_color_key( string $key ): bool {
        $color_keys = [
            'primary', 'secondary', 'accent', 'text', 'textMuted',
            'background', 'surface', 'border', 'error', 'warning',
            'success', 'info',
        ];
        return in_array( $key, $color_keys, true );
    }

    /**
     * Check if key is a size setting.
     *
     * @param string $key Setting key.
     * @return bool
     */
    private function is_size_key( string $key ): bool {
        return preg_match( '/(Width|Size|Padding|Gap|Radius|Height)/', $key ) === 1;
    }

    /**
     * Check if key is a font setting.
     *
     * @param string $key Setting key.
     * @return bool
     */
    private function is_font_key( string $key ): bool {
        return strpos( $key, 'Font' ) !== false;
    }

    /**
     * Sanitize CSS size value.
     *
     * @param string $value Raw value.
     * @return string Sanitized value.
     */
    private function sanitize_css_size( string $value ): string {
        // Allow numbers with units (px, rem, em, %, vw, vh).
        if ( preg_match( '/^[\d.]+(px|rem|em|%|vw|vh)?$/', $value ) ) {
            return $value;
        }
        return '';
    }

    /**
     * Invalidate CSS cache.
     *
     * @since 1.0.0
     */
    private function invalidate_css_cache(): void {
        delete_transient( 'polymorphic_global_css' );

        /**
         * Fires when global CSS cache is invalidated.
         *
         * @since 1.0.0
         */
        do_action( 'polymorphic/global_settings/cache_invalidated' );
    }

    /**
     * Generate CSS variables from settings.
     *
     * @since 1.0.0
     *
     * @return string CSS custom properties.
     */
    public function generate_css_variables(): string {
        $cached = get_transient( 'polymorphic_global_css' );

        if ( false !== $cached ) {
            return $cached;
        }

        $settings = $this->get_all();
        $css = ":root {\n";

        // Layout variables.
        $css .= "  /* Layout */\n";
        $css .= "  --poly-container-width: {$settings['layout']['containerWidth']};\n";
        $css .= "  --poly-container-wide: {$settings['layout']['containerWidthWide']};\n";
        $css .= "  --poly-container-narrow: {$settings['layout']['containerWidthNarrow']};\n";
        $css .= "  --poly-gap: {$settings['layout']['defaultGap']};\n";
        $css .= "  --poly-section-padding-top: {$settings['layout']['sectionPaddingTop']};\n";
        $css .= "  --poly-section-padding-bottom: {$settings['layout']['sectionPaddingBottom']};\n";

        // Typography variables.
        $css .= "\n  /* Typography */\n";
        $css .= "  --poly-font-body: {$settings['typography']['bodyFont']};\n";
        $css .= "  --poly-font-heading: {$settings['typography']['headingFont']};\n";
        $css .= "  --poly-font-size: {$settings['typography']['baseFontSize']};\n";
        $css .= "  --poly-line-height: {$settings['typography']['baseLineHeight']};\n";
        $css .= "  --poly-h1-size: {$settings['typography']['h1Size']};\n";
        $css .= "  --poly-h2-size: {$settings['typography']['h2Size']};\n";
        $css .= "  --poly-h3-size: {$settings['typography']['h3Size']};\n";
        $css .= "  --poly-h4-size: {$settings['typography']['h4Size']};\n";
        $css .= "  --poly-h5-size: {$settings['typography']['h5Size']};\n";
        $css .= "  --poly-h6-size: {$settings['typography']['h6Size']};\n";

        // Color variables.
        $css .= "\n  /* Colors */\n";
        $css .= "  --poly-color-primary: {$settings['colors']['primary']};\n";
        $css .= "  --poly-color-secondary: {$settings['colors']['secondary']};\n";
        $css .= "  --poly-color-accent: {$settings['colors']['accent']};\n";
        $css .= "  --poly-color-text: {$settings['colors']['text']};\n";
        $css .= "  --poly-color-muted: {$settings['colors']['textMuted']};\n";
        $css .= "  --poly-color-bg: {$settings['colors']['background']};\n";
        $css .= "  --poly-color-surface: {$settings['colors']['surface']};\n";
        $css .= "  --poly-color-border: {$settings['colors']['border']};\n";
        $css .= "  --poly-color-error: {$settings['colors']['error']};\n";
        $css .= "  --poly-color-warning: {$settings['colors']['warning']};\n";
        $css .= "  --poly-color-success: {$settings['colors']['success']};\n";
        $css .= "  --poly-color-info: {$settings['colors']['info']};\n";

        // Button variables.
        $css .= "\n  /* Buttons */\n";
        $css .= "  --poly-btn-radius: {$settings['buttons']['borderRadius']};\n";
        $css .= "  --poly-btn-px: {$settings['buttons']['paddingX']};\n";
        $css .= "  --poly-btn-py: {$settings['buttons']['paddingY']};\n";
        $css .= "  --poly-btn-font-size: {$settings['buttons']['fontSize']};\n";
        $css .= "  --poly-btn-font-weight: {$settings['buttons']['fontWeight']};\n";
        $css .= "  --poly-btn-transition: {$settings['buttons']['transition']};\n";

        // Breakpoint variables.
        $css .= "\n  /* Breakpoints */\n";
        $css .= "  --poly-breakpoint-tablet: {$settings['breakpoints']['tablet']};\n";
        $css .= "  --poly-breakpoint-mobile: {$settings['breakpoints']['mobile']};\n";

        $css .= "}\n";

        /**
         * Filter generated CSS variables.
         *
         * @since 1.0.0
         *
         * @param string $css      Generated CSS.
         * @param array  $settings Current settings.
         */
        $css = apply_filters( 'polymorphic/global_settings/css', $css, $settings );

        // Cache for 1 week.
        set_transient( 'polymorphic_global_css', $css, WEEK_IN_SECONDS );

        return $css;
    }

    /**
     * Export settings as JSON.
     *
     * @since 1.0.0
     *
     * @return string JSON string.
     */
    public function export(): string {
        return wp_json_encode( $this->get_all(), JSON_PRETTY_PRINT );
    }

    /**
     * Import settings from JSON.
     *
     * @since 1.0.0
     *
     * @param string $json JSON string.
     * @return bool Whether import was successful.
     */
    public function import( string $json ): bool {
        $settings = json_decode( $json, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return false;
        }

        return $this->update_all( $settings );
    }
}

