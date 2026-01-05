# Component Library

This document defines the core component library for Polymorphic, including specifications, editable properties, and rendering behavior.

---

## Component Categories

| Category | Components | Purpose |
|----------|------------|---------|
| **Layout** | Section, Container, Columns | Structure and spacing |
| **Content** | Heading, Text, List | Text-based content |
| **Media** | Image, Video, Icon | Visual elements |
| **Actions** | Button, Link | Interactive elements |
| **Widgets** | Spacer, Divider | Utility elements |

---

## MVP Components (Phase 1)

These are the **minimum required components** for the initial release:

1. **Section** - Full-width layout container
2. **Container** - Constrained content wrapper
3. **Heading** - H1-H6 text elements
4. **Text** - Paragraph/rich text content
5. **Image** - Responsive images
6. **Button** - Call-to-action buttons

---

## Component Specifications

### Section

**Purpose**: Full-width layout container that holds other components.

```typescript
interface SectionData {
  type: 'section';
  id: string;
  children: ComponentData[];
  props: {
    // Layout
    width: 'full' | 'boxed';           // Default: 'full'
    minHeight?: string;                 // e.g., '500px', '100vh'
    verticalAlign: 'start' | 'center' | 'end' | 'stretch';
    horizontalAlign: 'start' | 'center' | 'end' | 'stretch';
    gap: string;                        // e.g., '20px', '2rem'

    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize: 'cover' | 'contain' | 'auto';
    backgroundPosition: string;
    backgroundOverlay?: string;         // RGBA color

    // Spacing
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
    marginTop: string;
    marginBottom: string;

    // Border
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted';

    // Responsive (stored per breakpoint)
    responsive?: ResponsiveOverrides;
  };
}
```

**Editable Properties**:

| Property | Control Type | Category |
|----------|--------------|----------|
| Background Color | Color Picker | Style |
| Background Image | Media Selector | Style |
| Min Height | Slider + Unit | Layout |
| Padding | Spacing Control | Spacing |
| Margin | Spacing Control | Spacing |
| Width | Dropdown | Layout |
| Vertical Align | Button Group | Layout |
| Content Gap | Slider + Unit | Layout |

**PHP Rendering**:

```php
public function render( array $data ): string {
    $props   = $data['props'] ?? [];
    $classes = [ 'polymorphic-section' ];
    $styles  = [];

    // Build styles
    if ( ! empty( $props['backgroundColor'] ) ) {
        $styles[] = 'background-color: ' . esc_attr( $props['backgroundColor'] );
    }
    if ( ! empty( $props['minHeight'] ) ) {
        $styles[] = 'min-height: ' . esc_attr( $props['minHeight'] );
    }

    // Add spacing
    $styles[] = $this->build_spacing_styles( $props );

    // Render children
    $children_html = '';
    foreach ( $data['children'] ?? [] as $child ) {
        $children_html .= $this->registry->render( $child );
    }

    return sprintf(
        '<section class="%s" style="%s">%s<div class="polymorphic-section__inner">%s</div>%s</section>',
        esc_attr( implode( ' ', $classes ) ),
        esc_attr( implode( '; ', $styles ) ),
        $this->render_background_overlay( $props ),
        $children_html,
        '' // Additional elements
    );
}
```

---

### Container

**Purpose**: Constrained-width wrapper for content alignment.

```typescript
interface ContainerData {
  type: 'container';
  id: string;
  children: ComponentData[];
  props: {
    // Layout
    maxWidth: string;                   // e.g., '1200px'
    width: 'full' | 'auto';
    alignment: 'left' | 'center' | 'right';

    // Flex properties
    direction: 'row' | 'column';
    wrap: 'nowrap' | 'wrap';
    justifyContent: 'start' | 'center' | 'end' | 'between' | 'around';
    alignItems: 'start' | 'center' | 'end' | 'stretch';
    gap: string;

    // Background
    backgroundColor?: string;

    // Spacing
    padding: SpacingProps;
    margin: SpacingProps;

    // Border
    borderRadius?: string;
    boxShadow?: string;

    // Responsive
    responsive?: ResponsiveOverrides;
  };
}
```

**Editable Properties**:

| Property | Control Type | Category |
|----------|--------------|----------|
| Max Width | Slider + Unit | Layout |
| Direction | Button Group | Layout |
| Justify Content | Button Group | Layout |
| Align Items | Button Group | Layout |
| Gap | Slider + Unit | Layout |
| Background Color | Color Picker | Style |
| Padding | Spacing Control | Spacing |
| Border Radius | Slider | Style |
| Box Shadow | Shadow Control | Style |

