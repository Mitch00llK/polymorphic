/**
 * Style Builder Utility
 *
 * Builds CSS styles from component props for shared control groups.
 * This ensures all components can use typography, box style, size,
 * spacing, and position controls consistently.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { CSSProperties } from 'react';

/**
 * Component props that can be styled.
 */
export interface StyleableProps {
    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: string;
    textAlign?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;

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
    borderRadiusTopLeft?: string;
    borderRadiusTopRight?: string;
    borderRadiusBottomRight?: string;
    borderRadiusBottomLeft?: string;
    boxShadow?: string;
    opacity?: string;

    // Size
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    overflow?: string;
    overflowX?: string;
    overflowY?: string;
    objectFit?: string;
    aspectRatio?: string;

    // Spacing
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;

    // Position
    position?: string;
    positionTop?: string;
    positionRight?: string;
    positionBottom?: string;
    positionLeft?: string;
    zIndex?: string;

    // Layout (Flex)
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    flexWrap?: string;

    // Allow any other props
    [key: string]: unknown;
}

/**
 * Build typography styles from props.
 */
export function buildTypographyStyles(props: StyleableProps): CSSProperties {
    const styles: CSSProperties = {};

    if (props.fontFamily) styles.fontFamily = props.fontFamily;
    if (props.fontSize) styles.fontSize = props.fontSize;
    if (props.fontWeight) styles.fontWeight = props.fontWeight;
    if (props.lineHeight) styles.lineHeight = props.lineHeight;
    if (props.letterSpacing) styles.letterSpacing = props.letterSpacing;
    if (props.textTransform) styles.textTransform = props.textTransform as CSSProperties['textTransform'];
    if (props.textAlign) styles.textAlign = props.textAlign as CSSProperties['textAlign'];
    if (props.fontStyle) styles.fontStyle = props.fontStyle as CSSProperties['fontStyle'];
    if (props.textDecoration) styles.textDecoration = props.textDecoration;
    if (props.color) styles.color = props.color;

    return styles;
}

/**
 * Build box style (background, border, shadow) from props.
 */
export function buildBoxStyles(props: StyleableProps): CSSProperties {
    const styles: CSSProperties = {};

    // Background
    if (props.backgroundColor) styles.backgroundColor = props.backgroundColor;
    if (props.backgroundImage) {
        // Support both raw URLs and url() syntax
        const bgImage = props.backgroundImage.startsWith('url(')
            ? props.backgroundImage
            : `url(${props.backgroundImage})`;
        styles.backgroundImage = bgImage;
    }
    if (props.backgroundSize) styles.backgroundSize = props.backgroundSize;
    if (props.backgroundPosition) styles.backgroundPosition = props.backgroundPosition;
    if (props.backgroundRepeat) styles.backgroundRepeat = props.backgroundRepeat;

    // Border
    if (props.borderStyle && props.borderStyle !== 'none') {
        styles.borderStyle = props.borderStyle;
        if (props.borderWidth) styles.borderWidth = props.borderWidth;
        if (props.borderColor) styles.borderColor = props.borderColor;
    }

    // Border Radius - support individual corners or single value
    if (props.borderRadiusTopLeft || props.borderRadiusTopRight ||
        props.borderRadiusBottomRight || props.borderRadiusBottomLeft) {
        styles.borderRadius = [
            props.borderRadiusTopLeft || '0',
            props.borderRadiusTopRight || '0',
            props.borderRadiusBottomRight || '0',
            props.borderRadiusBottomLeft || '0',
        ].join(' ');
    } else if (props.borderRadius) {
        styles.borderRadius = props.borderRadius;
    }

    // Shadow & Opacity
    if (props.boxShadow) styles.boxShadow = props.boxShadow;
    if (props.opacity) styles.opacity = parseFloat(props.opacity);

    return styles;
}

/**
 * Build size styles from props.
 */
