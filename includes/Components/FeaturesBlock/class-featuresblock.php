<?php
/**
 * Features Block Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\FeaturesBlock;

use Polymorphic\Components\Component_Base;

/**
 * Features grid with title, subtitle, and feature cards.
 *
 * @since 1.0.0
 */
class FeaturesBlock extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'featuresBlock';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Features Block', 'polymorphic' );
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
        return 'grid-3x3';
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
            'title'           => 'Why Choose Us',
            'subtitle'        => 'Everything you need to build amazing websites',
            'columns'         => 3,
            'features'        => [
                [ 'icon' => 'zap', 'title' => 'Lightning Fast', 'description' => 'Optimized for speed and performance' ],
                [ 'icon' => 'shield', 'title' => 'Secure', 'description' => 'Built with security best practices' ],
                [ 'icon' => 'rocket', 'title' => 'Easy to Use', 'description' => 'Intuitive drag-and-drop interface' ],
            ],
            'backgroundColor' => '',
            'textColor'       => '',
            'paddingTop'      => '',
            'paddingBottom'   => '',
            'gap'             => '',
            'className'       => '',
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
        $props    = $this->merge_defaults( $component['props'] ?? [] );
        $id       = $component['id'] ?? '';
        $features = $props['features'] ?? [];
        $columns  = (int) $props['columns'];

        // Build classes using poly-* convention.
        $classes = [ 'poly-features-block' ];

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
        $html .= '<div class="poly-features-block__header">';
        $html .= '<h2 class="poly-features-block__title">' . esc_html( $props['title'] ) . '</h2>';
        $html .= '<p class="poly-features-block__subtitle">' . esc_html( $props['subtitle'] ) . '</p>';
        $html .= '</div>';
        $html .= '<div class="poly-features-block__grid" data-columns="' . esc_attr( $columns ) . '">';

        foreach ( $features as $feature ) {
            $html .= '<div class="poly-features-block__card">';
            $html .= '<div class="poly-features-block__icon">' . $this->get_icon_svg( $feature['icon'] ?? 'zap' ) . '</div>';
            $html .= '<h3 class="poly-features-block__card-title">' . esc_html( $feature['title'] ?? '' ) . '</h3>';
            $html .= '<p class="poly-features-block__card-desc">' . esc_html( $feature['description'] ?? '' ) . '</p>';
            $html .= '</div>';
        }

        $html .= '</div>';
        $html .= '</section>';

        return $html;
    }

    /**
     * Get SVG icon by name.
     *
     * @param string $name Icon name.
     * @return string SVG markup.
     */
    private function get_icon_svg( string $name ): string {
        $icons = [
            'zap'    => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
            'shield' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            'rocket' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
            'star'   => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
            'heart'  => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
            'globe'  => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        ];

        return $icons[ $name ] ?? $icons['zap'];
    }
}
