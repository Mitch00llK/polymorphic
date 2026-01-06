<?php
/**
 * Polymorphic Frontend Page Template
 *
 * Template for rendering Polymorphic builder pages with full takeover.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

// Get passed variables.
$content = get_query_var( 'polymorphic_content', '' );
$post    = get_query_var( 'polymorphic_post', null );

if ( ! $post ) {
    return;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo esc_html( get_the_title( $post->ID ) ); ?> - <?php bloginfo( 'name' ); ?></title>
    <?php wp_head(); ?>
    <style>
        /* Polymorphic base styles - uses CSS variables from global settings */
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body.polymorphic-page {
            font-family: var(--poly-font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
            font-size: var(--poly-font-size, 16px);
            line-height: var(--poly-line-height, 1.6);
            color: var(--poly-color-text, #1a1a1a);
            background-color: var(--poly-color-bg, #ffffff);
        }
        
        .polymorphic-main {
            min-height: 100vh;
        }
        
        /* Section styles */
        .section {
            position: relative;
            width: 100%;
            padding-top: var(--poly-section-padding-top, 60px);
            padding-bottom: var(--poly-section-padding-bottom, 60px);
        }
        
        .section__inner {
            max-width: var(--poly-container-width, 1200px);
            margin: 0 auto;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        
        /* Container styles */
        .container {
            max-width: var(--poly-container-width, 1200px);
            margin: 0 auto;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        
        .container--narrow { max-width: var(--poly-container-narrow, 768px); }
        .container--wide { max-width: var(--poly-container-wide, 1400px); }
        .container--full { max-width: 100%; padding: 0; }
        
        /* Typography - uses global settings */
        .heading { 
            margin-bottom: 1rem;
            font-family: var(--poly-font-heading, inherit);
        }
        h1, .h1 { font-size: var(--poly-h1-size, 3rem); }
        h2, .h2 { font-size: var(--poly-h2-size, 2.25rem); }
        h3, .h3 { font-size: var(--poly-h3-size, 1.875rem); }
        h4, .h4 { font-size: var(--poly-h4-size, 1.5rem); }
        h5, .h5 { font-size: var(--poly-h5-size, 1.25rem); }
        h6, .h6 { font-size: var(--poly-h6-size, 1rem); }
        
        .text { margin-bottom: 1rem; }
        .text p:last-child { margin-bottom: 0; }
        
        /* Button styles - uses global settings */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--poly-gap, 0.5rem);
            padding: var(--poly-btn-py, 0.75rem) var(--poly-btn-px, 1.5rem);
            font-size: var(--poly-btn-font-size, 1rem);
            font-weight: var(--poly-btn-font-weight, 500);
            text-decoration: none;
            border: 2px solid transparent;
            border-radius: var(--poly-btn-radius, 6px);
            cursor: pointer;
            transition: all var(--poly-btn-transition, 0.2s ease);
        }
        
        .btn--primary {
            background-color: var(--poly-color-primary, #6366f1);
            color: white;
            border-color: var(--poly-color-primary, #6366f1);
        }
        
        .btn--primary:hover {
            filter: brightness(0.9);
        }
        
        .btn--secondary {
            background-color: var(--poly-color-secondary, #64748b);
            color: white;
        }
        
        .btn--outline {
            background: transparent;
            color: var(--poly-color-primary, #6366f1);
            border-color: var(--poly-color-primary, #6366f1);
        }
        
        .btn--outline:hover {
            background: var(--poly-color-primary, #6366f1);
            color: white;
        }
        
        .btn--ghost {
            background: transparent;
            color: var(--poly-color-text, #374151);
        }
        
        .btn--sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
        .btn--lg { padding: 1rem 2rem; font-size: 1.125rem; }
        .btn--full { width: 100%; }
        
        /* Image styles */
        .image img {
            max-width: 100%;
            height: auto;
            display: block;
        }
        
        .image--center { margin: 0 auto; }
        .image--left { margin-right: auto; }
        .image--right { margin-left: auto; }
        
        /* Card - uses global settings */
        .card {
            background-color: var(--poly-color-bg, #ffffff);
            border: 1px solid var(--poly-color-border, #e5e7eb);
            border-radius: var(--poly-btn-radius, 8px);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .card--outline { border-width: 2px; }
        .card--ghost { border: none; box-shadow: none; background: transparent; }
        .card__header { padding: 1.5rem 1.5rem 0; }
        .card__title { margin: 0; font-size: 1.25rem; font-weight: 600; line-height: 1.4; color: var(--poly-color-text, #111827); }
        .card__description { margin: 0.5rem 0 0; font-size: 0.875rem; color: var(--poly-color-muted, #6b7280); }
        .card__content { padding: 1.5rem; }
        .card__footer { padding: 0 1.5rem 1.5rem; color: var(--poly-color-muted, #6b7280); font-size: 0.875rem; }
        
        /* Alert - uses global settings */
        .alert { display: flex; gap: 0.75rem; padding: 1rem; border-radius: var(--poly-btn-radius, 6px); border: 1px solid; }
        .alert--info { background: #eff6ff; border-color: var(--poly-color-info, #3b82f6); color: #1e40af; }
        .alert--success { background: #f0fdf4; border-color: var(--poly-color-success, #22c55e); color: #166534; }
        .alert--warning { background: #fffbeb; border-color: var(--poly-color-warning, #f59e0b); color: #92400e; }
        .alert--error { background: #fef2f2; border-color: var(--poly-color-error, #ef4444); color: #991b1b; }
        .alert__icon { flex-shrink: 0; margin-top: 2px; }
        .alert__content { flex: 1; }
        .alert__title { margin: 0 0 0.25rem; font-size: 0.875rem; font-weight: 600; }
        .alert__description { margin: 0; font-size: 0.875rem; opacity: 0.9; }
        
        /* Badge */
        .badge { display: inline-flex; align-items: center; padding: 0.25rem 0.625rem; font-size: 0.75rem; font-weight: 500; border-radius: 9999px; border: 1px solid transparent; }
        .badge--default { background: #6366f1; color: #fff; }
        .badge--secondary { background: #f3f4f6; color: #374151; }
        .badge--outline { background: transparent; border-color: #e5e7eb; color: #374151; }
        .badge--destructive { background: #ef4444; color: #fff; }
        
        /* Avatar */
        .avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden; background: #f3f4f6; color: #6b7280; font-weight: 500; }
        .avatar--small { width: 32px; height: 32px; font-size: 0.75rem; }
        .avatar--medium { width: 40px; height: 40px; font-size: 0.875rem; }
        .avatar--large { width: 56px; height: 56px; font-size: 1rem; }
        .avatar__image { width: 100%; height: 100%; object-fit: cover; }
        .avatar__fallback { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
        
        /* Separator */
        .separator { background: #e5e7eb; }
        .separator--horizontal { width: 100%; height: 1px; margin: 1rem 0; }
        .separator--vertical { width: 1px; height: 100%; min-height: 20px; margin: 0 1rem; }
        
        /* Accordion */
        .accordion { border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
        .accordion__item { border-bottom: 1px solid #e5e7eb; }
        .accordion__item:last-child { border-bottom: none; }
        .accordion__header { margin: 0; }
        .accordion__trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 1rem; text-align: left; font-size: 0.875rem; font-weight: 500; background: #fff; border: none; cursor: pointer; transition: background 0.15s; }
        .accordion__trigger:hover { background: #f9fafb; }
        .accordion__icon { transition: transform 0.2s; }
        .accordion__trigger[aria-expanded="true"] .accordion__icon { transform: rotate(180deg); }
        .accordion__content[hidden] { display: none; }
        .accordion__content-inner { padding: 0 1rem 1rem; font-size: 0.875rem; color: #6b7280; }
        
        /* Tabs */
        .tabs { width: 100%; }
        .tabs__list { display: flex; border-bottom: 1px solid #e5e7eb; background: #f9fafb; border-radius: 6px 6px 0 0; padding: 0.25rem; }
        .tabs__trigger { flex: 1; display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; color: #6b7280; background: transparent; border: none; border-radius: 4px; cursor: pointer; transition: all 0.15s; }
        .tabs__trigger:hover { color: #374151; }
        .tabs__trigger[aria-selected="true"] { background: #fff; color: #111827; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .tabs__content { padding: 1rem; font-size: 0.875rem; line-height: 1.6; }
        .tabs__content[hidden] { display: none; }
        
        /* Hero Block */
        .hero-block { padding: 5rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 3rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .hero-block--left { align-items: flex-start; text-align: left; }
        .hero-block--center { align-items: center; text-align: center; }
        .hero-block--right { align-items: flex-end; text-align: right; }
        .hero-block__content { max-width: 800px; }
        .hero-block__title { font-size: 3rem; font-weight: 700; line-height: 1.1; margin: 0 0 1.5rem; }
        .hero-block__subtitle { font-size: 1.25rem; opacity: 0.9; margin: 0 0 2rem; line-height: 1.6; }
        .hero-block__buttons { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: inherit; }
        .hero-block__btn-primary { display: inline-flex; align-items: center; padding: 0.875rem 2rem; background: white; color: #667eea; font-weight: 600; font-size: 1rem; border-radius: 8px; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
        .hero-block__btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .hero-block__btn-secondary { display: inline-flex; align-items: center; padding: 0.875rem 2rem; background: transparent; color: white; font-weight: 600; font-size: 1rem; border: 2px solid rgba(255,255,255,0.5); border-radius: 8px; text-decoration: none; }
        .hero-block__btn-secondary:hover { border-color: white; background: rgba(255,255,255,0.1); }
        .hero-block__image img { max-width: 100%; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        
        /* Features Block */
        .features-block { padding: 5rem 1.5rem; background: #f9fafb; }
        .features-block__header { text-align: center; max-width: 600px; margin: 0 auto 3rem; }
        .features-block__title { font-size: 2.25rem; font-weight: 700; margin: 0 0 1rem; color: #111827; }
        .features-block__subtitle { font-size: 1.125rem; color: #6b7280; margin: 0; }
        .features-block__grid { display: grid; gap: 2rem; max-width: 1200px; margin: 0 auto; }
        .features-block__card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: box-shadow 0.2s, transform 0.2s; }
        .features-block__card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateY(-2px); }
        .features-block__icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; margin-bottom: 1rem; }
        .features-block__card-title { font-size: 1.125rem; font-weight: 600; margin: 0 0 0.5rem; color: #111827; }
        .features-block__card-desc { font-size: 0.875rem; color: #6b7280; margin: 0; line-height: 1.6; }
        
        /* Pricing Block */
        .pricing-block { padding: 5rem 1.5rem; background: white; }
        .pricing-block__header { text-align: center; max-width: 600px; margin: 0 auto 3rem; }
        .pricing-block__title { font-size: 2.25rem; font-weight: 700; margin: 0 0 1rem; color: #111827; }
        .pricing-block__subtitle { font-size: 1.125rem; color: #6b7280; margin: 0; }
        .pricing-block__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto; }
        .pricing-block__card { position: relative; background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 2rem; display: flex; flex-direction: column; }
        .pricing-block__card--featured { border-color: #6366f1; box-shadow: 0 0 0 1px #6366f1, 0 8px 24px rgba(99,102,241,0.2); }
        .pricing-block__badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #6366f1; color: white; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 9999px; }
        .pricing-block__name { font-size: 1.25rem; font-weight: 600; margin: 0; color: #111827; }
        .pricing-block__desc { font-size: 0.875rem; color: #6b7280; margin: 0.5rem 0 1.5rem; }
        .pricing-block__price { margin-bottom: 1.5rem; }
        .pricing-block__amount { font-size: 3rem; font-weight: 700; color: #111827; }
        .pricing-block__period { font-size: 1rem; color: #6b7280; }
        .pricing-block__features { list-style: none; padding: 0; margin: 0 0 2rem; flex: 1; }
        .pricing-block__features li { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; font-size: 0.875rem; color: #374151; }
        .pricing-block__features li svg { color: #22c55e; flex-shrink: 0; }
        .pricing-block__btn { display: block; text-align: center; padding: 0.75rem 1.5rem; background: white; color: #6366f1; border: 2px solid #6366f1; border-radius: 8px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .pricing-block__btn:hover { background: #6366f1; color: white; }
        .pricing-block__btn--primary { display: block; text-align: center; padding: 0.75rem 1.5rem; background: #6366f1; color: white; border: 2px solid #6366f1; border-radius: 8px; font-weight: 600; text-decoration: none; }
        .pricing-block__btn--primary:hover { background: #4f46e5; border-color: #4f46e5; }
        
        /* FAQ Block */
        .faq-block { padding: 5rem 1.5rem; background: #f9fafb; }
        .faq-block__header { text-align: center; max-width: 600px; margin: 0 auto 3rem; }
        .faq-block__title { font-size: 2.25rem; font-weight: 700; margin: 0 0 1rem; color: #111827; }
        .faq-block__subtitle { font-size: 1.125rem; color: #6b7280; margin: 0; }
        
        /* CTA Block */
        .cta-block { padding: 5rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center; }
        .cta-block--dark { background: #111827; }
        .cta-block--light { background: #f9fafb; }
        .cta-block--light .cta-block__title, .cta-block--light .cta-block__desc { color: #111827; }
        .cta-block--light .cta-block__btn { background: #6366f1; color: white; }
        .cta-block__content { max-width: 600px; margin: 0 auto; }
        .cta-block__title { font-size: 2.25rem; font-weight: 700; margin: 0 0 1rem; color: white; }
        .cta-block__desc { font-size: 1.125rem; color: rgba(255,255,255,0.9); margin: 0 0 2rem; line-height: 1.6; }
        .cta-block__btn { display: inline-flex; align-items: center; padding: 1rem 2.5rem; background: white; color: #667eea; font-weight: 600; font-size: 1.125rem; border-radius: 8px; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
        .cta-block__btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero-block__title { font-size: 2rem; }
            .hero-block__subtitle { font-size: 1rem; }
            .hero-block__buttons { flex-direction: column; }
            .features-block__title, .pricing-block__title, .faq-block__title, .cta-block__title { font-size: 1.75rem; }
            .pricing-block__grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body <?php body_class( 'polymorphic-page' ); ?>>
<?php wp_body_open(); ?>

<main class="polymorphic-main" role="main">
    <?php 
    // phpcs:ignore WordPress.Security.EscapeOutput
    echo $content; 
    ?>
</main>

<?php wp_footer(); ?>

<script>
/* Polymorphic UI Components - Vanilla JS */
(function() {
    'use strict';
    
    /* Accordion functionality */
    document.querySelectorAll('.accordion__trigger').forEach(function(trigger) {
        trigger.addEventListener('click', function() {
            var isExpanded = this.getAttribute('aria-expanded') === 'true';
            var content = document.getElementById(this.getAttribute('aria-controls'));
            
            /* For single-mode accordion, close others in same accordion */
            var accordion = this.closest('.accordion');
            if (accordion && accordion.dataset.type === 'single') {
                accordion.querySelectorAll('.accordion__trigger').forEach(function(t) {
                    if (t !== trigger) {
                        t.setAttribute('aria-expanded', 'false');
                        var c = document.getElementById(t.getAttribute('aria-controls'));
                        if (c) c.hidden = true;
                    }
                });
            }
            
            /* Toggle current item */
            this.setAttribute('aria-expanded', !isExpanded);
            if (content) content.hidden = isExpanded;
        });
    });
    
    /* Tabs functionality */
    document.querySelectorAll('.tabs__trigger').forEach(function(trigger) {
        trigger.addEventListener('click', function() {
            var tabs = this.closest('.tabs');
            var panelId = this.getAttribute('aria-controls');
            
            /* Deactivate all tabs */
            tabs.querySelectorAll('.tabs__trigger').forEach(function(t) {
                t.setAttribute('aria-selected', 'false');
            });
            tabs.querySelectorAll('.tabs__content').forEach(function(p) {
                p.hidden = true;
            });
            
            /* Activate clicked tab */
            this.setAttribute('aria-selected', 'true');
            var panel = document.getElementById(panelId);
            if (panel) panel.hidden = false;
        });
    });
})();
</script>
</body>
</html>
