/**
 * History Store for Undo/Redo
 *
 * Manages component state history for undo/redo functionality.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import { create } from 'zustand';
import type { ComponentData } from '../types/components';

/**
 * Maximum number of history entries to keep.
 */
const MAX_HISTORY_SIZE = 50;

/**
 * History entry.
 */
interface HistoryEntry {
    components: ComponentData[];
    timestamp: number;
    action: string;
}

/**
 * History store state.
 */
interface HistoryState {
    /** Past states (for undo) */
    past: HistoryEntry[];
    /** Future states (for redo) */
    future: HistoryEntry[];
    /** Whether undo is available */
    canUndo: boolean;
    /** Whether redo is available */
    canRedo: boolean;
}

/**
 * History store actions.
 */
interface HistoryActions {
    /** Push current state to history */
    pushState: (components: ComponentData[], action: string) => void;
    /** Undo to previous state */
    undo: () => ComponentData[] | null;
    /** Redo to next state */
    redo: () => ComponentData[] | null;
    /** Clear all history */
    clear: () => void;
}

/**
 * Combined store type.
 */
type HistoryStore = HistoryState & HistoryActions;

/**
 * Create the history store.
 */
export const useHistoryStore = create<HistoryStore>((set, get) => ({
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    pushState: (components, action) => {
        const entry: HistoryEntry = {
            components: JSON.parse(JSON.stringify(components)),
            timestamp: Date.now(),
            action,
        };

        set((state) => {
            const newPast = [...state.past, entry].slice(-MAX_HISTORY_SIZE);
            return {
                past: newPast,
                future: [], // Clear redo stack on new action
                canUndo: newPast.length > 0,
                canRedo: false,
            };
        });
    },

    undo: () => {
        const { past, future } = get();

        if (past.length === 0) return null;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);

        set({
            past: newPast,
            future: [previous, ...future],
            canUndo: newPast.length > 0,
            canRedo: true,
        });

        // Return the state to restore (second to last, since last is current)
        return newPast.length > 0 ? newPast[newPast.length - 1].components : [];
    },

    redo: () => {
        const { past, future } = get();

        if (future.length === 0) return null;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
            past: [...past, next],
            future: newFuture,
            canUndo: true,
            canRedo: newFuture.length > 0,
        });

        return next.components;
    },

    clear: () => {
        set({
            past: [],
            future: [],
            canUndo: false,
            canRedo: false,
        });
    },
}));

export default useHistoryStore;
