<?php
/**
 * Button Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Button;

use Polymorphic\Components\Component_Base;

/**
 * Interactive button component (Atom).
 *
 * @since 1.0.0
 */
class Button extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'button';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Button', 'polymorphic' );
    }

    /**
     * Get component category.
     *
     * @return string
     */
    public function get_category(): string {
        return 'basic';
    }

    /**
     * Get component icon.
     *
     * @return string
     */
    public function get_icon(): string {
        return 'mouse-pointer-click';
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
            'text'            => 'Click Me',
            'url'             => '#',
            'target'          => '_self',
            'rel'             => '',
            'variant'         => 'primary',
            'size'            => 'default',
            'fullWidth'       => false,
            'icon'            => '',
            'iconPosition'    => 'left',
            'backgroundColor' => '',
            'textColor'       => '',
            'borderColor'     => '',
            'borderRadius'    => '',
            'paddingX'        => '',
            'paddingY'        => '',
            'fontSize'        => '',
            'fontWeight'      => '',
            'marginTop'       => '',
            'marginBottom'    => '',
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

        // Build CSS classes using poly-* convention.
        $classes = [ 'poly-button' ];

        // Variant modifier.
        if ( ! empty( $props['variant'] ) ) {
            $classes[] = 'poly-button--' . sanitize_html_class( $props['variant'] );
        }

        // Size modifier.
        if ( ! empty( $props['size'] ) && 'default' !== $props['size'] ) {
            $classes[] = 'poly-button--' . sanitize_html_class( $props['size'] );
        }

        // Full width modifier.
        if ( $props['fullWidth'] ) {
            $classes[] = 'poly-button--full';
        }

        // Has icon modifier.
        if ( ! empty( $props['icon'] ) ) {
            $classes[] = 'poly-button--has-icon';
            $classes[] = 'poly-button--icon-' . sanitize_html_class( $props['iconPosition'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build CSS variables for clean DOM.
        $css_vars = $this->build_css_variables( $props, [
            'backgroundColor' => 'background-color',
            'textColor'       => 'color',
            'borderColor'     => 'border-color',
            'borderRadius'    => 'border-radius',
            'fontSize'        => 'font-size',
            'fontWeight'      => 'font-weight',
            'marginTop'       => 'margin-top',
            'marginBottom'    => 'margin-bottom',
        ]);

        // Handle padding separately (paddingX/paddingY).
        if ( ! empty( $props['paddingX'] ) ) {
            $css_vars .= ( ! empty( $css_vars ) ? '; ' : '' ) . '--poly-padding-left: ' . esc_attr( $props['paddingX'] );
            $css_vars .= '; --poly-padding-right: ' . esc_attr( $props['paddingX'] );
        }

        if ( ! empty( $props['paddingY'] ) ) {
            $css_vars .= ( ! empty( $css_vars ) ? '; ' : '' ) . '--poly-padding-top: ' . esc_attr( $props['paddingY'] );
            $css_vars .= '; --poly-padding-bottom: ' . esc_attr( $props['paddingY'] );
        }

        // Build link attributes.
        $attrs = [
            'class' => implode( ' ', $classes ),
            'href'  => esc_url( $props['url'] ),
        ];

        if ( ! empty( $css_vars ) ) {
            $attrs['style'] = $css_vars;
        }

        if ( ! empty( $props['htmlId'] ) ) {
            $attrs['id'] = sanitize_html_class( $props['htmlId'] );
        }

        $attrs['data-component-id'] = esc_attr( $id );

        if ( '_blank' === $props['target'] ) {
            $attrs['target'] = '_blank';
            $attrs['rel']    = ! empty( $props['rel'] ) ? esc_attr( $props['rel'] ) : 'noopener noreferrer';
        } elseif ( ! empty( $props['rel'] ) ) {
            $attrs['rel'] = esc_attr( $props['rel'] );
        }

        // Build HTML.
        $html = '<a ' . $this->build_attributes( $attrs ) . '>';

        // Icon before text.
        if ( ! empty( $props['icon'] ) && 'left' === $props['iconPosition'] ) {
            $html .= '<span class="poly-button__icon">' . $this->render_icon( $props['icon'] ) . '</span>';
        }

        // Button text.
        $html .= '<span class="poly-button__text">' . esc_html( $props['text'] ) . '</span>';

        // Icon after text.
        if ( ! empty( $props['icon'] ) && 'right' === $props['iconPosition'] ) {
            $html .= '<span class="poly-button__icon">' . $this->render_icon( $props['icon'] ) . '</span>';
        }

        $html .= '</a>';

        return $html;
    }

    /**
     * Render an icon.
     *
     * @param string $icon Icon name.
     * @return string SVG icon markup.
     */
    private function render_icon( string $icon ): string {
        // Simple arrow icons for now - can be extended.
        $icons = [
            'arrow-right' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
            'arrow-left'  => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            'external'    => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
            'download'    => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
        ];

        return $icons[ $icon ] ?? '';
    }
}
