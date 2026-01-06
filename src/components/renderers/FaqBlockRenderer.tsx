/**
 * FAQ Block Renderer
 *
 * A FAQ section with title and accordion items.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { ComponentData } from '../../types/components';
import { buildStyles, buildElementStyles, type StyleableProps } from '../../utils/styleBuilder';
import styles from './blocks.module.css';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqBlockRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const FaqBlockRenderer: React.FC<FaqBlockRendererProps> = ({
    component,
}) => {
    const props = component.props as StyleableProps || {};

    const title = (props.title as string) || 'Frequently Asked Questions';
    const subtitle = (props.subtitle as string) || 'Find answers to common questions';

    const items = (props.items as FaqItem[]) || [
        { question: 'How do I get started?', answer: 'Simply sign up for an account and start building your first page using our drag-and-drop editor.' },
        { question: 'Can I use my own domain?', answer: 'Yes! You can connect your custom domain to any plan. Pro and Enterprise plans include free SSL certificates.' },
        { question: 'Is there a free trial?', answer: 'We offer a 14-day free trial on all plans. No credit card required to get started.' },
        { question: 'How do I cancel my subscription?', answer: 'You can cancel your subscription at any time from your account settings. Your access continues until the end of your billing period.' },
    ];

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['layout', 'typography', 'box', 'spacing']);

    // Build element-specific styles
    const sectionTitleStyle = buildElementStyles(props, 'sectionTitle');
    const sectionSubtitleStyle = buildElementStyles(props, 'sectionSubtitle');
    const questionStyle = buildElementStyles(props, 'question');
    const answerStyle = buildElementStyles(props, 'answer');

    const blockStyle: React.CSSProperties = {
        ...sharedStyles,
    };

    return (
        <section className={styles.faqBlock} style={blockStyle} data-component-id={component.id}>
            <div className={styles.faqHeader}>
                <h2 className={styles.faqTitle} style={sectionTitleStyle}>{title}</h2>
                <p className={styles.faqSubtitle} style={sectionSubtitleStyle}>{subtitle}</p>
            </div>
            <AccordionPrimitive.Root
                type="single"
                collapsible
                className={styles.faqAccordion}
            >
                {items.map((item, index) => (
                    <AccordionPrimitive.Item
                        key={index}
                        value={`item-${index}`}
                        className={styles.faqItem}
                    >
                        <AccordionPrimitive.Header>
                            <AccordionPrimitive.Trigger className={styles.faqTrigger} style={questionStyle}>
                                <span>{item.question}</span>
                                <ChevronDown className={styles.faqChevron} size={20} />
                            </AccordionPrimitive.Trigger>
                        </AccordionPrimitive.Header>
                        <AccordionPrimitive.Content className={styles.faqContent}>
                            <div className={styles.faqAnswer} style={answerStyle}>{item.answer}</div>
                        </AccordionPrimitive.Content>
                    </AccordionPrimitive.Item>
                ))}
            </AccordionPrimitive.Root>
        </section>
    );
};

export default FaqBlockRenderer;
