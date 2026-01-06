/**
 * Section Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { ComponentData } from '../../types/components';
import { renderChildren } from './ComponentRenderer';
import { buildStyles, type StyleableProps } from '../../utils/styleBuilder';

import styles from './renderers.module.css';

interface SectionRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Section component in the editor/preview.
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({
    component,
    context,
}) => {
    const props = component.props as StyleableProps || {};

    const { setNodeRef, isOver } = useDroppable({
        id: `drop-${component.id}`,
        data: {
            type: 'container-drop-zone',
            containerId: component.id,
            accepts: ['heading', 'text', 'image', 'button', 'container'],
        },
    });

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['layout', 'box', 'size', 'spacing']);

    // Component-specific styles with defaults
    const style: React.CSSProperties = {
        ...sharedStyles,
        // Default padding if not set
        paddingTop: sharedStyles.paddingTop || '4rem',
        paddingBottom: sharedStyles.paddingBottom || '4rem',
        // Background position default
        backgroundPosition: sharedStyles.backgroundPosition || 'center',
        backgroundSize: sharedStyles.backgroundSize || 'cover',
    };

    const classNames = [
        styles.section,
        props.style && props.style !== 'default' ? styles[`section--${props.style}`] : '',
    ].filter(Boolean).join(' ');

    const hasChildren = component.children && component.children.length > 0;

    return (
        <section
            className={classNames}
            style={style}
            data-component-id={component.id}
        >
            <div
                ref={context === 'editor' ? setNodeRef : undefined}
                className={`${styles.sectionInner} ${isOver && context === 'editor' ? styles.isDropTarget : ''}`}
            >
                {hasChildren ? (
                    renderChildren(component.children, context)
                ) : (
                    context === 'editor' && (
                        <div className={styles.dropZone}>
                            Drop components here
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default SectionRenderer;
