/**
 * Component Renderer Index
 *
 * Central registry for all component renderers.
 * Wraps components with SelectableElement in editor mode.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../types/components';
import { SelectableElement } from './builder/SelectableElement';
import { PHPComponentWrapper } from './PHPComponentWrapper';

// Atoms
import {
    HeadingRenderer,
    TextRenderer,
    ButtonRenderer,
    ImageRenderer,
    BadgeRenderer,
    AvatarRenderer,
    SeparatorRenderer,
} from './atoms';

// Molecules
import {
    CardRenderer,
    AlertRenderer,
    AccordionRenderer,
    TabsRenderer,
} from './molecules';

// Organisms
import {
    SectionRenderer,
    ContainerRenderer,
    HeroBlockRenderer,
    FeaturesBlockRenderer,
    PricingBlockRenderer,
    FaqBlockRenderer,
    CtaBlockRenderer,
} from './organisms';

// Auto-discovered components
import { GENERATED_RENDERERS } from '../generated/componentRegistry.generated';

/**
 * Context type - 'editor' for builder, 'preview' or 'frontend' for read-only.
 */
type RenderContext = 'editor' | 'preview' | 'frontend';

/**
 * Base renderer props type.
 */
interface RendererProps {
    component: ComponentData;
    context?: RenderContext;
}

/**
 * Core component renderers (manually defined).
 */
const CORE_RENDERERS: Record<string, React.FC<RendererProps>> = {
    // Layout (Organisms)
    section: SectionRenderer as React.FC<RendererProps>,
    container: ContainerRenderer as React.FC<RendererProps>,

    // Content (Atoms)
    heading: HeadingRenderer as React.FC<RendererProps>,
    text: TextRenderer as React.FC<RendererProps>,
    image: ImageRenderer as React.FC<RendererProps>,
    button: ButtonRenderer as React.FC<RendererProps>,
    badge: BadgeRenderer as React.FC<RendererProps>,
    avatar: AvatarRenderer as React.FC<RendererProps>,
    separator: SeparatorRenderer as React.FC<RendererProps>,

    // UI Components (Molecules)
    card: CardRenderer as React.FC<RendererProps>,
    accordion: AccordionRenderer as React.FC<RendererProps>,
    tabs: TabsRenderer as React.FC<RendererProps>,
    alert: AlertRenderer as React.FC<RendererProps>,

    // Marketing Blocks (Organisms)
    heroBlock: HeroBlockRenderer as React.FC<RendererProps>,
    featuresBlock: FeaturesBlockRenderer as React.FC<RendererProps>,
    pricingBlock: PricingBlockRenderer as React.FC<RendererProps>,
    faqBlock: FaqBlockRenderer as React.FC<RendererProps>,
    ctaBlock: CtaBlockRenderer as React.FC<RendererProps>,
};

/**
 * Merged renderers: core + auto-discovered.
 */
const renderers: Record<string, React.FC<RendererProps>> = {
    ...CORE_RENDERERS,
    ...GENERATED_RENDERERS,
};

/**
 * Props for ComponentRenderer.
 */
interface ComponentRendererProps {
    component: ComponentData;
    context?: RenderContext;
}

/**
 * Renders a component based on its type.
 * In editor mode, wraps with SelectableElement for selection UI.
 */
export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
    component,
    context = 'editor',
}) => {
    const Renderer = renderers[component.type];

    // Use PHPComponentWrapper for third-party components without React renderers
    if (!Renderer) {
        // Check if it's a third-party component (contains slash like 'test/counter')
        if (component.type.includes('/')) {
            if (context === 'editor') {
                return (
                    <SelectableElement
                        componentId={component.id}
                        componentType={component.type}
                        context={context}
                    >
                        <PHPComponentWrapper component={component} context={context} />
                    </SelectableElement>
                );
            }
            return <PHPComponentWrapper component={component} context={context} />;
        }

        return (
            <div className="component-unknown">
                Unknown component type: {component.type}
            </div>
        );
    }

    // In editor mode, wrap with SelectableElement
    if (context === 'editor') {
        return (
            <SelectableElement
                componentId={component.id}
                componentType={component.type}
                context={context}
            >
                <Renderer component={component} context={context} />
            </SelectableElement>
        );
    }

    // In preview/frontend mode, render directly
    return <Renderer component={component} context={context} />;
};

/**
 * Renders children components recursively.
 */
export const renderChildren = (
    children: ComponentData[] | undefined,
    context: RenderContext = 'editor'
): React.ReactNode => {
    if (!children || children.length === 0) {
        return null;
    }

    return children.map((child) => (
        <ComponentRenderer key={child.id} component={child} context={context} />
    ));
};

export default ComponentRenderer;
