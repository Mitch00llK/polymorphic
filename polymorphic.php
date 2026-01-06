<?php
/**
 * Polymorphic - The Adaptable Page Builder
 *
 * @package           Polymorphic
 * @author            Polymorphic inc.
 * @copyright         2026 Polymorphic inc.
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       Polymorphic - The Adaptable Page Builder  
 * Plugin URI:        https://polymorphic.dev
 * Description:       The lightweight, adaptable page builder for WordPress. Build beautiful pages with a modern drag-and-drop interface.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Polymorphic inc.
 * Author URI:        https://polymorphic.dev
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       polymorphic
 * Domain Path:       /languages
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Plugin version.
 */
define( 'POLYMORPHIC_VERSION', '1.0.0' );

/**
 * Plugin schema version for data migrations.
 */
define( 'POLYMORPHIC_SCHEMA_VERSION', '1.0.0' );

/**
 * Plugin directory path.
 */
define( 'POLYMORPHIC_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Plugin directory URL.
 */
define( 'POLYMORPHIC_URL', plugin_dir_url( __FILE__ ) );

/**
 * Plugin basename.
 */
define( 'POLYMORPHIC_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Minimum PHP version required.
 */
define( 'POLYMORPHIC_MIN_PHP', '8.0' );

/**
 * Minimum WordPress version required.
 */
define( 'POLYMORPHIC_MIN_WP', '6.0' );

/**
 * Check PHP version.
 */
if ( version_compare( PHP_VERSION, POLYMORPHIC_MIN_PHP, '<' ) ) {
    add_action( 'admin_notices', function() {
        printf(
            '<div class="notice notice-error"><p>%s</p></div>',
            sprintf(
                /* translators: 1: Required PHP version 2: Current PHP version */
                esc_html__( 'Polymorphic requires PHP %1$s or higher. You are running PHP %2$s.', 'polymorphic' ),
                POLYMORPHIC_MIN_PHP,
                PHP_VERSION
            )
        );
    });
    return;
}

/**
 * Autoloader - Must be loaded early for activation hooks.
 */
if ( file_exists( POLYMORPHIC_PATH . 'vendor/autoload.php' ) ) {
    require_once POLYMORPHIC_PATH . 'vendor/autoload.php';
} else {
    // Fallback: manually require core classes if composer autoload missing.
    require_once POLYMORPHIC_PATH . 'includes/Core/Activator/class-activator.php';
    require_once POLYMORPHIC_PATH . 'includes/Core/Deactivator/class-deactivator.php';
    require_once POLYMORPHIC_PATH . 'includes/Core/Plugin/class-plugin.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/ComponentRegistry/class-component-registry.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/ComponentBase/class-component-base.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Heading/class-heading.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Section/class-section.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Container/class-container.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Text/class-text.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Image/class-image.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Button/class-button.php';
    // UI Components
    require_once POLYMORPHIC_PATH . 'includes/Components/Card/class-card.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Accordion/class-accordion.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Tabs/class-tabs.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Alert/class-alert.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Badge/class-badge.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Avatar/class-avatar.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/Separator/class-separator.php';
    // Marketing Blocks
    require_once POLYMORPHIC_PATH . 'includes/Components/HeroBlock/class-heroblock.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/FeaturesBlock/class-featuresblock.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/PricingBlock/class-pricingblock.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/FaqBlock/class-faqblock.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/CtaBlock/class-ctablock.php';
    // SaaS Blocks
    require_once POLYMORPHIC_PATH . 'includes/Components/TestimonialBlock/class-testimonial-block.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/StatsBlock/class-stats-block.php';
    require_once POLYMORPHIC_PATH . 'includes/Components/LogoCloud/class-logo-cloud.php';
    require_once POLYMORPHIC_PATH . 'includes/Admin/AdminMenu/class-admin-menu.php';
    require_once POLYMORPHIC_PATH . 'includes/Admin/Assets/class-assets.php';
    require_once POLYMORPHIC_PATH . 'includes/Admin/EditorIntegration/class-editor-integration.php';
    require_once POLYMORPHIC_PATH . 'includes/Api/RestController/class-rest-controller.php';
    require_once POLYMORPHIC_PATH . 'includes/Api/GlobalSettingsController/class-global-settings-controller.php';
    require_once POLYMORPHIC_PATH . 'includes/Api/GlobalBlocksController/class-global-blocks-controller.php';
    require_once POLYMORPHIC_PATH . 'includes/Frontend/Renderer/class-renderer.php';
    require_once POLYMORPHIC_PATH . 'includes/Frontend/Assets/class-frontend-assets.php';
    require_once POLYMORPHIC_PATH . 'includes/Settings/GlobalSettings/class-global-settings.php';
    require_once POLYMORPHIC_PATH . 'includes/Cache/TransientCache/class-transient-cache.php';
    require_once POLYMORPHIC_PATH . 'includes/Helpers/Sanitizer/class-sanitizer.php';
}

/**
 * Initialize the plugin.
 *
 * @since 1.0.0
 */
function polymorphic_init(): void {
    // Load text domain.
    load_plugin_textdomain(
        'polymorphic',
        false,
        dirname( POLYMORPHIC_BASENAME ) . '/languages'
    );

    // Initialize core plugin.
    \Polymorphic\Core\Plugin::get_instance()->init();
}
add_action( 'plugins_loaded', 'polymorphic_init' );

/**
 * Plugin activation hook.
 *
 * @since 1.0.0
 */
function polymorphic_activate(): void {
    \Polymorphic\Core\Activator::activate();
}
register_activation_hook( __FILE__, 'polymorphic_activate' );

/**
 * Plugin deactivation hook.
 *
 * @since 1.0.0
 */
function polymorphic_deactivate(): void {
    \Polymorphic\Core\Deactivator::deactivate();
}
register_deactivation_hook( __FILE__, 'polymorphic_deactivate' );
