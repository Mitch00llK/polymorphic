/**
 * Container Renderer
 *
 * Uses CSS classes + custom properties for clean DOM.
 * Supports nested drag-and-drop.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { buildCSSVariables, type CSSVariableProps } from '../../../utils/cssVariables';

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

interface ContainerProps extends CSSVariableProps {
    alignment?: 'left' | 'center' | 'right';
    direction?: 'row' | 'column';
    wrap?: 'wrap' | 'nowrap';
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    padding?: PaddingObject | string;
}

/**
 * Maps justify/align values to CSS flexbox properties.
 */
const mapJustify = (value?: string): string | undefined => {
    switch (value) {
        case 'start': return 'flex-start';
        case 'center': return 'center';
        case 'end': return 'flex-end';
        case 'between': return 'space-between';
        case 'around': return 'space-around';
        case 'evenly': return 'space-evenly';
        default: return undefined;
    }
};

const mapAlign = (value?: string): string | undefined => {
    switch (value) {
        case 'start': return 'flex-start';
        case 'center': return 'center';
        case 'end': return 'flex-end';
        case 'stretch': return 'stretch';
        case 'baseline': return 'baseline';
        default: return undefined;
    }
};

/**
 * Renders a Container component with CSS variables.
 * Acts as a drop zone for nested components.
 */
export const ContainerRenderer: React.FC<ContainerRendererProps> = ({
    component,
    context,
}) => {
    const props = (component.props || {}) as ContainerProps;
    const children = component.children || [];

    // Register as drop zone in editor mode
    const { setNodeRef, isOver } = useDroppable({
        id: `container-drop-${component.id}`,
        data: {
            type: 'container-drop-zone',
            containerId: component.id,
        },
        disabled: context !== 'editor',
    });

    // Build CSS variables from props
    const cssVars = buildCSSVariables(props) as Record<string, string | number | undefined>;

    // Handle legacy padding object
    if (props.padding && typeof props.padding === 'object') {
        if (props.padding.top) cssVars['--poly-padding-top'] = props.padding.top;
        if (props.padding.right) cssVars['--poly-padding-right'] = props.padding.right;
        if (props.padding.bottom) cssVars['--poly-padding-bottom'] = props.padding.bottom;
        if (props.padding.left) cssVars['--poly-padding-left'] = props.padding.left;
    }

    // Map legacy props to CSS variables
    if (props.direction && !cssVars['--poly-flex-direction']) {
        cssVars['--poly-flex-direction'] = props.direction;
    }
    if (props.wrap && !cssVars['--poly-flex-wrap']) {
        cssVars['--poly-flex-wrap'] = props.wrap;
    }

    const justifyContent = mapJustify(props.justifyContent);
    const alignItems = mapAlign(props.alignItems);

    if (justifyContent && !cssVars['--poly-justify-content']) {
        cssVars['--poly-justify-content'] = justifyContent;
    }
    if (alignItems && !cssVars['--poly-align-items']) {
        cssVars['--poly-align-items'] = alignItems;
    }

    // Handle width
    if (props.width === 'full' && !cssVars['--poly-width']) {
        cssVars['--poly-width'] = '100%';
    } else if (props.width === 'auto' && !cssVars['--poly-width']) {
        cssVars['--poly-width'] = 'auto';
    }

    // Handle alignment (container centering)
    if (!cssVars['--poly-margin-left'] && !cssVars['--poly-margin-right']) {
        switch (props.alignment) {
            case 'left':
                cssVars['--poly-margin-left'] = '0';
                cssVars['--poly-margin-right'] = 'auto';
                break;
            case 'right':
                cssVars['--poly-margin-left'] = 'auto';
                cssVars['--poly-margin-right'] = '0';
                break;
            // center is default (auto/auto)
        }
    }

    const containerClasses = [
        'poly-container',
        context === 'editor' && isOver ? 'poly-container--drop-target' : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            ref={context === 'editor' ? setNodeRef : undefined}
            className={containerClasses}
            style={cssVars as React.CSSProperties}
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
                <div className="poly-container__empty">
                    + Drop components here
                </div>
            ) : null}
        </div>
    );
};

export default ContainerRenderer;

