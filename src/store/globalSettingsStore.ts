/**
 * Global Settings Store - Zustand state management
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import apiFetch from '@wordpress/api-fetch';

/**
 * Layout settings interface.
 */
export interface LayoutSettings {
    containerWidth: string;
    containerWidthWide: string;
    containerWidthNarrow: string;
    defaultGap: string;
    sectionPaddingTop: string;
    sectionPaddingBottom: string;
}

/**
 * Typography settings interface.
 */
export interface TypographySettings {
    bodyFont: string;
    headingFont: string;
    baseFontSize: string;
    baseLineHeight: string;
    h1Size: string;
    h2Size: string;
    h3Size: string;
    h4Size: string;
    h5Size: string;
    h6Size: string;
}

/**
 * Color settings interface.
 */
export interface ColorSettings {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    background: string;
    surface: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
}

/**
 * Button settings interface.
 */
export interface ButtonSettings {
    borderRadius: string;
    paddingX: string;
    paddingY: string;
    fontSize: string;
    fontWeight: string;
    transition: string;
}

/**
 * Breakpoint settings interface.
 */
export interface BreakpointSettings {
    tablet: string;
    mobile: string;
}

/**
 * All global settings interface.
 */
export interface GlobalSettings {
    layout: LayoutSettings;
    typography: TypographySettings;
    colors: ColorSettings;
    buttons: ButtonSettings;
    breakpoints: BreakpointSettings;
}

/**
 * Settings group type.
 */
export type SettingsGroup = keyof GlobalSettings;

/**
 * Store state interface.
 */
interface GlobalSettingsState {
    settings: GlobalSettings | null;
    defaults: GlobalSettings | null;
    isLoading: boolean;
    isSaving: boolean;
    isDirty: boolean;
    activeTab: SettingsGroup;
    error: string | null;
}

/**
 * Store actions interface.
 */
interface GlobalSettingsActions {
    // Data operations.
    loadSettings: () => Promise<void>;
    loadDefaults: () => Promise<void>;
    saveSettings: () => Promise<boolean>;
    resetSettings: () => Promise<void>;

    // Update operations.
    updateGroup: <K extends SettingsGroup>(
        group: K,
        settings: Partial<GlobalSettings[K]>
    ) => void;
    updateSetting: <K extends SettingsGroup>(
        group: K,
        key: keyof GlobalSettings[K],
        value: string
    ) => void;

    // UI state.
    setActiveTab: (tab: SettingsGroup) => void;
    setError: (error: string | null) => void;

    // Utilities.
    getGroupSettings: <K extends SettingsGroup>(group: K) => GlobalSettings[K] | null;
    generateCssVariables: () => string;
}

/**
 * API response interface.
 */
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * API base path.
 */
const API_BASE = '/polymorphic/v1';

/**
 * Default settings (fallback before loading from API).
 */
const DEFAULT_SETTINGS: GlobalSettings = {
    layout: {
        containerWidth: '1200px',
        containerWidthWide: '1400px',
        containerWidthNarrow: '768px',
        defaultGap: '20px',
        sectionPaddingTop: '60px',
        sectionPaddingBottom: '60px',
    },
    typography: {
        bodyFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        headingFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        baseFontSize: '16px',
        baseLineHeight: '1.6',
        h1Size: '3rem',
        h2Size: '2.25rem',
        h3Size: '1.875rem',
        h4Size: '1.5rem',
        h5Size: '1.25rem',
        h6Size: '1rem',
    },
    colors: {
        primary: '#6366f1',
        secondary: '#64748b',
        accent: '#22c55e',
        text: '#1a1a1a',
        textMuted: '#6b7280',
        background: '#ffffff',
        surface: '#f9fafb',
        border: '#e5e7eb',
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#22c55e',
        info: '#3b82f6',
    },
    buttons: {
        borderRadius: '6px',
        paddingX: '1.5rem',
        paddingY: '0.75rem',
        fontSize: '1rem',
        fontWeight: '500',
        transition: '0.2s ease',
    },
    breakpoints: {
        tablet: '1024px',
        mobile: '768px',
    },
};

/**
 * Global settings store.
 */
