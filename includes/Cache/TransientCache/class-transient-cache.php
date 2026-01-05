<?php
/**
 * Transient Cache handler.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Cache;

/**
 * Handles transient-based caching for rendered content.
 *
 * @since 1.0.0
 */
class Transient_Cache {

    /**
     * Cache duration in seconds (1 week).
     */
    private const TTL = WEEK_IN_SECONDS;

    /**
     * Get cached rendered HTML.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID.
     * @return string|false Cached HTML or false.
     */
    public function get_rendered( int $post_id ) {
        $cache_key = $this->get_cache_key( $post_id );
        return get_transient( "polymorphic_rendered_{$cache_key}" );
    }

    /**
     * Cache rendered HTML.
     *
     * @since 1.0.0
     *
     * @param int    $post_id Post ID.
     * @param string $html    Rendered HTML.
     */
    public function set_rendered( int $post_id, string $html ): void {
        $cache_key = $this->get_cache_key( $post_id );

        /**
         * Filter cache TTL.
         *
         * @since 1.0.0
         *
         * @param int $ttl     TTL in seconds.
         * @param int $post_id Post ID.
         */
        $ttl = apply_filters( 'polymorphic/cache/ttl', self::TTL, $post_id );

        set_transient( "polymorphic_rendered_{$cache_key}", $html, $ttl );
    }

    /**
     * Invalidate cache for a post.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID.
     */
    public function invalidate( int $post_id ): void {
        $cache_key = $this->get_cache_key( $post_id );

        delete_transient( "polymorphic_rendered_{$cache_key}" );
        delete_transient( "polymorphic_styles_{$cache_key}" );

        // Generate new cache key.
        update_post_meta( $post_id, '_polymorphic_cache_key', wp_generate_password( 8, false ) );

        /**
         * Fires when cache is invalidated.
         *
         * @since 1.0.0
         *
         * @param int $post_id Post ID.
         */
        do_action( 'polymorphic/cache/invalidated', $post_id );
    }

    /**
     * Get unique cache key for a post.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID.
     * @return string Cache key.
     */
    private function get_cache_key( int $post_id ): string {
        $key = get_post_meta( $post_id, '_polymorphic_cache_key', true );

        if ( empty( $key ) ) {
            $key = wp_generate_password( 8, false );
            update_post_meta( $post_id, '_polymorphic_cache_key', $key );
        }

        return $post_id . '_' . $key;
    }
}