---

### Heading

**Purpose**: Semantic heading elements (H1-H6).

```typescript
interface HeadingData {
  type: 'heading';
  id: string;
  props: {
    // Content
    content: string;                    // The heading text
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    // Typography
    fontSize?: string;
    fontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

    // Style
    color?: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    textDecoration?: 'none' | 'underline' | 'line-through';

    // Spacing
    marginTop?: string;
    marginBottom?: string;

    // Link (optional)
    link?: {
      url: string;
      target: '_self' | '_blank';
      rel?: string;
    };

    // Responsive
    responsive?: ResponsiveOverrides;
  };
}
```

**Editable Properties**:

| Property | Control Type | Category |
|----------|--------------|----------|
| Content | Text Input | Content |
| Level | Dropdown | Content |
| Font Size | Slider + Unit | Typography |
| Font Weight | Dropdown | Typography |
| Line Height | Slider | Typography |
| Letter Spacing | Slider | Typography |
| Text Transform | Button Group | Typography |
| Color | Color Picker | Style |
| Text Align | Button Group | Style |
| Link URL | Link Control | Link |
| Target | Dropdown | Link |
| Margin | Spacing Control | Spacing |

**PHP Rendering**:

```php
public function render( array $data ): string {
    $props   = wp_parse_args( $data['props'] ?? [], $this->defaults );
    $tag     = $this->sanitize_heading_tag( $props['level'] );
    $styles  = $this->build_typography_styles( $props );
    $content = esc_html( $props['content'] );

    // Wrap in link if provided
    if ( ! empty( $props['link']['url'] ) ) {
        $content = sprintf(
            '<a href="%s" target="%s"%s>%s</a>',
            esc_url( $props['link']['url'] ),
            esc_attr( $props['link']['target'] ?? '_self' ),
            ! empty( $props['link']['rel'] ) ? ' rel="' . esc_attr( $props['link']['rel'] ) . '"' : '',
            $content
        );
    }

    return sprintf(
        '<%1$s class="polymorphic-heading" style="%2$s">%3$s</%1$s>',
        $tag,
        esc_attr( implode( '; ', $styles ) ),
        $content
    );
}
```

---

### Text

**Purpose**: Rich text content blocks (paragraphs).

```typescript
interface TextData {
  type: 'text';
  id: string;
  props: {
    // Content (HTML supported)
    content: string;

    // Typography
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;

    // Style
    color?: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';

    // Spacing
    marginTop?: string;
    marginBottom?: string;

    // Columns (for multi-column text)
    columns?: 1 | 2 | 3 | 4;
    columnGap?: string;

    // Responsive
    responsive?: ResponsiveOverrides;
  };
}
```

**Editable Properties**:

| Property | Control Type | Category |
|----------|--------------|----------|
| Content | Rich Text Editor | Content |
| Font Size | Slider + Unit | Typography |
| Font Weight | Dropdown | Typography |
| Line Height | Slider | Typography |
| Color | Color Picker | Style |
| Text Align | Button Group | Style |
| Columns | Slider (1-4) | Layout |
| Margin | Spacing Control | Spacing |

**PHP Rendering**:

```php
public function render( array $data ): string {
    $props  = wp_parse_args( $data['props'] ?? [], $this->defaults );
    $styles = $this->build_typography_styles( $props );

    // Add column styles if needed
    if ( ! empty( $props['columns'] ) && $props['columns'] > 1 ) {
        $styles[] = 'column-count: ' . intval( $props['columns'] );
        $styles[] = 'column-gap: ' . esc_attr( $props['columnGap'] ?? '2rem' );
    }

    return sprintf(
        '<div class="polymorphic-text" style="%s">%s</div>',
        esc_attr( implode( '; ', $styles ) ),
        wp_kses_post( $props['content'] )
    );
}
```

---

### Image

**Purpose**: Responsive image display with optional link.

```typescript
interface ImageData {
  type: 'image';
  id: string;
  props: {
    // Source
    src: string;                        // Image URL
    srcset?: string;                    // Responsive srcset
    sizes?: string;                     // Responsive sizes
    alt: string;                        // Alt text (required)

    // Dimensions
    width?: string;
    height?: string;
    maxWidth?: string;
    aspectRatio?: string;               // e.g., '16/9', '4/3'
    objectFit: 'cover' | 'contain' | 'fill' | 'none';
    objectPosition?: string;

    // Style
    borderRadius?: string;
    boxShadow?: string;
    opacity?: number;

    // Alignment
    align: 'left' | 'center' | 'right';

    // Link
    link?: {
      url: string;
      target: '_self' | '_blank';
      rel?: string;
    };

    // Lightbox
    lightbox?: boolean;

    // Caption
    caption?: string;

    // Spacing
    marginTop?: string;
    marginBottom?: string;

    // Responsive
    responsive?: ResponsiveOverrides;
  };
}
```

