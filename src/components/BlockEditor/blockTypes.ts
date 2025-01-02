import type { BlockType } from '../../types';

export const BLOCK_TYPES = {
    // Basic blocks
    text: 'site-text-block',
    image: 'site-image-block',
    columns: 'site-columns-block',
    video: 'site-video-block',
    embed: 'site-embed-block',
    gallery: 'site-gallery-block',
    button: 'site-button-block',
    spacer: 'site-spacer-block',
    html: 'site-html-block',
    heading: 'site-heading-block',

    // Layout blocks
    section: 'site-section-block',
    container: 'site-container-block',
    grid: 'site-grid-block',

    // Form blocks
    form: 'site-form-block',
    input: 'site-input-block',
    textarea: 'site-textarea-block',
    select: 'site-select-block',

    // Interactive blocks
    tabs: 'site-tabs-block',
    accordion: 'site-accordion-block',
    modal: 'site-modal-block',

    // HTML elements
    div: 'div',
    span: 'span',
    a: 'a',
    p: 'p',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    ul: 'ul',
    ol: 'ol',
    li: 'li'
} as const;

export type BlockTypeName = keyof typeof BLOCK_TYPES;

// Default settings for each block type
export const DEFAULT_BLOCK_SETTINGS = {
    text: {
        fontSize: 'normal',
        fontWeight: 'normal',
        alignment: 'left',
        padding: 'normal'
    },
    image: {
        width: 'full',
        aspectRatio: '16:9',
        borderRadius: 'none'
    },
    columns: {
        columns: 2,
        gap: 'normal',
        stackOnMobile: true
    },
    section: {
        width: 'full',
        padding: 'large',
        background: 'none'
    }
} as const;

// Block categories for organization
export const BLOCK_CATEGORIES = {
    basic: ['text', 'heading', 'image', 'button', 'spacer'],
    layout: ['section', 'container', 'columns', 'grid'],
    media: ['gallery', 'video', 'embed'],
    forms: ['form', 'input', 'textarea', 'select'],
    interactive: ['tabs', 'accordion', 'modal']
} as const;

// Block presets for quick insertion
export const BLOCK_PRESETS = {
    'hero-section': {
        type: 'section',
        content: [
            {
                type: 'heading',
                content: 'Welcome to my website',
                settings: { fontSize: 'xl', fontWeight: 'bold' }
            },
            {
                type: 'text',
                content: 'A beautiful description goes here',
                settings: { fontSize: 'lg' }
            }
        ]
    },
    'feature-grid': {
        type: 'grid',
        settings: { columns: 3, gap: 'large' },
        content: Array(3).fill({
            type: 'div',
            content: [
                { type: 'image', settings: { width: 'medium' } },
                { type: 'heading', content: 'Feature Title' },
                { type: 'text', content: 'Feature description' }
            ]
        })
    }
} as const;