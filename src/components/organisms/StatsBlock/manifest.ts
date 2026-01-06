/**
 * Stats Block Manifest
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { ComponentManifest } from '../../../types/manifest';

export const manifest: ComponentManifest = {
    type: 'statsBlock',
    label: 'Stats Grid',
    icon: 'BarChart3',
    category: 'blocks',
    phpClass: 'Polymorphic\\Components\\StatsBlock\\Stats_Block',
    supportsChildren: false,
    defaultProps: {
        columns: 4,
    },
    css: `
.poly-stats-block {
    width: 100%;
    padding-top: var(--poly-padding-top, 60px);
    padding-bottom: var(--poly-padding-bottom, 60px);
    padding-left: var(--poly-padding-left, 20px);
    padding-right: var(--poly-padding-right, 20px);
    background-color: var(--poly-background-color, #fff);
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
}
.poly-stats-block__grid { display: grid; grid-template-columns: repeat(var(--poly-columns, 4), 1fr); gap: 2rem; max-width: 1200px; margin: 0 auto; text-align: center; }
.poly-stats-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.poly-stats-item__value { font-size: 3rem; font-weight: 800; color: var(--poly-primary-color, #6366f1); line-height: 1; }
.poly-stats-item__label { font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
@media (max-width: 1024px) { .poly-stats-block__grid { grid-template-columns: repeat(2, 1fr); gap: 3rem; } }
@media (max-width: 640px) { .poly-stats-block__grid { grid-template-columns: 1fr; gap: 3rem; } }
`,
};

export default manifest;
