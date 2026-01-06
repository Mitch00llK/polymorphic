<?php
/**
 * Main Plugin class.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Core;

use Polymorphic\Admin\Admin_Menu;
use Polymorphic\Admin\Assets;
use Polymorphic\Admin\Editor_Integration;
use Polymorphic\Api\Rest_Controller;
use Polymorphic\Api\Global_Settings_Controller;
use Polymorphic\Components\Component_Registry;
use Polymorphic\Frontend\Renderer;
use Polymorphic\Frontend\Assets\Frontend_Assets;
use Polymorphic\Settings\Global_Settings;

/**
 * Core plugin class.
 *
 * @since 1.0.0
 */
final class Plugin {

    /**
     * Singleton instance.
     *
     * @var Plugin|null
     */
    private static ?Plugin $instance = null;

    /**
     * Component registry instance.
     *
     * @var Component_Registry
     */
    private Component_Registry $component_registry;

    /**
     * Get singleton instance.
     *
     * @return Plugin
     */
    public static function get_instance(): Plugin {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Private constructor for singleton.
     */
    private function __construct() {
        $this->component_registry = new Component_Registry();
    }

    /**
     * Initialize the plugin.
     *
     * @since 1.0.0
     */
    public function init(): void {
        // Register components.
        $this->register_components();

        // Admin hooks.
        if ( is_admin() ) {
            $this->init_admin();
        }

        // Frontend hooks.
        $this->init_frontend();

        // REST API.
        add_action( 'rest_api_init', [ $this, 'register_rest_routes' ] );

        /**
         * Fires after plugin initialization.
         *
         * @since 1.0.0
         */
        do_action( 'polymorphic/init' );
    }

    /**
     * Initialize admin functionality.
     *
     * @since 1.0.0
     */
    private function init_admin(): void {
        // Admin menu.
        $admin_menu = new Admin_Menu();
        $admin_menu->init();

        // Admin assets.
        $assets = new Assets();
        $assets->init();

        // Editor integration (meta box, row actions).
        $editor_integration = new Editor_Integration();
        $editor_integration->init();
    }

    /**
     * Initialize frontend functionality.
     *
     * @since 1.0.0
     */
    private function init_frontend(): void {
        // Frontend renderer.
        $renderer = new Renderer( $this->component_registry );
        $renderer->init();

        // Frontend assets (CSS/JS).
        $frontend_assets = new Frontend_Assets();
        $frontend_assets->init();
    }

    /**
     * Register REST API routes.
     *
     * @since 1.0.0
     */
    public function register_rest_routes(): void {
        // Builder API routes.
        $rest_controller = new Rest_Controller( $this->component_registry );
        $rest_controller->register_routes();

        // Global settings API routes.
        $settings_controller = new Global_Settings_Controller();
        $settings_controller->register_routes();
    }

    /**
     * Register core components.
     *
     * @since 1.0.0
     */
    private function register_components(): void {
        $components = [
            'section'   => \Polymorphic\Components\Section\Section::class,
            'container' => \Polymorphic\Components\Container\Container::class,
            'heading'   => \Polymorphic\Components\Heading\Heading::class,
            'text'      => \Polymorphic\Components\Text\Text::class,
            'image'     => \Polymorphic\Components\Image\Image::class,
            'button'    => \Polymorphic\Components\Button\Button::class,

            // UI Components.
            'card'      => \Polymorphic\Components\Card\Card::class,
            'accordion' => \Polymorphic\Components\Accordion\Accordion::class,
            'tabs'      => \Polymorphic\Components\Tabs\Tabs::class,
            'alert'     => \Polymorphic\Components\Alert\Alert::class,
            'badge'     => \Polymorphic\Components\Badge\Badge::class,
            'avatar'    => \Polymorphic\Components\Avatar\Avatar::class,
            'separator' => \Polymorphic\Components\Separator\Separator::class,

            // Marketing Blocks.
            'heroBlock'     => \Polymorphic\Components\HeroBlock\HeroBlock::class,
            'featuresBlock' => \Polymorphic\Components\FeaturesBlock\FeaturesBlock::class,
            'pricingBlock'  => \Polymorphic\Components\PricingBlock\PricingBlock::class,
            'faqBlock'      => \Polymorphic\Components\FaqBlock\FaqBlock::class,
            'ctaBlock'      => \Polymorphic\Components\CtaBlock\CtaBlock::class,

            // SaaS Blocks.
            'testimonialBlock' => \Polymorphic\Components\TestimonialBlock\Testimonial_Block::class,
            'statsBlock'       => \Polymorphic\Components\StatsBlock\Stats_Block::class,
            'logoCloud'        => \Polymorphic\Components\LogoCloud\Logo_Cloud::class,
        ];

        /**
         * Filter registered components.
         *
         * @since 1.0.0
         *
         * @param array $components Registered component classes.
         */
        $components = apply_filters( 'polymorphic/components/registry', $components );

        foreach ( $components as $type => $class ) {
            $this->component_registry->register( $type, $class );
        }
    }

    /**
     * Get the component registry.
     *
     * @since 1.0.0
     *
     * @return Component_Registry
     */
    public function get_component_registry(): Component_Registry {
        return $this->component_registry;
    }

    /**
     * Get plugin version.
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function get_version(): string {
        return POLYMORPHIC_VERSION;
    }
}
