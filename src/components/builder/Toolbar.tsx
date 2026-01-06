/**
 * Toolbar Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Undo2, Redo2, Monitor, Tablet, Smartphone, Save, Settings } from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';
import { saveBuilderData } from '../../utils/api';
import { GlobalSettingsPanel } from './GlobalSettingsPanel';
import type { Breakpoint } from '../../types/components';

import styles from './Toolbar.module.css';

/**
 * Top toolbar with save, undo/redo, and responsive controls.
 */
export const Toolbar: React.FC = () => {
    const [showGlobalSettings, setShowGlobalSettings] = useState(false);
    const {
        components,
        currentBreakpoint,
        setBreakpoint,
        canUndo,
        canRedo,
        undo,
        redo,
        isDirty,
        isSaving,
        setSaving,
        setDirty,
    } = useBuilderStore();

    const { postId, postTitle, editorUrl, previewUrl } = window.polymorphicSettings;

    const handleSave = async () => {
        if (isSaving) return;

        setSaving(true);
        try {
            await saveBuilderData(postId, {
                version: '1.0.0',
                components,
                customCss: '',
                customJs: '',
                settings: {
                    pageBackground: '#ffffff',
                    contentWidth: '1200px',
                    bodyFont: 'Inter, sans-serif',
                    headingFont: 'Inter, sans-serif',
                },
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
            });
            setDirty(false);
        } catch (error) {
            console.error('[Polymorphic] Save failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        if (isDirty) {
            const confirmed = window.confirm(
                'You have unsaved changes. Are you sure you want to leave?'
            );
            if (!confirmed) return;
        }
        window.location.href = editorUrl;
    };

    const breakpoints: { key: Breakpoint; icon: React.ReactNode; label: string }[] = [
        { key: 'desktop', icon: <Monitor size={18} />, label: 'Desktop' },
        { key: 'tablet', icon: <Tablet size={18} />, label: 'Tablet' },
        { key: 'mobile', icon: <Smartphone size={18} />, label: 'Mobile' },
    ];

    return (
        <header className={styles.toolbar}>
            <div className={styles.left}>
                <button
                    className={styles.backButton}
                    onClick={handleBack}
                    title="Back to Editor"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className={styles.logo}>
                    <span className={styles.logoText}>Polymorphic</span>
                    {postTitle && (
                        <span className={styles.pageTitle}>— {postTitle}</span>
                    )}
                </div>
            </div>

            <div className={styles.center}>
                <div className={styles.breakpoints}>
                    {breakpoints.map(({ key, icon, label }) => (
                        <button
                            key={key}
                            className={`${styles.breakpointButton} ${currentBreakpoint === key ? styles.isActive : ''
                                }`}
                            onClick={() => setBreakpoint(key)}
                            title={label}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.history}>
                    <button
                        className={styles.iconButton}
                        onClick={undo}
                        disabled={!canUndo()}
                        title="Undo"
                    >
                        <Undo2 size={18} />
                    </button>
                    <button
                        className={styles.iconButton}
                        onClick={redo}
                        disabled={!canRedo()}
                        title="Redo"
                    >
                        <Redo2 size={18} />
                    </button>
                </div>

                <button
                    className={styles.settingsButton}
                    onClick={() => setShowGlobalSettings(true)}
                    title="Global Settings"
                >
                    <Settings size={18} />
                </button>

                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
            </div>

            {/* Global Settings Panel */}
            <GlobalSettingsPanel
                isOpen={showGlobalSettings}
                onClose={() => setShowGlobalSettings(false)}
            />
        </header>
    );
};

export default Toolbar;
