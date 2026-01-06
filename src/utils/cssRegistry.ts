/**
 * CSS Registry
 *
 * Stores and retrieves base CSS for component types.
 * CSS is generated per-page based on components used.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

/**
 * Registry of component CSS.
 * Key: component type, Value: base CSS string
 */
const componentCSS = new Map<string, string>();

/**
 * Register base CSS for a component type.
 */
export function registerComponentCSS(type: string, css: string): void {
    componentCSS.set(type, css.trim());
}

/**
 * Get base CSS for a set of component types.
 * Returns combined CSS for all requested types.
 */
export function getBaseCSS(types: Set<string>): string {
    const cssBlocks: string[] = [];

    for (const type of types) {
        const css = componentCSS.get(type);
        if (css) {
            cssBlocks.push(`/* ${type} */\n${css}`);
        }
    }

    return cssBlocks.join('\n\n');
}

/**
 * Get all registered component types.
 */
export function getRegisteredTypes(): string[] {
    return Array.from(componentCSS.keys());
}

/**
 * Check if a component type has registered CSS.
 */
export function hasCSS(type: string): boolean {
    return componentCSS.has(type);
}

// =============================================================================
// BASE CSS DEFINITIONS
// =============================================================================

// Base styles applied to all components
registerComponentCSS('_base', `
[data-component-id] {
    box-sizing: border-box;
}
`);

// Section
registerComponentCSS('section', `
.poly-section {
    position: relative;
    width: 100%;
    display: var(--poly-display, flex);
    flex-direction: var(--poly-flex-direction, column);
    justify-content: var(--poly-justify-content, center);
    align-items: var(--poly-align-items, center);
    gap: var(--poly-gap);
    flex-wrap: var(--poly-flex-wrap, nowrap);
    min-height: var(--poly-min-height);
    padding: var(--poly-padding);
    padding-top: var(--poly-padding-top, 60px);
    padding-right: var(--poly-padding-right, 20px);
    padding-bottom: var(--poly-padding-bottom, 60px);
    padding-left: var(--poly-padding-left, 20px);
    margin-top: var(--poly-margin-top);
    margin-bottom: var(--poly-margin-bottom);
    background-color: var(--poly-background-color);
    background-image: var(--poly-background-image);
    background-size: var(--poly-background-size, cover);
    background-position: var(--poly-background-position, center);
    background-repeat: var(--poly-background-repeat, no-repeat);
}
.poly-section__inner {
    width: 100%;
    max-width: var(--poly-max-width, 1200px);
}
`);

// Container
registerComponentCSS('container', `
.poly-container {
    display: var(--poly-display, flex);
    flex-direction: var(--poly-flex-direction, column);
    justify-content: var(--poly-justify-content, flex-start);
    align-items: var(--poly-align-items, stretch);
    gap: var(--poly-gap);
    flex-wrap: var(--poly-flex-wrap, nowrap);
    width: var(--poly-width, 100%);
    max-width: var(--poly-max-width, 1200px);
    margin-left: var(--poly-margin-left, auto);
    margin-right: var(--poly-margin-right, auto);
    margin-top: var(--poly-margin-top);
    margin-bottom: var(--poly-margin-bottom);
    padding: var(--poly-padding);
    padding-top: var(--poly-padding-top);
    padding-right: var(--poly-padding-right);
    padding-bottom: var(--poly-padding-bottom);
    padding-left: var(--poly-padding-left);
    background-color: var(--poly-background-color);
    border-radius: var(--poly-border-radius);
    box-shadow: var(--poly-box-shadow);
}
`);

// Heading
registerComponentCSS('heading', `
.poly-heading {
    margin: 0;
    font-family: var(--poly-font-family, inherit);
    font-size: var(--poly-font-size);
    font-weight: var(--poly-font-weight, 700);
    line-height: var(--poly-line-height, 1.2);
    letter-spacing: var(--poly-letter-spacing);
    text-transform: var(--poly-text-transform);
    text-align: var(--poly-text-align);
    font-style: var(--poly-font-style);
    text-decoration: var(--poly-text-decoration);
    color: var(--poly-color, inherit);
    margin-top: var(--poly-margin-top);
    margin-bottom: var(--poly-margin-bottom);
    margin-left: var(--poly-margin-left);
    margin-right: var(--poly-margin-right);
    background-color: var(--poly-background-color);
    padding: var(--poly-padding);
    border-radius: var(--poly-border-radius);
}
.poly-heading--h1 { font-size: var(--poly-font-size, 2.5rem); }
.poly-heading--h2 { font-size: var(--poly-font-size, 2rem); }
.poly-heading--h3 { font-size: var(--poly-font-size, 1.75rem); }
.poly-heading--h4 { font-size: var(--poly-font-size, 1.5rem); }
.poly-heading--h5 { font-size: var(--poly-font-size, 1.25rem); }
.poly-heading--h6 { font-size: var(--poly-font-size, 1rem); }
`);

