/**
 * PropertyPanel Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState } from 'react';
import { X, Trash2, ChevronDown, ChevronRight, ChevronLeft, Type, Palette, Maximize2, Space, LayoutGrid, Move } from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';
import {
    SpacingControl,
    FlexLayoutControl,
    TypographyControl,
    BoxStyleControl,
    SizeControl,
    PositionControl,
} from '../controls';
import type { SpacingValue, FlexLayoutValue, TypographyValue, BoxStyleValue, SizeValue, PositionValue } from '../controls';
import type { ComponentType } from '../../types/components';
import { getComponentControls, controlGroupLabels, type ControlGroupType } from '../../config/controlGroups';

import styles from './PropertyPanel.module.css';

/**
 * Control group with collapsible header.
 */
interface ControlGroupProps {
    title: string;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

const ControlGroup: React.FC<ControlGroupProps> = ({
    title,
    icon,
    defaultOpen = true,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={styles.controlGroup}>
            <button
                className={styles.controlGroupHeader}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={styles.controlGroupTitle}>
                    {icon && <span className={styles.controlGroupIcon}>{icon}</span>}
                    <span>{title}</span>
                </div>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {isOpen && <div className={styles.controlGroupContent}>{children}</div>}
        </div>
    );
};

/**
 * Text input control.
 */
interface TextControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const TextControl: React.FC<TextControlProps> = ({
    label,
    value,
    onChange,
    placeholder,
}) => (
    <div className={styles.control}>
        <label className={styles.label}>{label}</label>
        <input
            type="text"
            className={styles.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

/**
 * Textarea control.
 */
interface TextareaControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}

const TextareaControl: React.FC<TextareaControlProps> = ({
    label,
    value,
    onChange,
    rows = 4,
}) => (
    <div className={styles.control}>
        <label className={styles.label}>{label}</label>
        <textarea
            className={styles.textarea}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
        />
    </div>
);

/**
 * Select control.
 */
interface SelectControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

const SelectControl: React.FC<SelectControlProps> = ({
    label,
    value,
    onChange,
    options,
}) => (
    <div className={styles.control}>
        <label className={styles.label}>{label}</label>
        <select
            className={styles.select}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

/**
 * Color picker control.
 */
interface ColorControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ColorControl: React.FC<ColorControlProps> = ({ label, value, onChange }) => (
    <div className={styles.control}>
        <label className={styles.label}>{label}</label>
        <div className={styles.colorWrapper}>
            <input
                type="color"
                className={styles.colorPicker}
                value={value || '#ffffff'}
                onChange={(e) => onChange(e.target.value)}
            />
            <input
                type="text"
                className={styles.colorText}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#ffffff"
            />
        </div>
    </div>
);

/**
 * Get icon for control group.
 */
const getControlGroupIcon = (group: ControlGroupType): React.ReactNode => {
    switch (group) {
        case 'typography':
            return <Type size={14} />;
        case 'boxStyle':
            return <Palette size={14} />;
        case 'size':
            return <Maximize2 size={14} />;
        case 'spacing':
            return <Space size={14} />;
        case 'layout':
            return <LayoutGrid size={14} />;
        case 'position':
            return <Move size={14} />;
        default:
            return null;
    }
};

/**
 * Right-side property panel for editing selected component.
 */
interface PropertyPanelProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ isCollapsed = false, onToggle }) => {
    const {
        selectedId,
        getSelectedComponent,
        updateComponent,
        selectComponent,
        deleteComponent,
    } = useBuilderStore();

    const selectedComponent = getSelectedComponent();

    const panelClasses = [
        styles.panel,
        isCollapsed && styles.panelCollapsed,
    ].filter(Boolean).join(' ');

    if (!selectedId || !selectedComponent) {
        return (
            <aside className={panelClasses}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Properties</h3>
                    {onToggle && (
                        <button
                            className={styles.collapseButton}
                            onClick={onToggle}
                            title="Collapse panel"
                        >
                            <ChevronRight size={16} />
                        </button>
                    )}
                </div>
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🎨</div>
                    <p>Select a component to edit its properties</p>
                </div>
            </aside>
        );
    }

    const handlePropChange = (key: string, value: unknown) => {
        updateComponent(selectedId, {
            props: {
                ...selectedComponent.props,
                [key]: value,
            },
        });
    };

    const handleMultiPropChange = (updates: Record<string, unknown>) => {
        updateComponent(selectedId, {
            props: {
                ...selectedComponent.props,
                ...updates,
            },
        });
    };

    const handleDelete = () => {
        if (window.confirm('Delete this component?')) {
            deleteComponent(selectedId);
        }
    };

