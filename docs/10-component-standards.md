# Frontend Component Standards

This document defines the standards for building frontend components rendered by Polymorphic on the live site. All components must follow atomic design principles and use generic, reusable class names.

## Atomic Design Structure

Components are organized into three levels following atomic design methodology:

### Atoms
Smallest, single-purpose elements that cannot be broken down further.

| Component | Description | Example Classes |
|-----------|-------------|-----------------|
| **Heading** | Typography headings h1-h6 | `.heading`, `.heading--h1`, `.heading--h2` |
| **Text** | Paragraph and inline text | `.text`, `.text--lead`, `.text--small` |
| **Button** | Interactive buttons | `.btn`, `.btn--primary`, `.btn--outline` |
| **Image** | Responsive images | `.image`, `.image--rounded`, `.image--cover` |
| **Icon** | SVG icons | `.icon`, `.icon--sm`, `.icon--lg` |
| **Link** | Anchor elements | `.link`, `.link--underline` |
| **Divider** | Horizontal rules | `.divider`, `.divider--thick` |
| **Spacer** | Vertical spacing | `.spacer`, `.spacer--sm`, `.spacer--lg` |

### Molecules
Combinations of atoms that form functional units.

| Component | Description | Example Classes |
|-----------|-------------|-----------------|
| **Card** | Content container | `.card`, `.card__header`, `.card__body` |
| **Media** | Image + text pairs | `.media`, `.media__image`, `.media__content` |
| **Form Field** | Label + input combo | `.field`, `.field__label`, `.field__input` |
| **Nav Item** | Link + icon combo | `.nav-item`, `.nav-item__icon` |
| **Badge** | Label with icon | `.badge`, `.badge--success` |

### Organisms
Complex components composed of molecules and atoms.

| Component | Description | Example Classes |
|-----------|-------------|-----------------|
| **Section** | Full-width page section | `.section`, `.section--dark` |
| **Container** | Content width wrapper | `.container`, `.container--narrow` |
| **Header** | Site header | `.header`, `.header__logo` |
| **Footer** | Site footer | `.footer`, `.footer__nav` |
| **Grid** | Layout grid | `.grid`, `.grid__col`, `.grid--2`, `.grid--3` |
| **Slider** | Carousel/slider | `.slider`, `.slider__slide` |

---

## Class Naming Convention

### Rules

1. **NO builder name in classes** — Never use `polymorphic-*` in rendered output
2. **Use BEM methodology** — Block, Element, Modifier pattern
3. **Lowercase with hyphens** — Use kebab-case: `.card-header` not `.cardHeader`
4. **Semantic names** — Describe purpose, not appearance: `.btn--primary` not `.btn--blue`
5. **Prefixes for state** — Use `is-*` or `has-*`: `.is-active`, `.has-icon`

### BEM Pattern

```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

### Examples

```html
<!-- ❌ BAD: Builder name in class -->
<div class="polymorphic-section polymorphic-section--dark">

<!-- ✅ GOOD: Generic, reusable classes -->
<section class="section section--dark">
  <div class="container">
    <h2 class="heading heading--h2">Title</h2>
    <p class="text text--lead">Lead paragraph text.</p>
    <a href="#" class="btn btn--primary">Learn More</a>
  </div>
</section>
```

---

## Component Output Structure

### Section
```html
<section class="section section--{style}" id="{id}" style="{inline}">
  <div class="section__inner">
    {children}
  </div>
</section>
```

### Container
```html
<div class="container container--{width}" id="{id}">
  {children}
</div>
```

### Heading
```html
<h{level} class="heading heading--h{level} {alignment}" id="{id}">
  {content}
</h{level}>
```

### Text
```html
<{tag} class="text text--{variant}" id="{id}">
  {content}
</{tag}>
```

### Image
```html
<figure class="image image--{style}" id="{id}">
  <img src="{src}" alt="{alt}" class="image__img" loading="lazy">
  {caption && <figcaption class="image__caption">{caption}</figcaption>}
</figure>
```

### Button
```html
<a href="{url}" class="btn btn--{variant} btn--{size}" id="{id}" {target}>
  {icon && <span class="btn__icon">{icon}</span>}
  <span class="btn__text">{text}</span>
</a>
```

---

## Responsive Classes

Use breakpoint suffixes for responsive behavior:

| Suffix | Breakpoint | Description |
|--------|------------|-------------|
| (none) | Mobile-first | Default/mobile styles |
| `@sm` | 640px+ | Small screens |
| `@md` | 768px+ | Medium screens (tablet) |
| `@lg` | 1024px+ | Large screens (desktop) |
| `@xl` | 1280px+ | Extra large screens |

### Example
```html
<div class="grid grid--1 grid--2@md grid--3@lg">
  <!-- 1 column mobile, 2 tablet, 3 desktop -->
</div>
```

---

## Utility Classes

Minimal utility classes for common adjustments:

### Spacing
- `.mt-{0-8}` — Margin top
- `.mb-{0-8}` — Margin bottom
- `.pt-{0-8}` — Padding top
- `.pb-{0-8}` — Padding bottom

### Text
- `.text-left`, `.text-center`, `.text-right`
- `.font-bold`, `.font-normal`
- `.uppercase`, `.lowercase`

### Display
- `.hidden`, `.block`, `.inline`, `.flex`
- `.hidden@md`, `.block@lg` (responsive)

### Visibility
- `.sr-only` — Screen reader only
- `.invisible` — Hidden but takes space

---

## CSS Custom Properties

Components should use CSS custom properties for theming:

```css
.section {
  background-color: var(--color-background);
  padding: var(--spacing-section);
}

.heading {
  font-family: var(--font-heading);
  color: var(--color-heading);
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-primary-contrast);
}
```

### Required Properties
```css
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-primary-contrast: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #1f2937;
  --color-muted: #6b7280;
  --color-border: #e5e7eb;
  
  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-heading: 'Inter', sans-serif;
  
  /* Spacing */
  --spacing-section: 4rem;
  --spacing-container: 2rem;
  
  /* Layout */
  --container-max: 1200px;
  --container-narrow: 768px;
}
```

---

## Accessibility Requirements

All components MUST:

1. **Semantic HTML** — Use correct elements (`<section>`, `<article>`, `<nav>`, etc.)
2. **ARIA labels** — Add aria-label where needed
3. **Focus states** — Visible focus indicators on interactive elements
4. **Color contrast** — Meet WCAG AA standards (4.5:1 for text)
5. **Alt text** — Required for all images
6. **Keyboard navigation** — All interactive elements keyboard accessible
7. **Skip links** — Provide skip-to-content for complex layouts

---

## File Organization

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.css
│   │   ├── Heading/
│   │   ├── Text/
│   │   ├── Image/
│   │   └── Icon/
│   ├── molecules/
│   │   ├── Card/
│   │   ├── Media/
│   │   └── FormField/
│   ├── organisms/
│   │   ├── Section/
│   │   ├── Container/
│   │   └── Grid/
│   └── builder/
│       ├── Canvas/
│       ├── Sidebar/
│       ├── Toolbar/
│       └── PropertyPanel/
```

---

## Checklist for New Components

- [ ] Uses atomic design level appropriately
- [ ] Class names are generic (no `polymorphic-*`)
- [ ] Uses BEM naming convention
- [ ] Uses CSS custom properties for theming
- [ ] Includes responsive breakpoint support
- [ ] Meets accessibility requirements
- [ ] Has proper semantic HTML structure
- [ ] Documented with example output
