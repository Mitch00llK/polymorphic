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
                    minHeight: '',
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
                            display: 'flex',
                            flexDirection: 'column',
                            flexWrap: 'nowrap',
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                            gap: '20px',
                            backgroundColor: '',
                            paddingTop: '0px',
                            paddingRight: '0px',
                            paddingBottom: '0px',
                            paddingLeft: '0px',
                            borderRadius: '0px',
                        },
                        children: [],
                    },
                ],
            },
        ],
    },
];
