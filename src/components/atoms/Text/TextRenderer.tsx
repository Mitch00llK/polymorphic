/**
 * Text Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';

import styles from '../atoms.module.css';

interface TextProps {
    content?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    marginTop?: string;
    marginBottom?: string;
    columns?: number;
}

interface TextRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Text component in the editor/preview.
 */
export const TextRenderer: React.FC<TextRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as TextProps;

    const content = props.content || '<p>Enter your text here...</p>';

    const style: React.CSSProperties = {
        fontSize: props.fontSize || undefined,
        fontWeight: props.fontWeight || undefined,
        fontFamily: props.fontFamily || undefined,
        lineHeight: props.lineHeight || undefined,
        letterSpacing: props.letterSpacing || undefined,
        textAlign: props.textAlign || undefined,
        color: props.color || undefined,
        marginTop: props.marginTop || undefined,
        marginBottom: props.marginBottom || undefined,
        columnCount: props.columns && props.columns > 1 ? props.columns : undefined,
        // Reset default browser margins
        margin: (props.marginTop || props.marginBottom) ? undefined : 0,
    };

    return (
        <div
            className={styles.text}
            style={style}
            data-component-id={component.id}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default TextRenderer;
