/**
 * Section Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';
import { renderChildren } from './ComponentRenderer';

import styles from './renderers.module.css';

interface SectionRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Section component in the editor/preview.
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({
    component,
    context,
}) => {
    const props = component.props || {};

    const style: React.CSSProperties = {
        backgroundColor: props.backgroundColor || undefined,
        backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
        backgroundSize: props.backgroundSize || 'cover',
        backgroundPosition: props.backgroundPosition || 'center',
        paddingTop: props.paddingTop || '4rem',
        paddingBottom: props.paddingBottom || '4rem',
        minHeight: props.minHeight || undefined,
    };

    const classNames = [
        styles.section,
        props.style && props.style !== 'default' ? styles[`section--${props.style}`] : '',
    ].filter(Boolean).join(' ');

    return (
        <section
            className={classNames}
            style={style}
            data-component-id={component.id}
        >
            <div className={styles.sectionInner}>
                {component.children && component.children.length > 0 ? (
                    renderChildren(component.children, context)
                ) : (
                    <div className={styles.dropZone}>
                        Drop components here
                    </div>
                )}
            </div>
        </section>
    );
};

export default SectionRenderer;
