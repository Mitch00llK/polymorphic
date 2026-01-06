/**
 * Template Library Data
 *
 * Pre-built page templates for quick starting points.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { ComponentData } from '../types/components';

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

/**
 * Pre-built templates library.
 */
export const TEMPLATES: Template[] = [
    // ─────────────────────────────────────────────────────────────────────────────
    // LANDING PAGES
    // ─────────────────────────────────────────────────────────────────────────────
    {
        id: 'hero-simple',
        name: 'Simple Hero',
        description: 'A clean hero section with heading, text, and CTA button.',
        category: 'landing',
        thumbnail: '',
        tags: ['hero', 'simple', 'cta'],
        components: [
            {
                id: 'tpl-hero-section',
                type: 'section',
                props: {
                    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    paddingTop: '120px',
                    paddingBottom: '120px',
                },
                children: [
                    {
                        id: 'tpl-hero-container',
                        type: 'container',
                        props: {
                            maxWidth: '800px',
                            alignment: 'center',
                            direction: 'column',
                            gap: '24px',
                        },
                        children: [
                            {
                                id: 'tpl-hero-heading',
                                type: 'heading',
                                props: {
                                    content: 'Build Beautiful Pages in Minutes',
                                    tag: 'h1',
                                    textAlign: 'center',
                                    fontSize: '56px',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    lineHeight: '1.1',
                                },
                            },
                            {
                                id: 'tpl-hero-text',
                                type: 'text',
                                props: {
                                    content: 'The most intuitive page builder for WordPress. Create stunning layouts without writing a single line of code.',
                                    textAlign: 'center',
                                    fontSize: '20px',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    lineHeight: '1.6',
                                },
                            },
                            {
                                id: 'tpl-hero-button',
                                type: 'button',
                                props: {
                                    text: 'Get Started Free',
                                    variant: 'primary',
                                    size: 'lg',
                                    backgroundColor: '#ffffff',
                                    color: '#667eea',
                                    borderRadius: '50px',
                                    paddingLeft: '32px',
                                    paddingRight: '32px',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'hero-split',
        name: 'Split Hero',
        description: 'Hero section with image on one side and content on the other.',
        category: 'landing',
        thumbnail: '',
        tags: ['hero', 'split', 'image'],
        components: [
            {
                id: 'tpl-split-section',
                type: 'section',
                props: {
                    backgroundColor: '#f8fafc',
                    paddingTop: '80px',
                    paddingBottom: '80px',
                },
                children: [
                    {
                        id: 'tpl-split-container',
                        type: 'container',
                        props: {
                            maxWidth: '1200px',
                            alignment: 'center',
                            direction: 'row',
                            gap: '60px',
                            alignItems: 'center',
                        },
                        children: [
                            {
                                id: 'tpl-split-content',
                                type: 'container',
                                props: {
                                    direction: 'column',
                                    gap: '24px',
                                    width: '50%',
                                },
                                children: [
                                    {
                                        id: 'tpl-split-badge',
                                        type: 'badge',
                                        props: {
                                            text: 'New Release',
                                            variant: 'primary',
                                        },
                                    },
                                    {
                                        id: 'tpl-split-heading',
                                        type: 'heading',
                                        props: {
                                            content: 'The Future of Web Design is Here',
                                            tag: 'h1',
                                            fontSize: '48px',
                                            fontWeight: '700',
                                            color: '#1e293b',
                                            lineHeight: '1.2',
                                        },
                                    },
                                    {
                                        id: 'tpl-split-text',
                                        type: 'text',
                                        props: {
                                            content: 'Create professional websites without coding. Our drag-and-drop builder makes it easy for anyone to design stunning pages.',
                                            fontSize: '18px',
                                            color: '#64748b',
                                            lineHeight: '1.7',
                                        },
                                    },
                                    {
                                        id: 'tpl-split-buttons',
                                        type: 'container',
                                        props: {
                                            direction: 'row',
                                            gap: '16px',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-split-btn1',
                                                type: 'button',
                                                props: {
                                                    text: 'Start Building',
                                                    variant: 'primary',
                                                    size: 'lg',
                                                },
                                            },
                                            {
                                                id: 'tpl-split-btn2',
                                                type: 'button',
                                                props: {
                                                    text: 'Watch Demo',
                                                    variant: 'outline',
                                                    size: 'lg',
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'tpl-split-image',
                                type: 'image',
                                props: {
                                    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
                                    alt: 'Dashboard preview',
                                    borderRadius: '16px',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    width: '50%',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // MARKETING SECTIONS
    // ─────────────────────────────────────────────────────────────────────────────
    {
        id: 'features-grid',
        name: 'Features Grid',
        description: 'A 3-column grid showcasing product features.',
        category: 'marketing',
        thumbnail: '',
        tags: ['features', 'grid', 'cards'],
        components: [
            {
                id: 'tpl-features-section',
                type: 'section',
                props: {
                    backgroundColor: '#ffffff',
                    paddingTop: '100px',
                    paddingBottom: '100px',
                },
                children: [
                    {
                        id: 'tpl-features-container',
                        type: 'container',
                        props: {
                            maxWidth: '1200px',
                            alignment: 'center',
                            direction: 'column',
                            gap: '60px',
                        },
                        children: [
                            {
                                id: 'tpl-features-header',
                                type: 'container',
                                props: {
                                    direction: 'column',
                                    gap: '16px',
                                    maxWidth: '600px',
                                },
                                children: [
                                    {
                                        id: 'tpl-features-title',
                                        type: 'heading',
                                        props: {
                                            content: 'Everything You Need',
                                            tag: 'h2',
                                            textAlign: 'center',
                                            fontSize: '40px',
                                            fontWeight: '700',
                                            color: '#1e293b',
                                        },
                                    },
                                    {
                                        id: 'tpl-features-subtitle',
                                        type: 'text',
                                        props: {
                                            content: 'Powerful features to help you build and grow your online presence.',
                                            textAlign: 'center',
                                            fontSize: '18px',
                                            color: '#64748b',
                                        },
                                    },
                                ],
                            },
                            {
                                id: 'tpl-features-grid',
                                type: 'container',
                                props: {
                                    direction: 'row',
                                    gap: '32px',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                },
                                children: [
                                    {
                                        id: 'tpl-feature-card-1',
                                        type: 'card',
                                        props: {
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '16px',
                                            padding: '32px',
                                            width: '350px',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-feature-1-title',
                                                type: 'heading',
                                                props: {
                                                    content: '⚡ Lightning Fast',
                                                    tag: 'h3',
                                                    fontSize: '24px',
                                                    fontWeight: '600',
                                                    color: '#1e293b',
                                                    marginBottom: '12px',
                                                },
                                            },
                                            {
                                                id: 'tpl-feature-1-text',
                                                type: 'text',
                                                props: {
                                                    content: 'Optimized for speed with minimal load times. Your pages will fly.',
                                                    fontSize: '16px',
                                                    color: '#64748b',
                                                    lineHeight: '1.6',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        id: 'tpl-feature-card-2',
                                        type: 'card',
                                        props: {
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '16px',
                                            padding: '32px',
                                            width: '350px',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-feature-2-title',
                                                type: 'heading',
                                                props: {
                                                    content: '🎨 Fully Customizable',
                                                    tag: 'h3',
                                                    fontSize: '24px',
                                                    fontWeight: '600',
                                                    color: '#1e293b',
                                                    marginBottom: '12px',
                                                },
                                            },
                                            {
                                                id: 'tpl-feature-2-text',
                                                type: 'text',
                                                props: {
                                                    content: 'Every element is customizable. Match your brand perfectly.',
                                                    fontSize: '16px',
                                                    color: '#64748b',
                                                    lineHeight: '1.6',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        id: 'tpl-feature-card-3',
                                        type: 'card',
                                        props: {
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '16px',
                                            padding: '32px',
                                            width: '350px',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-feature-3-title',
                                                type: 'heading',
                                                props: {
                                                    content: '📱 Responsive Design',
                                                    tag: 'h3',
                                                    fontSize: '24px',
                                                    fontWeight: '600',
                                                    color: '#1e293b',
                                                    marginBottom: '12px',
                                                },
                                            },
                                            {
                                                id: 'tpl-feature-3-text',
                                                type: 'text',
                                                props: {
                                                    content: 'Looks perfect on any device. Mobile-first approach built in.',
                                                    fontSize: '16px',
                                                    color: '#64748b',
                                                    lineHeight: '1.6',
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'cta-banner',
        name: 'CTA Banner',
        description: 'A bold call-to-action section to drive conversions.',
        category: 'marketing',
        thumbnail: '',
        tags: ['cta', 'banner', 'conversion'],
        components: [
            {
                id: 'tpl-cta-section',
                type: 'section',
                props: {
                    backgroundColor: '#1e293b',
                    paddingTop: '80px',
                    paddingBottom: '80px',
                },
                children: [
                    {
                        id: 'tpl-cta-container',
                        type: 'container',
                        props: {
                            maxWidth: '900px',
                            alignment: 'center',
                            direction: 'column',
                            gap: '32px',
                        },
                        children: [
                            {
                                id: 'tpl-cta-heading',
                                type: 'heading',
                                props: {
                                    content: 'Ready to Get Started?',
                                    tag: 'h2',
                                    textAlign: 'center',
                                    fontSize: '44px',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                },
                            },
                            {
                                id: 'tpl-cta-text',
                                type: 'text',
                                props: {
                                    content: 'Join thousands of creators who are already building amazing websites with Polymorphic.',
                                    textAlign: 'center',
                                    fontSize: '20px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    lineHeight: '1.6',
                                },
                            },
                            {
                                id: 'tpl-cta-buttons',
                                type: 'container',
                                props: {
                                    direction: 'row',
                                    gap: '16px',
                                    justifyContent: 'center',
                                },
                                children: [
                                    {
                                        id: 'tpl-cta-btn1',
                                        type: 'button',
                                        props: {
                                            text: 'Start Free Trial',
                                            variant: 'primary',
                                            size: 'lg',
                                            backgroundColor: '#6366f1',
                                            borderRadius: '8px',
                                        },
                                    },
                                    {
                                        id: 'tpl-cta-btn2',
                                        type: 'button',
                                        props: {
                                            text: 'Contact Sales',
                                            variant: 'outline',
                                            size: 'lg',
                                            borderColor: 'rgba(255, 255, 255, 0.3)',
                                            color: '#ffffff',
                                            borderRadius: '8px',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'testimonials',
        name: 'Testimonials',
        description: 'Customer testimonials section with quotes.',
        category: 'marketing',
        thumbnail: '',
        tags: ['testimonials', 'social-proof', 'quotes'],
        components: [
            {
                id: 'tpl-testimonials-section',
                type: 'section',
                props: {
                    backgroundColor: '#f1f5f9',
                    paddingTop: '100px',
                    paddingBottom: '100px',
                },
                children: [
                    {
                        id: 'tpl-testimonials-container',
                        type: 'container',
                        props: {
                            maxWidth: '1200px',
                            alignment: 'center',
                            direction: 'column',
                            gap: '60px',
                        },
                        children: [
                            {
                                id: 'tpl-testimonials-header',
                                type: 'heading',
                                props: {
                                    content: 'Loved by Creators Worldwide',
                                    tag: 'h2',
                                    textAlign: 'center',
                                    fontSize: '40px',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                },
                            },
                            {
                                id: 'tpl-testimonials-grid',
                                type: 'container',
                                props: {
                                    direction: 'row',
                                    gap: '24px',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                },
                                children: [
                                    {
                                        id: 'tpl-testimonial-1',
                                        type: 'card',
                                        props: {
                                            backgroundColor: '#ffffff',
                                            borderRadius: '16px',
                                            padding: '32px',
                                            width: '380px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-testimonial-1-text',
                                                type: 'text',
                                                props: {
                                                    content: '"This builder has completely transformed how I create websites. It\'s intuitive, fast, and the results are stunning."',
                                                    fontSize: '16px',
                                                    color: '#475569',
                                                    lineHeight: '1.7',
                                                    fontStyle: 'italic',
                                                    marginBottom: '20px',
                                                },
                                            },
                                            {
                                                id: 'tpl-testimonial-1-author',
                                                type: 'text',
                                                props: {
                                                    content: '— Sarah Johnson, Designer',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#1e293b',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        id: 'tpl-testimonial-2',
                                        type: 'card',
                                        props: {
                                            backgroundColor: '#ffffff',
                                            borderRadius: '16px',
                                            padding: '32px',
                                            width: '380px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-testimonial-2-text',
                                                type: 'text',
                                                props: {
                                                    content: '"Finally, a page builder that doesn\'t slow down my site. The performance is incredible and my clients love the results."',
                                                    fontSize: '16px',
                                                    color: '#475569',
                                                    lineHeight: '1.7',
                                                    fontStyle: 'italic',
                                                    marginBottom: '20px',
                                                },
                                            },
                                            {
                                                id: 'tpl-testimonial-2-author',
                                                type: 'text',
                                                props: {
                                                    content: '— Mike Chen, Developer',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#1e293b',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        id: 'tpl-testimonial-3',
                                        type: 'card',
                                        props: {
                                            backgroundColor: '#ffffff',
                                            borderRadius: '16px',
                                            padding: '32px',
                                            width: '380px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-testimonial-3-text',
                                                type: 'text',
                                                props: {
                                                    content: '"I was able to redesign my entire website in a weekend. The templates gave me a great starting point."',
                                                    fontSize: '16px',
                                                    color: '#475569',
                                                    lineHeight: '1.7',
                                                    fontStyle: 'italic',
                                                    marginBottom: '20px',
                                                },
                                            },
                                            {
                                                id: 'tpl-testimonial-3-author',
                                                type: 'text',
                                                props: {
                                                    content: '— Emily Davis, Marketer',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#1e293b',
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // CONTENT SECTIONS
    // ─────────────────────────────────────────────────────────────────────────────
    {
        id: 'content-article',
        name: 'Article Layout',
        description: 'Clean layout for blog posts and articles.',
        category: 'content',
        thumbnail: '',
        tags: ['blog', 'article', 'content'],
        components: [
            {
                id: 'tpl-article-section',
                type: 'section',
                props: {
                    backgroundColor: '#ffffff',
                    paddingTop: '60px',
                    paddingBottom: '60px',
                },
                children: [
                    {
                        id: 'tpl-article-container',
                        type: 'container',
                        props: {
                            maxWidth: '720px',
                            alignment: 'center',
                            direction: 'column',
                            gap: '32px',
                        },
                        children: [
                            {
                                id: 'tpl-article-header',
                                type: 'container',
                                props: {
                                    direction: 'column',
                                    gap: '16px',
                                },
                                children: [
                                    {
                                        id: 'tpl-article-category',
                                        type: 'badge',
                                        props: {
                                            text: 'Tutorial',
                                            variant: 'secondary',
                                        },
                                    },
                                    {
                                        id: 'tpl-article-title',
                                        type: 'heading',
                                        props: {
                                            content: 'Getting Started with Page Building',
                                            tag: 'h1',
                                            fontSize: '42px',
                                            fontWeight: '700',
                                            color: '#1e293b',
                                            lineHeight: '1.2',
                                        },
                                    },
                                    {
                                        id: 'tpl-article-meta',
                                        type: 'text',
                                        props: {
                                            content: 'Published on January 15, 2024 • 5 min read',
                                            fontSize: '14px',
                                            color: '#94a3b8',
                                        },
                                    },
                                ],
                            },
                            {
                                id: 'tpl-article-image',
                                type: 'image',
                                props: {
                                    src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
                                    alt: 'Article featured image',
                                    borderRadius: '12px',
                                    width: '100%',
                                },
                            },
                            {
                                id: 'tpl-article-content',
                                type: 'container',
                                props: {
                                    direction: 'column',
                                    gap: '24px',
                                },
                                children: [
                                    {
                                        id: 'tpl-article-intro',
                                        type: 'text',
                                        props: {
                                            content: 'Building beautiful web pages has never been easier. In this guide, we\'ll walk you through the basics of using our page builder to create stunning layouts.',
                                            fontSize: '18px',
                                            color: '#475569',
                                            lineHeight: '1.8',
                                        },
                                    },
                                    {
                                        id: 'tpl-article-h2',
                                        type: 'heading',
                                        props: {
                                            content: 'Understanding the Interface',
                                            tag: 'h2',
                                            fontSize: '28px',
                                            fontWeight: '600',
                                            color: '#1e293b',
                                        },
                                    },
                                    {
                                        id: 'tpl-article-p1',
                                        type: 'text',
                                        props: {
                                            content: 'The builder interface is divided into three main areas: the sidebar, the canvas, and the property panel. The sidebar contains all available components, the canvas is where you build your page, and the property panel lets you customize selected elements.',
                                            fontSize: '16px',
                                            color: '#475569',
                                            lineHeight: '1.8',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // PORTFOLIO
    // ─────────────────────────────────────────────────────────────────────────────
    {
        id: 'portfolio-grid',
        name: 'Portfolio Grid',
        description: 'Showcase your work in a beautiful grid layout.',
        category: 'portfolio',
        thumbnail: '',
        tags: ['portfolio', 'gallery', 'projects'],
        components: [
            {
                id: 'tpl-portfolio-section',
                type: 'section',
                props: {
                    backgroundColor: '#0f172a',
                    paddingTop: '100px',
                    paddingBottom: '100px',
                },
                children: [
                    {
                        id: 'tpl-portfolio-container',
                        type: 'container',
                        props: {
                            maxWidth: '1200px',
                            alignment: 'center',
                            direction: 'column',
                            gap: '60px',
                        },
                        children: [
                            {
                                id: 'tpl-portfolio-header',
                                type: 'container',
                                props: {
                                    direction: 'column',
                                    gap: '16px',
                                },
                                children: [
                                    {
                                        id: 'tpl-portfolio-title',
                                        type: 'heading',
                                        props: {
                                            content: 'Selected Work',
                                            tag: 'h2',
                                            textAlign: 'center',
                                            fontSize: '48px',
                                            fontWeight: '700',
                                            color: '#ffffff',
                                        },
                                    },
                                    {
                                        id: 'tpl-portfolio-subtitle',
                                        type: 'text',
                                        props: {
                                            content: 'A collection of projects I\'m proud of',
                                            textAlign: 'center',
                                            fontSize: '18px',
                                            color: '#94a3b8',
                                        },
                                    },
                                ],
                            },
                            {
                                id: 'tpl-portfolio-grid',
                                type: 'container',
                                props: {
                                    direction: 'row',
                                    gap: '24px',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                },
                                children: [
                                    {
                                        id: 'tpl-project-1',
                                        type: 'card',
                                        props: {
                                            backgroundColor: '#1e293b',
                                            borderRadius: '16px',
                                            padding: '0',
                                            width: '380px',
                                            overflow: 'hidden',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-project-1-image',
                                                type: 'image',
                                                props: {
                                                    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
                                                    alt: 'Project 1',
                                                    width: '100%',
                                                },
                                            },
                                            {
                                                id: 'tpl-project-1-content',
                                                type: 'container',
                                                props: {
                                                    direction: 'column',
                                                    gap: '8px',
                                                    padding: '24px',
                                                },
                                                children: [
                                                    {
                                                        id: 'tpl-project-1-title',
                                                        type: 'heading',
                                                        props: {
                                                            content: 'E-commerce Platform',
                                                            tag: 'h3',
                                                            fontSize: '20px',
                                                            fontWeight: '600',
                                                            color: '#ffffff',
                                                        },
                                                    },
                                                    {
                                                        id: 'tpl-project-1-desc',
                                                        type: 'text',
                                                        props: {
                                                            content: 'Full-stack e-commerce solution with modern UI',
                                                            fontSize: '14px',
                                                            color: '#94a3b8',
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        id: 'tpl-project-2',
                                        type: 'card',
                                        props: {
                                            backgroundColor: '#1e293b',
                                            borderRadius: '16px',
                                            padding: '0',
                                            width: '380px',
                                            overflow: 'hidden',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-project-2-image',
                                                type: 'image',
                                                props: {
                                                    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
                                                    alt: 'Project 2',
                                                    width: '100%',
                                                },
                                            },
                                            {
                                                id: 'tpl-project-2-content',
                                                type: 'container',
                                                props: {
                                                    direction: 'column',
                                                    gap: '8px',
                                                    padding: '24px',
                                                },
                                                children: [
                                                    {
                                                        id: 'tpl-project-2-title',
                                                        type: 'heading',
                                                        props: {
                                                            content: 'Analytics Dashboard',
                                                            tag: 'h3',
                                                            fontSize: '20px',
                                                            fontWeight: '600',
                                                            color: '#ffffff',
                                                        },
                                                    },
                                                    {
                                                        id: 'tpl-project-2-desc',
                                                        type: 'text',
                                                        props: {
                                                            content: 'Real-time data visualization dashboard',
                                                            fontSize: '14px',
                                                            color: '#94a3b8',
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        id: 'tpl-project-3',
                                        type: 'card',
                                        props: {
                                            backgroundColor: '#1e293b',
                                            borderRadius: '16px',
                                            padding: '0',
                                            width: '380px',
                                            overflow: 'hidden',
                                        },
                                        children: [
                                            {
                                                id: 'tpl-project-3-image',
                                                type: 'image',
                                                props: {
                                                    src: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&h=250&fit=crop',
                                                    alt: 'Project 3',
                                                    width: '100%',
                                                },
                                            },
                                            {
                                                id: 'tpl-project-3-content',
                                                type: 'container',
                                                props: {
                                                    direction: 'column',
                                                    gap: '8px',
                                                    padding: '24px',
                                                },
                                                children: [
                                                    {
                                                        id: 'tpl-project-3-title',
                                                        type: 'heading',
                                                        props: {
                                                            content: 'Mobile App',
                                                            tag: 'h3',
                                                            fontSize: '20px',
                                                            fontWeight: '600',
                                                            color: '#ffffff',
                                                        },
                                                    },
                                                    {
                                                        id: 'tpl-project-3-desc',
                                                        type: 'text',
                                                        props: {
                                                            content: 'Cross-platform mobile application',
                                                            fontSize: '14px',
                                                            color: '#94a3b8',
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // BLANK
    // ─────────────────────────────────────────────────────────────────────────────
    {
        id: 'blank-section',
        name: 'Blank Section',
        description: 'Start with an empty section and container.',
        category: 'blank',
        thumbnail: '',
        tags: ['blank', 'empty', 'start'],
        components: [
            {
                id: 'tpl-blank-section',
                type: 'section',
                props: {
                    backgroundColor: '#ffffff',
                    paddingTop: '60px',
                    paddingBottom: '60px',
                },
                children: [
                    {
                        id: 'tpl-blank-container',
                        type: 'container',
                        props: {
                            maxWidth: '1200px',
                            alignment: 'center',
                            direction: 'column',
                            gap: '20px',
                        },
                        children: [],
                    },
                ],
            },
        ],
    },
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