// Text
registerComponentCSS('text', `
.poly-text {
    margin: 0;
    font-family: var(--poly-font-family, inherit);
    font-size: var(--poly-font-size, 1rem);
    font-weight: var(--poly-font-weight, 400);
    line-height: var(--poly-line-height, 1.6);
    letter-spacing: var(--poly-letter-spacing);
    text-transform: var(--poly-text-transform);
    text-align: var(--poly-text-align);
    font-style: var(--poly-font-style);
    text-decoration: var(--poly-text-decoration);
    color: var(--poly-color, inherit);
    margin-top: var(--poly-margin-top);
    margin-bottom: var(--poly-margin-bottom);
    margin-left: var(--poly-margin-left);
    margin-right: var(--poly-margin-right);
    column-count: var(--poly-column-count);
}
`);

// Button
registerComponentCSS('button', `
.poly-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: var(--poly-font-family, inherit);
    font-size: var(--poly-font-size, 0.9375rem);
    font-weight: var(--poly-font-weight, 500);
    line-height: var(--poly-line-height, 1.4);
    text-decoration: var(--poly-text-decoration, none);
    color: var(--poly-color, #fff);
    background-color: var(--poly-background-color, #6366f1);
    border: var(--poly-border-width, 0) var(--poly-border-style, solid) var(--poly-border-color, transparent);
    border-radius: var(--poly-border-radius, 6px);
    box-shadow: var(--poly-box-shadow);
    padding: var(--poly-padding, 10px 20px);
    width: var(--poly-width, auto);
    cursor: pointer;
    transition: all 0.2s ease;
}
.poly-button:hover { opacity: 0.9; transform: translateY(-1px); }
.poly-button--sm { padding: var(--poly-padding, 8px 16px); font-size: var(--poly-font-size, 0.875rem); }
.poly-button--lg { padding: var(--poly-padding, 14px 28px); font-size: var(--poly-font-size, 1rem); }
.poly-button--outline { background-color: transparent; color: var(--poly-color, var(--poly-border-color, #333)); border: 1px solid var(--poly-border-color, #333); }
.poly-button--ghost { background-color: transparent; color: var(--poly-color, #333); border: none; }
.poly-button--link { background-color: transparent; color: var(--poly-color, #6366f1); border: none; padding: 0; text-decoration: underline; }
`);

// Image
registerComponentCSS('image', `
.poly-image {
    display: block;
    margin: 0;
    max-width: var(--poly-max-width, 100%);
    width: var(--poly-width, 100%);
    margin-top: var(--poly-margin-top);
    margin-bottom: var(--poly-margin-bottom);
}
.poly-image img {
    display: block;
    width: 100%;
    height: var(--poly-height, auto);
    aspect-ratio: var(--poly-aspect-ratio);
    object-fit: var(--poly-object-fit, cover);
    border-radius: var(--poly-border-radius);
    box-shadow: var(--poly-box-shadow);
}
.poly-image--align-center { margin-left: auto; margin-right: auto; }
.poly-image--align-right { margin-left: auto; }
.poly-image__caption { margin-top: 0.5rem; font-size: 0.875rem; color: var(--poly-caption-color, #6b7280); text-align: var(--poly-caption-text-align, center); }
.poly-image__placeholder { display: flex; align-items: center; justify-content: center; min-height: 150px; background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: var(--poly-border-radius, 8px); color: #9ca3af; font-size: 0.875rem; }
`);

// Badge
registerComponentCSS('badge', `
.poly-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--poly-font-family, inherit);
    font-size: var(--poly-font-size, 0.75rem);
    font-weight: var(--poly-font-weight, 500);
    line-height: var(--poly-line-height, 1.4);
    color: var(--poly-color, #374151);
    background-color: var(--poly-background-color, #f3f4f6);
    border: var(--poly-border-width) var(--poly-border-style, solid) var(--poly-border-color);
    border-radius: var(--poly-border-radius, 9999px);
    padding: var(--poly-padding, 4px 12px);
}
.poly-badge--success { background-color: var(--poly-background-color, #22c55e); color: var(--poly-color, #fff); }
.poly-badge--warning { background-color: var(--poly-background-color, #f59e0b); color: var(--poly-color, #fff); }
.poly-badge--error { background-color: var(--poly-background-color, #ef4444); color: var(--poly-color, #fff); }
.poly-badge--info { background-color: var(--poly-background-color, #3b82f6); color: var(--poly-color, #fff); }
`);

