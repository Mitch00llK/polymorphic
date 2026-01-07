/**
 * Component Registry Service.
 *
 * Fetches and manages component registrations from the API.
 * Handles dynamic CSS/JS asset loading for third-party components.
 *
 * @package Polymorphic
 */

import apiFetch from '@wordpress/api-fetch';

/**
 * Component registration from the API.
 */
export interface ComponentRegistration {
    type: string;
    label: string;
    icon: string;
    category: string;
    source: 'core' | string;
    supports: string[];
    defaultProps: Record<string, unknown>;
    assets: {
        css: {
            inline: string | null;
            url: string | null;
        };
        js: {
            editor: string | null;
            frontend: string | null;
        };
    };
}

/**
 * API response for component list.
 */
interface ComponentsResponse {
    components: ComponentRegistration[];
}

/**
 * API response for rendered component.
 */
interface RenderResponse {
    html: string;
    css: string;
}

/**
 * Component Registry Service.
 *
 * Handles fetching component registrations and loading assets dynamically.
 */
class ComponentRegistryService {
    private cache: Map<string, ComponentRegistration> = new Map();
    private loadedCSS: Set<string> = new Set();
    private loadedJS: Set<string> = new Set();
    private fetchPromise: Promise<ComponentRegistration[]> | null = null;

    /**
     * Fetch all components from the API.
     */
    async fetchRegistry(): Promise<ComponentRegistration[]> {
        // Return cached promise if already fetching.
        if (this.fetchPromise) {
            return this.fetchPromise;
        }

        // Return from cache if already loaded.
        if (this.cache.size > 0) {
            return Array.from(this.cache.values());
        }

        this.fetchPromise = apiFetch<ComponentsResponse>({
            path: '/polymorphic/v1/components',
        }).then((response) => {
            // Validate response structure
            if (!response || !Array.isArray(response.components)) {
                console.error('Invalid component API response:', response);
                return [];
            }

            response.components.forEach((component) => {
                this.cache.set(component.type, component);
            });
            this.fetchPromise = null;
            return response.components;
        });

        return this.fetchPromise;
    }

    /**
     * Get a single component registration.
     */
    async getComponent(type: string): Promise<ComponentRegistration | null> {
        // Check cache first.
        if (this.cache.has(type)) {
            return this.cache.get(type) || null;
        }

        // Fetch from API.
        try {
            const component = await apiFetch<ComponentRegistration>({
                path: `/polymorphic/v1/components/${encodeURIComponent(type)}`,
            });
            this.cache.set(type, component);
            return component;
        } catch {
            return null;
        }
    }

    /**
     * Render a component via the API.
     */
    async renderComponent(
        type: string,
        props: Record<string, unknown>,
        context: 'editor' | 'frontend' = 'editor'
    ): Promise<RenderResponse | null> {
        try {
            return await apiFetch<RenderResponse>({
                path: '/polymorphic/v1/components/render',
                method: 'POST',
                data: { type, props, context },
            });
        } catch {
            return null;
        }
    }

    /**
     * Load CSS assets for a component.
     */
    async loadCSS(component: ComponentRegistration): Promise<void> {
        const { css } = component.assets;
        const type = component.type;

        // Inject inline CSS.
        if (css.inline && !this.loadedCSS.has(`${type}-inline`)) {
            const style = document.createElement('style');
            style.textContent = css.inline;
            style.dataset.component = type;
            style.dataset.source = 'inline';
            document.head.appendChild(style);
            this.loadedCSS.add(`${type}-inline`);
        }

        // Load external CSS.
        if (css.url && !this.loadedCSS.has(`${type}-url`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = css.url;
            link.dataset.component = type;
            link.dataset.source = 'external';
            document.head.appendChild(link);
            this.loadedCSS.add(`${type}-url`);
        }
    }

    /**
     * Load editor JS assets for a component.
     */
    async loadEditorJS(component: ComponentRegistration): Promise<void> {
        const { js } = component.assets;
        const type = component.type;

        if (js.editor && !this.loadedJS.has(`${type}-editor`)) {
            await this.loadScript(js.editor, type, 'editor');
            this.loadedJS.add(`${type}-editor`);
        }
    }

    /**
     * Load a script dynamically.
     */
    private loadScript(url: string, type: string, context: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.dataset.component = type;
            script.dataset.context = context;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.body.appendChild(script);
        });
    }

    /**
     * Load all assets for a component (CSS + JS).
     */
    async loadAssets(type: string): Promise<void> {
        const component = await this.getComponent(type);
        if (!component) return;

        await this.loadCSS(component);
        await this.loadEditorJS(component);
    }

    /**
     * Get all registered component types.
     */
    getTypes(): string[] {
        return Array.from(this.cache.keys());
    }

    /**
     * Get components by category.
     */
    getByCategory(category: string): ComponentRegistration[] {
        return Array.from(this.cache.values()).filter((c) => c.category === category);
    }

    /**
     * Get third-party components only.
     */
    getThirdParty(): ComponentRegistration[] {
        return Array.from(this.cache.values()).filter((c) => c.source !== 'core');
    }

    /**
     * Check if a component is registered.
     */
    has(type: string): boolean {
        return this.cache.has(type);
    }

    /**
     * Clear the cache (useful for dev/testing).
     */
    clearCache(): void {
        this.cache.clear();
        this.fetchPromise = null;
    }
}

// Export singleton instance.
export const componentRegistry = new ComponentRegistryService();
export default componentRegistry;
