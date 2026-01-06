/**
 * Button Renderer
 *
 * Uses CSS classes + custom properties for clean DOM.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildCSSVariables, type CSSVariableProps } from '../../../utils/cssVariables';

interface ButtonRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

interface ButtonProps extends CSSVariableProps {
    text?: string;
    url?: string;
    target?: '_self' | '_blank';
    variant?: 'solid' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'small' | 'md' | 'medium' | 'lg' | 'large';
}

/**
 * Renders a Button component with CSS variables.
 */
export const ButtonRenderer: React.FC<ButtonRendererProps> = ({
    component,
    context,
}) => {
    const props = (component.props || {}) as ButtonProps;

    const text = props.text || 'Click Me';
    const url = props.url || '#';
    const target = props.target || '_self';
    const variant = props.variant || 'solid';
    const size = props.size || 'md';

    // Build CSS variables from props
    const cssVars = buildCSSVariables(props);

    // Handle width
    if (props.width === 'full') {
        (cssVars as Record<string, unknown>)['--poly-width'] = '100%';
    }

    // Build class names
    const sizeClass = (size === 'small' || size === 'sm') ? 'poly-button--sm' :
                      (size === 'large' || size === 'lg') ? 'poly-button--lg' : '';
    
    const classNames = [
        'poly-button',
        variant !== 'solid' && `poly-button--${variant}`,
        sizeClass,
    ].filter(Boolean).join(' ');

    // In editor context, prevent link navigation
    const handleClick = (e: React.MouseEvent) => {
        if (context === 'editor') {
            e.preventDefault();
        }
    };

    return (
        <a
            href={url}
            target={target}
            className={classNames}
            style={cssVars}
            data-component-id={component.id}
            onClick={handleClick}
        >
            {text}
        </a>
    );
};

export default ButtonRenderer;
