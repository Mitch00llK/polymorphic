<?php
/**
 * Stats Block Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\StatsBlock;

use Polymorphic\Components\Component_Base;

/**
 * Stats grid component (Organism).
 *
 * @since 1.0.0
 */
class Stats_Block extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'statsBlock';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Stats Grid', 'polymorphic' );
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
        return 'chart-bar';
    }

    /**
     * Get default component props.
     *
     * @return array
     */
    public function get_defaults(): array {
        return [
            'columns' => 4,
            'items'   => [],
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
        $classes = [ 'poly-stats-block' ];

        // Add generated class.
        $generated_class = $this->get_generated_class( $component, $context );
        if ( ! empty( $generated_class ) ) {
            $classes[] = $generated_class;
        }

        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
            'style'             => '--poly-columns: ' . esc_attr( $props['columns'] ),
        ];

        ob_start();
        ?>
        <div <?php echo $this->build_attributes( $attrs ); ?>>
            <div class="poly-stats-block__grid">
                <?php foreach ( $items as $item ) : ?>
                    <div class="poly-stats-item">
                        <span class="poly-stats-item__value"><?php echo esc_html( $item['value'] ?? '' ); ?></span>
                        <span class="poly-stats-item__label"><?php echo esc_html( $item['label'] ?? '' ); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
