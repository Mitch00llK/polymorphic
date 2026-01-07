# Component Development Guide

This guide explains how to create new components for the Polymorphic page builder.

---

## Architecture Overview

```
Component Lifecycle:
┌─────────────┐   ┌──────────────┐   ┌─────────────┐   ┌──────────────┐
│  Manifest   │ → │   Sidebar    │ → │   Canvas    │ → │   Frontend   │
│  (config)   │   │  (draggable) │   │  (editable) │   │  (rendered)  │
└─────────────┘   └──────────────┘   └─────────────┘   └──────────────┘
```

**Key Files:**
- `manifest.ts` - Component configuration (type, label, icon, CSS)
- `ComponentName.tsx` - React renderer for editor/preview
- `class-component-name.php` - PHP renderer for frontend
- `cssRegistry.ts` - Global CSS definitions

---

## Creating a New Component

### Step 1: Create Directory Structure

```
src/components/organisms/MyComponent/
├── MyComponent.tsx      # React renderer
├── manifest.ts          # Component manifest
└── index.ts             # Export (optional)
```

For PHP (frontend rendering):
```
includes/Components/MyComponent/
└── class-my-component.php
```

---

### Step 2: Create the Manifest

The manifest defines component metadata and base CSS:

```typescript
// src/components/organisms/MyComponent/manifest.ts

import type { ComponentManifest } from '../../../types/manifest';

export const manifest: ComponentManifest = {
    type: 'myComponent',              // Unique identifier (camelCase)
    label: 'My Component',            // Display name in sidebar
    icon: 'Star',                     // Lucide icon name
    category: 'blocks',               // Sidebar category
    phpClass: 'Polymorphic\\Components\\MyComponent\\My_Component',
    supportsChildren: false,          // Can contain nested components?
    defaultProps: {
        title: 'Default Title',
        variant: 'default',
    },
    css: `
.poly-my-component {
    width: 100%;
    padding: var(--poly-padding-top, 40px) var(--poly-padding-right, 20px)
             var(--poly-padding-bottom, 40px) var(--poly-padding-left, 20px);
    background-color: var(--poly-background-color, #fff);
}
.poly-my-component__title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--poly-color, #111);
}
`,
};

export default manifest;
```

---

### Step 3: Create the React Renderer

```typescript
// src/components/organisms/MyComponent/MyComponent.tsx

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

interface MyComponentProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const MyComponent: React.FC<MyComponentProps> = ({ component }) => {
    const { id, props } = component;
    
    // Build styles from PropertyPanel props
    const sharedStyles = buildStyles(
        props as StyleableProps, 
        ['layout', 'typography', 'box', 'size', 'spacing']
    );

    return (
        <div 
            className="poly-my-component" 
            style={sharedStyles} 
            data-component-id={id}
        >
            <h2 className="poly-my-component__title">
                {(props.title as string) || 'My Component'}
            </h2>
            {/* Component content */}
        </div>
    );
};

export default MyComponent;
```

---

### Step 4: Create the PHP Renderer

```php
<?php
// includes/Components/MyComponent/class-my-component.php

namespace Polymorphic\Components\MyComponent;

use Polymorphic\Components\Component_Base;

class My_Component extends Component_Base {

    public function get_type(): string {
        return 'myComponent';
    }

    public function get_label(): string {
        return __( 'My Component', 'polymorphic' );
    }

    public function get_category(): string {
        return 'blocks';
    }

    public function get_icon(): string {
        return 'star';
    }

    public function get_defaults(): array {
        return [
            'title'   => '',
            'variant' => 'default',
        ];
    }

    public function render( array $component, $context = 'frontend' ): string {
        $props = $this->merge_defaults( $component['props'] ?? [] );
        $id    = $component['id'] ?? '';

        $classes = [ 'poly-my-component' ];
        
        // Add generated class for dynamic styles
        $generated_class = $this->get_generated_class( $component, $context );
        if ( ! empty( $generated_class ) ) {
            $classes[] = $generated_class;
        }

        $attrs = [
            'class'             => implode( ' ', $classes ),
            'data-component-id' => esc_attr( $id ),
        ];

        ob_start();
        ?>
        <div <?php echo $this->build_attributes( $attrs ); ?>>
            <?php if ( ! empty( $props['title'] ) ) : ?>
                <h2 class="poly-my-component__title">
                    <?php echo esc_html( $props['title'] ); ?>
                </h2>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
```

