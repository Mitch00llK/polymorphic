# Coding Standards & Conventions

This document defines the coding standards for the Polymorphic project. All contributors must follow these conventions to ensure consistency across the codebase.

---

## General Principles

1. **Clarity over cleverness** - Write code that is easy to understand
2. **DRY (Don't Repeat Yourself)** - Extract reusable logic
3. **Single Responsibility** - Each function/class does one thing well
4. **Explicit over implicit** - Be clear about intentions
5. **Fail fast** - Validate early, error clearly

---

## File Naming Conventions

### PHP Files

| Type | Convention | Example |
|------|------------|---------|
| Classes | `class-{name}.php` (kebab-case) | `class-component-registry.php` |
| Interfaces | `interface-{name}.php` | `interface-renderable.php` |
| Traits | `trait-{name}.php` | `trait-has-styles.php` |
| Functions | `functions-{area}.php` | `functions-helpers.php` |

### JavaScript/TypeScript Files

| Type | Convention | Example |
|------|------------|---------|
| Components | `PascalCase.tsx` | `HeadingElement.tsx` |
| Hooks | `camelCase.ts` with `use` prefix | `useBuilder.ts` |
| Stores | `camelCase.ts` with `Store` suffix | `builderStore.ts` |
| Utilities | `camelCase.ts` | `componentFactory.ts` |
| Types | `camelCase.ts` | `components.ts` |
| Styles | `camelCase.module.css` | `builder.module.css` |

### CSS Files

| Type | Convention | Example |
|------|------------|---------|
| CSS Modules | `camelCase.module.css` | `canvas.module.css` |
| Global CSS | `kebab-case.css` | `variables.css` |
| Component CSS | Match component name | `HeadingElement.module.css` |

---

## Naming Conventions

### PHP

```php
// Classes: PascalCase
class Component_Registry {}
class Admin_Menu {}

// Methods: snake_case
public function get_component( $id ) {}
public function render_output() {}

// Variables: snake_case
$component_data = [];
$is_valid = true;

// Constants: SCREAMING_SNAKE_CASE
const PLUGIN_VERSION = '1.0.0';
define( 'POLYMORPHIC_PATH', __DIR__ );

// Hooks: polymorphic/{area}/{action}
do_action( 'polymorphic/render/before' );
apply_filters( 'polymorphic/components/registry' );

// Private/Protected: underscore prefix
private $_cache = [];
protected function _validate_data() {}
```

### JavaScript/TypeScript

```typescript
// Components: PascalCase
const HeadingElement: React.FC = () => {};
const PropertyPanel: React.FC = () => {};

// Functions/Methods: camelCase
function handleDragEnd() {}
const validateComponent = () => {};

// Variables: camelCase
const componentData = {};
let isSelected = false;

// Constants: SCREAMING_SNAKE_CASE or camelCase
const API_ENDPOINT = '/wp-json/polymorphic/v1';
const defaultSpacing = 16;

// Types/Interfaces: PascalCase with I prefix for interfaces (optional)
type ComponentType = 'heading' | 'text' | 'image';
interface ComponentProps {}

// Enums: PascalCase with PascalCase members
enum ComponentCategory {
  Layout = 'layout',
  Content = 'content',
  Media = 'media',
}

// Hooks: camelCase with 'use' prefix
const useBuilder = () => {};
const useHistory = () => {};

// Event handlers: 'handle' prefix or 'on' prefix
const handleClick = () => {};
const onDragEnd = () => {};

// Boolean variables: is/has/should/can prefix
const isLoading = false;
const hasChildren = true;
const shouldRender = true;
```

### CSS

```css
/* CSS Custom Properties: --polymorphic-{category}-{property} */
--polymorphic-color-primary: #6366f1;
--polymorphic-spacing-md: 16px;
--polymorphic-font-size-lg: 18px;

/* CSS Module Classes: camelCase */
.canvasContainer {}
.componentWrapper {}
.isSelected {}
.hasChildren {}

/* BEM for global CSS (if needed) */
.polymorphic-canvas {}
.polymorphic-canvas__component {}
.polymorphic-canvas__component--selected {}

/* Responsive breakpoint variables */
--polymorphic-breakpoint-tablet: 768px;
--polymorphic-breakpoint-desktop: 1024px;
```

---

## Code Style

### PHP Style

Following WordPress Coding Standards with some additions:

```php
<?php
/**
 * Class file description.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Components;

use Polymorphic\Core\Plugin;
use Polymorphic\Helpers\Sanitizer;

/**
 * Heading component for the builder.
 *
 * @since 1.0.0
 */
class Heading extends Component_Base {

    /**
     * Component type identifier.
     *
     * @var string
     */
    const TYPE = 'heading';

    /**
     * Default component properties.
     *
     * @var array
     */
    private array $defaults = [
        'content' => 'New Heading',
        'level'   => 'h2',
        'align'   => 'left',
    ];

    /**
     * Render the component.
     *
     * @since 1.0.0
     *
     * @param array $props Component properties.
     * @return string Rendered HTML.
     */
    public function render( array $props ): string {
        $props = wp_parse_args( $props, $this->defaults );
        $tag   = Sanitizer::sanitize_heading_tag( $props['level'] );

        return sprintf(
            '<%1$s class="polymorphic-heading" style="text-align: %2$s">%3$s</%1$s>',
            $tag,
            esc_attr( $props['align'] ),
            esc_html( $props['content'] )
        );
    }
}
```

### TypeScript Style

```typescript
/**
 * Heading element component for the builder canvas.
 *
 * @since 1.0.0
 */

import React, { memo, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useBuilderStore } from '@/store/builderStore';
import type { HeadingComponentData } from '@/types/components';

import styles from './HeadingElement.module.css';

interface HeadingElementProps {
  /** Unique component identifier */
  id: string;
  /** Component data including content and styles */
  data: HeadingComponentData;
  /** Whether this component is currently selected */
  isSelected?: boolean;
}

/**
 * Renders a heading element on the builder canvas.
 * Supports drag-and-drop repositioning and inline editing.
 */
export const HeadingElement: React.FC<HeadingElementProps> = memo(
  ({ id, data, isSelected = false }) => {
    const { selectComponent, updateComponent } = useBuilderStore();

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        selectComponent(id);
      },
      [id, selectComponent]
    );

    const Tag = data.level as keyof JSX.IntrinsicElements;

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`${styles.wrapper} ${isSelected ? styles.isSelected : ''}`}
        onClick={handleClick}
        {...attributes}
        {...listeners}
      >
        <Tag
          className={styles.heading}
          style={{
            textAlign: data.align,
            color: data.color,
          }}
        >
          {data.content}
        </Tag>
      </div>
    );
  }
);

HeadingElement.displayName = 'HeadingElement';

export default HeadingElement;
```

---

## Module Structure

### PHP Class Organization

```php
<?php
/**
 * [File description]
 *
 * @package Polymorphic
 * @since   1.0.0
 */

namespace Polymorphic\Area;

// 1. Use statements (alphabetically ordered)
use Polymorphic\Core\Plugin;
use Polymorphic\Helpers\Sanitizer;

// 2. Class documentation
/**
 * [Class description]
 *
 * @since 1.0.0
 */
class Example_Class {

    // 3. Constants
    const TYPE = 'example';

    // 4. Static properties
    private static $instance = null;

    // 5. Instance properties (typed in PHP 8.0+)
    private array $data = [];
    protected string $name;
    public bool $is_active = false;

    // 6. Constructor
    public function __construct( string $name ) {
        $this->name = $name;
    }

    // 7. Static methods
    public static function get_instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self( 'default' );
        }
        return self::$instance;
    }

    // 8. Public methods
    public function init(): void {
        add_action( 'init', [ $this, 'register' ] );
    }

    public function register(): void {
        // Implementation
    }

    // 9. Protected methods
    protected function validate(): bool {
        return ! empty( $this->data );
    }

    // 10. Private methods
    private function _process_data(): array {
        return array_filter( $this->data );
    }
}
```

### TypeScript Module Organization

```typescript
/**
 * [File description]
 *
 * @since 1.0.0
 */

// 1. External imports (alphabetically)
import React, { memo, useCallback, useEffect, useState } from 'react';

// 2. Internal imports - absolute paths
import { useBuilderStore } from '@/store/builderStore';
import type { ComponentData } from '@/types/components';

// 3. Internal imports - relative paths
import { validateProps } from './utils';
import styles from './Component.module.css';

// 4. Type definitions
interface ComponentProps {
  id: string;
  data: ComponentData;
}

// 5. Constants
const DEFAULT_VALUE = 'default';
const ANIMATION_DURATION = 300;

// 6. Helper functions (if small, otherwise separate file)
const formatValue = (value: string): string => {
  return value.trim().toLowerCase();
};

// 7. Main component/function
export const Component: React.FC<ComponentProps> = memo(({ id, data }) => {
  // a. Hooks first
  const [state, setState] = useState(false);
  const { action } = useBuilderStore();

  // b. Callbacks
  const handleClick = useCallback(() => {
    action(id);
  }, [id, action]);

  // c. Effects
  useEffect(() => {
    // Side effect
  }, []);

  // d. Render
  return <div className={styles.component}>{data.content}</div>;
});

// 8. Display name (for debugging)
Component.displayName = 'Component';

// 9. Default export (if applicable)
export default Component;
```

---

## Import Organization

### PHP

```php
<?php
// 1. Core PHP/WordPress
use WP_REST_Request;
use WP_REST_Response;

// 2. Third-party packages
use Carbon\Carbon;

// 3. Same namespace (alphabetically)
use Polymorphic\Core\Plugin;
use Polymorphic\Core\Settings;

// 4. Different namespace (alphabetically by namespace)
use Polymorphic\Api\Rest_Controller;
use Polymorphic\Helpers\Sanitizer;
```

### TypeScript

```typescript
// 1. React/Core
import React, { useState, useEffect, useCallback } from 'react';

// 2. Third-party libraries (alphabetically)
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 3. Internal - absolute paths (by category)
import { useBuilderStore } from '@/store/builderStore';
import { validateComponent } from '@/utils/validators';
import type { ComponentData } from '@/types/components';

// 4. Internal - relative paths
import { ChildComponent } from './ChildComponent';
import { helper } from './utils';

// 5. Styles (last)
import styles from './Component.module.css';
```

---

## Documentation

### PHP DocBlocks

```php
/**
 * Short description of the function.
 *
 * Longer description if needed. Can span multiple lines
 * and include @link, @see, @example.
 *
 * @since 1.0.0
 * @since 1.2.0 Added $optional parameter.
 *
 * @see   Related_Class::related_method()
 * @link  https://example.com/docs
 *
 * @param string $required Required parameter description.
 * @param int    $optional Optional. Default 10.
 * @return array {
 *     Return value description.
 *
 *     @type string $key Description.
 *     @type int    $count Number of items.
 * }
 */
```

### TypeScript JSDoc

```typescript
/**
 * Short description of the function.
 *
 * Longer description if needed.
 *
 * @since 1.0.0
 *
 * @param props - Component props
 * @param props.id - Unique identifier
 * @param props.data - Component data object
 *
 * @returns Rendered component
 *
 * @example
 * ```tsx
 * <Component id="abc123" data={{ content: 'Hello' }} />
 * ```
 */
```

---

## Error Handling

### PHP

```php
// Use WP_Error for recoverable errors
public function save_data( array $data ): WP_Error|bool {
    if ( empty( $data ) ) {
        return new WP_Error(
            'polymorphic_empty_data',
            __( 'Cannot save empty data.', 'polymorphic' ),
            [ 'status' => 400 ]
        );
    }

    return update_post_meta( $this->post_id, '_builder_data', $data );
}

// Throw exceptions for unrecoverable errors
public function __construct( int $post_id ) {
    if ( $post_id <= 0 ) {
        throw new InvalidArgumentException(
            'Post ID must be a positive integer.'
        );
    }
}

// Log errors in development
if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
    error_log( 'Polymorphic: ' . $message );
}
```

### TypeScript

```typescript
// Use try-catch for async operations
const saveData = async (data: ComponentData[]): Promise<void> => {
  try {
    const response = await api.save(data);
    if (!response.ok) {
      throw new Error(`Save failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('[Polymorphic]', error);
    toast.error('Failed to save changes');
  }
};

