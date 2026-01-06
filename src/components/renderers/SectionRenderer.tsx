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
    const props = component.props || {};

    const { setNodeRef, isOver } = useDroppable({
        id: `drop-${component.id}`,
        data: {
            type: 'container-drop-zone',
            containerId: component.id,
            accepts: ['heading', 'text', 'image', 'button', 'container'],
        },
    });

    const style: React.CSSProperties = {
        backgroundColor: props.backgroundColor || undefined,
        backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
        backgroundSize: props.backgroundSize || 'cover',
        backgroundPosition: props.backgroundPosition || 'center',
        paddingTop: props.paddingTop || '4rem',
        paddingBottom: props.paddingBottom || '4rem',
        minHeight: props.minHeight || undefined,
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
