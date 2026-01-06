/**
 * Hero Block Renderer
 *
 * A full-width hero section with title, subtitle, buttons, and optional image.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, buildElementStyles, type StyleableProps } from '../../../utils/styleBuilder';
import styles from '../blocks.module.css';

interface HeroBlockRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const HeroBlockRenderer: React.FC<HeroBlockRendererProps> = ({
    component,
}) => {
    const props = component.props as StyleableProps || {};

    const title = (props.title as string) || 'Build something amazing';
    const subtitle = (props.subtitle as string) || 'Create beautiful, responsive websites with our intuitive page builder.';
    const primaryButtonText = (props.primaryButtonText as string) || 'Get Started';
    const primaryButtonUrl = (props.primaryButtonUrl as string) || '#';
    const secondaryButtonText = (props.secondaryButtonText as string) || 'Learn More';
    const secondaryButtonUrl = (props.secondaryButtonUrl as string) || '#';
    const imageUrl = (props.imageUrl as string) || '';
    const alignment = (props.alignment as string) || 'center';
    const showSecondaryButton = props.showSecondaryButton !== false;

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['layout', 'typography', 'box', 'size', 'spacing']);

    // Build element-specific styles
    const heroTitleStyle = buildElementStyles(props, 'heroTitle');
    const heroSubtitleStyle = buildElementStyles(props, 'heroSubtitle');
    const primaryButtonStyle = buildElementStyles(props, 'primaryButton');
    const secondaryButtonStyle = buildElementStyles(props, 'secondaryButton');

    const heroClasses = [
        styles.heroBlock,
        styles[`heroBlock--${alignment}`],
    ].filter(Boolean).join(' ');

    const heroStyle: React.CSSProperties = {
        ...sharedStyles,
    };

    return (
        <section className={heroClasses} style={heroStyle} data-component-id={component.id}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle} style={heroTitleStyle}>{title}</h1>
                <p className={styles.heroSubtitle} style={heroSubtitleStyle}>{subtitle}</p>
                <div className={styles.heroButtons}>
                    <a href={primaryButtonUrl} className={styles.heroPrimaryBtn} style={primaryButtonStyle}>
                        {primaryButtonText}
                    </a>
                    {showSecondaryButton && (
                        <a href={secondaryButtonUrl} className={styles.heroSecondaryBtn} style={secondaryButtonStyle}>
                            {secondaryButtonText}
                        </a>
                    )}
                </div>
            </div>
            {imageUrl && (
                <div className={styles.heroImage}>
                    <img src={imageUrl} alt="" />
                </div>
            )}
        </section>
    );
};

export default HeroBlockRenderer;

