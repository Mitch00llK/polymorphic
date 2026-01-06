/**
 * Testimonial Block Manifest
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { ComponentManifest } from '../../../types/manifest';

export const manifest: ComponentManifest = {
    type: 'testimonialBlock',
    label: 'Testimonials',
    icon: 'Quote',
    category: 'blocks',
    phpClass: 'Polymorphic\\Components\\TestimonialBlock\\Testimonial_Block',
    supportsChildren: false,
    defaultProps: {
        title: 'What our customers say',
        subtitle: 'Trusted by thousands of happy users',
    },
    css: `
.poly-testimonial-block {
    width: 100%;
    padding-top: var(--poly-padding-top, 80px);
    padding-bottom: var(--poly-padding-bottom, 80px);
    padding-left: var(--poly-padding-left, 20px);
    padding-right: var(--poly-padding-right, 20px);
    background-color: var(--poly-background-color, #f9fafb);
}
.poly-testimonial-block__header { text-align: center; margin-bottom: 3rem; }
.poly-testimonial-block__title { margin: 0 0 1rem 0; font-size: 2rem; font-weight: 700; color: var(--poly-color, #111827); }
.poly-testimonial-block__subtitle { margin: 0; font-size: 1.125rem; color: #6b7280; }
.poly-testimonial-block__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.poly-testimonial-card { background: #fff; padding: 2rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 1.5rem; }
.poly-testimonial-card__content { font-size: 1.125rem; line-height: 1.6; color: #374151; font-style: italic; }
.poly-testimonial-card__author { display: flex; align-items: center; gap: 1rem; margin-top: auto; }
.poly-testimonial-card__avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; background: #e5e7eb; }
.poly-testimonial-card__info { display: flex; flex-direction: column; }
.poly-testimonial-card__name { font-weight: 600; color: #111827; }
.poly-testimonial-card__role { font-size: 0.875rem; color: #6b7280; }
.poly-testimonial-card__rating { display: flex; gap: 2px; color: #f59e0b; }
@media (max-width: 768px) { .poly-testimonial-block__grid { grid-template-columns: 1fr; } }
`,
};

export default manifest;
