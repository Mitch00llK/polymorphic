<?php
/**
 * Pricing Block Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\PricingBlock;

use Polymorphic\Components\Component_Base;

/**
 * Pricing table with multiple pricing cards.
 *
 * @since 1.0.0
 */
class PricingBlock extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'pricingBlock';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Pricing Block', 'polymorphic' );
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
        return 'dollar-sign';
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
            'title'           => 'Simple, Transparent Pricing',
            'subtitle'        => 'Choose the plan that works for you',
            'plans'           => [
                [
                    'name'        => 'Starter',
                    'price'       => '$9',
                    'period'      => '/month',
                    'description' => 'Perfect for small projects',
                    'features'    => [ '5 pages', 'Basic components', 'Email support' ],
                    'buttonText'  => 'Get Started',
                    'buttonUrl'   => '#',
                    'featured'    => false,
                ],
                [
                    'name'        => 'Pro',
                    'price'       => '$29',
                    'period'      => '/month',
                    'description' => 'Best for growing businesses',
                    'features'    => [ 'Unlimited pages', 'All components', 'Priority support', 'Custom domains' ],
                    'buttonText'  => 'Get Started',
                    'buttonUrl'   => '#',
                    'featured'    => true,
                ],
                [
                    'name'        => 'Enterprise',
                    'price'       => '$99',
                    'period'      => '/month',
                    'description' => 'For large organizations',
                    'features'    => [ 'Everything in Pro', 'Custom integrations', 'SLA guarantee', 'Dedicated account manager' ],
                    'buttonText'  => 'Contact Sales',
                    'buttonUrl'   => '#',
                    'featured'    => false,
                ],
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
     * @param array  $component Component data.
     * @param string $context   Render context.
     * @return string Rendered HTML.
     */
    public function render( array $component, string $context = 'frontend' ): string {
        $props = $this->merge_defaults( $component['props'] ?? [] );
        $id    = $component['id'] ?? '';
        $plans = $props['plans'] ?? [];

        // Build classes using poly-* convention.
        $classes = [ 'poly-pricing-block' ];

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build CSS variables.
        $css_vars = $this->build_css_variables( $props, [
            'backgroundColor' => 'background-color',
            'textColor'       => 'color',
            'paddingTop'      => 'padding-top',
            'paddingBottom'   => 'padding-bottom',
            'gap'             => 'gap',
        ]);

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        if ( ! empty( $css_vars ) ) {
            $attrs['style'] = $css_vars;
        }

        $html  = '<section ' . $this->build_attributes( $attrs ) . '>';
        $html .= '<div class="poly-pricing-block__header">';
        $html .= '<h2 class="poly-pricing-block__title">' . esc_html( $props['title'] ) . '</h2>';
        $html .= '<p class="poly-pricing-block__subtitle">' . esc_html( $props['subtitle'] ) . '</p>';
        $html .= '</div>';
        $html .= '<div class="poly-pricing-block__grid">';

        foreach ( $plans as $plan ) {
            $card_class = 'poly-pricing-block__card';
            if ( ! empty( $plan['featured'] ) ) {
                $card_class .= ' poly-pricing-block__card--featured';
            }

            $html .= '<div class="' . esc_attr( $card_class ) . '">';

            if ( ! empty( $plan['featured'] ) ) {
                $html .= '<span class="poly-pricing-block__badge">Most Popular</span>';
            }

            $html .= '<h3 class="poly-pricing-block__name">' . esc_html( $plan['name'] ?? '' ) . '</h3>';
            $html .= '<p class="poly-pricing-block__desc">' . esc_html( $plan['description'] ?? '' ) . '</p>';
            $html .= '<div class="poly-pricing-block__price">';
            $html .= '<span class="poly-pricing-block__amount">' . esc_html( $plan['price'] ?? '' ) . '</span>';
            $html .= '<span class="poly-pricing-block__period">' . esc_html( $plan['period'] ?? '' ) . '</span>';
            $html .= '</div>';

            $html .= '<ul class="poly-pricing-block__features">';
            foreach ( $plan['features'] ?? [] as $feature ) {
                $html .= '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>' . esc_html( $feature ) . '</span></li>';
            }
            $html .= '</ul>';

            $btn_class = ! empty( $plan['featured'] ) ? 'poly-pricing-block__btn--primary' : 'poly-pricing-block__btn';
            $html     .= '<a href="' . esc_url( $plan['buttonUrl'] ?? '#' ) . '" class="' . esc_attr( $btn_class ) . '">' . esc_html( $plan['buttonText'] ?? 'Get Started' ) . '</a>';

            $html .= '</div>';
        }

        $html .= '</div>';
        $html .= '</section>';

        return $html;
    }
}