export const useGlobalSettingsStore = create<GlobalSettingsState & GlobalSettingsActions>()(
    devtools(
        (set, get) => ({
            // Initial state.
            settings: null,
            defaults: null,
            isLoading: false,
            isSaving: false,
            isDirty: false,
            activeTab: 'layout',
            error: null,

            // Load settings from API.
            loadSettings: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiFetch<ApiResponse<GlobalSettings>>({
                        path: `${API_BASE}/settings`,
                        method: 'GET',
                    });

                    if (response.success) {
                        set({ settings: response.data, isLoading: false, isDirty: false });
                    } else {
                        throw new Error('Failed to load settings');
                    }
                } catch (error) {
                    console.error('[Polymorphic] Failed to load global settings:', error);
                    // Fall back to defaults.
                    set({ settings: DEFAULT_SETTINGS, isLoading: false });
                }
            },

            // Load default settings from API.
            loadDefaults: async () => {
                try {
                    const response = await apiFetch<ApiResponse<GlobalSettings>>({
                        path: `${API_BASE}/settings/defaults`,
                        method: 'GET',
                    });

                    if (response.success) {
                        set({ defaults: response.data });
                    }
                } catch (error) {
                    console.error('[Polymorphic] Failed to load defaults:', error);
                    set({ defaults: DEFAULT_SETTINGS });
                }
            },

            // Save settings to API.
            saveSettings: async () => {
                const { settings } = get();

                if (!settings) return false;

                set({ isSaving: true, error: null });

                try {
                    const response = await apiFetch<ApiResponse<GlobalSettings>>({
                        path: `${API_BASE}/settings`,
                        method: 'POST',
                        data: { settings },
                    });

                    if (response.success) {
                        set({ settings: response.data, isSaving: false, isDirty: false });
                        return true;
                    } else {
                        throw new Error(response.message || 'Failed to save settings');
                    }
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Failed to save settings';
                    console.error('[Polymorphic] Failed to save global settings:', error);
                    set({ isSaving: false, error: message });
                    return false;
                }
            },

            // Reset settings to defaults.
            resetSettings: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiFetch<ApiResponse<GlobalSettings>>({
                        path: `${API_BASE}/settings/reset`,
                        method: 'POST',
                    });

                    if (response.success) {
                        set({ settings: response.data, isLoading: false, isDirty: false });
                    } else {
                        throw new Error('Failed to reset settings');
                    }
                } catch (error) {
                    console.error('[Polymorphic] Failed to reset settings:', error);
                    set({ isLoading: false });
                }
            },

            // Update an entire settings group.
            updateGroup: (group, groupSettings) => {
                const { settings } = get();

                if (!settings) return;

                set({
                    settings: {
                        ...settings,
                        [group]: {
                            ...settings[group],
                            ...groupSettings,
                        },
                    },
                    isDirty: true,
                });
            },

            // Update a single setting.
            updateSetting: (group, key, value) => {
                const { settings } = get();

                if (!settings) return;

                set({
                    settings: {
                        ...settings,
                        [group]: {
                            ...settings[group],
                            [key]: value,
                        },
                    },
                    isDirty: true,
                });
            },

            // Set active tab.
            setActiveTab: (tab) => set({ activeTab: tab }),

            // Set error message.
            setError: (error) => set({ error }),

            // Get settings for a specific group.
            getGroupSettings: (group) => {
                const { settings } = get();
                return settings ? settings[group] : null;
            },

            // Generate CSS variables string (for live preview).
            generateCssVariables: () => {
                const { settings } = get();

                if (!settings) return '';

                const { layout, typography, colors, buttons, breakpoints } = settings;

                return `
:root {
  /* Layout */
  --poly-container-width: ${layout.containerWidth};
  --poly-container-wide: ${layout.containerWidthWide};
  --poly-container-narrow: ${layout.containerWidthNarrow};
  --poly-gap: ${layout.defaultGap};
  --poly-section-padding-top: ${layout.sectionPaddingTop};
  --poly-section-padding-bottom: ${layout.sectionPaddingBottom};

  /* Typography */
  --poly-font-body: ${typography.bodyFont};
  --poly-font-heading: ${typography.headingFont};
  --poly-font-size: ${typography.baseFontSize};
  --poly-line-height: ${typography.baseLineHeight};
  --poly-h1-size: ${typography.h1Size};
  --poly-h2-size: ${typography.h2Size};
  --poly-h3-size: ${typography.h3Size};
  --poly-h4-size: ${typography.h4Size};
  --poly-h5-size: ${typography.h5Size};
  --poly-h6-size: ${typography.h6Size};

  /* Colors */
  --poly-color-primary: ${colors.primary};
  --poly-color-secondary: ${colors.secondary};
  --poly-color-accent: ${colors.accent};
  --poly-color-text: ${colors.text};
  --poly-color-muted: ${colors.textMuted};
  --poly-color-bg: ${colors.background};
  --poly-color-surface: ${colors.surface};
  --poly-color-border: ${colors.border};
  --poly-color-error: ${colors.error};
  --poly-color-warning: ${colors.warning};
  --poly-color-success: ${colors.success};
  --poly-color-info: ${colors.info};

  /* Buttons */
  --poly-btn-radius: ${buttons.borderRadius};
  --poly-btn-px: ${buttons.paddingX};
  --poly-btn-py: ${buttons.paddingY};
  --poly-btn-font-size: ${buttons.fontSize};
  --poly-btn-font-weight: ${buttons.fontWeight};
  --poly-btn-transition: ${buttons.transition};

  /* Breakpoints */
  --poly-breakpoint-tablet: ${breakpoints.tablet};
  --poly-breakpoint-mobile: ${breakpoints.mobile};
}`.trim();
            },
        }),
        { name: 'polymorphic-global-settings' }
    )
);

