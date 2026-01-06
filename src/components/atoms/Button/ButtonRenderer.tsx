/**
 * Button Renderer
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../atoms.module.css';

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
    const props = component.props as StyleableProps || {};

    const text = (props.text as string) || 'Click Me';
    const url = (props.url as string) || '#';

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['typography', 'box', 'size', 'spacing', 'position']);

    // Component-specific styles
    const style: React.CSSProperties = {
        ...sharedStyles,
        // Handle text color specifically for buttons
        color: (props.textColor as string) || sharedStyles.color,
        // Full width handling
        display: props.fullWidth ? 'block' : 'inline-flex',
        width: props.fullWidth ? '100%' : sharedStyles.width,
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

