/**
 * Typography Control Component
 *
 * Controls for text styling: font family, size, weight, line height, etc.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Bold,
    Italic,
    Underline,
    Type,
} from 'lucide-react';

import styles from './controls.module.css';

export interface TypographyValue {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through';
    color?: string;
}

interface TypographyControlProps {
    value: Partial<TypographyValue>;
    onChange: (value: Partial<TypographyValue>) => void;
    showColor?: boolean;
    showAlign?: boolean;
}

const FONT_FAMILIES = [
    { value: '', label: 'Default' },
    { value: 'inherit', label: 'Inherit' },
    { value: 'var(--font-heading)', label: 'Heading Font' },
    { value: 'var(--font-body)', label: 'Body Font' },
    { value: "'Inter', sans-serif", label: 'Inter' },
    { value: "'Roboto', sans-serif", label: 'Roboto' },
    { value: "'Open Sans', sans-serif", label: 'Open Sans' },
    { value: "'Poppins', sans-serif", label: 'Poppins' },
    { value: "'Playfair Display', serif", label: 'Playfair Display' },
    { value: "'Merriweather', serif", label: 'Merriweather' },
    { value: "'Source Code Pro', monospace", label: 'Source Code Pro' },
    { value: 'system-ui, sans-serif', label: 'System UI' },
];

const FONT_WEIGHTS = [
    { value: '', label: 'Default' },
    { value: '100', label: 'Thin (100)' },
    { value: '200', label: 'Extra Light (200)' },
    { value: '300', label: 'Light (300)' },
    { value: '400', label: 'Normal (400)' },
    { value: '500', label: 'Medium (500)' },
    { value: '600', label: 'Semi Bold (600)' },
    { value: '700', label: 'Bold (700)' },
    { value: '800', label: 'Extra Bold (800)' },
    { value: '900', label: 'Black (900)' },
];

const TEXT_TRANSFORMS = [
    { value: 'none', label: 'None' },
    { value: 'uppercase', label: 'UPPERCASE' },
    { value: 'lowercase', label: 'lowercase' },
    { value: 'capitalize', label: 'Capitalize' },
];

export const TypographyControl: React.FC<TypographyControlProps> = ({
    value,
    onChange,
    showColor = true,
    showAlign = true,
}) => {
    const handleChange = <K extends keyof TypographyValue>(
        key: K,
        newValue: TypographyValue[K]
    ) => {
        onChange({ ...value, [key]: newValue });
    };

    const toggleStyle = (
        key: 'fontStyle' | 'textDecoration',
        activeValue: string,
        defaultValue: string
    ) => {
        const current = value[key] || defaultValue;
        handleChange(key, current === activeValue ? defaultValue : activeValue);
    };

    const alignOptions = [
        { value: 'left', icon: <AlignLeft size={14} /> },
        { value: 'center', icon: <AlignCenter size={14} /> },
        { value: 'right', icon: <AlignRight size={14} /> },
        { value: 'justify', icon: <AlignJustify size={14} /> },
    ];

    return (
        <div className={styles.typographyControl}>
            {/* Font Family */}
            <div className={styles.controlRow}>
                <label className={styles.controlLabel}>Font</label>
                <select
                    className={styles.selectFull}
                    value={value.fontFamily || ''}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                >
                    {FONT_FAMILIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Font Size & Weight Row */}
            <div className={styles.controlRowDouble}>
                <div className={styles.controlHalf}>
                    <label className={styles.controlLabelSmall}>Size</label>
                    <input
                        type="text"
                        className={styles.inputSmall}
                        value={value.fontSize || ''}
                        onChange={(e) => handleChange('fontSize', e.target.value)}
                        placeholder="16px"
                    />
                </div>
                <div className={styles.controlHalf}>
                    <label className={styles.controlLabelSmall}>Weight</label>
                    <select
                        className={styles.selectSmall}
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
            </div>

            {/* Line Height & Letter Spacing Row */}
            <div className={styles.controlRowDouble}>
                <div className={styles.controlHalf}>
                    <label className={styles.controlLabelSmall}>Line H.</label>
                    <input
                        type="text"
                        className={styles.inputSmall}
                        value={value.lineHeight || ''}
                        onChange={(e) => handleChange('lineHeight', e.target.value)}
                        placeholder="1.5"
                    />
                </div>
                <div className={styles.controlHalf}>
                    <label className={styles.controlLabelSmall}>Spacing</label>
                    <input
                        type="text"
                        className={styles.inputSmall}
                        value={value.letterSpacing || ''}
                        onChange={(e) => handleChange('letterSpacing', e.target.value)}
                        placeholder="0px"
                    />
                </div>
            </div>

            {/* Text Transform */}
            <div className={styles.controlRow}>
                <label className={styles.controlLabel}>Transform</label>
                <select
                    className={styles.selectSmall}
                    value={value.textTransform || 'none'}
                    onChange={(e) =>
                        handleChange('textTransform', e.target.value as TypographyValue['textTransform'])
                    }
                >
                    {TEXT_TRANSFORMS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Style Toggles (Bold, Italic, Underline) */}
            <div className={styles.controlRow}>
                <label className={styles.controlLabel}>Style</label>
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={`${styles.iconButton} ${value.fontWeight === '700' || value.fontWeight === 'bold' ? styles.active : ''}`}
                        onClick={() =>
                            handleChange(
                                'fontWeight',
                                value.fontWeight === '700' || value.fontWeight === 'bold' ? '400' : '700'
                            )
                        }
                        title="Bold"
                    >
                        <Bold size={14} />
                    </button>
                    <button
                        type="button"
                        className={`${styles.iconButton} ${value.fontStyle === 'italic' ? styles.active : ''}`}
                        onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
                        title="Italic"
                    >
                        <Italic size={14} />
                    </button>
                    <button
                        type="button"
                        className={`${styles.iconButton} ${value.textDecoration === 'underline' ? styles.active : ''}`}
                        onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
                        title="Underline"
                    >
                        <Underline size={14} />
                    </button>
                </div>
            </div>

            {/* Text Alignment */}
            {showAlign && (
                <div className={styles.controlRow}>
                    <label className={styles.controlLabel}>Align</label>
                    <div className={styles.buttonGroup}>
                        {alignOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`${styles.iconButton} ${value.textAlign === opt.value ? styles.active : ''}`}
                                onClick={() =>
                                    handleChange('textAlign', opt.value as TypographyValue['textAlign'])
                                }
                                title={opt.value}
                            >
                                {opt.icon}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Color */}
            {showColor && (
                <div className={styles.controlRow}>
                    <label className={styles.controlLabel}>Color</label>
                    <div className={styles.colorInputGroup}>
                        <input
                            type="color"
                            className={styles.colorPicker}
                            value={value.color || '#000000'}
                            onChange={(e) => handleChange('color', e.target.value)}
                        />
                        <input
                            type="text"
                            className={styles.colorText}
                            value={value.color || ''}
                            onChange={(e) => handleChange('color', e.target.value)}
                            placeholder="#000000"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TypographyControl;

