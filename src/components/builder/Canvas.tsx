/**
 * Canvas Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Copy, GripVertical } from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';
import { ComponentRenderer } from '../ComponentRenderer';
import type { ComponentData } from '../../types/components';

import styles from './Canvas.module.css';

/**
 * Context menu state.
 */
interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    componentId: string | null;
}

/**
 * Sortable wrapper for top-level components (drag-and-drop).
 */
interface SortableComponentProps {
    component: ComponentData;
    isSelected: boolean;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onContextMenu: (e: React.MouseEvent, id: string) => void;
}

const SortableComponent: React.FC<SortableComponentProps> = ({
    component,
    isSelected,
    onDelete,
    onDuplicate,
    onContextMenu,
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

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(component.id);
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDuplicate(component.id);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, component.id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${styles.sortableWrapper} ${isDragging ? styles.isDragging : ''}`}
            onContextMenu={handleContextMenu}
        >
            {/* Component with selection handled by SelectableElement */}
            <ComponentRenderer component={component} context="editor" />

            {/* Floating toolbar for top-level components */}
            {isSelected && (
                <div className={styles.floatingToolbar}>
                    <button
                        className={styles.toolbarButton}
                        {...attributes}
                        {...listeners}
                        title="Drag to move"
                    >
                        <GripVertical size={14} />
                    </button>
                    <button
                        className={styles.toolbarButton}
                        onClick={handleDuplicate}
                        title="Duplicate"
                    >
                        <Copy size={14} />
                    </button>
                    <button
                        className={`${styles.toolbarButton} ${styles.deleteButton}`}
                        onClick={handleDelete}
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

/**
 * Main canvas component where components are rendered and arranged.
 */
export const Canvas: React.FC = () => {
    const {
        components,
        selectedId,
        selectComponent,
        currentBreakpoint,
        removeComponent,
        duplicateComponent,
    } = useBuilderStore();

    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        visible: false,
        x: 0,
        y: 0,
        componentId: null,
    });

    const canvasRef = useRef<HTMLDivElement>(null);

    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-drop-zone',
    });

    // Handle keyboard shortcuts.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedId) return;

            // Don't delete if user is typing in an input.
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                handleDelete(selectedId);
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
                e.preventDefault();
                duplicateComponent(selectedId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, duplicateComponent]);

    // Close context menu on click outside.
    useEffect(() => {
        const handleClick = () => {
            if (contextMenu.visible) {
                setContextMenu({ ...contextMenu, visible: false });
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleCanvasClick = () => {
        selectComponent(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this component?')) {
            removeComponent(id);
        }
    };

    const handleDuplicate = (id: string) => {
        duplicateComponent(id);
    };

    const handleContextMenu = (e: React.MouseEvent, id: string) => {
        selectComponent(id);
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            componentId: id,
        });
    };

    const handleContextMenuAction = (action: 'delete' | 'duplicate') => {
        if (!contextMenu.componentId) return;

        if (action === 'delete') {
            handleDelete(contextMenu.componentId);
        } else if (action === 'duplicate') {
            handleDuplicate(contextMenu.componentId);
        }

        setContextMenu({ ...contextMenu, visible: false });
    };

    // Determine viewport width based on breakpoint.
    const viewportWidth = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    }[currentBreakpoint];

    return (
        <div ref={canvasRef} className={styles.canvas} onClick={handleCanvasClick}>
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
                                    onDelete={handleDelete}
                                    onDuplicate={handleDuplicate}
                                    onContextMenu={handleContextMenu}
                                />
                            ))}
                        </div>
                    )}
                </SortableContext>
            </div>

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    className={styles.contextMenu}
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    <button
                        className={styles.contextMenuItem}
                        onClick={() => handleContextMenuAction('duplicate')}
                    >
                        <Copy size={14} />
                        <span>Duplicate</span>
                        <kbd>⌘D</kbd>
                    </button>
                    <button
                        className={`${styles.contextMenuItem} ${styles.contextMenuDanger}`}
                        onClick={() => handleContextMenuAction('delete')}
                    >
                        <Trash2 size={14} />
                        <span>Delete</span>
                        <kbd>⌫</kbd>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Canvas;
