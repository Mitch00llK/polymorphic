/**
 * Component Manifest Type
 *
 * Defines the structure for component manifests used in auto-discovery.
 * Each component folder should have a manifest.ts exporting this type.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

/**
 * Component category in the sidebar.
 */
export type ComponentCategory =
    | 'layout'
    | 'content'
    | 'media'
    | 'actions'
    | 'ui'
    | 'blocks';

/**
 * Lucide icon name (string reference).
 */
export type IconName = string;

/**
 * Component manifest definition.
 */
export interface ComponentManifest {
    /**
     * Unique component type identifier.
     * Must match the key used in ComponentRenderer.
     * @example 'testimonialBlock'
     */
    type: string;

    /**
     * Human-readable label for the sidebar.
     * @example 'Testimonials'
     */
    label: string;

    /**
     * Lucide icon name for the sidebar.
     * @example 'Quote'
     */
    icon: IconName;

    /**
     * Sidebar category grouping.
     */
    category: ComponentCategory;

    /**
     * Base CSS for this component type.
     * Included in generated CSS when component is used on a page.
     */
    css: string;

    /**
     * Fully qualified PHP class name for server-side rendering.
     * @example 'Polymorphic\\Components\\TestimonialBlock\\Testimonial_Block'
     */
    phpClass: string;

    /**
     * Whether the component can contain children.
     * @default false
     */
    supportsChildren?: boolean;

    /**
     * Default props for new instances.
     */
    defaultProps?: Record<string, unknown>;
}

/**
 * Collection of all component manifests.
 */
export type ComponentManifestRegistry = Record<string, ComponentManifest>;
