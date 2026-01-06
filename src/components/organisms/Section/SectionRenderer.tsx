/**
 * Section Renderer
 *
 * A full-width layout container that spans the entire viewport.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../organisms.module.css';

interface SectionRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Section layout component.
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({
    component,
    context,
}) => {
    const props = component.props as StyleableProps || {};
    const children = component.children || [];

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['layout', 'box', 'size', 'spacing']);

    // Section-specific defaults
    const style: React.CSSProperties = {
        ...sharedStyles,
        // Default to flex column layout
        display: sharedStyles.display || 'flex',
        flexDirection: sharedStyles.flexDirection || 'column',
        // Default padding
        padding: sharedStyles.paddingTop ? undefined : 'var(--polymorphic-spacing-8) var(--polymorphic-spacing-4)',
    };

    const sectionClasses = [
        styles.section,
    ].filter(Boolean).join(' ');

    return (
        <section
            className={sectionClasses}
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
                <div className={styles.emptySection}>
                    <span>+ Add content to this section</span>
                </div>
            )}
        </section>
    );
};

export default SectionRenderer;

