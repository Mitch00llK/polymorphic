/**
 * CSS Variables Builder
 *
 * Converts component props to CSS custom properties.
 * This keeps the DOM clean by using CSS variables instead of inline styles.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { CSSProperties } from 'react';

/**
 * Prefix for all Polymorphic CSS variables.
 */
const PREFIX = '--poly';

/**
 * Props that can be converted to CSS variables.
 */
export interface CSSVariableProps {
    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string | number;
    lineHeight?: string | number;
    letterSpacing?: string;
    textTransform?: string;
    textAlign?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    textColor?: string;

    // Box Style
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderRadius?: string;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderBottomLeftRadius?: string;
    borderBottomRightRadius?: string;
    boxShadow?: string;
    opacity?: number | string;

    // Size
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    overflow?: string;
    objectFit?: string;
    aspectRatio?: string;

    // Spacing
    padding?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    margin?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;

    // Layout
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    flexWrap?: string;

    // Position
    position?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: number | string;

    // Allow any other props
    [key: string]: unknown;
}

/**
 * Map of prop names to CSS variable names.
 * Only props that differ from their CSS property name need to be mapped.
 */
const PROP_TO_VAR: Record<string, string> = {
    textColor: 'color',
};

/**
 * Converts a camelCase string to kebab-case.
 */
function toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Builds CSS custom properties from component props.
 * Returns a style object with only CSS variables.
 *
 * @param props - Component props
 * @param allowedProps - Optional list of props to include (all if not specified)
 * @returns Style object with CSS variables
 */
export function buildCSSVariables(
    props: CSSVariableProps,
    allowedProps?: string[]
): CSSProperties {
    const variables: Record<string, string | number> = {};

    for (const [key, value] of Object.entries(props)) {
        // Skip undefined, null, or empty values
        if (value === undefined || value === null || value === '') continue;

        // Skip non-style props
        if (typeof value === 'object' || typeof value === 'function') continue;

        // Check if this prop is allowed
        if (allowedProps && !allowedProps.includes(key)) continue;

        // Get the CSS variable name
        const cssName = PROP_TO_VAR[key] || key;
        const varName = `${PREFIX}-${toKebabCase(cssName)}`;

        variables[varName] = value;
    }

    return variables as CSSProperties;
}

/**
 * Typography-related props.
 */
export const TYPOGRAPHY_PROPS = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'textTransform',
    'textAlign',
    'fontStyle',
    'textDecoration',
    'color',
    'textColor',
];

/**
 * Box style props.
 */
export const BOX_STYLE_PROPS = [
    'backgroundColor',
    'backgroundImage',
    'backgroundSize',
    'backgroundPosition',
    'backgroundRepeat',
    'borderWidth',
    'borderStyle',
    'borderColor',
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'boxShadow',
    'opacity',
];

/**
 * Size props.
 */
export const SIZE_PROPS = [
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'overflow',
    'objectFit',
    'aspectRatio',
];

/**
 * Spacing props.
 */
export const SPACING_PROPS = [
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'margin',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
];

/**
 * Layout props.
 */
export const LAYOUT_PROPS = [
    'display',
    'flexDirection',
    'justifyContent',
    'alignItems',
    'gap',
    'flexWrap',
];

/**
 * Position props.
 */
export const POSITION_PROPS = [
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'zIndex',
];

/**
 * All style props.
 */
export const ALL_STYLE_PROPS = [
    ...TYPOGRAPHY_PROPS,
    ...BOX_STYLE_PROPS,
    ...SIZE_PROPS,
    ...SPACING_PROPS,
    ...LAYOUT_PROPS,
    ...POSITION_PROPS,
];

/**
 * Builds CSS variables for specific control groups.
 */
export function buildGroupVariables(
    props: CSSVariableProps,
    groups: ('typography' | 'boxStyle' | 'size' | 'spacing' | 'layout' | 'position')[]
): CSSProperties {
    const allowedProps: string[] = [];

    for (const group of groups) {
        switch (group) {
            case 'typography':
                allowedProps.push(...TYPOGRAPHY_PROPS);
                break;
            case 'boxStyle':
                allowedProps.push(...BOX_STYLE_PROPS);
                break;
            case 'size':
                allowedProps.push(...SIZE_PROPS);
                break;
            case 'spacing':
                allowedProps.push(...SPACING_PROPS);
                break;
            case 'layout':
                allowedProps.push(...LAYOUT_PROPS);
                break;
            case 'position':
                allowedProps.push(...POSITION_PROPS);
                break;
        }
    }

    return buildCSSVariables(props, allowedProps);
}

/**
 * Builds CSS variables for element-specific styles.
 * Props are prefixed with the element name (e.g., titleFontSize -> --poly-font-size for title).
 */
export function buildElementVariables(
    props: CSSVariableProps,
    elementPrefix: string
): CSSProperties {
    const variables: Record<string, string | number> = {};
    const prefixLength = elementPrefix.length;

    for (const [key, value] of Object.entries(props)) {
        // Skip if doesn't start with element prefix
        if (!key.startsWith(elementPrefix)) continue;

        // Skip undefined, null, or empty values
        if (value === undefined || value === null || value === '') continue;

        // Skip non-style props
        if (typeof value === 'object' || typeof value === 'function') continue;

        // Extract the actual prop name (e.g., titleFontSize -> fontSize)
        const propName = key.slice(prefixLength);
        const normalizedProp = propName.charAt(0).toLowerCase() + propName.slice(1);

        // Get the CSS variable name
        const cssName = PROP_TO_VAR[normalizedProp] || normalizedProp;
        const varName = `${PREFIX}-${elementPrefix}-${toKebabCase(cssName)}`;

        variables[varName] = value;
    }

    return variables as CSSProperties;
}

