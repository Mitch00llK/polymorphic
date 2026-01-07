/**
 * Sidebar Component
 *
 * Component library with toggle between Components and Layers view.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { componentRegistry, ComponentRegistration } from '../../services/componentRegistry';
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
    ChevronLeft,
    ChevronRight,
    Layers,
    AlertCircle,
    Tag,
    User,
    Minus,
    // Block icons
    Star,
    Grid3X3,
    DollarSign,
    HelpCircle,
    Megaphone,
    // Template library
    LayoutTemplate,
    // SaaS Icons
    Quote,
    BarChart3,
    LayoutGrid,
    Hash,
    // View toggle
    Component,
} from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';
import { TemplateLibrary } from './TemplateLibrary';
import type { ComponentType, ComponentData } from '../../types/components';
import { GENERATED_COMPONENTS } from '../../generated/sidebarComponents.generated';

import styles from './Sidebar.module.css';

/**
 * Component definition for the sidebar.
 */
interface ComponentDefinition {
    type: ComponentType;
    label: string;
    icon: React.ReactNode;
    category: 'layout' | 'content' | 'media' | 'actions' | 'ui' | 'blocks';
    isThirdParty?: boolean;
}

/**
 * Core components (manually defined, not auto-discovered).
 */
const CORE_COMPONENTS: ComponentDefinition[] = [
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
    // Marketing Blocks (core)
    { type: 'heroBlock', label: 'Hero', icon: <Star size={20} />, category: 'blocks' },
    { type: 'featuresBlock', label: 'Features', icon: <Grid3X3 size={20} />, category: 'blocks' },
    { type: 'pricingBlock', label: 'Pricing', icon: <DollarSign size={20} />, category: 'blocks' },
    { type: 'faqBlock', label: 'FAQ', icon: <HelpCircle size={20} />, category: 'blocks' },
    { type: 'ctaBlock', label: 'CTA', icon: <Megaphone size={20} />, category: 'blocks' },
];

/**
 * Merged components: core + auto-discovered.
 */
