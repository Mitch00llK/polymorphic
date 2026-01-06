/**
 * Card Renderer
 *
 * Supports ALL control groups for maximum customization.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { buildAllStyles, buildElementStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../molecules.module.css';

interface PaddingObject {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

interface CardRendererProps {
    component: ComponentData;
    context?: 'editor' | 'preview';
}

/**
 * Renders a Card component.
 */
export const CardRenderer: React.FC<CardRendererProps> = ({
    component,
    context = 'preview',
}) => {
    const props = (component.props || {}) as StyleableProps;
    const children = component.children || [];

    const title = props.title as string;
    const description = props.description as string;
    const footer = props.footer as string;
    const showHeader = props.showHeader !== false;
    const showFooter = props.showFooter !== false;
    const variant = (props.variant as string) || 'default';

    // Build ALL styles from ALL control groups
    const allStyles = buildAllStyles(props);

    // Build element-specific styles
    const titleStyle = buildElementStyles(props, 'title');
    const descriptionStyle = buildElementStyles(props, 'description');
    const footerStyle = buildElementStyles(props, 'footer');

    // Legacy padding support (object format from templates)
    const legacyPadding = props.padding as PaddingObject | string | undefined;
    let paddingStyles: React.CSSProperties = {};
    if (!allStyles.paddingTop && !allStyles.paddingRight && 
        !allStyles.paddingBottom && !allStyles.paddingLeft) {
        if (legacyPadding) {
            if (typeof legacyPadding === 'object') {
                paddingStyles = {
                    paddingTop: legacyPadding.top || '24px',
                    paddingRight: legacyPadding.right || '24px',
                    paddingBottom: legacyPadding.bottom || '24px',
                    paddingLeft: legacyPadding.left || '24px',
                };
            } else {
                paddingStyles = { padding: legacyPadding };
            }
        } else {
            paddingStyles = { padding: '24px' };
        }
    }

    // Card styles
    const cardStyle: React.CSSProperties = {
        ...allStyles,
        boxSizing: 'border-box',
        // Defaults
        backgroundColor: allStyles.backgroundColor || '#ffffff',
        borderRadius: allStyles.borderRadius || '8px',
        ...paddingStyles,
    };

    // Handle border default
    if (!allStyles.borderWidth && !allStyles.borderColor && variant !== 'ghost') {
        cardStyle.border = '1px solid #e5e7eb';
    }

    // Variant-specific styles
    switch (variant) {
        case 'ghost':
            cardStyle.backgroundColor = 'transparent';
            cardStyle.border = 'none';
            cardStyle.boxShadow = 'none';
            break;
        case 'elevated':
            cardStyle.boxShadow = allStyles.boxShadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            break;
    }

    // Title default styles
    const finalTitleStyle: React.CSSProperties = {
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: '600',
        lineHeight: '1.4',
        marginBottom: '0.5rem',
        ...titleStyle,
    };

    // Description default styles
    const finalDescriptionStyle: React.CSSProperties = {
        margin: 0,
        fontSize: '0.875rem',
        lineHeight: '1.5',
        color: '#6b7280',
        ...descriptionStyle,
    };

    // Footer default styles
    const finalFooterStyle: React.CSSProperties = {
        fontSize: '0.875rem',
        lineHeight: '1.5',
        color: '#6b7280',
        marginTop: '1rem',
        ...footerStyle,
    };

    return (
        <div
            className={styles.card}
            style={cardStyle}
            data-component-id={component.id}
        >
            {showHeader && title && (
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle} style={finalTitleStyle}>{title}</h3>
                    {description && (
                        <p className={styles.cardDescription} style={finalDescriptionStyle}>{description}</p>
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
                ) : context === 'editor' ? (
                    <p className={styles.placeholder}>Add content here</p>
                ) : null}
            </div>
            {showFooter && footer && (
                <div className={styles.cardFooter} style={finalFooterStyle}>
                    <p style={{ margin: 0 }}>{footer}</p>
                </div>
            )}
        </div>
    );
};

export default CardRenderer;
