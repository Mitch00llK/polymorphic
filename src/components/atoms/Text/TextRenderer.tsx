/**
 * Text Renderer
 *
 * Supports ALL control groups for maximum customization.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildAllStyles, type StyleableProps } from '../../../utils/styleBuilder';

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

    // Build ALL styles from ALL control groups
    const allStyles = buildAllStyles(props);

    const style: React.CSSProperties = {
        ...allStyles,
        // Multi-column support
        columnCount: columns && columns > 1 ? columns : undefined,
        // Reset default browser margins if no margin set
        margin: (!allStyles.marginTop && !allStyles.marginBottom && 
                 !allStyles.marginLeft && !allStyles.marginRight) ? 0 : undefined,
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
