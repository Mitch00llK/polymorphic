/**
 * Logo Cloud Manifest
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { ComponentManifest } from '../../../types/manifest';

export const manifest: ComponentManifest = {
    type: 'logoCloud',
    label: 'Logo Cloud',
    icon: 'LayoutGrid',
    category: 'blocks',
    phpClass: 'Polymorphic\\Components\\LogoCloud\\Logo_Cloud',
    supportsChildren: false,
    defaultProps: {
        title: 'Trusted by leading brands',
        gap: '3rem',
    },
    css: `
.poly-logo-cloud {
    width: 100%;
    padding-top: var(--poly-padding-top, 60px);
    padding-bottom: var(--poly-padding-bottom, 60px);
    padding-left: var(--poly-padding-left, 20px);
    padding-right: var(--poly-padding-right, 20px);
    background-color: var(--poly-background-color, #fff);
}
.poly-logo-cloud__title { text-align: center; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 2rem; }
.poly-logo-cloud__grid { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: var(--poly-gap, 3rem); max-width: 1200px; margin: 0 auto; }
.poly-logo-item { display: flex; align-items: center; justify-content: center; }
.poly-logo-item img { max-height: 48px; width: auto; max-width: 160px; filter: grayscale(100%); opacity: 0.6; transition: all 0.3s ease; }
.poly-logo-item:hover img { filter: grayscale(0%); opacity: 1; transform: scale(1.05); }
`,
};

export default manifest;
