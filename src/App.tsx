import React, { useEffect, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';

import { Canvas } from './components/builder/Canvas';
import { Sidebar } from './components/builder/Sidebar';
import { LayerPanel } from './components/builder/LayerPanel';
import { Toolbar } from './components/builder/Toolbar';
import { PropertyPanel } from './components/builder/PropertyPanel';
import { useBuilderStore, useBuilderKeyboardShortcuts } from './store/builderStore';
import { loadBuilderData } from './utils/api';
import type { ComponentType } from './types/components';

import styles from './styles/app.module.css';

/**
 * Root application component.
 */
const App: React.FC = () => {
    const { postId } = window.polymorphicSettings;
    const {
        setComponents,
        setLoading,
        isLoading,
        addComponent,
        components,
        moveComponent,
    } = useBuilderStore();

    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggedType, setDraggedType] = useState<ComponentType | null>(null);
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

    // Keyboard shortcuts for undo/redo, delete, duplicate.
    const { handleKeyDown } = useBuilderKeyboardShortcuts();

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Prevent accidental drags.
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Load existing data on mount.
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await loadBuilderData(postId);
                if (data?.components) {
                    setComponents(data.components);
                }
            } catch (error) {
                console.error('[Polymorphic] Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!window.polymorphicSettings.isNewPost) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [postId, setComponents, setLoading]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(String(active.id));

        // Check if this is a new component from sidebar.
        if (active.data.current?.type === 'new-component') {
            setDraggedType(active.data.current.componentType as ComponentType);
        }
        // Check if this is moving an existing component.
        else if (active.data.current?.type === 'move') {
            setDraggedType(active.data.current.componentType as ComponentType);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            setDraggedType(null);
            return;
        }

        // Check if dropping into a container (Section or Container).
        const isContainerDrop = over.data.current?.type === 'container-drop-zone' ||
            over.data.current?.type === 'container';
        const containerId = over.data.current?.containerId as string | undefined;

        // New component from sidebar.
        if (active.data.current?.type === 'new-component') {
            const componentType = active.data.current.componentType as ComponentType;

            if (isContainerDrop && containerId) {
                // Add as child of container.
                addComponent(componentType, containerId);
            } else {
                // Add to root level.
                addComponent(componentType);
            }
        }
        // Moving existing components (from drag handle).
        else if (active.data.current?.type === 'move') {
            const componentId = active.data.current.componentId as string;

            if (isContainerDrop && containerId && componentId !== containerId) {
                // Move into container.
                moveComponent(componentId, containerId, 0);
            } else if (!isContainerDrop) {
                // Reordering at current level - find target position.
                // Extract component ID from over.id if it has move- prefix.
                let overId = String(over.id);
                if (overId.startsWith('move-')) {
                    overId = overId.replace('move-', '');
                }

                const oldIndex = components.findIndex((c) => c.id === componentId);
                const newIndex = components.findIndex((c) => c.id === overId);

                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    moveComponent(componentId, null, newIndex);
                }
            }
        }
        // Legacy: Moving existing components without data.current.type.
        else if (active.id !== over.id) {
            const activeId = String(active.id);

            if (isContainerDrop && containerId) {
                // Move into container.
                moveComponent(activeId, containerId, 0);
            } else {
                // Reordering at root level.
                const oldIndex = components.findIndex((c) => c.id === active.id);
                const newIndex = components.findIndex((c) => c.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    moveComponent(activeId, null, newIndex);
                }
            }
        }

        setActiveId(null);
        setDraggedType(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
        setDraggedType(null);
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <span>Loading builder...</span>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className={styles.app}>
                {/* Top Toolbar */}
                <Toolbar />

                {/* Main Content Area */}
                <div className={styles.main}>
                    {/* Left Panel Toggle (when collapsed) */}
                    {leftPanelCollapsed && (
                        <button
                            className={`${styles.panelToggle} ${styles.panelToggleLeft}`}
                            onClick={() => setLeftPanelCollapsed(false)}
                            title="Show components panel"
                        >
                            <PanelLeftOpen size={18} className={styles.panelToggleIcon} />
                        </button>
                    )}

                    {/* Left Panel - Sidebar + Layers */}
                    <div className={styles.leftPanel}>
                        <Sidebar
                            isCollapsed={leftPanelCollapsed}
                            onToggle={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                        />
                        {!leftPanelCollapsed && <LayerPanel />}
                    </div>

                    {/* Center - Canvas */}
                    <Canvas />

                    {/* Right - Property Panel */}
                    <PropertyPanel
                        isCollapsed={rightPanelCollapsed}
                        onToggle={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                    />

                    {/* Right Panel Toggle (when collapsed) */}
                    {rightPanelCollapsed && (
                        <button
                            className={`${styles.panelToggle} ${styles.panelToggleRight}`}
                            onClick={() => setRightPanelCollapsed(false)}
                            title="Show properties panel"
                        >
                            <PanelRightOpen size={18} className={styles.panelToggleIcon} />
                        </button>
                    )}
                </div>
            </div>

            {/* Drag overlay for visual feedback */}
            <DragOverlay>
                {draggedType && (
                    <div className={styles.dragPreview}>
                        + {draggedType}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
};

export default App;

