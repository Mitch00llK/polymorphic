<?php
/**
 * FAQ Block Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\FaqBlock;

use Polymorphic\Components\Component_Base;

/**
 * FAQ section with title and accordion items.
 *
 * @since 1.0.0
 */
class FaqBlock extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'faqBlock';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'FAQ Block', 'polymorphic' );
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
        return 'help-circle';
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
            'title'    => 'Frequently Asked Questions',
            'subtitle' => 'Find answers to common questions',
            'items'    => [
                [ 'question' => 'How do I get started?', 'answer' => 'Simply sign up for an account and start building your first page using our drag-and-drop editor.' ],
                [ 'question' => 'Can I use my own domain?', 'answer' => 'Yes! You can connect your custom domain to any plan. Pro and Enterprise plans include free SSL certificates.' ],
                [ 'question' => 'Is there a free trial?', 'answer' => 'We offer a 14-day free trial on all plans. No credit card required to get started.' ],
                [ 'question' => 'How do I cancel my subscription?', 'answer' => 'You can cancel your subscription at any time from your account settings. Your access continues until the end of your billing period.' ],
            ],
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
        $items = $props['items'] ?? [];

        $html  = '<section class="faq-block" data-component-id="' . esc_attr( $id ) . '">';
        $html .= '<div class="faq-block__header">';
        $html .= '<h2 class="faq-block__title">' . esc_html( $props['title'] ) . '</h2>';
        $html .= '<p class="faq-block__subtitle">' . esc_html( $props['subtitle'] ) . '</p>';
        $html .= '</div>';
        $html .= '<div class="accordion" data-type="single">';

        foreach ( $items as $index => $item ) {
            $item_id = 'faq-' . esc_attr( $id ) . '-' . $index;
            
            $html .= '<div class="accordion__item">';
            $html .= '<h3 class="accordion__header">';
            $html .= '<button type="button" class="accordion__trigger" aria-controls="' . esc_attr( $item_id ) . '" aria-expanded="false">';
            $html .= esc_html( $item['question'] ?? '' );
            $html .= '<span class="accordion__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></span>';
            $html .= '</button>';
            $html .= '</h3>';
            $html .= '<div id="' . esc_attr( $item_id ) . '" class="accordion__content" hidden>';
            $html .= '<div class="accordion__content-inner">' . wp_kses_post( $item['answer'] ?? '' ) . '</div>';
            $html .= '</div>';
            $html .= '</div>';
        }

        $html .= '</div>';
        $html .= '</section>';

        return $html;
    }
}
