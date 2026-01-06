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
            'backgroundColor'    => '',
            'backgroundImage'    => '',
            'backgroundSize'     => 'cover',
            'backgroundPosition' => 'center',
            'paddingTop'         => '4rem',
            'paddingBottom'      => '4rem',
            'paddingLeft'        => '0',
            'paddingRight'       => '0',
            'marginTop'          => '0',
            'marginBottom'       => '0',
            'minHeight'          => '',
            'maxWidth'           => '',
            'style'              => 'default',
            'verticalAlign'      => 'start',
            'overflow'           => 'visible',
            'className'          => '',
            'htmlId'             => '',
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

        // Build CSS classes using poly-* convention.
        $classes = [ 'poly-section' ];

        if ( ! empty( $props['style'] ) && 'default' !== $props['style'] ) {
            $classes[] = 'poly-section--' . sanitize_html_class( $props['style'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build CSS variables for clean DOM.
        $css_vars = $this->build_css_variables( $props, [
            'backgroundColor'    => 'background-color',
            'backgroundSize'     => 'background-size',
            'backgroundPosition' => 'background-position',
            'paddingTop'         => 'padding-top',
            'paddingBottom'      => 'padding-bottom',
            'paddingLeft'        => 'padding-left',
            'paddingRight'       => 'padding-right',
            'marginTop'          => 'margin-top',
            'marginBottom'       => 'margin-bottom',
            'minHeight'          => 'min-height',
            'maxWidth'           => 'max-width',
            'overflow'           => 'overflow',
        ]);

        // Handle background image separately (needs url() wrapper).
        if ( ! empty( $props['backgroundImage'] ) ) {
            $css_vars .= ( ! empty( $css_vars ) ? '; ' : '' ) . '--poly-background-image: url(' . esc_url( $props['backgroundImage'] ) . ')';
        }

        // Build attributes.
        $attrs = [
            'class' => implode( ' ', $classes ),
        ];

        if ( ! empty( $css_vars ) ) {
            $attrs['style'] = $css_vars;
        }

        if ( ! empty( $props['htmlId'] ) ) {
            $attrs['id'] = sanitize_html_class( $props['htmlId'] );
        }

        $attrs['data-component-id'] = esc_attr( $id );

        // Render children.
        $children_html = $this->render_children( $children, $context );

        // Build HTML.
        $html  = '<section ' . $this->build_attributes( $attrs ) . '>';
        $html .= '<div class="poly-section__inner">';
        $html .= $children_html;
        $html .= '</div>';
        $html .= '</section>';

        return $html;
    }
}
