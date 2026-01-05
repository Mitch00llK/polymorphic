# Security Implementation

This document outlines security measures for Polymorphic including sanitization, validation, and capability checks.

---

## Security Principles

1. **Never trust user input** - Always sanitize and validate
2. **Escape on output** - Use context-appropriate escaping
3. **Verify permissions** - Check capabilities before actions
4. **Use nonces** - Prevent CSRF attacks
5. **Validate, then sanitize** - Check format first, then clean

---

## Capability Checks

| Action | Minimum Capability |
|--------|-------------------|
| Access builder | `edit_posts` |
| Edit page with builder | `edit_post` |
| Upload media | `upload_files` |
| Access settings | `manage_options` |

```php
<?php
namespace Polymorphic\Security;

class Capability_Manager {
    public function can_use_builder(): bool {
        $capability = apply_filters('polymorphic/capability/use_builder', 'edit_posts');
        return current_user_can($capability);
    }

    public function can_edit_post(int $post_id): bool {
        $post = get_post($post_id);
        if (!$post || !current_user_can('edit_post', $post_id)) {
            return false;
        }
        return $this->post_type_supports_builder($post->post_type);
    }
}
```

---

## Nonce Verification

```php
// Generate nonce
wp_nonce_field('polymorphic_builder_' . $post_id, 'polymorphic_nonce');

// Verify nonce
if (!wp_verify_nonce($_POST['polymorphic_nonce'], 'polymorphic_builder_' . $post_id)) {
    wp_die(__('Security check failed.', 'polymorphic'));
}
```

---

## Input Sanitization

| Data Type | Function |
|-----------|----------|
| Plain text | `sanitize_text_field()` |
| HTML content | `wp_kses_post()` |
| URLs | `esc_url_raw()` |
| Keys/slugs | `sanitize_key()` |
| Integers | `absint()` |

```php
class Sanitizer {
    public static function sanitize_color(string $color): string {
        if (preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color)) {
            return $color;
        }
        if (preg_match('/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/', $color)) {
            return $color;
        }
        return '';
    }

    public static function sanitize_heading_tag(string $tag): string {
        $allowed = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        return in_array(strtolower($tag), $allowed, true) ? strtolower($tag) : 'h2';
    }
}
```

---

## Output Escaping

| Context | Function |
|---------|----------|
| HTML content | `esc_html()` |
| HTML attributes | `esc_attr()` |
| URLs | `esc_url()` |
| SQL | `$wpdb->prepare()` |

---

## Security Checklist

- [ ] All user inputs sanitized
- [ ] All outputs escaped appropriately
- [ ] Capability checks on all actions
- [ ] Nonces verified on all forms
- [ ] SQL queries use prepared statements
- [ ] File uploads validated
- [ ] REST API permissions validated
- [ ] XSS/CSRF vulnerabilities checked
