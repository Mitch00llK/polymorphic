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
</body>
</html>
