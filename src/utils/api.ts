/**
 * API utilities for communicating with WordPress REST API.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import apiFetch from '@wordpress/api-fetch';

import type { BuilderData, ComponentData } from '../types/components';
import { generateStyles } from './styleExtractor';

/**
 * API base path.
 */
const API_BASE = '/polymorphic/v1';

/**
 * Generic API response.
 */
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * Save response data.
 */
interface SaveResponse {
    modified: string;
    cache_key: string;
}

/**
 * Load response data.
 */
interface LoadResponse {
    version: string;
    created: string;
    modified: string;
    settings: BuilderData['settings'];
    components: ComponentData[];
    customCss: string;
}

/**
 * Media upload response.
 */
interface MediaResponse {
    id: number;
    url: string;
    alt: string;
    width: number;
    height: number;
    sizes: Record<string, string>;
}

/**
 * Save builder data for a post.
 * Automatically generates and includes optimized CSS.
 *
 * @param postId - Post ID.
 * @param data   - Builder data to save.
 * @returns Save response.
 */
export const saveBuilderData = async (
    postId: number,
    data: Partial<BuilderData>
): Promise<SaveResponse> => {
    // Generate optimized CSS from components
    const components = data.components || [];
    const { minified: generatedCss, classMap } = generateStyles(components);

    // Include generated CSS and class map in the save data
    const saveData = {
        ...data,
        generatedCss,
        classMap: Object.fromEntries(classMap),
    };

    const response = await apiFetch<ApiResponse<SaveResponse>>({
        path: `${API_BASE}/posts/${postId}/builder`,
        method: 'POST',
        data: { data: saveData },
    });

    if (!response.success) {
        throw new Error(response.message || 'Failed to save');
    }

    return response.data;
};

/**
 * Load builder data for a post.
 *
 * @param postId - Post ID.
 * @returns Builder data or null if not found.
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
    } catch (error: unknown) {
        const apiError = error as { code?: string };
        if (apiError?.code === 'polymorphic_not_found') {
            return null;
        }
        throw error;
    }
};

/**
 * Get default properties for a component type.
 *
 * @param type - Component type.
 * @returns Default properties.
 */
export const getComponentDefaults = async (
    type: string
): Promise<Record<string, unknown>> => {
    const response = await apiFetch<
        ApiResponse<{ defaults: Record<string, unknown> }>
    >({
        path: `${API_BASE}/components/${type}/defaults`,
        method: 'GET',
    });

    return response.data.defaults;
};

/**
 * Get all registered components.
 *
 * @returns List of registered components.
 */
export const getRegisteredComponents = async (): Promise<
    Array<{
        type: string;
        label: string;
        category: string;
        icon: string;
        supports_children: boolean;
    }>
> => {
    const response = await apiFetch<ApiResponse<any[]>>({
        path: `${API_BASE}/components`,
        method: 'GET',
    });

    return response.data;
};

/**
 * Upload a media file.
 *
 * @param file   - File to upload.
 * @param postId - Optional post ID to attach.
 * @returns Media data.
 */
export const uploadMedia = async (
    file: File,
    postId?: number
): Promise<MediaResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (postId) {
        formData.append('post_id', String(postId));
    }

    const response = await apiFetch<ApiResponse<MediaResponse>>({
        path: `${API_BASE}/media`,
        method: 'POST',
        body: formData,
    });

    return response.data;
};

/**
 * Render preview HTML.
 *
 * @param postId     - Post ID.
 * @param data       - Builder data.
 * @param breakpoint - Breakpoint to render.
 * @returns Preview HTML and CSS.
 */
export const renderPreview = async (
    postId: number,
    data: Partial<BuilderData>,
    breakpoint: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): Promise<{ html: string; css: string }> => {
    const response = await apiFetch<
        ApiResponse<{ html: string; css: string; scripts: string[] }>
    >({
        path: `${API_BASE}/preview`,
        method: 'POST',
        data: {
            post_id: postId,
            data,
            breakpoint,
        },
    });

    return response.data;
};

// ============================================================================
// AUTO-SAVE & REVISIONS
// ============================================================================

/**
 * Revision data structure.
 */
interface Revision {
    id: number;
    date: string;
    author: string;
    authorName: string;
}

/**
 * Auto-save builder data (creates revision, doesn't publish).
 *
 * @param postId - Post ID.
 * @param data   - Builder data.
 * @returns Revision info.
 */
export const autoSaveBuilderData = async (
    postId: number,
    data: Partial<BuilderData>
): Promise<{ revisionId: number; savedAt: string }> => {
    const components = data.components || [];
    const { minified: generatedCss, classMap } = generateStyles(components);

    const response = await apiFetch<
        ApiResponse<{ revision_id: number; saved_at: string }>
    >({
        path: `${API_BASE}/posts/${postId}/autosave`,
        method: 'POST',
        data: {
            data: { ...data, generatedCss, classMap: Object.fromEntries(classMap) },
        },
    });

    return {
        revisionId: response.data.revision_id,
        savedAt: response.data.saved_at,
    };
};

