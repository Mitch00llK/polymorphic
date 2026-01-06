/**
 * Separator Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';

import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../atoms.module.css';

interface SeparatorRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const SeparatorRenderer: React.FC<SeparatorRendererProps> = ({
    component,
}) => {
    const props = component.props as StyleableProps || {};

    const orientation = (props.orientation as string) || 'horizontal';
    const thickness = (props.thickness as string) || '1px';
    const separatorColor = (props.separatorColor as string) || '';

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['box', 'spacing', 'position']);

    const separatorClasses = [
        styles.separator,
        styles[`separator--${orientation}`],
    ].filter(Boolean).join(' ');

    const separatorStyle: React.CSSProperties = {
        ...sharedStyles,
        // Use separatorColor if set, otherwise fall back to backgroundColor
        backgroundColor: separatorColor || sharedStyles.backgroundColor,
        // Apply thickness based on orientation
        ...(orientation === 'horizontal'
            ? { height: thickness }
            : { width: thickness }
        ),
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

