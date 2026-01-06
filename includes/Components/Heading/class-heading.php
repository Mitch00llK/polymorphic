<?php
/**
 * Heading Component.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components\Heading;

use Polymorphic\Components\Component_Base;
use Polymorphic\Helpers\Sanitizer;

/**
 * Heading component class.
 *
 * @since 1.0.0
 */
class Heading extends Component_Base {

    /**
     * Component type identifier.
     */
    public const TYPE = 'heading';

    /**
     * Default property values.
     *
     * @var array
     */
    protected array $defaults = [
        'content'       => 'New Heading',
        'tag'           => 'h2',
        'level'         => 'h2', // Alias for tag.
        'textAlign'     => '',
        'color'         => '',
        'fontSize'      => '',
        'fontWeight'    => '',
        'fontFamily'    => '',
        'lineHeight'    => '',
        'letterSpacing' => '',
        'textTransform' => '',
        'marginTop'     => '',
        'marginBottom'  => '',
    ];

    /**
     * Get the component type.
     *
     * @return string
     */
    public function get_type(): string {
        return self::TYPE;
    }

    /**
     * Get the human-readable label.
     *
     * @return string
     */
    public function get_label(): string {
        return __( 'Heading', 'polymorphic' );
    }

    /**
     * Get the component category.
     *
     * @return string
     */
    public function get_category(): string {
        return 'content';
    }

    /**
     * Get the icon name.
     *
     * @return string
     */
    public function get_icon(): string {
        return 'type';
    }

    /**
     * Render the heading component.
     *
     * @since 1.0.0
     *
     * @param array  $data    Component data.
     * @param string $context Render context.
     * @return string Rendered HTML.
     */
    public function render( array $data, string $context = 'frontend' ): string {
        $props = $this->parse_props( $data['props'] ?? [] );
        $id    = esc_attr( $data['id'] ?? '' );

        // Sanitize heading tag (support both 'tag' and 'level' props).
        $tag = Sanitizer::sanitize_heading_tag( $props['tag'] ?: $props['level'] );

        // Build CSS variables for clean DOM.
        $css_vars = $this->build_css_variables( $props, [
            'textAlign'     => 'text-align',
            'color'         => 'color',
            'fontSize'      => 'font-size',
            'fontWeight'    => 'font-weight',
            'fontFamily'    => 'font-family',
            'lineHeight'    => 'line-height',
            'letterSpacing' => 'letter-spacing',
            'textTransform' => 'text-transform',
            'marginTop'     => 'margin-top',
            'marginBottom'  => 'margin-bottom',
        ]);

        // Build classes using poly-* naming convention.
        $classes = $this->build_classes(
            [ 'poly-heading', "poly-heading--{$tag}" ],
            []
        );

        // Escape content.
        $content = esc_html( $props['content'] );

        // Wrap in link if provided.
        if ( ! empty( $props['link']['url'] ) ) {
            $content = sprintf(
                '<a href="%s" target="%s"%s>%s</a>',
                esc_url( $props['link']['url'] ),
                esc_attr( $props['link']['target'] ?? '_self' ),
                ! empty( $props['link']['rel'] ) ? ' rel="' . esc_attr( $props['link']['rel'] ) . '"' : '',
                $content
            );
        }

        // Build style attribute (only if we have CSS variables).
        $style_attr = ! empty( $css_vars ) ? sprintf( ' style="%s"', esc_attr( $css_vars ) ) : '';

        return sprintf(
            '<%1$s class="%2$s" data-component-id="%3$s"%4$s>%5$s</%1$s>',
            $tag,
            $classes,
            $id,
            $style_attr,
            $content
        );
    }
}
