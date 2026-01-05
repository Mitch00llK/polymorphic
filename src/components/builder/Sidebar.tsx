/**
 * Sidebar Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { Type, Image, MousePointer2, Layout, Box, AlignLeft } from 'lucide-react';

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
    category: 'layout' | 'content' | 'media' | 'actions';
}

/**
 * Available components to drag onto the canvas.
 */
const COMPONENTS: ComponentDefinition[] = [
    { type: 'section', label: 'Section', icon: <Layout size={20} />, category: 'layout' },
    { type: 'container', label: 'Container', icon: <Box size={20} />, category: 'layout' },
    { type: 'heading', label: 'Heading', icon: <Type size={20} />, category: 'content' },
    { type: 'text', label: 'Text', icon: <AlignLeft size={20} />, category: 'content' },
    { type: 'image', label: 'Image', icon: <Image size={20} />, category: 'media' },
    { type: 'button', label: 'Button', icon: <MousePointer2 size={20} />, category: 'actions' },
];

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

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h2 className={styles.title}>Components</h2>
            </div>

            <div className={styles.content}>
                {Object.entries(groupedComponents).map(([category, components]) => (
                    <div key={category} className={styles.category}>
                        <h3 className={styles.categoryTitle}>{category}</h3>
                        <div className={styles.componentGrid}>
                            {components.map((comp) => (
                                <button
                                    key={comp.type}
                                    className={styles.componentButton}
                                    onClick={() => handleAddComponent(comp.type)}
                                    title={`Add ${comp.label}`}
                                >
                                    <span className={styles.componentIcon}>{comp.icon}</span>
                                    <span className={styles.componentLabel}>{comp.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
