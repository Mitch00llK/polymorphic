/**
 * Container Renderer
 *
 * A width-constrained layout container for centering content.
 * Supports all PropertyPanel controls: layout, boxStyle, size, spacing.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useMemo } from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { useBuilderStore } from '../../../store/builderStore';

import styles from '../organisms.module.css';

interface PaddingObject {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

interface ContainerProps {
    // Layout (PropertyPanel)
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    flexWrap?: string;
    // Legacy layout props (from templates)
    direction?: string;
    wrap?: string;
    alignment?: string;

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

    // Spacing (PropertyPanel format)
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    // Legacy spacing (template format)
    padding?: PaddingObject | string;
}

interface ContainerRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Maps align values to CSS flexbox.
 */
const mapJustifyContent = (value?: string): string => {
    switch (value) {
        case 'start': return 'flex-start';
        case 'center': return 'center';
        case 'end': return 'flex-end';
        case 'between': return 'space-between';
        case 'around': return 'space-around';
        case 'evenly': return 'space-evenly';
        default: return value || 'flex-start';
    }
};

const mapAlignItems = (value?: string): string => {
    switch (value) {
        case 'start': return 'flex-start';
        case 'center': return 'center';
        case 'end': return 'flex-end';
        case 'stretch': return 'stretch';
        case 'baseline': return 'baseline';
        default: return value || 'stretch';
    }
};

/**
 * Renders a Container layout component.
 * Uses store selector in editor mode for instant updates.
 */
export const ContainerRenderer: React.FC<ContainerRendererProps> = ({
    component,
    context,
}) => {
    // In editor mode, subscribe to store for instant updates
    // In preview/frontend mode, use component prop directly
    const liveComponent = useBuilderStore((state) => {
        if (context !== 'editor') return null; // Don't use store for frontend

        const findById = (comps: ComponentData[], id: string): ComponentData | null => {
            for (const c of comps) {
                if (c.id === id) return c;
                if (c.children) {
                    const found = findById(c.children, id);
                    if (found) return found;
                }
            }
            return null;
        };
        return findById(state.components, component.id);
    });

    // Use live data from store in editor, otherwise use prop
    const currentComponent = (context === 'editor' && liveComponent) ? liveComponent : component;
    const props = (currentComponent.props || {}) as ContainerProps;
    const children = currentComponent.children || [];

    // Handle padding - support both PropertyPanel format and legacy template format
    let paddingStyles: React.CSSProperties = {};
    if (props.paddingTop || props.paddingRight || props.paddingBottom || props.paddingLeft) {
        // PropertyPanel format
        paddingStyles = {
            paddingTop: props.paddingTop || undefined,
            paddingRight: props.paddingRight || undefined,
            paddingBottom: props.paddingBottom || undefined,
            paddingLeft: props.paddingLeft || undefined,
        };
    } else if (props.padding) {
        // Legacy template format
        if (typeof props.padding === 'object') {
            paddingStyles = {
                paddingTop: props.padding.top || undefined,
                paddingRight: props.padding.right || undefined,
                paddingBottom: props.padding.bottom || undefined,
                paddingLeft: props.padding.left || undefined,
            };
        } else {
            paddingStyles = { padding: props.padding };
        }
    }

    // Handle width
    let widthValue: string | undefined;
    if (props.width === 'full') {
        widthValue = '100%';
    } else if (props.width === 'auto') {
        widthValue = 'auto';
    } else if (props.width) {
        widthValue = props.width;
    } else {
        widthValue = '100%';
    }

    // Handle alignment (container centering) - legacy support
    let marginStyles: React.CSSProperties = {};
    if (!props.marginLeft && !props.marginRight) {
        switch (props.alignment) {
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

    // Handle border radius (individual corners or single value)
    let borderRadiusValue: string | undefined;
    if (props.borderRadiusTopLeft || props.borderRadiusTopRight ||
        props.borderRadiusBottomRight || props.borderRadiusBottomLeft) {
        borderRadiusValue = [
            props.borderRadiusTopLeft || '0',
            props.borderRadiusTopRight || '0',
            props.borderRadiusBottomRight || '0',
            props.borderRadiusBottomLeft || '0',
        ].join(' ');
    } else {
        borderRadiusValue = props.borderRadius || undefined;
    }

    // Build container styles
    const style: React.CSSProperties = {
        // Layout
        display: props.display || 'flex',
        flexDirection: (props.flexDirection || props.direction || 'column') as React.CSSProperties['flexDirection'],
        flexWrap: (props.flexWrap || props.wrap || 'nowrap') as React.CSSProperties['flexWrap'],
        justifyContent: mapJustifyContent(props.justifyContent),
        alignItems: mapAlignItems(props.alignItems),
        gap: props.gap || undefined,

        // Size
        width: widthValue,
        height: props.height || undefined,
        minWidth: props.minWidth || undefined,
        maxWidth: props.maxWidth || '1200px',
        minHeight: props.minHeight || undefined,
        maxHeight: props.maxHeight || undefined,
        overflow: props.overflow as React.CSSProperties['overflow'] || undefined,

        // Box Style - Background
        backgroundColor: props.backgroundColor || undefined,
        backgroundSize: props.backgroundSize || undefined,
        backgroundPosition: props.backgroundPosition || undefined,
        backgroundRepeat: props.backgroundRepeat || undefined,

        // Box Style - Border
        borderWidth: props.borderWidth || undefined,
        borderStyle: props.borderStyle as React.CSSProperties['borderStyle'] || (props.borderWidth ? 'solid' : undefined),
        borderColor: props.borderColor || undefined,
        borderRadius: borderRadiusValue,

        // Box Style - Effects
        boxShadow: props.boxShadow || undefined,
        opacity: props.opacity ? parseFloat(props.opacity) : undefined,

        // Spacing
        ...paddingStyles,
        marginTop: props.marginTop || undefined,
        marginBottom: props.marginBottom || undefined,
        ...marginStyles,
    };

    // Handle background image
    if (props.backgroundImage) {
        if (props.backgroundImage.startsWith('linear-gradient') ||
            props.backgroundImage.startsWith('radial-gradient') ||
            props.backgroundImage.startsWith('url(')) {
            style.backgroundImage = props.backgroundImage;
        } else {
            style.backgroundImage = `url(${props.backgroundImage})`;
        }
    }

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
