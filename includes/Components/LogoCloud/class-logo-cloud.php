<?php
/**
 * Logo Cloud Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\LogoCloud;

use Polymorphic\Components\Component_Base;

/**
 * Logo cloud/grid component (Organism).
 *
 * @since 1.0.0
 */
class Logo_Cloud extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'logoCloud';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Logo Cloud', 'polymorphic' );
    }

    /**
     * Get component category.
     *
     * @return string
     */
    public function get_category(): string {
        return 'marketing';
    }

    /**
     * Get component icon.
     *
     * @return string
     */
    public function get_icon(): string {
        return 'images-alt2';
    }

    /**
     * Get default component props.
     *
     * @return array
     */
    public function get_defaults(): array {
        return [
            'title' => '',
            'gap'   => '3rem',
            'items' => [],
        ];
    }

    /**
     * Render the component.
     *
     * @param array        $component Component data.
     * @param string|array $context   Render context.
     * @return string Rendered HTML.
     */
    public function render( array $component, $context = 'frontend' ): string {
        $props = $this->merge_defaults( $component['props'] ?? [] );
        $id    = $component['id'] ?? '';
        $items = $props['items'] ?? [];

        // Build CSS classes.
        $classes = [ 'poly-logo-cloud' ];

        // Add generated class.
        $generated_class = $this->get_generated_class( $component, $context );
        if ( ! empty( $generated_class ) ) {
            $classes[] = $generated_class;
        }

        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
            'style'             => '--poly-gap: ' . esc_attr( $props['gap'] ),
        ];

        ob_start();
        ?>
        <div <?php echo $this->build_attributes( $attrs ); ?>>
            <?php if ( ! empty( $props['title'] ) ) : ?>
                <div class="poly-logo-cloud__title"><?php echo esc_html( $props['title'] ); ?></div>
            <?php endif; ?>

            <div class="poly-logo-cloud__grid">
                <?php foreach ( $items as $item ) : ?>
                    <div class="poly-logo-item">
                        <img src="<?php echo esc_url( $item['url'] ?? '' ); ?>" alt="<?php echo esc_attr( $item['alt'] ?? '' ); ?>">
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
