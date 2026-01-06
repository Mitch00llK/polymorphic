/**
 * Avatar Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';

import type { ComponentData } from '../../types/components';

import styles from './renderers.module.css';

interface AvatarRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
    component,
}) => {
    const props = component.props || {};

    const src = (props.src as string) || '';
    const alt = (props.alt as string) || 'Avatar';
    const fallback = (props.fallback as string) || 'U';
    const size = (props.size as string) || 'medium';

    const avatarClasses = [
        styles.avatar,
        styles[`avatar--${size}`],
    ].filter(Boolean).join(' ');

    return (
        <div className={avatarClasses} data-component-id={component.id}>
            {src ? (
                <img
                    className={styles.avatarImage}
                    src={src}
                    alt={alt}
                />
            ) : (
                <span className={styles.avatarFallback}>
                    {fallback.slice(0, 2).toUpperCase()}
                </span>
            )}
        </div>
    );
};

export default AvatarRenderer;
