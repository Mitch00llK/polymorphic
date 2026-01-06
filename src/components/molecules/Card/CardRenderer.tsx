/**
 * Card Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';

import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { buildStyles, buildElementStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../molecules.module.css';

interface CardRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const CardRenderer: React.FC<CardRendererProps> = ({
    component,
    context = 'frontend',
}) => {
    const props = component.props as StyleableProps || {};
    const children = component.children || [];

    const variant = (props.variant as string) || 'default';
    const title = (props.title as string) || '';
    const description = (props.description as string) || '';
    const footer = (props.footer as string) || '';

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['box', 'size', 'spacing', 'position']);

    // Build element-specific styles
    const titleStyle = buildElementStyles(props, 'title');
    const descriptionStyle = buildElementStyles(props, 'description');
    const footerStyle = buildElementStyles(props, 'footer');

    const cardClasses = [
        styles.card,
        variant !== 'default' && styles[`card--${variant}`],
    ].filter(Boolean).join(' ');

    const cardStyle: React.CSSProperties = {
        ...sharedStyles,
    };

    return (
        <div className={cardClasses} style={cardStyle} data-component-id={component.id}>
            {title && (
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle} style={titleStyle}>{title}</h3>
                    {description && (
                        <p className={styles.cardDescription} style={descriptionStyle}>{description}</p>
                    )}
                </div>
            )}
            <div className={styles.cardContent}>
                {children.length > 0 ? (
                    children.map((child) => (
                        <ComponentRenderer
                            key={child.id}
                            component={child}
                            context={context}
                        />
                    ))
                ) : (
                    context === 'editor' && (
                        <p className={styles.placeholder}>Add content here</p>
                    )
                )}
            </div>
            {footer && (
                <div className={styles.cardFooter} style={footerStyle}>
                    <p>{footer}</p>
                </div>
            )}
        </div>
    );
};

export default CardRenderer;

