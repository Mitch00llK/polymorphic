/**
 * Accordion Renderer Component
 *
 * Uses Radix UI Accordion primitives for accessibility.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import type { ComponentData } from '../../types/components';

import styles from './renderers.module.css';

interface AccordionItem {
    id: string;
    title: string;
    content: string;
}

interface AccordionRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const AccordionRenderer: React.FC<AccordionRendererProps> = ({
    component,
}) => {
    const props = component.props || {};

    const items = (props.items as AccordionItem[]) || [
        { id: '1', title: 'Accordion Item 1', content: 'Content for item 1' },
        { id: '2', title: 'Accordion Item 2', content: 'Content for item 2' },
    ];
    const type = (props.type as 'single' | 'multiple') || 'single';
    const defaultValue = (props.defaultValue as string) || items[0]?.id;

    return (
        <AccordionPrimitive.Root
            type={type}
            defaultValue={type === 'single' ? defaultValue : undefined}
            className={styles.accordion}
            data-component-id={component.id}
        >
            {items.map((item) => (
                <AccordionPrimitive.Item
                    key={item.id}
                    value={item.id}
                    className={styles.accordionItem}
                >
                    <AccordionPrimitive.Header className={styles.accordionHeader}>
                        <AccordionPrimitive.Trigger className={styles.accordionTrigger}>
                            <span>{item.title}</span>
                            <ChevronDown className={styles.accordionChevron} size={16} />
                        </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionPrimitive.Content className={styles.accordionContent}>
                        <div className={styles.accordionContentInner}>
                            {item.content}
                        </div>
                    </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
            ))}
        </AccordionPrimitive.Root>
    );
};

export default AccordionRenderer;
