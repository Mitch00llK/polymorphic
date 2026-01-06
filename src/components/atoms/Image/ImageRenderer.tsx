/**
 * Image Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, buildElementStyles, type StyleableProps } from '../../../utils/styleBuilder';

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

    // Build styles from shared control groups (same as marketing blocks)
    const sharedStyles = buildStyles(props, ['size', 'box', 'spacing', 'position']);

    // Build caption-specific styles
    const captionStyle = buildElementStyles(props, 'caption');

    // Figure styles (wrapper)
    const figureStyle: React.CSSProperties = {
        ...sharedStyles,
        display: 'block',
        maxWidth: sharedStyles.maxWidth || '100%',
        width: sharedStyles.width || '100%',
        // Reset margin if not set
        margin: (!sharedStyles.marginTop && !sharedStyles.marginRight && 
                 !sharedStyles.marginBottom && !sharedStyles.marginLeft) ? 0 : undefined,
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
        height: sharedStyles.height || 'auto',
        aspectRatio: aspectRatio || sharedStyles.aspectRatio || undefined,
        objectFit: objectFit as React.CSSProperties['objectFit'],
        borderRadius: sharedStyles.borderRadius || undefined,
        boxShadow: sharedStyles.boxShadow || undefined,
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
