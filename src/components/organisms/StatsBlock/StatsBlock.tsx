/**
 * Stats Block Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useEffect, useState } from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

interface StatsBlockProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const StatsBlock: React.FC<StatsBlockProps> = ({ component }) => {
    const { id, props } = component;

    // Default items
    const items = (props.items as Array<any>) || [
        { id: '1', value: '10k+', label: 'Active Users' },
        { id: '2', value: '2M+', label: 'Pages Built' },
        { id: '3', value: '99.9%', label: 'Uptime' },
        { id: '4', value: '24/7', label: 'Support' },
    ];

    const sharedStyles = buildStyles(props as StyleableProps, ['layout', 'typography', 'box', 'size', 'spacing']);

    return (
        <div className="poly-stats-block" style={{ ...sharedStyles, '--poly-columns': props.columns || 4 } as React.CSSProperties} data-component-id={id}>
            <div className="poly-stats-block__grid">
                {items.map((item) => (
                    <div key={item.id} className="poly-stats-item">
                        <span className="poly-stats-item__value">{item.value}</span>
                        <span className="poly-stats-item__label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsBlock;
