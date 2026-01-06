/**
 * Hero Block Renderer
 *
 * A full-width hero section with title, subtitle, buttons, and optional image.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';
import styles from './blocks.module.css';

interface HeroBlockRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const HeroBlockRenderer: React.FC<HeroBlockRendererProps> = ({
    component,
}) => {
    const props = component.props || {};

    const title = (props.title as string) || 'Build something amazing';
    const subtitle = (props.subtitle as string) || 'Create beautiful, responsive websites with our intuitive page builder.';
    const primaryButtonText = (props.primaryButtonText as string) || 'Get Started';
    const primaryButtonUrl = (props.primaryButtonUrl as string) || '#';
    const secondaryButtonText = (props.secondaryButtonText as string) || 'Learn More';
    const secondaryButtonUrl = (props.secondaryButtonUrl as string) || '#';
    const imageUrl = (props.imageUrl as string) || '';
    const alignment = (props.alignment as string) || 'center';
    const showSecondaryButton = props.showSecondaryButton !== false;

    const heroClasses = [
        styles.heroBlock,
        styles[`heroBlock--${alignment}`],
    ].filter(Boolean).join(' ');

    return (
        <section className={heroClasses} data-component-id={component.id}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>{title}</h1>
                <p className={styles.heroSubtitle}>{subtitle}</p>
                <div className={styles.heroButtons}>
                    <a href={primaryButtonUrl} className={styles.heroPrimaryBtn}>
                        {primaryButtonText}
                    </a>
                    {showSecondaryButton && (
                        <a href={secondaryButtonUrl} className={styles.heroSecondaryBtn}>
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
