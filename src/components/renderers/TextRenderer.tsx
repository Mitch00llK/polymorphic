/**
 * Text Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';
import { buildStyles, type StyleableProps } from '../../utils/styleBuilder';

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
    const props = component.props as StyleableProps || {};

    const tag = (props.tag as string) || 'p';
    const content = (props.content as string) || 'Enter your text here...';

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['typography', 'box', 'spacing', 'position']);

    // Component-specific defaults
    const style: React.CSSProperties = {
        ...sharedStyles,
        // Default margin if not set
        marginBottom: sharedStyles.marginBottom || '1rem',
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
