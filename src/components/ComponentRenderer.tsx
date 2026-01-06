/**
 * Component Renderer Index
 *
 * Central registry for all component renderers.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../types/components';

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

/**
 * Component renderer map.
 */
const renderers: Record<string, React.FC<{ component: ComponentData; context: 'editor' | 'preview' }>> = {
    // Layout (Organisms)
    section: SectionRenderer,
    container: ContainerRenderer,

    // Content (Atoms)
    heading: HeadingRenderer,
    text: TextRenderer,
    image: ImageRenderer,
    button: ButtonRenderer,
    badge: BadgeRenderer,
    avatar: AvatarRenderer,
    separator: SeparatorRenderer,

    // UI Components (Molecules)
    card: CardRenderer,
    accordion: AccordionRenderer,
    tabs: TabsRenderer,
    alert: AlertRenderer,

    // Marketing Blocks (Organisms)
    heroBlock: HeroBlockRenderer,
    featuresBlock: FeaturesBlockRenderer,
    pricingBlock: PricingBlockRenderer,
    faqBlock: FaqBlockRenderer,
    ctaBlock: CtaBlockRenderer,
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

