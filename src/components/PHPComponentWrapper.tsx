/**
 * PHP Component Wrapper.
 *
 * Generic wrapper component that renders third-party components
 * by fetching their HTML from the PHP backend.
 *
 * @package Polymorphic
 */

import React, { useEffect, useState, useRef } from 'react';
import type { ComponentData } from '../types/components';
import { componentRegistry } from '../services/componentRegistry';
import styles from './PHPComponentWrapper.module.css';

interface PHPComponentWrapperProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

/**
 * PHPComponentWrapper renders third-party components via API.
 *
 * This allows third-party plugins to register components that render
 * via PHP without needing a React renderer.
 */
export const PHPComponentWrapper: React.FC<PHPComponentWrapperProps> = ({
    component,
    context = 'editor',
}) => {
    const [html, setHtml] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const prevPropsRef = useRef<string>('');

    // Serialize props for comparison.
    const propsString = JSON.stringify(component.props);

    useEffect(() => {
        // Skip if props haven't changed.
        if (propsString === prevPropsRef.current && html) {
            return;
        }
        prevPropsRef.current = propsString;

        const fetchComponent = async () => {
            setLoading(true);
            setError(null);

            try {
                // Load assets first.
                await componentRegistry.loadAssets(component.type);

                // Render the component.
                const result = await componentRegistry.renderComponent(
                    component.type,
                    component.props as Record<string, unknown>,
                    context
                );

                if (result) {
                    setHtml(result.html);

                    // Inject any additional CSS.
                    if (result.css) {
                        const styleId = `php-component-${component.id}`;
                        let styleEl = document.getElementById(styleId) as HTMLStyleElement;
                        if (!styleEl) {
                            styleEl = document.createElement('style');
                            styleEl.id = styleId;
                            document.head.appendChild(styleEl);
                        }
                        styleEl.textContent = result.css;
                    }
                } else {
                    setError('Failed to render component');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchComponent();
    }, [component.type, propsString, context, component.id, html]);

    // Execute any scripts in the rendered HTML.
    useEffect(() => {
        if (!html || !containerRef.current) return;

        // Find and execute scripts.
        const scripts = containerRef.current.querySelectorAll('script');
        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach((attr) => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
    }, [html]);

    if (loading) {
        return (
            <div className={styles.loading} data-component-id={component.id}>
                <div className={styles.spinner}></div>
                <span>Loading {component.type}...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error} data-component-id={component.id}>
                <span>Error: {error}</span>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={styles.wrapper}
            data-component-id={component.id}
            data-component-type={component.type}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default PHPComponentWrapper;
