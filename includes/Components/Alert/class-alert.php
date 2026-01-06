<?php
/**
 * Alert Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Alert;

use Polymorphic\Components\Component_Base;

/**
 * Alert/notification component with variants.
 *
 * @since 1.0.0
 */
class Alert extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'alert';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Alert', 'polymorphic' );
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
        return 'alert-circle';
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
            'title'       => '',
            'description' => '',
            'variant'     => 'info',
            'className'   => '',
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

        // Build classes.
        $classes = [ 'alert', 'alert--' . sanitize_html_class( $props['variant'] ) ];

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build attributes.
        $attrs = [
            'class'             => implode( ' ', $classes ),
            'role'              => 'alert',
            'data-component-id' => esc_attr( $id ),
        ];

        // Icon SVG based on variant.
        $icons = [
            'info'    => '<svg class="alert__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
            'success' => '<svg class="alert__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            'warning' => '<svg class="alert__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            'error'   => '<svg class="alert__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        ];

        $icon = $icons[ $props['variant'] ] ?? $icons['info'];

        // Build HTML.
        $html = '<div ' . $this->build_attributes( $attrs ) . '>';
        $html .= $icon;
        $html .= '<div class="alert__content">';

        if ( ! empty( $props['title'] ) ) {
            $html .= '<h5 class="alert__title">' . esc_html( $props['title'] ) . '</h5>';
        }

        if ( ! empty( $props['description'] ) ) {
            $html .= '<p class="alert__description">' . esc_html( $props['description'] ) . '</p>';
        }

        $html .= '</div>';
        $html .= '</div>';

        return $html;
    }
}
