/**
 * Button Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';

import styles from '../atoms.module.css';

interface ButtonProps {
    text?: string;
    url?: string;
    target?: '_self' | '_blank';
    variant?: 'solid' | 'outline' | 'ghost' | 'link';
    size?: 'small' | 'medium' | 'large';
    width?: 'auto' | 'full' | string;
    align?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
    hoverTextColor?: string;
    fontSize?: string;
    fontWeight?: string;
    borderRadius?: string;
}

interface ButtonRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Button component in the editor/preview.
 */
export const ButtonRenderer: React.FC<ButtonRendererProps> = ({
    component,
    context,
}) => {
    const props = (component.props || {}) as ButtonProps;

    const text = props.text || 'Click Me';
    const url = props.url || '#';
    const variant = props.variant || 'solid';

    // Base styles
    const style: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: props.fontSize || undefined,
        fontWeight: props.fontWeight || '500',
        borderRadius: props.borderRadius || '6px',
        width: props.width === 'full' ? '100%' : props.width === 'auto' ? 'auto' : props.width,
    };

    // Size-based padding
    switch (props.size) {
        case 'small':
            style.padding = '8px 16px';
            style.fontSize = style.fontSize || '14px';
            break;
        case 'large':
            style.padding = '14px 28px';
            style.fontSize = style.fontSize || '16px';
            break;
        default: // medium
            style.padding = '10px 20px';
            style.fontSize = style.fontSize || '15px';
    }

    // Variant-based styles
    switch (variant) {
        case 'outline':
            style.backgroundColor = 'transparent';
            style.color = props.textColor || props.borderColor || '#333';
            style.border = `1px solid ${props.borderColor || '#333'}`;
            break;
        case 'ghost':
            style.backgroundColor = 'transparent';
            style.color = props.textColor || '#333';
            style.border = 'none';
            break;
        case 'link':
            style.backgroundColor = 'transparent';
            style.color = props.textColor || '#6366f1';
            style.border = 'none';
            style.padding = '0';
            style.textDecoration = 'underline';
            break;
        default: // solid
            style.backgroundColor = props.backgroundColor || '#6366f1';
            style.color = props.textColor || '#ffffff';
            style.border = props.borderColor ? `1px solid ${props.borderColor}` : 'none';
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
