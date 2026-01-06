<?php
/**
 * Badge Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Badge;

use Polymorphic\Components\Component_Base;

/**
 * Small status indicator badge.
 *
 * @since 1.0.0
 */
class Badge extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'badge';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Badge', 'polymorphic' );
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
        return 'tag';
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
            'text'      => 'Badge',
            'variant'   => 'default',
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
        $classes = [ 'badge', 'badge--' . sanitize_html_class( $props['variant'] ) ];

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        return '<span ' . $this->build_attributes( $attrs ) . '>' . esc_html( $props['text'] ) . '</span>';
    }
}
