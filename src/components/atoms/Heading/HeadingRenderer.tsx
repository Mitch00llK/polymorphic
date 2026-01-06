/**
 * Heading Renderer
 *
 * Uses CSS classes + custom properties for clean DOM.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildCSSVariables, type CSSVariableProps } from '../../../utils/cssVariables';

interface HeadingRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Heading component with CSS variables.
 */
export const HeadingRenderer: React.FC<HeadingRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as CSSVariableProps;

    const tag = (props.tag as string) || 'h2';
    const content = (props.content as string) || 'Heading';

    // Build CSS variables from props
    const cssVars = buildCSSVariables(props);

    // Build class names
    const classNames = [
        'poly-heading',
        `poly-heading--${tag}`,
    ].join(' ');

    const HeadingTag = tag as keyof JSX.IntrinsicElements;

    return (
        <HeadingTag
            className={classNames}
            style={cssVars}
            data-component-id={component.id}
        >
            {content}
        </HeadingTag>
    );
};

export default HeadingRenderer;
