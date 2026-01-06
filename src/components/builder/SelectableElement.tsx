/**
 * Selectable Element Wrapper
 *
 * Wraps any component element to make it selectable in the editor.
 * Shows a selection frame when the element is selected.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { useBuilderStore } from '../../store/builderStore';

import styles from './SelectableElement.module.css';

interface SelectableElementProps {
    /** The component ID this element belongs to */
    componentId: string;
    /** The component type for display */
    componentType: string;
    /** Children to render */
    children: React.ReactNode;
    /** Optional className to apply to the wrapper */
    className?: string;
    /** Optional style to apply to the wrapper */
    style?: React.CSSProperties;
    /** HTML element to render as (default: div) */
    as?: keyof JSX.IntrinsicElements;
    /** Whether this is in editor context */
    context?: 'editor' | 'preview';
}

/**
 * Wraps a component to make it selectable in the builder.
 * In preview mode, renders children directly without selection UI.
 */
export const SelectableElement: React.FC<SelectableElementProps> = ({
    componentId,
    componentType,
    children,
    className = '',
    style,
    as: Element = 'div',
    context = 'editor',
}) => {
    const { selectedId, selectComponent } = useBuilderStore();
    const isSelected = selectedId === componentId;

    // In preview mode, render without selection wrapper
    if (context === 'preview') {
        return (
            <Element className={className} style={style} data-component-id={componentId}>
                {children}
            </Element>
        );
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectComponent(componentId);
    };

    const wrapperClasses = [
        styles.selectableElement,
        isSelected && styles.isSelected,
        className,
    ].filter(Boolean).join(' ');

    return (
        <Element
            className={wrapperClasses}
            style={style}
            onClick={handleClick}
            data-component-id={componentId}
            data-component-type={componentType}
        >
            {children}

            {/* Selection frame */}
            {isSelected && (
                <div className={styles.selectionFrame}>
                    <span className={styles.selectionLabel}>{componentType}</span>
                </div>
            )}
        </Element>
    );
};

export default SelectableElement;

