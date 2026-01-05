<?php
/**
 * Polymorphic - The Adaptable Page Builder
 *
 * @package           Polymorphic
 * @author            Your Company
 * @copyright         2026 Your Company
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       Polymorphic
 * Plugin URI:        https://polymorphic.dev
 * Description:       The lightweight, adaptable page builder for WordPress. Build beautiful pages with a modern drag-and-drop interface.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Your Company
 * Author URI:        https://yourcompany.com
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
 * Autoloader.
 */
if ( file_exists( POLYMORPHIC_PATH . 'vendor/autoload.php' ) ) {
    require_once POLYMORPHIC_PATH . 'vendor/autoload.php';
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
