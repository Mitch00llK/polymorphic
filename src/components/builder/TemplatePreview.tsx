/**
 * Template Preview Component
 *
 * Renders a scaled-down preview of template components.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { ComponentRenderer } from '../ComponentRenderer';
import type { ComponentData } from '../../types/components';

import styles from './TemplatePreview.module.css';

interface TemplatePreviewProps {
    components: ComponentData[];
    scale?: number;
    maxHeight?: number;
}

/**
 * Renders a scaled preview of template components.
 */
export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
    components,
    scale = 0.25,
    maxHeight = 200,
}) => {
    // Calculate the viewport width for proper scaling
    const viewportWidth = 1440; // Standard desktop width

    return (
        <div
            className={styles.previewContainer}
            style={{
                height: maxHeight,
                overflow: 'hidden',
            }}
        >
            <div
                className={styles.previewScaler}
                style={{
                    width: viewportWidth,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            >
                <div className={styles.previewContent}>
                    {components.map((component) => (
                        <ComponentRenderer
                            key={component.id}
                            component={component}
                            context="preview"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplatePreview;