    const props = selectedComponent.props || {};
    const type = selectedComponent.type;
    const controlConfig = getComponentControls(type);

    /**
     * Render typography controls.
     */
    const renderTypographyControls = () => {
        const options = controlConfig.options?.typography || {};
        return (
            <TypographyControl
                value={{
                    fontFamily: props.fontFamily as string,
                    fontSize: props.fontSize as string,
                    fontWeight: props.fontWeight as string,
                    lineHeight: props.lineHeight as string,
                    letterSpacing: props.letterSpacing as string,
                    textTransform: props.textTransform as TypographyValue['textTransform'],
                    textAlign: props.textAlign as TypographyValue['textAlign'],
                    fontStyle: props.fontStyle as TypographyValue['fontStyle'],
                    textDecoration: props.textDecoration as TypographyValue['textDecoration'],
                    color: props.color as string,
                }}
                onChange={(v) => handleMultiPropChange(v)}
                showColor={options.showColor ?? true}
                showAlign={options.showAlign ?? true}
            />
        );
    };

    /**
     * Render box style controls.
     */
    const renderBoxStyleControls = () => {
        const options = controlConfig.options?.boxStyle || {};
        return (
            <BoxStyleControl
                value={{
                    backgroundColor: props.backgroundColor as string,
                    backgroundImage: props.backgroundImage as string,
                    backgroundSize: props.backgroundSize as BoxStyleValue['backgroundSize'],
                    backgroundPosition: props.backgroundPosition as string,
                    borderWidth: props.borderWidth as string,
                    borderStyle: props.borderStyle as BoxStyleValue['borderStyle'],
                    borderColor: props.borderColor as string,
                    borderRadius: props.borderRadius as string,
                    borderRadiusTopLeft: props.borderRadiusTopLeft as string,
                    borderRadiusTopRight: props.borderRadiusTopRight as string,
                    borderRadiusBottomRight: props.borderRadiusBottomRight as string,
                    borderRadiusBottomLeft: props.borderRadiusBottomLeft as string,
                    boxShadow: props.boxShadow as string,
                    opacity: props.opacity as string,
                }}
                onChange={(v) => handleMultiPropChange(v)}
                showBackground={options.showBackground ?? true}
                showBorder={options.showBorder ?? true}
                showShadow={options.showShadow ?? true}
            />
        );
    };

    /**
     * Render size controls.
     */
    const renderSizeControls = () => {
        const options = controlConfig.options?.size || {};
        return (
            <SizeControl
                value={{
                    width: props.width as string,
                    height: props.height as string,
                    minWidth: props.minWidth as string,
                    maxWidth: props.maxWidth as string,
                    minHeight: props.minHeight as string,
                    maxHeight: props.maxHeight as string,
                    overflow: props.overflow as SizeValue['overflow'],
                    objectFit: props.objectFit as SizeValue['objectFit'],
                    aspectRatio: props.aspectRatio as string,
                }}
                onChange={(v) => handleMultiPropChange(v)}
                showMinMax={options.showMinMax ?? true}
                showOverflow={options.showOverflow ?? false}
                showObjectFit={options.showObjectFit ?? false}
                showAspectRatio={options.showAspectRatio ?? false}
            />
        );
    };

    /**
     * Render spacing controls (margin & padding).
     */
    const renderSpacingControls = () => {
        return (
            <>
                <SpacingControl
                    label="Padding"
                    value={{
                        top: (props.paddingTop as string) || '',
                        right: (props.paddingRight as string) || '',
                        bottom: (props.paddingBottom as string) || '',
                        left: (props.paddingLeft as string) || '',
                    }}
                    onChange={(v: SpacingValue) => {
                        handleMultiPropChange({
                            paddingTop: v.top,
                            paddingRight: v.right,
                            paddingBottom: v.bottom,
                            paddingLeft: v.left,
                        });
                    }}
                />
                <SpacingControl
                    label="Margin"
                    value={{
                        top: (props.marginTop as string) || '',
                        right: (props.marginRight as string) || '',
                        bottom: (props.marginBottom as string) || '',
                        left: (props.marginLeft as string) || '',
                    }}
                    onChange={(v: SpacingValue) => {
                        handleMultiPropChange({
                            marginTop: v.top,
                            marginRight: v.right,
                            marginBottom: v.bottom,
                            marginLeft: v.left,
                        });
                    }}
                />
            </>
        );
    };

