/**
 * CTA Block Renderer
 *
 * A call-to-action section with title, description, and button.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';
import styles from './blocks.module.css';

interface CtaBlockRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const CtaBlockRenderer: React.FC<CtaBlockRendererProps> = ({
    component,
}) => {
    const props = component.props || {};

    const title = (props.title as string) || 'Ready to get started?';
    const description = (props.description as string) || 'Join thousands of users building amazing websites with our page builder.';
    const buttonText = (props.buttonText as string) || 'Start Building Now';
    const buttonUrl = (props.buttonUrl as string) || '#';
    const variant = (props.variant as string) || 'default';

    const ctaClasses = [
        styles.ctaBlock,
        variant !== 'default' && styles[`ctaBlock--${variant}`],
    ].filter(Boolean).join(' ');

    return (
        <section className={ctaClasses} data-component-id={component.id}>
            <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}>{title}</h2>
                <p className={styles.ctaDescription}>{description}</p>
                <a href={buttonUrl} className={styles.ctaButton}>
                    {buttonText}
                </a>
            </div>
        </section>
    );
};

export default CtaBlockRenderer;
