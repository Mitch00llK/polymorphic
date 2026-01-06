/**
 * Box Style Control Component
 *
 * Controls for box styling: background, borders, shadows, border-radius.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState } from 'react';
import { Square, Circle, Link, Unlink } from 'lucide-react';

import styles from './controls.module.css';

export interface BoxStyleValue {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: 'cover' | 'contain' | 'auto';
    backgroundPosition?: string;
    backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
    borderWidth?: string;
    borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
    borderColor?: string;
    borderRadius?: string;
    borderRadiusTopLeft?: string;
    borderRadiusTopRight?: string;
    borderRadiusBottomRight?: string;
    borderRadiusBottomLeft?: string;
    boxShadow?: string;
    opacity?: string;
}

interface BoxStyleControlProps {
    value: Partial<BoxStyleValue>;
    onChange: (value: Partial<BoxStyleValue>) => void;
    showBackground?: boolean;
    showBorder?: boolean;
    showShadow?: boolean;
}

const BORDER_STYLES = [
    { value: 'none', label: 'None' },
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' },
];

const BACKGROUND_SIZES = [
    { value: 'cover', label: 'Cover' },
    { value: 'contain', label: 'Contain' },
    { value: 'auto', label: 'Auto' },
];

const BOX_SHADOW_PRESETS = [
    { value: '', label: 'None' },
    { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', label: 'XS' },
    { value: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', label: 'SM' },
    { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', label: 'MD' },
    { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', label: 'LG' },
    { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', label: 'XL' },
    { value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', label: '2XL' },
    { value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)', label: 'Inner' },
];

export const BoxStyleControl: React.FC<BoxStyleControlProps> = ({
    value,
    onChange,
    showBackground = true,
    showBorder = true,
    showShadow = true,
}) => {
    const [radiusLinked, setRadiusLinked] = useState(true);

    const handleChange = <K extends keyof BoxStyleValue>(
        key: K,
        newValue: BoxStyleValue[K]
    ) => {
        onChange({ ...value, [key]: newValue });
    };

    const handleRadiusChange = (corner: string, newValue: string) => {
        if (radiusLinked) {
            onChange({
                ...value,
                borderRadius: newValue,
                borderRadiusTopLeft: newValue,
                borderRadiusTopRight: newValue,
                borderRadiusBottomRight: newValue,
                borderRadiusBottomLeft: newValue,
            });
        } else {
            onChange({ ...value, [corner]: newValue });
        }
    };

    return (
        <div className={styles.boxStyleControl}>
            {/* Background Color */}
            {showBackground && (
                <>
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Bg Color</label>
                        <div className={styles.colorInputGroup}>
                            <input
                                type="color"
                                className={styles.colorPicker}
                                value={value.backgroundColor || '#ffffff'}
                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                            />
                            <input
                                type="text"
                                className={styles.colorText}
                                value={value.backgroundColor || ''}
                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                placeholder="transparent"
                            />
                        </div>
                    </div>

                    {/* Background Image */}
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Bg Image</label>
                        <input
                            type="text"
                            className={styles.inputFull}
                            value={value.backgroundImage || ''}
                            onChange={(e) => handleChange('backgroundImage', e.target.value)}
                            placeholder="url(...)"
                        />
                    </div>

                    {value.backgroundImage && (
                        <div className={styles.controlRow}>
                            <label className={styles.controlLabel}>Bg Size</label>
                            <select
                                className={styles.selectSmall}
                                value={value.backgroundSize || 'cover'}
                                onChange={(e) =>
                                    handleChange('backgroundSize', e.target.value as BoxStyleValue['backgroundSize'])
                                }
                            >
                                {BACKGROUND_SIZES.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Opacity */}
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Opacity</label>
                        <div className={styles.rangeGroup}>
                            <input
                                type="range"
                                className={styles.rangeInput}
                                min="0"
                                max="1"
                                step="0.1"
                                value={value.opacity || '1'}
                                onChange={(e) => handleChange('opacity', e.target.value)}
                            />
                            <span className={styles.rangeValue}>
                                {Math.round((parseFloat(value.opacity || '1') * 100))}%
                            </span>
                        </div>
                    </div>
                </>
            )}

            {/* Border */}
            {showBorder && (
                <>
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Border</label>
                        <select
                            className={styles.selectSmall}
                            value={value.borderStyle || 'none'}
                            onChange={(e) =>
                                handleChange('borderStyle', e.target.value as BoxStyleValue['borderStyle'])
                            }
                        >
                            {BORDER_STYLES.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {value.borderStyle && value.borderStyle !== 'none' && (
                        <>
                            <div className={styles.controlRowDouble}>
                                <div className={styles.controlHalf}>
                                    <label className={styles.controlLabelSmall}>Width</label>
                                    <input
                                        type="text"
                                        className={styles.inputSmall}
                                        value={value.borderWidth || ''}
                                        onChange={(e) => handleChange('borderWidth', e.target.value)}
                                        placeholder="1px"
                                    />
                                </div>
                                <div className={styles.controlHalf}>
                                    <label className={styles.controlLabelSmall}>Color</label>
                                    <div className={styles.colorInputSmall}>
                                        <input
                                            type="color"
                                            className={styles.colorPickerSmall}
                                            value={value.borderColor || '#e5e7eb'}
                                            onChange={(e) => handleChange('borderColor', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Border Radius */}
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Radius</label>
                        <div className={styles.radiusGroup}>
                            {radiusLinked ? (
                                <input
                                    type="text"
                                    className={styles.inputSmall}
                                    value={value.borderRadius || ''}
                                    onChange={(e) => handleRadiusChange('borderRadius', e.target.value)}
                                    placeholder="0px"
                                />
                            ) : (
                                <div className={styles.radiusInputs}>
                                    <input
                                        type="text"
                                        className={styles.radiusInput}
                                        value={value.borderRadiusTopLeft || ''}
                                        onChange={(e) =>
                                            handleChange('borderRadiusTopLeft', e.target.value)
                                        }
                                        placeholder="TL"
                                        title="Top Left"
                                    />
                                    <input
                                        type="text"
                                        className={styles.radiusInput}
                                        value={value.borderRadiusTopRight || ''}
                                        onChange={(e) =>
                                            handleChange('borderRadiusTopRight', e.target.value)
                                        }
                                        placeholder="TR"
                                        title="Top Right"
                                    />
                                    <input
                                        type="text"
                                        className={styles.radiusInput}
                                        value={value.borderRadiusBottomRight || ''}
                                        onChange={(e) =>
                                            handleChange('borderRadiusBottomRight', e.target.value)
                                        }
                                        placeholder="BR"
                                        title="Bottom Right"
                                    />
                                    <input
                                        type="text"
                                        className={styles.radiusInput}
                                        value={value.borderRadiusBottomLeft || ''}
                                        onChange={(e) =>
                                            handleChange('borderRadiusBottomLeft', e.target.value)
                                        }
                                        placeholder="BL"
                                        title="Bottom Left"
                                    />
                                </div>
                            )}
                            <button
                                type="button"
                                className={`${styles.linkButton} ${radiusLinked ? styles.linked : ''}`}
                                onClick={() => setRadiusLinked(!radiusLinked)}
                                title={radiusLinked ? 'Unlink corners' : 'Link corners'}
                            >
                                {radiusLinked ? <Link size={12} /> : <Unlink size={12} />}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Box Shadow */}
            {showShadow && (
                <div className={styles.controlRow}>
                    <label className={styles.controlLabel}>Shadow</label>
                    <select
                        className={styles.selectSmall}
                        value={value.boxShadow || ''}
                        onChange={(e) => handleChange('boxShadow', e.target.value)}
                    >
                        {BOX_SHADOW_PRESETS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default BoxStyleControl;

