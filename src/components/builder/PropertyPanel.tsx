/**
 * PropertyPanel Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { X } from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';

import styles from './PropertyPanel.module.css';

/**
 * Right-side property panel for editing selected component.
 */
export const PropertyPanel: React.FC = () => {
    const { selectedId, getSelectedComponent, updateComponent, selectComponent } =
        useBuilderStore();

    const selectedComponent = getSelectedComponent();

    if (!selectedId || !selectedComponent) {
        return (
            <aside className={styles.panel}>
                <div className={styles.empty}>
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

    return (
        <aside className={styles.panel}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {selectedComponent.type.charAt(0).toUpperCase() +
                        selectedComponent.type.slice(1)}
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
                {/* Dynamic property controls based on component type */}
                {selectedComponent.type === 'heading' && (
                    <>
                        <div className={styles.control}>
                            <label className={styles.label}>Content</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={(selectedComponent.props.content as string) || ''}
                                onChange={(e) => handlePropChange('content', e.target.value)}
                            />
                        </div>

                        <div className={styles.control}>
                            <label className={styles.label}>Level</label>
                            <select
                                className={styles.select}
                                value={(selectedComponent.props.level as string) || 'h2'}
                                onChange={(e) => handlePropChange('level', e.target.value)}
                            >
                                <option value="h1">H1</option>
                                <option value="h2">H2</option>
                                <option value="h3">H3</option>
                                <option value="h4">H4</option>
                                <option value="h5">H5</option>
                                <option value="h6">H6</option>
                            </select>
                        </div>

                        <div className={styles.control}>
                            <label className={styles.label}>Text Align</label>
                            <select
                                className={styles.select}
                                value={(selectedComponent.props.textAlign as string) || 'left'}
                                onChange={(e) => handlePropChange('textAlign', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                    </>
                )}

                {selectedComponent.type === 'text' && (
                    <div className={styles.control}>
                        <label className={styles.label}>Content</label>
                        <textarea
                            className={styles.textarea}
                            value={(selectedComponent.props.content as string) || ''}
                            onChange={(e) => handlePropChange('content', e.target.value)}
                            rows={5}
                        />
                    </div>
                )}

                {selectedComponent.type === 'button' && (
                    <>
                        <div className={styles.control}>
                            <label className={styles.label}>Button Text</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={(selectedComponent.props.text as string) || ''}
                                onChange={(e) => handlePropChange('text', e.target.value)}
                            />
                        </div>

                        <div className={styles.control}>
                            <label className={styles.label}>URL</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={(selectedComponent.props.url as string) || ''}
                                onChange={(e) => handlePropChange('url', e.target.value)}
                            />
                        </div>
                    </>
                )}

                {selectedComponent.type === 'image' && (
                    <>
                        <div className={styles.control}>
                            <label className={styles.label}>Image URL</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={(selectedComponent.props.src as string) || ''}
                                onChange={(e) => handlePropChange('src', e.target.value)}
                            />
                        </div>

                        <div className={styles.control}>
                            <label className={styles.label}>Alt Text</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={(selectedComponent.props.alt as string) || ''}
                                onChange={(e) => handlePropChange('alt', e.target.value)}
                            />
                        </div>
                    </>
                )}

                {/* Placeholder for other component types */}
                {!['heading', 'text', 'button', 'image'].includes(
                    selectedComponent.type
                ) && (
                        <div className={styles.placeholder}>
                            <p>Properties for {selectedComponent.type} coming soon</p>
                        </div>
                    )}
            </div>
        </aside>
    );
};

export default PropertyPanel;
