/**
 * Templates Index
 *
 * Aggregates all template categories into a single export.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

// Types
export * from './types';

// Template collections
import { landingTemplates } from './landing';
import { marketingTemplates } from './marketing';
import { contentTemplates } from './content';
import { portfolioTemplates } from './portfolio';
import { blankTemplates } from './blank';

import type { Template, TemplateCategory } from './types';

/**
 * All templates combined.
 */
export const TEMPLATES: Template[] = [
    ...landingTemplates,
    ...marketingTemplates,
    ...contentTemplates,
    ...portfolioTemplates,
    ...blankTemplates,
];

/**
 * Get templates by category.
 */
export const getTemplatesByCategory = (category: TemplateCategory): Template[] => {
    return TEMPLATES.filter((t) => t.category === category);
};

/**
 * Search templates by name or tags.
 */
export const searchTemplates = (query: string): Template[] => {
    const lowerQuery = query.toLowerCase();
    return TEMPLATES.filter(
        (t) =>
            t.name.toLowerCase().includes(lowerQuery) ||
            t.description.toLowerCase().includes(lowerQuery) ||
            t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
};

/**
 * Get template by ID.
 */
export const getTemplateById = (id: string): Template | undefined => {
    return TEMPLATES.find((t) => t.id === id);
};

