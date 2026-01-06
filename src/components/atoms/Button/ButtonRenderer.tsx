/**
 * Button Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../atoms.module.css';

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
    const props = (component.props || {}) as StyleableProps;

    const text = (props.text as string) || 'Click Me';
    const url = (props.url as string) || '#';
    const target = (props.target as string) || '_self';
    const variant = (props.variant as string) || 'solid';
    const size = (props.size as string) || 'medium';
    const widthProp = props.width as string;
    const textColor = props.textColor as string;
    const borderColorProp = props.borderColor as string;

    // Build styles from shared control groups (same as marketing blocks)
    const sharedStyles = buildStyles(props, ['typography', 'box', 'size', 'spacing', 'position']);

    // Base styles
    const style: React.CSSProperties = {
        ...sharedStyles,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        // Font weight default
        fontWeight: sharedStyles.fontWeight || '500',
        // Border radius default
        borderRadius: sharedStyles.borderRadius || '6px',
        // Width handling
        width: widthProp === 'full' ? '100%' : (widthProp === 'auto' ? 'auto' : sharedStyles.width) || undefined,
    };

    // Size-based padding (if no explicit padding set)
    if (!sharedStyles.paddingTop && !sharedStyles.paddingRight && 
        !sharedStyles.paddingBottom && !sharedStyles.paddingLeft) {
        switch (size) {
            case 'small':
            case 'sm':
                style.padding = '8px 16px';
                if (!sharedStyles.fontSize) style.fontSize = '14px';
                break;
            case 'large':
            case 'lg':
                style.padding = '14px 28px';
                if (!sharedStyles.fontSize) style.fontSize = '16px';
                break;
            default: // medium
                style.padding = '10px 20px';
                if (!sharedStyles.fontSize) style.fontSize = '15px';
        }
    }

    // Variant-based styles (can be overridden by explicit props)
    if (!sharedStyles.backgroundColor && !sharedStyles.color && !sharedStyles.borderColor) {
        switch (variant) {
            case 'outline':
                style.backgroundColor = 'transparent';
                style.color = textColor || borderColorProp || '#333';
                style.border = `1px solid ${borderColorProp || '#333'}`;
                break;
            case 'ghost':
                style.backgroundColor = 'transparent';
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
            default: // solid
                style.backgroundColor = sharedStyles.backgroundColor || '#6366f1';
                style.color = textColor || '#ffffff';
                style.border = borderColorProp ? `1px solid ${borderColorProp}` : 'none';
        }
    } else {
        // Use shared styles but apply textColor if set
        if (textColor) style.color = textColor;
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
            target={target}
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