// Avatar
registerComponentCSS('avatar', `
.poly-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--poly-width, 40px);
    height: var(--poly-height, 40px);
    border-radius: var(--poly-border-radius, 50%);
    background-color: var(--poly-background-color, #e5e7eb);
    overflow: hidden;
}
.poly-avatar img { width: 100%; height: 100%; object-fit: var(--poly-object-fit, cover); }
.poly-avatar__fallback { font-size: var(--poly-font-size, 1rem); font-weight: var(--poly-font-weight, 500); color: var(--poly-color, #374151); }
`);

// Separator
registerComponentCSS('separator', `
.poly-separator {
    width: var(--poly-width, 100%);
    height: var(--poly-height, 1px);
    background-color: var(--poly-background-color, #e5e7eb);
    border: none;
    margin: var(--poly-margin, 1rem 0);
    margin-top: var(--poly-margin-top);
    margin-bottom: var(--poly-margin-bottom);
}
.poly-separator--vertical { width: var(--poly-width, 1px); height: var(--poly-height, 100%); margin: var(--poly-margin, 0 1rem); }
`);

// Card
registerComponentCSS('card', `
.poly-card {
    box-sizing: border-box;
    background-color: var(--poly-background-color, #fff);
    border: var(--poly-border-width, 1px) var(--poly-border-style, solid) var(--poly-border-color, #e5e7eb);
    border-radius: var(--poly-border-radius, 8px);
    box-shadow: var(--poly-box-shadow);
    padding: var(--poly-padding, 24px);
    width: var(--poly-width);
    max-width: var(--poly-max-width);
    overflow: var(--poly-overflow, hidden);
}
.poly-card--ghost { background-color: transparent; border: none; box-shadow: none; }
.poly-card--elevated { box-shadow: var(--poly-box-shadow, 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)); }
.poly-card__header { margin-bottom: 1rem; }
.poly-card__title { margin: 0 0 0.5rem 0; font-size: var(--poly-title-font-size, 1.25rem); font-weight: var(--poly-title-font-weight, 600); line-height: var(--poly-title-line-height, 1.4); color: var(--poly-title-color, inherit); }
.poly-card__description { margin: 0; font-size: var(--poly-description-font-size, 0.875rem); line-height: var(--poly-description-line-height, 1.5); color: var(--poly-description-color, #6b7280); }
.poly-card__footer { margin-top: 1rem; font-size: var(--poly-footer-font-size, 0.875rem); color: var(--poly-footer-color, #6b7280); }
.poly-card__footer p { margin: 0; }
`);

// Alert
registerComponentCSS('alert', `
.poly-alert {
    display: flex;
    gap: 0.75rem;
    padding: var(--poly-padding, 1rem);
    background-color: var(--poly-background-color, #f3f4f6);
    border: var(--poly-border-width, 1px) var(--poly-border-style, solid) var(--poly-border-color, #e5e7eb);
    border-radius: var(--poly-border-radius, 8px);
    color: var(--poly-color, #374151);
}
.poly-alert--info { background-color: var(--poly-background-color, #eff6ff); border-color: var(--poly-border-color, #bfdbfe); color: var(--poly-color, #1e40af); }
.poly-alert--success { background-color: var(--poly-background-color, #f0fdf4); border-color: var(--poly-border-color, #bbf7d0); color: var(--poly-color, #166534); }
.poly-alert--warning { background-color: var(--poly-background-color, #fffbeb); border-color: var(--poly-border-color, #fde68a); color: var(--poly-color, #92400e); }
.poly-alert--error { background-color: var(--poly-background-color, #fef2f2); border-color: var(--poly-border-color, #fecaca); color: var(--poly-color, #991b1b); }
.poly-alert__title { margin: 0 0 0.25rem 0; font-weight: 600; font-size: var(--poly-title-font-size, 0.875rem); }
.poly-alert__description { margin: 0; font-size: var(--poly-description-font-size, 0.875rem); opacity: 0.9; }
`);

