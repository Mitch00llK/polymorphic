<?php
/**
 * Polymorphic Theme functions
 *
 * @package Polymorphic_Theme
 * @since   1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Theme version.
 */
define( 'POLYMORPHIC_THEME_VERSION', '1.0.0' );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function polymorphic_theme_setup() {
    // Make theme available for translation.
    load_theme_textdomain( 'polymorphic-theme', get_template_directory() . '/languages' );

    // Add default posts and comments RSS feed links to head.
    add_theme_support( 'automatic-feed-links' );

    // Let WordPress manage the document title.
    add_theme_support( 'title-tag' );

    // Enable support for Post Thumbnails.
    add_theme_support( 'post-thumbnails' );

    // Register navigation menus.
    register_nav_menus(
        array(
            'primary' => esc_html__( 'Primary Menu', 'polymorphic-theme' ),
            'footer'  => esc_html__( 'Footer Menu', 'polymorphic-theme' ),
        )
    );

    // Switch default core markup to output valid HTML5.
    add_theme_support(
        'html5',
        array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        )
    );

    // Add support for core custom logo.
    add_theme_support(
        'custom-logo',
        array(
            'height'      => 60,
            'width'       => 200,
            'flex-width'  => true,
            'flex-height' => true,
        )
    );

    // Add support for responsive embeds.
    add_theme_support( 'responsive-embeds' );

    // Add support for align wide blocks.
    add_theme_support( 'align-wide' );

    // Add support for custom background.
    add_theme_support( 'custom-background' );

    // Add editor styles.
    add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'polymorphic_theme_setup' );

/**
 * Enqueue scripts and styles.
 */
function polymorphic_theme_scripts() {
    // Main stylesheet.
    wp_enqueue_style(
        'polymorphic-theme-style',
        get_stylesheet_uri(),
        array(),
        POLYMORPHIC_THEME_VERSION
    );
}
add_action( 'wp_enqueue_scripts', 'polymorphic_theme_scripts' );

/**
 * Register widget areas.
 */
function polymorphic_theme_widgets_init() {
    register_sidebar(
        array(
            'name'          => esc_html__( 'Sidebar', 'polymorphic-theme' ),
            'id'            => 'sidebar-1',
            'description'   => esc_html__( 'Add widgets here.', 'polymorphic-theme' ),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        )
    );

    register_sidebar(
        array(
            'name'          => esc_html__( 'Footer', 'polymorphic-theme' ),
            'id'            => 'footer-1',
            'description'   => esc_html__( 'Footer widget area.', 'polymorphic-theme' ),
            'before_widget' => '<div id="%1$s" class="widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h3 class="widget-title">',
            'after_title'   => '</h3>',
        )
    );
}
add_action( 'widgets_init', 'polymorphic_theme_widgets_init' );

/**
 * Add body classes.
 *
 * @param array $classes Existing body classes.
 * @return array Modified body classes.
 */
function polymorphic_theme_body_classes( $classes ) {
    // Add class for pages built with Polymorphic.
    if ( is_singular() && get_post_meta( get_the_ID(), '_polymorphic_enabled', true ) ) {
        $classes[] = 'polymorphic-active';
    }

    return $classes;
}
add_filter( 'body_class', 'polymorphic_theme_body_classes' );