// Type narrowing for error handling
const handleError = (error: unknown): void => {
  if (error instanceof ValidationError) {
    toast.error(error.message);
  } else if (error instanceof NetworkError) {
    toast.error('Network error. Please try again.');
  } else {
    toast.error('An unexpected error occurred.');
    console.error(error);
  }
};
```

---

## Testing Conventions

### PHP Tests

```php
/**
 * Tests for the Component_Registry class.
 *
 * @package Polymorphic\Tests
 * @coversDefaultClass \Polymorphic\Components\Component_Registry
 */
class Test_Component_Registry extends WP_UnitTestCase {

    /**
     * @covers ::register
     */
    public function test_register_adds_component_to_registry(): void {
        $registry = new Component_Registry();
        $registry->register( 'heading', Heading::class );

        $this->assertTrue( $registry->has( 'heading' ) );
    }

    /**
     * @covers ::get
     */
    public function test_get_returns_null_for_unregistered(): void {
        $registry = new Component_Registry();

        $this->assertNull( $registry->get( 'nonexistent' ) );
    }
}
```

### TypeScript Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { HeadingElement } from './HeadingElement';

describe('HeadingElement', () => {
  const defaultProps = {
    id: 'test-id',
    data: {
      content: 'Test Heading',
      level: 'h2',
      align: 'left',
    },
  };

  it('renders heading content correctly', () => {
    render(<HeadingElement {...defaultProps} />);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('applies selected state class when selected', () => {
    render(<HeadingElement {...defaultProps} isSelected />);
    expect(screen.getByText('Test Heading').closest('div')).toHaveClass(
      'isSelected'
    );
  });

  it('calls selectComponent on click', () => {
    const mockSelect = jest.fn();
    // ... test implementation
  });
});
```

