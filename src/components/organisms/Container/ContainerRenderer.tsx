/**
 * Container Renderer
 *
 * A width-constrained layout container for centering content.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../organisms.module.css';

interface ContainerRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Container layout component.
 */
export const ContainerRenderer: React.FC<ContainerRendererProps> = ({
    component,
    context,
}) => {
    const props = component.props as StyleableProps || {};
    const children = component.children || [];

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['layout', 'box', 'size', 'spacing']);

    // Container-specific defaults
    const style: React.CSSProperties = {
        ...sharedStyles,
        // Default to flex column layout
        display: sharedStyles.display || 'flex',
        flexDirection: sharedStyles.flexDirection || 'column',
        // Default max-width and centering
        maxWidth: sharedStyles.maxWidth || 'var(--polymorphic-container-width, 1200px)',
        marginLeft: sharedStyles.marginLeft || 'auto',
        marginRight: sharedStyles.marginRight || 'auto',
        width: sharedStyles.width || '100%',
    };

    const containerClasses = [
        styles.container,
    ].filter(Boolean).join(' ');

    return (
        <div
            className={containerClasses}
            style={style}
            data-component-id={component.id}
        >
            {children.length > 0 ? (
                children.map((child) => (
                    <ComponentRenderer
                        key={child.id}
                        component={child}
                        context={context}
                    />
                ))
            ) : (
                <div className={styles.emptyContainer}>
                    <span>+ Drop components here</span>
                </div>
            )}
        </div>
    );
};

export default ContainerRenderer;

