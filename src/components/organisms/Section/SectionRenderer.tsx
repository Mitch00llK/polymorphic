/**
 * Section Renderer
 *
 * Uses CSS classes + custom properties for clean DOM.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { buildCSSVariables, type CSSVariableProps } from '../../../utils/cssVariables';

interface SectionRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

interface SectionProps extends CSSVariableProps {
    verticalAlign?: 'start' | 'center' | 'end' | 'stretch' | 'between' | 'around';
    horizontalAlign?: 'start' | 'center' | 'end' | 'stretch';
    direction?: 'row' | 'column';
}

/**
 * Maps alignment values to CSS flexbox properties.
 */
const mapAlign = (align?: string): string | undefined => {
    switch (align) {
        case 'start': return 'flex-start';
        case 'center': return 'center';
        case 'end': return 'flex-end';
        case 'stretch': return 'stretch';
        case 'between': return 'space-between';
        case 'around': return 'space-around';
        default: return undefined;
    }
};

/**
 * Renders a Section component with CSS variables.
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({
    component,
    context,
}) => {
    const props = (component.props || {}) as SectionProps;
    const children = component.children || [];

    // Build CSS variables from props
    const cssVars = buildCSSVariables(props) as Record<string, string | number | undefined>;

    // Map legacy alignment props to CSS variables
    const justifyContent = mapAlign(props.verticalAlign);
    const alignItems = mapAlign(props.horizontalAlign);
    
    if (justifyContent && !cssVars['--poly-justify-content']) {
        cssVars['--poly-justify-content'] = justifyContent;
    }
    if (alignItems && !cssVars['--poly-align-items']) {
        cssVars['--poly-align-items'] = alignItems;
    }
    if (props.direction && !cssVars['--poly-flex-direction']) {
        cssVars['--poly-flex-direction'] = props.direction;
    }

    return (
        <section
            className="poly-section"
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
                <div className="poly-section__empty">
                    + Add content to this section
                </div>
            ) : null}
        </section>
    );
};

export default SectionRenderer;
