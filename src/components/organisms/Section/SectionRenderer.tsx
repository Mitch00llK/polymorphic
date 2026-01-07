/**
 * Section Renderer
 *
 * A full-width layout container that spans the entire viewport.
 * Supports all PropertyPanel controls: layout, boxStyle, size, spacing.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { ComponentRenderer } from '../../ComponentRenderer';
import { useBuilderStore } from '../../../store/builderStore';

import styles from '../organisms.module.css';

interface SectionProps {
    // Layout
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    flexWrap?: string;
    // Legacy layout props (from templates)
    direction?: string;
    verticalAlign?: string;
    horizontalAlign?: string;

    // Box Style
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderRadius?: string;
    boxShadow?: string;
    opacity?: string;

    // Size
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    overflow?: string;

    // Spacing
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
}

interface SectionRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Maps align values to CSS flexbox.
 */
const mapAlignToFlex = (align?: string): string => {
    switch (align) {
        case 'start': return 'flex-start';
        case 'center': return 'center';
        case 'end': return 'flex-end';
        case 'stretch': return 'stretch';
        case 'between': return 'space-between';
        case 'around': return 'space-around';
        case 'evenly': return 'space-evenly';
        default: return align || 'flex-start';
    }
};

/**
 * Renders a Section layout component.
 * Uses store selector to ensure instant updates when props change.
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({
    component,
    context,
}) => {
    // Subscribe to this specific component's data from store for instant updates
    const liveComponent = useBuilderStore((state) => {
        const findById = (comps: ComponentData[], id: string): ComponentData | null => {
            for (const c of comps) {
                if (c.id === id) return c;
                if (c.children) {
                    const found = findById(c.children, id);
                    if (found) return found;
                }
            }
            return null;
        };
        return findById(state.components, component.id);
    });

    // Use live data from store if available, fallback to prop
    const currentComponent = liveComponent || component;
    const props = (currentComponent.props || {}) as SectionProps;
    const children = currentComponent.children || [];

    // Build section styles - supporting both PropertyPanel props and legacy template props
    const style: React.CSSProperties = {
        // Layout
        display: props.display || 'flex',
        flexDirection: (props.flexDirection || props.direction || 'column') as React.CSSProperties['flexDirection'],
        justifyContent: mapAlignToFlex(props.justifyContent || props.verticalAlign),
        alignItems: mapAlignToFlex(props.alignItems || props.horizontalAlign),
        gap: props.gap || undefined,
        flexWrap: (props.flexWrap || 'nowrap') as React.CSSProperties['flexWrap'],

        // Size
        width: props.width === 'full' ? '100%' : props.width || '100%',
        height: props.height || undefined,
        minWidth: props.minWidth || undefined,
        maxWidth: props.maxWidth || undefined,
        minHeight: props.minHeight || undefined,
        maxHeight: props.maxHeight || undefined,
        overflow: props.overflow as React.CSSProperties['overflow'] || undefined,

        // Box Style - Background
        backgroundColor: props.backgroundColor || undefined,
        backgroundSize: props.backgroundSize || (props.backgroundImage ? 'cover' : undefined),
        backgroundPosition: props.backgroundPosition || (props.backgroundImage ? 'center' : undefined),
        backgroundRepeat: props.backgroundRepeat || undefined,

        // Box Style - Border
        borderWidth: props.borderWidth || undefined,
        borderStyle: props.borderStyle as React.CSSProperties['borderStyle'] || (props.borderWidth ? 'solid' : undefined),
        borderColor: props.borderColor || undefined,
        borderRadius: props.borderRadius || undefined,

        // Box Style - Effects
        boxShadow: props.boxShadow || undefined,
        opacity: props.opacity ? parseFloat(props.opacity) : undefined,

        // Spacing
        paddingTop: props.paddingTop || '60px',
        paddingRight: props.paddingRight || '20px',
        paddingBottom: props.paddingBottom || '60px',
        paddingLeft: props.paddingLeft || '20px',
        marginTop: props.marginTop || undefined,
        marginRight: props.marginRight || undefined,
        marginBottom: props.marginBottom || undefined,
        marginLeft: props.marginLeft || undefined,
    };

    // Handle background image (supports gradients and URLs)
    if (props.backgroundImage) {
        if (props.backgroundImage.startsWith('linear-gradient') ||
            props.backgroundImage.startsWith('radial-gradient') ||
            props.backgroundImage.startsWith('url(')) {
            style.backgroundImage = props.backgroundImage;
        } else {
            style.backgroundImage = `url(${props.backgroundImage})`;
        }
    }

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
