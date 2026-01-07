<?php
/**
 * Component Registration Helper Functions.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

use Polymorphic\Components\Component_Registry;

/**
 * Register a third-party component.
 *
 * @since 1.0.0
 *
 * @param array $args Component registration arguments.
 * @return bool True on success, false on failure.
 */
function polymorphic_register_component( array $args ): bool {
    $registry = Component_Registry::instance();
    return $registry->register_third_party( $args );
}

/**
 * Get the component registry instance.
 *
 * @since 1.0.0
 *
 * @return Component_Registry
 */
function polymorphic_get_registry(): Component_Registry {
    return Component_Registry::instance();
}

/**
 * Check if a component type is registered.
 *
 * @since 1.0.0
 *
 * @param string $type Component type.
 * @return bool
 */
function polymorphic_has_component( string $type ): bool {
    $registry = Component_Registry::instance();
    return $registry->has( $type ) || $registry->has_third_party( $type );
}
