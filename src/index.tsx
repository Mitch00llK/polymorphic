/**
 * Polymorphic Builder - Main Entry Point
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import { createRoot } from '@wordpress/element';

import App from './App';

import './styles/variables.css';
import './styles/builder.css';
import './styles/components.css';

// Type declarations for WordPress globals.
declare global {
    interface Window {
        polymorphicSettings: {
            nonce: string;
            postId: number;
            apiBase: string;
            isNewPost: boolean;
        };
        polymorphic: {
            on: (event: string, callback: Function) => void;
            off: (event: string, callback: Function) => void;
            registerElement: (type: string, config: any) => void;
        };
    }
}

/**
 * Initialize the builder when DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('polymorphic-builder-root');

    if (!container) {
        console.error('[Polymorphic] Builder root element not found');
        return;
    }

    const root = createRoot(container);
    root.render(<App />);

    // Expose global API for extensions.
    window.polymorphic = window.polymorphic || {
        on: () => { },
        off: () => { },
        registerElement: () => { },
    };

    console.log('[Polymorphic] Builder initialized');
});
