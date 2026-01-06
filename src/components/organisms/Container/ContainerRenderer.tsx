/**
 * Container Renderer
 *
 * A width-constrained layout container for centering content.
 * Supports ALL control groups for maximum customization.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { buildAllStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../organisms.module.css';

interface PaddingObject {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

interface ContainerRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Maps justify/align values to CSS flexbox properties.
 */
const mapJustifyContent = (value?: string): string => {
    switch (value) {
        case 'start': return 'flex-start';
        case 'center': return 'center';
        case 'end': return 'flex-end';
        case 'between': return 'space-between';
        case 'around': return 'space-around';
        case 'evenly': return 'space-evenly';
        default: return 'flex-start';
    }
};

const mapAlignItems = (value?: string): string => {
    switch (value) {
        case 'start': return 'flex-start';
        case 'center': return 'center';
        case 'end': return 'flex-end';
        case 'stretch': return 'stretch';
        case 'baseline': return 'baseline';
        default: return 'stretch';
    }
};

/**
 * Renders a Container layout component.
 */
export const ContainerRenderer: React.FC<ContainerRendererProps> = ({
    component,
    context,
}) => {
    const props = (component.props || {}) as StyleableProps;
    const children = component.children || [];

    // Build ALL styles from ALL control groups
    const allStyles = buildAllStyles(props);

    // Legacy padding support (object format from templates)
    const legacyPadding = props.padding as PaddingObject | string | undefined;
    let paddingStyles: React.CSSProperties = {};
    if (!allStyles.paddingTop && !allStyles.paddingRight && !allStyles.paddingBottom && !allStyles.paddingLeft) {
        if (legacyPadding) {
            if (typeof legacyPadding === 'object') {
                paddingStyles = {
                    paddingTop: legacyPadding.top || undefined,
                    paddingRight: legacyPadding.right || undefined,
                    paddingBottom: legacyPadding.bottom || undefined,
                    paddingLeft: legacyPadding.left || undefined,
                };
            } else {
                paddingStyles = { padding: legacyPadding };
            }
        }
    }

    // Legacy props support
    const direction = props.direction as string;
    const wrap = props.wrap as string;
    const alignment = props.alignment as string;
    const legacyJustify = props.justifyContent as string;
    const legacyAlign = props.alignItems as string;

    // Handle width
    const widthProp = props.width as string;
    let widthValue: string | undefined = allStyles.width;
    if (!widthValue) {
        if (widthProp === 'full') {
            widthValue = '100%';
        } else if (widthProp === 'auto') {
            widthValue = 'auto';
        } else if (widthProp) {
            widthValue = widthProp;
        } else {
            widthValue = '100%';
        }
    }

    // Handle alignment (container centering)
    let marginStyles: React.CSSProperties = {};
    if (!allStyles.marginLeft && !allStyles.marginRight) {
        switch (alignment) {
            case 'left':
                marginStyles = { marginRight: 'auto' };
                break;
            case 'right':
                marginStyles = { marginLeft: 'auto' };
                break;
            case 'center':
            default:
                marginStyles = { marginLeft: 'auto', marginRight: 'auto' };
                break;
        }
    }

    // Build container styles with defaults
    const style: React.CSSProperties = {
        ...allStyles,
        // Layout defaults
        display: allStyles.display || 'flex',
        flexDirection: allStyles.flexDirection || direction || 'column',
        flexWrap: allStyles.flexWrap || wrap || 'nowrap',
        justifyContent: allStyles.justifyContent || mapJustifyContent(legacyJustify),
        alignItems: allStyles.alignItems || mapAlignItems(legacyAlign),
        gap: allStyles.gap || (props.gap as string) || undefined,
        // Size defaults
        maxWidth: allStyles.maxWidth || (props.maxWidth as string) || '1200px',
        width: widthValue,
        // Spacing
        ...paddingStyles,
        ...marginStyles,
    };

    return (
        <div
            className={styles.container}
            style={style}
            data-component-id={component.id}
        >
            {children.length > 0 ? (
                children.map((child) => (
                    <ComponentRenderer
                        key={child.id}
                        component={child}
                        context={context}
                    />
                ))
            ) : context === 'editor' ? (
                <div className={styles.emptyContainer}>
                    <span>+ Drop components here</span>
                </div>
            ) : null}
        </div>
    );
};

export default ContainerRenderer;