const COMPONENTS: ComponentDefinition[] = [
    ...CORE_COMPONENTS,
    ...GENERATED_COMPONENTS as ComponentDefinition[],
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
 * Get icon for component type.
 */
const getLayerIcon = (type: string): React.ReactNode => {
    const iconSize = 14;
    switch (type) {
        case 'section': return <Layout size={iconSize} />;
        case 'container': return <Box size={iconSize} />;
        case 'heading': return <Type size={iconSize} />;
        case 'text': return <AlignLeft size={iconSize} />;
        case 'image': return <Image size={iconSize} />;
        case 'button': return <MousePointer2 size={iconSize} />;
        case 'card': return <CreditCard size={iconSize} />;
        case 'alert': return <AlertCircle size={iconSize} />;
        case 'badge': return <Tag size={iconSize} />;
        case 'avatar': return <User size={iconSize} />;
        case 'separator': return <Minus size={iconSize} />;
        case 'heroBlock': return <Star size={iconSize} />;
        case 'featuresBlock': return <Grid3X3 size={iconSize} />;
        case 'pricingBlock': return <DollarSign size={iconSize} />;
        case 'faqBlock': return <HelpCircle size={iconSize} />;
        case 'ctaBlock': return <Megaphone size={iconSize} />;
        case 'testimonialBlock': return <Quote size={iconSize} />;
        case 'statsBlock': return <BarChart3 size={iconSize} />;
        case 'logoCloud': return <LayoutGrid size={iconSize} />;
        default: return <Box size={iconSize} />;
    }
};

/**
 * Get display label for component.
 */
const getLayerLabel = (component: ComponentData): string => {
    const props = component.props || {};
    if (props.content && typeof props.content === 'string') {
        const content = props.content.slice(0, 18);
        return content.length < (props.content as string).length ? `${content}...` : content;
    }
    if (props.title && typeof props.title === 'string') {
        const title = props.title.slice(0, 18);
        return title.length < (props.title as string).length ? `${title}...` : title;
    }
    if (props.text && typeof props.text === 'string') {
        const text = props.text.slice(0, 18);
        return text.length < (props.text as string).length ? `${text}...` : text;
    }
    return component.type.charAt(0).toUpperCase() + component.type.slice(1);
};

/**
 * Layer item in the tree.
 */
interface LayerItemProps {
    component: ComponentData;
    depth: number;
    selectedId: string | null;
    onSelect: (id: string) => void;
    expandedIds: Set<string>;
    onToggleExpand: (id: string) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
    component,
    depth,
    selectedId,
    onSelect,
    expandedIds,
    onToggleExpand,
}) => {
    const hasChildren = component.children && component.children.length > 0;
    const isExpanded = expandedIds.has(component.id);
    const isSelected = selectedId === component.id;

    return (
        <>
            <div
                className={`${styles.layerItem} ${isSelected ? styles.layerItemSelected : ''}`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={(e) => { e.stopPropagation(); onSelect(component.id); }}
            >
                <button
                    className={styles.layerToggle}
                    onClick={(e) => { e.stopPropagation(); onToggleExpand(component.id); }}
                    disabled={!hasChildren}
                >
                    {hasChildren ? (
                        isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
                    ) : <span style={{ width: 12 }} />}
                </button>
                <span className={styles.layerIcon}>{getLayerIcon(component.type)}</span>
                <span className={styles.layerLabel}>{getLayerLabel(component)}</span>
            </div>
            {hasChildren && isExpanded && component.children!.map((child) => (
                <LayerItem
                    key={child.id}
                    component={child}
                    depth={depth + 1}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    expandedIds={expandedIds}
                    onToggleExpand={onToggleExpand}
                />
            ))}
        </>
    );
};

/**
 * Sidebar component with draggable component library.
 */
interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

type ViewMode = 'components' | 'layers';

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
    const [showTemplates, setShowTemplates] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('components');
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [thirdPartyComponents, setThirdPartyComponents] = useState<ComponentDefinition[]>([]);
    const { addComponent, components, selectedId, selectComponent } = useBuilderStore();

    // Map icon string to React component
    const getIconFromString = (iconName: string): React.ReactNode => {
        const iconMap: Record<string, React.ReactNode> = {
            hash: <Hash size={20} />,
            star: <Star size={20} />,
            box: <Box size={20} />,
            image: <Image size={20} />,
            type: <Type size={20} />,
            layout: <Layout size={20} />,
            layers: <Layers size={20} />,
            grid3x3: <Grid3X3 size={20} />,
            quote: <Quote size={20} />,
            barchart3: <BarChart3 size={20} />,
            layoutgrid: <LayoutGrid size={20} />,
        };
        return iconMap[iconName.toLowerCase()] || <Box size={20} />;
    };

    // Fetch third-party components from API
    useEffect(() => {
        const fetchThirdParty = async () => {
            try {
                const registry = await componentRegistry.fetchRegistry();
                const thirdParty = registry.filter((c: ComponentRegistration) => c.source !== 'core');
                const mapped: ComponentDefinition[] = thirdParty.map((c: ComponentRegistration) => ({
                    type: c.type as ComponentType,
                    label: c.label,
                    icon: getIconFromString(c.icon),
                    category: c.category as ComponentDefinition['category'],
                    isThirdParty: true,
                }));
                setThirdPartyComponents(mapped);

                // Pre-load assets for third-party components
                for (const comp of thirdParty) {
                    await componentRegistry.loadCSS(comp);
                }
            } catch (error) {
                console.error('Failed to fetch third-party components:', error);
            }
        };
        fetchThirdParty();
    }, []);

    // Auto-expand containers when switching to layers view
    useEffect(() => {
        if (viewMode === 'layers') {
            const containerTypes = ['section', 'container'];
            const findContainerIds = (comps: ComponentData[]): string[] => {
                const ids: string[] = [];
                for (const comp of comps) {
                    if (containerTypes.includes(comp.type)) {
                        ids.push(comp.id);
                    }
                    if (comp.children) {
                        ids.push(...findContainerIds(comp.children));
                    }
                }
                return ids;
            };
            setExpandedIds(new Set(findContainerIds(components)));
        }
    }, [viewMode, components.length]);

    const handleToggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleAddComponent = (type: ComponentType) => {
        addComponent(type);
    };

    // Merge static and third-party components
    const allComponents = [...COMPONENTS, ...thirdPartyComponents];

    const groupedComponents = allComponents.reduce((acc, comp) => {
        if (!acc[comp.category]) acc[comp.category] = [];
        acc[comp.category].push(comp);
        return acc;
    }, {} as Record<string, ComponentDefinition[]>);

    const categoryLabels: Record<string, string> = {
        layout: 'Layout',
        content: 'Content',
        media: 'Media',
        actions: 'Actions',
        ui: 'UI Components',
        blocks: 'Marketing Blocks',
    };

    const sidebarClasses = [
        styles.sidebar,
        isCollapsed && styles.sidebarCollapsed,
    ].filter(Boolean).join(' ');

    return (
        <>
            <aside className={sidebarClasses}>
                {/* View Toggle Tabs */}
                <div className={styles.viewTabs}>
                    <button
                        className={`${styles.viewTab} ${viewMode === 'components' ? styles.viewTabActive : ''}`}
                        onClick={() => setViewMode('components')}
                        title="Components"
                    >
                        <Component size={16} />
                        <span>Components</span>
                    </button>
                    <button
                        className={`${styles.viewTab} ${viewMode === 'layers' ? styles.viewTabActive : ''}`}
                        onClick={() => setViewMode('layers')}
                        title="Layers"
                    >
                        <Layers size={16} />
                        <span>Layers</span>
                    </button>
                    {onToggle && (
                        <button
                            className={styles.collapseButton}
                            onClick={onToggle}
                            title="Collapse panel"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    )}
                </div>

                {/* Components View */}
                {viewMode === 'components' && (
                    <>
                        {/* Template Library Button */}
                        <div className={styles.templateSection}>
                            <button
                                className={styles.templateButton}
                                onClick={() => setShowTemplates(true)}
                            >
                                <LayoutTemplate size={18} />
                                <span>Template Library</span>
                            </button>
                        </div>

                        <div className={styles.content}>
                            {Object.entries(groupedComponents).map(([category, comps]) => (
                                <div key={category} className={styles.category}>
                                    <h3 className={styles.categoryTitle}>
                                        {categoryLabels[category] || category}
                                    </h3>
                                    <div className={styles.componentGrid}>
                                        {comps.map((comp) => (
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
                    </>
                )}

                {/* Layers View */}
                {viewMode === 'layers' && (
                    <div className={styles.layersContent}>
                        {components.length === 0 ? (
                            <div className={styles.layersEmpty}>
                                <p>No components yet</p>
                                <p className={styles.layersEmptyHint}>
                                    Switch to Components tab to add
                                </p>
                            </div>
                        ) : (
                            components.map((component) => (
                                <LayerItem
                                    key={component.id}
                                    component={component}
                                    depth={0}
                                    selectedId={selectedId}
                                    onSelect={selectComponent}
                                    expandedIds={expandedIds}
                                    onToggleExpand={handleToggleExpand}
                                />
                            ))
                        )}
                    </div>
                )}
            </aside>

            {/* Template Library Modal */}
            <TemplateLibrary
                isOpen={showTemplates}
                onClose={() => setShowTemplates(false)}
            />
        </>
    );
};

export default Sidebar;
