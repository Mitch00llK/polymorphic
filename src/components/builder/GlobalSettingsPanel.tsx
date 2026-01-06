/**
 * Global Settings Panel Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useEffect } from 'react';
import {
    X,
    Layout,
    Type,
    Palette,
    MousePointer,
    Monitor,
    RotateCcw,
    Save,
    Download,
    Upload,
} from 'lucide-react';

import {
    useGlobalSettingsStore,
    type SettingsGroup,
    type LayoutSettings,
    type TypographySettings,
    type ColorSettings,
    type ButtonSettings,
    type BreakpointSettings,
} from '../../store/globalSettingsStore';

import styles from './GlobalSettingsPanel.module.css';

interface GlobalSettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Tab configuration.
 */
const TABS: { key: SettingsGroup; label: string; icon: React.ReactNode }[] = [
    { key: 'layout', label: 'Layout', icon: <Layout size={18} /> },
    { key: 'typography', label: 'Typography', icon: <Type size={18} /> },
    { key: 'colors', label: 'Colors', icon: <Palette size={18} /> },
    { key: 'buttons', label: 'Buttons', icon: <MousePointer size={18} /> },
    { key: 'breakpoints', label: 'Breakpoints', icon: <Monitor size={18} /> },
];

/**
 * Global Settings Panel.
 */
export const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({
    isOpen,
    onClose,
}) => {
    const {
        settings,
        defaults,
        isLoading,
        isSaving,
        isDirty,
        activeTab,
        error,
        loadSettings,
        loadDefaults,
        saveSettings,
        resetSettings,
        setActiveTab,
        updateSetting,
        generateCssVariables,
    } = useGlobalSettingsStore();

    // Load settings on mount.
    useEffect(() => {
        if (isOpen && !settings) {
            loadSettings();
            loadDefaults();
        }
    }, [isOpen, settings, loadSettings, loadDefaults]);

    // Inject live preview CSS.
    useEffect(() => {
        if (!settings) return;

        const css = generateCssVariables();
        let styleEl = document.getElementById('polymorphic-preview-css');

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'polymorphic-preview-css';
            document.head.appendChild(styleEl);
        }

        styleEl.textContent = css;

        return () => {
            // Don't remove on unmount - keep the styles.
        };
    }, [settings, generateCssVariables]);

    const handleSave = async () => {
        const success = await saveSettings();
        if (success) {
            // Optionally show success toast.
        }
    };

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
            await resetSettings();
        }
    };

    const handleExport = () => {
        const json = JSON.stringify(settings, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'polymorphic-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const text = await file.text();
            try {
                const imported = JSON.parse(text);
                // Update all groups.
                Object.keys(imported).forEach((group) => {
                    const groupKey = group as SettingsGroup;
                    Object.keys(imported[group]).forEach((key) => {
                        updateSetting(groupKey, key as any, imported[group][key]);
                    });
                });
            } catch {
                alert('Invalid settings file.');
            }
        };
        input.click();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <Layout size={20} />
                        Global Settings
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    {TABS.map(({ key, label, icon }) => (
                        <button
                            key={key}
                            className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(key)}
                        >
                            {icon}
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {isLoading ? (
                        <div className={styles.loading}>Loading settings...</div>
                    ) : error ? (
                        <div className={styles.error}>{error}</div>
                    ) : settings ? (
                        <>
                            {activeTab === 'layout' && (
                                <LayoutSection
                                    settings={settings.layout}
                                    onChange={(key, value) => updateSetting('layout', key, value)}
                                />
                            )}
                            {activeTab === 'typography' && (
                                <TypographySection
                                    settings={settings.typography}
                                    onChange={(key, value) => updateSetting('typography', key, value)}
                                />
                            )}
                            {activeTab === 'colors' && (
                                <ColorsSection
                                    settings={settings.colors}
                                    onChange={(key, value) => updateSetting('colors', key, value)}
                                />
                            )}
                            {activeTab === 'buttons' && (
                                <ButtonsSection
                                    settings={settings.buttons}
                                    onChange={(key, value) => updateSetting('buttons', key, value)}
                                />
                            )}
                            {activeTab === 'breakpoints' && (
                                <BreakpointsSection
                                    settings={settings.breakpoints}
                                    onChange={(key, value) => updateSetting('breakpoints', key, value)}
                                />
                            )}
                        </>
                    ) : null}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.footerLeft}>
                        <button
                            className={styles.iconButton}
                            onClick={handleExport}
                            title="Export Settings"
                        >
                            <Download size={16} />
                        </button>
                        <button
                            className={styles.iconButton}
                            onClick={handleImport}
                            title="Import Settings"
                        >
                            <Upload size={16} />
                        </button>
                        <button
                            className={styles.resetButton}
                            onClick={handleReset}
                            title="Reset to Defaults"
                        >
                            <RotateCcw size={16} />
                            <span>Reset</span>
                        </button>
                    </div>
                    <div className={styles.footerRight}>
                        <button className={styles.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className={styles.saveButton}
                            onClick={handleSave}
                            disabled={isSaving || !isDirty}
                        >
                            <Save size={16} />
                            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Input field component.
 */
interface FieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'color' | 'select';
    options?: { value: string; label: string }[];
    placeholder?: string;
    hint?: string;
}

const Field: React.FC<FieldProps> = ({
    label,
    value,
    onChange,
    type = 'text',
    options,
    placeholder,
    hint,
}) => (
    <div className={styles.field}>
        <label className={styles.fieldLabel}>{label}</label>
        {type === 'color' ? (
            <div className={styles.colorField}>
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles.colorInput}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles.colorText}
                    placeholder="#000000"
                />
            </div>
        ) : type === 'select' && options ? (
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.select}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        ) : (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.input}
                placeholder={placeholder}
            />
        )}
        {hint && <span className={styles.fieldHint}>{hint}</span>}
    </div>
);