**Editable Properties**:

| Property | Control Type | Category |
|----------|--------------|----------|
| Image | Media Selector | Content |
| Alt Text | Text Input | Content |
| Caption | Text Input | Content |
| Max Width | Slider + Unit | Layout |
| Aspect Ratio | Dropdown | Layout |
| Object Fit | Dropdown | Layout |
| Alignment | Button Group | Layout |
| Border Radius | Slider | Style |
| Box Shadow | Shadow Control | Style |
| Link URL | Link Control | Link |
| Enable Lightbox | Toggle | Link |

**PHP Rendering**:

```php
public function render( array $data ): string {
    $props = wp_parse_args( $data['props'] ?? [], $this->defaults );

    if ( empty( $props['src'] ) ) {
        return '';
    }

    $img_attrs = [
        'src'     => esc_url( $props['src'] ),
        'alt'     => esc_attr( $props['alt'] ?? '' ),
        'loading' => 'lazy',
        'decoding'=> 'async',
    ];

    if ( ! empty( $props['srcset'] ) ) {
        $img_attrs['srcset'] = esc_attr( $props['srcset'] );
        $img_attrs['sizes']  = esc_attr( $props['sizes'] ?? '100vw' );
    }

    // Build attribute string
    $attrs_string = '';
    foreach ( $img_attrs as $key => $value ) {
        $attrs_string .= sprintf( ' %s="%s"', $key, $value );
    }

    $img_html = sprintf( '<img%s />', $attrs_string );

    // Wrap in link if provided
    if ( ! empty( $props['link']['url'] ) ) {
        $img_html = sprintf(
            '<a href="%s" target="%s">%s</a>',
            esc_url( $props['link']['url'] ),
            esc_attr( $props['link']['target'] ?? '_self' ),
            $img_html
        );
    }

    // Build wrapper
    $styles = $this->build_image_styles( $props );

    $html = sprintf(
        '<figure class="polymorphic-image" style="%s">%s',
        esc_attr( implode( '; ', $styles ) ),
        $img_html
    );

    // Add caption if provided
    if ( ! empty( $props['caption'] ) ) {
        $html .= sprintf(
            '<figcaption class="polymorphic-image__caption">%s</figcaption>',
            esc_html( $props['caption'] )
        );
    }

    $html .= '</figure>';

    return $html;
}
```

---

### Button

**Purpose**: Call-to-action button with extensive styling options.

```typescript
interface ButtonData {
  type: 'button';
  id: string;
  props: {
    // Content
    text: string;
    icon?: {
      name: string;
      position: 'left' | 'right';
    };

    // Link
    url: string;
    target: '_self' | '_blank';
    rel?: string;

    // Size
    size: 'small' | 'medium' | 'large';
    width: 'auto' | 'full';
    padding?: SpacingProps;

    // Style
    variant: 'solid' | 'outline' | 'ghost' | 'link';
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;

    // Hover state
    hoverBackgroundColor?: string;
    hoverTextColor?: string;
    hoverBorderColor?: string;

    // Typography
    fontSize?: string;
    fontWeight?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

    // Alignment (within parent)
    align: 'left' | 'center' | 'right';

    // Animation
    animation?: 'none' | 'scale' | 'slide' | 'glow';

    // Spacing
    marginTop?: string;
    marginBottom?: string;

    // Responsive
    responsive?: ResponsiveOverrides;
  };
}
```

**Editable Properties**:

| Property | Control Type | Category |
|----------|--------------|----------|
| Button Text | Text Input | Content |
| Icon | Icon Picker | Content |
| Icon Position | Button Group | Content |
| URL | Link Control | Link |
| Target | Dropdown | Link |
| Size | Button Group | Style |
| Variant | Button Group | Style |
| Width | Button Group | Layout |
| Background Color | Color Picker | Style |
| Text Color | Color Picker | Style |
| Border Radius | Slider | Style |
| Hover Background | Color Picker | Style |
| Hover Text Color | Color Picker | Style |
| Font Size | Slider + Unit | Typography |
| Text Transform | Button Group | Typography |
| Alignment | Button Group | Layout |

**PHP Rendering**:

