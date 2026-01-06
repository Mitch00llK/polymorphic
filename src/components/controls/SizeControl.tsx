/**
 * Size Control Component
 *
 * Controls for element dimensions: width, height, min/max values, overflow.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

import styles from './controls.module.css';

export interface SizeValue {
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
    overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
    overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    aspectRatio?: string;
}

interface SizeControlProps {
    value: Partial<SizeValue>;
    onChange: (value: Partial<SizeValue>) => void;
    showMinMax?: boolean;
    showOverflow?: boolean;
    showObjectFit?: boolean;
    showAspectRatio?: boolean;
}

const WIDTH_PRESETS = [
    { value: '', label: 'Auto' },
    { value: '100%', label: 'Full (100%)' },
    { value: '50%', label: 'Half (50%)' },
    { value: '33.333%', label: 'Third (33%)' },
    { value: '25%', label: 'Quarter (25%)' },
    { value: 'fit-content', label: 'Fit Content' },
    { value: 'max-content', label: 'Max Content' },
    { value: 'min-content', label: 'Min Content' },
];

const MAX_WIDTH_PRESETS = [
    { value: '', label: 'None' },
    { value: '100%', label: '100%' },
    { value: '768px', label: 'Narrow (768px)' },
    { value: '1024px', label: 'Medium (1024px)' },
    { value: '1200px', label: 'Default (1200px)' },
    { value: '1400px', label: 'Wide (1400px)' },
    { value: 'var(--container-max)', label: 'Container Max' },
    { value: 'var(--container-narrow)', label: 'Container Narrow' },
];

const OVERFLOW_OPTIONS = [
    { value: 'visible', label: 'Visible' },
    { value: 'hidden', label: 'Hidden' },
    { value: 'scroll', label: 'Scroll' },
    { value: 'auto', label: 'Auto' },
];

const OBJECT_FIT_OPTIONS = [
    { value: 'fill', label: 'Fill' },
    { value: 'contain', label: 'Contain' },
    { value: 'cover', label: 'Cover' },
    { value: 'none', label: 'None' },
    { value: 'scale-down', label: 'Scale Down' },
];

const ASPECT_RATIO_PRESETS = [
    { value: '', label: 'Auto' },
    { value: '1/1', label: '1:1 (Square)' },
    { value: '16/9', label: '16:9 (Widescreen)' },
    { value: '4/3', label: '4:3' },
    { value: '3/2', label: '3:2' },
    { value: '21/9', label: '21:9 (Ultrawide)' },
    { value: '9/16', label: '9:16 (Portrait)' },
];

export const SizeControl: React.FC<SizeControlProps> = ({
    value,
    onChange,
    showMinMax = true,
    showOverflow = false,
    showObjectFit = false,
    showAspectRatio = false,
}) => {
    const handleChange = <K extends keyof SizeValue>(
        key: K,
        newValue: SizeValue[K]
    ) => {
        onChange({ ...value, [key]: newValue });
    };

    return (
        <div className={styles.sizeControl}>
            {/* Width & Height */}
            <div className={styles.controlRowDouble}>
                <div className={styles.controlHalf}>
                    <label className={styles.controlLabelSmall}>Width</label>
                    <input
                        type="text"
                        className={styles.inputSmall}
                        value={value.width || ''}
                        onChange={(e) => handleChange('width', e.target.value)}
                        placeholder="auto"
                        list="width-presets"
                    />
                    <datalist id="width-presets">
                        {WIDTH_PRESETS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </datalist>
                </div>
                <div className={styles.controlHalf}>
                    <label className={styles.controlLabelSmall}>Height</label>
                    <input
                        type="text"
                        className={styles.inputSmall}
                        value={value.height || ''}
                        onChange={(e) => handleChange('height', e.target.value)}
                        placeholder="auto"
                    />
                </div>
            </div>

            {/* Min/Max Width */}
            {showMinMax && (
                <>
                    <div className={styles.controlRowDouble}>
                        <div className={styles.controlHalf}>
                            <label className={styles.controlLabelSmall}>Min W</label>
                            <input
                                type="text"
                                className={styles.inputSmall}
                                value={value.minWidth || ''}
                                onChange={(e) => handleChange('minWidth', e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div className={styles.controlHalf}>
                            <label className={styles.controlLabelSmall}>Max W</label>
                            <input
                                type="text"
                                className={styles.inputSmall}
                                value={value.maxWidth || ''}
                                onChange={(e) => handleChange('maxWidth', e.target.value)}
                                placeholder="none"
                                list="max-width-presets"
                            />
                            <datalist id="max-width-presets">
                                {MAX_WIDTH_PRESETS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Min/Max Height */}
                    <div className={styles.controlRowDouble}>
                        <div className={styles.controlHalf}>
                            <label className={styles.controlLabelSmall}>Min H</label>
                            <input
                                type="text"
                                className={styles.inputSmall}
                                value={value.minHeight || ''}
                                onChange={(e) => handleChange('minHeight', e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div className={styles.controlHalf}>
                            <label className={styles.controlLabelSmall}>Max H</label>
                            <input
                                type="text"
                                className={styles.inputSmall}
                                value={value.maxHeight || ''}
                                onChange={(e) => handleChange('maxHeight', e.target.value)}
                                placeholder="none"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Aspect Ratio */}
            {showAspectRatio && (
                <div className={styles.controlRow}>
                    <label className={styles.controlLabel}>Aspect</label>
                    <select
                        className={styles.selectSmall}
                        value={value.aspectRatio || ''}
                        onChange={(e) => handleChange('aspectRatio', e.target.value)}
                    >
                        {ASPECT_RATIO_PRESETS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Object Fit (for images/videos) */}
            {showObjectFit && (
                <div className={styles.controlRow}>
                    <label className={styles.controlLabel}>Fit</label>
                    <select
                        className={styles.selectSmall}
                        value={value.objectFit || 'cover'}
                        onChange={(e) =>
                            handleChange('objectFit', e.target.value as SizeValue['objectFit'])
                        }
                    >
                        {OBJECT_FIT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Overflow */}
            {showOverflow && (
                <div className={styles.controlRow}>
                    <label className={styles.controlLabel}>Overflow</label>
                    <select
                        className={styles.selectSmall}
                        value={value.overflow || 'visible'}
                        onChange={(e) =>
                            handleChange('overflow', e.target.value as SizeValue['overflow'])
                        }
                    >
                        {OVERFLOW_OPTIONS.map((opt) => (
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

export default SizeControl;