export function buildSizeStyles(props: StyleableProps): CSSProperties {
    const styles: CSSProperties = {};

    if (props.width) styles.width = props.width;
    if (props.height) styles.height = props.height;
    if (props.minWidth) styles.minWidth = props.minWidth;
    if (props.maxWidth) styles.maxWidth = props.maxWidth;
    if (props.minHeight) styles.minHeight = props.minHeight;
    if (props.maxHeight) styles.maxHeight = props.maxHeight;
    if (props.overflow) styles.overflow = props.overflow as CSSProperties['overflow'];
    if (props.overflowX) styles.overflowX = props.overflowX as CSSProperties['overflowX'];
    if (props.overflowY) styles.overflowY = props.overflowY as CSSProperties['overflowY'];
    if (props.objectFit) styles.objectFit = props.objectFit as CSSProperties['objectFit'];
    if (props.aspectRatio) styles.aspectRatio = props.aspectRatio;

    return styles;
}

/**
 * Build spacing styles (margin & padding) from props.
 */
export function buildSpacingStyles(props: StyleableProps): CSSProperties {
    const styles: CSSProperties = {};

    // Padding
    if (props.paddingTop) styles.paddingTop = props.paddingTop;
    if (props.paddingRight) styles.paddingRight = props.paddingRight;
    if (props.paddingBottom) styles.paddingBottom = props.paddingBottom;
    if (props.paddingLeft) styles.paddingLeft = props.paddingLeft;

    // Margin
    if (props.marginTop) styles.marginTop = props.marginTop;
    if (props.marginRight) styles.marginRight = props.marginRight;
    if (props.marginBottom) styles.marginBottom = props.marginBottom;
    if (props.marginLeft) styles.marginLeft = props.marginLeft;

    return styles;
}

/**
 * Build position styles from props.
 */
export function buildPositionStyles(props: StyleableProps): CSSProperties {
    const styles: CSSProperties = {};

    if (props.position && props.position !== 'static') {
        styles.position = props.position as CSSProperties['position'];
        if (props.positionTop) styles.top = props.positionTop;
        if (props.positionRight) styles.right = props.positionRight;
        if (props.positionBottom) styles.bottom = props.positionBottom;
        if (props.positionLeft) styles.left = props.positionLeft;
    }
    if (props.zIndex) styles.zIndex = parseInt(props.zIndex, 10);

    return styles;
}

/**
 * Build layout (flex/grid) styles from props.
 */
export function buildLayoutStyles(props: StyleableProps): CSSProperties {
    const styles: CSSProperties = {};

    if (props.display) {
        styles.display = props.display as CSSProperties['display'];

        if (props.display === 'flex') {
            if (props.flexDirection) styles.flexDirection = props.flexDirection as CSSProperties['flexDirection'];
            if (props.justifyContent) styles.justifyContent = props.justifyContent as CSSProperties['justifyContent'];
            if (props.alignItems) styles.alignItems = props.alignItems as CSSProperties['alignItems'];
            if (props.gap) styles.gap = props.gap;
            if (props.flexWrap) styles.flexWrap = props.flexWrap as CSSProperties['flexWrap'];
        }
    }

    return styles;
}

/**
 * Build all styles from props.
 * Combines typography, box, size, spacing, position, and layout styles.
 */
export function buildAllStyles(props: StyleableProps): CSSProperties {
    return {
        ...buildTypographyStyles(props),
        ...buildBoxStyles(props),
        ...buildSizeStyles(props),
        ...buildSpacingStyles(props),
        ...buildPositionStyles(props),
        ...buildLayoutStyles(props),
    };
}

/**
 * Build styles for specific control groups only.
 */
export function buildStyles(
    props: StyleableProps,
    groups: ('typography' | 'box' | 'size' | 'spacing' | 'position' | 'layout')[]
): CSSProperties {
    let styles: CSSProperties = {};

    for (const group of groups) {
        switch (group) {
            case 'typography':
                styles = { ...styles, ...buildTypographyStyles(props) };
                break;
            case 'box':
                styles = { ...styles, ...buildBoxStyles(props) };
                break;
            case 'size':
                styles = { ...styles, ...buildSizeStyles(props) };
                break;
            case 'spacing':
                styles = { ...styles, ...buildSpacingStyles(props) };
                break;
            case 'position':
                styles = { ...styles, ...buildPositionStyles(props) };
                break;
            case 'layout':
                styles = { ...styles, ...buildLayoutStyles(props) };
                break;
        }
    }

    return styles;
}

