export type BlockType =
    | 'heading'
    | 'paragraph'
    | 'image'
    | 'button'
    | 'cardGrid'
    | 'cta'
    | 'faq'
    | 'table'
    | 'divider';

export interface BaseBlock {
    id: string;
    type: BlockType;
}

export interface HeadingBlock extends BaseBlock {
    type: 'heading';
    level: 1 | 2 | 3;
    content: string;
}

export interface ParagraphBlock extends BaseBlock {
    type: 'paragraph';
    content: string;
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    url: string;
    alt: string;
    caption?: string;
}

export interface ButtonBlock extends BaseBlock {
    type: 'button';
    label: string;
    link: string;
    variant: 'primary' | 'outline' | 'ghost';
    alignment: 'left' | 'center' | 'right';
}

export interface CardGridBlock extends BaseBlock {
    type: 'cardGrid';
    columns: 2 | 3 | 4;
    cards: Array<{
        title: string;
        description: string;
        icon?: string;
        link?: string;
    }>;
}

export interface CTABlock extends BaseBlock {
    type: 'cta';
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    variant: 'green' | 'dark' | 'glass' | 'simple-green';
    features?: string[];
}

export interface FAQBlock extends BaseBlock {
    type: 'faq';
    items: Array<{
        question: string;
        answer: string;
    }>;
}

export interface TableBlock extends BaseBlock {
    type: 'table';
    headers: string[];
    rows: string[][];
    caption?: string;
}

export interface DividerBlock extends BaseBlock {
    type: 'divider';
    style: 'solid' | 'dashed' | 'dots';
}

export type Block =
    | HeadingBlock
    | ParagraphBlock
    | ImageBlock
    | ButtonBlock
    | CardGridBlock
    | CTABlock
    | FAQBlock
    | TableBlock
    | DividerBlock;
