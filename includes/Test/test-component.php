<?php
/**
 * Test Component for API Verification.
 *
 * A simple counter component to test the third-party registration API.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

// Hook into polymorphic initialization.
add_action( 'polymorphic/init', 'polymorphic_register_test_component' );

/**
 * Register the test counter component.
 */
function polymorphic_register_test_component(): void {
    polymorphic_register_component( [
        'type'     => 'test/counter',
        'label'    => 'Counter (API Test)',
        'icon'     => 'hash',
        'category' => 'ui',
        'source'   => 'polymorphic-test',

        // Supported features in PropertyPanel.
        'supports' => [ 'spacing', 'boxStyle', 'typography' ],

        // Default property values.
        'default_props' => [
            'title'       => 'Our Stats',
            'count'       => 100,
            'prefix'      => '',
            'suffix'      => '+',
            'description' => 'Happy customers',
            'accentColor' => '#3b82f6',
        ],

        // CSS assets.
        'assets' => [
            'css' => [
                'inline' => '
.poly-test-counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.poly-test-counter__title {
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 1rem;
}

.poly-test-counter__value {
    font-size: 4rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 0.5rem;
}

.poly-test-counter__description {
    font-size: 1.125rem;
    color: #475569;
}
                ',
                'url' => null,
            ],
            'js' => [
                'editor'   => null,
                'frontend' => null,
            ],
        ],

        // PHP render callback.
        'render_callback' => function( $component, $context ) {
            $props = wp_parse_args( $component['props'] ?? [], [
                'title'       => 'Our Stats',
                'count'       => 100,
                'prefix'      => '',
                'suffix'      => '+',
                'description' => 'Happy customers',
                'accentColor' => '#3b82f6',
            ] );

            $id          = esc_attr( $component['id'] ?? uniqid( 'counter-' ) );
            $title       = esc_html( $props['title'] );
            $count       = intval( $props['count'] );
            $prefix      = esc_html( $props['prefix'] );
            $suffix      = esc_html( $props['suffix'] );
            $description = esc_html( $props['description'] );
            $color       = esc_attr( $props['accentColor'] );

            ob_start();
            ?>
            <div class="poly-test-counter" data-component-id="<?php echo $id; ?>">
                <?php if ( $title ) : ?>
                    <div class="poly-test-counter__title"><?php echo $title; ?></div>
                <?php endif; ?>
                
                <div class="poly-test-counter__value" style="color: <?php echo $color; ?>">
                    <?php echo $prefix . number_format( $count ) . $suffix; ?>
                </div>
                
                <?php if ( $description ) : ?>
                    <div class="poly-test-counter__description"><?php echo $description; ?></div>
                <?php endif; ?>
            </div>
            <?php
            return ob_get_clean();
        },
    ] );
}
