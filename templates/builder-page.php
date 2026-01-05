<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo esc_html( get_the_title( $post_id ) ); ?> - Polymorphic Builder</title>
    <?php wp_head(); ?>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
        #wpadminbar {
            display: none !important;
        }
        #polymorphic-builder-root {
            height: 100vh;
        }
    </style>
</head>
<body class="polymorphic-builder-active">
    <div id="polymorphic-builder-root"></div>
    <?php wp_footer(); ?>
</body>
</html>