// Accordion
registerComponentCSS('accordion', `
.poly-accordion {
    width: 100%;
    background-color: var(--poly-background-color);
    border-radius: var(--poly-border-radius, 8px);
    margin-top: var(--poly-margin-top);
    margin-bottom: var(--poly-margin-bottom);
}
.poly-accordion__item { border-bottom: 1px solid var(--poly-border-color, #e5e7eb); }
.poly-accordion__item:last-child { border-bottom: none; }
.poly-accordion__header { margin: 0; }
.poly-accordion__trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 1rem; background: transparent; border: none; cursor: pointer; font-size: 1rem; font-weight: 500; text-align: left; color: inherit; }
.poly-accordion__trigger:hover { background-color: rgba(0,0,0,0.02); }
.poly-accordion__icon { transition: transform 0.2s ease; }
.poly-accordion__trigger[aria-expanded="true"] .poly-accordion__icon { transform: rotate(180deg); }
.poly-accordion__content { overflow: hidden; }
.poly-accordion__content[hidden] { display: none; }
.poly-accordion__content-inner { padding: 0 1rem 1rem; color: #6b7280; }
`);

// Tabs
registerComponentCSS('tabs', `
.poly-tabs {
    width: 100%;
    background-color: var(--poly-background-color);
    border-radius: var(--poly-border-radius);
    margin-top: var(--poly-margin-top);
    margin-bottom: var(--poly-margin-bottom);
}
.poly-tabs__list { display: flex; gap: 0.25rem; border-bottom: 1px solid var(--poly-border-color, #e5e7eb); padding: 0 0.5rem; }
.poly-tabs__trigger { padding: 0.75rem 1rem; background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 0.875rem; font-weight: 500; color: #6b7280; transition: all 0.2s ease; }
.poly-tabs__trigger:hover { color: #374151; }
.poly-tabs__trigger[aria-selected="true"] { color: #6366f1; border-bottom-color: #6366f1; }
.poly-tabs__content { padding: 1rem; }
.poly-tabs__content[hidden] { display: none; }
`);

// Hero Block
registerComponentCSS('heroBlock', `
.poly-hero-block {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: var(--poly-min-height, 60vh);
    padding-top: var(--poly-padding-top, 100px);
    padding-bottom: var(--poly-padding-bottom, 100px);
    padding-left: var(--poly-padding-left, 20px);
    padding-right: var(--poly-padding-right, 20px);
    background-color: var(--poly-background-color, #6366f1);
    background-image: var(--poly-background-image);
    background-size: cover;
    background-position: center;
    color: var(--poly-color, #fff);
}
.poly-hero-block--left { align-items: flex-start; text-align: left; }
.poly-hero-block--right { align-items: flex-end; text-align: right; }
.poly-hero-block__content { max-width: 800px; text-align: inherit; }
.poly-hero-block__title { margin: 0 0 1rem 0; font-size: 3rem; font-weight: 700; line-height: 1.1; }
.poly-hero-block__subtitle { margin: 0 0 2rem 0; font-size: 1.25rem; opacity: 0.9; }
.poly-hero-block__buttons { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: inherit; }
.poly-hero-block__btn-primary, .poly-hero-block__btn-secondary { display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; border-radius: 6px; font-weight: 500; text-decoration: none; transition: all 0.2s ease; }
.poly-hero-block__btn-primary { background-color: #fff; color: #6366f1; }
.poly-hero-block__btn-secondary { background-color: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.3); }
.poly-hero-block__image { margin-top: 3rem; }
.poly-hero-block__image img { max-width: 100%; height: auto; border-radius: 8px; }
@media (max-width: 768px) { .poly-hero-block__title { font-size: 2rem; } .poly-hero-block__subtitle { font-size: 1rem; } .poly-hero-block__buttons { flex-direction: column; } }
`);

// Features Block
registerComponentCSS('featuresBlock', `
.poly-features-block {
    width: 100%;
    padding-top: var(--poly-padding-top, 80px);
    padding-bottom: var(--poly-padding-bottom, 80px);
    padding-left: var(--poly-padding-left, 20px);
    padding-right: var(--poly-padding-right, 20px);
    background-color: var(--poly-background-color, #fff);
    color: var(--poly-color);
}
.poly-features-block__header { text-align: center; margin-bottom: 3rem; }
.poly-features-block__title { margin: 0 0 1rem 0; font-size: 2rem; font-weight: 700; }
.poly-features-block__subtitle { margin: 0; font-size: 1.125rem; color: #6b7280; }
.poly-features-block__grid { display: grid; grid-template-columns: repeat(var(--poly-columns, 3), 1fr); gap: var(--poly-gap, 2rem); max-width: 1200px; margin: 0 auto; }
@media (max-width: 768px) { .poly-features-block__grid { grid-template-columns: 1fr; } .poly-features-block__title { font-size: 1.75rem; } }
.poly-features-block__card { text-align: center; padding: 2rem; }
.poly-features-block__icon { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; margin: 0 auto 1rem; background-color: #f3f4f6; border-radius: 8px; color: #6366f1; }
.poly-features-block__card-title { margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 600; }
.poly-features-block__card-desc { margin: 0; color: #6b7280; }
`);

