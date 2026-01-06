<?php
/**
 * Text Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Text;

use Polymorphic\Components\Component_Base;

/**
 * Text/paragraph component (Atom).
 *
 * @since 1.0.0
 */
class Text extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'text';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Text', 'polymorphic' );
    }

    /**
     * Get component category.
     *
     * @return string
     */
    public function get_category(): string {
        return 'typography';
    }

    /**
     * Get component icon.
     *
     * @return string
     */
    public function get_icon(): string {
        return 'type';
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
            'content'       => 'Enter your text here...',
            'tag'           => 'p',
            'variant'       => 'default',
            'textAlign'     => '',
            'fontSize'      => '',
            'fontWeight'    => '',
            'fontFamily'    => '',
            'lineHeight'    => '',
            'letterSpacing' => '',
            'textTransform' => '',
            'color'         => '',
            'marginTop'     => '',
            'marginBottom'  => '',
            'className'     => '',
            'htmlId'        => '',
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
        $props = $this->merge_defaults( $component['props'] ?? [] );
        $id    = $component['id'] ?? '';

        // Validate tag.
        $allowed_tags = [ 'p', 'div', 'span', 'blockquote', 'pre' ];
        $tag          = in_array( $props['tag'], $allowed_tags, true ) ? $props['tag'] : 'p';

        // Build CSS classes using poly-* convention.
        $classes = [ 'poly-text' ];

        if ( ! empty( $props['variant'] ) && 'default' !== $props['variant'] ) {
            $classes[] = 'poly-text--' . sanitize_html_class( $props['variant'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build CSS variables for clean DOM.
        $css_vars = $this->build_css_variables( $props, [
            'textAlign'     => 'text-align',
            'fontSize'      => 'font-size',
            'fontWeight'    => 'font-weight',
            'fontFamily'    => 'font-family',
            'lineHeight'    => 'line-height',
            'letterSpacing' => 'letter-spacing',
            'textTransform' => 'text-transform',
            'color'         => 'color',
            'marginTop'     => 'margin-top',
            'marginBottom'  => 'margin-bottom',
        ]);

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

        // Sanitize content (allow basic HTML).
        $content = wp_kses_post( $props['content'] );

        // Build HTML.
        $html  = '<' . $tag . ' ' . $this->build_attributes( $attrs ) . '>';
        $html .= $content;
        $html .= '</' . $tag . '>';

        return $html;
    }
}
