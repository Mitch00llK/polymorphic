/**
 * Card Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';

import styles from '../molecules.module.css';

interface PaddingObject {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

interface CardProps {
    title?: string;
    description?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    variant?: 'default' | 'elevated' | 'outlined';
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    boxShadow?: string;
    padding?: PaddingObject | string;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
}

interface CardRendererProps {
    component: ComponentData;
    context?: 'editor' | 'preview';
}

export const CardRenderer: React.FC<CardRendererProps> = ({
    component,
    context = 'preview',
}) => {
    const props = (component.props || {}) as CardProps;
    const children = component.children || [];

    // Handle padding
    let paddingStyles: React.CSSProperties = {};
    if (props.padding) {
        if (typeof props.padding === 'object') {
            paddingStyles = {
                paddingTop: props.padding.top || '24px',
                paddingRight: props.padding.right || '24px',
                paddingBottom: props.padding.bottom || '24px',
                paddingLeft: props.padding.left || '24px',
            };
        } else {
            paddingStyles = { padding: props.padding };
        }
    } else {
        paddingStyles = { padding: '24px' };
    }

    const cardStyle: React.CSSProperties = {
        backgroundColor: props.backgroundColor || '#ffffff',
        borderRadius: props.borderRadius || '8px',
        boxShadow: props.boxShadow || undefined,
        width: props.width || undefined,
        minWidth: props.minWidth || undefined,
        maxWidth: props.maxWidth || undefined,
        ...paddingStyles,
    };

    // Handle border
    if (props.borderColor || props.borderWidth) {
        cardStyle.border = `${props.borderWidth || '1px'} solid ${props.borderColor || '#e5e7eb'}`;
    }

    return (
        <div
            className={styles.card}
            style={cardStyle}
            data-component-id={component.id}
        >
            {props.showHeader && props.title && (
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{props.title}</h3>
                    {props.description && (
                        <p className={styles.cardDescription}>{props.description}</p>
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
        </div>
    );
};

export default CardRenderer;
