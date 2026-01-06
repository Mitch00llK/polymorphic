/**
 * Heading Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';

import styles from './renderers.module.css';

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
    const props = component.props || {};

    const tag = props.tag || 'h2';
    const content = props.content || 'Heading';

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
        styles.heading,
        styles[`heading--${tag}`],
        props.textAlign && props.textAlign !== 'left' ? styles[`text-${props.textAlign}`] : '',
    ].filter(Boolean).join(' ');

    const HeadingTag = tag as keyof JSX.IntrinsicElements;

    return (
        <HeadingTag
            className={classNames}
            style={style}
            data-component-id={component.id}
        >
            {content}
        </HeadingTag>
    );
};

export default HeadingRenderer;
