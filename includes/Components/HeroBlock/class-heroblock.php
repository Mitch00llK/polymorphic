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

        $classes = [ 'hero-block', 'hero-block--' . sanitize_html_class( $props['alignment'] ) ];

        $html  = '<section class="' . esc_attr( implode( ' ', $classes ) ) . '" data-component-id="' . esc_attr( $id ) . '">';
        $html .= '<div class="hero-block__content">';
        $html .= '<h1 class="hero-block__title">' . esc_html( $props['title'] ) . '</h1>';
        $html .= '<p class="hero-block__subtitle">' . esc_html( $props['subtitle'] ) . '</p>';
        $html .= '<div class="hero-block__buttons">';
        $html .= '<a href="' . esc_url( $props['primaryButtonUrl'] ) . '" class="hero-block__btn-primary">' . esc_html( $props['primaryButtonText'] ) . '</a>';
        
        if ( $props['showSecondaryButton'] ) {
            $html .= '<a href="' . esc_url( $props['secondaryButtonUrl'] ) . '" class="hero-block__btn-secondary">' . esc_html( $props['secondaryButtonText'] ) . '</a>';
        }
        
        $html .= '</div>';
        $html .= '</div>';

        if ( ! empty( $props['imageUrl'] ) ) {
            $html .= '<div class="hero-block__image">';
            $html .= '<img src="' . esc_url( $props['imageUrl'] ) . '" alt="" />';
            $html .= '</div>';
        }

        $html .= '</section>';

        return $html;
    }
}
