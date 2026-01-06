/**
 * Blank Templates
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import type { Template } from './types';

export const blankTemplates: Template[] = [
    {
        id: 'blank-section',
        name: 'Blank Section',
        description: 'Start with an empty section and container.',
        category: 'blank',
        thumbnail: '',
        tags: ['blank', 'empty', 'start'],
        components: [
            {
                id: 'tpl-blank-section',
                type: 'section',
                props: {
                    width: 'full',
                    minHeight: '',
                    verticalAlign: 'start',
                    horizontalAlign: 'center',
                    gap: '0px',
                    backgroundColor: '#ffffff',
                    backgroundImage: '',
                    paddingTop: '60px',
                    paddingBottom: '60px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    marginTop: '0px',
                    marginBottom: '0px',
                },
                children: [
                    {
                        id: 'tpl-blank-container',
                        type: 'container',
                        props: {
                            maxWidth: '1200px',
                            width: 'full',
                            alignment: 'center',
                            direction: 'column',
                            wrap: 'nowrap',
                            justifyContent: 'start',
                            alignItems: 'stretch',
                            gap: '20px',
                            backgroundColor: '',
                            padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
                            borderRadius: '0px',
                        },
                        children: [],
                    },
                ],
            },
        ],
    },
];

