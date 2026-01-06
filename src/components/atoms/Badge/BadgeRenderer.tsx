/**
 * Badge Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';

import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../atoms.module.css';

interface BadgeRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({
    component,
}) => {
    const props = component.props as StyleableProps || {};

    const text = (props.text as string) || 'Badge';
    const variant = (props.variant as string) || 'default';

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['typography', 'box', 'spacing', 'position']);

    const badgeClasses = [
        styles.badge,
        styles[`badge--${variant}`],
    ].filter(Boolean).join(' ');

    const badgeStyle: React.CSSProperties = {
        ...sharedStyles,
    };

    return (
        <span className={badgeClasses} style={badgeStyle} data-component-id={component.id}>
            {text}
        </span>
    );
};

export default BadgeRenderer;

