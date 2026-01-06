/**
 * Button Renderer
 *
 * Supports all PropertyPanel controls: typography, boxStyle, size, spacing, position.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';

import styles from '../atoms.module.css';

interface ButtonProps {
    // Content
    text?: string;
    url?: string;
    target?: '_self' | '_blank';
    variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large' | 'sm' | 'default' | 'lg';
    fullWidth?: boolean;
    
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
    
    // Hover states
    hoverBackgroundColor?: string;
    hoverTextColor?: string;
    
    // Size
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    
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
    
    // Alignment
    align?: 'left' | 'center' | 'right';
}

interface ButtonRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Button component.
 */
export const ButtonRenderer: React.FC<ButtonRendererProps> = ({
    component,
    context,
}) => {
    const props = (component.props || {}) as ButtonProps;

    const text = props.text || 'Click Me';
    const url = props.url || '#';
    const variant = props.variant || 'solid';
    const size = props.size || 'medium';

    // Determine text color (support both 'color' and legacy 'textColor')
    const textColor = props.textColor || props.color;

    // Base styles
    const style: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        
        // Typography
        fontFamily: props.fontFamily || undefined,
        fontSize: props.fontSize || undefined,
        fontWeight: props.fontWeight || '500',
        lineHeight: props.lineHeight || undefined,
        letterSpacing: props.letterSpacing || undefined,
        textTransform: props.textTransform as React.CSSProperties['textTransform'] || undefined,
        fontStyle: props.fontStyle as React.CSSProperties['fontStyle'] || undefined,
        
        // Size
        width: props.fullWidth ? '100%' : (props.width === 'full' ? '100%' : props.width) || undefined,
        height: props.height || undefined,
        minWidth: props.minWidth || undefined,
        maxWidth: props.maxWidth || undefined,
        
        // Box Style
        borderRadius: props.borderRadius || '6px',
        boxShadow: props.boxShadow || undefined,
        opacity: props.opacity ? parseFloat(props.opacity) : undefined,
        
        // Spacing (margin)
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

    // Handle padding - use explicit values or size-based defaults
    if (props.paddingTop || props.paddingRight || props.paddingBottom || props.paddingLeft) {
        style.paddingTop = props.paddingTop || undefined;
        style.paddingRight = props.paddingRight || undefined;
        style.paddingBottom = props.paddingBottom || undefined;
        style.paddingLeft = props.paddingLeft || undefined;
    } else {
        // Size-based padding defaults
        switch (size) {
            case 'small':
            case 'sm':
                style.padding = '8px 16px';
                if (!props.fontSize) style.fontSize = '14px';
                break;
            case 'large':
            case 'lg':
                style.padding = '14px 28px';
                if (!props.fontSize) style.fontSize = '16px';
                break;
            default: // medium/default
                style.padding = '10px 20px';
                if (!props.fontSize) style.fontSize = '15px';
        }
    }

    // Variant-based styles (can be overridden by explicit props)
    switch (variant) {
        case 'outline':
            style.backgroundColor = props.backgroundColor || 'transparent';
            style.color = textColor || props.borderColor || '#333';
            style.border = `${props.borderWidth || '1px'} solid ${props.borderColor || '#333'}`;
            break;
        case 'ghost':
            style.backgroundColor = props.backgroundColor || 'transparent';
            style.color = textColor || '#333';
            style.border = 'none';
            break;
        case 'link':
            style.backgroundColor = 'transparent';
            style.color = textColor || '#6366f1';
            style.border = 'none';
            style.padding = '0';
            style.textDecoration = 'underline';
            break;
        case 'secondary':
            style.backgroundColor = props.backgroundColor || '#6b7280';
            style.color = textColor || '#ffffff';
            style.border = props.borderColor ? `${props.borderWidth || '1px'} solid ${props.borderColor}` : 'none';
            break;
        case 'primary':
        case 'solid':
        default:
            style.backgroundColor = props.backgroundColor || '#6366f1';
            style.color = textColor || '#ffffff';
            style.border = props.borderColor ? `${props.borderWidth || '1px'} solid ${props.borderColor}` : 'none';
    }

    // Handle background image
    if (props.backgroundImage) {
        style.backgroundImage = props.backgroundImage.startsWith('url(') 
            ? props.backgroundImage 
            : `url(${props.backgroundImage})`;
    }

    // In editor context, prevent link navigation
    const handleClick = (e: React.MouseEvent) => {
        if (context === 'editor') {
            e.preventDefault();
        }
    };

    return (
        <a
            href={url}
            target={props.target || '_self'}
            className={styles.btn}
            style={style}
            data-component-id={component.id}
            onClick={handleClick}
        >
            {text}
        </a>
    );
};

export default ButtonRenderer;
