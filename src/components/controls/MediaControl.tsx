/**
 * Media Control Component
 *
 * Integrates with WordPress Media Library for image selection.
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React, { useCallback } from 'react';
import { Image, X, Upload } from 'lucide-react';

import styles from './controls.module.css';

declare global {
    interface Window {
        wp: {
            media: (options: WPMediaOptions) => WPMediaFrame;
        };
    }
}

interface WPMediaOptions {
    title: string;
    button: { text: string };
    multiple: boolean;
    library?: { type?: string };
}

interface WPMediaFrame {
    on: (event: string, callback: () => void) => WPMediaFrame;
    open: () => void;
    state: () => {
        get: (key: string) => {
            first: () => {
                toJSON: () => WPMediaAttachment;
            };
            toJSON: () => WPMediaAttachment[];
        };
    };
}

interface WPMediaAttachment {
    id: number;
    url: string;
    alt: string;
    title: string;
    caption: string;
    width: number;
    height: number;
    sizes?: {
        thumbnail?: { url: string };
        medium?: { url: string };
        large?: { url: string };
        full?: { url: string };
    };
}

export interface MediaValue {
    id?: number;
    url: string;
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
}

interface MediaControlProps {
    label?: string;
    value: MediaValue | null;
    onChange: (value: MediaValue | null) => void;
    allowedTypes?: string[];
    size?: 'small' | 'medium' | 'large';
}

export const MediaControl: React.FC<MediaControlProps> = ({
    label = 'Image',
    value,
    onChange,
    allowedTypes = ['image'],
    size = 'medium',
}) => {
    const openMediaLibrary = useCallback(() => {
        // Check if wp.media is available
        if (!window.wp?.media) {
            console.error('[Polymorphic] WordPress media library not available');
            // Fallback to URL input
            const url = window.prompt('Enter image URL:');
            if (url) {
                onChange({ url, alt: '' });
            }
            return;
        }

        const frame = window.wp.media({
            title: 'Select Media',
            button: { text: 'Use this media' },
            multiple: false,
            library: { type: allowedTypes.join(',') },
        });

        frame.on('select', () => {
            const attachment = frame.state().get('selection').first().toJSON();
            
            // Get the best size URL
            let imageUrl = attachment.url;
            if (attachment.sizes) {
                // Prefer medium or large for editor display
                imageUrl = attachment.sizes.large?.url 
                    || attachment.sizes.medium?.url 
                    || attachment.sizes.full?.url 
                    || attachment.url;
            }

            onChange({
                id: attachment.id,
                url: imageUrl,
                alt: attachment.alt || attachment.title || '',
                title: attachment.title,
                width: attachment.width,
                height: attachment.height,
            });
        });

        frame.open();
    }, [onChange, allowedTypes]);

    const handleRemove = () => {
        onChange(null);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...value,
            url: e.target.value,
            alt: value?.alt || '',
        });
    };

    const sizeClasses = {
        small: styles.mediaPreviewSmall,
        medium: styles.mediaPreviewMedium,
        large: styles.mediaPreviewLarge,
    };

    return (
        <div className={styles.mediaControl}>
            {label && <label className={styles.label}>{label}</label>}
            
            {value?.url ? (
                <div className={`${styles.mediaPreview} ${sizeClasses[size]}`}>
                    <img 
                        src={value.url} 
                        alt={value.alt || ''} 
                        className={styles.mediaImage}
                    />
                    <div className={styles.mediaOverlay}>
                        <button
                            type="button"
                            className={styles.mediaButton}
                            onClick={openMediaLibrary}
                            title="Replace image"
                        >
                            <Image size={16} />
                        </button>
                        <button
                            type="button"
                            className={`${styles.mediaButton} ${styles.mediaButtonDanger}`}
                            onClick={handleRemove}
                            title="Remove image"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    className={styles.mediaUploadButton}
                    onClick={openMediaLibrary}
                >
                    <Upload size={20} />
                    <span>Select Image</span>
                </button>
            )}

            {/* URL input for manual entry or editing */}
            <div className={styles.mediaUrlInput}>
                <input
                    type="text"
                    value={value?.url || ''}
                    onChange={handleUrlChange}
                    placeholder="Or enter image URL..."
                    className={styles.input}
                />
            </div>
        </div>
    );
};

export default MediaControl;

