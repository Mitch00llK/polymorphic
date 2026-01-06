/**
 * Sidebar Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
    Type,
    Image,
    MousePointer2,
    Layout,
    Box,
    AlignLeft,
    // UI component icons
    CreditCard,
    ChevronDown,
    Layers,
    AlertCircle,
    Tag,
    User,
    Minus,
} from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';
import type { ComponentType } from '../../types/components';

import styles from './Sidebar.module.css';

/**
 * Component definition for the sidebar.
 */
interface ComponentDefinition {
    type: ComponentType;
    label: string;
    icon: React.ReactNode;
    category: 'layout' | 'content' | 'media' | 'actions' | 'ui';
}

/**
 * Available components to drag onto the canvas.
 */
const COMPONENTS: ComponentDefinition[] = [
    // Layout
    { type: 'section', label: 'Section', icon: <Layout size={20} />, category: 'layout' },
    { type: 'container', label: 'Container', icon: <Box size={20} />, category: 'layout' },
    // Content
    { type: 'heading', label: 'Heading', icon: <Type size={20} />, category: 'content' },
    { type: 'text', label: 'Text', icon: <AlignLeft size={20} />, category: 'content' },
    // Media
    { type: 'image', label: 'Image', icon: <Image size={20} />, category: 'media' },
    // Actions
    { type: 'button', label: 'Button', icon: <MousePointer2 size={20} />, category: 'actions' },
    // UI Components (shadcn-style)
    { type: 'card', label: 'Card', icon: <CreditCard size={20} />, category: 'ui' },
    { type: 'accordion', label: 'Accordion', icon: <ChevronDown size={20} />, category: 'ui' },
    { type: 'tabs', label: 'Tabs', icon: <Layers size={20} />, category: 'ui' },
    { type: 'alert', label: 'Alert', icon: <AlertCircle size={20} />, category: 'ui' },
    { type: 'badge', label: 'Badge', icon: <Tag size={20} />, category: 'ui' },
    { type: 'avatar', label: 'Avatar', icon: <User size={20} />, category: 'ui' },
    { type: 'separator', label: 'Separator', icon: <Minus size={20} />, category: 'ui' },
];

/**
 * Draggable component item in the sidebar.
 */
interface DraggableComponentProps {
    definition: ComponentDefinition;
    onAdd: (type: ComponentType) => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
    definition,
    onAdd,
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `sidebar-${definition.type}`,
        data: {
            type: 'new-component',
            componentType: definition.type,
        },
    });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <button
            ref={setNodeRef}
            style={style}
            className={`${styles.componentButton} ${isDragging ? styles.isDragging : ''}`}
            onClick={() => onAdd(definition.type)}
            title={`Drag or click to add ${definition.label}`}
            {...listeners}
            {...attributes}
        >
            <span className={styles.componentIcon}>{definition.icon}</span>
            <span className={styles.componentLabel}>{definition.label}</span>
        </button>
    );
};

/**
 * Sidebar component with draggable component library.
 */
export const Sidebar: React.FC = () => {
    const { addComponent } = useBuilderStore();

    const handleAddComponent = (type: ComponentType) => {
        addComponent(type);
    };

    const groupedComponents = COMPONENTS.reduce((acc, comp) => {
        if (!acc[comp.category]) {
            acc[comp.category] = [];
        }
        acc[comp.category].push(comp);
        return acc;
    }, {} as Record<string, ComponentDefinition[]>);

    const categoryLabels: Record<string, string> = {
        layout: 'Layout',
        content: 'Content',
        media: 'Media',
        actions: 'Actions',
        ui: 'UI Components',
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h2 className={styles.title}>Components</h2>
                <p className={styles.hint}>Drag or click to add</p>
            </div>

            <div className={styles.content}>
                {Object.entries(groupedComponents).map(([category, components]) => (
                    <div key={category} className={styles.category}>
                        <h3 className={styles.categoryTitle}>
                            {categoryLabels[category] || category}
                        </h3>
                        <div className={styles.componentGrid}>
                            {components.map((comp) => (
                                <DraggableComponent
                                    key={comp.type}
                                    definition={comp}
                                    onAdd={handleAddComponent}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;

