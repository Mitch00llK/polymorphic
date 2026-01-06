/**
 * Button Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';

import styles from './renderers.module.css';

interface ButtonRendererProps {
    component: ComponentData;
    context: 'editor' | 'preview';
}

/**
 * Renders a Button component in the editor/preview.
 */
export const ButtonRenderer: React.FC<ButtonRendererProps> = ({
    component,
    context,
}) => {
    const props = component.props || {};

    const text = props.text || 'Click Me';
    const url = props.url || '#';

    const style: React.CSSProperties = {
        backgroundColor: props.backgroundColor || undefined,
        color: props.textColor || undefined,
        borderColor: props.borderColor || undefined,
        borderRadius: props.borderRadius || undefined,
        fontSize: props.fontSize || undefined,
        fontWeight: props.fontWeight || undefined,
        paddingTop: props.paddingY || undefined,
        paddingBottom: props.paddingY || undefined,
        paddingLeft: props.paddingX || undefined,
        paddingRight: props.paddingX || undefined,
        marginTop: props.marginTop || undefined,
        marginBottom: props.marginBottom || undefined,
        display: props.fullWidth ? 'block' : 'inline-flex',
        width: props.fullWidth ? '100%' : undefined,
    };

    const classNames = [
        styles.btn,
        props.variant ? styles[`btn--${props.variant}`] : styles['btn--primary'],
        props.size && props.size !== 'default' ? styles[`btn--${props.size}`] : '',
        props.fullWidth ? styles['btn--full'] : '',
    ].filter(Boolean).join(' ');

    // In editor context, prevent link navigation.
    const handleClick = (e: React.MouseEvent) => {
        if (context === 'editor') {
            e.preventDefault();
        }
    };

    return (
        <a
            href={url}
            className={classNames}
            style={style}
            data-component-id={component.id}
            onClick={handleClick}
        >
            <span className={styles.btnText}>{text}</span>
        </a>
    );
};

export default ButtonRenderer;
