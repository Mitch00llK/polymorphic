/**
 * Logo Cloud Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

interface LogoCloudProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const LogoCloud: React.FC<LogoCloudProps> = ({ component }) => {
    const { id, props } = component;

    // Default items
    const items = (props.items as Array<any>) || [
        { id: '1', url: 'https://placehold.co/160x48?text=Company+1', alt: 'Company 1' },
        { id: '2', url: 'https://placehold.co/160x48?text=Company+2', alt: 'Company 2' },
        { id: '3', url: 'https://placehold.co/160x48?text=Company+3', alt: 'Company 3' },
        { id: '4', url: 'https://placehold.co/160x48?text=Company+4', alt: 'Company 4' },
        { id: '5', url: 'https://placehold.co/160x48?text=Company+5', alt: 'Company 5' },
    ];

    const sharedStyles = buildStyles(props as StyleableProps, ['layout', 'typography', 'box', 'size', 'spacing']);

    return (
        <div className="poly-logo-cloud" style={sharedStyles} data-component-id={id}>
            {props.title && <div className="poly-logo-cloud__title">{props.title as string}</div>}

            <div className="poly-logo-cloud__grid" style={{ '--poly-gap': props.gap } as React.CSSProperties}>
                {items.map((item) => (
                    <div key={item.id} className="poly-logo-item">
                        <img src={item.url} alt={item.alt} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogoCloud;
