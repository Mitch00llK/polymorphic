/**
 * Badge Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';

import type { ComponentData } from '../../types/components';

import styles from './renderers.module.css';

interface BadgeRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({
    component,
}) => {
    const props = component.props || {};

    const text = (props.text as string) || 'Badge';
    const variant = (props.variant as string) || 'default';

    const badgeClasses = [
        styles.badge,
        styles[`badge--${variant}`],
    ].filter(Boolean).join(' ');

    return (
        <span className={badgeClasses} data-component-id={component.id}>
            {text}
        </span>
    );
};

export default BadgeRenderer;
