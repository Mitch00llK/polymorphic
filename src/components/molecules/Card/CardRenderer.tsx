/**
 * Card Renderer
 *
 * Uses CSS classes + custom properties for clean DOM.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { buildCSSVariables, buildElementVariables, type CSSVariableProps } from '../../../utils/cssVariables';

interface PaddingObject {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

interface CardRendererProps {
    component: ComponentData;
    context?: 'editor' | 'preview';
}

interface CardProps extends CSSVariableProps {
    title?: string;
    description?: string;
    footer?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    variant?: 'default' | 'ghost' | 'elevated';
    padding?: PaddingObject | string;
}

/**
 * Renders a Card component with CSS variables.
 */
export const CardRenderer: React.FC<CardRendererProps> = ({
    component,
    context = 'preview',
}) => {
    const props = (component.props || {}) as CardProps;
    const children = component.children || [];

    const title = props.title;
    const description = props.description;
    const footer = props.footer;
    const showHeader = props.showHeader !== false;
    const showFooter = props.showFooter !== false;
    const variant = props.variant || 'default';

    // Build CSS variables from props
    const cssVars = buildCSSVariables(props) as Record<string, string | number | undefined>;

    // Build element-specific CSS variables
    const titleVars = buildElementVariables(props, 'title');
    const descriptionVars = buildElementVariables(props, 'description');
    const footerVars = buildElementVariables(props, 'footer');

    // Handle legacy padding object
    if (props.padding && typeof props.padding === 'object') {
        const pad = props.padding;
        const paddingValue = `${pad.top || '24px'} ${pad.right || '24px'} ${pad.bottom || '24px'} ${pad.left || '24px'}`;
        cssVars['--poly-padding'] = paddingValue;
    }

    // Build class names
    const classNames = [
        'poly-card',
        variant !== 'default' && `poly-card--${variant}`,
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classNames}
            style={cssVars as React.CSSProperties}
            data-component-id={component.id}
        >
            {showHeader && title && (
                <div className="poly-card__header">
                    <h3 className="poly-card__title" style={titleVars}>{title}</h3>
                    {description && (
                        <p className="poly-card__description" style={descriptionVars}>{description}</p>
                    )}
                </div>
            )}
            <div className="poly-card__content">
                {children.length > 0 ? (
                    children.map((child) => (
                        <ComponentRenderer
                            key={child.id}
                            component={child}
                            context={context}
                        />
                    ))
                ) : context === 'editor' ? (
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem' }}>Add content here</p>
                ) : null}
            </div>
            {showFooter && footer && (
                <div className="poly-card__footer" style={footerVars}>
                    <p>{footer}</p>
                </div>
            )}
        </div>
    );
};

export default CardRenderer;
