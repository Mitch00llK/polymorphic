/**
 * Heading Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../atoms.module.css';

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
    const props = (component.props || {}) as StyleableProps;

    const tag = (props.tag as string) || 'h2';
    const content = (props.content as string) || 'Heading';

    // Build styles from shared control groups (same as marketing blocks)
    const sharedStyles = buildStyles(props, ['typography', 'box', 'spacing', 'position']);

    const style: React.CSSProperties = {
        ...sharedStyles,
        // Reset default browser margins if no margin set
        margin: (!sharedStyles.marginTop && !sharedStyles.marginBottom && 
                 !sharedStyles.marginLeft && !sharedStyles.marginRight) ? 0 : undefined,
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
