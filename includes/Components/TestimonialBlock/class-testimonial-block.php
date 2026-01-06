<?php
/**
 * Testimonial Block Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\TestimonialBlock;

use Polymorphic\Components\Component_Base;

/**
 * Testimonial slider/grid component (Organism).
 *
 * @since 1.0.0
 */
class Testimonial_Block extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'testimonialBlock';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Testimonials', 'polymorphic' );
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
        return 'format-quote';
    }

    /**
     * Get default component props.
     *
     * @return array
     */
    public function get_defaults(): array {
        return [
            'title'    => '',
            'subtitle' => '',
            'items'    => [],
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
        $classes = [ 'poly-testimonial-block' ];

        // Add generated class for dynamic styles.
        $generated_class = $this->get_generated_class( $component, $context );
        if ( ! empty( $generated_class ) ) {
            $classes[] = $generated_class;
        }

        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        // Default items fallback for initial display if needed (though React handles it mostly)
        // Usually PHP side renders empty if no items, but let's be robust.
        if ( empty( $items ) ) {
           // We could return empty or default content. Let's return empty to avoid clutter if unset.
        }

        ob_start();
        ?>
        <div <?php echo $this->build_attributes( $attrs ); ?>>
            <?php if ( ! empty( $props['title'] ) || ! empty( $props['subtitle'] ) ) : ?>
                <div class="poly-testimonial-block__header">
                    <?php if ( ! empty( $props['title'] ) ) : ?>
                        <h2 class="poly-testimonial-block__title"><?php echo esc_html( $props['title'] ); ?></h2>
                    <?php endif; ?>
                    <?php if ( ! empty( $props['subtitle'] ) ) : ?>
                        <p class="poly-testimonial-block__subtitle"><?php echo esc_html( $props['subtitle'] ); ?></p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <div class="poly-testimonial-block__grid">
                <?php foreach ( $items as $item ) : ?>
                    <div class="poly-testimonial-card">
                        <div class="poly-testimonial-card__rating">
                            <?php for ( $i = 0; $i < 5; $i++ ) : ?>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="<?php echo $i < ( $item['rating'] ?? 5 ) ? 'currentColor' : 'none'; ?>" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            <?php endfor; ?>
                        </div>
                        <blockquote class="poly-testimonial-card__content">
                            "<?php echo esc_html( $item['content'] ?? '' ); ?>"
                        </blockquote>
                        <div class="poly-testimonial-card__author">
                            <div class="poly-testimonial-card__avatar">
                                <svg class="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <div class="poly-testimonial-card__info">
                                <span class="poly-testimonial-card__name"><?php echo esc_html( $item['author'] ?? '' ); ?></span>
                                <span class="poly-testimonial-card__role"><?php echo esc_html( $item['role'] ?? '' ); ?></span>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
