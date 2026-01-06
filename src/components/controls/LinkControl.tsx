/**
 * Link Control Component
 *
 * Advanced link picker with URL input, target options, and WordPress search.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, ExternalLink, Search, X, ChevronDown } from 'lucide-react';

import styles from './controls.module.css';

declare global {
    interface Window {
        polymorphicSettings: {
            restUrl: string;
            nonce: string;
            postId: number;
            postTitle: string;
            editorUrl: string;
            previewUrl: string;
            isNewPost: boolean;
        };
    }
}

export interface LinkValue {
    url: string;
    text?: string;
    target?: '_self' | '_blank';
    rel?: string;
    title?: string;
}

interface SearchResult {
    id: number;
    title: string;
    url: string;
    type: string;
    subtype?: string;
}

interface LinkControlProps {
    label?: string;
    value: LinkValue;
    onChange: (value: LinkValue) => void;
    showText?: boolean;
    showTarget?: boolean;
    showRel?: boolean;
    placeholder?: string;
}

export const LinkControl: React.FC<LinkControlProps> = ({
    label = 'Link',
    value,
    onChange,
    showText = false,
    showTarget = true,
    showRel = false,
    placeholder = 'Enter URL or search...',
}) => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search WordPress content
    const searchContent = useCallback(async (query: string) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);

        try {
            // Search posts
            const postsResponse = await fetch(
                `${window.polymorphicSettings.restUrl}wp/v2/posts?search=${encodeURIComponent(query)}&per_page=5`,
                {
                    headers: {
                        'X-WP-Nonce': window.polymorphicSettings.nonce,
                    },
                }
            );
            const posts = await postsResponse.json();

            // Search pages
            const pagesResponse = await fetch(
                `${window.polymorphicSettings.restUrl}wp/v2/pages?search=${encodeURIComponent(query)}&per_page=5`,
                {
                    headers: {
                        'X-WP-Nonce': window.polymorphicSettings.nonce,
                    },
                }
            );
            const pages = await pagesResponse.json();

            const results: SearchResult[] = [
                ...posts.map((post: { id: number; title: { rendered: string }; link: string }) => ({
                    id: post.id,
                    title: post.title.rendered,
                    url: post.link,
                    type: 'post',
                    subtype: 'Post',
                })),
                ...pages.map((page: { id: number; title: { rendered: string }; link: string }) => ({
                    id: page.id,
                    title: page.title.rendered,
                    url: page.link,
                    type: 'page',
                    subtype: 'Page',
                })),
            ];

            setSearchResults(results);
        } catch (error) {
            console.error('[Polymorphic] Search failed:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (isSearching && searchQuery) {
            searchTimeout.current = setTimeout(() => {
                searchContent(searchQuery);
            }, 300);
        }

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [searchQuery, isSearching, searchContent]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setSearchQuery(newUrl);
        onChange({ ...value, url: newUrl });

        // Show search dropdown if it looks like a search query (not a URL)
        if (newUrl && !newUrl.startsWith('http') && !newUrl.startsWith('/') && !newUrl.startsWith('#')) {
            setIsSearching(true);
            setShowDropdown(true);
        } else {
            setIsSearching(false);
            setShowDropdown(false);
        }
    };

    const handleSelectResult = (result: SearchResult) => {
        onChange({
            ...value,
            url: result.url,
            title: result.title,
        });
        setSearchQuery(result.url);
        setShowDropdown(false);
        setIsSearching(false);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, text: e.target.value });
    };

    const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const target = e.target.value as '_self' | '_blank';
        onChange({
            ...value,
            target,
            rel: target === '_blank' ? 'noopener noreferrer' : undefined,
        });
    };

    const handleRelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, rel: e.target.value });
    };

    const handleClear = () => {
        onChange({ url: '', text: '', target: '_self', rel: '' });
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className={styles.linkControl}>
            {label && <label className={styles.label}>{label}</label>}

            {/* Link Text (optional) */}
            {showText && (
                <div className={styles.linkField}>
                    <input
                        type="text"
                        value={value.text || ''}
                        onChange={handleTextChange}
                        placeholder="Link text..."
                        className={styles.input}
                    />
                </div>
            )}

            {/* URL Input with Search */}
            <div className={styles.linkUrlWrapper} ref={dropdownRef}>
                <div className={styles.linkInputGroup}>
                    <span className={styles.linkIcon}>
                        <Link size={14} />
                    </span>
                    <input
                        type="text"
                        value={searchQuery || value.url || ''}
                        onChange={handleUrlChange}
                        onFocus={() => {
                            if (searchQuery && !searchQuery.startsWith('http')) {
                                setShowDropdown(true);
                            }
                        }}
                        placeholder={placeholder}
                        className={styles.linkInput}
                    />
                    {(value.url || searchQuery) && (
                        <button
                            type="button"
                            className={styles.linkClearButton}
                            onClick={handleClear}
                            title="Clear"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && (isLoading || searchResults.length > 0) && (
                    <div className={styles.linkDropdown}>
                        {isLoading ? (
                            <div className={styles.linkDropdownLoading}>
                                <Search size={14} className={styles.linkDropdownSpinner} />
                                <span>Searching...</span>
                            </div>
                        ) : (
                            searchResults.map((result) => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    type="button"
                                    className={styles.linkDropdownItem}
                                    onClick={() => handleSelectResult(result)}
                                >
                                    <span className={styles.linkDropdownTitle}>
                                        {result.title}
                                    </span>
                                    <span className={styles.linkDropdownType}>
                                        {result.subtype}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Target and Rel Options */}
            <div className={styles.linkOptions}>
                {showTarget && (
                    <div className={styles.linkOption}>
                        <label className={styles.linkOptionLabel}>Open in</label>
                        <select
                            value={value.target || '_self'}
                            onChange={handleTargetChange}
                            className={styles.linkSelect}
                        >
                            <option value="_self">Same tab</option>
                            <option value="_blank">New tab</option>
                        </select>
                    </div>
                )}

                {showRel && (
                    <div className={styles.linkOption}>
                        <label className={styles.linkOptionLabel}>Rel attribute</label>
                        <input
                            type="text"
                            value={value.rel || ''}
                            onChange={handleRelChange}
                            placeholder="nofollow, sponsored..."
                            className={styles.input}
                        />
                    </div>
                )}
            </div>

            {/* External link indicator */}
            {value.target === '_blank' && value.url && (
                <div className={styles.linkExternalNote}>
                    <ExternalLink size={12} />
                    <span>Opens in new tab</span>
                </div>
            )}
        </div>
    );
};

export default LinkControl;

