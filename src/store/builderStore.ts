/**
 * Builder Store - Zustand state management
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import type { ComponentData, ComponentType, Breakpoint } from '../types/components';

/**
 * History entry for undo/redo.
 */
interface HistoryEntry {
    components: ComponentData[];
    timestamp: number;
    action: string;
}

/**
 * Builder state interface.
 */
interface BuilderState {
    // Component tree.
    components: ComponentData[];

    // Selection.
    selectedId: string | null;

    // UI state.
    isLoading: boolean;
    isSaving: boolean;
    isDirty: boolean;
    currentBreakpoint: Breakpoint;

    // History for undo/redo.
    past: HistoryEntry[];
    future: HistoryEntry[];
    maxHistorySize: number;
}

/**
 * Builder actions interface.
 */
interface BuilderActions {
    // Component management.
    setComponents: (components: ComponentData[], skipHistory?: boolean) => void;
    addComponent: (type: ComponentType, parentId?: string, index?: number) => string;
    updateComponent: (id: string, updates: Partial<ComponentData>) => void;
    removeComponent: (id: string) => void;
    deleteComponent: (id: string) => void;
    moveComponent: (id: string, newParentId: string | null, newIndex: number) => void;
    duplicateComponent: (id: string) => string | null;

    // Selection.
    selectComponent: (id: string | null) => void;
    getSelectedComponent: () => ComponentData | null;

    // UI state.
    setLoading: (loading: boolean) => void;
    setSaving: (saving: boolean) => void;
    setDirty: (dirty: boolean) => void;
    setBreakpoint: (breakpoint: Breakpoint) => void;

    // History (Undo/Redo).
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    clearHistory: () => void;

    // Utilities.
    findComponentById: (id: string) => ComponentData | null;
    getComponentPath: (id: string) => string[];
}

/**
 * Component defaults by type.
 */
