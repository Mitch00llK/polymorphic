/**
 * Toolbar Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Undo2, Redo2, Monitor, Tablet, Smartphone, Save, Settings, FileJson, Check } from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';
import { saveBuilderData } from '../../utils/api';
import { GlobalSettingsPanel } from './GlobalSettingsPanel';
import { ImportExportModal } from './ImportExportModal';
import type { Breakpoint } from '../../types/components';

import styles from './Toolbar.module.css';

// Auto-save interval in milliseconds (30 seconds)
const AUTO_SAVE_INTERVAL = 30000;

/**
 * Top toolbar with save, undo/redo, and responsive controls.
 */
export const Toolbar: React.FC = () => {
    const [showGlobalSettings, setShowGlobalSettings] = useState(false);
    const [showImportExport, setShowImportExport] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
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
        autoSaveEnabled,
        setLastSaved,
    } = useBuilderStore();

    const { postId, postTitle, editorUrl, previewUrl } = window.polymorphicSettings;

    const performSave = useCallback(async (isAutoSave = false) => {
        if (isSaving) return;

        setSaving(true);
        if (isAutoSave) setAutoSaveStatus('saving');
        
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
            setLastSaved(new Date().toISOString());
            
            if (isAutoSave) {
                setAutoSaveStatus('saved');
                setTimeout(() => setAutoSaveStatus('idle'), 2000);
            }
        } catch (error) {
            console.error('[Polymorphic] Save failed:', error);
            if (isAutoSave) setAutoSaveStatus('idle');
        } finally {
            setSaving(false);
        }
    }, [components, postId, isSaving, setSaving, setDirty, setLastSaved]);

    // Auto-save effect
    useEffect(() => {
        if (!autoSaveEnabled || !isDirty) return;

        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        // Set new auto-save timeout
        autoSaveTimeoutRef.current = setTimeout(() => {
            performSave(true);
        }, AUTO_SAVE_INTERVAL);

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [isDirty, autoSaveEnabled, performSave]);

    const handleSave = () => performSave(false);

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
                        title="Undo (Cmd+Z)"
                    >
                        <Undo2 size={18} />
                    </button>
                    <button
                        className={styles.iconButton}
                        onClick={redo}
                        disabled={!canRedo()}
                        title="Redo (Cmd+Shift+Z)"
                    >
                        <Redo2 size={18} />
                    </button>
                </div>

                <button
                    className={styles.iconButton}
                    onClick={() => setShowImportExport(true)}
                    title="Import / Export"
                >
                    <FileJson size={18} />
                </button>

                <button
                    className={styles.iconButton}
                    onClick={() => setShowGlobalSettings(true)}
                    title="Global Settings"
                >
                    <Settings size={18} />
                </button>

                {/* Auto-save indicator */}
                {autoSaveStatus !== 'idle' && (
                    <span className={styles.autoSaveIndicator}>
                        {autoSaveStatus === 'saving' && 'Auto-saving...'}
                        {autoSaveStatus === 'saved' && (
                            <>
                                <Check size={14} />
                                Saved
                            </>
                        )}
                    </span>
                )}

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

            {/* Import/Export Modal */}
            <ImportExportModal
                isOpen={showImportExport}
                onClose={() => setShowImportExport(false)}
            />
        </header>
    );
};

export default Toolbar;
