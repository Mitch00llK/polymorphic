/**
 * Tabs Renderer Component
 *
 * Uses Radix UI Tabs primitives for accessibility.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import type { ComponentData } from '../../types/components';

import styles from './renderers.module.css';

interface TabItem {
    id: string;
    label: string;
    content: string;
}

interface TabsRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const TabsRenderer: React.FC<TabsRendererProps> = ({
    component,
}) => {
    const props = component.props || {};

    const tabs = (props.tabs as TabItem[]) || [
        { id: 'tab1', label: 'Tab 1', content: 'Content for Tab 1' },
        { id: 'tab2', label: 'Tab 2', content: 'Content for Tab 2' },
        { id: 'tab3', label: 'Tab 3', content: 'Content for Tab 3' },
    ];
    const defaultTab = (props.defaultTab as string) || tabs[0]?.id;

    return (
        <TabsPrimitive.Root
            defaultValue={defaultTab}
            className={styles.tabs}
            data-component-id={component.id}
        >
            <TabsPrimitive.List className={styles.tabsList}>
                {tabs.map((tab) => (
                    <TabsPrimitive.Trigger
                        key={tab.id}
                        value={tab.id}
                        className={styles.tabsTrigger}
                    >
                        {tab.label}
                    </TabsPrimitive.Trigger>
                ))}
            </TabsPrimitive.List>
            {tabs.map((tab) => (
                <TabsPrimitive.Content
                    key={tab.id}
                    value={tab.id}
                    className={styles.tabsContent}
                >
                    {tab.content}
                </TabsPrimitive.Content>
            ))}
        </TabsPrimitive.Root>
    );
};

export default TabsRenderer;
