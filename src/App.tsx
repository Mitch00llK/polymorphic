/**
 * Main App Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

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

import { Canvas } from './components/builder/Canvas';
import { Sidebar } from './components/builder/Sidebar';
import { Toolbar } from './components/builder/Toolbar';
import { PropertyPanel } from './components/builder/PropertyPanel';
import { useBuilderStore } from './store/builderStore';
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
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // New component from sidebar.
        if (active.data.current?.type === 'new-component') {
            const componentType = active.data.current.componentType as ComponentType;
            addComponent(componentType);
        }
        // Reordering existing components.
        else if (over && active.id !== over.id) {
            const oldIndex = components.findIndex((c) => c.id === active.id);
            const newIndex = components.findIndex((c) => c.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                moveComponent(String(active.id), null, newIndex);
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
                    {/* Left Sidebar - Component Library */}
                    <Sidebar />

                    {/* Center - Canvas */}
                    <Canvas />

                    {/* Right - Property Panel */}
                    <PropertyPanel />
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

