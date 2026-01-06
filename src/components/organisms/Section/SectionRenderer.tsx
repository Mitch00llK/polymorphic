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

import styles from '../organisms.module.css';

interface SectionProps {
    width?: 'full' | 'boxed';
    minHeight?: string;
    verticalAlign?: 'start' | 'center' | 'end' | 'stretch';
    horizontalAlign?: 'start' | 'center' | 'end' | 'stretch';
    gap?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    marginTop?: string;
    marginBottom?: string;
}

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
    const props = (component.props || {}) as SectionProps;
    const children = component.children || [];

    // Build section styles
    const style: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: props.minHeight || undefined,
        justifyContent: mapAlignToFlex(props.verticalAlign),
        alignItems: mapAlignToFlex(props.horizontalAlign),
        gap: props.gap || undefined,
        backgroundColor: props.backgroundColor || undefined,
        backgroundImage: props.backgroundImage || undefined,
        backgroundSize: props.backgroundImage ? 'cover' : undefined,
        backgroundPosition: props.backgroundImage ? 'center' : undefined,
        paddingTop: props.paddingTop || '60px',
        paddingBottom: props.paddingBottom || '60px',
        paddingLeft: props.paddingLeft || '20px',
        paddingRight: props.paddingRight || '20px',
        marginTop: props.marginTop || undefined,
        marginBottom: props.marginBottom || undefined,
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
