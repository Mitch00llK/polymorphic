# REST API & Hooks Reference

This document defines all REST API endpoints and action/filter hooks available in Polymorphic.

---

## REST API

### Base URL

```
/wp-json/polymorphic/v1/
```

### Authentication

All endpoints require authentication via:
- WordPress nonce (for logged-in users)
- Application passwords (for external integrations)

### Common Headers

```http
X-WP-Nonce: {nonce}
Content-Type: application/json
```

---

## Endpoints

### Save Builder Data

Saves the complete builder data for a post.

```http
POST /wp-json/polymorphic/v1/posts/{post_id}/builder
```

**Request Body:**

```json
{
  "data": {
    "version": "1.0.0",
    "settings": {
      "pageBackground": "#ffffff",
      "contentWidth": "1200px"
    },
    "components": [
      {
        "id": "sec_a1b2c3d4",
        "type": "section",
        "props": { ... },
        "children": [ ... ]
      }
    ],
    "customCss": ""
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Saved successfully.",
  "data": {
    "modified": "2026-01-05T20:30:00Z",
    "cache_key": "abc12345"
  }
}
```

**Response (400):**

```json
{
  "code": "polymorphic_validation_error",
  "message": "Invalid component structure.",
  "data": {
    "status": 400,
    "errors": [
      {
        "component_id": "sec_a1b2c3d4",
        "field": "props.backgroundColor",
        "message": "Invalid color value."
      }
    ]
  }
}
```

---

### Load Builder Data

Retrieves builder data for a post.

```http
GET /wp-json/polymorphic/v1/posts/{post_id}/builder
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "created": "2026-01-05T19:45:24Z",
    "modified": "2026-01-05T20:30:00Z",
    "settings": { ... },
    "components": [ ... ],
    "customCss": ""
  },
  "meta": {
    "enabled": true,
    "cache_key": "abc12345"
  }
}
```

**Response (404):**

```json
{
  "code": "polymorphic_not_found",
  "message": "No builder data found for this post.",
  "data": {
    "status": 404
  }
}
```

---

### Get Component Defaults

Retrieves default properties for a component type.

```http
GET /wp-json/polymorphic/v1/components/{type}/defaults
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "type": "heading",
    "defaults": {
      "content": "New Heading",
      "level": "h2",
      "textAlign": "left",
      "fontWeight": "600",
      "marginTop": "0",
      "marginBottom": "20px"
    }
  }
}
```

---

### List Available Components

Lists all registered component types.

```http
GET /wp-json/polymorphic/v1/components
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "type": "section",
      "label": "Section",
      "category": "layout",
      "icon": "layout",
      "supports_children": true
    },
    {
      "type": "heading",
      "label": "Heading",
      "category": "content",
      "icon": "type",
      "supports_children": false
    }
  ]
}
```

---

### Upload Media

Uploads a media file and returns attachment data.

```http
POST /wp-json/polymorphic/v1/media
Content-Type: multipart/form-data
```

**Request:**

```
file: (binary)
post_id: 123 (optional, to attach to post)
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": 456,
    "url": "https://example.com/wp-content/uploads/2026/01/image.jpg",
    "alt": "",
    "width": 1920,
    "height": 1080,
    "sizes": {
      "thumbnail": "https://example.com/.../image-150x150.jpg",
      "medium": "https://example.com/.../image-300x200.jpg",
      "large": "https://example.com/.../image-1024x683.jpg",
      "full": "https://example.com/.../image.jpg"
    }
  }
}
```

---

### Render Preview

Renders builder data to HTML (for preview iframe).

```http
POST /wp-json/polymorphic/v1/preview
```

**Request Body:**

```json
{
  "post_id": 123,
  "data": { ... },
  "breakpoint": "desktop"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "html": "<section class=\"polymorphic-section\">...</section>",
    "css": ".polymorphic-section { ... }",
    "scripts": []
  }
}
```

---

### Get Post Types

Lists post types that support the builder.

```http
GET /wp-json/polymorphic/v1/settings/post-types
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "slug": "page",
      "label": "Pages",
      "enabled": true
    },
    {
      "slug": "post",
      "label": "Posts",
      "enabled": false
    },
    {
      "slug": "landing_page",
      "label": "Landing Pages",
      "enabled": true
    }
  ]
}
```