/**
 * Get revision history for a post.
 *
 * @param postId - Post ID.
 * @returns List of revisions.
 */
export const getRevisions = async (postId: number): Promise<Revision[]> => {
    const response = await apiFetch<ApiResponse<Revision[]>>({
        path: `${API_BASE}/posts/${postId}/revisions`,
        method: 'GET',
    });

    return response.data;
};

/**
 * Restore a specific revision.
 *
 * @param postId     - Post ID.
 * @param revisionId - Revision ID to restore.
 * @returns Restored builder data.
 */
export const restoreRevision = async (
    postId: number,
    revisionId: number
): Promise<LoadResponse> => {
    const response = await apiFetch<ApiResponse<LoadResponse>>({
        path: `${API_BASE}/posts/${postId}/revisions/${revisionId}/restore`,
        method: 'POST',
    });

    return response.data;
};

// ============================================================================
// GLOBAL BLOCKS
// ============================================================================

/**
 * Global block data structure.
 */
interface GlobalBlock {
    id: number;
    name: string;
    component: ComponentData;
    created: string;
    modified: string;
    usageCount: number;
}

/**
 * Save a component as a global reusable block.
 *
 * @param component - Component data to save.
 * @param name      - Name for the global block.
 * @returns Created global block.
 */
export const saveAsGlobalBlock = async (
    component: ComponentData,
    name: string
): Promise<GlobalBlock> => {
    const response = await apiFetch<ApiResponse<GlobalBlock>>({
        path: `${API_BASE}/global-blocks`,
        method: 'POST',
        data: { component, name },
    });

    return response.data;
};

/**
 * Get all global blocks.
 *
 * @returns List of global blocks.
 */
export const getGlobalBlocks = async (): Promise<GlobalBlock[]> => {
    const response = await apiFetch<ApiResponse<GlobalBlock[]>>({
        path: `${API_BASE}/global-blocks`,
        method: 'GET',
    });

    return response.data;
};

/**
 * Update a global block (propagates to all usages).
 *
 * @param blockId   - Global block ID.
 * @param component - Updated component data.
 * @returns Updated global block.
 */
export const updateGlobalBlock = async (
    blockId: number,
    component: Partial<ComponentData>
): Promise<GlobalBlock> => {
    const response = await apiFetch<ApiResponse<GlobalBlock>>({
        path: `${API_BASE}/global-blocks/${blockId}`,
        method: 'PUT',
        data: { component },
    });

    return response.data;
};

/**
 * Delete a global block.
 *
 * @param blockId - Global block ID.
 */
export const deleteGlobalBlock = async (blockId: number): Promise<void> => {
    await apiFetch<ApiResponse<null>>({
        path: `${API_BASE}/global-blocks/${blockId}`,
        method: 'DELETE',
    });
};

// ============================================================================
// EXPORT / IMPORT
// ============================================================================

/**
 * Page export data structure.
 */
interface PageExport {
    version: string;
    exportedAt: string;
    settings: BuilderData['settings'];
    components: ComponentData[];
    customCss: string;
    globalBlockRefs: number[];
}

/**
 * Export a page as JSON.
 *
 * @param postId - Post ID to export.
 * @returns Exportable page data.
 */
export const exportPage = async (postId: number): Promise<PageExport> => {
    const response = await apiFetch<ApiResponse<PageExport>>({
        path: `${API_BASE}/posts/${postId}/export`,
        method: 'GET',
    });

    return response.data;
};

/**
 * Import a page from JSON.
 *
 * @param data        - Page export data.
 * @param targetPostId - Optional target post ID (creates new if not provided).
 * @returns Import result.
 */
export const importPage = async (
    data: PageExport,
    targetPostId?: number
): Promise<{ postId: number; imported: boolean }> => {
    const response = await apiFetch<
        ApiResponse<{ post_id: number; imported: boolean }>
    >({
        path: `${API_BASE}/import`,
        method: 'POST',
        data: { data, target_post_id: targetPostId },
    });

    return {
        postId: response.data.post_id,
        imported: response.data.imported,
    };
};

// ============================================================================
// COMPONENT UTILITIES
// ============================================================================

/**
 * Generate new IDs for a component tree (for duplication).
 *
 * @param component - Component to clone.
 * @returns Component with new IDs.
 */
export const duplicateComponent = (component: ComponentData): ComponentData => {
    const generateId = () => `${component.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const cloneWithNewIds = (comp: ComponentData): ComponentData => ({
        ...comp,
        id: generateId(),
        children: comp.children?.map(cloneWithNewIds),
    });

    return cloneWithNewIds(component);
};

/**
 * Export a component as JSON string.
 *
 * @param component - Component to export.
 * @returns JSON string.
 */
export const exportComponent = (component: ComponentData): string => {
    return JSON.stringify(component, null, 2);
};

/**
 * Import a component from JSON string.
 *
 * @param json - JSON string.
 * @returns Imported component with new IDs.
 */
export const importComponent = (json: string): ComponentData => {
    const component = JSON.parse(json) as ComponentData;
    return duplicateComponent(component);
};

