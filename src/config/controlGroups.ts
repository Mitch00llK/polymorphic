/**
 * Control Groups Configuration
 *
 * Defines which control groups are available for each component type.
 * All components get FULL control access for maximum customization.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { ComponentType } from '../types/components';

/**
 * Available control group types.
 */
export type ControlGroupType =
    | 'typography'
    | 'boxStyle'
    | 'size'
    | 'spacing'
    | 'layout'
    | 'position';

/**
 * Control group configuration for a component.
 */
export interface ComponentControlConfig {
    /** Control groups to show, in order */
    groups: ControlGroupType[];
    /** Options for specific control groups */
    options?: {
        typography?: {
            showColor?: boolean;
            showAlign?: boolean;
        };
        boxStyle?: {
            showBackground?: boolean;
            showBorder?: boolean;
            showShadow?: boolean;
        };
        size?: {
            showMinMax?: boolean;
            showOverflow?: boolean;
            showObjectFit?: boolean;
            showAspectRatio?: boolean;
        };
        spacing?: {
            showMargin?: boolean;
            showPadding?: boolean;
        };
    };
}

/**
 * Full control options - all features enabled.
 */
const FULL_OPTIONS = {
    typography: { showColor: true, showAlign: true },
    boxStyle: { showBackground: true, showBorder: true, showShadow: true },
    size: { showMinMax: true, showOverflow: true, showObjectFit: true, showAspectRatio: true },
    spacing: { showMargin: true, showPadding: true },
};

/**
 * Control group configuration for all component types.
 * Every component gets ALL control groups for maximum customization.
 */
export const componentControlGroups: Record<ComponentType, ComponentControlConfig> = {
    // Layout Components - Full controls
    section: {
        groups: ['layout', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    container: {
        groups: ['layout', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },

    // Text Components - Full controls
    heading: {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    text: {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },

    // Media Components - Full controls
    image: {
        groups: ['size', 'boxStyle', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },

    // Action Components - Full controls
    button: {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },

    // UI Components - Full controls
    card: {
        groups: ['layout', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    accordion: {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    tabs: {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    alert: {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    badge: {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    avatar: {
        groups: ['size', 'boxStyle', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    separator: {
        groups: ['boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },

    // Marketing Blocks - Full controls
    heroBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    featuresBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    pricingBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    faqBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
    ctaBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: FULL_OPTIONS,
    },
};

/**
 * Get the control group configuration for a component type.
 */
export function getComponentControls(type: ComponentType): ComponentControlConfig {
    return componentControlGroups[type] || {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'layout', 'position'],
        options: FULL_OPTIONS,
    };
}

/**
 * Control group labels for UI display.
 */
export const controlGroupLabels: Record<ControlGroupType, string> = {
    typography: 'Typography',
    boxStyle: 'Style',
    size: 'Size',
    spacing: 'Spacing',
    layout: 'Layout',
    position: 'Position',
};

/**
 * Control group icons (Lucide icon names).
 */
export const controlGroupIcons: Record<ControlGroupType, string> = {
    typography: 'Type',
    boxStyle: 'Palette',
    size: 'Maximize2',
    spacing: 'Space',
    layout: 'LayoutGrid',
    position: 'Move',
};