---

## PHP Implementation

### REST Controller

```php
<?php
namespace Polymorphic\Api;

use WP_REST_Controller;
use WP_REST_Server;

class Rest_Controller extends WP_REST_Controller {

    /**
     * Namespace for the REST API.
     *
     * @var string
     */
    protected $namespace = 'polymorphic/v1';

    /**
     * Register REST routes.
     */
    public function register_routes(): void {

        // Save builder data.
        register_rest_route(
            $this->namespace,
            '/posts/(?P<post_id>\d+)/builder',
            [
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'save_builder_data' ],
                    'permission_callback' => [ $this, 'check_edit_permission' ],
                    'args'                => $this->get_save_args(),
                ],
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_builder_data' ],
                    'permission_callback' => [ $this, 'check_read_permission' ],
                ],
            ]
        );

        // Component defaults.
        register_rest_route(
            $this->namespace,
            '/components/(?P<type>[a-z_-]+)/defaults',
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [ $this, 'get_component_defaults' ],
                'permission_callback' => [ $this, 'check_read_permission' ],
            ]
        );

        // List components.
        register_rest_route(
            $this->namespace,
            '/components',
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [ $this, 'list_components' ],
                'permission_callback' => [ $this, 'check_read_permission' ],
            ]
        );

        // Preview.
        register_rest_route(
            $this->namespace,
            '/preview',
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [ $this, 'render_preview' ],
                'permission_callback' => [ $this, 'check_edit_permission' ],
            ]
        );

        // Media upload.
        register_rest_route(
            $this->namespace,
            '/media',
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [ $this, 'upload_media' ],
                'permission_callback' => [ $this, 'check_upload_permission' ],
            ]
        );
    }

    /**
     * Check if user can edit the post.
     *
     * @param WP_REST_Request $request Request instance.
     * @return bool|WP_Error
     */
    public function check_edit_permission( $request ) {
        $post_id = $request->get_param( 'post_id' );

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return new WP_Error(
                'polymorphic_forbidden',
                __( 'You do not have permission to edit this post.', 'polymorphic' ),
                [ 'status' => 403 ]
            );
        }

        return true;
    }

    /**
     * Check if user can read builder data.
     *
     * @param WP_REST_Request $request Request instance.
     * @return bool|WP_Error
     */
    public function check_read_permission( $request ) {
        // For now, same as edit permission.
        // Could be relaxed for public preview.
        return $this->check_edit_permission( $request );
    }

    /**
     * Check if user can upload media.
     *
     * @return bool|WP_Error
     */
    public function check_upload_permission() {
        if ( ! current_user_can( 'upload_files' ) ) {
            return new WP_Error(
                'polymorphic_forbidden',
                __( 'You do not have permission to upload files.', 'polymorphic' ),
                [ 'status' => 403 ]
            );
        }

        return true;
    }

    /**
     * Get arguments for save endpoint.
     *
     * @return array
     */
    private function get_save_args(): array {
        return [
            'data' => [
                'required'          => true,
                'type'              => 'object',
                'sanitize_callback' => [ $this, 'sanitize_data' ],
                'validate_callback' => [ $this, 'validate_data' ],
            ],
        ];
    }
}
```

---

## JavaScript API Client

### API Utility

