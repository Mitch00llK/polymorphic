/**
 * Container Renderer
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

interface ContainerRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Container component in the editor/preview.
 */
export const ContainerRenderer: React.FC<ContainerRendererProps> = ({
    component,
    context,
}) => {
    const props = component.props as StyleableProps || {};

    const { setNodeRef, isOver } = useDroppable({
        id: `drop-${component.id}`,
        data: {
            type: 'container-drop-zone',
            containerId: component.id,
            accepts: ['heading', 'text', 'image', 'button'],
        },
    });

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['layout', 'box', 'size', 'spacing']);

    // Component-specific styles with defaults
    const style: React.CSSProperties = {
        ...sharedStyles,
        // Default horizontal padding if not set
        paddingLeft: sharedStyles.paddingLeft || '1rem',
        paddingRight: sharedStyles.paddingRight || '1rem',
    };

    const classNames = [
        styles.container,
        props.width && props.width !== 'default' ? styles[`container--${props.width}`] : '',
        isOver && context === 'editor' ? styles.isDropTarget : '',
    ].filter(Boolean).join(' ');

    const hasChildren = component.children && component.children.length > 0;

    return (
        <div
            ref={context === 'editor' ? setNodeRef : undefined}
            className={classNames}
            style={style}
            data-component-id={component.id}
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
    );
};

export default ContainerRenderer;
