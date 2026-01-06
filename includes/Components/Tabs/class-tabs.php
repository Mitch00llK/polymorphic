<?php
/**
 * Tabs Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Tabs;

use Polymorphic\Components\Component_Base;

/**
 * Tabs component with accessible tab items.
 *
 * @since 1.0.0
 */
class Tabs extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'tabs';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Tabs', 'polymorphic' );
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
        return 'layers';
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
            'defaultTab' => '',
            'tabs'       => [],
            'className'  => '',
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
        $tabs  = $props['tabs'] ?? [];

        if ( empty( $tabs ) ) {
            $tabs = [
                [
                    'id'      => 'tab1',
                    'label'   => 'Tab 1',
                    'content' => 'Content for Tab 1',
                ],
                [
                    'id'      => 'tab2',
                    'label'   => 'Tab 2',
                    'content' => 'Content for Tab 2',
                ],
            ];
        }

        // Build classes.
        $classes = [ 'tabs' ];

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        // Build HTML.
        $html = '<div ' . $this->build_attributes( $attrs ) . '>';

        // Tab List.
        $html .= '<div class="tabs__list" role="tablist">';
        foreach ( $tabs as $index => $tab ) {
            $tab_id   = $tab['id'] ?? uniqid( 'tab-' );
            $label    = $tab['label'] ?? '';
            $active   = ( 0 === $index ) ? 'true' : 'false';
            
            $html .= '<button type="button" class="tabs__trigger" role="tab" aria-selected="' . esc_attr( $active ) . '" aria-controls="panel-' . esc_attr( $tab_id ) . '" id="tab-' . esc_attr( $tab_id ) . '">';
            $html .= esc_html( $label );
            $html .= '</button>';
        }
        $html .= '</div>';

        // Tab Content Panels.
        foreach ( $tabs as $index => $tab ) {
            $tab_id   = $tab['id'] ?? uniqid( 'tab-' );
            $content  = $tab['content'] ?? '';
            $hidden   = ( 0 === $index ) ? '' : 'hidden';

            $html .= '<div class="tabs__content" id="panel-' . esc_attr( $tab_id ) . '" role="tabpanel" aria-labelledby="tab-' . esc_attr( $tab_id ) . '" ' . $hidden . '>';
            $html .= wp_kses_post( $content );
            $html .= '</div>';
        }

        $html .= '</div>';

        return $html;
    }
}
