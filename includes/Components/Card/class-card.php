<?php
/**
 * Card Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Card;

use Polymorphic\Components\Component_Base;

/**
 * Card component with header, content, and footer.
 *
 * @since 1.0.0
 */
class Card extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'card';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Card', 'polymorphic' );
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
        return 'credit-card';
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
            'title'           => '',
            'description'     => '',
            'footer'          => '',
            'variant'         => 'default',
            'backgroundColor' => '',
            'borderRadius'    => '',
            'padding'         => '',
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
        $props    = $this->merge_defaults( $component['props'] ?? [] );
        $id       = $component['id'] ?? '';
        $children = $component['children'] ?? [];

        // Build classes.
        $classes = [ 'card' ];

        if ( 'default' !== $props['variant'] ) {
            $classes[] = 'card--' . sanitize_html_class( $props['variant'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build styles.
        $styles = [];

        if ( ! empty( $props['backgroundColor'] ) ) {
            $styles[] = 'background-color:' . esc_attr( $props['backgroundColor'] );
        }

        if ( ! empty( $props['borderRadius'] ) ) {
            $styles[] = 'border-radius:' . esc_attr( $props['borderRadius'] );
        }

        if ( ! empty( $props['padding'] ) ) {
            $styles[] = 'padding:' . esc_attr( $props['padding'] );
        }

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        if ( ! empty( $styles ) ) {
            $attrs['style'] = implode( ';', $styles );
        }

        // Build HTML.
        $html = '<div ' . $this->build_attributes( $attrs ) . '>';

        // Header.
        if ( ! empty( $props['title'] ) || ! empty( $props['description'] ) ) {
            $html .= '<div class="card__header">';
            if ( ! empty( $props['title'] ) ) {
                $html .= '<h3 class="card__title">' . esc_html( $props['title'] ) . '</h3>';
            }
            if ( ! empty( $props['description'] ) ) {
                $html .= '<p class="card__description">' . esc_html( $props['description'] ) . '</p>';
            }
            $html .= '</div>';
        }

        // Content.
        $html .= '<div class="card__content">';
        $html .= $this->render_children( $children, $context );
        $html .= '</div>';

        // Footer.
        if ( ! empty( $props['footer'] ) ) {
            $html .= '<div class="card__footer">';
            $html .= '<p>' . esc_html( $props['footer'] ) . '</p>';
            $html .= '</div>';
        }

        $html .= '</div>';

        return $html;
    }
}
