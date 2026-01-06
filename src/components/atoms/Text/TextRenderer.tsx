/**
 * Text Renderer
 *
 * Uses CSS classes + custom properties for clean DOM.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildCSSVariables, type CSSVariableProps } from '../../../utils/cssVariables';

interface TextRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Text component with CSS variables.
 */
export const TextRenderer: React.FC<TextRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as CSSVariableProps & { content?: string; columns?: number };

    const content = props.content || '<p>Enter your text here...</p>';

    // Build CSS variables from props
    const cssVars = buildCSSVariables(props);

    // Add column count as CSS variable if set
    if (props.columns && props.columns > 1) {
        (cssVars as Record<string, unknown>)['--poly-column-count'] = props.columns;
    }

    return (
        <div
            className="poly-text"
            style={cssVars}
            data-component-id={component.id}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default TextRenderer;
