/**
 * Text Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';

import styles from './renderers.module.css';

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
    const props = component.props || {};

    const tag = props.tag || 'p';
    const content = props.content || 'Enter your text here...';

    const style: React.CSSProperties = {
        fontSize: props.fontSize || undefined,
        fontWeight: props.fontWeight || undefined,
        color: props.color || undefined,
        textAlign: (props.textAlign as React.CSSProperties['textAlign']) || undefined,
        marginTop: props.marginTop || undefined,
        marginBottom: props.marginBottom || '1rem',
        lineHeight: props.lineHeight || undefined,
        letterSpacing: props.letterSpacing || undefined,
    };

    const classNames = [
        styles.text,
        props.variant && props.variant !== 'default' ? styles[`text--${props.variant}`] : '',
        props.textAlign && props.textAlign !== 'left' ? styles[`text-${props.textAlign}`] : '',
    ].filter(Boolean).join(' ');

    const TextTag = tag as keyof JSX.IntrinsicElements;

    return (
        <TextTag
            className={classNames}
            style={style}
            data-component-id={component.id}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default TextRenderer;
