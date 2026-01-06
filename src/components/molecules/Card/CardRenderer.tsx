/**
 * Card Renderer
 *
 * Supports all PropertyPanel controls: boxStyle, size, spacing, position.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';

import styles from '../molecules.module.css';

interface PaddingObject {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

interface CardProps {
    // Content
    title?: string;
    description?: string;
    footer?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    variant?: 'default' | 'outline' | 'ghost' | 'elevated';
    
    // Box Style
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderRadius?: string;
    borderRadiusTopLeft?: string;
    borderRadiusTopRight?: string;
    borderRadiusBottomRight?: string;
    borderRadiusBottomLeft?: string;
    boxShadow?: string;
    opacity?: string;
    
    // Size
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    overflow?: string;
    
    // Spacing (PropertyPanel format)
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    // Legacy spacing (template format)
    padding?: PaddingObject | string;
    
    // Position
    position?: string;
    positionTop?: string;
    positionRight?: string;
    positionBottom?: string;
    positionLeft?: string;
    zIndex?: string;
    
    // Element-specific styles
    titleFontSize?: string;
    titleFontWeight?: string;
    titleLineHeight?: string;
    titleLetterSpacing?: string;
    titleColor?: string;
    titleBackgroundColor?: string;
    titleMarginTop?: string;
    titleMarginBottom?: string;
    
    descriptionFontSize?: string;
    descriptionFontWeight?: string;
    descriptionLineHeight?: string;
    descriptionLetterSpacing?: string;
    descriptionColor?: string;
    descriptionBackgroundColor?: string;
    descriptionMarginTop?: string;
    descriptionMarginBottom?: string;
    
    footerFontSize?: string;
    footerFontWeight?: string;
    footerLineHeight?: string;
    footerLetterSpacing?: string;
    footerColor?: string;
    footerBackgroundColor?: string;
    footerMarginTop?: string;
    footerMarginBottom?: string;
}

interface CardRendererProps {
    component: ComponentData;
    context?: 'editor' | 'preview';
}

/**
 * Renders a Card component.
 */
