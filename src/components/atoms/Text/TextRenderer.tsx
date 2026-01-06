/**
 * Text Renderer
 *
 * Supports all PropertyPanel controls: typography, boxStyle, spacing, position.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';

import styles from '../atoms.module.css';

interface TextProps {
    // Content
    content?: string;
    variant?: 'default' | 'lead' | 'small';
    
    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: string;
    textAlign?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    
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
    
    // Layout
    columns?: number;
}

interface TextRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Text component.
 */
export const TextRenderer: React.FC<TextRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as TextProps;

    const content = props.content || '<p>Enter your text here...</p>';

    const style: React.CSSProperties = {
        // Typography
        fontFamily: props.fontFamily || undefined,
        fontSize: props.fontSize || undefined,
        fontWeight: props.fontWeight || undefined,
        lineHeight: props.lineHeight || undefined,
        letterSpacing: props.letterSpacing || undefined,
        textTransform: props.textTransform as React.CSSProperties['textTransform'] || undefined,
        textAlign: props.textAlign as React.CSSProperties['textAlign'] || undefined,
        fontStyle: props.fontStyle as React.CSSProperties['fontStyle'] || undefined,
        textDecoration: props.textDecoration || undefined,
        color: props.color || undefined,
        
        // Box Style
        backgroundColor: props.backgroundColor || undefined,
        borderWidth: props.borderWidth || undefined,
        borderStyle: props.borderStyle as React.CSSProperties['borderStyle'] || (props.borderWidth ? 'solid' : undefined),
        borderColor: props.borderColor || undefined,
        borderRadius: props.borderRadius || undefined,
        boxShadow: props.boxShadow || undefined,
        opacity: props.opacity ? parseFloat(props.opacity) : undefined,
        
        // Spacing
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
        
        // Layout
        columnCount: props.columns && props.columns > 1 ? props.columns : undefined,
        
        // Reset defaults
        margin: (!props.marginTop && !props.marginBottom && !props.marginLeft && !props.marginRight) ? 0 : undefined,
    };

    // Handle background image
    if (props.backgroundImage) {
        style.backgroundImage = props.backgroundImage.startsWith('url(') 
            ? props.backgroundImage 
            : `url(${props.backgroundImage})`;
    }

    return (
        <div
            className={styles.text}
            style={style}
            data-component-id={component.id}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default TextRenderer;
