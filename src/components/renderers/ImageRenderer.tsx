/**
 * Image Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';
import { buildStyles, buildElementStyles, type StyleableProps } from '../../utils/styleBuilder';

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
    const props = component.props as StyleableProps || {};

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['size', 'box', 'spacing', 'position']);

    // Build caption-specific styles
    const captionStyle = buildElementStyles(props, 'caption');

    const figureStyle: React.CSSProperties = {
        ...sharedStyles,
        // Default margin if not set
        marginBottom: sharedStyles.marginBottom || '1rem',
        maxWidth: sharedStyles.maxWidth || '100%',
    };

    const imgStyle: React.CSSProperties = {
        objectFit: (props.objectFit as React.CSSProperties['objectFit']) || 'cover',
        objectPosition: (props.objectPosition as string) || 'center',
        borderRadius: sharedStyles.borderRadius,
        width: '100%',
        height: 'auto',
        aspectRatio: sharedStyles.aspectRatio,
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
                src={props.src as string}
                alt={(props.alt as string) || ''}
                style={imgStyle}
                loading="lazy"
            />
            {props.caption && (
                <figcaption className={styles.imageCaption} style={captionStyle}>
                    {props.caption as string}
                </figcaption>
            )}
        </figure>
    );
};

export default ImageRenderer;
