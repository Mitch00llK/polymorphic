<?php
/**
 * Sanitizer helper class.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Helpers;

/**
 * Sanitization utilities for builder data.
 *
 * @since 1.0.0
 */
class Sanitizer {

    /**
     * Allowed heading tags.
     *
     * @var array
     */
    private const HEADING_TAGS = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

    /**
     * Sanitize heading tag.
     *
     * @since 1.0.0
     *
     * @param string $tag Raw tag.
     * @return string Valid heading tag.
     */
    public static function sanitize_heading_tag( string $tag ): string {
        $tag = strtolower( trim( $tag ) );
        return in_array( $tag, self::HEADING_TAGS, true ) ? $tag : 'h2';
    }

    /**
     * Sanitize color value.
     *
     * @since 1.0.0
     *
     * @param string $color Raw color.
     * @return string Sanitized color or empty.
     */
    public static function sanitize_color( string $color ): string {
        $color = trim( $color );

        // Allow hex colors.
        if ( preg_match( '/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color ) ) {
            return $color;
        }

        // Allow rgb/rgba.
        if ( preg_match( '/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/', $color ) ) {
            return $color;
        }

        // Allow transparent.
        if ( 'transparent' === strtolower( $color ) ) {
            return 'transparent';
        }

        return '';
    }

    /**
     * Sanitize CSS value.
     *
     * @since 1.0.0
     *
     * @param string $value Raw CSS value.
     * @return string Sanitized value.
     */
    public static function sanitize_css_value( string $value ): string {
        // Remove potential script injections.
        $value = preg_replace( '/expression\s*\(/i', '', $value );
        $value = preg_replace( '/javascript\s*:/i', '', $value );
        $value = preg_replace( '/url\s*\(/i', '', $value );

        return sanitize_text_field( $value );
    }

    /**
     * Sanitize component ID.
     *
     * @since 1.0.0
     *
     * @param string $id Raw ID.
     * @return string Sanitized ID.
     */
    public static function sanitize_id( string $id ): string {
        return preg_replace( '/[^a-zA-Z0-9_-]/', '', $id );
    }
}