const COMPONENT_DEFAULTS: Record<ComponentType, Partial<ComponentData['props']>> = {
    section: {
        width: 'full',
        paddingTop: '40px',
        paddingBottom: '40px',
        backgroundColor: '',
    },
    container: {
        maxWidth: '1200px',
        alignment: 'center',
        direction: 'column',
        gap: '20px',
    },
    heading: {
        content: 'New Heading',
        tag: 'h2',
        textAlign: 'left',
        fontWeight: '600',
    },
    text: {
        content: '<p>Add your text here</p>',
        textAlign: 'left',
    },
    image: {
        src: '',
        alt: '',
        maxWidth: '100%',
        align: 'center',
    },
    button: {
        text: 'Click me',
        url: '#',
        variant: 'primary',
        size: 'default',
    },
    // UI Components (shadcn-style)
    card: {
        title: 'Card Title',
        description: 'Card description goes here.',
        showHeader: true,
        showFooter: false,
        variant: 'default',
    },
    accordion: {
        type: 'single',
        collapsible: true,
        items: [
            { id: '1', title: 'Item 1', content: 'Content for item 1' },
            { id: '2', title: 'Item 2', content: 'Content for item 2' },
        ],
    },
    tabs: {
        defaultTab: 'tab1',
        tabs: [
            { id: 'tab1', label: 'Tab 1', content: 'Content for tab 1' },
            { id: 'tab2', label: 'Tab 2', content: 'Content for tab 2' },
        ],
    },
    alert: {
        title: 'Alert Title',
        description: 'Alert description text.',
        variant: 'info',
    },
    badge: {
        text: 'Badge',
        variant: 'default',
    },
    avatar: {
        src: '',
        alt: 'Avatar',
        fallback: 'AB',
        size: 'medium',
    },
    separator: {
        orientation: 'horizontal',
        decorative: true,
    },
    // Marketing Blocks
    heroBlock: {
        title: 'Build something amazing',
        subtitle: 'Create beautiful, responsive websites with our intuitive page builder.',
        primaryButtonText: 'Get Started',
        primaryButtonUrl: '#',
        secondaryButtonText: 'Learn More',
        secondaryButtonUrl: '#',
        showSecondaryButton: true,
        alignment: 'center',
    },
    featuresBlock: {
        title: 'Why Choose Us',
        subtitle: 'Everything you need to build amazing websites',
        columns: 3,
        features: [
            { icon: 'zap', title: 'Lightning Fast', description: 'Optimized for speed and performance' },
            { icon: 'shield', title: 'Secure', description: 'Built with security best practices' },
            { icon: 'rocket', title: 'Easy to Use', description: 'Intuitive drag-and-drop interface' },
        ],
    },
    pricingBlock: {
        title: 'Simple, Transparent Pricing',
        subtitle: 'Choose the plan that works for you',
        plans: [
            { name: 'Starter', price: '$9', period: '/month', description: 'Perfect for small projects', features: ['5 pages', 'Basic components'], buttonText: 'Get Started', buttonUrl: '#', featured: false },
            { name: 'Pro', price: '$29', period: '/month', description: 'Best for growing businesses', features: ['Unlimited pages', 'All components'], buttonText: 'Get Started', buttonUrl: '#', featured: true },
        ],
    },
    faqBlock: {
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions',
        items: [
            { question: 'How do I get started?', answer: 'Simply sign up and start building.' },
            { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial.' },
        ],
    },
    ctaBlock: {
        title: 'Ready to get started?',
        description: 'Join thousands of users building amazing websites.',
        buttonText: 'Start Building Now',
        buttonUrl: '#',
        variant: 'default',
    },
};

/**
 * Generate component ID.
 */
const generateId = (type: ComponentType): string => {
    const prefixes: Record<ComponentType, string> = {
        section: 'sec',
        container: 'con',
        heading: 'hdg',
        text: 'txt',
        image: 'img',
        button: 'btn',
        card: 'crd',
        accordion: 'acc',
        tabs: 'tab',
        alert: 'alt',
        badge: 'bdg',
        avatar: 'avt',
        separator: 'sep',
        heroBlock: 'hero',
        featuresBlock: 'feat',
        pricingBlock: 'pric',
        faqBlock: 'faq',
        ctaBlock: 'cta',
    };
    return `${prefixes[type] || type}_${nanoid(8)}`;
};

/**
 * Deep clone components for history.
 */
const cloneComponents = (components: ComponentData[]): ComponentData[] => {
    return JSON.parse(JSON.stringify(components));
};

/**
 * Find component in tree by ID.
 */
const findInTree = (
    components: ComponentData[],
    id: string
): ComponentData | null => {
    for (const component of components) {
        if (component.id === id) {
            return component;
        }
        if (component.children) {
            const found = findInTree(component.children, id);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Update component in tree.
 */
const updateInTree = (
    components: ComponentData[],
    id: string,
    updates: Partial<ComponentData>
): ComponentData[] => {
    return components.map((component) => {
        if (component.id === id) {
            return { ...component, ...updates };
        }
        if (component.children) {
            return {
                ...component,
                children: updateInTree(component.children, id, updates),
            };
        }
        return component;
    });
};

/**
 * Remove component from tree.
 */
const removeFromTree = (
    components: ComponentData[],
    id: string
): ComponentData[] => {
    return components
        .filter((component) => component.id !== id)
        .map((component) => {
            if (component.children) {
                return {
                    ...component,
                    children: removeFromTree(component.children, id),
                };
            }
            return component;
        });
};

/**
 * Find parent and index of a component.
 */
const findParentAndIndex = (
    components: ComponentData[],
    id: string,
    parent: ComponentData | null = null
): { parent: ComponentData | null; index: number } | null => {
    for (let i = 0; i < components.length; i++) {
        if (components[i].id === id) {
            return { parent, index: i };
        }
        if (components[i].children) {
            const found = findParentAndIndex(components[i].children!, id, components[i]);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Builder store with undo/redo support.
 */
export const useBuilderStore = create<BuilderState & BuilderActions>()(
    devtools(
        subscribeWithSelector((set, get) => {
            /**
             * Push current state to history before making changes.
             */
            const pushToHistory = (action: string) => {
                const state = get();
                const entry: HistoryEntry = {
                    components: cloneComponents(state.components),
                    timestamp: Date.now(),
                    action,
                };

                // Limit history size
                const newPast = [...state.past, entry].slice(-state.maxHistorySize);

                set({
                    past: newPast,
                    future: [], // Clear future on new action
                });
            };

            return {
                // Initial state.
                components: [],
                selectedId: null,
                isLoading: true,
                isSaving: false,
                isDirty: false,
                currentBreakpoint: 'desktop',
                past: [],
                future: [],
                maxHistorySize: 50,

                // Set all components (e.g., on load).
                setComponents: (components, skipHistory = false) => {
                    if (!skipHistory) {
                        pushToHistory('Set components');
                    }
                    set({ components, isDirty: false });
                },

                // Add new component.
                addComponent: (type, parentId, index) => {
                    pushToHistory(`Add ${type}`);

                    const id = generateId(type);
                    const newComponent: ComponentData = {
                        id,
                        type,
                        props: { ...COMPONENT_DEFAULTS[type] },
                        children: type === 'section' || type === 'container' || type === 'card' ? [] : undefined,
                    };

                    set((state) => {
                        let newComponents: ComponentData[];

                        if (parentId) {
                            const parent = findInTree(state.components, parentId);
                            const children = parent?.children || [];
                            const insertIndex = index ?? children.length;

                            newComponents = updateInTree(state.components, parentId, {
                                children: [
                                    ...children.slice(0, insertIndex),
                                    newComponent,
                                    ...children.slice(insertIndex),
                                ],
                            });
                        } else {
                            const insertIndex = index ?? state.components.length;
                            newComponents = [
                                ...state.components.slice(0, insertIndex),
                                newComponent,
                                ...state.components.slice(insertIndex),
                            ];
                        }

                        return {
                            components: newComponents,
                            isDirty: true,
                            selectedId: id,
                        };
                    });

                    return id;
                },

                // Update component properties.
                updateComponent: (id, updates) => {
                    pushToHistory('Update component');
                    set((state) => ({
                        components: updateInTree(state.components, id, updates),
                        isDirty: true,
                    }));
                },

                // Remove component.
                removeComponent: (id) => {
                    pushToHistory('Remove component');
                    set((state) => ({
                        components: removeFromTree(state.components, id),
                        selectedId: state.selectedId === id ? null : state.selectedId,
                        isDirty: true,
                    }));
                },

                // Alias for removeComponent.
                deleteComponent: (id) => {
                    pushToHistory('Delete component');
                    set((state) => ({
                        components: removeFromTree(state.components, id),
                        selectedId: state.selectedId === id ? null : state.selectedId,
                        isDirty: true,
                    }));
                },

                // Move component.
                moveComponent: (id, newParentId, newIndex) => {
                    const state = get();
                    const component = findInTree(state.components, id);

                    if (!component) return;

                    pushToHistory('Move component');

                    // Remove from current position.
                    let newComponents = removeFromTree(state.components, id);

                    if (newParentId) {
                        const parent = findInTree(newComponents, newParentId);
                        const children = parent?.children || [];

                        newComponents = updateInTree(newComponents, newParentId, {
                            children: [
                                ...children.slice(0, newIndex),
                                component,
                                ...children.slice(newIndex),
                            ],
                        });
                    } else {
                        newComponents = [
                            ...newComponents.slice(0, newIndex),
                            component,
                            ...newComponents.slice(newIndex),
                        ];
                    }

                    set({ components: newComponents, isDirty: true });
                },

                // Duplicate component.
                duplicateComponent: (id) => {
                    const state = get();
                    const component = findInTree(state.components, id);
                    if (!component) return null;

                    pushToHistory('Duplicate component');

                    const newId = generateId(component.type);

                    // Deep clone and assign new IDs recursively
                    const cloneWithNewIds = (comp: ComponentData): ComponentData => {
                        const cloned: ComponentData = {
                            ...JSON.parse(JSON.stringify(comp)),
                            id: comp === component ? newId : generateId(comp.type),
                        };
                        if (cloned.children) {
                            cloned.children = cloned.children.map(cloneWithNewIds);
                        }
                        return cloned;
                    };

                    const duplicate = cloneWithNewIds(component);

                    // Find where to insert (after the original)
                    const location = findParentAndIndex(state.components, id);

                    set((currentState) => {
                        let newComponents: ComponentData[];

                        if (location?.parent) {
                            // Insert after original in parent's children
                            const parentChildren = location.parent.children || [];
                            newComponents = updateInTree(currentState.components, location.parent.id, {
                                children: [
                                    ...parentChildren.slice(0, location.index + 1),
                                    duplicate,
                                    ...parentChildren.slice(location.index + 1),
                                ],
                            });
                        } else {
                            // Insert after original at root level
                            const insertIndex = location ? location.index + 1 : currentState.components.length;
                            newComponents = [
                                ...currentState.components.slice(0, insertIndex),
                                duplicate,
                                ...currentState.components.slice(insertIndex),
                            ];
                        }

                        return {
                            components: newComponents,
                            isDirty: true,
                            selectedId: newId,
                        };
                    });

                    return newId;
                },

                // Selection.
                selectComponent: (id) => set({ selectedId: id }),
                getSelectedComponent: () => {
                    const state = get();
                    return state.selectedId
                        ? findInTree(state.components, state.selectedId)
                        : null;
                },

                // UI state.
                setLoading: (isLoading) => set({ isLoading }),
                setSaving: (isSaving) => set({ isSaving }),
                setDirty: (isDirty) => set({ isDirty }),
                setBreakpoint: (currentBreakpoint) => set({ currentBreakpoint }),

                // Undo - restore previous state.
                undo: () => {
                    const state = get();
                    if (state.past.length === 0) return;

                    const previous = state.past[state.past.length - 1];
                    const newPast = state.past.slice(0, -1);

                    // Save current state to future
                    const currentEntry: HistoryEntry = {
                        components: cloneComponents(state.components),
                        timestamp: Date.now(),
                        action: 'Current state',
                    };

                    set({
                        components: previous.components,
                        past: newPast,
                        future: [currentEntry, ...state.future],
                        isDirty: true,
                    });
                },

                // Redo - restore future state.
                redo: () => {
                    const state = get();
                    if (state.future.length === 0) return;

                    const next = state.future[0];
                    const newFuture = state.future.slice(1);

                    // Save current state to past
                    const currentEntry: HistoryEntry = {
                        components: cloneComponents(state.components),
                        timestamp: Date.now(),
                        action: 'Current state',
                    };

                    set({
                        components: next.components,
                        past: [...state.past, currentEntry],
                        future: newFuture,
                        isDirty: true,
                    });
                },

                // Check if undo is available.
                canUndo: () => get().past.length > 0,

                // Check if redo is available.
                canRedo: () => get().future.length > 0,

                // Clear all history.
                clearHistory: () => set({ past: [], future: [] }),

                // Utilities.
                findComponentById: (id) => findInTree(get().components, id),
                getComponentPath: (id) => {
                    const path: string[] = [];
                    const findPath = (components: ComponentData[], targetId: string): boolean => {
                        for (const comp of components) {
                            if (comp.id === targetId) {
                                path.push(comp.id);
                                return true;
                            }
                            if (comp.children) {
                                if (findPath(comp.children, targetId)) {
                                    path.unshift(comp.id);
                                    return true;
                                }
                            }
                        }
                        return false;
                    };
                    findPath(get().components, id);
                    return path;
                },
            };
        }),
        { name: 'polymorphic-builder' }
    )
);

/**
 * Hook for keyboard shortcuts.
 */
export const useBuilderKeyboardShortcuts = () => {
    const { undo, redo, canUndo, canRedo, selectedId, deleteComponent, duplicateComponent } = useBuilderStore();

    const handleKeyDown = (e: KeyboardEvent) => {
        // Don't trigger if user is typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modKey = isMac ? e.metaKey : e.ctrlKey;

        // Undo: Cmd/Ctrl + Z
        if (modKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            if (canUndo()) {
                undo();
            }
        }

        // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
        if ((modKey && e.shiftKey && e.key === 'z') || (modKey && e.key === 'y')) {
            e.preventDefault();
            if (canRedo()) {
                redo();
            }
        }

        // Delete: Delete or Backspace
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
            e.preventDefault();
            deleteComponent(selectedId);
        }

        // Duplicate: Cmd/Ctrl + D
        if (modKey && e.key === 'd' && selectedId) {
            e.preventDefault();
            duplicateComponent(selectedId);
        }
    };

    return { handleKeyDown };
};