/**
 * Section header component.
 */
const SectionHeader: React.FC<{ title: string; description?: string }> = ({
    title,
    description,
}) => (
    <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {description && <p className={styles.sectionDescription}>{description}</p>}
    </div>
);

/**
 * Layout settings section.
 */
const LayoutSection: React.FC<{
    settings: LayoutSettings;
    onChange: (key: keyof LayoutSettings, value: string) => void;
}> = ({ settings, onChange }) => (
    <div className={styles.section}>
        <SectionHeader
            title="Container Widths"
            description="Define the maximum widths for your content containers."
        />
        <div className={styles.fieldGroup}>
            <Field
                label="Default Width"
                value={settings.containerWidth}
                onChange={(v) => onChange('containerWidth', v)}
                placeholder="1200px"
                hint="Standard container width"
            />
            <Field
                label="Wide Width"
                value={settings.containerWidthWide}
                onChange={(v) => onChange('containerWidthWide', v)}
                placeholder="1400px"
                hint="For wide layouts"
            />
            <Field
                label="Narrow Width"
                value={settings.containerWidthNarrow}
                onChange={(v) => onChange('containerWidthNarrow', v)}
                placeholder="768px"
                hint="For text-focused content"
            />
        </div>

        <SectionHeader
            title="Spacing"
            description="Default spacing values used throughout your site."
        />
        <div className={styles.fieldGroup}>
            <Field
                label="Default Gap"
                value={settings.defaultGap}
                onChange={(v) => onChange('defaultGap', v)}
                placeholder="20px"
                hint="Space between elements"
            />
            <Field
                label="Section Padding Top"
                value={settings.sectionPaddingTop}
                onChange={(v) => onChange('sectionPaddingTop', v)}
                placeholder="60px"
            />
            <Field
                label="Section Padding Bottom"
                value={settings.sectionPaddingBottom}
                onChange={(v) => onChange('sectionPaddingBottom', v)}
                placeholder="60px"
            />
        </div>
    </div>
);

/**
 * Typography settings section.
 */
