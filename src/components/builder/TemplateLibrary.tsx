/**
 * Template Library Component
 *
 * Browse and insert pre-built templates with live previews.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState, useMemo } from 'react';
import { X, Search, Layout, Layers, FileText, ShoppingBag, Briefcase, File, Plus, Sparkles } from 'lucide-react';

import { useBuilderStore } from '../../store/builderStore';
import { TemplatePreview } from './TemplatePreview';
import {
    TEMPLATES,
    TEMPLATE_CATEGORIES,
    getTemplatesByCategory,
    searchTemplates,
    type Template,
    type TemplateCategory,
} from '../../data/templates';

import styles from './TemplateLibrary.module.css';

interface TemplateLibraryProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORY_ICONS: Record<TemplateCategory, React.ReactNode> = {
    landing: <Layout size={18} />,
    marketing: <Layers size={18} />,
    content: <FileText size={18} />,
    ecommerce: <ShoppingBag size={18} />,
    portfolio: <Briefcase size={18} />,
    blank: <File size={18} />,
};

/**
 * Template Library modal for browsing and inserting templates.
 */
export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ isOpen, onClose }) => {
    const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    const { addComponentData, setComponents, components } = useBuilderStore();

    // Filter templates based on category and search
    const filteredTemplates = useMemo(() => {
        let results = activeCategory === 'all' ? TEMPLATES : getTemplatesByCategory(activeCategory);
        if (searchQuery.trim()) {
            results = searchTemplates(searchQuery).filter(
                (t) => activeCategory === 'all' || t.category === activeCategory
            );
        }
        return results;
    }, [activeCategory, searchQuery]);

    if (!isOpen) return null;

    const handleInsertTemplate = (template: Template, replaceAll = false) => {
        if (replaceAll) {
            // Replace entire page with template
            setComponents(template.components);
        } else {
            // Add template components to existing page
            template.components.forEach((component) => {
                addComponentData(component);
            });
        }
        onClose();
    };

    const handlePreview = (template: Template) => {
        setSelectedTemplate(template);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Sparkles size={22} />
                        <h2 className={styles.title}>Template Library</h2>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.body}>
                    {/* Categories Sidebar */}
                    <aside className={styles.sidebar}>
                        <nav className={styles.categories}>
                            <button
                                className={`${styles.categoryButton} ${activeCategory === 'all' ? styles.isActive : ''}`}
                                onClick={() => setActiveCategory('all')}
                            >
                                <Layers size={18} />
                                <span>All Templates</span>
                                <span className={styles.count}>{TEMPLATES.length}</span>
                            </button>

                            {(Object.entries(TEMPLATE_CATEGORIES) as [TemplateCategory, typeof TEMPLATE_CATEGORIES[TemplateCategory]][]).map(
                                ([key, { label }]) => {
                                    const count = getTemplatesByCategory(key).length;
                                    return (
                                        <button
                                            key={key}
                                            className={`${styles.categoryButton} ${activeCategory === key ? styles.isActive : ''}`}
                                            onClick={() => setActiveCategory(key)}
                                        >
                                            {CATEGORY_ICONS[key]}
                                            <span>{label}</span>
                                            <span className={styles.count}>{count}</span>
                                        </button>
                                    );
                                }
                            )}
                        </nav>
                    </aside>

                    {/* Templates Grid */}
                    <main className={styles.content}>
                        {selectedTemplate ? (
                            <div className={styles.preview}>
                                <button
                                    className={styles.backButton}
                                    onClick={() => setSelectedTemplate(null)}
                                >
                                    ← Back to templates
                                </button>
                                <div className={styles.previewHeader}>
                                    <div>
                                        <h3 className={styles.previewTitle}>{selectedTemplate.name}</h3>
                                        <p className={styles.previewDescription}>{selectedTemplate.description}</p>
                                        <div className={styles.previewTags}>
                                            {selectedTemplate.tags.map((tag) => (
                                                <span key={tag} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.previewActions}>
                                        <button
                                            className={styles.insertButton}
                                            onClick={() => handleInsertTemplate(selectedTemplate, false)}
                                        >
                                            <Plus size={16} />
                                            Add to Page
                                        </button>
                                        {components.length > 0 && (
                                            <button
                                                className={styles.replaceButton}
                                                onClick={() => {
                                                    if (window.confirm('This will replace all existing content. Continue?')) {
                                                        handleInsertTemplate(selectedTemplate, true);
                                                    }
                                                }}
                                            >
                                                Replace Page
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.previewCanvas}>
                                    <div className={styles.previewFrame}>
                                        <TemplatePreview
                                            components={selectedTemplate.components}
                                            scale={0.5}
                                            maxHeight={500}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {filteredTemplates.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <Search size={48} />
                                        <h3>No templates found</h3>
                                        <p>Try adjusting your search or category filter.</p>
                                    </div>
                                ) : (
                                    <div className={styles.grid}>
                                        {filteredTemplates.map((template) => (
                                            <div
                                                key={template.id}
                                                className={styles.templateCard}
                                                onClick={() => handlePreview(template)}
                                            >
                                                <div className={styles.templateThumbnail}>
                                                    <TemplatePreview
                                                        components={template.components}
                                                        scale={0.2}
                                                        maxHeight={160}
                                                    />
                                                    <div className={styles.templateOverlay}>
                                                        <button
                                                            className={styles.quickInsert}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleInsertTemplate(template, false);
                                                            }}
                                                        >
                                                            <Plus size={16} />
                                                            Insert
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className={styles.templateInfo}>
                                                    <h4 className={styles.templateName}>{template.name}</h4>
                                                    <p className={styles.templateDescription}>{template.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TemplateLibrary;
