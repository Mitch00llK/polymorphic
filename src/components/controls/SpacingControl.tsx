/**
 * Spacing Control Component
 *
 * Linked margin/padding inputs with individual or linked values.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState } from 'react';
import { Link, Unlink } from 'lucide-react';

import styles from './controls.module.css';

export interface SpacingValue {
    top: string;
    right: string;
    bottom: string;
    left: string;
}

interface SpacingControlProps {
    label: string;
    value: SpacingValue;
    onChange: (value: SpacingValue) => void;
    units?: string[];
}

const DEFAULT_SPACING: SpacingValue = {
    top: '',
    right: '',
    bottom: '',
    left: '',
};

export const SpacingControl: React.FC<SpacingControlProps> = ({
    label,
    value = DEFAULT_SPACING,
    onChange,
    units = ['px', 'rem', '%'],
}) => {
    const [isLinked, setIsLinked] = useState(false);
    const [unit, setUnit] = useState('px');

    const handleChange = (side: keyof SpacingValue, inputValue: string) => {
        if (isLinked) {
            // Apply same value to all sides.
            onChange({
                top: inputValue,
                right: inputValue,
                bottom: inputValue,
                left: inputValue,
            });
        } else {
            onChange({
                ...value,
                [side]: inputValue,
            });
        }
    };

    const toggleLinked = () => {
        if (!isLinked && value.top) {
            // When linking, apply top value to all.
            onChange({
                top: value.top,
                right: value.top,
                bottom: value.top,
                left: value.top,
            });
        }
        setIsLinked(!isLinked);
    };

    return (
        <div className={styles.spacingControl}>
            <div className={styles.spacingHeader}>
                <span className={styles.spacingLabel}>{label}</span>
                <div className={styles.spacingActions}>
                    <select
                        className={styles.unitSelect}
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    >
                        {units.map((u) => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className={`${styles.linkButton} ${isLinked ? styles.linked : ''}`}
                        onClick={toggleLinked}
                        title={isLinked ? 'Unlink values' : 'Link values'}
                    >
                        {isLinked ? <Link size={14} /> : <Unlink size={14} />}
                    </button>
                </div>
            </div>

            <div className={styles.spacingInputs}>
                <div className={styles.spacingInput}>
                    <input
                        type="text"
                        value={value.top || ''}
                        onChange={(e) => handleChange('top', e.target.value)}
                        placeholder="—"
                    />
                    <span>Top</span>
                </div>
                <div className={styles.spacingInput}>
                    <input
                        type="text"
                        value={value.right || ''}
                        onChange={(e) => handleChange('right', e.target.value)}
                        placeholder="—"
                    />
                    <span>Right</span>
                </div>
                <div className={styles.spacingInput}>
                    <input
                        type="text"
                        value={value.bottom || ''}
                        onChange={(e) => handleChange('bottom', e.target.value)}
                        placeholder="—"
                    />
                    <span>Bottom</span>
                </div>
                <div className={styles.spacingInput}>
                    <input
                        type="text"
                        value={value.left || ''}
                        onChange={(e) => handleChange('left', e.target.value)}
                        placeholder="—"
                    />
                    <span>Left</span>
                </div>
            </div>
        </div>
    );
};

export default SpacingControl;
