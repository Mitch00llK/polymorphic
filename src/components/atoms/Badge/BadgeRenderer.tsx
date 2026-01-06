/**
 * Badge Renderer
 *
 * Supports all PropertyPanel controls: typography, boxStyle, spacing, position.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';

import styles from '../atoms.module.css';

interface BadgeProps {
    // Content
    text?: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'error' | 'info';
    
    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    textColor?: string; // Legacy prop
    
    // Box Style
    backgroundColor?: string;
    backgroundImage?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderRadius?: string;
    boxShadow?: string;
    opacity?: string;
    
    // Spacing
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    
    // Position
    position?: string;
    positionTop?: string;
    positionRight?: string;
    positionBottom?: string;
    positionLeft?: string;
    zIndex?: string;
}

interface BadgeRendererProps {
    component: ComponentData;
    context?: 'editor' | 'preview';
}

/**
 * Renders a Badge component.
 */
export const BadgeRenderer: React.FC<BadgeRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as BadgeProps;

    const text = props.text || 'Badge';
    const textColor = props.textColor || props.color;

    const style: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        
        // Typography
        fontFamily: props.fontFamily || undefined,
        fontSize: props.fontSize || '12px',
        fontWeight: props.fontWeight || '500',
        lineHeight: props.lineHeight || '1.4',
        letterSpacing: props.letterSpacing || undefined,
        textTransform: props.textTransform as React.CSSProperties['textTransform'] || undefined,
        fontStyle: props.fontStyle as React.CSSProperties['fontStyle'] || undefined,
        textDecoration: props.textDecoration || undefined,
        
        // Box Style
        borderRadius: props.borderRadius || '9999px',
        boxShadow: props.boxShadow || undefined,
        opacity: props.opacity ? parseFloat(props.opacity) : undefined,
        
        // Spacing (use explicit or defaults)
        padding: (!props.paddingTop && !props.paddingRight && !props.paddingBottom && !props.paddingLeft) 
            ? '4px 12px' 
            : undefined,
        paddingTop: props.paddingTop || undefined,
        paddingRight: props.paddingRight || undefined,
        paddingBottom: props.paddingBottom || undefined,
        paddingLeft: props.paddingLeft || undefined,
        marginTop: props.marginTop || undefined,
        marginRight: props.marginRight || undefined,
        marginBottom: props.marginBottom || undefined,
        marginLeft: props.marginLeft || undefined,
        
        // Position
        position: props.position as React.CSSProperties['position'] || undefined,
        top: props.positionTop || undefined,
        right: props.positionRight || undefined,
        bottom: props.positionBottom || undefined,
        left: props.positionLeft || undefined,
        zIndex: props.zIndex ? parseInt(props.zIndex, 10) : undefined,
    };

    // Apply colors - explicit props override variant defaults
    if (props.backgroundColor) {
        style.backgroundColor = props.backgroundColor;
        style.color = textColor || '#ffffff';
    } else {
        // Variant defaults
        switch (props.variant) {
            case 'secondary':
                style.backgroundColor = '#f3f4f6';
                style.color = textColor || '#374151';
                break;
            case 'outline':
                style.backgroundColor = 'transparent';
                style.border = `1px solid ${props.borderColor || '#d1d5db'}`;
                style.color = textColor || '#374151';
                break;
            case 'destructive':
            case 'error':
                style.backgroundColor = '#ef4444';
                style.color = textColor || '#ffffff';
                break;
            case 'success':
                style.backgroundColor = '#22c55e';
                style.color = textColor || '#ffffff';
                break;
            case 'warning':
                style.backgroundColor = '#f59e0b';
                style.color = textColor || '#ffffff';
                break;
            case 'info':
                style.backgroundColor = '#3b82f6';
                style.color = textColor || '#ffffff';
                break;
            default: // default
                style.backgroundColor = '#f3f4f6';
                style.color = textColor || '#374151';
        }
    }

    // Handle border if explicitly set
    if (props.borderWidth || props.borderColor) {
        style.border = `${props.borderWidth || '1px'} solid ${props.borderColor || '#d1d5db'}`;
    }

    // Handle background image
    if (props.backgroundImage) {
        style.backgroundImage = props.backgroundImage.startsWith('url(') 
            ? props.backgroundImage 
            : `url(${props.backgroundImage})`;
    }

    return (
        <span
            className={styles.badge}
            style={style}
            data-component-id={component.id}
        >
            {text}
        </span>
    );
};

export default BadgeRenderer;
