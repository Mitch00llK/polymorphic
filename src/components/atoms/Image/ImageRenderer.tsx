/**
 * Image Renderer
 *
 * Supports ALL control groups for maximum customization.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildAllStyles, buildElementStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../atoms.module.css';

interface ImageRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders an Image component in the editor/preview.
 */
export const ImageRenderer: React.FC<ImageRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as StyleableProps;

    const src = props.src as string;
    const alt = (props.alt as string) || '';
    const srcset = props.srcset as string;
    const sizes = props.sizes as string;
    const caption = props.caption as string;
    const align = props.align as string;
    const objectFit = (props.objectFit as string) || 'cover';
    const aspectRatio = props.aspectRatio as string;

    // Build ALL styles from ALL control groups
    const allStyles = buildAllStyles(props);

    // Build caption-specific styles
    const captionStyle = buildElementStyles(props, 'caption');

    // Figure styles (wrapper)
    const figureStyle: React.CSSProperties = {
        ...allStyles,
        display: 'block',
        maxWidth: allStyles.maxWidth || '100%',
        width: allStyles.width || '100%',
        // Reset margin if not set
        margin: (!allStyles.marginTop && !allStyles.marginRight && 
                 !allStyles.marginBottom && !allStyles.marginLeft) ? 0 : undefined,
    };

    // Handle alignment
    if (align === 'center') {
        figureStyle.marginLeft = 'auto';
        figureStyle.marginRight = 'auto';
    } else if (align === 'right') {
        figureStyle.marginLeft = 'auto';
    }

    // Image styles
    const imgStyle: React.CSSProperties = {
        width: '100%',
        height: allStyles.height || 'auto',
        aspectRatio: aspectRatio || allStyles.aspectRatio || undefined,
        objectFit: (allStyles.objectFit || objectFit) as React.CSSProperties['objectFit'],
        borderRadius: allStyles.borderRadius || undefined,
        boxShadow: allStyles.boxShadow || undefined,
        display: 'block',
    };

    // Show placeholder if no image src
    if (!src) {
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
                src={src}
                alt={alt}
                srcSet={srcset || undefined}
                sizes={sizes || undefined}
                style={imgStyle}
                loading="lazy"
            />
            {caption && (
                <figcaption className={styles.imageCaption} style={captionStyle}>
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};

export default ImageRenderer;
