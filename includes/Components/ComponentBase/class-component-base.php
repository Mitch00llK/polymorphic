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
     * @param array        $data    Component data.
     * @param string|array $context Render context or context array.
     * @return string Rendered HTML.
     */
    abstract public function render( array $data, $context = 'frontend' ): string;

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
     * Merge props with defaults (alias for parse_props).
     *
     * @since 1.0.0
     *
     * @param array $props Raw properties.
     * @return array Merged properties.
     */
    protected function merge_defaults( array $props ): array {
        return $this->parse_props( $props );
    }

    /**
     * Normalize context to array format.
     *
     * @since 1.0.0
     *
     * @param string|array $context Context string or array.
     * @return array Normalized context.
     */
    protected function normalize_context( $context ): array {
        if ( is_string( $context ) ) {
            return [
                'mode'      => $context,
                'class_map' => [],
            ];
        }

        return wp_parse_args(
            $context,
            [
                'mode'      => 'frontend',
                'class_map' => [],
            ]
        );
    }

    /**
     * Check if rendering for frontend (not builder/preview).
     *
     * @since 1.0.0
     *
     * @param string|array $context Render context.
     * @return bool
     */
    protected function is_frontend( $context ): bool {
        $ctx = $this->normalize_context( $context );
        return 'frontend' === $ctx['mode'];
    }

    /**
     * Get the generated CSS class for a component.
     *
     * @since 1.0.0
     *
     * @param array        $data    Component data.
     * @param string|array $context Render context.
     * @return string Generated class name or empty string.
     */
    protected function get_generated_class( array $data, $context ): string {
        $ctx = $this->normalize_context( $context );

        // Only use generated classes on frontend.
        if ( 'frontend' !== $ctx['mode'] ) {
            return '';
        }

        $id = $data['id'] ?? '';

        // Check class map in context.
        if ( ! empty( $ctx['class_map'][ $id ] ) ) {
            return sanitize_html_class( $ctx['class_map'][ $id ] );
        }

        // Check class map injected into data.
        if ( ! empty( $data['_class_map'][ $id ] ) ) {
            return sanitize_html_class( $data['_class_map'][ $id ] );
        }

        return '';
    }

    /**
     * Build HTML attributes string from array.
     *
     * @since 1.0.0
     *
     * @param array $attributes Attribute key-value pairs.
     * @return string HTML attributes string.
     */
    protected function build_attributes( array $attributes ): string {
        $html = [];

        foreach ( $attributes as $key => $value ) {
            if ( is_bool( $value ) ) {
                if ( $value ) {
                    $html[] = esc_attr( $key );
                }
            } elseif ( null !== $value && '' !== $value ) {
                $html[] = sprintf( '%s="%s"', esc_attr( $key ), esc_attr( $value ) );
            }
        }

        return implode( ' ', $html );
    }

    /**
     * Render children components.
     *
     * @since 1.0.0
     *
     * @param array        $children Children component data.
     * @param string|array $context  Render context.
     * @return string Rendered HTML.
     */
    protected function render_children( array $children, $context = 'frontend' ): string {
        $html = '';

        foreach ( $children as $child ) {
            $html .= $this->registry->render( $child, $context );
        }

        return $html;
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
