<?php
/**
 * Polymorphic Frontend Page Template
 *
 * Clean, minimal template for rendering Polymorphic builder pages.
 * All component styles are loaded via wp_head() from components.css.
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
    <style id="polymorphic-base">
        /* Minimal base reset - component styles loaded via wp_head() */
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        body.polymorphic-page {
            font-family: var(--poly-font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
            font-size: var(--poly-font-size-base, 16px);
            line-height: var(--poly-line-height-base, 1.6);
            color: var(--poly-color-text, #1a1a1a);
            background-color: var(--poly-color-bg, #ffffff);
        }
        .polymorphic-main { min-height: 100vh; }
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

<script id="polymorphic-components">
/**
 * Polymorphic UI Components
 * Interactive component behaviors (accordions, tabs)
 */
(function() {
    'use strict';
    
    /* Accordion functionality - works with poly-accordion classes */
    document.querySelectorAll('.poly-accordion__trigger').forEach(function(trigger) {
        trigger.addEventListener('click', function() {
            var isExpanded = this.getAttribute('aria-expanded') === 'true';
            var content = document.getElementById(this.getAttribute('aria-controls'));
            
            var accordion = this.closest('.poly-accordion');
            if (accordion && accordion.dataset.type === 'single') {
                accordion.querySelectorAll('.poly-accordion__trigger').forEach(function(t) {
                    if (t !== trigger) {
                        t.setAttribute('aria-expanded', 'false');
                        var c = document.getElementById(t.getAttribute('aria-controls'));
                        if (c) c.hidden = true;
                    }
                });
            }
            
            this.setAttribute('aria-expanded', !isExpanded);
            if (content) content.hidden = isExpanded;
        });
    });
    
    /* Tabs functionality - works with poly-tabs classes */
    document.querySelectorAll('.poly-tabs__trigger').forEach(function(trigger) {
        trigger.addEventListener('click', function() {
            var tabs = this.closest('.poly-tabs');
            var panelId = this.getAttribute('aria-controls');
            
            tabs.querySelectorAll('.poly-tabs__trigger').forEach(function(t) {
                t.setAttribute('aria-selected', 'false');
            });
            tabs.querySelectorAll('.poly-tabs__content').forEach(function(p) {
                p.hidden = true;
            });
            
            this.setAttribute('aria-selected', 'true');
            var panel = document.getElementById(panelId);
            if (panel) panel.hidden = false;
        });
    });
})();
</script>
</body>
</html>
