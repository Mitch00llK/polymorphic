# Database Schema & Storage Strategy

This document defines the database storage approach for Polymorphic, designed for minimal footprint and maximum performance.

---

## Storage Philosophy

> **One postmeta, zero tables.** 

Unlike Elementor's fragmented approach with custom tables and excessive revisions, Polymorphic stores everything in a single structured JSON field.

### Design Principles

1. **Single Source of Truth** - All builder data in `_polymorphic_data`
2. **No Custom Tables** - Uses only WordPress postmeta
3. **Minimal Revisions** - Controlled via settings, not automatic
4. **Transient Caching** - Pre-rendered HTML cached for performance
5. **Version Tracking** - Migration-ready schema versioning

---

## Primary Storage

### Postmeta Keys

| Key | Type | Description |
|-----|------|-------------|
| `_polymorphic_data` | JSON | Complete builder data |
| `_polymorphic_version` | string | Schema version (e.g., "1.0.0") |
| `_polymorphic_enabled` | boolean | Whether builder is active for this post |
| `_polymorphic_styles` | JSON | Generated CSS (optional, can be inline) |
| `_polymorphic_cache_key` | string | Cache invalidation key |

---

## JSON Schema

### Root Structure

```json
{
  "$schema": "https://polymorphic.dev/schema/v1.json",
  "version": "1.0.0",
  "created": "2026-01-05T19:45:24Z",
  "modified": "2026-01-05T20:30:00Z",
  "settings": {
    "pageBackground": "#ffffff",
    "contentWidth": "1200px",
    "bodyFont": "Inter, sans-serif",
    "headingFont": "Inter, sans-serif"
  },
  "components": [
    // Component tree
  ],
  "customCss": "",
  "customJs": ""
}
```

### Component Structure

