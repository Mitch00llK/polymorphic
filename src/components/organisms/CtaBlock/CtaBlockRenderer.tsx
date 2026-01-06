/**
 * CTA Block Renderer
 *
 * A call-to-action section with title, description, and button.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, buildElementStyles, type StyleableProps } from '../../../utils/styleBuilder';
import styles from '../blocks.module.css';

interface CtaBlockRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const CtaBlockRenderer: React.FC<CtaBlockRendererProps> = ({
    component,
}) => {
    const props = component.props as StyleableProps || {};

    const title = (props.title as string) || 'Ready to get started?';
    const description = (props.description as string) || 'Join thousands of users building amazing websites with our page builder.';
    const buttonText = (props.buttonText as string) || 'Start Building Now';
    const buttonUrl = (props.buttonUrl as string) || '#';
    const variant = (props.variant as string) || 'default';

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['layout', 'typography', 'box', 'spacing']);

    // Build element-specific styles
    const ctaTitleStyle = buildElementStyles(props, 'ctaTitle');
    const ctaDescriptionStyle = buildElementStyles(props, 'ctaDescription');
    const ctaButtonStyle = buildElementStyles(props, 'ctaButton');

    const ctaClasses = [
        styles.ctaBlock,
        variant !== 'default' && styles[`ctaBlock--${variant}`],
    ].filter(Boolean).join(' ');

    const ctaStyle: React.CSSProperties = {
        ...sharedStyles,
    };

    return (
        <section className={ctaClasses} style={ctaStyle} data-component-id={component.id}>
            <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle} style={ctaTitleStyle}>{title}</h2>
                <p className={styles.ctaDescription} style={ctaDescriptionStyle}>{description}</p>
                <a href={buttonUrl} className={styles.ctaButton} style={ctaButtonStyle}>
                    {buttonText}
                </a>
            </div>
        </section>
    );
};

export default CtaBlockRenderer;

