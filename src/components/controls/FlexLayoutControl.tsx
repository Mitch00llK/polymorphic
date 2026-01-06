/**
 * Flex Layout Control Component
 *
 * Controls for flexbox layout: display, direction, justify, align, gap.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import {
    AlignStartVertical,
    AlignCenterVertical,
    AlignEndVertical,
    ArrowRight,
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    Columns,
    Rows,
    Grid2X2,
} from 'lucide-react';

import styles from './controls.module.css';

export interface FlexLayoutValue {
    display: 'block' | 'flex' | 'grid';
    flexDirection: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    gap: string;
    flexWrap: 'nowrap' | 'wrap';
}

interface FlexLayoutControlProps {
    value: Partial<FlexLayoutValue>;
    onChange: (value: Partial<FlexLayoutValue>) => void;
}

const DEFAULT_FLEX: FlexLayoutValue = {
    display: 'block',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: '',
    flexWrap: 'nowrap',
};

export const FlexLayoutControl: React.FC<FlexLayoutControlProps> = ({
    value,
    onChange,
}) => {
    const layout = { ...DEFAULT_FLEX, ...value };

    const handleChange = <K extends keyof FlexLayoutValue>(
        key: K,
        newValue: FlexLayoutValue[K]
    ) => {
        onChange({ ...value, [key]: newValue });
    };

    const displayOptions = [
        { value: 'block', icon: <Rows size={16} />, label: 'Block' },
        { value: 'flex', icon: <Columns size={16} />, label: 'Flex' },
        { value: 'grid', icon: <Grid2X2 size={16} />, label: 'Grid' },
    ];

    const directionOptions = [
        { value: 'row', icon: <ArrowRight size={14} />, label: 'Row' },
        { value: 'column', icon: <ArrowDown size={14} />, label: 'Column' },
        { value: 'row-reverse', icon: <ArrowLeft size={14} />, label: 'Row Rev' },
        { value: 'column-reverse', icon: <ArrowUp size={14} />, label: 'Col Rev' },
    ];

    const justifyOptions = [
        { value: 'flex-start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'flex-end', label: 'End' },
        { value: 'space-between', label: 'Between' },
        { value: 'space-around', label: 'Around' },
    ];

    const alignOptions = [
        { value: 'flex-start', icon: <AlignStartVertical size={14} />, label: 'Start' },
        { value: 'center', icon: <AlignCenterVertical size={14} />, label: 'Center' },
        { value: 'flex-end', icon: <AlignEndVertical size={14} />, label: 'End' },
        { value: 'stretch', label: 'Stretch' },
    ];

    return (
        <div className={styles.flexControl}>
            {/* Display Type */}
            <div className={styles.controlRow}>
                <label className={styles.controlLabel}>Display</label>
                <div className={styles.buttonGroup}>
                    {displayOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`${styles.iconButton} ${layout.display === opt.value ? styles.active : ''}`}
                            onClick={() => handleChange('display', opt.value as FlexLayoutValue['display'])}
                            title={opt.label}
                        >
                            {opt.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Only show flex options when display is flex */}
            {layout.display === 'flex' && (
                <>
                    {/* Direction */}
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Direction</label>
                        <div className={styles.buttonGroup}>
                            {directionOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`${styles.iconButton} ${layout.flexDirection === opt.value ? styles.active : ''}`}
                                    onClick={() => handleChange('flexDirection', opt.value as FlexLayoutValue['flexDirection'])}
                                    title={opt.label}
                                >
                                    {opt.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Justify Content */}
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Justify</label>
                        <select
                            className={styles.selectSmall}
                            value={layout.justifyContent}
                            onChange={(e) => handleChange('justifyContent', e.target.value as FlexLayoutValue['justifyContent'])}
                        >
                            {justifyOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Align Items */}
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Align</label>
                        <div className={styles.buttonGroup}>
                            {alignOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`${styles.iconButton} ${layout.alignItems === opt.value ? styles.active : ''}`}
                                    onClick={() => handleChange('alignItems', opt.value as FlexLayoutValue['alignItems'])}
                                    title={opt.label}
                                >
                                    {opt.icon || opt.label.charAt(0)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gap */}
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Gap</label>
                        <input
                            type="text"
                            className={styles.inputSmall}
                            value={layout.gap}
                            onChange={(e) => handleChange('gap', e.target.value)}
                            placeholder="e.g. 20px"
                        />
                    </div>

                    {/* Wrap */}
                    <div className={styles.controlRow}>
                        <label className={styles.controlLabel}>Wrap</label>
                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                className={`${styles.textButton} ${layout.flexWrap === 'nowrap' ? styles.active : ''}`}
                                onClick={() => handleChange('flexWrap', 'nowrap')}
                            >
                                No Wrap
                            </button>
                            <button
                                type="button"
                                className={`${styles.textButton} ${layout.flexWrap === 'wrap' ? styles.active : ''}`}
                                onClick={() => handleChange('flexWrap', 'wrap')}
                            >
                                Wrap
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FlexLayoutControl;
