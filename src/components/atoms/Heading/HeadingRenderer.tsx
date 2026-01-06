/**
 * Heading Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';

import styles from '../atoms.module.css';

interface HeadingProps {
    content?: string;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: string;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    marginTop?: string;
    marginBottom?: string;
}

interface HeadingRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Heading component in the editor/preview.
 */
export const HeadingRenderer: React.FC<HeadingRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as HeadingProps;

    const tag = props.tag || 'h2';
    const content = props.content || 'Heading';

    const style: React.CSSProperties = {
        fontSize: props.fontSize || undefined,
        fontWeight: props.fontWeight || undefined,
        fontFamily: props.fontFamily || undefined,
        lineHeight: props.lineHeight || undefined,
        letterSpacing: props.letterSpacing || undefined,
        textTransform: props.textTransform as React.CSSProperties['textTransform'] || undefined,
        textAlign: props.textAlign || undefined,
        color: props.color || undefined,
        marginTop: props.marginTop || undefined,
        marginBottom: props.marginBottom || undefined,
        // Reset default browser margins
        margin: (props.marginTop || props.marginBottom) ? undefined : 0,
    };

    const HeadingTag = tag as keyof JSX.IntrinsicElements;

    return (
        <HeadingTag
            className={styles.heading}
            style={style}
            data-component-id={component.id}
        >
            {content}
        </HeadingTag>
    );
};

export default HeadingRenderer;
