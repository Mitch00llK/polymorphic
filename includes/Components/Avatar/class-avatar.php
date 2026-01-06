<?php
/**
 * Avatar Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Avatar;

use Polymorphic\Components\Component_Base;

/**
 * User/profile avatar with image and fallback.
 *
 * @since 1.0.0
 */
class Avatar extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'avatar';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Avatar', 'polymorphic' );
    }

    /**
     * Get component category.
     *
     * @return string
     */
    public function get_category(): string {
        return 'ui';
    }

    /**
     * Get component icon.
     *
     * @return string
     */
    public function get_icon(): string {
        return 'user';
    }

    /**
     * Whether this component supports children.
     *
     * @return bool
     */
    public function supports_children(): bool {
        return false;
    }

    /**
     * Get default component props.
     *
     * @return array
     */
    public function get_defaults(): array {
        return [
            'src'       => '',
            'alt'       => 'Avatar',
            'fallback'  => 'U',
            'size'      => 'medium',
            'className' => '',
        ];
    }

    /**
     * Render the component.
     *
     * @param array  $component Component data.
     * @param string $context   Render context.
     * @return string Rendered HTML.
     */
    public function render( array $component, string $context = 'frontend' ): string {
        $props = $this->merge_defaults( $component['props'] ?? [] );
        $id    = $component['id'] ?? '';

        // Build classes.
        $classes = [ 'avatar', 'avatar--' . sanitize_html_class( $props['size'] ) ];

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        // Build HTML.
        $html = '<div ' . $this->build_attributes( $attrs ) . '>';

        if ( ! empty( $props['src'] ) ) {
            $html .= '<img class="avatar__image" src="' . esc_url( $props['src'] ) . '" alt="' . esc_attr( $props['alt'] ) . '" />';
        } else {
            $fallback = strtoupper( substr( $props['fallback'], 0, 2 ) );
            $html    .= '<span class="avatar__fallback">' . esc_html( $fallback ) . '</span>';
        }

        $html .= '</div>';

        return $html;
    }
}
