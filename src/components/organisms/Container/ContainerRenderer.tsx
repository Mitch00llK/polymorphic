/**
 * Container Renderer
 *
 * A width-constrained layout container for centering content.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';

import styles from '../organisms.module.css';

interface PaddingObject {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

interface ContainerProps {
    maxWidth?: string;
    width?: 'full' | 'auto' | string;
    alignment?: 'left' | 'center' | 'right';
    direction?: 'row' | 'column';
    wrap?: 'wrap' | 'nowrap';
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    gap?: string;
    backgroundColor?: string;
    padding?: PaddingObject | string;
    borderRadius?: string;
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
    const props = (component.props || {}) as ContainerProps;
    const children = component.children || [];

    // Handle padding (can be object or string)
    let paddingStyles: React.CSSProperties = {};
    if (props.padding) {
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

    // Handle alignment (container centering)
    let marginStyles: React.CSSProperties = {};
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

    // Build container styles
    const style: React.CSSProperties = {
        display: 'flex',
        flexDirection: props.direction || 'column',
        flexWrap: props.wrap || 'nowrap',
        justifyContent: mapJustifyContent(props.justifyContent),
        alignItems: mapAlignItems(props.alignItems),
        gap: props.gap || undefined,
        maxWidth: props.maxWidth || '1200px',
        width: widthValue,
        backgroundColor: props.backgroundColor || undefined,
        borderRadius: props.borderRadius || undefined,
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
