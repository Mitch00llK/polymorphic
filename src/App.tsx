/**
 * Main App Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useEffect } from 'react';

import { Canvas } from './components/builder/Canvas';
import { Sidebar } from './components/builder/Sidebar';
import { Toolbar } from './components/builder/Toolbar';
import { PropertyPanel } from './components/builder/PropertyPanel';
import { useBuilderStore } from './store/builderStore';
import { loadBuilderData } from './utils/api';

import styles from './styles/app.module.css';

/**
 * Root application component.
 */
const App: React.FC = () => {
    const { postId } = window.polymorphicSettings;
    const { setComponents, setLoading, isLoading } = useBuilderStore();

    // Load existing data on mount.
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await loadBuilderData(postId);
                if (data?.components) {
                    setComponents(data.components);
                }
            } catch (error) {
                console.error('[Polymorphic] Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!window.polymorphicSettings.isNewPost) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [postId, setComponents, setLoading]);

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <span>Loading builder...</span>
            </div>
        );
    }

    return (
        <div className={styles.app}>
            {/* Top Toolbar */}
            <Toolbar />

            {/* Main Content Area */}
            <div className={styles.main}>
                {/* Left Sidebar - Component Library */}
                <Sidebar />

                {/* Center - Canvas */}
                <Canvas />

                {/* Right - Property Panel */}
                <PropertyPanel />
            </div>
        </div>
    );
};

export default App;
