<?php
/**
 * Base class for all components.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components;

/**
 * Abstract base class that all components extend.
 *
 * @since 1.0.0
 */
abstract class Component_Base {

    /**
     * Component registry reference.
     *
     * @var Component_Registry
     */
    protected Component_Registry $registry;

    /**
     * Default property values.
     *
     * @var array
     */
    protected array $defaults = [];

    /**
     * Constructor.
     *
     * @since 1.0.0
     *
     * @param Component_Registry $registry Component registry.
     */
    public function __construct( Component_Registry $registry ) {
        $this->registry = $registry;
    }

    /**
     * Get the component type identifier.
     *
     * @since 1.0.0
     *
     * @return string
     */
    abstract public function get_type(): string;

    /**
     * Get the human-readable label.
     *
     * @since 1.0.0
     *
     * @return string
     */
    abstract public function get_label(): string;

    /**
     * Get the component category.
     *
     * @since 1.0.0
     *
     * @return string
     */
    abstract public function get_category(): string;

    /**
     * Get the icon name.
     *
     * @since 1.0.0
     *
     * @return string
     */
    abstract public function get_icon(): string;

    /**
     * Render the component.
     *
     * @since 1.0.0
     *
     * @param array  $data    Component data.
     * @param string $context Render context.
     * @return string Rendered HTML.
     */
    abstract public function render( array $data, string $context = 'frontend' ): string;

    /**
     * Whether this component supports children.
     *
     * @since 1.0.0
     *
     * @return bool
     */
    public function supports_children(): bool {
        return false;
    }

    /**
     * Get default property values.
     *
     * @since 1.0.0
     *
     * @return array
     */
    public function get_defaults(): array {
        /**
         * Filter component defaults.
         *
         * @since 1.0.0
         *
         * @param array  $defaults Default properties.
         * @param string $type     Component type.
         */
        return apply_filters(
            'polymorphic/component/defaults',
            $this->defaults,
            $this->get_type()
        );
    }

    /**
     * Parse props with defaults.
     *
     * @since 1.0.0
     *
     * @param array $props Raw properties.
     * @return array Parsed properties.
     */
    protected function parse_props( array $props ): array {
        return wp_parse_args( $props, $this->get_defaults() );
    }

    /**
     * Render children components.
     *
     * @since 1.0.0
     *
     * @param array  $children Children component data.
     * @param string $context  Render context.
     * @return string Rendered HTML.
     */
    protected function render_children( array $children, string $context = 'frontend' ): string {
        $html = '';

        foreach ( $children as $child ) {
            $html .= $this->registry->render( $child, $context );
        }

        return $html;
    }

    /**
     * Build inline styles from props.
     *
     * @since 1.0.0
     *
     * @param array $props         Properties.
     * @param array $style_mapping Map of prop keys to CSS properties.
     * @return string Inline style string.
     */
    protected function build_styles( array $props, array $style_mapping ): string {
        $styles = [];

        foreach ( $style_mapping as $prop_key => $css_property ) {
            if ( ! empty( $props[ $prop_key ] ) ) {
                $value = esc_attr( $props[ $prop_key ] );
                $styles[] = "{$css_property}: {$value}";
            }
        }

        return implode( '; ', $styles );
    }

    /**
     * Build class list.
     *
     * @since 1.0.0
     *
     * @param array $classes      Base classes.
     * @param array $conditionals Conditional classes [ condition => class ].
     * @return string Class string.
     */
    protected function build_classes( array $classes, array $conditionals = [] ): string {
        foreach ( $conditionals as $condition => $class ) {
            if ( $condition ) {
                $classes[] = $class;
            }
        }

        return esc_attr( implode( ' ', array_filter( $classes ) ) );
    }
}
