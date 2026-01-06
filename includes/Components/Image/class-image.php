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
            'src'            => '',
            'alt'            => '',
            'caption'        => '',
            'width'          => '',
            'height'         => '',
            'maxWidth'       => '',
            'objectFit'      => 'cover',
            'objectPosition' => 'center',
            'borderRadius'   => '',
            'style'          => 'default',
            'align'          => 'none',
            'lazyLoad'       => true,
            'linkUrl'        => '',
            'linkTarget'     => '_self',
            'marginTop'      => '',
            'marginBottom'   => '',
            'className'      => '',
            'htmlId'         => '',
        ];
    }

    /**
     * Render the component.
     *
     * @param array        $component Component data.
     * @param string|array $context   Render context (frontend|preview|editor).
     * @return string Rendered HTML.
     */
    public function render( array $component, $context = 'frontend' ): string {
        $props = $this->merge_defaults( $component['props'] ?? [] );
        $id    = $component['id'] ?? '';
        $ctx   = $this->normalize_context( $context );

        // Return placeholder if no image.
        if ( empty( $props['src'] ) ) {
            if ( 'editor' === $ctx['mode'] || 'preview' === $ctx['mode'] ) {
                return '<figure class="poly-image poly-image--placeholder" data-component-id="' . esc_attr( $id ) . '"><div class="poly-image__placeholder">Select an image</div></figure>';
            }
            return '';
        }

        // Build figure CSS classes using poly-* convention.
        $classes = [ 'poly-image' ];

        if ( ! empty( $props['style'] ) && 'default' !== $props['style'] ) {
            $classes[] = 'poly-image--' . sanitize_html_class( $props['style'] );
        }

        if ( ! empty( $props['align'] ) && 'none' !== $props['align'] ) {
            $classes[] = 'poly-image--align-' . sanitize_html_class( $props['align'] );
        }

        if ( ! empty( $props['className'] ) ) {
            $classes[] = sanitize_html_class( $props['className'] );
        }

        // Add generated class for frontend (zero inline styles).
        $generated_class = $this->get_generated_class( $component, $context );
        if ( ! empty( $generated_class ) ) {
            $classes[] = $generated_class;
        }

        // Build figure attributes.
        $figure_attrs = [
            'class' => implode( ' ', $classes ),
        ];

        if ( ! empty( $props['htmlId'] ) ) {
            $figure_attrs['id'] = sanitize_html_class( $props['htmlId'] );
        }

        $figure_attrs['data-component-id'] = esc_attr( $id );

        // Build img attributes.
        $img_attrs = [
            'src'   => esc_url( $props['src'] ),
            'alt'   => esc_attr( $props['alt'] ),
            'class' => 'poly-image__img',
        ];

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
                'href'  => esc_url( $props['linkUrl'] ),
                'class' => 'poly-image__link',
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
            $html .= '<figcaption class="poly-image__caption">' . esc_html( $props['caption'] ) . '</figcaption>';
        }

        $html .= '</figure>';

        return $html;
    }
}
