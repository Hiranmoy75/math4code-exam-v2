import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Block, BlockType } from '@/lib/blog-editor-types';
import {
    CheckCircle2,
    ArrowRight,
    HelpCircle,
    Plus,
    Minus,
    ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';

interface BlockRendererProps {
    blocks: Block[];
    className?: string;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks, className }) => {
    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div className={cn("w-full space-y-20 animate-fade-in-up", className)}>
            {blocks.map((block) => (
                <div key={block.id} className="reveal-block">
                    <RenderIndividualBlock block={block} />
                </div>
            ))}
        </div>
    );
};

const RenderIndividualBlock: React.FC<{ block: Block }> = ({ block }) => {
    switch (block.type) {
        case 'heading':
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return (
                <HeadingTag className={cn(
                    "font-black text-slate-900 tracking-tight leading-tight",
                    block.level === 1 && "text-4xl md:text-6xl",
                    block.level === 2 && "text-3xl md:text-4xl",
                    block.level === 3 && "text-2xl md:text-3xl"
                )}>
                    {block.content}
                </HeadingTag>
            );

        case 'paragraph':
            return (
                <p className="text-xl text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                    {block.content}
                </p>
            );

        case 'image':
            return (
                <div className="space-y-4">
                    <div className="relative aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                        {block.url ? (
                            <img src={block.url} alt={block.alt} className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                                Image Placeholder
                            </div>
                        )}
                    </div>
                    {block.caption && (
                        <p className="text-center text-sm text-slate-400 font-bold italic tracking-wide">
                            {block.caption}
                        </p>
                    )}
                </div>
            );

        case 'button':
            const alignmentClass = {
                left: "justify-start",
                center: "justify-center",
                right: "justify-end"
            }[block.alignment || 'left'];

            return (
                <div className={cn("flex w-full", alignmentClass)}>
                    <Button
                        asChild
                        variant={block.variant === 'primary' ? 'default' : block.variant}
                        className={cn(
                            "h-16 md:h-20 px-12 rounded-[24px] text-xl font-black transition-all hover:scale-105 active:scale-95",
                            block.variant === 'primary'
                                ? "bg-[#00A341] text-white hover:bg-[#008F38] shadow-2xl shadow-[#00A341]/20 border-b-4 border-[#007A30]"
                                : "shadow-xl"
                        )}
                    >
                        <a href={block.link || '#'}>{block.label}</a>
                    </Button>
                </div>
            );

        case 'cardGrid':
            return (
                <div className={cn(
                    "grid gap-6",
                    block.columns === 2 && "grid-cols-1 md:grid-cols-2",
                    block.columns === 3 && "grid-cols-1 md:grid-cols-3",
                    block.columns === 4 && "grid-cols-2 md:grid-cols-4"
                )}>
                    {block.cards.map((card, idx) => (
                        <div key={idx} className="p-8 bg-white border border-slate-100 rounded-[35px] shadow-sm hover:shadow-xl hover:border-green-100 transition-all group">
                            <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
                                {card.title}
                            </h4>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                {card.description}
                            </p>
                            {card.link && (
                                <a href={card.link} className="mt-4 flex items-center text-green-600 text-xs font-black uppercase tracking-widest gap-2">
                                    Learn More <ArrowRight className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            );

        case 'cta':
            const ctaThemes = {
                green: "bg-green-600 text-white shadow-green-900/20",
                dark: "bg-slate-900 text-white shadow-slate-900/40",
                glass: "bg-slate-50 border border-slate-100 text-slate-900 shadow-sm",
                "simple-green": "bg-emerald-50 text-slate-900 border border-emerald-100"
            };

            return (
                <div className={cn("relative p-10 md:p-16 rounded-[40px] overflow-hidden transition-all", ctaThemes[block.variant || 'green'])}>
                    {block.variant !== 'simple-green' && (
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-[200px] -mr-20 -mt-20 blur-2xl" />
                    )}
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-2/3 space-y-8">
                            <div className="space-y-4">
                                <h3 className={cn(
                                    "text-3xl md:text-5xl font-black tracking-tight leading-tight",
                                    block.variant === 'simple-green' ? "text-slate-900" : "text-white"
                                )}>
                                    {block.title}
                                </h3>
                                <p className={cn(
                                    "text-xl font-medium leading-relaxed",
                                    block.variant === 'glass' || block.variant === 'simple-green' ? "text-slate-600" : "text-white"
                                )}>
                                    {block.description}
                                </p>
                            </div>

                            {/* Features list (checkmarks) */}
                            {block.features && block.features.length > 0 && (
                                <div className="flex flex-wrap gap-4">
                                    {block.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm font-bold text-green-700">
                                            <CheckCircle2 className="w-4 h-4" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="md:w-1/3 flex justify-center md:justify-end">
                            <Button
                                asChild
                                className={cn(
                                    "h-16 md:h-20 px-10 md:px-14 rounded-[24px] text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl",
                                    block.variant === 'green'
                                        ? "bg-white text-[#00A341] hover:bg-slate-50 shadow-white/20"
                                        : "bg-[#00A341] text-white hover:bg-[#008F38] shadow-[#00A341]/30 border-b-4 border-[#007A30]"
                                )}
                            >
                                <a href={block.buttonLink || '#'}>{block.buttonText}</a>
                            </Button>
                        </div>
                    </div>
                </div>
            );

        case 'faq':
            return (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h4>
                    </div>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {block.items.map((item, idx) => (
                            <AccordionItem
                                key={idx}
                                value={`faq-${idx}`}
                                className="border border-slate-100 rounded-[25px] bg-slate-50 overflow-hidden px-6"
                            >
                                <AccordionTrigger className="text-lg font-black text-slate-800 hover:no-underline py-6">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-lg font-medium pb-8 leading-relaxed">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            );

        case 'table':
            return (
                <div className="not-prose w-full overflow-hidden border border-slate-100 rounded-[30px] shadow-sm bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    {block.headers.map((header, i) => (
                                        <th key={i} className="px-6 py-5 text-sm font-black text-slate-900 uppercase tracking-widest">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {block.rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        {row.map((cell, j) => (
                                            <td key={j} className="px-6 py-5 text-base font-medium text-slate-600">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        case 'divider':
            return (
                <div className="flex items-center justify-center py-10">
                    <div className={cn(
                        "w-full h-px",
                        block.style === 'solid' && "bg-slate-200",
                        block.style === 'dashed' && "border-t-2 border-dashed border-slate-200",
                        block.style === 'dots' && "border-t-4 border-dotted border-slate-200"
                    )} />
                </div>
            );

        default:
            return null;
    }
};
