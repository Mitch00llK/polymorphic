/**
 * Alert Renderer Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

import type { ComponentData } from '../../types/components';
import { buildStyles, buildElementStyles, type StyleableProps } from '../../utils/styleBuilder';

import styles from './renderers.module.css';

interface AlertRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

const variantIcons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    default: Info,
};

export const AlertRenderer: React.FC<AlertRendererProps> = ({
    component,
}) => {
    const props = component.props as StyleableProps || {};

    const variant = (props.variant as keyof typeof variantIcons) || 'default';
    const title = (props.title as string) || '';
    const description = (props.description as string) || '';

    const Icon = variantIcons[variant] || variantIcons.default;

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['typography', 'box', 'spacing', 'position']);

    // Build element-specific styles
    const titleStyle = buildElementStyles(props, 'title');
    const descriptionStyle = buildElementStyles(props, 'description');

    const alertClasses = [
        styles.alert,
        styles[`alert--${variant}`],
    ].filter(Boolean).join(' ');

    const alertStyle: React.CSSProperties = {
        ...sharedStyles,
    };

    return (
        <div
            className={alertClasses}
            style={alertStyle}
            role="alert"
            data-component-id={component.id}
        >
            <Icon className={styles.alertIcon} size={16} />
            <div className={styles.alertContent}>
                {title && <h5 className={styles.alertTitle} style={titleStyle}>{title}</h5>}
                {description && <p className={styles.alertDescription} style={descriptionStyle}>{description}</p>}
            </div>
        </div>
    );
};

export default AlertRenderer;
