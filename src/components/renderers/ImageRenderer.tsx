/**
 * Image Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';

import styles from './renderers.module.css';

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
    const props = component.props || {};

    const figureStyle: React.CSSProperties = {
        marginTop: props.marginTop || undefined,
        marginBottom: props.marginBottom || '1rem',
        maxWidth: props.maxWidth || '100%',
    };

    const imgStyle: React.CSSProperties = {
        objectFit: (props.objectFit as React.CSSProperties['objectFit']) || 'cover',
        objectPosition: props.objectPosition || 'center',
        borderRadius: props.borderRadius || undefined,
        width: '100%',
        height: 'auto',
    };

    const classNames = [
        styles.image,
        props.style && props.style !== 'default' ? styles[`image--${props.style}`] : '',
        props.align && props.align !== 'none' ? styles[`image--align-${props.align}`] : '',
    ].filter(Boolean).join(' ');

    // Show placeholder if no image src.
    if (!props.src) {
        return (
            <figure
                className={`${classNames} ${styles['image--placeholder']}`}
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
            className={classNames}
            style={figureStyle}
            data-component-id={component.id}
        >
            <img
                src={props.src}
                alt={props.alt || ''}
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
