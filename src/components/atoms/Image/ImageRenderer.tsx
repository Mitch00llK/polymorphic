/**
 * Image Renderer
 *
 * Uses CSS classes + custom properties for clean DOM.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildCSSVariables, type CSSVariableProps } from '../../../utils/cssVariables';

interface ImageRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

interface ImageProps extends CSSVariableProps {
    src?: string;
    alt?: string;
    srcset?: string;
    sizes?: string;
    caption?: string;
    align?: 'left' | 'center' | 'right';
}

/**
 * Renders an Image component with CSS variables.
 */
export const ImageRenderer: React.FC<ImageRendererProps> = ({
    component,
}) => {
    const props = (component.props || {}) as ImageProps;

    const src = props.src;
    const alt = props.alt || '';
    const srcset = props.srcset;
    const sizes = props.sizes;
    const caption = props.caption;
    const align = props.align;

    // Build CSS variables from props
    const cssVars = buildCSSVariables(props);

    // Build class names
    const classNames = [
        'poly-image',
        align && `poly-image--align-${align}`,
    ].filter(Boolean).join(' ');

    // Show placeholder if no image src
    if (!src) {
        return (
            <figure
                className={classNames}
                style={cssVars}
                data-component-id={component.id}
            >
                <div className="poly-image__placeholder">
                    📷 Select an image
                </div>
            </figure>
        );
    }

    return (
        <figure
            className={classNames}
            style={cssVars}
            data-component-id={component.id}
        >
            <img
                src={src}
                alt={alt}
                srcSet={srcset || undefined}
                sizes={sizes || undefined}
                loading="lazy"
            />
            {caption && (
                <figcaption className="poly-image__caption">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};

export default ImageRenderer;
