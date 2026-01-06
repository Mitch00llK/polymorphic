/**
 * Badge Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';

import styles from '../atoms.module.css';

interface BadgeProps {
    text?: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    fontSize?: string;
    fontWeight?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
}

interface BadgeRendererProps {
    component: ComponentData;
    context?: 'editor' | 'preview';
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as BadgeProps;

    const text = props.text || 'Badge';

    const badgeStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 12px',
        fontSize: props.fontSize || '12px',
        fontWeight: props.fontWeight || '500',
        backgroundColor: props.backgroundColor || '#f3f4f6',
        color: props.textColor || '#374151',
        borderRadius: props.borderRadius || '9999px',
        lineHeight: '1.4',
    };

    return (
        <span
            className={styles.badge}
            style={badgeStyle}
            data-component-id={component.id}
        >
            {text}
        </span>
    );
};

export default BadgeRenderer;
