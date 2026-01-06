/**
 * Import/Export Modal Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState, useRef } from 'react';
import { X, Download, Upload, Copy, Check, FileJson } from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';

import styles from './ImportExportModal.module.css';

interface ImportExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'export' | 'import';

/**
 * Modal for importing and exporting layouts as JSON.
 */
export const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabType>('export');
    const [importText, setImportText] = useState('');
    const [copied, setCopied] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccess, setImportSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { exportLayout, importLayout, selectedId, exportComponent, importComponent } = useBuilderStore();

    if (!isOpen) return null;

    const exportJson = exportLayout();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(exportJson);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([exportJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `polymorphic-layout-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportComponent = () => {
        if (!selectedId) return;
        const json = exportComponent(selectedId);
        if (json) {
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `polymorphic-component-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const handleImport = () => {
        setImportError(null);
        setImportSuccess(false);

        if (!importText.trim()) {
            setImportError('Please paste a valid JSON layout');
            return;
        }

        try {
            const data = JSON.parse(importText);
            
            // Detect if it's a layout or component
            if (data.type === 'component' && data.component) {
                const result = importComponent(importText);
                if (result) {
                    setImportSuccess(true);
                    setImportText('');
                    setTimeout(() => {
                        setImportSuccess(false);
                        onClose();
                    }, 1500);
                } else {
                    setImportError('Failed to import component');
                }
            } else if (data.components || data.type === 'layout') {
                const result = importLayout(importText);
                if (result) {
                    setImportSuccess(true);
                    setImportText('');
                    setTimeout(() => {
                        setImportSuccess(false);
                        onClose();
                    }, 1500);
                } else {
                    setImportError('Failed to import layout');
                }
            } else {
                setImportError('Invalid format: must be a layout or component export');
            }
        } catch (error) {
            setImportError('Invalid JSON format');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setImportText(content);
            setImportError(null);
        };
        reader.onerror = () => {
            setImportError('Failed to read file');
        };
        reader.readAsText(file);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2 className={styles.title}>
                        <FileJson size={20} />
                        Import / Export
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'export' ? styles.isActive : ''}`}
                        onClick={() => setActiveTab('export')}
                    >
                        <Download size={16} />
                        Export
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'import' ? styles.isActive : ''}`}
                        onClick={() => setActiveTab('import')}
                    >
                        <Upload size={16} />
                        Import
                    </button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'export' ? (
                        <div className={styles.exportTab}>
                            <p className={styles.description}>
                                Export your layout as JSON to backup or share with others.
                            </p>
                            
                            <div className={styles.exportActions}>
                                <button className={styles.actionButton} onClick={handleDownload}>
                                    <Download size={16} />
                                    Download Layout
                                </button>
                                <button className={styles.actionButton} onClick={handleCopy}>
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                                </button>
                                {selectedId && (
                                    <button
                                        className={`${styles.actionButton} ${styles.secondary}`}
                                        onClick={handleExportComponent}
                                    >
                                        <Download size={16} />
                                        Export Selected Component
                                    </button>
                                )}
                            </div>

                            <div className={styles.previewSection}>
                                <label className={styles.previewLabel}>Preview:</label>
                                <pre className={styles.jsonPreview}>
                                    {exportJson}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.importTab}>
                            <p className={styles.description}>
                                Import a layout or component from a JSON file or paste the JSON below.
                            </p>

                            <div className={styles.uploadSection}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileUpload}
                                    className={styles.fileInput}
                                />
                                <button
                                    className={styles.uploadButton}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload size={16} />
                                    Choose JSON File
                                </button>
                            </div>

                            <div className={styles.divider}>
                                <span>or paste JSON below</span>
                            </div>

                            <textarea
                                className={styles.importTextarea}
                                value={importText}
                                onChange={(e) => {
                                    setImportText(e.target.value);
                                    setImportError(null);
                                }}
                                placeholder='{"version": "1.0", "type": "layout", "components": [...]}'
                            />

                            {importError && (
                                <div className={styles.error}>
                                    {importError}
                                </div>
                            )}

                            {importSuccess && (
                                <div className={styles.success}>
                                    Successfully imported!
                                </div>
                            )}

                            <button
                                className={styles.importButton}
                                onClick={handleImport}
                                disabled={!importText.trim()}
                            >
                                <Upload size={16} />
                                Import
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportExportModal;

