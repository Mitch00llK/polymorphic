/**
 * Control Groups Configuration
 *
 * Defines which control groups are available for each component type.
 * This creates a consistent set of controls across all components.
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
 * Control group configuration for all component types.
 * Every component gets these standard control groups unless explicitly excluded.
 */
export const componentControlGroups: Record<ComponentType, ComponentControlConfig> = {
    // Layout Components
    section: {
        groups: ['layout', 'boxStyle', 'size', 'spacing'],
        options: {
            boxStyle: { showBackground: true, showBorder: true, showShadow: true },
            size: { showMinMax: true, showOverflow: false },
        },
    },
    container: {
        groups: ['layout', 'boxStyle', 'size', 'spacing'],
        options: {
            boxStyle: { showBackground: true, showBorder: true, showShadow: true },
            size: { showMinMax: true, showOverflow: true },
        },
    },

    // Text Components
    heading: {
        groups: ['typography', 'boxStyle', 'spacing', 'position'],
        options: {
            typography: { showColor: true, showAlign: true },
            boxStyle: { showBackground: true, showBorder: false, showShadow: false },
        },
    },
    text: {
        groups: ['typography', 'boxStyle', 'spacing', 'position'],
        options: {
            typography: { showColor: true, showAlign: true },
            boxStyle: { showBackground: true, showBorder: false, showShadow: false },
        },
    },

    // Media Components
    image: {
        groups: ['size', 'boxStyle', 'spacing', 'position'],
        options: {
            size: { showMinMax: true, showOverflow: false, showObjectFit: true, showAspectRatio: true },
            boxStyle: { showBackground: false, showBorder: true, showShadow: true },
        },
    },

    // Action Components
    button: {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'position'],
        options: {
            typography: { showColor: true, showAlign: false },
            boxStyle: { showBackground: true, showBorder: true, showShadow: true },
            size: { showMinMax: false, showOverflow: false },
        },
    },

    // UI Components
    card: {
        groups: ['boxStyle', 'size', 'spacing', 'position'],
        options: {
            boxStyle: { showBackground: true, showBorder: true, showShadow: true },
            size: { showMinMax: true, showOverflow: true },
        },
    },
    accordion: {
        groups: ['typography', 'boxStyle', 'spacing', 'position'],
        options: {
            typography: { showColor: true, showAlign: false },
            boxStyle: { showBackground: true, showBorder: true, showShadow: false },
        },
    },
    tabs: {
        groups: ['typography', 'boxStyle', 'spacing', 'position'],
        options: {
            typography: { showColor: true, showAlign: false },
            boxStyle: { showBackground: true, showBorder: true, showShadow: false },
        },
    },
    alert: {
        groups: ['typography', 'boxStyle', 'spacing', 'position'],
        options: {
            typography: { showColor: true, showAlign: false },
            boxStyle: { showBackground: true, showBorder: true, showShadow: false },
        },
    },
    badge: {
        groups: ['typography', 'boxStyle', 'spacing', 'position'],
        options: {
            typography: { showColor: true, showAlign: false },
            boxStyle: { showBackground: true, showBorder: true, showShadow: false },
        },
    },
    avatar: {
        groups: ['size', 'boxStyle', 'spacing', 'position'],
        options: {
            size: { showMinMax: false, showOverflow: false, showObjectFit: true, showAspectRatio: false },
            boxStyle: { showBackground: true, showBorder: true, showShadow: true },
        },
    },
    separator: {
        groups: ['boxStyle', 'spacing', 'position'],
        options: {
            boxStyle: { showBackground: true, showBorder: false, showShadow: false },
        },
    },

    // Marketing Blocks
    heroBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'size', 'spacing'],
        options: {
            typography: { showColor: true, showAlign: true },
            boxStyle: { showBackground: true, showBorder: false, showShadow: false },
            size: { showMinMax: true, showOverflow: false },
        },
    },
    featuresBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'spacing'],
        options: {
            typography: { showColor: true, showAlign: true },
            boxStyle: { showBackground: true, showBorder: false, showShadow: false },
        },
    },
    pricingBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'spacing'],
        options: {
            typography: { showColor: true, showAlign: true },
            boxStyle: { showBackground: true, showBorder: false, showShadow: false },
        },
    },
    faqBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'spacing'],
        options: {
            typography: { showColor: true, showAlign: true },
            boxStyle: { showBackground: true, showBorder: false, showShadow: false },
        },
    },
    ctaBlock: {
        groups: ['layout', 'typography', 'boxStyle', 'spacing'],
        options: {
            typography: { showColor: true, showAlign: true },
            boxStyle: { showBackground: true, showBorder: true, showShadow: true },
        },
    },
};

/**
 * Get the control group configuration for a component type.
 */
export function getComponentControls(type: ComponentType): ComponentControlConfig {
    return componentControlGroups[type] || {
        groups: ['typography', 'boxStyle', 'size', 'spacing', 'position'],
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

