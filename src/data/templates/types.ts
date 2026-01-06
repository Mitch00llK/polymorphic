/**
 * Template Type Definitions
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { ComponentData } from '../../types/components';

export interface Template {
    id: string;
    name: string;
    description: string;
    category: TemplateCategory;
    thumbnail: string;
    components: ComponentData[];
    tags: string[];
}

export type TemplateCategory = 'landing' | 'marketing' | 'content' | 'ecommerce' | 'portfolio' | 'blank';

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, { label: string; description: string }> = {
    landing: { label: 'Landing Pages', description: 'High-converting landing page layouts' },
    marketing: { label: 'Marketing', description: 'Marketing and promotional sections' },
    content: { label: 'Content', description: 'Blog posts and article layouts' },
    ecommerce: { label: 'E-commerce', description: 'Product and shop layouts' },
    portfolio: { label: 'Portfolio', description: 'Showcase your work' },
    blank: { label: 'Blank', description: 'Start from scratch' },
};