const TypographySection: React.FC<{
    settings: TypographySettings;
    onChange: (key: keyof TypographySettings, value: string) => void;
}> = ({ settings, onChange }) => (
    <div className={styles.section}>
        <SectionHeader
            title="Font Families"
            description="Choose fonts for your body text and headings."
        />
        <div className={styles.fieldGroup}>
            <Field
                label="Body Font"
                value={settings.bodyFont}
                onChange={(v) => onChange('bodyFont', v)}
                placeholder="Inter, sans-serif"
            />
            <Field
                label="Heading Font"
                value={settings.headingFont}
                onChange={(v) => onChange('headingFont', v)}
                placeholder="Inter, sans-serif"
            />
        </div>

        <SectionHeader
            title="Base Typography"
            description="Base font size and line height."
        />
        <div className={styles.fieldGroup}>
            <Field
                label="Base Font Size"
                value={settings.baseFontSize}
                onChange={(v) => onChange('baseFontSize', v)}
                placeholder="16px"
            />
            <Field
                label="Line Height"
                value={settings.baseLineHeight}
                onChange={(v) => onChange('baseLineHeight', v)}
                placeholder="1.6"
            />
        </div>

        <SectionHeader
            title="Heading Sizes"
            description="Default sizes for each heading level."
        />
        <div className={styles.fieldGrid}>
            <Field
                label="H1 Size"
                value={settings.h1Size}
                onChange={(v) => onChange('h1Size', v)}
                placeholder="3rem"
            />
            <Field
                label="H2 Size"
                value={settings.h2Size}
                onChange={(v) => onChange('h2Size', v)}
                placeholder="2.25rem"
            />
            <Field
                label="H3 Size"
                value={settings.h3Size}
                onChange={(v) => onChange('h3Size', v)}
                placeholder="1.875rem"
            />
            <Field
                label="H4 Size"
                value={settings.h4Size}
                onChange={(v) => onChange('h4Size', v)}
                placeholder="1.5rem"
            />
            <Field
                label="H5 Size"
                value={settings.h5Size}
                onChange={(v) => onChange('h5Size', v)}
                placeholder="1.25rem"
            />
            <Field
                label="H6 Size"
                value={settings.h6Size}
                onChange={(v) => onChange('h6Size', v)}
                placeholder="1rem"
            />
        </div>
    </div>
);

/**
 * Colors settings section.
 */
const ColorsSection: React.FC<{
    settings: ColorSettings;
    onChange: (key: keyof ColorSettings, value: string) => void;
}> = ({ settings, onChange }) => (
    <div className={styles.section}>
        <SectionHeader
            title="Brand Colors"
            description="Your primary brand colors."
        />
        <div className={styles.fieldGrid}>
            <Field
                label="Primary"
                value={settings.primary}
                onChange={(v) => onChange('primary', v)}
                type="color"
            />
            <Field
                label="Secondary"
                value={settings.secondary}
                onChange={(v) => onChange('secondary', v)}
                type="color"
            />
            <Field
                label="Accent"
                value={settings.accent}
                onChange={(v) => onChange('accent', v)}
                type="color"
            />
        </div>

        <SectionHeader
            title="Text Colors"
            description="Colors for text content."
        />
        <div className={styles.fieldGrid}>
            <Field
                label="Text"
                value={settings.text}
                onChange={(v) => onChange('text', v)}
                type="color"
            />
            <Field
                label="Muted Text"
                value={settings.textMuted}
                onChange={(v) => onChange('textMuted', v)}
                type="color"
            />
        </div>

        <SectionHeader
            title="Background Colors"
            description="Colors for backgrounds and surfaces."
        />
        <div className={styles.fieldGrid}>
            <Field
                label="Background"
                value={settings.background}
                onChange={(v) => onChange('background', v)}
                type="color"
            />
            <Field
                label="Surface"
                value={settings.surface}
                onChange={(v) => onChange('surface', v)}
                type="color"
            />
            <Field
                label="Border"
                value={settings.border}
                onChange={(v) => onChange('border', v)}
                type="color"
            />
        </div>

        <SectionHeader
            title="Status Colors"
            description="Colors for alerts and notifications."
        />
        <div className={styles.fieldGrid}>
            <Field
                label="Error"
                value={settings.error}
                onChange={(v) => onChange('error', v)}
                type="color"
            />
            <Field
                label="Warning"
                value={settings.warning}
                onChange={(v) => onChange('warning', v)}
                type="color"
            />
            <Field
                label="Success"
                value={settings.success}
                onChange={(v) => onChange('success', v)}
                type="color"
            />
            <Field
                label="Info"
                value={settings.info}
                onChange={(v) => onChange('info', v)}
                type="color"
            />
        </div>
    </div>
);