```json
{
  "id": "comp_a1b2c3d4",
  "type": "section",
  "props": {
    "backgroundColor": "#f8f9fa",
    "paddingTop": "60px",
    "paddingBottom": "60px"
  },
  "responsive": {
    "tablet": {
      "paddingTop": "40px",
      "paddingBottom": "40px"
    },
    "mobile": {
      "paddingTop": "24px",
      "paddingBottom": "24px"
    }
  },
  "children": [
    {
      "id": "comp_e5f6g7h8",
      "type": "container",
      "props": {
        "maxWidth": "1200px",
        "alignment": "center"
      },
      "children": [
        {
          "id": "comp_i9j0k1l2",
          "type": "heading",
          "props": {
            "content": "Welcome to Polymorphic",
            "level": "h1",
            "textAlign": "center",
            "fontSize": "48px",
            "color": "#1a1a1a"
          },
          "responsive": {
            "mobile": {
              "fontSize": "32px"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Complete Example

Here's a full example of what gets stored in `_polymorphic_data`:

```json
{
  "version": "1.0.0",
  "created": "2026-01-05T19:45:24Z",
  "modified": "2026-01-05T20:30:00Z",
  "settings": {
    "pageBackground": "#ffffff",
    "contentWidth": "1200px",
    "bodyFont": "Inter, system-ui, sans-serif",
    "headingFont": "Inter, system-ui, sans-serif",
    "primaryColor": "#6366f1",
    "secondaryColor": "#4f46e5"
  },
  "components": [
    {
      "id": "sec_hero_001",
      "type": "section",
      "props": {
        "width": "full",
        "minHeight": "80vh",
        "backgroundColor": "#f8fafc",
        "paddingTop": "80px",
        "paddingBottom": "80px",
        "verticalAlign": "center"
      },
      "responsive": {
        "tablet": {
          "minHeight": "60vh",
          "paddingTop": "60px",
          "paddingBottom": "60px"
        },
        "mobile": {
          "minHeight": "auto",
          "paddingTop": "40px",
          "paddingBottom": "40px"
        }
      },
      "children": [
        {
          "id": "con_hero_inner",
          "type": "container",
          "props": {
            "maxWidth": "1000px",
            "alignment": "center",
            "direction": "column",
            "alignItems": "center",
            "gap": "24px"
          },
          "children": [
            {
              "id": "hdg_hero_title",
              "type": "heading",
              "props": {
                "content": "Build Beautiful Pages",
                "level": "h1",
                "fontSize": "56px",
                "fontWeight": "700",
                "textAlign": "center",
                "color": "#0f172a",
                "letterSpacing": "-0.02em",
                "lineHeight": "1.1"
              },
              "responsive": {
                "tablet": {
                  "fontSize": "42px"
                },
                "mobile": {
                  "fontSize": "32px"
                }
              }
            },
            {
              "id": "txt_hero_subtitle",
              "type": "text",
              "props": {
                "content": "<p>The lightweight, powerful page builder that adapts to the way you work. No bloat, no complexity—just beautiful results.</p>",
                "fontSize": "20px",
                "textAlign": "center",
                "color": "#64748b",
                "lineHeight": "1.6",
                "marginTop": "0",
                "marginBottom": "8px"
              },
              "responsive": {
                "mobile": {
                  "fontSize": "16px"
                }
              }
            },
            {
              "id": "btn_hero_cta",
              "type": "button",
              "props": {
                "text": "Get Started Free",
                "url": "/signup",
                "target": "_self",
                "variant": "solid",
                "size": "large",
                "backgroundColor": "#6366f1",
                "textColor": "#ffffff",
                "borderRadius": "8px",
                "fontWeight": "600",
                "hoverBackgroundColor": "#4f46e5",
                "align": "center",
                "marginTop": "8px"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "sec_features",
      "type": "section",
      "props": {
        "width": "full",
        "backgroundColor": "#ffffff",
        "paddingTop": "100px",
        "paddingBottom": "100px"
      },
      "children": [
        {
          "id": "con_features",
          "type": "container",
          "props": {
            "maxWidth": "1200px",
            "alignment": "center",
            "direction": "column",
            "gap": "48px"
          },
          "children": [
            {
              "id": "hdg_features_title",
              "type": "heading",
              "props": {
                "content": "Why Polymorphic?",
                "level": "h2",
                "fontSize": "40px",
                "fontWeight": "700",
                "textAlign": "center",
                "color": "#0f172a"
              }
            },
            {
              "id": "img_features",
              "type": "image",
              "props": {
                "src": "/wp-content/uploads/features-screenshot.jpg",
                "alt": "Polymorphic builder interface showing drag and drop",
                "maxWidth": "100%",
                "borderRadius": "12px",
                "boxShadow": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                "align": "center"
              }
            }
          ]
        }
      ]
    }
  ],
  "customCss": "",
  "customJs": ""
}
```

---

## ID Generation

Component IDs use a prefixed format for clarity and uniqueness:

```typescript
const generateId = (type: ComponentType): string => {
  const prefixes: Record<ComponentType, string> = {
    section: 'sec',
    container: 'con',
    heading: 'hdg',
    text: 'txt',
    image: 'img',
    button: 'btn',
  };

  const prefix = prefixes[type] || 'cmp';
  const uniquePart = nanoid(8); // e.g., "a1b2c3d4"

  return `${prefix}_${uniquePart}`;
};

// Examples:
// sec_a1b2c3d4 - Section
// hdg_e5f6g7h8 - Heading
// btn_i9j0k1l2 - Button
```

---

## PHP Storage Implementation

### Saving Data

```php
<?php
namespace Polymorphic\Api;

use WP_Error;
use WP_REST_Request;

class Save_Endpoint {

    /**
     * Save builder data for a post.
     *
     * @param WP_REST_Request $request Full request data.
     * @return WP_REST_Response|WP_Error
     */
    public function handle( WP_REST_Request $request ) {
        $post_id = $request->get_param( 'post_id' );
        $data    = $request->get_param( 'data' );

        // Validate post exists and user can edit.
        if ( ! $this->validate_post( $post_id ) ) {
            return new WP_Error(
                'invalid_post',
                __( 'Invalid post or insufficient permissions.', 'polymorphic' ),
                [ 'status' => 403 ]
            );
        }

        // Sanitize and validate the component tree.
        $sanitized = $this->sanitize_builder_data( $data );

        if ( is_wp_error( $sanitized ) ) {
            return $sanitized;
        }

        // Add metadata.
        $sanitized['modified'] = current_time( 'c' );
        if ( empty( $sanitized['created'] ) ) {
            $sanitized['created'] = current_time( 'c' );
        }

        // Save to postmeta.
        $success = update_post_meta(
            $post_id,
            '_polymorphic_data',
            wp_json_encode( $sanitized, JSON_UNESCAPED_SLASHES )
        );

        // Update version if needed.
        update_post_meta( $post_id, '_polymorphic_version', POLYMORPHIC_SCHEMA_VERSION );
        update_post_meta( $post_id, '_polymorphic_enabled', true );

        // Invalidate cache.
        $this->invalidate_cache( $post_id );

        /**
         * Fires after builder data is saved.
         *
         * @param int   $post_id Post ID.
         * @param array $sanitized Saved data.
         */
        do_action( 'polymorphic/save/after', $post_id, $sanitized );

        return rest_ensure_response([
            'success' => true,
            'message' => __( 'Saved successfully.', 'polymorphic' ),
            'data'    => [
                'modified' => $sanitized['modified'],
            ],
        ]);
    }

    /**
     * Sanitize builder data recursively.
     *
     * @param array $data Raw builder data.
     * @return array|WP_Error Sanitized data or error.
     */
    private function sanitize_builder_data( array $data ): array|WP_Error {
        $sanitized = [
            'version'   => sanitize_text_field( $data['version'] ?? POLYMORPHIC_SCHEMA_VERSION ),
            'created'   => sanitize_text_field( $data['created'] ?? '' ),
            'modified'  => '',
            'settings'  => $this->sanitize_settings( $data['settings'] ?? [] ),
            'components'=> $this->sanitize_components( $data['components'] ?? [] ),
            'customCss' => wp_strip_all_tags( $data['customCss'] ?? '' ),
            'customJs'  => '', // Disabled by default for security.
        ];

        return $sanitized;
    }

    /**
     * Recursively sanitize components.
     *
     * @param array $components Components array.
     * @return array Sanitized components.
     */
    private function sanitize_components( array $components ): array {
        $sanitized = [];

        foreach ( $components as $component ) {
            $clean = [
                'id'    => sanitize_key( $component['id'] ?? '' ),
                'type'  => sanitize_key( $component['type'] ?? '' ),
                'props' => $this->sanitize_props( $component['type'], $component['props'] ?? [] ),
            ];

            // Handle responsive overrides.
            if ( ! empty( $component['responsive'] ) ) {
                $clean['responsive'] = [];
                foreach ( [ 'tablet', 'mobile' ] as $breakpoint ) {
                    if ( ! empty( $component['responsive'][ $breakpoint ] ) ) {
                        $clean['responsive'][ $breakpoint ] = $this->sanitize_props(
                            $component['type'],
                            $component['responsive'][ $breakpoint ]
                        );
                    }
                }
            }

            // Recursively sanitize children.
            if ( ! empty( $component['children'] ) ) {
                $clean['children'] = $this->sanitize_components( $component['children'] );
            }

            $sanitized[] = $clean;
        }

        return $sanitized;
    }

    /**
     * Invalidate transient cache.
     *
     * @param int $post_id Post ID.
     */
    private function invalidate_cache( int $post_id ): void {
        delete_transient( "polymorphic_rendered_{$post_id}" );
        delete_transient( "polymorphic_styles_{$post_id}" );

        // Generate new cache key.
        update_post_meta( $post_id, '_polymorphic_cache_key', wp_generate_password( 8, false ) );
    }
}
```

### Loading Data

```php
<?php
namespace Polymorphic\Core;

class Data_Loader {

    /**
     * Get builder data for a post.
     *
     * @param int $post_id Post ID.
     * @return array|null Builder data or null if not set.
     */
    public function get_data( int $post_id ): ?array {
        $raw = get_post_meta( $post_id, '_polymorphic_data', true );

        if ( empty( $raw ) ) {
            return null;
        }

        $data = json_decode( $raw, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return null;
        }

        // Check if migration needed.
        $version = get_post_meta( $post_id, '_polymorphic_version', true );
        if ( version_compare( $version, POLYMORPHIC_SCHEMA_VERSION, '<' ) ) {
            $data = $this->migrate_data( $data, $version );
        }

        /**
         * Filter the loaded builder data.
         *
         * @param array $data    Builder data.
         * @param int   $post_id Post ID.
         */
        return apply_filters( 'polymorphic/data/loaded', $data, $post_id );
    }

    /**
     * Check if builder is enabled for post.
     *
     * @param int $post_id Post ID.
     * @return bool
     */
    public function is_enabled( int $post_id ): bool {
        return (bool) get_post_meta( $post_id, '_polymorphic_enabled', true );
    }

    /**
     * Migrate data from older schema versions.
     *
     * @param array  $data    Current data.
     * @param string $version Current version.
     * @return array Migrated data.
     */
    private function migrate_data( array $data, string $version ): array {
        // Future migration logic here.
        // Each version upgrade should have its own migration method.
        
        return $data;
    }
}
```

---

## Caching Strategy

### Transient-Based Caching

```php
<?php
namespace Polymorphic\Cache;

class Transient_Cache {

    /** @var int Cache duration in seconds (1 week). */
    private const TTL = WEEK_IN_SECONDS;

    /**
     * Get cached rendered HTML.
     *
     * @param int $post_id Post ID.
     * @return string|false Cached HTML or false.
     */
    public function get_rendered( int $post_id ) {
        $cache_key = $this->get_cache_key( $post_id );
        return get_transient( "polymorphic_rendered_{$cache_key}" );
    }

    /**
     * Cache rendered HTML.
     *
     * @param int    $post_id Post ID.
     * @param string $html    Rendered HTML.
     */
    public function set_rendered( int $post_id, string $html ): void {
        $cache_key = $this->get_cache_key( $post_id );
        set_transient( "polymorphic_rendered_{$cache_key}", $html, self::TTL );
    }

    /**
     * Get cached component styles.
     *
     * @param int $post_id Post ID.
     * @return string|false Cached CSS or false.
     */
    public function get_styles( int $post_id ) {
        $cache_key = $this->get_cache_key( $post_id );
        return get_transient( "polymorphic_styles_{$cache_key}" );
    }

    /**
     * Cache component styles.
     *
     * @param int    $post_id Post ID.
     * @param string $css     Generated CSS.
     */
    public function set_styles( int $post_id, string $css ): void {
        $cache_key = $this->get_cache_key( $post_id );
        set_transient( "polymorphic_styles_{$cache_key}", $css, self::TTL );
    }

    /**
     * Invalidate all caches for a post.
     *
     * @param int $post_id Post ID.
     */
    public function invalidate( int $post_id ): void {
        $cache_key = $this->get_cache_key( $post_id );

        delete_transient( "polymorphic_rendered_{$cache_key}" );
        delete_transient( "polymorphic_styles_{$cache_key}" );

        // Generate new cache key.
        update_post_meta( $post_id, '_polymorphic_cache_key', wp_generate_password( 8, false ) );

        /**
         * Fires when cache is invalidated.
         *
         * @param int $post_id Post ID.
         */
        do_action( 'polymorphic/cache/invalidated', $post_id );
    }

    /**
     * Get unique cache key for a post.
     *
     * @param int $post_id Post ID.
     * @return string Cache key.
     */
    private function get_cache_key( int $post_id ): string {
        $key = get_post_meta( $post_id, '_polymorphic_cache_key', true );

        if ( empty( $key ) ) {
            $key = wp_generate_password( 8, false );
            update_post_meta( $post_id, '_polymorphic_cache_key', $key );
        }

        return $post_id . '_' . $key;
    }
}
```

---

## Size Optimization

### Compressed Storage Option

For very large pages, optional compression:

```php
/**
 * Optionally compress large data.
 *
 * @param string $json JSON string.
 * @return string Possibly compressed string.
 */
private function maybe_compress( string $json ): string {
    // Only compress if > 100KB.
    if ( strlen( $json ) < 100000 ) {
        return $json;
    }

    if ( function_exists( 'gzcompress' ) ) {
        return base64_encode( gzcompress( $json, 9 ) );
    }

    return $json;
}

/**
 * Decompress if needed.
 *
 * @param string $data Stored data.
 * @return string Original JSON.
 */
private function maybe_decompress( string $data ): string {
    // Check if starts with common gzipped base64 prefix.
    if ( str_starts_with( $data, 'eJy' ) && function_exists( 'gzuncompress' ) ) {
        $decoded = base64_decode( $data );
        if ( $decoded !== false ) {
            $uncompressed = @gzuncompress( $decoded );
            if ( $uncompressed !== false ) {
                return $uncompressed;
            }
        }
    }

    return $data;
}
```

---

## Query Performance

### Adding Indexes

When querying posts with Polymorphic data:

```php
/**
 * Query posts with builder enabled.
 *
 * @param array $args WP_Query args.
 * @return WP_Query
 */
public function query_builder_posts( array $args = [] ): WP_Query {
    $defaults = [
        'post_type'      => 'any',
        'posts_per_page' => 20,
        'meta_query'     => [
            [
                'key'   => '_polymorphic_enabled',
                'value' => '1',
            ],
        ],
    ];

    return new WP_Query( wp_parse_args( $args, $defaults ) );
}
```

### Database Cleanup

```php
/**
 * Clean up orphaned builder data (on plugin uninstall).
 */
public function cleanup_orphaned_data(): void {
    global $wpdb;

    // Delete all polymorphic postmeta.
    $wpdb->query(
        "DELETE FROM {$wpdb->postmeta} 
         WHERE meta_key LIKE '_polymorphic_%'"
    );

    // Delete all transients.
    $wpdb->query(
        "DELETE FROM {$wpdb->options} 
         WHERE option_name LIKE '_transient_polymorphic_%' 
         OR option_name LIKE '_transient_timeout_polymorphic_%'"
    );
}
```

---

## TypeScript Interfaces

For frontend type safety:

```typescript
// types/schema.ts

export interface BuilderData {
  version: string;
  created: string;
  modified: string;
  settings: PageSettings;
  components: ComponentData[];
  customCss: string;
  customJs: string;
}

export interface PageSettings {
  pageBackground: string;
  contentWidth: string;
  bodyFont: string;
  headingFont: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface ComponentData {
  id: string;
  type: ComponentType;
  props: Record<string, unknown>;
  responsive?: {
    tablet?: Partial<Record<string, unknown>>;
    mobile?: Partial<Record<string, unknown>>;
  };
  children?: ComponentData[];
}

export type ComponentType =
  | 'section'
  | 'container'
  | 'heading'
  | 'text'
  | 'image'
  | 'button';
```
