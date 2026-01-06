<?php
/**
 * Section Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Section;

use Polymorphic\Components\Component_Base;

/**
 * Full-width page section component (Organism).
 *
 * @since 1.0.0
 */
class Section extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'section';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Section', 'polymorphic' );
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
        return 'layout';
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
            'backgroundColor' => '',
            'backgroundImage' => '',
            'backgroundSize'  => 'cover',
            'backgroundPosition' => 'center',
            'paddingTop'      => '4rem',
            'paddingBottom'   => '4rem',
            'paddingLeft'     => '0',
            'paddingRight'    => '0',
            'marginTop'       => '0',
            'marginBottom'    => '0',
            'minHeight'       => '',
            'maxWidth'        => '',
            'style'           => 'default',
            'verticalAlign'   => 'start',
            'overflow'        => 'visible',
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
        $classes = [ 'section' ];

        if ( ! empty( $props['style'] ) && 'default' !== $props['style'] ) {
            $classes[] = 'section--' . sanitize_html_class( $props['style'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build inline styles.
        $styles = [];

        if ( ! empty( $props['backgroundColor'] ) ) {
            $styles[] = 'background-color:' . esc_attr( $props['backgroundColor'] );
        }

        if ( ! empty( $props['backgroundImage'] ) ) {
            $styles[] = 'background-image:url(' . esc_url( $props['backgroundImage'] ) . ')';
            $styles[] = 'background-size:' . esc_attr( $props['backgroundSize'] );
            $styles[] = 'background-position:' . esc_attr( $props['backgroundPosition'] );
        }

        if ( ! empty( $props['paddingTop'] ) ) {
            $styles[] = 'padding-top:' . esc_attr( $props['paddingTop'] );
        }

        if ( ! empty( $props['paddingBottom'] ) ) {
            $styles[] = 'padding-bottom:' . esc_attr( $props['paddingBottom'] );
        }

        if ( ! empty( $props['marginTop'] ) && '0' !== $props['marginTop'] ) {
            $styles[] = 'margin-top:' . esc_attr( $props['marginTop'] );
        }

        if ( ! empty( $props['marginBottom'] ) && '0' !== $props['marginBottom'] ) {
            $styles[] = 'margin-bottom:' . esc_attr( $props['marginBottom'] );
        }

        if ( ! empty( $props['minHeight'] ) ) {
            $styles[] = 'min-height:' . esc_attr( $props['minHeight'] );
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
        $html = '<section ' . $this->build_attributes( $attrs ) . '>';
        $html .= '<div class="section__inner">';
        $html .= $children_html;
        $html .= '</div>';
        $html .= '</section>';

        return $html;
    }
}
