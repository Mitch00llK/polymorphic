/**
 * Container Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';
import { renderChildren } from './ComponentRenderer';

import styles from './renderers.module.css';

interface ContainerRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Container component in the editor/preview.
 */
export const ContainerRenderer: React.FC<ContainerRendererProps> = ({
    component,
    context,
}) => {
    const props = component.props || {};

    const style: React.CSSProperties = {
        maxWidth: props.maxWidth || undefined,
        backgroundColor: props.backgroundColor || undefined,
        paddingTop: props.paddingTop || undefined,
        paddingBottom: props.paddingBottom || undefined,
        paddingLeft: props.paddingLeft || '1rem',
        paddingRight: props.paddingRight || '1rem',
        textAlign: (props.textAlign as React.CSSProperties['textAlign']) || undefined,
    };

    if (props.display === 'flex') {
        style.display = 'flex';
        style.flexDirection = props.flexDirection || 'column';
        style.justifyContent = props.justifyContent || 'flex-start';
        style.alignItems = props.alignItems || 'stretch';
        style.gap = props.gap || undefined;
    }

    const classNames = [
        styles.container,
        props.width && props.width !== 'default' ? styles[`container--${props.width}`] : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classNames}
            style={style}
            data-component-id={component.id}
        >
            {component.children && component.children.length > 0 ? (
                renderChildren(component.children, context)
            ) : (
                <div className={styles.dropZone}>
                    Drop components here
                </div>
            )}
        </div>
    );
};

export default ContainerRenderer;
