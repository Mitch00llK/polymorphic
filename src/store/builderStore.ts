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

    // History.
    history: ComponentData[][];
    historyIndex: number;
}

/**
 * Builder actions interface.
 */
interface BuilderActions {
    // Component management.
    setComponents: (components: ComponentData[]) => void;
    addComponent: (type: ComponentType, parentId?: string, index?: number) => string;
    updateComponent: (id: string, updates: Partial<ComponentData>) => void;
    removeComponent: (id: string) => void;
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

    // History.
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

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
        level: 'h2',
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
        variant: 'solid',
        size: 'medium',
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
    };
    return `${prefixes[type]}_${nanoid(8)}`;
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
 * Builder store.
 */
export const useBuilderStore = create<BuilderState & BuilderActions>()(
    devtools(
        subscribeWithSelector((set, get) => ({
            // Initial state.
            components: [],
            selectedId: null,
            isLoading: true,
            isSaving: false,
            isDirty: false,
            currentBreakpoint: 'desktop',
            history: [],
            historyIndex: -1,

            // Set all components (e.g., on load).
            setComponents: (components) => {
                set({ components, isDirty: false });
            },

            // Add new component.
            addComponent: (type, parentId, index) => {
                const id = generateId(type);
                const newComponent: ComponentData = {
                    id,
                    type,
                    props: { ...COMPONENT_DEFAULTS[type] },
                    children: type === 'section' || type === 'container' ? [] : undefined,
                };

                set((state) => {
                    let newComponents: ComponentData[];

                    if (parentId) {
                        // Add as child of parent.
                        newComponents = updateInTree(state.components, parentId, {
                            children: [
                                ...(findInTree(state.components, parentId)?.children || []).slice(
                                    0,
                                    index ?? Infinity
                                ),
                                newComponent,
                                ...(findInTree(state.components, parentId)?.children || []).slice(
                                    index ?? Infinity
                                ),
                            ],
                        });
                    } else {
                        // Add to root.
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
                set((state) => ({
                    components: updateInTree(state.components, id, updates),
                    isDirty: true,
                }));
            },

            // Remove component.
            removeComponent: (id) => {
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

                // Remove from current position.
                let newComponents = removeFromTree(state.components, id);

                if (newParentId) {
                    // Add to new parent.
                    newComponents = updateInTree(newComponents, newParentId, {
                        children: [
                            ...(findInTree(newComponents, newParentId)?.children || []).slice(
                                0,
                                newIndex
                            ),
                            component,
                            ...(findInTree(newComponents, newParentId)?.children || []).slice(
                                newIndex
                            ),
                        ],
                    });
                } else {
                    // Add to root.
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
                const component = findInTree(get().components, id);
                if (!component) return null;

                const newId = generateId(component.type);
                const duplicate: ComponentData = {
                    ...JSON.parse(JSON.stringify(component)),
                    id: newId,
                };

                // TODO: Handle insertion next to original.
                set((state) => ({
                    components: [...state.components, duplicate],
                    isDirty: true,
                    selectedId: newId,
                }));

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

            // History (simplified).
            undo: () => {
                const { history, historyIndex } = get();
                if (historyIndex > 0) {
                    set({
                        components: history[historyIndex - 1],
                        historyIndex: historyIndex - 1,
                    });
                }
            },
            redo: () => {
                const { history, historyIndex } = get();
                if (historyIndex < history.length - 1) {
                    set({
                        components: history[historyIndex + 1],
                        historyIndex: historyIndex + 1,
                    });
                }
            },
            canUndo: () => get().historyIndex > 0,
            canRedo: () => get().historyIndex < get().history.length - 1,

            // Utilities.
            findComponentById: (id) => findInTree(get().components, id),
            getComponentPath: (id) => {
                // TODO: Implement path finding.
                return [id];
            },
        })),
        { name: 'polymorphic-builder' }
    )
);
