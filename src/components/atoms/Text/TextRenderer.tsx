/**
 * Text Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../atoms.module.css';

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
    const props = (component.props || {}) as StyleableProps;

    const content = (props.content as string) || '<p>Enter your text here...</p>';
    const columns = props.columns as number;

    // Build styles from shared control groups (same as marketing blocks)
    const sharedStyles = buildStyles(props, ['typography', 'box', 'spacing', 'position']);

    const style: React.CSSProperties = {
        ...sharedStyles,
        // Multi-column support
        columnCount: columns && columns > 1 ? columns : undefined,
        // Reset default browser margins if no margin set
        margin: (!sharedStyles.marginTop && !sharedStyles.marginBottom && 
                 !sharedStyles.marginLeft && !sharedStyles.marginRight) ? 0 : undefined,
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
