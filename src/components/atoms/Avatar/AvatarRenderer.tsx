/**
 * Avatar Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';

import type { ComponentData } from '../../../types/components';
import { buildStyles, buildElementStyles, type StyleableProps } from '../../../utils/styleBuilder';

import styles from '../atoms.module.css';

interface AvatarRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
    component,
}) => {
    const props = component.props as StyleableProps || {};

    const src = (props.src as string) || '';
    const alt = (props.alt as string) || 'Avatar';
    const fallback = (props.fallback as string) || 'U';
    const size = (props.size as string) || 'medium';

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['size', 'box', 'spacing', 'position']);

    // Build fallback-specific styles
    const fallbackStyle = buildElementStyles(props, 'fallback');

    const avatarClasses = [
        styles.avatar,
        styles[`avatar--${size}`],
    ].filter(Boolean).join(' ');

    const avatarStyle: React.CSSProperties = {
        ...sharedStyles,
    };

    return (
        <div className={avatarClasses} style={avatarStyle} data-component-id={component.id}>
            {src ? (
                <img
                    className={styles.avatarImage}
                    src={src}
                    alt={alt}
                    style={{ objectFit: sharedStyles.objectFit }}
                />
            ) : (
                <span className={styles.avatarFallback} style={fallbackStyle}>
                    {fallback.slice(0, 2).toUpperCase()}
                </span>
            )}
        </div>
    );
};

export default AvatarRenderer;

