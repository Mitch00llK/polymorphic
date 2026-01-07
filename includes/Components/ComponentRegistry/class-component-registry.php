<?php
/**
 * Component Registry class.
 *
 * Central registry for all builder components (core + third-party).
 * Supports dynamic component registration with CSS/JS assets.
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
     * Singleton instance.
     *
     * @var Component_Registry|null
     */
    private static ?Component_Registry $instance = null;

    /**
     * Registered component classes (core components).
     *
     * @var array<string, string>
     */
    private array $components = [];

    /**
     * Third-party component registrations.
     *
     * @var array<string, array>
     */
    private array $third_party = [];

    /**
     * Cached component instances.
     *
     * @var array<string, Component_Base>
     */
    private array $instances = [];

    /**
     * Get singleton instance.
     *
     * @return Component_Registry
     */
    public static function instance(): Component_Registry {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

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

    /**
     * Register a third-party component.
     *
     * @since 1.0.0
     *
     * @param array $args Component registration arguments.
     * @return bool True on success, false on failure.
     */
    public function register_third_party( array $args ): bool {
        if ( empty( $args['type'] ) ) {
            return false;
        }

        $type = sanitize_key( $args['type'] );

        $this->third_party[ $type ] = [
            'type'            => $type,
            'label'           => $args['label'] ?? ucfirst( $type ),
            'icon'            => $args['icon'] ?? 'box',
            'category'        => $args['category'] ?? 'blocks',
            'source'          => $args['source'] ?? 'third-party',
            'supports'        => $args['supports'] ?? [ 'spacing', 'boxStyle' ],
            'default_props'   => $args['default_props'] ?? [],
            'render_callback' => $args['render_callback'] ?? null,
            'assets'          => [
                'css' => [
                    'inline' => $args['assets']['css']['inline'] ?? null,
                    'url'    => $args['assets']['css']['url'] ?? null,
                ],
                'js' => [
                    'editor'   => $args['assets']['js']['editor'] ?? null,
                    'frontend' => $args['assets']['js']['frontend'] ?? null,
                ],
            ],
        ];

        return true;
    }

    /**
     * Check if a third-party component is registered.
     *
     * @param string $type Component type.
     * @return bool
     */
    public function has_third_party( string $type ): bool {
        return isset( $this->third_party[ $type ] );
    }

    /**
     * Get third-party component registration.
     *
     * @param string $type Component type.
     * @return array|null
     */
    public function get_third_party( string $type ): ?array {
        return $this->third_party[ $type ] ?? null;
    }

    /**
     * Get CSS for a set of component types.
     *
     * @param array $types Component types used.
     * @return string Combined inline CSS.
     */
    public function get_css( array $types ): string {
        $css = [];

        foreach ( $types as $type ) {
            $registration = $this->get_third_party( $type );
            if ( $registration && ! empty( $registration['assets']['css']['inline'] ) ) {
                $css[] = "/* {$type} */\n" . $registration['assets']['css']['inline'];
            }
        }

        return implode( "\n\n", $css );
    }

    /**
     * Get external CSS URLs for component types.
     *
     * @param array $types Component types used.
     * @return array Array of type => URL.
     */
    public function get_css_urls( array $types ): array {
        $urls = [];

        foreach ( $types as $type ) {
            $registration = $this->get_third_party( $type );
            if ( $registration && ! empty( $registration['assets']['css']['url'] ) ) {
                $urls[ $type ] = $registration['assets']['css']['url'];
            }
        }

        return $urls;
    }

    /**
     * Get frontend JS URLs for component types.
     *
     * @param array $types Component types used.
     * @return array Array of type => URL.
     */
    public function get_frontend_scripts( array $types ): array {
        $scripts = [];

        foreach ( $types as $type ) {
            $registration = $this->get_third_party( $type );
            if ( $registration && ! empty( $registration['assets']['js']['frontend'] ) ) {
                $scripts[ $type ] = $registration['assets']['js']['frontend'];
            }
        }

        return $scripts;
    }

    /**
     * Get editor JS URLs for component types.
     *
     * @param array $types Component types used.
     * @return array Array of type => URL.
     */
    public function get_editor_scripts( array $types ): array {
        $scripts = [];

        foreach ( $types as $type ) {
            $registration = $this->get_third_party( $type );
            if ( $registration && ! empty( $registration['assets']['js']['editor'] ) ) {
                $scripts[ $type ] = $registration['assets']['js']['editor'];
            }
        }

        return $scripts;
    }

    /**
     * Convert to API response format.
     *
     * Combines core and third-party components.
     *
     * @return array
     */
    public function to_api_response(): array {
        $result = [];

        // Core components.
        foreach ( $this->components as $type => $class ) {
            $component = $this->get( $type );
            if ( $component ) {
                $result[] = [
                    'type'         => $type,
                    'label'        => $component->get_label(),
                    'icon'         => $component->get_icon(),
                    'category'     => $component->get_category(),
                    'source'       => 'core',
                    'supports'     => [], // Core components define this internally.
                    'defaultProps' => $component->get_defaults(),
                    'assets'       => [
                        'css' => [ 'inline' => null, 'url' => null ],
                        'js'  => [ 'editor' => null, 'frontend' => null ],
                    ],
                ];
            }
        }

        // Third-party components.
        foreach ( $this->third_party as $type => $registration ) {
            $result[] = [
                'type'         => $type,
                'label'        => $registration['label'],
                'icon'         => $registration['icon'],
                'category'     => $registration['category'],
                'source'       => $registration['source'],
                'supports'     => $registration['supports'],
                'defaultProps' => $registration['default_props'],
                'assets'       => $registration['assets'],
            ];
        }

        return $result;
    }

    /**
     * Render a third-party component.
     *
     * @param array  $data    Component data.
     * @param string $context Render context.
     * @return string|null Rendered HTML or null if not renderable.
     */
    public function render_third_party( array $data, string $context = 'frontend' ): ?string {
        $type = $data['type'] ?? '';
        $registration = $this->get_third_party( $type );

        if ( ! $registration ) {
            return null;
        }

        if ( is_callable( $registration['render_callback'] ) ) {
            return call_user_func( $registration['render_callback'], $data, $context );
        }

        return null;
    }
}