```typescript
// src/utils/api.ts

import apiFetch from '@wordpress/api-fetch';

const API_BASE = '/polymorphic/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface SaveResponse {
  modified: string;
  cache_key: string;
}

interface LoadResponse {
  version: string;
  created: string;
  modified: string;
  settings: PageSettings;
  components: ComponentData[];
  customCss: string;
}

/**
 * Save builder data.
 */
export const saveBuilderData = async (
  postId: number,
  data: BuilderData
): Promise<SaveResponse> => {
  const response = await apiFetch<ApiResponse<SaveResponse>>({
    path: `${API_BASE}/posts/${postId}/builder`,
    method: 'POST',
    data: { data },
  });

  if (!response.success) {
    throw new Error(response.message || 'Failed to save');
  }

  return response.data;
};

/**
 * Load builder data.
 */
export const loadBuilderData = async (
  postId: number
): Promise<LoadResponse | null> => {
  try {
    const response = await apiFetch<ApiResponse<LoadResponse>>({
      path: `${API_BASE}/posts/${postId}/builder`,
      method: 'GET',
    });

    return response.success ? response.data : null;
  } catch (error) {
    if ((error as any)?.code === 'polymorphic_not_found') {
      return null;
    }
    throw error;
  }
};

/**
 * Get component defaults.
 */
export const getComponentDefaults = async (
  type: string
): Promise<Record<string, unknown>> => {
  const response = await apiFetch<ApiResponse<{ defaults: Record<string, unknown> }>>({
    path: `${API_BASE}/components/${type}/defaults`,
    method: 'GET',
  });

  return response.data.defaults;
};

/**
 * Upload media file.
 */
export const uploadMedia = async (
  file: File,
  postId?: number
): Promise<MediaData> => {
  const formData = new FormData();
  formData.append('file', file);
  if (postId) {
    formData.append('post_id', String(postId));
  }

  const response = await apiFetch<ApiResponse<MediaData>>({
    path: `${API_BASE}/media`,
    method: 'POST',
    body: formData,
  });

  return response.data;
};
```

---

## Action Hooks

### Save Operations

```php
/**
 * Fires before builder data is saved.
 *
 * @param int   $post_id Post ID.
 * @param array $data    Data to be saved.
 */
do_action( 'polymorphic/save/before', $post_id, $data );

/**
 * Fires after builder data is saved.
 *
 * @param int   $post_id   Post ID.
 * @param array $sanitized Saved data.
 */
do_action( 'polymorphic/save/after', $post_id, $sanitized );

/**
 * Fires when save fails.
 *
 * @param int      $post_id Post ID.
 * @param WP_Error $error   Error object.
 */
do_action( 'polymorphic/save/error', $post_id, $error );
```

### Render Operations

```php
/**
 * Fires before page rendering begins.
 *
 * @param int   $post_id Post ID.
 * @param array $data    Builder data.
 */
do_action( 'polymorphic/render/before', $post_id, $data );

/**
 * Fires after page rendering completes.
 *
 * @param int    $post_id Post ID.
 * @param string $html    Rendered HTML.
 */
do_action( 'polymorphic/render/after', $post_id, $html );

/**
 * Fires before a component is rendered.
 *
 * @param array  $component Component data.
 * @param string $context   Rendering context ('frontend', 'preview', 'builder').
 */
do_action( 'polymorphic/render/component/before', $component, $context );

/**
 * Fires after a component is rendered.
 *
 * @param array  $component Component data.
 * @param string $html      Rendered HTML.
 */
do_action( 'polymorphic/render/component/after', $component, $html );
```

### Cache Operations

```php
/**
 * Fires when cache is invalidated.
 *
 * @param int $post_id Post ID.
 */
do_action( 'polymorphic/cache/invalidated', $post_id );

/**
 * Fires when cache is populated.
 *
 * @param int    $post_id Post ID.
 * @param string $html    Cached HTML.
 */
do_action( 'polymorphic/cache/populated', $post_id, $html );
```

### Builder Events

```php
/**
 * Fires when builder admin page is loaded.
 *
 * @param int $post_id Post ID being edited.
 */
do_action( 'polymorphic/builder/loaded', $post_id );

/**
 * Fires when builder assets are enqueued.
 */
do_action( 'polymorphic/builder/enqueue_assets' );
```

---

## Filter Hooks

### Component Registration

```php
/**
 * Filter the registered components.
 *
 * @param array $components Registered component classes.
 * @return array Modified components.
 */
$components = apply_filters( 'polymorphic/components/registry', $components );

// Example: Add custom component.
add_filter( 'polymorphic/components/registry', function( $components ) {
    $components['testimonial'] = MyPlugin\Components\Testimonial::class;
    return $components;
});
```

### Data Manipulation

```php
/**
 * Filter builder data after loading.
 *
 * @param array $data    Builder data.
 * @param int   $post_id Post ID.
 * @return array Modified data.
 */
$data = apply_filters( 'polymorphic/data/loaded', $data, $post_id );

/**
 * Filter data before saving.
 *
 * @param array $data    Data to save.
 * @param int   $post_id Post ID.
 * @return array Modified data.
 */
$data = apply_filters( 'polymorphic/data/before_save', $data, $post_id );

/**
 * Filter component props before rendering.
 *
 * @param array  $props     Component props.
 * @param string $type      Component type.
 * @param string $component Full component data.
 * @return array Modified props.
 */
$props = apply_filters( 'polymorphic/component/props', $props, $type, $component );
```

