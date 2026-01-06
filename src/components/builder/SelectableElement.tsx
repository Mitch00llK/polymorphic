/**
 * Selectable Element Wrapper
 *
 * Wraps any component element to make it selectable and draggable in the editor.
 * Shows a selection frame when selected and a drag handle for reordering.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

import styles from './SelectableElement.module.css';

interface SelectableElementProps {
    /** The component ID this element belongs to */
    componentId: string;
    /** The component type for display */
    componentType: string;
    /** Children to render */
    children: React.ReactNode;
    /** Optional className to apply to the wrapper */
    className?: string;
    /** Optional style to apply to the wrapper */
    style?: React.CSSProperties;
    /** HTML element to render as (default: div) */
    as?: keyof JSX.IntrinsicElements;
    /** Whether this is in editor context */
    context?: 'editor' | 'preview';
}

/**
 * Wraps a component to make it selectable and draggable in the builder.
 * In preview mode, renders children directly without selection UI.
 */
export const SelectableElement: React.FC<SelectableElementProps> = ({
    componentId,
    componentType,
    children,
    className = '',
    style,
    as: Element = 'div',
    context = 'editor',
}) => {
    const { selectedId, selectComponent } = useBuilderStore();
    const isSelected = selectedId === componentId;

    // Setup draggable for in-canvas drag operations
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: `move-${componentId}`,
        data: {
            type: 'move',
            componentId,
            componentType,
        },
    });

    // In preview mode, render without selection wrapper
    if (context === 'preview') {
        return (
            <Element className={className} style={style} data-component-id={componentId}>
                {children}
            </Element>
        );
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectComponent(componentId);
    };

    // Apply transform when dragging
    const dragStyle: React.CSSProperties = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            zIndex: isDragging ? 1000 : undefined,
            opacity: isDragging ? 0.8 : undefined,
        }
        : {};

    const wrapperClasses = [
        styles.selectableElement,
        isSelected && styles.isSelected,
        isDragging && styles.isDragging,
        className,
    ].filter(Boolean).join(' ');

    return (
        <Element
            ref={setNodeRef}
            className={wrapperClasses}
            style={{ ...style, ...dragStyle }}
            onClick={handleClick}
            data-component-id={componentId}
            data-component-type={componentType}
            {...attributes}
        >
            {children}

            {/* Selection frame with label and drag handle */}
            {isSelected && (
                <div className={styles.selectionFrame}>
                    <div className={styles.selectionToolbar}>
                        {/* Drag handle */}
                        <button
                            className={styles.dragHandle}
                            {...listeners}
                            title="Drag to move"
                            aria-label="Drag handle"
                        >
                            <GripVertical size={14} />
                        </button>
                        {/* Component label */}
                        <span className={styles.selectionLabel}>{componentType}</span>
                    </div>
                </div>
            )}

            {/* Hover drag handle (shows when not selected) */}
            {!isSelected && (
                <div className={styles.hoverDragHandle}>
                    <button
                        className={styles.dragHandleButton}
                        {...listeners}
                        title="Drag to move"
                        aria-label="Drag handle"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical size={12} />
                    </button>
                </div>
            )}
        </Element>
    );
};

export default SelectableElement;
