<?php
/**
 * Separator Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Separator;

use Polymorphic\Components\Component_Base;

/**
 * Visual divider with horizontal/vertical orientation.
 *
 * @since 1.0.0
 */
class Separator extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'separator';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Separator', 'polymorphic' );
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
        return 'minus';
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
            'orientation'     => 'horizontal',
            'color'           => '',
            'backgroundColor' => '',
            'width'           => '',
            'height'          => '',
            'marginTop'       => '',
            'marginBottom'    => '',
            'className'       => '',
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

        // Build classes using poly-* convention.
        $classes = [ 'poly-separator', 'poly-separator--' . sanitize_html_class( $props['orientation'] ) ];

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build CSS variables (support both 'color' and 'backgroundColor' for the line color).
        $bg_color = ! empty( $props['backgroundColor'] ) ? $props['backgroundColor'] : $props['color'];
        if ( ! empty( $bg_color ) ) {
            $props['backgroundColor'] = $bg_color;
        }

        $css_vars = $this->build_css_variables( $props, [
            'backgroundColor' => 'background-color',
            'width'           => 'width',
            'height'          => 'height',
            'marginTop'       => 'margin-top',
            'marginBottom'    => 'margin-bottom',
        ]);

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'role'              => 'separator',
            'aria-orientation'  => esc_attr( $props['orientation'] ),
            'data-component-id' => esc_attr( $id ),
        ];

        if ( ! empty( $css_vars ) ) {
            $attrs['style'] = $css_vars;
        }

        return '<div ' . $this->build_attributes( $attrs ) . '></div>';
    }
}