---

### Step 5: Register the Component

#### A. Add to ComponentRenderer (React)

```typescript
// src/components/ComponentRenderer.tsx

import { MyComponent } from './organisms/MyComponent/MyComponent';

const CORE_RENDERERS = {
    // ... existing renderers
    myComponent: MyComponent as React.FC<RendererProps>,
};
```

#### B. Add to Sidebar (for drag-and-drop)

```typescript
// src/components/builder/Sidebar.tsx

const CORE_COMPONENTS: ComponentDefinition[] = [
    // ... existing components
    { type: 'myComponent', label: 'My Component', icon: <Star size={20} />, category: 'blocks' },
];
```

#### C. Register PHP class

```php
// includes/Core/Plugin/class-plugin.php

private function get_component_classes(): array {
    return [
        // ... existing components
        'myComponent' => \Polymorphic\Components\MyComponent\My_Component::class,
    ];
}
```

#### D. Add require in main plugin file

```php
// polymorphic.php

require_once POLYMORPHIC_PATH . 'includes/Components/MyComponent/class-my-component.php';
```

#### E. Register CSS in cssRegistry

```typescript
// src/utils/cssRegistry.ts

registerComponentCSS('myComponent', `
.poly-my-component {
    /* Base styles */
}
`);
```

---

## CSS Variables System

Components use CSS custom properties (variables) for dynamic styling:

### Property Panel → CSS Variable Mapping

| Property Panel | CSS Variable | Example Value |
|---------------|--------------|---------------|
| `backgroundColor` | `--poly-background-color` | `#ffffff` |
| `paddingTop` | `--poly-padding-top` | `40px` |
| `fontSize` | `--poly-font-size` | `1.5rem` |
| `borderRadius` | `--poly-border-radius` | `8px` |
| `gap` | `--poly-gap` | `2rem` |
| `width` | `--poly-width` | `100%` |
| `flexDirection` | `--poly-flex-direction` | `row` |

### How Dynamic CSS Works

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  PropertyPanel   │ →   │  Store Update    │ →   │  CSS Variables   │
│  (user changes)  │     │  (props saved)   │     │  (inline styles) │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                           ↓
                         ┌──────────────────┐     ┌──────────────────┐
                         │  Frontend Render │ ←   │  Style Extractor │
                         │  (components.css)│     │  (on save)       │
                         └──────────────────┘     └──────────────────┘
```

1. **Editor**: Props are converted to CSS variables via `buildCSSVariables()`
2. **Save**: `styleExtractor.ts` generates optimized CSS
3. **Frontend**: Generated CSS loaded via `wp_head()`

### Using buildCSSVariables

```typescript
import { buildCSSVariables } from '../../../utils/cssVariables';

const cssVars = buildCSSVariables(props);
// Returns: { '--poly-background-color': '#fff', '--poly-padding-top': '40px', ... }

return <div style={cssVars as React.CSSProperties}>...</div>;
```

---

## Manifest Auto-Discovery (Optional)

For auto-generated registries, run:

```bash
npm run generate
```

This scans `src/components/**/manifest.ts` and generates:
- `src/generated/sidebarComponents.generated.tsx`
- `src/generated/componentRegistry.generated.ts`
- `src/generated/cssRegistry.generated.ts`

---

## Component Categories

| Category | Use Case |
|----------|----------|
| `layout` | Structural (Section, Container) |
| `content` | Text/Typography (Heading, Text) |
| `media` | Visual (Image, Video) |
| `actions` | Interactive (Button, Link) |
| `ui` | UI Elements (Card, Alert, Badge) |
| `blocks` | Pre-built sections (Hero, Features) |

---

## Drop Zone Support (Nested Components)

For components that support children:

```typescript
import { useDroppable } from '@dnd-kit/core';

