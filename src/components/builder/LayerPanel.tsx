/**
 * Layer Panel Component
 *
 * Displays component hierarchy as a tree structure for easy navigation.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Layers,
    Type,
    Image,
    Box,
    Layout,
    AlignLeft,
    MousePointer2,
    CreditCard,
    AlertCircle,
    Tag,
    User,
    Minus,
    Star,
    Grid3X3,
    DollarSign,
    HelpCircle,
    Megaphone,
    Quote,
    BarChart3,
    LayoutGrid,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    GripVertical,
} from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';
import type { ComponentData } from '../../types/components';

import styles from './LayerPanel.module.css';

/**
 * Get icon for component type.
 */
const getComponentIcon = (type: string): React.ReactNode => {
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
const getComponentLabel = (component: ComponentData): string => {
    // Use content prop as label if available
    const props = component.props || {};
    if (props.content && typeof props.content === 'string') {
        const content = props.content.slice(0, 20);
        return content.length < (props.content as string).length ? `${content}...` : content;
    }
    if (props.title && typeof props.title === 'string') {
        const title = props.title.slice(0, 20);
        return title.length < (props.title as string).length ? `${title}...` : title;
    }
    if (props.text && typeof props.text === 'string') {
        const text = props.text.slice(0, 20);
        return text.length < (props.text as string).length ? `${text}...` : text;
    }
    // Fall back to type name
    return component.type.charAt(0).toUpperCase() + component.type.slice(1);
};

/**
 * Props for LayerItem.
 */
interface LayerItemProps {
    component: ComponentData;
    depth: number;
    selectedId: string | null;
    onSelect: (id: string) => void;
    expandedIds: Set<string>;
    onToggleExpand: (id: string) => void;
}

/**
 * Individual layer item in the tree.
 */
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

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(component.id);
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleExpand(component.id);
    };

    return (
        <>
            <div
                className={`${styles.layerItem} ${isSelected ? styles.selected : ''}`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={handleClick}
            >
                {/* Expand/collapse toggle */}
                <button
                    className={styles.expandToggle}
                    onClick={handleToggle}
                    disabled={!hasChildren}
                >
                    {hasChildren ? (
                        isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
                    ) : (
                        <span className={styles.spacer} />
                    )}
                </button>

                {/* Component icon */}
                <span className={styles.icon}>
                    {getComponentIcon(component.type)}
                </span>

                {/* Component label */}
                <span className={styles.label}>
                    {getComponentLabel(component)}
                </span>

                {/* Component type badge */}
                <span className={styles.typeBadge}>
                    {component.type}
                </span>
            </div>

            {/* Render children if expanded */}
            {hasChildren && isExpanded && (
                <div className={styles.children}>
                    {component.children!.map((child) => (
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
                </div>
            )}
        </>
    );
};

/**
 * Props for LayerPanel.
 */
interface LayerPanelProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

/**
 * Layer panel showing component hierarchy.
 */
export const LayerPanel: React.FC<LayerPanelProps> = ({
    isCollapsed = false,
    onToggle,
}) => {
    const { components, selectedId, selectComponent } = useBuilderStore();
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Auto-expand all containers on first render
    React.useEffect(() => {
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
    }, [components.length]);

    const handleToggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleExpandAll = () => {
        const allIds: string[] = [];
        const collectIds = (comps: ComponentData[]) => {
            for (const comp of comps) {
                if (comp.children && comp.children.length > 0) {
                    allIds.push(comp.id);
                    collectIds(comp.children);
                }
            }
        };
        collectIds(components);
        setExpandedIds(new Set(allIds));
    };

    const handleCollapseAll = () => {
        setExpandedIds(new Set());
    };

    if (isCollapsed) {
        return null;
    }

    return (
        <div className={styles.panel}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <Layers size={16} />
                    <span>Layers</span>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.actionButton}
                        onClick={handleExpandAll}
                        title="Expand all"
                    >
                        <ChevronDown size={14} />
                    </button>
                    <button
                        className={styles.actionButton}
                        onClick={handleCollapseAll}
                        title="Collapse all"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Layer list */}
            <div className={styles.layerList}>
                {components.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No components yet</p>
                        <p className={styles.emptyHint}>Drag components from the sidebar</p>
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
        </div>
    );
};

export default LayerPanel;