// Pricing Block
registerComponentCSS('pricingBlock', `
.poly-pricing-block {
    width: 100%;
    padding-top: var(--poly-padding-top, 80px);
    padding-bottom: var(--poly-padding-bottom, 80px);
    padding-left: var(--poly-padding-left, 20px);
    padding-right: var(--poly-padding-right, 20px);
    background-color: var(--poly-background-color, #fff);
    color: var(--poly-color);
}
.poly-pricing-block__header { text-align: center; margin-bottom: 3rem; }
.poly-pricing-block__title { margin: 0 0 1rem 0; font-size: 2rem; font-weight: 700; }
.poly-pricing-block__subtitle { margin: 0; font-size: 1.125rem; color: #6b7280; }
.poly-pricing-block__grid { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--poly-gap, 2rem); max-width: 1200px; margin: 0 auto; }
.poly-pricing-block__card { flex: 1; min-width: 280px; max-width: 350px; padding: 2rem; background-color: #fff; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; position: relative; }
.poly-pricing-block__card--featured { border-color: #6366f1; box-shadow: 0 4px 20px rgba(99,102,241,0.15); }
.poly-pricing-block__badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 4px 12px; background-color: #6366f1; color: #fff; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; }
.poly-pricing-block__name { margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 600; }
.poly-pricing-block__desc { font-size: 0.875rem; color: #6b7280; margin: 0 0 1.5rem; }
.poly-pricing-block__price { margin-bottom: 1.5rem; }
.poly-pricing-block__amount { font-size: 2.5rem; font-weight: 700; }
.poly-pricing-block__period { font-size: 0.875rem; color: #6b7280; }
.poly-pricing-block__features { list-style: none; padding: 0; margin: 0 0 1.5rem; text-align: left; }
.poly-pricing-block__features li { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0; font-size: 0.875rem; color: #374151; }
.poly-pricing-block__features li svg { color: #22c55e; flex-shrink: 0; }
.poly-pricing-block__btn { display: block; width: 100%; padding: 0.75rem; background: #6366f1; color: #fff; border: none; border-radius: 6px; font-weight: 500; text-decoration: none; text-align: center; cursor: pointer; transition: background 0.2s; }
.poly-pricing-block__btn:hover { background: #4f46e5; }
@media (max-width: 768px) { .poly-pricing-block__title { font-size: 1.75rem; } .poly-pricing-block__grid { flex-direction: column; align-items: center; } }
`);

// FAQ Block
registerComponentCSS('faqBlock', `
.poly-faq-block {
    width: 100%;
    padding-top: var(--poly-padding-top, 80px);
    padding-bottom: var(--poly-padding-bottom, 80px);
    padding-left: var(--poly-padding-left, 20px);
    padding-right: var(--poly-padding-right, 20px);
    background-color: var(--poly-background-color, #fff);
}
.poly-faq-block__header { text-align: center; margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto; }
.poly-faq-block__title { margin: 0 0 1rem 0; font-size: 2rem; font-weight: 700; }
.poly-faq-block__subtitle { margin: 0; font-size: 1.125rem; color: #6b7280; }
.poly-faq-block__content { max-width: 800px; margin: 0 auto; }
@media (max-width: 768px) { .poly-faq-block__title { font-size: 1.75rem; } }
`);

// CTA Block
registerComponentCSS('ctaBlock', `
.poly-cta-block {
    width: 100%;
    padding-top: var(--poly-padding-top, 80px);
    padding-bottom: var(--poly-padding-bottom, 80px);
    padding-left: var(--poly-padding-left, 20px);
    padding-right: var(--poly-padding-right, 20px);
    background-color: var(--poly-background-color, #6366f1);
    color: var(--poly-color, #fff);
    text-align: center;
}
.poly-cta-block--dark { background-color: #111827; }
.poly-cta-block--light { background-color: #f9fafb; color: #111827; }
.poly-cta-block__content { max-width: 600px; margin: 0 auto; }
.poly-cta-block__title { margin: 0 0 1rem 0; font-size: 2rem; font-weight: 700; }
.poly-cta-block__description { margin: 0 0 2rem 0; font-size: 1.125rem; opacity: 0.9; }
.poly-cta-block__btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 32px; background: #fff; color: #6366f1; border-radius: 6px; font-weight: 500; text-decoration: none; transition: all 0.2s ease; }
.poly-cta-block__btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.poly-cta-block--light .poly-cta-block__btn { background: #6366f1; color: #fff; }
@media (max-width: 768px) { .poly-cta-block__title { font-size: 1.75rem; } }
`);

export default componentCSS;
