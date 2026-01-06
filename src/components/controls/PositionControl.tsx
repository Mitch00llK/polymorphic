/**
 * Position Control Component
 *
 * Controls for element positioning: position type, top/right/bottom/left, z-index.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { Move, Layers } from 'lucide-react';

import styles from './controls.module.css';

export interface PositionValue {
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: string;
    inset?: string;
}

interface PositionControlProps {
    value: Partial<PositionValue>;
    onChange: (value: Partial<PositionValue>) => void;
}

const POSITION_OPTIONS = [
    { value: 'static', label: 'Static' },
    { value: 'relative', label: 'Relative' },
    { value: 'absolute', label: 'Absolute' },
    { value: 'fixed', label: 'Fixed' },
    { value: 'sticky', label: 'Sticky' },
];

const Z_INDEX_PRESETS = [
    { value: '', label: 'Auto' },
    { value: '-1', label: '-1 (Behind)' },
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
    { value: '40', label: '40' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '999', label: '999 (Top)' },
];

export const PositionControl: React.FC<PositionControlProps> = ({
    value,
    onChange,
}) => {
    const handleChange = <K extends keyof PositionValue>(
        key: K,
        newValue: PositionValue[K]
    ) => {
        onChange({ ...value, [key]: newValue });
    };

    const showOffsets = value.position && value.position !== 'static';

    return (
        <div className={styles.positionControl}>
            {/* Position Type */}
            <div className={styles.controlRow}>
                <label className={styles.controlLabel}>Position</label>
                <select
                    className={styles.selectSmall}
                    value={value.position || 'static'}
                    onChange={(e) =>
                        handleChange('position', e.target.value as PositionValue['position'])
                    }
                >
                    {POSITION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Offset Controls (only shown when position is not static) */}
            {showOffsets && (
                <>
                    <div className={styles.positionGrid}>
                        <div className={styles.positionInputWrapper}>
                            <label className={styles.positionLabel}>Top</label>
                            <input
                                type="text"
                                className={styles.positionInput}
                                value={value.top || ''}
                                onChange={(e) => handleChange('top', e.target.value)}
                                placeholder="auto"
                            />
                        </div>
                        <div className={styles.positionInputWrapper}>
                            <label className={styles.positionLabel}>Right</label>
                            <input
                                type="text"
                                className={styles.positionInput}
                                value={value.right || ''}
                                onChange={(e) => handleChange('right', e.target.value)}
                                placeholder="auto"
                            />
                        </div>
                        <div className={styles.positionInputWrapper}>
                            <label className={styles.positionLabel}>Bottom</label>
                            <input
                                type="text"
                                className={styles.positionInput}
                                value={value.bottom || ''}
                                onChange={(e) => handleChange('bottom', e.target.value)}
                                placeholder="auto"
                            />
                        </div>
                        <div className={styles.positionInputWrapper}>
                            <label className={styles.positionLabel}>Left</label>
                            <input
                                type="text"
                                className={styles.positionInput}
                                value={value.left || ''}
                                onChange={(e) => handleChange('left', e.target.value)}
                                placeholder="auto"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Z-Index */}
            <div className={styles.controlRow}>
                <label className={styles.controlLabel}>Z-Index</label>
                <select
                    className={styles.selectSmall}
                    value={value.zIndex || ''}
                    onChange={(e) => handleChange('zIndex', e.target.value)}
                >
                    {Z_INDEX_PRESETS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PositionControl;