    /**
     * Render layout controls (flex/grid).
     */
    const renderLayoutControls = () => {
        return (
            <FlexLayoutControl
                value={{
                    display: (props.display as FlexLayoutValue['display']) || 'block',
                    flexDirection: (props.flexDirection as FlexLayoutValue['flexDirection']) || 'column',
                    justifyContent: (props.justifyContent as FlexLayoutValue['justifyContent']) || 'flex-start',
                    alignItems: (props.alignItems as FlexLayoutValue['alignItems']) || 'stretch',
                    gap: (props.gap as string) || '',
                    flexWrap: (props.flexWrap as FlexLayoutValue['flexWrap']) || 'nowrap',
                }}
                onChange={(v) => handleMultiPropChange(v)}
            />
        );
    };

    /**
     * Render position controls.
     */
    const renderPositionControls = () => {
        return (
            <PositionControl
                value={{
                    position: props.position as PositionValue['position'],
                    top: props.positionTop as string,
                    right: props.positionRight as string,
                    bottom: props.positionBottom as string,
                    left: props.positionLeft as string,
                    zIndex: props.zIndex as string,
                }}
                onChange={(v) => {
                    // Map position values to props with 'position' prefix to avoid conflicts
                    const updates: Record<string, unknown> = {};
                    if (v.position !== undefined) updates.position = v.position;
                    if (v.top !== undefined) updates.positionTop = v.top;
                    if (v.right !== undefined) updates.positionRight = v.right;
                    if (v.bottom !== undefined) updates.positionBottom = v.bottom;
                    if (v.left !== undefined) updates.positionLeft = v.left;
                    if (v.zIndex !== undefined) updates.zIndex = v.zIndex;
                    handleMultiPropChange(updates);
                }}
            />
        );
    };

    /**
     * Render a control group.
     */
    const renderControlGroup = (group: ControlGroupType, index: number) => {
        const isFirst = index === 0;
        
        switch (group) {
            case 'typography':
                return (
                    <ControlGroup
                        key={group}
                        title={controlGroupLabels[group]}
                        icon={getControlGroupIcon(group)}
                        defaultOpen={isFirst}
                    >
                        {renderTypographyControls()}
                    </ControlGroup>
                );
            case 'boxStyle':
                return (
                    <ControlGroup
                        key={group}
                        title={controlGroupLabels[group]}
                        icon={getControlGroupIcon(group)}
                        defaultOpen={isFirst}
                    >
                        {renderBoxStyleControls()}
                    </ControlGroup>
                );
            case 'size':
                return (
                    <ControlGroup
                        key={group}
                        title={controlGroupLabels[group]}
                        icon={getControlGroupIcon(group)}
                        defaultOpen={isFirst}
                    >
                        {renderSizeControls()}
                    </ControlGroup>
                );
            case 'spacing':
                return (
                    <ControlGroup
                        key={group}
                        title={controlGroupLabels[group]}
                        icon={getControlGroupIcon(group)}
                        defaultOpen={isFirst}
                    >
                        {renderSpacingControls()}
                    </ControlGroup>
                );
            case 'layout':
                return (
                    <ControlGroup
                        key={group}
                        title={controlGroupLabels[group]}
                        icon={getControlGroupIcon(group)}
                        defaultOpen={isFirst}
                    >
                        {renderLayoutControls()}
                    </ControlGroup>
                );
            case 'position':
                return (
                    <ControlGroup
                        key={group}
                        title={controlGroupLabels[group]}
                        icon={getControlGroupIcon(group)}
                        defaultOpen={false}
                    >
                        {renderPositionControls()}
                    </ControlGroup>
                );
            default:
                return null;
        }
    };