```php
public function render( array $data ): string {
    $props = wp_parse_args( $data['props'] ?? [], $this->defaults );

    $classes = [
        'polymorphic-button',
        'polymorphic-button--' . esc_attr( $props['variant'] ),
        'polymorphic-button--' . esc_attr( $props['size'] ),
    ];

    if ( 'full' === $props['width'] ) {
        $classes[] = 'polymorphic-button--full';
    }

    $styles    = $this->build_button_styles( $props );
    $css_vars  = $this->build_button_css_vars( $props );

    // Icon HTML
    $icon_html = '';
    if ( ! empty( $props['icon']['name'] ) ) {
        $icon_html = $this->render_icon( $props['icon']['name'] );
    }

    // Build content with icon placement
    $content = esc_html( $props['text'] );
    if ( $icon_html ) {
        if ( 'left' === ( $props['icon']['position'] ?? 'left' ) ) {
            $content = $icon_html . ' ' . $content;
        } else {
            $content = $content . ' ' . $icon_html;
        }
    }

    // Alignment wrapper
    $wrapper_style = sprintf( 'text-align: %s', esc_attr( $props['align'] ) );

    return sprintf(
        '<div class="polymorphic-button-wrapper" style="%s"><a href="%s" target="%s" class="%s" style="%s %s">%s</a></div>',
        esc_attr( $wrapper_style ),
        esc_url( $props['url'] ),
        esc_attr( $props['target'] ?? '_self' ),
        esc_attr( implode( ' ', $classes ) ),
        esc_attr( implode( '; ', $styles ) ),
        esc_attr( $css_vars ),
        $content
    );
}
```

---

## Responsive System

### Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: 0,        // 0 - 767px
  tablet: 768,      // 768 - 1023px
  desktop: 1024,    // 1024px+
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;
```

### Responsive Overrides

Each component can store breakpoint-specific overrides:

```typescript
interface ResponsiveOverrides {
  tablet?: Partial<ComponentProps>;
  mobile?: Partial<ComponentProps>;
}

// Example usage
const headingData: HeadingData = {
  type: 'heading',
  id: 'heading-1',
  props: {
    content: 'Welcome',
    fontSize: '48px',
    textAlign: 'center',
    responsive: {
      tablet: {
        fontSize: '36px',
      },
      mobile: {
        fontSize: '28px',
        textAlign: 'left',
      },
    },
  },
};
```

### CSS Generation

```css
/* Desktop (default) */
.polymorphic-heading[data-id="heading-1"] {
  font-size: 48px;
  text-align: center;
}

/* Tablet */
@media (max-width: 1023px) {
  .polymorphic-heading[data-id="heading-1"] {
    font-size: 36px;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .polymorphic-heading[data-id="heading-1"] {
    font-size: 28px;
    text-align: left;
  }
}
```

---

## Component Defaults

```typescript
const COMPONENT_DEFAULTS = {
  section: {
    width: 'full',
    verticalAlign: 'start',
    horizontalAlign: 'stretch',
    gap: '0px',
    paddingTop: '40px',
    paddingBottom: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
    marginTop: '0px',
    marginBottom: '0px',
  },
  container: {
    maxWidth: '1200px',
    alignment: 'center',
    direction: 'column',
    justifyContent: 'start',
    alignItems: 'stretch',
    gap: '20px',
    padding: { top: '0', right: '0', bottom: '0', left: '0' },
  },
  heading: {
    content: 'New Heading',
    level: 'h2',
    textAlign: 'left',
    fontWeight: '600',
    marginTop: '0',
    marginBottom: '20px',
  },
  text: {
    content: '<p>Add your text here</p>',
    textAlign: 'left',
    lineHeight: '1.6',
    marginTop: '0',
    marginBottom: '20px',
  },
  image: {
    src: '',
    alt: '',
    objectFit: 'cover',
    align: 'center',
    maxWidth: '100%',
  },
  button: {
    text: 'Click me',
    url: '#',
    target: '_self',
    size: 'medium',
    variant: 'solid',
    width: 'auto',
    align: 'left',
    borderRadius: '4px',
  },
} as const;
```

---

## Future Components (Phase 2+)

| Component | Priority | Description |
|-----------|----------|-------------|
| Columns | High | Multi-column layouts |
| Video | High | YouTube, Vimeo, self-hosted |
| Icon | High | Icon library display |
| Divider | Medium | Horizontal/vertical dividers |
| Spacer | Medium | Empty space control |
| List | Medium | Ordered/unordered lists |
| Testimonial | Low | Quote + attribution |
| Gallery | Low | Image grids/masonry |
| Accordion | Low | Collapsible content |
| Tabs | Low | Tabbed content panels |
| Form | Low | Contact forms (integration) |
| Social Icons | Low | Social media links |