const { setNodeRef, isOver } = useDroppable({
    id: `container-drop-${component.id}`,
    data: { type: 'container-drop-zone', containerId: component.id },
    disabled: context !== 'editor',
});

return (
    <div ref={setNodeRef} className={isOver ? 'drop-target' : ''}>
        {children.map(child => (
            <ComponentRenderer key={child.id} component={child} context={context} />
        ))}
    </div>
);
```

---

## Best Practices

1. **Naming**: Use `poly-` prefix for CSS classes
2. **CSS Variables**: Always provide fallback values: `var(--poly-color, #000)`
3. **data-component-id**: Always include for selection/editing
4. **Escape output**: Use `esc_html()`, `esc_attr()` in PHP
5. **Default props**: Define sensible defaults in manifest
6. **Responsive**: Include mobile styles in manifest CSS

---

## Quick Reference

### Required Files
- [ ] `manifest.ts` with type, label, icon, category, css
- [ ] `ComponentName.tsx` React renderer
- [ ] `class-component-name.php` PHP renderer

### Registration Points
- [ ] `ComponentRenderer.tsx` - CORE_RENDERERS
- [ ] `Sidebar.tsx` - CORE_COMPONENTS
- [ ] `class-plugin.php` - component_classes
- [ ] `polymorphic.php` - require_once
- [ ] `cssRegistry.ts` - registerComponentCSS

### Build & Test
```bash
npm run build   # Build with CSS generation
npm run dev     # Dev mode with hot reload
```

---

## Third-Party Component Registration (API)

Third-party plugins can register components via PHP:

```php
// In your plugin, hook into polymorphic/init
add_action('polymorphic/init', function() {
    
    polymorphic_register_component([
        'type'     => 'myPlugin/slider',
        'label'    => 'Image Slider',
        'icon'     => 'images',
        'category' => 'media',
        'source'   => 'my-plugin',
        
        // What features the component supports in PropertyPanel
        'supports' => ['spacing', 'boxStyle'],
        
        // Default property values
        'default_props' => [
            'autoplay' => true,
            'speed'    => 3000,
        ],
        
        // CSS/JS assets
        'assets' => [
            'css' => [
                'inline' => '.my-slider { display: flex; }',
                // OR external file:
                'url' => plugin_dir_url(__FILE__) . 'css/slider.css',
            ],
            'js' => [
                'editor'   => plugin_dir_url(__FILE__) . 'js/slider-editor.js',
                'frontend' => plugin_dir_url(__FILE__) . 'js/slider-frontend.js',
            ],
        ],
        
        // PHP render callback
        'render_callback' => function($component, $context) {
            $props = $component['props'] ?? [];
            ob_start();
            ?>
            <div class="my-slider" data-autoplay="<?php echo $props['autoplay'] ? 'true' : 'false'; ?>">
                <!-- Slider content -->
            </div>
            <?php
            return ob_get_clean();
        },
    ]);
});
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/polymorphic/v1/components` | GET | List all components |
| `/polymorphic/v1/components/{type}` | GET | Get single component |
| `/polymorphic/v1/components/render` | POST | Render a component (preview) |

### TypeScript Usage

```typescript
import { componentRegistry } from '@/services/componentRegistry';

// Fetch all components
const components = await componentRegistry.fetchRegistry();

// Load assets for a component
await componentRegistry.loadAssets('myPlugin/slider');

// Render a third-party component
const result = await componentRegistry.renderComponent(
    'myPlugin/slider',
    { autoplay: true },
    'editor'
);
// Returns: { html: '...', css: '...' }
```

