/**
 * PropertyPanel Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState } from 'react';
import { X, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';
import type { ComponentType } from '../../types/components';

import styles from './PropertyPanel.module.css';

/**
 * Control group with collapsible header.
 */
interface ControlGroupProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

const ControlGroup: React.FC<ControlGroupProps> = ({
    title,
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
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>{title}</span>
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
 * Component-specific controls.
 */
const componentControls: Record<
    ComponentType,
    { content?: string[]; style?: string[]; layout?: string[] }
> = {
    section: {
        style: ['backgroundColor', 'backgroundImage', 'minHeight'],
        layout: ['paddingTop', 'paddingBottom'],
    },
    container: {
        layout: ['width', 'textAlign', 'paddingTop', 'paddingBottom'],
    },
    heading: {
        content: ['content', 'tag'],
        style: ['textAlign', 'color', 'fontSize'],
    },
    text: {
        content: ['content', 'tag', 'variant'],
        style: ['textAlign', 'color'],
    },
    image: {
        content: ['src', 'alt', 'caption'],
        style: ['align', 'borderRadius', 'maxWidth'],
    },
    button: {
        content: ['text', 'url'],
        style: ['variant', 'size', 'fullWidth'],
    },
};

/**
 * Right-side property panel for editing selected component.
 */
export const PropertyPanel: React.FC = () => {
    const {
        selectedId,
        getSelectedComponent,
        updateComponent,
        selectComponent,
        deleteComponent,
    } = useBuilderStore();

    const selectedComponent = getSelectedComponent();

    if (!selectedId || !selectedComponent) {
        return (
            <aside className={styles.panel}>
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

    const handleDelete = () => {
        if (window.confirm('Delete this component?')) {
            deleteComponent(selectedId);
        }
    };

    const props = selectedComponent.props || {};
    const type = selectedComponent.type;

    return (
        <aside className={styles.panel}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </h3>
                <button
                    className={styles.closeButton}
                    onClick={() => selectComponent(null)}
                    title="Close"
                >
                    <X size={16} />
                </button>
            </div>

            <div className={styles.content}>
                {/* Section Controls */}
                {type === 'section' && (
                    <>
                        <ControlGroup title="Style">
                            <ColorControl
                                label="Background Color"
                                value={(props.backgroundColor as string) || ''}
                                onChange={(v) => handlePropChange('backgroundColor', v)}
                            />
                            <TextControl
                                label="Background Image"
                                value={(props.backgroundImage as string) || ''}
                                onChange={(v) => handlePropChange('backgroundImage', v)}
                                placeholder="https://..."
                            />
                            <SelectControl
                                label="Background Size"
                                value={(props.backgroundSize as string) || 'cover'}
                                onChange={(v) => handlePropChange('backgroundSize', v)}
                                options={[
                                    { value: 'cover', label: 'Cover' },
                                    { value: 'contain', label: 'Contain' },
                                    { value: 'auto', label: 'Auto' },
                                ]}
                            />
                            <TextControl
                                label="Min Height"
                                value={(props.minHeight as string) || ''}
                                onChange={(v) => handlePropChange('minHeight', v)}
                                placeholder="400px"
                            />
                        </ControlGroup>
                        <ControlGroup title="Spacing">
                            <TextControl
                                label="Padding Top"
                                value={(props.paddingTop as string) || '4rem'}
                                onChange={(v) => handlePropChange('paddingTop', v)}
                            />
                            <TextControl
                                label="Padding Bottom"
                                value={(props.paddingBottom as string) || '4rem'}
                                onChange={(v) => handlePropChange('paddingBottom', v)}
                            />
                        </ControlGroup>
                    </>
                )}

                {/* Container Controls */}
                {type === 'container' && (
                    <>
                        <ControlGroup title="Layout">
                            <SelectControl
                                label="Width"
                                value={(props.width as string) || 'default'}
                                onChange={(v) => handlePropChange('width', v)}
                                options={[
                                    { value: 'default', label: 'Default (1200px)' },
                                    { value: 'narrow', label: 'Narrow (768px)' },
                                    { value: 'wide', label: 'Wide (1400px)' },
                                    { value: 'full', label: 'Full Width' },
                                ]}
                            />
                            <SelectControl
                                label="Text Align"
                                value={(props.textAlign as string) || 'left'}
                                onChange={(v) => handlePropChange('textAlign', v)}
                                options={[
                                    { value: 'left', label: 'Left' },
                                    { value: 'center', label: 'Center' },
                                    { value: 'right', label: 'Right' },
                                ]}
                            />
                        </ControlGroup>
                        <ControlGroup title="Style">
                            <ColorControl
                                label="Background Color"
                                value={(props.backgroundColor as string) || ''}
                                onChange={(v) => handlePropChange('backgroundColor', v)}
                            />
                        </ControlGroup>
                        <ControlGroup title="Spacing">
                            <TextControl
                                label="Padding Top"
                                value={(props.paddingTop as string) || ''}
                                onChange={(v) => handlePropChange('paddingTop', v)}
                            />
                            <TextControl
                                label="Padding Bottom"
                                value={(props.paddingBottom as string) || ''}
                                onChange={(v) => handlePropChange('paddingBottom', v)}
                            />
                        </ControlGroup>
                    </>
                )}

                {/* Heading Controls */}
                {type === 'heading' && (
                    <>
                        <ControlGroup title="Content">
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
                        <ControlGroup title="Style">
                            <SelectControl
                                label="Text Align"
                                value={(props.textAlign as string) || 'left'}
                                onChange={(v) => handlePropChange('textAlign', v)}
                                options={[
                                    { value: 'left', label: 'Left' },
                                    { value: 'center', label: 'Center' },
                                    { value: 'right', label: 'Right' },
                                ]}
                            />
                            <ColorControl
                                label="Color"
                                value={(props.color as string) || ''}
                                onChange={(v) => handlePropChange('color', v)}
                            />
                            <TextControl
                                label="Font Size"
                                value={(props.fontSize as string) || ''}
                                onChange={(v) => handlePropChange('fontSize', v)}
                                placeholder="2rem"
                            />
                        </ControlGroup>
                    </>
                )}

                {/* Text Controls */}
                {type === 'text' && (
                    <>
                        <ControlGroup title="Content">
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
                        <ControlGroup title="Style">
                            <SelectControl
                                label="Text Align"
                                value={(props.textAlign as string) || 'left'}
                                onChange={(v) => handlePropChange('textAlign', v)}
                                options={[
                                    { value: 'left', label: 'Left' },
                                    { value: 'center', label: 'Center' },
                                    { value: 'right', label: 'Right' },
                                ]}
                            />
                            <ColorControl
                                label="Color"
                                value={(props.color as string) || ''}
                                onChange={(v) => handlePropChange('color', v)}
                            />
                        </ControlGroup>
                    </>
                )}

                {/* Image Controls */}
                {type === 'image' && (
                    <>
                        <ControlGroup title="Content">
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
                        </ControlGroup>
                        <ControlGroup title="Style">
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
                            <TextControl
                                label="Max Width"
                                value={(props.maxWidth as string) || ''}
                                onChange={(v) => handlePropChange('maxWidth', v)}
                                placeholder="100%"
                            />
                            <TextControl
                                label="Border Radius"
                                value={(props.borderRadius as string) || ''}
                                onChange={(v) => handlePropChange('borderRadius', v)}
                                placeholder="8px"
                            />
                        </ControlGroup>
                    </>
                )}

                {/* Button Controls */}
                {type === 'button' && (
                    <>
                        <ControlGroup title="Content">
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
                        </ControlGroup>
                        <ControlGroup title="Style">
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
                                        onChange={(e) =>
                                            handlePropChange('fullWidth', e.target.checked)
                                        }
                                    />
                                    Full Width
                                </label>
                            </div>
                        </ControlGroup>
                    </>
                )}
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

