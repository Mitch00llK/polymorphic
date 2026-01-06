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
            'content'         => 'Enter your text here...',
            'tag'             => 'p',
            'variant'         => 'default',
            'textAlign'       => 'left',
            'fontSize'        => '',
            'fontWeight'      => '',
            'lineHeight'      => '',
            'letterSpacing'   => '',
            'color'           => '',
            'marginTop'       => '0',
            'marginBottom'    => '1rem',
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
        $props = $this->merge_defaults( $component['props'] ?? [] );
        $id    = $component['id'] ?? '';

        // Validate tag.
        $allowed_tags = [ 'p', 'div', 'span', 'blockquote', 'pre' ];
        $tag = in_array( $props['tag'], $allowed_tags, true ) ? $props['tag'] : 'p';

        // Build CSS classes (generic, no 'polymorphic-' prefix).
        $classes = [ 'text' ];

        if ( ! empty( $props['variant'] ) && 'default' !== $props['variant'] ) {
            $classes[] = 'text--' . sanitize_html_class( $props['variant'] );
        }

        if ( ! empty( $props['textAlign'] ) && 'left' !== $props['textAlign'] ) {
            $classes[] = 'text-' . sanitize_html_class( $props['textAlign'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build inline styles.
        $styles = [];

        if ( ! empty( $props['fontSize'] ) ) {
            $styles[] = 'font-size:' . esc_attr( $props['fontSize'] );
        }

        if ( ! empty( $props['fontWeight'] ) ) {
            $styles[] = 'font-weight:' . esc_attr( $props['fontWeight'] );
        }

        if ( ! empty( $props['lineHeight'] ) ) {
            $styles[] = 'line-height:' . esc_attr( $props['lineHeight'] );
        }

        if ( ! empty( $props['letterSpacing'] ) ) {
            $styles[] = 'letter-spacing:' . esc_attr( $props['letterSpacing'] );
        }

        if ( ! empty( $props['color'] ) ) {
            $styles[] = 'color:' . esc_attr( $props['color'] );
        }

        if ( ! empty( $props['marginTop'] ) && '0' !== $props['marginTop'] ) {
            $styles[] = 'margin-top:' . esc_attr( $props['marginTop'] );
        }

        if ( ! empty( $props['marginBottom'] ) && '1rem' !== $props['marginBottom'] ) {
            $styles[] = 'margin-bottom:' . esc_attr( $props['marginBottom'] );
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

        // Sanitize content (allow basic HTML).
        $content = wp_kses_post( $props['content'] );

        // Build HTML.
        $html = '<' . $tag . ' ' . $this->build_attributes( $attrs ) . '>';
        $html .= $content;
        $html .= '</' . $tag . '>';

        return $html;
    }
}
