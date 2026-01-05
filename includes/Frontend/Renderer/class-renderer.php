<?php
/**
 * Frontend Renderer.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Frontend;

use Polymorphic\Components\Component_Registry;
use Polymorphic\Cache\Transient_Cache;

/**
 * Renders builder content on the frontend.
 *
 * @since 1.0.0
 */
class Renderer {

    /**
     * Component registry.
     *
     * @var Component_Registry
     */
    private Component_Registry $registry;

    /**
     * Cache handler.
     *
     * @var Transient_Cache
     */
    private Transient_Cache $cache;

    /**
     * Constructor.
     *
     * @since 1.0.0
     *
     * @param Component_Registry $registry Component registry.
     */
    public function __construct( Component_Registry $registry ) {
        $this->registry = $registry;
        $this->cache    = new Transient_Cache();
    }

    /**
     * Initialize the renderer.
     *
     * @since 1.0.0
     */
    public function init(): void {
        add_filter( 'the_content', [ $this, 'maybe_render_builder_content' ], 5 );
    }

    /**
     * Render builder content if enabled for this post.
     *
     * @since 1.0.0
     *
     * @param string $content Original post content.
     * @return string Modified content.
     */
    public function maybe_render_builder_content( string $content ): string {
        // Only on singular pages.
        if ( ! is_singular() ) {
            return $content;
        }

        $post_id = get_the_ID();

        // Check if builder is enabled.
        if ( ! $this->is_builder_enabled( $post_id ) ) {
            return $content;
        }

        // Try to get from cache.
        $cached = $this->cache->get_rendered( $post_id );
        if ( false !== $cached ) {
            return $cached;
        }

        // Render the content.
        $rendered = $this->render( $post_id );

        // Cache the result.
        $this->cache->set_rendered( $post_id, $rendered );

        return $rendered;
    }

    /**
     * Check if builder is enabled for a post.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID.
     * @return bool
     */
    private function is_builder_enabled( int $post_id ): bool {
        return (bool) get_post_meta( $post_id, '_polymorphic_enabled', true );
    }

    /**
     * Render builder content for a post.
     *
     * @since 1.0.0
     *
     * @param int $post_id Post ID.
     * @return string Rendered HTML.
     */
    public function render( int $post_id ): string {
        $data = get_post_meta( $post_id, '_polymorphic_data', true );

        if ( empty( $data ) ) {
            return '';
        }

        $data = json_decode( $data, true );

        if ( json_last_error() !== JSON_ERROR_NONE || empty( $data['components'] ) ) {
            return '';
        }

        /**
         * Fires before rendering begins.
         *
         * @since 1.0.0
         *
         * @param int   $post_id Post ID.
         * @param array $data    Builder data.
         */
        do_action( 'polymorphic/render/before', $post_id, $data );

        $html = '<div class="polymorphic-content">';

        foreach ( $data['components'] as $component ) {
            $html .= $this->registry->render( $component, 'frontend' );
        }

        $html .= '</div>';

        /**
         * Fires after rendering completes.
         *
         * @since 1.0.0
         *
         * @param int    $post_id Post ID.
         * @param string $html    Rendered HTML.
         */
        do_action( 'polymorphic/render/after', $post_id, $html );

        /**
         * Filter the final rendered HTML.
         *
         * @since 1.0.0
         *
         * @param string $html    Rendered HTML.
         * @param int    $post_id Post ID.
         */
        return apply_filters( 'polymorphic/render/page', $html, $post_id );
    }
}
