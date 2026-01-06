/**
 * Section Renderer
 *
 * A full-width layout container that spans the entire viewport.
 * Supports ALL control groups for maximum customization.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { buildAllStyles, type StyleableProps } from '../../../utils/styleBuilder';

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

    // Build ALL styles from ALL control groups
    const allStyles = buildAllStyles(props);

    // Section-specific props (legacy support)
    const verticalAlign = props.verticalAlign as string;
    const horizontalAlign = props.horizontalAlign as string;
    const direction = props.direction as string;

    // Build section styles with defaults
    const style: React.CSSProperties = {
        ...allStyles,
        // Layout defaults (if not set via PropertyPanel)
        display: allStyles.display || 'flex',
        flexDirection: allStyles.flexDirection || direction || 'column',
        justifyContent: allStyles.justifyContent || mapAlignToFlex(verticalAlign),
        alignItems: allStyles.alignItems || mapAlignToFlex(horizontalAlign),
        gap: allStyles.gap || (props.gap as string) || undefined,
        flexWrap: allStyles.flexWrap || 'nowrap',
        // Size defaults
        width: allStyles.width || '100%',
        minHeight: allStyles.minHeight || (props.minHeight as string) || undefined,
        // Spacing defaults
        paddingTop: allStyles.paddingTop || '60px',
        paddingRight: allStyles.paddingRight || '20px',
        paddingBottom: allStyles.paddingBottom || '60px',
        paddingLeft: allStyles.paddingLeft || '20px',
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