### Render Output

```php
/**
 * Filter the rendered HTML for a component.
 *
 * @param string $html      Rendered HTML.
 * @param array  $component Component data.
 * @param string $context   Rendering context.
 * @return string Modified HTML.
 */
$html = apply_filters( 'polymorphic/render/component', $html, $component, $context );

// Example: Add wrapper class.
add_filter( 'polymorphic/render/component', function( $html, $component ) {
    if ( $component['type'] === 'heading' ) {
        $html = '<div class="custom-heading-wrapper">' . $html . '</div>';
    }
    return $html;
}, 10, 2 );

/**
 * Filter the complete page HTML.
 *
 * @param string $html    Complete HTML.
 * @param int    $post_id Post ID.
 * @return string Modified HTML.
 */
$html = apply_filters( 'polymorphic/render/page', $html, $post_id );

/**
 * Filter generated CSS.
 *
 * @param string $css     Generated CSS.
 * @param int    $post_id Post ID.
 * @return string Modified CSS.
 */
$css = apply_filters( 'polymorphic/render/styles', $css, $post_id );
```

### Builder Settings

```php
/**
 * Filter the post types that support the builder.
 *
 * @param array $post_types Supported post types.
 * @return array Modified post types.
 */
$post_types = apply_filters( 'polymorphic/settings/post_types', $post_types );

// Example: Add custom post type.
add_filter( 'polymorphic/settings/post_types', function( $post_types ) {
    $post_types[] = 'landing_page';
    return $post_types;
});

/**
 * Filter component defaults.
 *
 * @param array  $defaults Default props.
 * @param string $type     Component type.
 * @return array Modified defaults.
 */
$defaults = apply_filters( 'polymorphic/component/defaults', $defaults, $type );

/**
 * Filter capability required to use builder.
 *
 * @param string $capability Required capability.
 * @return string Modified capability.
 */
$capability = apply_filters( 'polymorphic/capability/use_builder', 'edit_posts' );
```

### Cache Control

```php
/**
 * Filter cache TTL (time-to-live).
 *
 * @param int $ttl     TTL in seconds.
 * @param int $post_id Post ID.
 * @return int Modified TTL.
 */
$ttl = apply_filters( 'polymorphic/cache/ttl', WEEK_IN_SECONDS, $post_id );

/**
 * Filter whether caching is enabled.
 *
 * @param bool $enabled Whether caching is enabled.
 * @param int  $post_id Post ID.
 * @return bool Modified value.
 */
$enabled = apply_filters( 'polymorphic/cache/enabled', true, $post_id );

// Example: Disable cache for logged-in users.
add_filter( 'polymorphic/cache/enabled', function( $enabled ) {
    return ! is_user_logged_in();
});
```

---

## JavaScript Events

Events emitted on `window.polymorphic`:

```typescript
// Component events
window.polymorphic.on('component:added', (component: ComponentData) => {});
window.polymorphic.on('component:updated', (component: ComponentData) => {});
window.polymorphic.on('component:removed', (id: string) => {});
window.polymorphic.on('component:selected', (id: string | null) => {});
window.polymorphic.on('component:moved', (id: string, newIndex: number) => {});

// Save events
window.polymorphic.on('save:start', () => {});
window.polymorphic.on('save:complete', (response: SaveResponse) => {});
window.polymorphic.on('save:error', (error: Error) => {});

// History events
window.polymorphic.on('history:undo', () => {});
window.polymorphic.on('history:redo', () => {});

// Builder events
window.polymorphic.on('builder:ready', () => {});
window.polymorphic.on('breakpoint:changed', (breakpoint: 'desktop' | 'tablet' | 'mobile') => {});
```

### Subscribing to Events

```typescript
// In your extension
document.addEventListener('DOMContentLoaded', () => {
  if (window.polymorphic) {
    window.polymorphic.on('component:added', (component) => {
      console.log('New component:', component.type);
      // Custom logic
    });

    window.polymorphic.on('save:complete', () => {
      // Trigger external sync
    });
  }
});
```
