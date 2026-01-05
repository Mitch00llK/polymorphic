<?php
/**
 * Plugin deactivation handler.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Core;

/**
 * Handles plugin deactivation.
 *
 * @since 1.0.0
 */
class Deactivator {

    /**
     * Run deactivation tasks.
     *
     * @since 1.0.0
     */
    public static function deactivate(): void {
        // Clear all cached renders.
        self::clear_caches();

        // Flush rewrite rules.
        flush_rewrite_rules();
    }

    /**
     * Clear all transient caches.
     *
     * @since 1.0.0
     */
    private static function clear_caches(): void {
        global $wpdb;

        // Delete all polymorphic transients.
        $wpdb->query(
            "DELETE FROM {$wpdb->options} 
             WHERE option_name LIKE '_transient_polymorphic_%' 
             OR option_name LIKE '_transient_timeout_polymorphic_%'"
        );
    }
}