export const CardRenderer: React.FC<CardRendererProps> = ({
    component,
    context = 'preview',
}) => {
    const props = (component.props || {}) as CardProps;
    const children = component.children || [];

    // Handle padding - support both PropertyPanel format and legacy template format
    let paddingStyles: React.CSSProperties = {};
    if (props.paddingTop || props.paddingRight || props.paddingBottom || props.paddingLeft) {
        paddingStyles = {
            paddingTop: props.paddingTop || undefined,
            paddingRight: props.paddingRight || undefined,
            paddingBottom: props.paddingBottom || undefined,
            paddingLeft: props.paddingLeft || undefined,
        };
    } else if (props.padding) {
        if (typeof props.padding === 'object') {
            paddingStyles = {
                paddingTop: props.padding.top || '24px',
                paddingRight: props.padding.right || '24px',
                paddingBottom: props.padding.bottom || '24px',
                paddingLeft: props.padding.left || '24px',
            };
        } else {
            paddingStyles = { padding: props.padding };
        }
    } else {
        paddingStyles = { padding: '24px' };
    }

    // Handle border radius (individual corners or single value)
    let borderRadiusValue: string | undefined;
    if (props.borderRadiusTopLeft || props.borderRadiusTopRight || 
        props.borderRadiusBottomRight || props.borderRadiusBottomLeft) {
        borderRadiusValue = [
            props.borderRadiusTopLeft || '0',
            props.borderRadiusTopRight || '0',
            props.borderRadiusBottomRight || '0',
            props.borderRadiusBottomLeft || '0',
        ].join(' ');
    } else {
        borderRadiusValue = props.borderRadius || '8px';
    }

    // Card styles
    const cardStyle: React.CSSProperties = {
        boxSizing: 'border-box',
        
        // Box Style
        backgroundColor: props.backgroundColor || '#ffffff',
        backgroundSize: props.backgroundSize || undefined,
        backgroundPosition: props.backgroundPosition || undefined,
        backgroundRepeat: props.backgroundRepeat || undefined,
        borderRadius: borderRadiusValue,
        boxShadow: props.boxShadow || undefined,
        opacity: props.opacity ? parseFloat(props.opacity) : undefined,
        
        // Size
        width: props.width || undefined,
        height: props.height || undefined,
        minWidth: props.minWidth || undefined,
        maxWidth: props.maxWidth || undefined,
        minHeight: props.minHeight || undefined,
        maxHeight: props.maxHeight || undefined,
        overflow: props.overflow as React.CSSProperties['overflow'] || undefined,
        
        // Spacing
        ...paddingStyles,
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

    // Handle border
    if (props.borderColor || props.borderWidth) {
        cardStyle.border = `${props.borderWidth || '1px'} solid ${props.borderColor || '#e5e7eb'}`;
    } else if (props.variant !== 'ghost') {
        cardStyle.border = '1px solid #e5e7eb';
    }

    // Handle background image
    if (props.backgroundImage) {
        if (props.backgroundImage.startsWith('linear-gradient') || 
            props.backgroundImage.startsWith('radial-gradient') ||
            props.backgroundImage.startsWith('url(')) {
            cardStyle.backgroundImage = props.backgroundImage;
        } else {
            cardStyle.backgroundImage = `url(${props.backgroundImage})`;
        }
    }

    // Variant-specific styles
    switch (props.variant) {
        case 'ghost':
            cardStyle.backgroundColor = 'transparent';
            cardStyle.border = 'none';
            cardStyle.boxShadow = 'none';
            break;
        case 'elevated':
            cardStyle.boxShadow = props.boxShadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            break;
    }

    // Title styles
    const titleStyle: React.CSSProperties = {
        margin: 0,
        fontSize: props.titleFontSize || '1.25rem',
        fontWeight: props.titleFontWeight || '600',
        lineHeight: props.titleLineHeight || '1.4',
        letterSpacing: props.titleLetterSpacing || undefined,
        color: props.titleColor || undefined,
        backgroundColor: props.titleBackgroundColor || undefined,
        marginTop: props.titleMarginTop || undefined,
        marginBottom: props.titleMarginBottom || '0.5rem',
    };

    // Description styles
    const descriptionStyle: React.CSSProperties = {
        margin: 0,
        fontSize: props.descriptionFontSize || '0.875rem',
        fontWeight: props.descriptionFontWeight || undefined,
        lineHeight: props.descriptionLineHeight || '1.5',
        letterSpacing: props.descriptionLetterSpacing || undefined,
        color: props.descriptionColor || '#6b7280',
        backgroundColor: props.descriptionBackgroundColor || undefined,
        marginTop: props.descriptionMarginTop || undefined,
        marginBottom: props.descriptionMarginBottom || undefined,
    };

    // Footer styles
    const footerStyle: React.CSSProperties = {
        fontSize: props.footerFontSize || '0.875rem',
        fontWeight: props.footerFontWeight || undefined,
        lineHeight: props.footerLineHeight || '1.5',
        letterSpacing: props.footerLetterSpacing || undefined,
        color: props.footerColor || '#6b7280',
        backgroundColor: props.footerBackgroundColor || undefined,
        marginTop: props.footerMarginTop || '1rem',
        marginBottom: props.footerMarginBottom || undefined,
    };

    return (
        <div
            className={styles.card}
            style={cardStyle}
            data-component-id={component.id}
        >
            {props.showHeader !== false && props.title && (
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle} style={titleStyle}>{props.title}</h3>
                    {props.description && (
                        <p className={styles.cardDescription} style={descriptionStyle}>{props.description}</p>
                    )}
                </div>
            )}
            <div className={styles.cardContent}>
                {children.length > 0 ? (
                    children.map((child) => (
                        <ComponentRenderer
                            key={child.id}
                            component={child}
                            context={context}
                        />
                    ))
                ) : context === 'editor' ? (
                    <p className={styles.placeholder}>Add content here</p>
                ) : null}
            </div>
            {props.showFooter !== false && props.footer && (
                <div className={styles.cardFooter} style={footerStyle}>
                    <p style={{ margin: 0 }}>{props.footer}</p>
                </div>
            )}
        </div>
    );
};

export default CardRenderer;
