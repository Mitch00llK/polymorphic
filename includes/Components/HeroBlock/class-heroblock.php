<?php
/**
 * Hero Block Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\HeroBlock;

use Polymorphic\Components\Component_Base;

/**
 * Hero section with title, subtitle, buttons, and optional image.
 *
 * @since 1.0.0
 */
class HeroBlock extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'heroBlock';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Hero Block', 'polymorphic' );
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
        return 'star';
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
            'title'               => 'Build something amazing',
            'subtitle'            => 'Create beautiful, responsive websites with our intuitive page builder.',
            'primaryButtonText'   => 'Get Started',
            'primaryButtonUrl'    => '#',
            'secondaryButtonText' => 'Learn More',
            'secondaryButtonUrl'  => '#',
            'showSecondaryButton' => true,
            'imageUrl'            => '',
            'alignment'           => 'center',
            'backgroundColor'     => '',
            'backgroundImage'     => '',
            'textColor'           => '',
            'paddingTop'          => '',
            'paddingBottom'       => '',
            'minHeight'           => '',
            'className'           => '',
        ];
    }

    /**
     * Render the component.
     *
     * @param array        $component Component data.
     * @param string|array $context   Render context.
     * @return string Rendered HTML.
     */
    public function render( array $component, $context = 'frontend' ): string {
        $props = $this->merge_defaults( $component['props'] ?? [] );
        $id    = $component['id'] ?? '';

        // Build classes using poly-* convention.
        $classes = [ 'poly-hero-block', 'poly-hero-block--' . sanitize_html_class( $props['alignment'] ) ];

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
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        $html  = '<section ' . $this->build_attributes( $attrs ) . '>';
        $html .= '<div class="poly-hero-block__content">';
        $html .= '<h1 class="poly-hero-block__title">' . esc_html( $props['title'] ) . '</h1>';
        $html .= '<p class="poly-hero-block__subtitle">' . esc_html( $props['subtitle'] ) . '</p>';
        $html .= '<div class="poly-hero-block__buttons">';
        $html .= '<a href="' . esc_url( $props['primaryButtonUrl'] ) . '" class="poly-hero-block__btn-primary">' . esc_html( $props['primaryButtonText'] ) . '</a>';

        if ( $props['showSecondaryButton'] ) {
            $html .= '<a href="' . esc_url( $props['secondaryButtonUrl'] ) . '" class="poly-hero-block__btn-secondary">' . esc_html( $props['secondaryButtonText'] ) . '</a>';
        }

        $html .= '</div>';
        $html .= '</div>';

        if ( ! empty( $props['imageUrl'] ) ) {
            $html .= '<div class="poly-hero-block__image">';
            $html .= '<img src="' . esc_url( $props['imageUrl'] ) . '" alt="" />';
            $html .= '</div>';
        }

        $html .= '</section>';

        return $html;
    }
}