    /**
     * Render component-specific content controls.
     */
    const renderContentControls = () => {
        switch (type) {
            case 'heading':
                return (
                    <ControlGroup title="Content" defaultOpen={true}>
                        <TextControl
                            label="Text"
                            value={(props.content as string) || ''}
                            onChange={(v) => handlePropChange('content', v)}
                            placeholder="Enter heading..."
                        />
                        <SelectControl
                            label="Tag"
                            value={(props.tag as string) || 'h2'}
                            onChange={(v) => handlePropChange('tag', v)}
                            options={[
                                { value: 'h1', label: 'H1' },
                                { value: 'h2', label: 'H2' },
                                { value: 'h3', label: 'H3' },
                                { value: 'h4', label: 'H4' },
                                { value: 'h5', label: 'H5' },
                                { value: 'h6', label: 'H6' },
                            ]}
                        />
                    </ControlGroup>
                );

            case 'text':
                return (
                    <ControlGroup title="Content" defaultOpen={true}>
                        <TextareaControl
                            label="Text"
                            value={(props.content as string) || ''}
                            onChange={(v) => handlePropChange('content', v)}
                            rows={5}
                        />
                        <SelectControl
                            label="Variant"
                            value={(props.variant as string) || 'default'}
                            onChange={(v) => handlePropChange('variant', v)}
                            options={[
                                { value: 'default', label: 'Default' },
                                { value: 'lead', label: 'Lead (Larger)' },
                                { value: 'small', label: 'Small' },
                            ]}
                        />
                    </ControlGroup>
                );

            case 'image':
                return (
                    <ControlGroup title="Content" defaultOpen={true}>
                        <TextControl
                            label="Image URL"
                            value={(props.src as string) || ''}
                            onChange={(v) => handlePropChange('src', v)}
                            placeholder="https://..."
                        />
                        <TextControl
                            label="Alt Text"
                            value={(props.alt as string) || ''}
                            onChange={(v) => handlePropChange('alt', v)}
                            placeholder="Describe the image"
                        />
                        <TextControl
                            label="Caption"
                            value={(props.caption as string) || ''}
                            onChange={(v) => handlePropChange('caption', v)}
                        />
                        <SelectControl
                            label="Alignment"
                            value={(props.align as string) || 'none'}
                            onChange={(v) => handlePropChange('align', v)}
                            options={[
                                { value: 'none', label: 'None' },
                                { value: 'left', label: 'Left' },
                                { value: 'center', label: 'Center' },
                                { value: 'right', label: 'Right' },
                            ]}
                        />
                    </ControlGroup>
                );

            case 'button':
                return (
                    <ControlGroup title="Content" defaultOpen={true}>
                        <TextControl
                            label="Button Text"
                            value={(props.text as string) || ''}
                            onChange={(v) => handlePropChange('text', v)}
                            placeholder="Click Me"
                        />
                        <TextControl
                            label="URL"
                            value={(props.url as string) || ''}
                            onChange={(v) => handlePropChange('url', v)}
                            placeholder="https://..."
                        />
                        <SelectControl
                            label="Variant"
                            value={(props.variant as string) || 'primary'}
                            onChange={(v) => handlePropChange('variant', v)}
                            options={[
                                { value: 'primary', label: 'Primary' },
                                { value: 'secondary', label: 'Secondary' },
                                { value: 'outline', label: 'Outline' },
                                { value: 'ghost', label: 'Ghost' },
                            ]}
                        />
                        <SelectControl
                            label="Size"
                            value={(props.size as string) || 'default'}
                            onChange={(v) => handlePropChange('size', v)}
                            options={[
                                { value: 'sm', label: 'Small' },
                                { value: 'default', label: 'Default' },
                                { value: 'lg', label: 'Large' },
                            ]}
                        />
                        <div className={styles.control}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={(props.fullWidth as boolean) || false}
                                    onChange={(e) => handlePropChange('fullWidth', e.target.checked)}
                                />
                                Full Width
                            </label>
                        </div>
                    </ControlGroup>
                );

            case 'card':
                return (
                    <ControlGroup title="Content" defaultOpen={true}>
                        <TextControl
                            label="Title"
                            value={(props.title as string) || ''}
                            onChange={(v) => handlePropChange('title', v)}
                            placeholder="Card Title"
                        />
                        <TextareaControl
                            label="Description"
                            value={(props.description as string) || ''}
                            onChange={(v) => handlePropChange('description', v)}
                            rows={2}
                        />
                        <TextControl
                            label="Footer"
                            value={(props.footer as string) || ''}
                            onChange={(v) => handlePropChange('footer', v)}
                        />
                        <SelectControl
                            label="Variant"
                            value={(props.variant as string) || 'default'}
                            onChange={(v) => handlePropChange('variant', v)}
                            options={[
                                { value: 'default', label: 'Default' },
                                { value: 'outline', label: 'Outline' },
                                { value: 'ghost', label: 'Ghost' },
                            ]}
                        />
                    </ControlGroup>
                );

            case 'alert':
                return (
                    <ControlGroup title="Content" defaultOpen={true}>
                        <TextControl
                            label="Title"
                            value={(props.title as string) || ''}
                            onChange={(v) => handlePropChange('title', v)}
                            placeholder="Alert Title"
                        />
                        <TextareaControl
                            label="Description"
                            value={(props.description as string) || ''}
                            onChange={(v) => handlePropChange('description', v)}
                            rows={2}
                        />
                        <SelectControl
                            label="Variant"
                            value={(props.variant as string) || 'info'}
                            onChange={(v) => handlePropChange('variant', v)}
                            options={[
                                { value: 'info', label: 'Info' },
                                { value: 'success', label: 'Success' },
                                { value: 'warning', label: 'Warning' },
                                { value: 'error', label: 'Error' },
                            ]}
                        />
                    </ControlGroup>
                );

            case 'badge':
                return (
                    <ControlGroup title="Content" defaultOpen={true}>
                        <TextControl
                            label="Text"
                            value={(props.text as string) || 'Badge'}
                            onChange={(v) => handlePropChange('text', v)}
                        />
                        <SelectControl
                            label="Variant"
                            value={(props.variant as string) || 'default'}
                            onChange={(v) => handlePropChange('variant', v)}
                            options={[
                                { value: 'default', label: 'Default' },
                                { value: 'secondary', label: 'Secondary' },
                                { value: 'outline', label: 'Outline' },
                                { value: 'destructive', label: 'Destructive' },
                            ]}
                        />
                    </ControlGroup>
                );

            case 'avatar':
                return (
                    <ControlGroup title="Content" defaultOpen={true}>
                        <TextControl
                            label="Image URL"
                            value={(props.src as string) || ''}
                            onChange={(v) => handlePropChange('src', v)}
                            placeholder="https://..."
                        />
                        <TextControl
                            label="Alt Text"
                            value={(props.alt as string) || ''}
                            onChange={(v) => handlePropChange('alt', v)}
                        />
                        <TextControl
                            label="Fallback Initials"
                            value={(props.fallback as string) || 'U'}
                            onChange={(v) => handlePropChange('fallback', v)}
                        />
                        <SelectControl
                            label="Size"
                            value={(props.size as string) || 'medium'}
                            onChange={(v) => handlePropChange('size', v)}
                            options={[
                                { value: 'small', label: 'Small' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'large', label: 'Large' },
                            ]}
                        />
                    </ControlGroup>
                );

            case 'separator':
                return (
                    <ControlGroup title="Content" defaultOpen={true}>
                        <SelectControl
                            label="Orientation"
                            value={(props.orientation as string) || 'horizontal'}
                            onChange={(v) => handlePropChange('orientation', v)}
                            options={[
                                { value: 'horizontal', label: 'Horizontal' },
                                { value: 'vertical', label: 'Vertical' },
                            ]}
                        />
                    </ControlGroup>
                );

            case 'accordion':
                return (
                    <ControlGroup title="Settings" defaultOpen={true}>
                        <SelectControl
                            label="Type"
                            value={(props.type as string) || 'single'}
                            onChange={(v) => handlePropChange('type', v)}
                            options={[
                                { value: 'single', label: 'Single (one open)' },
                                { value: 'multiple', label: 'Multiple' },
                            ]}
                        />
                        <p className={styles.hint}>
                            Edit accordion items in the code props.
                        </p>
                    </ControlGroup>
                );

            case 'tabs':
                return (
                    <ControlGroup title="Settings" defaultOpen={true}>
                        <TextControl
                            label="Default Tab ID"
                            value={(props.defaultTab as string) || 'tab1'}
                            onChange={(v) => handlePropChange('defaultTab', v)}
                        />
                        <p className={styles.hint}>
                            Edit tab items in the code props.
                        </p>
                    </ControlGroup>
                );

            case 'section':
            case 'container':
                // Layout components don't have content controls, just use the shared controls
                return null;

            // Marketing Blocks
            case 'heroBlock':
            case 'featuresBlock':
            case 'pricingBlock':
            case 'faqBlock':
            case 'ctaBlock':
                return (
                    <ControlGroup title="Block Settings" defaultOpen={true}>
                        <p className={styles.hint}>
                            Edit block content and settings in the code props.
                        </p>
                    </ControlGroup>
                );

            default:
                return null;
        }
    };

    return (
        <aside className={panelClasses}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </h3>
                <div className={styles.headerActions}>
                    {onToggle && (
                        <button
                            className={styles.collapseButton}
                            onClick={onToggle}
                            title="Collapse panel"
                        >
                            <ChevronRight size={16} />
                        </button>
                    )}
                    <button
                        className={styles.closeButton}
                        onClick={() => selectComponent(null)}
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                {/* Component-specific content controls first */}
                {renderContentControls()}

                {/* Shared control groups based on component config */}
                {controlConfig.groups.map((group, index) => renderControlGroup(group, index))}
            </div>

            {/* Delete Button */}
            <div className={styles.footer}>
                <button className={styles.deleteButton} onClick={handleDelete}>
                    <Trash2 size={14} />
                    Delete Component
                </button>
            </div>
        </aside>
    );
};

export default PropertyPanel;
