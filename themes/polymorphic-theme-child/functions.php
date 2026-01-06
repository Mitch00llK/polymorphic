<?php
/**
 * Polymorphic Theme Child functions
 *
 * @package Polymorphic_Theme_Child
 * @since   1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Child theme version.
 */
define( 'POLYMORPHIC_CHILD_VERSION', '1.0.0' );

/**
 * Enqueue parent and child theme styles.
 */
function polymorphic_child_enqueue_styles() {
    // Parent theme stylesheet.
    wp_enqueue_style(
        'polymorphic-theme-style',
        get_template_directory_uri() . '/style.css',
        array(),
        POLYMORPHIC_CHILD_VERSION
    );

    // Child theme stylesheet.
    wp_enqueue_style(
        'polymorphic-theme-child-style',
        get_stylesheet_uri(),
        array( 'polymorphic-theme-style' ),
        POLYMORPHIC_CHILD_VERSION
    );
}
add_action( 'wp_enqueue_scripts', 'polymorphic_child_enqueue_styles' );

/**
 * Add your custom functions below.
 */

// Example: Add custom image sizes.
// add_image_size( 'custom-size', 800, 600, true );

// Example: Register additional nav menus.
// function polymorphic_child_register_menus() {
//     register_nav_menu( 'secondary', __( 'Secondary Menu', 'polymorphic-theme-child' ) );
// }
// add_action( 'after_setup_theme', 'polymorphic_child_register_menus' );

// Example: Add custom body class.
// function polymorphic_child_body_class( $classes ) {
//     $classes[] = 'my-custom-class';
//     return $classes;
// }
// add_filter( 'body_class', 'polymorphic_child_body_class' );
