/**
 * Canvas Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useBuilderStore } from '../../store/builderStore';
import { ComponentRenderer } from '../renderers/ComponentRenderer';

import styles from './Canvas.module.css';

/**
 * Main canvas component where components are rendered and arranged.
 */
export const Canvas: React.FC = () => {
    const {
        components,
        selectedId,
        selectComponent,
        moveComponent,
        currentBreakpoint,
    } = useBuilderStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = components.findIndex((c) => c.id === active.id);
            const newIndex = components.findIndex((c) => c.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                moveComponent(String(active.id), null, newIndex);
            }
        }
    };

    const handleCanvasClick = () => {
        selectComponent(null);
    };

    const handleComponentClick = (e: React.MouseEvent, componentId: string) => {
        e.stopPropagation();
        selectComponent(componentId);
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
                className={styles.viewport}
                style={{ maxWidth: viewportWidth }}
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
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
                                    Drag components from the sidebar to get started
                                </p>
                            </div>
                        ) : (
                            <div className={styles.componentList}>
                                {components.map((component) => (
                                    <div
                                        key={component.id}
                                        className={`${styles.componentWrapper} ${selectedId === component.id ? styles.isSelected : ''
                                            }`}
                                        onClick={(e) => handleComponentClick(e, component.id)}
                                    >
                                        <ComponentRenderer
                                            component={component}
                                            context="editor"
                                        />
                                        {selectedId === component.id && (
                                            <div className={styles.selectedOverlay}>
                                                <span className={styles.componentLabel}>
                                                    {component.type}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

export default Canvas;

