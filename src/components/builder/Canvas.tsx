/**
 * Canvas Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useBuilderStore } from '../../store/builderStore';
import { ComponentRenderer } from '../renderers/ComponentRenderer';
import type { ComponentData } from '../../types/components';

import styles from './Canvas.module.css';

/**
 * Sortable wrapper for each component.
 */
interface SortableComponentProps {
    component: ComponentData;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const SortableComponent: React.FC<SortableComponentProps> = ({
    component,
    isSelected,
    onSelect,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: component.id,
        data: {
            type: 'existing-component',
            componentId: component.id,
        },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${styles.componentWrapper} ${isSelected ? styles.isSelected : ''} ${isDragging ? styles.isDragging : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(component.id);
            }}
            {...attributes}
            {...listeners}
        >
            <ComponentRenderer component={component} context="editor" />
            {isSelected && (
                <div className={styles.selectedOverlay}>
                    <span className={styles.componentLabel}>{component.type}</span>
                </div>
            )}
        </div>
    );
};

/**
 * Main canvas component where components are rendered and arranged.
 */
export const Canvas: React.FC = () => {
    const { components, selectedId, selectComponent, currentBreakpoint } =
        useBuilderStore();

    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-drop-zone',
    });

    const handleCanvasClick = () => {
        selectComponent(null);
    };

    // Determine viewport width based on breakpoint.
    const viewportWidth = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    }[currentBreakpoint];

    return (
        <div className={styles.canvas} onClick={handleCanvasClick}>
            <div
                ref={setNodeRef}
                className={`${styles.viewport} ${isOver ? styles.isDropTarget : ''}`}
                style={{ maxWidth: viewportWidth }}
            >
                <SortableContext
                    items={components.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {components.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>📦</div>
                            <h3 className={styles.emptyTitle}>Start Building</h3>
                            <p className={styles.emptyText}>
                                Drag components from the sidebar or click to add
                            </p>
                        </div>
                    ) : (
                        <div className={styles.componentList}>
                            {components.map((component) => (
                                <SortableComponent
                                    key={component.id}
                                    component={component}
                                    isSelected={selectedId === component.id}
                                    onSelect={selectComponent}
                                />
                            ))}
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

export default Canvas;
