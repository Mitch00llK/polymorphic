<?php
/**
 * Container Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Container;

use Polymorphic\Components\Component_Base;

/**
 * Content width container component (Organism).
 *
 * @since 1.0.0
 */
class Container extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'container';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Container', 'polymorphic' );
    }

    /**
     * Get component category.
     *
     * @return string
     */
    public function get_category(): string {
        return 'layout';
    }

    /**
     * Get component icon.
     *
     * @return string
     */
    public function get_icon(): string {
        return 'box';
    }

    /**
     * Whether this component supports children.
     *
     * @return bool
     */
    public function supports_children(): bool {
        return true;
    }

    /**
     * Get default component props.
     *
     * @return array
     */
    public function get_defaults(): array {
        return [
            'width'           => 'default',
            'maxWidth'        => '',
            'paddingTop'      => '0',
            'paddingBottom'   => '0',
            'paddingLeft'     => '1rem',
            'paddingRight'    => '1rem',
            'marginTop'       => '0',
            'marginBottom'    => '0',
            'backgroundColor' => '',
            'textAlign'       => 'left',
            'display'         => 'block',
            'flexDirection'   => 'column',
            'justifyContent'  => 'flex-start',
            'alignItems'      => 'stretch',
            'gap'             => '0',
            'className'       => '',
            'htmlId'          => '',
        ];
    }

    /**
     * Render the component.
     *
     * @param array        $component Component data.
     * @param string|array $context   Render context (frontend|preview|editor).
     * @return string Rendered HTML.
     */
    public function render( array $component, $context = 'frontend' ): string {
        $props    = $this->merge_defaults( $component['props'] ?? [] );
        $id       = $component['id'] ?? '';
        $children = $component['children'] ?? [];

        // Build CSS classes using poly-* convention.
        $classes = [ 'poly-container' ];

        if ( ! empty( $props['width'] ) && 'default' !== $props['width'] ) {
            $classes[] = 'poly-container--' . sanitize_html_class( $props['width'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Add generated class for frontend (zero inline styles).
        $generated_class = $this->get_generated_class( $component, $context );
        if ( ! empty( $generated_class ) ) {
            $classes[] = $generated_class;
        }

        // Build attributes.
        $attrs = [
            'class' => implode( ' ', $classes ),
        ];

        if ( ! empty( $props['htmlId'] ) ) {
            $attrs['id'] = sanitize_html_class( $props['htmlId'] );
        }

        $attrs['data-component-id'] = esc_attr( $id );

        // Render children.
        $children_html = $this->render_children( $children, $context );

        // Build HTML.
        $html  = '<div ' . $this->build_attributes( $attrs ) . '>';
        $html .= $children_html;
        $html .= '</div>';

        return $html;
    }
}
