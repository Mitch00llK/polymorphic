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
        /* Polymorphic base styles */
        :root {
            --poly-container-max: 1200px;
            --poly-section-padding: 4rem;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body.polymorphic-page {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
        }
        
        .polymorphic-main {
            min-height: 100vh;
        }
        
        /* Section styles */
        .section {
            position: relative;
            width: 100%;
        }
        
        .section__inner {
            max-width: var(--poly-container-max);
            margin: 0 auto;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        
        /* Container styles */
        .container {
            max-width: var(--poly-container-max);
            margin: 0 auto;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        
        .container--narrow { max-width: 768px; }
        .container--wide { max-width: 1400px; }
        .container--full { max-width: 100%; padding: 0; }
        
        /* Typography */
        .heading { margin-bottom: 1rem; }
        .text { margin-bottom: 1rem; }
        .text p:last-child { margin-bottom: 0; }
        
        /* Button styles */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;
            border: 2px solid transparent;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .btn--primary {
            background-color: #6366f1;
            color: white;
            border-color: #6366f1;
        }
        
        .btn--primary:hover {
            background-color: #4f46e5;
            border-color: #4f46e5;
        }
        
        .btn--secondary {
            background-color: #64748b;
            color: white;
        }
        
        .btn--outline {
            background: transparent;
            color: #6366f1;
            border-color: #6366f1;
        }
        
        .btn--outline:hover {
            background: #6366f1;
            color: white;
        }
        
        .btn--ghost {
            background: transparent;
            color: #374151;
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
        
        /* Card */
        .card {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .card--outline { border-width: 2px; }
        .card--ghost { border: none; box-shadow: none; background: transparent; }
        .card__header { padding: 1.5rem 1.5rem 0; }
        .card__title { margin: 0; font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
        .card__description { margin: 0.5rem 0 0; font-size: 0.875rem; color: #6b7280; }
        .card__content { padding: 1.5rem; }
        .card__footer { padding: 0 1.5rem 1.5rem; color: #6b7280; font-size: 0.875rem; }
        
        /* Alert */
        .alert { display: flex; gap: 0.75rem; padding: 1rem; border-radius: 6px; border: 1px solid; }
        .alert--info { background: #eff6ff; border-color: #3b82f6; color: #1e40af; }
        .alert--success { background: #f0fdf4; border-color: #22c55e; color: #166534; }
        .alert--warning { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
        .alert--error { background: #fef2f2; border-color: #ef4444; color: #991b1b; }
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
