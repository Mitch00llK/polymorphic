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
