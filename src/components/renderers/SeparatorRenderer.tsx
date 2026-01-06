/**
 * Separator Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';

import type { ComponentData } from '../../types/components';

import styles from './renderers.module.css';

interface SeparatorRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const SeparatorRenderer: React.FC<SeparatorRendererProps> = ({
    component,
}) => {
    const props = component.props || {};

    const orientation = (props.orientation as string) || 'horizontal';

    const separatorClasses = [
        styles.separator,
        styles[`separator--${orientation}`],
    ].filter(Boolean).join(' ');

    const separatorStyle: React.CSSProperties = {
        ...(props.color && { backgroundColor: props.color as string }),
        ...(props.margin && { margin: props.margin as string }),
    };

    return (
        <div
            className={separatorClasses}
            style={separatorStyle}
            role="separator"
            aria-orientation={orientation as 'horizontal' | 'vertical'}
            data-component-id={component.id}
        />
    );
};

export default SeparatorRenderer;
