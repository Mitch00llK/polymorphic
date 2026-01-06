/**
 * Image Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';

import styles from '../atoms.module.css';

interface ImageProps {
    src?: string;
    alt?: string;
    srcset?: string;
    sizes?: string;
    width?: string;
    height?: string;
    maxWidth?: string;
    aspectRatio?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    borderRadius?: string;
    boxShadow?: string;
    align?: 'left' | 'center' | 'right';
    caption?: string;
}

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
    const props = (component.props || {}) as ImageProps;

    const figureStyle: React.CSSProperties = {
        maxWidth: props.maxWidth || '100%',
        width: props.width || '100%',
        margin: 0,
        display: 'block',
    };

    // Handle alignment
    if (props.align === 'center') {
        figureStyle.marginLeft = 'auto';
        figureStyle.marginRight = 'auto';
    } else if (props.align === 'right') {
        figureStyle.marginLeft = 'auto';
    }

    const imgStyle: React.CSSProperties = {
        width: '100%',
        height: props.height || 'auto',
        aspectRatio: props.aspectRatio || undefined,
        objectFit: props.objectFit || 'cover',
        borderRadius: props.borderRadius || undefined,
        boxShadow: props.boxShadow || undefined,
        display: 'block',
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
                <figcaption className={styles.imageCaption}>
                    {props.caption}
                </figcaption>
            )}
        </figure>
    );
};

export default ImageRenderer;
