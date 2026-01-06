/**
 * Features Block Renderer
 *
 * A grid of feature cards with icons, titles, and descriptions.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import { Zap, Shield, Rocket, Star, Heart, Globe } from 'lucide-react';
import type { ComponentData } from '../../types/components';
import { buildStyles, type StyleableProps } from '../../utils/styleBuilder';
import styles from './blocks.module.css';

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface FeaturesBlockRendererProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

const iconMap: Record<string, React.FC<{ size?: number }>> = {
    zap: Zap,
    shield: Shield,
    rocket: Rocket,
    star: Star,
    heart: Heart,
    globe: Globe,
};

export const FeaturesBlockRenderer: React.FC<FeaturesBlockRendererProps> = ({
    component,
}) => {
    const props = component.props as StyleableProps || {};

    const title = (props.title as string) || 'Why Choose Us';
    const subtitle = (props.subtitle as string) || 'Everything you need to build amazing websites';
    const columns = (props.columns as number) || 3;

    const features = (props.features as Feature[]) || [
        { icon: 'zap', title: 'Lightning Fast', description: 'Optimized for speed and performance' },
        { icon: 'shield', title: 'Secure', description: 'Built with security best practices' },
        { icon: 'rocket', title: 'Easy to Use', description: 'Intuitive drag-and-drop interface' },
    ];

    // Build styles from shared control groups
    const sharedStyles = buildStyles(props, ['layout', 'typography', 'box', 'spacing']);

    const blockStyle: React.CSSProperties = {
        ...sharedStyles,
    };

    // Typography styles for title/subtitle
    const textStyle: React.CSSProperties = {
        fontFamily: sharedStyles.fontFamily,
        color: sharedStyles.color,
    };

    return (
        <section className={styles.featuresBlock} style={blockStyle} data-component-id={component.id}>
            <div className={styles.featuresHeader}>
                <h2 className={styles.featuresTitle} style={textStyle}>{title}</h2>
                <p className={styles.featuresSubtitle} style={{ color: sharedStyles.color }}>{subtitle}</p>
            </div>
            <div
                className={styles.featuresGrid}
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
                {features.map((feature, index) => {
                    const IconComponent = iconMap[feature.icon] || Zap;
                    return (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <IconComponent size={24} />
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FeaturesBlockRenderer;
