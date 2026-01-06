/**
 * Pricing Block Renderer
 *
 * A pricing table with 2-3 pricing cards.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { Check } from 'lucide-react';
import type { ComponentData } from '../../types/components';
import { buildStyles, buildElementStyles, type StyleableProps } from '../../utils/styleBuilder';
import styles from './blocks.module.css';

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonUrl: string;
    featured: boolean;
}

interface PricingBlockRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const PricingBlockRenderer: React.FC<PricingBlockRendererProps> = ({
    component,
}) => {
    const props = component.props as StyleableProps || {};

    const title = (props.title as string) || 'Simple, Transparent Pricing';
    const subtitle = (props.subtitle as string) || 'Choose the plan that works for you';

    const plans = (props.plans as PricingPlan[]) || [
        {
            name: 'Starter',
            price: '$9',
            period: '/month',
            description: 'Perfect for small projects',
            features: ['5 pages', 'Basic components', 'Email support'],
            buttonText: 'Get Started',
            buttonUrl: '#',
            featured: false,
        },
        {
            name: 'Pro',
            price: '$29',
            period: '/month',
            description: 'Best for growing businesses',
            features: ['Unlimited pages', 'All components', 'Priority support', 'Custom domains'],
            buttonText: 'Get Started',
            buttonUrl: '#',
            featured: true,
        },
        {
            name: 'Enterprise',
            price: '$99',
            period: '/month',
            description: 'For large organizations',
            features: ['Everything in Pro', 'Custom integrations', 'SLA guarantee', 'Dedicated account manager'],
            buttonText: 'Contact Sales',
            buttonUrl: '#',
            featured: false,
        },
    ];

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['layout', 'typography', 'box', 'spacing']);

    // Build element-specific styles
    const sectionTitleStyle = buildElementStyles(props, 'sectionTitle');
    const sectionSubtitleStyle = buildElementStyles(props, 'sectionSubtitle');
    const planNameStyle = buildElementStyles(props, 'planName');
    const planPriceStyle = buildElementStyles(props, 'planPrice');
    const planDescriptionStyle = buildElementStyles(props, 'planDescription');

    const blockStyle: React.CSSProperties = {
        ...sharedStyles,
    };

    return (
        <section className={styles.pricingBlock} style={blockStyle} data-component-id={component.id}>
            <div className={styles.pricingHeader}>
                <h2 className={styles.pricingTitle} style={sectionTitleStyle}>{title}</h2>
                <p className={styles.pricingSubtitle} style={sectionSubtitleStyle}>{subtitle}</p>
            </div>
            <div className={styles.pricingGrid}>
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ''}`}
                    >
                        {plan.featured && <span className={styles.pricingBadge}>Most Popular</span>}
                        <h3 className={styles.pricingName} style={planNameStyle}>{plan.name}</h3>
                        <p className={styles.pricingDescription} style={planDescriptionStyle}>{plan.description}</p>
                        <div className={styles.pricingPrice} style={planPriceStyle}>
                            <span className={styles.pricingAmount}>{plan.price}</span>
                            <span className={styles.pricingPeriod}>{plan.period}</span>
                        </div>
                        <ul className={styles.pricingFeatures}>
                            {plan.features.map((feature, fIndex) => (
                                <li key={fIndex}>
                                    <Check size={16} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href={plan.buttonUrl}
                            className={plan.featured ? styles.pricingBtnPrimary : styles.pricingBtn}
                        >
                            {plan.buttonText}
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PricingBlockRenderer;
