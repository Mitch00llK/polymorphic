<?php
/**
 * Accordion Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Accordion;

use Polymorphic\Components\Component_Base;

/**
 * Accordion component with collapsible items.
 *
 * @since 1.0.0
 */
class Accordion extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'accordion';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Accordion', 'polymorphic' );
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
        return 'chevron-down';
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
            'type'            => 'single',
            'defaultValue'    => '',
            'items'           => [],
            'backgroundColor' => '',
            'borderColor'     => '',
            'borderRadius'    => '',
            'padding'         => '',
            'marginTop'       => '',
            'marginBottom'    => '',
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
        $items = $props['items'] ?? [];

        if ( empty( $items ) ) {
            $items = [
                [
                    'id'      => '1',
                    'title'   => 'Accordion Item 1',
                    'content' => 'Content for item 1',
                ],
                [
                    'id'      => '2',
                    'title'   => 'Accordion Item 2',
                    'content' => 'Content for item 2',
                ],
            ];
        }

        // Build classes using poly-* convention.
        $classes = [ 'poly-accordion' ];

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build CSS variables.
        $css_vars = $this->build_css_variables( $props, [
            'backgroundColor' => 'background-color',
            'borderColor'     => 'border-color',
            'borderRadius'    => 'border-radius',
            'padding'         => 'padding',
            'marginTop'       => 'margin-top',
            'marginBottom'    => 'margin-bottom',
        ]);

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
            'data-type'         => esc_attr( $props['type'] ),
        ];

        if ( ! empty( $css_vars ) ) {
            $attrs['style'] = $css_vars;
        }

        // Build HTML.
        $html = '<div ' . $this->build_attributes( $attrs ) . '>';

        foreach ( $items as $item ) {
            $item_id = $item['id'] ?? uniqid( 'item-' );
            $title   = $item['title'] ?? '';
            $content = $item['content'] ?? '';

            $html .= '<div class="poly-accordion__item">';

            // Header/Trigger.
            $html .= '<h3 class="poly-accordion__header">';
            $html .= '<button type="button" class="poly-accordion__trigger" aria-controls="content-' . esc_attr( $item_id ) . '" aria-expanded="false">';
            $html .= esc_html( $title );
            $html .= '<span class="poly-accordion__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></span>';
            $html .= '</button>';
            $html .= '</h3>';

            // Content.
            $html .= '<div id="content-' . esc_attr( $item_id ) . '" class="poly-accordion__content" hidden>';
            $html .= '<div class="poly-accordion__content-inner">';
            $html .= wp_kses_post( $content );
            $html .= '</div>';
            $html .= '</div>';

            $html .= '</div>'; // End item.
        }

        $html .= '</div>';

        return $html;
    }
}
