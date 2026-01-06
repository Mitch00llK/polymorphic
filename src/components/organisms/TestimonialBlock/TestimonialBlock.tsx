/**
 * Testimonial Block Component
 *
 * @package Polymorphic
 * @since   1.0.0
 */

import React from 'react';
import type { ComponentData } from '../../../types/components';
import { buildStyles, type StyleableProps } from '../../../utils/styleBuilder';

interface TestimonialBlockProps {
    component: ComponentData;
    context?: 'editor' | 'frontend';
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({ component }) => {
    const { id, props } = component;

    // Default items if none provided
    const items = (props.items as Array<any>) || [
        {
            id: '1',
            content: "Polymorphic has completely transformed how we build landing pages. It's incredibly intuitive and powerful.",
            author: "Sarah Johnson",
            role: "Product Designer",
            rating: 5
        },
        {
            id: '2',
            content: "The best page builder I've used in years. Specific, clean code and beautiful default assignments.",
            author: "Michael Chen",
            role: "CTO, TechStart",
            rating: 5
        },
        {
            id: '3',
            content: "Finally, a builder that doesn't bloat the DOM. Our site speed has improved significantly.",
            author: "Emily Davis",
            role: "Marketing Director",
            rating: 5
        }
    ];

    const sharedStyles = buildStyles(props as StyleableProps, ['layout', 'typography', 'box', 'size', 'spacing']);

    return (
        <div className="poly-testimonial-block" style={sharedStyles} data-component-id={id}>
            <div className="poly-testimonial-block__header">
                {props.title && <h2 className="poly-testimonial-block__title">{props.title as string}</h2>}
                {props.subtitle && <p className="poly-testimonial-block__subtitle">{props.subtitle as string}</p>}
            </div>

            <div className="poly-testimonial-block__grid">
                {items.map((item) => (
                    <div key={item.id} className="poly-testimonial-card">
                        <div className="poly-testimonial-card__rating">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < item.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            ))}
                        </div>
                        <blockquote className="poly-testimonial-card__content">
                            "{item.content}"
                        </blockquote>
                        <div className="poly-testimonial-card__author">
                            <div className="poly-testimonial-card__avatar">
                                {/* Avatar placeholder */}
                                <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="poly-testimonial-card__info">
                                <span className="poly-testimonial-card__name">{item.author}</span>
                                <span className="poly-testimonial-card__role">{item.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialBlock;
