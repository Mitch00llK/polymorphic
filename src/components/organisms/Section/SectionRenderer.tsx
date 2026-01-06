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
 * Maps vertical/horizontal align to CSS flexbox properties.
 */
const mapAlignToFlex = (align?: string): string => {
    switch (align) {
        case 'start': return 'flex-start';
        case 'center': return 'center';
        case 'end': return 'flex-end';
        case 'stretch': return 'stretch';
        case 'between': return 'space-between';
        case 'around': return 'space-around';
        default: return 'center';
    }
};

/**
 * Renders a Section layout component.
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({
    component,
    context,
}) => {
    const props = (component.props || {}) as StyleableProps;
    const children = component.children || [];

    // Build styles from shared control groups (same as marketing blocks)
    const sharedStyles = buildStyles(props, ['layout', 'box', 'size', 'spacing', 'position']);

    // Section-specific props (legacy support)
    const verticalAlign = props.verticalAlign as string;
    const horizontalAlign = props.horizontalAlign as string;

    // Build section styles
    const style: React.CSSProperties = {
        ...sharedStyles,
        // Layout defaults
        display: sharedStyles.display || 'flex',
        flexDirection: sharedStyles.flexDirection || (props.direction as string) || 'column',
        justifyContent: sharedStyles.justifyContent || mapAlignToFlex(verticalAlign),
        alignItems: sharedStyles.alignItems || mapAlignToFlex(horizontalAlign),
        gap: sharedStyles.gap || (props.gap as string) || undefined,
        flexWrap: sharedStyles.flexWrap || 'nowrap',
        // Size defaults
        width: sharedStyles.width || '100%',
        minHeight: sharedStyles.minHeight || (props.minHeight as string) || undefined,
        // Spacing defaults
        paddingTop: sharedStyles.paddingTop || '60px',
        paddingRight: sharedStyles.paddingRight || '20px',
        paddingBottom: sharedStyles.paddingBottom || '60px',
        paddingLeft: sharedStyles.paddingLeft || '20px',
    };

    return (
        <section
            className={styles.section}
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
            ) : context === 'editor' ? (
                <div className={styles.emptySection}>
                    <span>+ Add content to this section</span>
                </div>
            ) : null}
        </section>
    );
};

export default SectionRenderer;
