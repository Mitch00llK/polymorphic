<?php
/**
 * Image Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Image;

use Polymorphic\Components\Component_Base;

/**
 * Responsive image component (Atom).
 *
 * @since 1.0.0
 */
class Image extends Component_Base {

    /**
     * Get component type.
     *
     * @return string
     */
    public function get_type(): string {
        return 'image';
    }

    /**
     * Get component label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Image', 'polymorphic' );
    }

    /**
     * Get component category.
     *
     * @return string
     */
    public function get_category(): string {
        return 'media';
    }

    /**
     * Get component icon.
     *
     * @return string
     */
    public function get_icon(): string {
        return 'image';
    }

    /**
     * Whether this component supports children.
     *
     * @return bool
     */
    public function supports_children(): bool {
        return false;
    }

    /**
     * Get default component props.
     *
     * @return array
     */
    public function get_defaults(): array {
        return [
            'src'             => '',
            'alt'             => '',
            'caption'         => '',
            'width'           => '',
            'height'          => '',
            'maxWidth'        => '100%',
            'objectFit'       => 'cover',
            'objectPosition'  => 'center',
            'borderRadius'    => '',
            'style'           => 'default',
            'align'           => 'none',
            'lazyLoad'        => true,
            'linkUrl'         => '',
            'linkTarget'      => '_self',
            'marginTop'       => '0',
            'marginBottom'    => '1rem',
            'className'       => '',
            'htmlId'          => '',
        ];
    }

    /**
     * Render the component.
     *
     * @param array  $component Component data.
     * @param string $context   Render context (frontend|preview|editor).
     * @return string Rendered HTML.
     */
    public function render( array $component, string $context = 'frontend' ): string {
        $props = $this->merge_defaults( $component['props'] ?? [] );
        $id    = $component['id'] ?? '';

        // Return placeholder if no image.
        if ( empty( $props['src'] ) ) {
            if ( 'editor' === $context || 'preview' === $context ) {
                return '<figure class="image image--placeholder"><div class="image__placeholder">Select an image</div></figure>';
            }
            return '';
        }

        // Build figure CSS classes (generic, no 'polymorphic-' prefix).
        $classes = [ 'image' ];

        if ( ! empty( $props['style'] ) && 'default' !== $props['style'] ) {
            $classes[] = 'image--' . sanitize_html_class( $props['style'] );
        }

        if ( ! empty( $props['align'] ) && 'none' !== $props['align'] ) {
            $classes[] = 'image--align-' . sanitize_html_class( $props['align'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Build figure inline styles.
        $figure_styles = [];

        if ( ! empty( $props['marginTop'] ) && '0' !== $props['marginTop'] ) {
            $figure_styles[] = 'margin-top:' . esc_attr( $props['marginTop'] );
        }

        if ( ! empty( $props['marginBottom'] ) && '1rem' !== $props['marginBottom'] ) {
            $figure_styles[] = 'margin-bottom:' . esc_attr( $props['marginBottom'] );
        }

        if ( ! empty( $props['maxWidth'] ) && '100%' !== $props['maxWidth'] ) {
            $figure_styles[] = 'max-width:' . esc_attr( $props['maxWidth'] );
        }

        // Build img inline styles.
        $img_styles = [];

        if ( ! empty( $props['objectFit'] ) ) {
            $img_styles[] = 'object-fit:' . esc_attr( $props['objectFit'] );
        }

        if ( ! empty( $props['objectPosition'] ) && 'center' !== $props['objectPosition'] ) {
            $img_styles[] = 'object-position:' . esc_attr( $props['objectPosition'] );
        }

        if ( ! empty( $props['borderRadius'] ) ) {
            $img_styles[] = 'border-radius:' . esc_attr( $props['borderRadius'] );
        }

        // Build figure attributes.
        $figure_attrs = [
            'class' => implode( ' ', $classes ),
        ];

        if ( ! empty( $figure_styles ) ) {
            $figure_attrs['style'] = implode( ';', $figure_styles );
        }

        if ( ! empty( $props['htmlId'] ) ) {
            $figure_attrs['id'] = sanitize_html_class( $props['htmlId'] );
        } elseif ( ! empty( $id ) ) {
            $figure_attrs['data-component-id'] = esc_attr( $id );
        }

        // Build img attributes.
        $img_attrs = [
            'src'   => esc_url( $props['src'] ),
            'alt'   => esc_attr( $props['alt'] ),
            'class' => 'image__img',
        ];

        if ( ! empty( $img_styles ) ) {
            $img_attrs['style'] = implode( ';', $img_styles );
        }

        if ( ! empty( $props['width'] ) ) {
            $img_attrs['width'] = esc_attr( $props['width'] );
        }

        if ( ! empty( $props['height'] ) ) {
            $img_attrs['height'] = esc_attr( $props['height'] );
        }

        if ( $props['lazyLoad'] ) {
            $img_attrs['loading'] = 'lazy';
        }

        // Build HTML.
        $html = '<figure ' . $this->build_attributes( $figure_attrs ) . '>';

        // Wrap in link if URL provided.
        if ( ! empty( $props['linkUrl'] ) ) {
            $link_attrs = [
                'href'   => esc_url( $props['linkUrl'] ),
                'class'  => 'image__link',
            ];

            if ( '_blank' === $props['linkTarget'] ) {
                $link_attrs['target'] = '_blank';
                $link_attrs['rel']    = 'noopener noreferrer';
            }

            $html .= '<a ' . $this->build_attributes( $link_attrs ) . '>';
        }

        $html .= '<img ' . $this->build_attributes( $img_attrs ) . '>';

        if ( ! empty( $props['linkUrl'] ) ) {
            $html .= '</a>';
        }

        // Caption.
        if ( ! empty( $props['caption'] ) ) {
            $html .= '<figcaption class="image__caption">' . esc_html( $props['caption'] ) . '</figcaption>';
        }

        $html .= '</figure>';

        return $html;
    }
}
