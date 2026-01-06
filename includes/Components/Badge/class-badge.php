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
            'text'            => 'Badge',
            'variant'         => 'default',
            'backgroundColor' => '',
            'textColor'       => '',
            'borderRadius'    => '',
            'fontSize'        => '',
            'fontWeight'      => '',
            'paddingX'        => '',
            'paddingY'        => '',
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
        $classes = [ 'poly-badge', 'poly-badge--' . sanitize_html_class( $props['variant'] ) ];

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build CSS variables.
        $css_vars = $this->build_css_variables( $props, [
            'backgroundColor' => 'background-color',
            'textColor'       => 'color',
            'borderRadius'    => 'border-radius',
            'fontSize'        => 'font-size',
            'fontWeight'      => 'font-weight',
        ]);

        // Handle padding separately.
        if ( ! empty( $props['paddingX'] ) ) {
            $css_vars .= ( ! empty( $css_vars ) ? '; ' : '' ) . '--poly-padding-left: ' . esc_attr( $props['paddingX'] );
            $css_vars .= '; --poly-padding-right: ' . esc_attr( $props['paddingX'] );
        }

        if ( ! empty( $props['paddingY'] ) ) {
            $css_vars .= ( ! empty( $css_vars ) ? '; ' : '' ) . '--poly-padding-top: ' . esc_attr( $props['paddingY'] );
            $css_vars .= '; --poly-padding-bottom: ' . esc_attr( $props['paddingY'] );
        }

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        if ( ! empty( $css_vars ) ) {
            $attrs['style'] = $css_vars;
        }

        return '<span ' . $this->build_attributes( $attrs ) . '>' . esc_html( $props['text'] ) . '</span>';
    }
}
