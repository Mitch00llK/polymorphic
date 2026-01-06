/**
 * Image Renderer
 *
 * Supports all PropertyPanel controls: size, boxStyle, spacing, position.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';

import styles from '../atoms.module.css';

interface ImageProps {
    // Content
    src?: string;
    alt?: string;
    srcset?: string;
    sizes?: string;
    caption?: string;
    align?: 'left' | 'center' | 'right' | 'none';
    
    // Size
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    overflow?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    aspectRatio?: string;
    
    // Box Style
    backgroundColor?: string;
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
    
    // Caption styling
    captionFontSize?: string;
    captionFontWeight?: string;
    captionColor?: string;
    captionBackgroundColor?: string;
    captionMarginTop?: string;
    captionMarginBottom?: string;
}

interface ImageRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders an Image component.
 */
export const ImageRenderer: React.FC<ImageRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as ImageProps;

    // Figure styles (wrapper)
    const figureStyle: React.CSSProperties = {
        display: 'block',
        maxWidth: props.maxWidth || '100%',
        width: props.width || '100%',
        minWidth: props.minWidth || undefined,
        height: props.height || undefined,
        minHeight: props.minHeight || undefined,
        maxHeight: props.maxHeight || undefined,
        overflow: props.overflow as React.CSSProperties['overflow'] || undefined,
        
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
        
        // Reset margin
        margin: (!props.marginTop && !props.marginRight && !props.marginBottom && !props.marginLeft) ? 0 : undefined,
    };

    // Handle alignment
    if (props.align === 'center') {
        figureStyle.marginLeft = 'auto';
        figureStyle.marginRight = 'auto';
    } else if (props.align === 'right') {
        figureStyle.marginLeft = 'auto';
    }

    // Image styles
    const imgStyle: React.CSSProperties = {
        width: '100%',
        height: props.height || 'auto',
        aspectRatio: props.aspectRatio || undefined,
        objectFit: props.objectFit || 'cover',
        borderRadius: props.borderRadius || undefined,
        display: 'block',
    };

    // Caption styles
    const captionStyle: React.CSSProperties = {
        fontSize: props.captionFontSize || '14px',
        fontWeight: props.captionFontWeight || undefined,
        color: props.captionColor || '#6b7280',
        backgroundColor: props.captionBackgroundColor || undefined,
        marginTop: props.captionMarginTop || '8px',
        marginBottom: props.captionMarginBottom || undefined,
        textAlign: 'center',
        lineHeight: '1.4',
    };

    // Show placeholder if no image src
    if (!props.src) {
        return (
            <figure
                className={styles.image}
                style={figureStyle}
                data-component-id={component.id}
            >
                <div className={styles.imagePlaceholder}>
                    📷 Select an image
                </div>
            </figure>
        );
    }

    return (
        <figure
            className={styles.image}
            style={figureStyle}
            data-component-id={component.id}
        >
            <img
                src={props.src}
                alt={props.alt || ''}
                srcSet={props.srcset || undefined}
                sizes={props.sizes || undefined}
                style={imgStyle}
                loading="lazy"
            />
            {props.caption && (
                <figcaption className={styles.imageCaption} style={captionStyle}>
                    {props.caption}
                </figcaption>
            )}
        </figure>
    );
};

export default ImageRenderer;