---

## Git Commit Conventions

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |
| `build` | Build system changes |
| `ci` | CI/CD changes |

### Examples

```bash
feat(builder): add undo/redo functionality
fix(renderer): correct nested component rendering
docs(readme): update installation instructions
refactor(api): simplify REST endpoint handlers
perf(cache): optimize transient invalidation
test(components): add heading component tests
chore(deps): update @wordpress/scripts to v28
```

---

## Linting & Formatting

### ESLint Configuration

See `.eslintrc.js` for full configuration.

```javascript
// Key rules
{
  'react/prop-types': 'off', // Using TypeScript
  'react/react-in-jsx-scope': 'off', // React 17+
  '@typescript-eslint/explicit-function-return-type': 'warn',
  '@typescript-eslint/no-unused-vars': 'error',
  'import/order': ['error', {
    'groups': ['builtin', 'external', 'internal', 'parent', 'sibling'],
    'newlines-between': 'always',
    'alphabetize': { 'order': 'asc' }
  }]
}
```

### PHP CodeSniffer

See `.phpcs.xml` for full configuration.

```xml
<!-- Key rules -->
<rule ref="WordPress">
    <exclude name="WordPress.Files.FileName.InvalidClassFileName"/>
</rule>
<rule ref="WordPress-Extra"/>
<rule ref="WordPress-Docs"/>

<!-- Custom rules -->
<rule ref="PHPCompatibilityWP"/>
<config name="minimum_supported_wp_version" value="6.0"/>
<config name="testVersion" value="8.0-"/>
```

### Prettier Configuration

See `.prettierrc` for full configuration.

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```
