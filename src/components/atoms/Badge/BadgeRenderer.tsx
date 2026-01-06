/**
 * Badge Renderer
 *
 * Uses CSS classes + custom properties for clean DOM.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildCSSVariables, type CSSVariableProps } from '../../../utils/cssVariables';

interface BadgeRendererProps {
    component: ComponentData;
    context?: 'editor' | 'preview';
}

interface BadgeProps extends CSSVariableProps {
    text?: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

/**
 * Renders a Badge component with CSS variables.
 */
export const BadgeRenderer: React.FC<BadgeRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as BadgeProps;

    const text = props.text || 'Badge';
    const variant = props.variant || 'default';

    // Build CSS variables from props
    const cssVars = buildCSSVariables(props);

    // Build class names
    const classNames = [
        'poly-badge',
        variant !== 'default' && `poly-badge--${variant}`,
    ].filter(Boolean).join(' ');

    return (
        <span
            className={classNames}
            style={cssVars}
            data-component-id={component.id}
        >
            {text}
        </span>
    );
};

export default BadgeRenderer;
