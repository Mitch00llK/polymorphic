/**
 * Heading Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';
import { buildStyles, type StyleableProps } from '../../utils/styleBuilder';

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
    const props = component.props as StyleableProps || {};

    const tag = (props.tag as string) || 'h2';
    const content = (props.content as string) || 'Heading';

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['typography', 'box', 'spacing', 'position']);

    // Component-specific defaults
    const style: React.CSSProperties = {
        ...sharedStyles,
        // Default margin if not set
        marginBottom: sharedStyles.marginBottom || '1rem',
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
