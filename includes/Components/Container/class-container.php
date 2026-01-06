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
     * @param array  $component Component data.
     * @param string $context   Render context (frontend|preview|editor).
     * @return string Rendered HTML.
     */
    public function render( array $component, string $context = 'frontend' ): string {
        $props    = $this->merge_defaults( $component['props'] ?? [] );
        $id       = $component['id'] ?? '';
        $children = $component['children'] ?? [];

        // Build CSS classes (generic, no 'polymorphic-' prefix).
        $classes = [ 'container' ];

        if ( ! empty( $props['width'] ) && 'default' !== $props['width'] ) {
            $classes[] = 'container--' . sanitize_html_class( $props['width'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build inline styles.
        $styles = [];

        if ( ! empty( $props['maxWidth'] ) ) {
            $styles[] = 'max-width:' . esc_attr( $props['maxWidth'] );
        }

        if ( ! empty( $props['backgroundColor'] ) ) {
            $styles[] = 'background-color:' . esc_attr( $props['backgroundColor'] );
        }

        if ( ! empty( $props['paddingTop'] ) && '0' !== $props['paddingTop'] ) {
            $styles[] = 'padding-top:' . esc_attr( $props['paddingTop'] );
        }

        if ( ! empty( $props['paddingBottom'] ) && '0' !== $props['paddingBottom'] ) {
            $styles[] = 'padding-bottom:' . esc_attr( $props['paddingBottom'] );
        }

        if ( ! empty( $props['paddingLeft'] ) ) {
            $styles[] = 'padding-left:' . esc_attr( $props['paddingLeft'] );
        }

        if ( ! empty( $props['paddingRight'] ) ) {
            $styles[] = 'padding-right:' . esc_attr( $props['paddingRight'] );
        }

        if ( ! empty( $props['textAlign'] ) && 'left' !== $props['textAlign'] ) {
            $styles[] = 'text-align:' . esc_attr( $props['textAlign'] );
        }

        if ( 'flex' === $props['display'] ) {
            $styles[] = 'display:flex';
            $styles[] = 'flex-direction:' . esc_attr( $props['flexDirection'] );
            $styles[] = 'justify-content:' . esc_attr( $props['justifyContent'] );
            $styles[] = 'align-items:' . esc_attr( $props['alignItems'] );

            if ( ! empty( $props['gap'] ) && '0' !== $props['gap'] ) {
                $styles[] = 'gap:' . esc_attr( $props['gap'] );
            }
        }

        // Build attributes.
        $attrs = [
            'class' => implode( ' ', $classes ),
        ];

        if ( ! empty( $styles ) ) {
            $attrs['style'] = implode( ';', $styles );
        }

        if ( ! empty( $props['htmlId'] ) ) {
            $attrs['id'] = sanitize_html_class( $props['htmlId'] );
        } elseif ( ! empty( $id ) ) {
            $attrs['data-component-id'] = esc_attr( $id );
        }

        // Render children.
        $children_html = $this->render_children( $children, $context );

        // Build HTML.
        $html = '<div ' . $this->build_attributes( $attrs ) . '>';
        $html .= $children_html;
        $html .= '</div>';

        return $html;
    }
}
