/**
 * Component type definitions.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

/**
 * Available component types.
 */
export type ComponentType =
    | 'section'
    | 'container'
    | 'heading'
    | 'text'
    | 'image'
    | 'button'
    // UI Components (shadcn-style)
    | 'card'
    | 'accordion'
    | 'tabs'
    | 'alert'
    | 'badge'
    | 'avatar'
    | 'separator';

/**
 * Available breakpoints.
 */
export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

/**
 * Spacing properties.
 */
export interface SpacingProps {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

/**
 * Link properties.
 */
export interface LinkProps {
    url: string;
    target: '_self' | '_blank';
    rel?: string;
}

/**
 * Responsive overrides.
 */
export interface ResponsiveOverrides {
    tablet?: Record<string, unknown>;
    mobile?: Record<string, unknown>;
}

/**
 * Base component data structure.
 */
export interface ComponentData {
    /** Unique component identifier */
    id: string;

    /** Component type */
    type: ComponentType;

    /** Component properties */
    props: Record<string, unknown>;

    /** Responsive property overrides */
    responsive?: ResponsiveOverrides;

    /** Child components (for containers) */
    children?: ComponentData[];
}

/**
 * Section component properties.
 */
export interface SectionProps {
    width: 'full' | 'boxed';
    minHeight?: string;
    verticalAlign: 'start' | 'center' | 'end' | 'stretch';
    horizontalAlign: 'start' | 'center' | 'end' | 'stretch';
    gap: string;
    backgroundColor?: string;
    backgroundImage?: string;
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
    marginTop: string;
    marginBottom: string;
}

/**
 * Container component properties.
 */
export interface ContainerProps {
    maxWidth: string;
    width: 'full' | 'auto';
    alignment: 'left' | 'center' | 'right';
    direction: 'row' | 'column';
    wrap: 'nowrap' | 'wrap';
    justifyContent: 'start' | 'center' | 'end' | 'between' | 'around';
    alignItems: 'start' | 'center' | 'end' | 'stretch';
    gap: string;
    backgroundColor?: string;
    padding: SpacingProps;
    borderRadius?: string;
}

/**
 * Heading component properties.
 */
export interface HeadingProps {
    content: string;
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    color?: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    marginTop?: string;
    marginBottom?: string;
    link?: LinkProps;
}

/**
 * Text component properties.
 */
export interface TextProps {
    content: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    color?: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    marginTop?: string;
    marginBottom?: string;
    columns?: 1 | 2 | 3 | 4;
}

/**
 * Image component properties.
 */
export interface ImageProps {
    src: string;
    alt: string;
    srcset?: string;
    sizes?: string;
    width?: string;
    height?: string;
    maxWidth?: string;
    aspectRatio?: string;
    objectFit: 'cover' | 'contain' | 'fill' | 'none';
    borderRadius?: string;
    boxShadow?: string;
    align: 'left' | 'center' | 'right';
    link?: LinkProps;
    caption?: string;
}

/**
 * Button component properties.
 */
export interface ButtonProps {
    text: string;
    icon?: {
        name: string;
        position: 'left' | 'right';
    };
    url: string;
    target: '_self' | '_blank';
    size: 'small' | 'medium' | 'large';
    width: 'auto' | 'full';
    variant: 'solid' | 'outline' | 'ghost' | 'link';
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
    hoverBackgroundColor?: string;
    hoverTextColor?: string;
    fontSize?: string;
    fontWeight?: string;
    align: 'left' | 'center' | 'right';
}

/**
 * Builder data structure (what gets saved to postmeta).
 */
export interface BuilderData {
    version: string;
    created: string;
    modified: string;
    settings: PageSettings;
    components: ComponentData[];
    customCss: string;
    customJs: string;
}

/**
 * Page-level settings.
 */
export interface PageSettings {
    pageBackground: string;
    contentWidth: string;
    bodyFont: string;
    headingFont: string;
    primaryColor?: string;
    secondaryColor?: string;
}

/**
 * Component registry entry.
 */
export interface ComponentRegistryEntry {
    type: ComponentType;
    label: string;
    category: 'layout' | 'content' | 'media' | 'actions' | 'widgets';
    icon: string;
    supports_children: boolean;
}
