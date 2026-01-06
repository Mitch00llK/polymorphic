<?php
/**
 * CTA Block Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\CtaBlock;

use Polymorphic\Components\Component_Base;

/**
 * Call-to-action section with title, description, and button.
 *
 * @since 1.0.0
 */
class CtaBlock extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'ctaBlock';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'CTA Block', 'polymorphic' );
    }

    /**
     * Get component category.
     *
     * @return string
     */
    public function get_category(): string {
        return 'blocks';
    }

    /**
     * Get component icon.
     *
     * @return string
     */
    public function get_icon(): string {
        return 'megaphone';
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
            'title'           => 'Ready to get started?',
            'description'     => 'Join thousands of users building amazing websites with our page builder.',
            'buttonText'      => 'Start Building Now',
            'buttonUrl'       => '#',
            'variant'         => 'default',
            'backgroundColor' => '',
            'backgroundImage' => '',
            'textColor'       => '',
            'paddingTop'      => '',
            'paddingBottom'   => '',
            'borderRadius'    => '',
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
        $classes = [ 'poly-cta-block' ];
        if ( 'default' !== $props['variant'] ) {
            $classes[] = 'poly-cta-block--' . sanitize_html_class( $props['variant'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build CSS variables.
        $css_vars = $this->build_css_variables( $props, [
            'backgroundColor' => 'background-color',
            'textColor'       => 'color',
            'paddingTop'      => 'padding-top',
            'paddingBottom'   => 'padding-bottom',
            'borderRadius'    => 'border-radius',
        ]);

        // Handle background image.
        if ( ! empty( $props['backgroundImage'] ) ) {
            $css_vars .= ( ! empty( $css_vars ) ? '; ' : '' ) . '--poly-background-image: url(' . esc_url( $props['backgroundImage'] ) . ')';
        }

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        if ( ! empty( $css_vars ) ) {
            $attrs['style'] = $css_vars;
        }

        $html  = '<section ' . $this->build_attributes( $attrs ) . '>';
        $html .= '<div class="poly-cta-block__content">';
        $html .= '<h2 class="poly-cta-block__title">' . esc_html( $props['title'] ) . '</h2>';
        $html .= '<p class="poly-cta-block__desc">' . esc_html( $props['description'] ) . '</p>';
        $html .= '<a href="' . esc_url( $props['buttonUrl'] ) . '" class="poly-cta-block__btn">' . esc_html( $props['buttonText'] ) . '</a>';
        $html .= '</div>';
        $html .= '</section>';

        return $html;
    }
}
