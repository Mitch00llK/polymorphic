/**
 * Element Style Control Component
 *
 * A collapsible control for styling a specific element within a component.
 * Combines typography, color, and spacing in a compact format.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Type, Palette } from 'lucide-react';

import styles from './controls.module.css';

export interface ElementStyleValue {
    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: string;
    textAlign?: string;
    fontStyle?: string;
    textDecoration?: string;
    // Colors
    color?: string;
    backgroundColor?: string;
    // Spacing
    marginTop?: string;
    marginBottom?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
}

interface ElementStyleControlProps {
    label: string;
    value: Partial<ElementStyleValue>;
    onChange: (value: Partial<ElementStyleValue>) => void;
    showTypography?: boolean;
    showColors?: boolean;
    showSpacing?: boolean;
    defaultOpen?: boolean;
}

const FONT_WEIGHTS = [
    { value: '', label: 'Default' },
    { value: '300', label: 'Light' },
    { value: '400', label: 'Normal' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semi Bold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extra Bold' },
];

export const ElementStyleControl: React.FC<ElementStyleControlProps> = ({
    label,
    value,
    onChange,
    showTypography = true,
    showColors = true,
    showSpacing = true,
    defaultOpen = false,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleChange = <K extends keyof ElementStyleValue>(
        key: K,
        newValue: ElementStyleValue[K]
    ) => {
        onChange({ ...value, [key]: newValue });
    };

    return (
        <div className={styles.elementStyleControl}>
            <button
                type="button"
                className={styles.elementStyleHeader}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={styles.elementStyleLabel}>{label}</span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {isOpen && (
                <div className={styles.elementStyleContent}>
                    {/* Typography */}
                    {showTypography && (
                        <div className={styles.elementStyleSection}>
                            <div className={styles.elementStyleSectionHeader}>
                                <Type size={12} />
                                <span>Typography</span>
                            </div>
                            <div className={styles.elementStyleGrid}>
                                <div className={styles.elementStyleField}>
                                    <label>Size</label>
                                    <input
                                        type="text"
                                        value={value.fontSize || ''}
                                        onChange={(e) => handleChange('fontSize', e.target.value)}
                                        placeholder="16px"
                                    />
                                </div>
                                <div className={styles.elementStyleField}>
                                    <label>Weight</label>
                                    <select
                                        value={value.fontWeight || ''}
                                        onChange={(e) => handleChange('fontWeight', e.target.value)}
                                    >
                                        {FONT_WEIGHTS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.elementStyleField}>
                                    <label>Line H.</label>
                                    <input
                                        type="text"
                                        value={value.lineHeight || ''}
                                        onChange={(e) => handleChange('lineHeight', e.target.value)}
                                        placeholder="1.5"
                                    />
                                </div>
                                <div className={styles.elementStyleField}>
                                    <label>Spacing</label>
                                    <input
                                        type="text"
                                        value={value.letterSpacing || ''}
                                        onChange={(e) => handleChange('letterSpacing', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Colors */}
                    {showColors && (
                        <div className={styles.elementStyleSection}>
                            <div className={styles.elementStyleSectionHeader}>
                                <Palette size={12} />
                                <span>Colors</span>
                            </div>
                            <div className={styles.elementStyleGrid}>
                                <div className={styles.elementStyleFieldWide}>
                                    <label>Text Color</label>
                                    <div className={styles.colorInputInline}>
                                        <input
                                            type="color"
                                            value={value.color || '#000000'}
                                            onChange={(e) => handleChange('color', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={value.color || ''}
                                            onChange={(e) => handleChange('color', e.target.value)}
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>
                                <div className={styles.elementStyleFieldWide}>
                                    <label>Background</label>
                                    <div className={styles.colorInputInline}>
                                        <input
                                            type="color"
                                            value={value.backgroundColor || '#ffffff'}
                                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={value.backgroundColor || ''}
                                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                            placeholder="transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Spacing */}
                    {showSpacing && (
                        <div className={styles.elementStyleSection}>
                            <div className={styles.elementStyleGrid}>
                                <div className={styles.elementStyleField}>
                                    <label>M. Top</label>
                                    <input
                                        type="text"
                                        value={value.marginTop || ''}
                                        onChange={(e) => handleChange('marginTop', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className={styles.elementStyleField}>
                                    <label>M. Bottom</label>
                                    <input
                                        type="text"
                                        value={value.marginBottom || ''}
                                        onChange={(e) => handleChange('marginBottom', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ElementStyleControl;

