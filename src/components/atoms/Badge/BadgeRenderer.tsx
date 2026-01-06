/**
 * Badge Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../atoms.module.css';

interface BadgeRendererProps {
    component: ComponentData;
    context?: 'editor' | 'preview';
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as StyleableProps;

    const text = (props.text as string) || 'Badge';
    const variant = (props.variant as string) || 'default';
    const textColor = props.textColor as string;

    // Build styles from shared control groups (same as marketing blocks)
    const sharedStyles = buildStyles(props, ['typography', 'box', 'spacing', 'position']);

    const badgeStyle: React.CSSProperties = {
        ...sharedStyles,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Defaults
        fontSize: sharedStyles.fontSize || '12px',
        fontWeight: sharedStyles.fontWeight || '500',
        borderRadius: sharedStyles.borderRadius || '9999px',
        lineHeight: '1.4',
    };

    // Padding default if not set
    if (!sharedStyles.paddingTop && !sharedStyles.paddingRight && 
        !sharedStyles.paddingBottom && !sharedStyles.paddingLeft) {
        badgeStyle.padding = '4px 12px';
    }

    // Apply colors - explicit props override variant defaults
    if (!sharedStyles.backgroundColor && !sharedStyles.color) {
        switch (variant) {
            case 'success':
                badgeStyle.backgroundColor = '#22c55e';
                badgeStyle.color = textColor || '#ffffff';
                break;
            case 'warning':
                badgeStyle.backgroundColor = '#f59e0b';
                badgeStyle.color = textColor || '#ffffff';
                break;
            case 'error':
            case 'destructive':
                badgeStyle.backgroundColor = '#ef4444';
                badgeStyle.color = textColor || '#ffffff';
                break;
            case 'info':
                badgeStyle.backgroundColor = '#3b82f6';
                badgeStyle.color = textColor || '#ffffff';
                break;
            case 'secondary':
            case 'outline':
                badgeStyle.backgroundColor = sharedStyles.backgroundColor || 'transparent';
                badgeStyle.color = textColor || '#374151';
                if (variant === 'outline') {
                    badgeStyle.border = `1px solid ${sharedStyles.borderColor || '#d1d5db'}`;
                }
                break;
            default: // default
                badgeStyle.backgroundColor = sharedStyles.backgroundColor || '#f3f4f6';
                badgeStyle.color = textColor || '#374151';
        }
    } else {
        // Use shared styles but apply textColor if set
        if (textColor) badgeStyle.color = textColor;
    }

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
