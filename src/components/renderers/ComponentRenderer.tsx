/**
 * Component Renderer Index
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../types/components';

// Layout components
import { SectionRenderer } from './SectionRenderer';
import { ContainerRenderer } from './ContainerRenderer';

// Content components
import { HeadingRenderer } from './HeadingRenderer';
import { TextRenderer } from './TextRenderer';
import { ImageRenderer } from './ImageRenderer';
import { ButtonRenderer } from './ButtonRenderer';

// UI components (shadcn-style)
import { CardRenderer } from './CardRenderer';
import { AccordionRenderer } from './AccordionRenderer';
import { TabsRenderer } from './TabsRenderer';
import { AlertRenderer } from './AlertRenderer';
import { BadgeRenderer } from './BadgeRenderer';
import { AvatarRenderer } from './AvatarRenderer';
import { SeparatorRenderer } from './SeparatorRenderer';

/**
 * Component renderer map.
 */
const renderers: Record<string, React.FC<{ component: ComponentData; context: 'editor' | 'preview' }>> = {
    // Layout
    section: SectionRenderer,
    container: ContainerRenderer,
    // Content
    heading: HeadingRenderer,
    text: TextRenderer,
    image: ImageRenderer,
    button: ButtonRenderer,
    // UI Components
    card: CardRenderer,
    accordion: AccordionRenderer,
    tabs: TabsRenderer,
    alert: AlertRenderer,
    badge: BadgeRenderer,
    avatar: AvatarRenderer,
    separator: SeparatorRenderer,
};

/**
 * Props for ComponentRenderer.
 */
interface ComponentRendererProps {
    component: ComponentData;
    context?: 'editor' | 'preview';
}

/**
 * Renders a component based on its type.
 */
export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
    component,
    context = 'editor',
}) => {
    const Renderer = renderers[component.type];

    if (!Renderer) {
        return (
            <div className="component-unknown">
                Unknown component type: {component.type}
            </div>
        );
    }

    return <Renderer component={component} context={context} />;
};

/**
 * Renders children components recursively.
 */
export const renderChildren = (
    children: ComponentData[] | undefined,
    context: 'editor' | 'preview' = 'editor'
): React.ReactNode => {
    if (!children || children.length === 0) {
        return null;
    }

    return children.map((child) => (
        <ComponentRenderer key={child.id} component={child} context={context} />
    ));
};

export default ComponentRenderer;
