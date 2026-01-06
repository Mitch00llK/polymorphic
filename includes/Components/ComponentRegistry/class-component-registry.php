<?php
/**
 * Component Registry class.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components;

/**
 * Registry for all builder components.
 *
 * @since 1.0.0
 */
class Component_Registry {

    /**
     * Registered component classes.
     *
     * @var array<string, string>
     */
    private array $components = [];

    /**
     * Cached component instances.
     *
     * @var array<string, Component_Base>
     */
    private array $instances = [];

    /**
     * Register a component type.
     *
     * @since 1.0.0
     *
     * @param string $type  Component type identifier.
     * @param string $class Fully qualified class name.
     */
    public function register( string $type, string $class ): void {
        $this->components[ $type ] = $class;
    }

    /**
     * Check if a component type is registered.
     *
     * @since 1.0.0
     *
     * @param string $type Component type.
     * @return bool
     */
    public function has( string $type ): bool {
        return isset( $this->components[ $type ] );
    }

    /**
     * Get a component instance.
     *
     * @since 1.0.0
     *
     * @param string $type Component type.
     * @return Component_Base|null
     */
    public function get( string $type ): ?Component_Base {
        if ( ! $this->has( $type ) ) {
            return null;
        }

        if ( ! isset( $this->instances[ $type ] ) ) {
            $class = $this->components[ $type ];
            $this->instances[ $type ] = new $class( $this );
        }

        return $this->instances[ $type ];
    }

    /**
     * Get all registered component types.
     *
     * @since 1.0.0
     *
     * @return array<string, array> Component types with metadata.
     */
    public function get_all(): array {
        $result = [];

        foreach ( $this->components as $type => $class ) {
            $component = $this->get( $type );
            if ( $component ) {
                $result[] = [
                    'type'              => $type,
                    'label'             => $component->get_label(),
                    'category'          => $component->get_category(),
                    'icon'              => $component->get_icon(),
                    'supports_children' => $component->supports_children(),
                ];
            }
        }

        return $result;
    }

    /**
     * Render a component.
     *
     * Context can be:
     * - A string: 'frontend', 'preview', 'builder'
     * - An array with 'mode' and optional 'class_map' for generated CSS classes
     *
     * @since 1.0.0
     *
     * @param array        $data    Component data.
     * @param string|array $context Render context or context array.
     * @return string Rendered HTML.
     */
    public function render( array $data, $context = 'frontend' ): string {
        $type = $data['type'] ?? '';

        if ( ! $this->has( $type ) ) {
            return '';
        }

        $component = $this->get( $type );

        if ( ! $component ) {
            return '';
        }

        // Normalize context to array format.
        if ( is_string( $context ) ) {
            $context = [
                'mode'      => $context,
                'class_map' => [],
            ];
        }

        // Inject class map into component data for rendering.
        if ( ! empty( $context['class_map'] ) ) {
            $data['_class_map'] = $context['class_map'];
        }

        /**
         * Fires before a component is rendered.
         *
         * @since 1.0.0
         *
         * @param array $data    Component data.
         * @param array $context Render context.
         */
        do_action( 'polymorphic/render/component/before', $data, $context );

        $html = $component->render( $data, $context );

        /**
         * Filter rendered component HTML.
         *
         * @since 1.0.0
         *
         * @param string $html    Rendered HTML.
         * @param array  $data    Component data.
         * @param array  $context Render context.
         */
        $html = apply_filters( 'polymorphic/render/component', $html, $data, $context );

        /**
         * Fires after a component is rendered.
         *
         * @since 1.0.0
         *
         * @param array  $data Component data.
         * @param string $html Rendered HTML.
         */
        do_action( 'polymorphic/render/component/after', $data, $html );

        return $html;
    }
}