/**
 * Buttons settings section.
 */
const ButtonsSection: React.FC<{
    settings: ButtonSettings;
    onChange: (key: keyof ButtonSettings, value: string) => void;
}> = ({ settings, onChange }) => (
    <div className={styles.section}>
        <SectionHeader
            title="Button Styling"
            description="Default styles for buttons across your site."
        />
        <div className={styles.fieldGroup}>
            <Field
                label="Border Radius"
                value={settings.borderRadius}
                onChange={(v) => onChange('borderRadius', v)}
                placeholder="6px"
            />
            <Field
                label="Horizontal Padding"
                value={settings.paddingX}
                onChange={(v) => onChange('paddingX', v)}
                placeholder="1.5rem"
            />
            <Field
                label="Vertical Padding"
                value={settings.paddingY}
                onChange={(v) => onChange('paddingY', v)}
                placeholder="0.75rem"
            />
        </div>

        <SectionHeader title="Button Typography" />
        <div className={styles.fieldGroup}>
            <Field
                label="Font Size"
                value={settings.fontSize}
                onChange={(v) => onChange('fontSize', v)}
                placeholder="1rem"
            />
            <Field
                label="Font Weight"
                value={settings.fontWeight}
                onChange={(v) => onChange('fontWeight', v)}
                placeholder="500"
            />
            <Field
                label="Transition"
                value={settings.transition}
                onChange={(v) => onChange('transition', v)}
                placeholder="0.2s ease"
            />
        </div>

        {/* Preview */}
        <SectionHeader title="Preview" />
        <div className={styles.buttonPreview}>
            <button
                className={styles.previewButton}
                style={{
                    borderRadius: settings.borderRadius,
                    padding: `${settings.paddingY} ${settings.paddingX}`,
                    fontSize: settings.fontSize,
                    fontWeight: settings.fontWeight,
                    transition: `all ${settings.transition}`,
                }}
            >
                Preview Button
            </button>
        </div>
    </div>
);

/**
 * Breakpoints settings section.
 */
const BreakpointsSection: React.FC<{
    settings: BreakpointSettings;
    onChange: (key: keyof BreakpointSettings, value: string) => void;
}> = ({ settings, onChange }) => (
    <div className={styles.section}>
        <SectionHeader
            title="Responsive Breakpoints"
            description="Define when layouts switch between device sizes."
        />
        <div className={styles.fieldGroup}>
            <Field
                label="Tablet Breakpoint"
                value={settings.tablet}
                onChange={(v) => onChange('tablet', v)}
                placeholder="1024px"
                hint="Below this width, tablet styles apply"
            />
            <Field
                label="Mobile Breakpoint"
                value={settings.mobile}
                onChange={(v) => onChange('mobile', v)}
                placeholder="768px"
                hint="Below this width, mobile styles apply"
            />
        </div>

        {/* Visual representation */}
        <div className={styles.breakpointVisual}>
            <div className={styles.breakpointBar}>
                <div className={styles.breakpointSegment} data-device="desktop">
                    <span>Desktop</span>
                    <span>&gt; {settings.tablet}</span>
                </div>
                <div className={styles.breakpointSegment} data-device="tablet">
                    <span>Tablet</span>
                    <span>{settings.mobile} - {settings.tablet}</span>
                </div>
                <div className={styles.breakpointSegment} data-device="mobile">
                    <span>Mobile</span>
                    <span>&lt; {settings.mobile}</span>
                </div>
            </div>
        </div>
    </div>
);

export default GlobalSettingsPanel;

