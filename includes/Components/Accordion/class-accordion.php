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
            'type'         => 'single',
            'defaultValue' => '',
            'items'        => [],
            'className'    => '',
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

        // Build classes.
        $classes = [ 'accordion' ];

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
            'data-type'         => esc_attr( $props['type'] ),
        ];

        // JavaScript handles the interactivity, but we render valid HTML structure.
        $html = '<div ' . $this->build_attributes( $attrs ) . '>';

        foreach ( $items as $item ) {
            $item_id = $item['id'] ?? uniqid( 'item-' );
            $title   = $item['title'] ?? '';
            $content = $item['content'] ?? '';

            $html .= '<div class="accordion__item">';
            
            // Header/Trigger.
            $html .= '<h3 class="accordion__header">';
            $html .= '<button type="button" class="accordion__trigger" aria-controls="content-' . esc_attr( $item_id ) . '" aria-expanded="false">';
            $html .= esc_html( $title );
            $html .= '<span class="accordion__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></span>';
            $html .= '</button>';
            $html .= '</h3>';

            // Content.
            $html .= '<div id="content-' . esc_attr( $item_id ) . '" class="accordion__content" hidden>';
            $html .= '<div class="accordion__content-inner">';
            $html .= wp_kses_post( $content );
            $html .= '</div>';
            $html .= '</div>';

            $html .= '</div>'; // End item.
        }

        $html .= '</div>';

        // Add vanilla JS script for simple toggling if not already present.
        // In a real scenario, this should be in a separate JS file enqueued by the plugin.
        // For simplicity and to ensure standard JS functionality without React, we can inline it or rely on global theme JS.
        // Assuming theme/global JS handles `.accordion` interactions.
        
        return $html;
    }
}
