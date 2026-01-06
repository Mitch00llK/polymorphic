/**
 * Style Extractor
 *
 * Extracts component styles and generates CSS.
 * Used for generating optimized CSS on save/publish.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { ComponentData } from '../types/components';

/**
 * CSS property mapping from props to CSS.
 */
const PROP_TO_CSS: Record<string, string> = {
    // Typography
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontWeight: 'font-weight',
    lineHeight: 'line-height',
    letterSpacing: 'letter-spacing',
    textTransform: 'text-transform',
    textAlign: 'text-align',
    fontStyle: 'font-style',
    textDecoration: 'text-decoration',
    color: 'color',
    textColor: 'color',

    // Box Style
    backgroundColor: 'background-color',
    backgroundImage: 'background-image',
    backgroundSize: 'background-size',
    backgroundPosition: 'background-position',
    backgroundRepeat: 'background-repeat',
    borderWidth: 'border-width',
    borderStyle: 'border-style',
    borderColor: 'border-color',
    borderRadius: 'border-radius',
    borderTopLeftRadius: 'border-top-left-radius',
    borderTopRightRadius: 'border-top-right-radius',
    borderBottomLeftRadius: 'border-bottom-left-radius',
    borderBottomRightRadius: 'border-bottom-right-radius',
    boxShadow: 'box-shadow',
    opacity: 'opacity',

    // Size
    width: 'width',
    height: 'height',
    minWidth: 'min-width',
    maxWidth: 'max-width',
    minHeight: 'min-height',
    maxHeight: 'max-height',
    overflow: 'overflow',
    objectFit: 'object-fit',
    aspectRatio: 'aspect-ratio',

    // Spacing
    padding: 'padding',
    paddingTop: 'padding-top',
    paddingRight: 'padding-right',
    paddingBottom: 'padding-bottom',
    paddingLeft: 'padding-left',
    margin: 'margin',
    marginTop: 'margin-top',
    marginRight: 'margin-right',
    marginBottom: 'margin-bottom',
    marginLeft: 'margin-left',

    // Layout
    display: 'display',
    flexDirection: 'flex-direction',
    justifyContent: 'justify-content',
    alignItems: 'align-items',
    gap: 'gap',
    flexWrap: 'flex-wrap',

    // Position
    position: 'position',
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
    zIndex: 'z-index',
};

/**
 * Props that should be excluded from CSS generation.
 */
const EXCLUDED_PROPS = new Set([
    'content',
    'text',
    'title',
    'description',
    'footer',
    'tag',
    'url',
    'target',
    'src',
    'alt',
    'srcset',
    'sizes',
    'caption',
    'variant',
    'size',
    'showHeader',
    'showFooter',
    'items',
    'columns',
    'alignment',
    'direction',
    'wrap',
    'verticalAlign',
    'horizontalAlign',
    'align',
]);

/**
 * Generates a unique class name for a component.
 */
function generateClassName(componentId: string): string {
    // Use a short hash of the ID for cleaner class names
    const hash = componentId.split('-').pop() || componentId.slice(-8);
    return `p-${hash}`;
}

/**
 * Converts a prop value to a valid CSS value.
 */
function toCSSValue(prop: string, value: unknown): string | null {
    if (value === undefined || value === null || value === '') return null;

    // Handle special cases
    if (prop === 'backgroundImage' && typeof value === 'string' && !value.startsWith('url(')) {
        return `url(${value})`;
    }

    // Handle numbers
    if (typeof value === 'number') {
        // Some props don't need units
        if (['opacity', 'zIndex', 'fontWeight', 'lineHeight'].includes(prop)) {
            return String(value);
        }
        return `${value}px`;
    }

    return String(value);
}

/**
 * Extracts CSS rules from a single component's props.
 */
function extractComponentCSS(component: ComponentData): string {
    const props = component.props || {};
    const className = generateClassName(component.id);
    const rules: string[] = [];

    for (const [prop, value] of Object.entries(props)) {
        // Skip excluded props
        if (EXCLUDED_PROPS.has(prop)) continue;

        // Get CSS property name
        const cssProp = PROP_TO_CSS[prop];
        if (!cssProp) continue;

        // Convert value
        const cssValue = toCSSValue(prop, value);
        if (!cssValue) continue;

        rules.push(`  ${cssProp}: ${cssValue};`);
    }

    if (rules.length === 0) return '';

    return `.${className} {\n${rules.join('\n')}\n}`;
}

/**
 * Recursively extracts CSS from all components.
 */
function extractAllCSS(components: ComponentData[]): Map<string, string> {
    const cssMap = new Map<string, string>();

    function traverse(component: ComponentData) {
        const css = extractComponentCSS(component);
        if (css) {
            cssMap.set(component.id, css);
        }

        // Process children
        if (component.children) {
            for (const child of component.children) {
                traverse(child);
            }
        }
    }

    for (const component of components) {
        traverse(component);
    }

    return cssMap;
}

/**
 * Generates a complete CSS stylesheet from components.
 */
export function generateStylesheet(components: ComponentData[]): string {
    const cssMap = extractAllCSS(components);
    
    if (cssMap.size === 0) return '';

    const header = `/**
 * Polymorphic Generated Styles
 * Generated: ${new Date().toISOString()}
 * Components: ${cssMap.size}
 */

`;

    const rules = Array.from(cssMap.values()).join('\n\n');
    
    return header + rules;
}

/**
 * Generates a mapping of component IDs to class names.
 */
export function generateClassMap(components: ComponentData[]): Map<string, string> {
    const classMap = new Map<string, string>();

    function traverse(component: ComponentData) {
        classMap.set(component.id, generateClassName(component.id));

        if (component.children) {
            for (const child of component.children) {
                traverse(child);
            }
        }
    }

    for (const component of components) {
        traverse(component);
    }

    return classMap;
}

/**
 * Minifies CSS by removing whitespace and comments.
 */
export function minifyCSS(css: string): string {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove newlines and extra spaces
        .replace(/\s+/g, ' ')
        // Remove space around special characters
        .replace(/\s*([{}:;,])\s*/g, '$1')
        // Remove trailing semicolons before closing braces
        .replace(/;}/g, '}')
        .trim();
}

/**
 * Generates both full and minified CSS.
 */
export function generateStyles(components: ComponentData[]): {
    css: string;
    minified: string;
    classMap: Map<string, string>;
} {
    const css = generateStylesheet(components);
    const minified = minifyCSS(css);
    const classMap = generateClassMap(components);

    return { css, minified, classMap };
}

export default generateStylesheet;

