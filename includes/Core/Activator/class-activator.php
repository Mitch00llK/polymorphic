<?php
/**
 * Plugin activation handler.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Core;

/**
 * Handles plugin activation.
 *
 * @since 1.0.0
 */
class Activator {

    /**
     * Run activation tasks.
     *
     * @since 1.0.0
     */
    public static function activate(): void {
        // Set default options.
        self::set_default_options();

        // Flush rewrite rules.
        flush_rewrite_rules();

        // Set activation flag for welcome notice.
        set_transient( 'polymorphic_activated', true, 60 );
    }

    /**
     * Set default plugin options.
     *
     * @since 1.0.0
     */
    private static function set_default_options(): void {
        $defaults = [
            'version'         => POLYMORPHIC_VERSION,
            'enabled_post_types' => [ 'page', 'post' ],
            'caching_enabled' => true,
            'cache_ttl'       => WEEK_IN_SECONDS,
        ];

        if ( ! get_option( 'polymorphic_settings' ) ) {
            add_option( 'polymorphic_settings', $defaults );
        }
    }
}
