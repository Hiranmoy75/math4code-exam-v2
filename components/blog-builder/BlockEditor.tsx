"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Plus,
    Trash2,
    Copy,
    GripVertical,
    Settings2,
    Sparkles,
    Eye,
    Layout,
    Type,
    Image as ImageIcon,
    Square,
    Grid,
    Megaphone,
    HelpCircle,
    Minus,
    Save,
    Loader2,
    X,
    PlusCircle,
    Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Block, BlockType, HeadingBlock, ParagraphBlock, ImageBlock, ButtonBlock, CardGridBlock, CTABlock, FAQBlock, DividerBlock } from '@/lib/blog-editor-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { BlockRenderer } from './BlockRenderer';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BlockEditorProps {
    value: string; // JSON string
    onChange: (value: string) => void;
}

export function BlockEditor({ value, onChange }: BlockEditorProps) {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Parse initial value
    useEffect(() => {
        try {
            if (value && value.trim().startsWith('[')) {
                setBlocks(JSON.parse(value));
            } else if (value && !value.trim().startsWith('[')) {
                // Fallback for raw HTML conversion or empty
                // For now, if it's not JSON, treat it as empty or a single paragraph
                setBlocks([]);
            }
        } catch (e) {
            console.error("Failed to parse blocks JSON", e);
            setBlocks([]);
        }
    }, [value]);

    const updateBlocks = (newBlocks: Block[]) => {
        setBlocks(newBlocks);
        onChange(JSON.stringify(newBlocks));
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                const nextBlocks = arrayMove(items, oldIndex, newIndex);
                onChange(JSON.stringify(nextBlocks));
                return nextBlocks;
            });
        }
    };

    const addBlock = (type: BlockType) => {
        const id = Math.random().toString(36).substr(2, 9);
        let newBlock: any = { id, type };

        switch (type) {
            case 'heading':
                newBlock = { ...newBlock, level: 2, content: 'New Heading' };
                break;
            case 'paragraph':
                newBlock = { ...newBlock, content: 'Write your content here...' };
                break;
            case 'image':
                newBlock = { ...newBlock, url: '', alt: 'Image description', caption: '' };
                break;
            case 'button':
                newBlock = { ...newBlock, label: 'Click Me', link: '#', variant: 'primary', alignment: 'center' };
                break;
            case 'cardGrid':
                newBlock = { ...newBlock, columns: 3, cards: [{ title: 'Feature', description: 'Detail...' }] };
                break;
            case 'cta':
                newBlock = {
                    ...newBlock,
                    title: 'Big Action',
                    description: 'Why should they click?',
                    buttonText: 'Enroll Now',
                    buttonLink: '#',
                    variant: 'simple-green',
                    features: ['Live Classes', 'Test Series', 'PDF Notes']
                };
                break;
            case 'faq':
                newBlock = { ...newBlock, items: [{ question: 'What is this?', answer: 'It is a new feature.' }] };
                break;
            case 'table':
                newBlock = {
                    ...newBlock,
                    headers: ['Feature', 'Detail', 'Benefit'],
                    rows: [
                        ['Math4Code Live', '2 Hours/Day', 'Fast Learning'],
                        ['Study Notes', 'PDF Format', 'Revision Hack']
                    ]
                };
                break;
            case 'divider':
                newBlock = { ...newBlock, style: 'solid' };
                break;
        }

        updateBlocks([...blocks, newBlock]);
    };

    const removeBlock = (id: string) => {
        updateBlocks(blocks.filter(b => b.id !== id));
    };

    const duplicateBlock = (id: string) => {
        const blockIndex = blocks.findIndex(b => b.id === id);
        if (blockIndex === -1) return;
        const blockToCopy = { ...blocks[blockIndex], id: Math.random().toString(36).substr(2, 9) };
        const newBlocks = [...blocks];
        newBlocks.splice(blockIndex + 1, 0, blockToCopy);
        updateBlocks(newBlocks);
    };

    const updateBlockData = (id: string, data: Partial<Block>) => {
        updateBlocks(blocks.map(b => b.id === id ? { ...b, ...data } as Block : b));
    };

    const generateAIContent = async (formData: any) => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Generate a structured block-based blog post about ${formData.topic} for the ${formData.exam} exam. 
          The tone should be ${formData.tone} and length should be ${formData.length}. 
          Return ONLY a JSON array of blocks matching this structure: 
          [{"type": "heading", "level": 1, "content": "..."}, {"type": "paragraph", "content": "..."}, {"type": "cta", "variant": "simple-green", "features": ["Feature 1", ...], ...}, {"type": "table", "headers": ["Col1", ...], "rows": [["Cell1", ...], ...]}, {"type": "cardGrid", "cards": [...]}, {"type": "faq", "items": [...]}, {"type": "image", "url": "", "alt": "..."}]. 
          Use at least 6-10 blocks. Include a "simple-green" CTA and a Table if relevant.`,
                    format: 'json_blocks'
                })
            });

            const data = await response.json();
            if (data.blocks && Array.isArray(data.blocks)) {
                // Add random IDs to AI generated blocks
                const blocksWithIds = data.blocks.map((b: any) => ({
                    ...b,
                    id: Math.random().toString(36).substr(2, 9)
                }));
                updateBlocks([...blocks, ...blocksWithIds]);
                setIsAIModalOpen(false);
                toast.success("AI Content Generated Successfully!");
            } else {
                toast.error(data.error || "AI returned invalid structure. Please try again.");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to generate content");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100">
                        <Layout className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900">Block Builder v2</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Advanced JSON Creator</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full font-bold gap-2 text-green-600 border-green-100 bg-green-50 shadow-none hover:bg-green-100"
                        onClick={() => setIsAIModalOpen(true)}
                    >
                        <Sparkles className="w-4 h-4" /> AI Architect
                    </Button>

                    <Button
                        variant={isPreviewMode ? "default" : "outline"}
                        size="sm"
                        className="rounded-full font-bold gap-2"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                        {isPreviewMode ? <Settings2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {isPreviewMode ? "Edit Canvas" : "Live Preview"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                {isPreviewMode ? (
                    <div className="max-w-[900px] mx-auto bg-white p-12 md:p-24 rounded-[60px] shadow-2xl border border-slate-100">
                        <BlockRenderer blocks={blocks} />
                    </div>
                ) : (
                    <div className="max-w-[800px] mx-auto space-y-4 pb-40">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={blocks.map(b => b.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {blocks.map((block) => (
                                    <SortableBlockItem
                                        key={block.id}
                                        block={block}
                                        onDelete={() => removeBlock(block.id)}
                                        onDuplicate={() => duplicateBlock(block.id)}
                                        onUpdate={(data) => updateBlockData(block.id, data)}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {blocks.length === 0 && (
                            <div className="border-2 border-dashed border-slate-100 rounded-[40px] p-20 text-center space-y-6 bg-white/50">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                    <Layout className="w-10 h-10" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-400">Your Canvas is Empty</h4>
                                    <p className="text-slate-300 font-bold">Start by adding a block or using the AI Architect</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-center gap-3 pt-10 sticky bottom-4 z-20">
                            <AddBlockButton icon={<Type />} label="Heading" onClick={() => addBlock('heading')} color="bg-blue-50 text-blue-600" />
                            <AddBlockButton icon={<Layout />} label="Text" onClick={() => addBlock('paragraph')} color="bg-orange-50 text-orange-600" />
                            <AddBlockButton icon={<ImageIcon />} label="Media" onClick={() => addBlock('image')} color="bg-purple-50 text-purple-600" />
                            <AddBlockButton icon={<Square />} label="Button" onClick={() => addBlock('button')} color="bg-green-50 text-green-600" />
                            <AddBlockButton icon={<Grid />} label="Cards" onClick={() => addBlock('cardGrid')} color="bg-pink-50 text-pink-600" />
                            <AddBlockButton icon={<Megaphone />} label="CTA" onClick={() => addBlock('cta')} color="bg-indigo-50 text-indigo-600" />
                            <AddBlockButton icon={<HelpCircle />} label="FAQ" onClick={() => addBlock('faq')} color="bg-amber-50 text-amber-600" />
                            <AddBlockButton icon={<Save className="w-5 h-5 rotate-45" />} label="Table" onClick={() => addBlock('table')} color="bg-cyan-50 text-cyan-600" />
                            <AddBlockButton icon={<Minus />} label="Line" onClick={() => addBlock('divider')} color="bg-slate-50 text-slate-600" />
                        </div>
                    </div>
                )}
            </div>

            {/* AI Modal */}
            <AIModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onGenerate={generateAIContent}
                isGenerating={isGenerating}
            />
        </div>
    );
}

function SortableBlockItem({ block, onDelete, onDuplicate, onUpdate }: {
    block: Block;
    onDelete: () => void;
    onDuplicate: () => void;
    onUpdate: (data: Partial<Block>) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative bg-white border border-slate-100 rounded-3xl p-6 shadow-sm transition-all hover:shadow-md hover:border-green-100",
                isDragging && "opacity-50 scale-105 shadow-2xl z-50 ring-4 ring-green-100 border-green-200"
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-slate-600 transition-colors">
                        <GripVertical className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="bg-slate-50 text-[10px] font-black uppercase tracking-widest border-slate-100 text-slate-400 px-3 py-1">
                        {block.type}
                    </Badge>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-green-600 rounded-xl" onClick={onDuplicate}>
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-red-500 rounded-xl" onClick={onDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="pl-12">
                <BlockFields block={block} onUpdate={onUpdate} />
            </div>
        </div>
    );
}

function BlockFields({ block, onUpdate }: { block: Block; onUpdate: (data: Partial<Block>) => void }) {
    switch (block.type) {
        case 'heading':
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map(lvl => (
                            <Button
                                key={lvl}
                                size="sm"
                                variant={block.level === lvl ? "default" : "outline"}
                                className={cn("h-8 w-8 p-0 rounded-lg font-black", block.level === lvl && "bg-green-600 shadow-lg shadow-green-100")}
                                onClick={() => onUpdate({ level: lvl as any })}
                            >
                                H{lvl}
                            </Button>
                        ))}
                    </div>
                    <Input
                        value={block.content}
                        onChange={e => onUpdate({ content: e.target.value })}
                        className="text-2xl font-black border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-slate-200 h-auto"
                        placeholder="Type your heading..."
                    />
                </div>
            );

        case 'paragraph':
            return (
                <Textarea
                    value={block.content}
                    onChange={e => onUpdate({ content: e.target.value })}
                    className="text-lg font-medium border-none bg-transparent p-0 focus-visible:ring-0 resize-none min-h-[100px] leading-relaxed placeholder:text-slate-200"
                    placeholder="Start writing the story..."
                />
            );

        case 'image':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image Source (URL)</label>
                        <Input
                            value={block.url}
                            onChange={e => onUpdate({ url: e.target.value })}
                            className="bg-slate-50 border-slate-100 rounded-xl font-bold"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Caption</label>
                        <Input
                            value={block.caption}
                            onChange={e => onUpdate({ caption: e.target.value })}
                            className="bg-slate-50 border-slate-100 rounded-xl font-bold"
                            placeholder="Photographed by..."
                        />
                    </div>
                </div>
            );

        case 'button':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input value={block.label} onChange={e => onUpdate({ label: e.target.value })} placeholder="Button Label" className="bg-slate-50 rounded-xl font-bold" />
                    <Input value={block.link} onChange={e => onUpdate({ link: e.target.value })} placeholder="URL Link" className="bg-slate-50 rounded-xl font-bold" />
                    <Select value={block.variant} onValueChange={(val: any) => onUpdate({ variant: val })}>
                        <SelectTrigger className="bg-slate-50 rounded-xl font-bold"><SelectValue placeholder="Variant" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="primary">Primary (Green)</SelectItem>
                            <SelectItem value="outline">Outline</SelectItem>
                            <SelectItem value="ghost">Ghost</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            );

        case 'cardGrid':
            return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400">Card Configuration</p>
                        <Button size="sm" variant="outline" className="h-8 rounded-lg font-bold gap-2" onClick={() => onUpdate({ cards: [...block.cards, { title: 'New Card', description: 'Description...' }] })}>
                            <PlusCircle className="w-3 h-3" /> Add Card
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {block.cards.map((card, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl flex items-start gap-4 border border-slate-100 group/card">
                                <div className="flex-1 space-y-2">
                                    <Input value={card.title} onChange={e => {
                                        const newCards = [...block.cards];
                                        newCards[idx] = { ...newCards[idx], title: e.target.value };
                                        onUpdate({ cards: newCards });
                                    }} className="h-8 font-black bg-white border-slate-100 " />
                                    <Textarea value={card.description} onChange={e => {
                                        const newCards = [...block.cards];
                                        newCards[idx] = { ...newCards[idx], description: e.target.value };
                                        onUpdate({ cards: newCards });
                                    }} className="text-xs font-medium bg-white border-slate-100 min-h-[60px]" />
                                </div>
                                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500 opacity-0 group-hover/card:opacity-100" onClick={() => {
                                    const newCards = block.cards.filter((_, i) => i !== idx);
                                    onUpdate({ cards: newCards });
                                }}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'cta':
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input value={block.title} onChange={e => onUpdate({ title: e.target.value })} className="text-xl font-black bg-slate-50" placeholder="CTA Title" />
                        <Select value={block.variant} onValueChange={(val: any) => onUpdate({ variant: val })}>
                            <SelectTrigger className="bg-slate-50 font-bold"><SelectValue placeholder="Theme" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="green">Classic Green</SelectItem>
                                <SelectItem value="simple-green">Promo Banner (Light)</SelectItem>
                                <SelectItem value="dark">Deep Dark</SelectItem>
                                <SelectItem value="glass">Soft Glass</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Textarea value={block.description} onChange={e => onUpdate({ description: e.target.value })} className="font-medium bg-slate-50" placeholder="CTA Description" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input value={block.buttonText} onChange={e => onUpdate({ buttonText: e.target.value })} placeholder="Btn Text" className="bg-slate-50" />
                        <Input value={block.buttonLink} onChange={e => onUpdate({ buttonLink: e.target.value })} placeholder="Btn Link" className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest uppercase text-slate-400">Features / Benefits (Checkmarks)</label>
                        <Input
                            value={block.features?.join(', ') || ''}
                            onChange={e => onUpdate({ features: e.target.value.split(',').map(f => f.trim()).filter(f => f !== '') })}
                            placeholder="Live Classes, Test Series, PDF Notes..."
                            className="bg-slate-50 font-bold"
                        />
                    </div>
                </div>
            );

        case 'faq':
            return (
                <div className="space-y-4">
                    <Button size="sm" variant="outline" className="rounded-lg font-bold gap-2" onClick={() => onUpdate({ items: [...block.items, { question: 'New Question', answer: 'New Answer' }] })}>
                        <PlusCircle className="w-3 h-3" /> Add FAQ
                    </Button>
                    <div className="space-y-3">
                        {block.items.map((item, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 relative group/faq">
                                <Input value={item.question} onChange={e => {
                                    const newItems = [...block.items];
                                    newItems[idx] = { ...newItems[idx], question: e.target.value };
                                    onUpdate({ items: newItems });
                                }} className="font-black bg-white" placeholder="Question" />
                                <Textarea value={item.answer} onChange={e => {
                                    const newItems = [...block.items];
                                    newItems[idx] = { ...newItems[idx], answer: e.target.value };
                                    onUpdate({ items: newItems });
                                }} className="text-sm font-medium bg-white" placeholder="Answer" />
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/faq:opacity-100" onClick={() => {
                                    const newItems = block.items.filter((_, i) => i !== idx);
                                    onUpdate({ items: newItems });
                                }}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'table':
            return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data Architecture</p>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-8 rounded-lg font-bold" onClick={() => {
                                const newHeaders = [...block.headers, `Col ${block.headers.length + 1}`];
                                const newRows = block.rows.map(r => [...r, '']);
                                onUpdate({ headers: newHeaders, rows: newRows });
                            }}>+ Col</Button>
                            <Button size="sm" variant="outline" className="h-8 rounded-lg font-bold" onClick={() => {
                                const newRow = Array(block.headers.length).fill('');
                                onUpdate({ rows: [...block.rows, newRow] });
                            }}>+ Row</Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-slate-50 p-4">
                        <div className="min-w-[500px] space-y-2">
                            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${block.headers.length}, 1fr)` }}>
                                {block.headers.map((h, i) => (
                                    <div key={i} className="relative group/h">
                                        <Input
                                            value={h}
                                            onChange={e => {
                                                const nh = [...block.headers];
                                                nh[i] = e.target.value;
                                                onUpdate({ headers: nh });
                                            }}
                                            className="h-10 font-black bg-white border-slate-200 text-xs"
                                        />
                                        {block.headers.length > 1 && (
                                            <button
                                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/h:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    const nh = block.headers.filter((_, idx) => idx !== i);
                                                    const nr = block.rows.map(r => r.filter((_, idx) => idx !== i));
                                                    onUpdate({ headers: nh, rows: nr });
                                                }}
                                            >
                                                <X className="w-2 h-2" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {block.rows.map((row, i) => (
                                <div key={i} className="grid gap-2 relative group/r" style={{ gridTemplateColumns: `repeat(${block.headers.length}, 1fr)` }}>
                                    {row.map((cell, j) => (
                                        <Input
                                            key={j}
                                            value={cell}
                                            onChange={e => {
                                                const nr = [...block.rows];
                                                nr[i] = [...nr[i]];
                                                nr[i][j] = e.target.value;
                                                onUpdate({ rows: nr });
                                            }}
                                            className="h-10 font-medium bg-white border-slate-100 text-xs"
                                        />
                                    ))}
                                    {block.rows.length > 1 && (
                                        <button
                                            className="absolute -right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 opacity-0 group-hover/r:opacity-100 transition-opacity"
                                            onClick={() => {
                                                const nr = block.rows.filter((_, idx) => idx !== i);
                                                onUpdate({ rows: nr });
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'divider':
            return (
                <div className="flex items-center gap-4">
                    {['solid', 'dashed', 'dots'].map(s => (
                        <Button key={s} variant={block.style === s ? "default" : "outline"} className="capitalize font-bold h-8 rounded-lg" onClick={() => onUpdate({ style: s as any })}>{s}</Button>
                    ))}
                </div>
            );

        default:
            return null;
    }
}

function AddBlockButton({ icon, label, onClick, color }: { icon: any; label: string; onClick: () => void; color: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-6 py-4 rounded-[20px] shadow-lg transition-all hover:scale-105 active:scale-95 font-black text-sm",
                color
            )}
        >
            {React.cloneElement(icon, { className: "w-5 h-5" })}
            {label}
        </button>
    );
}

function AIModal({ isOpen, onClose, onGenerate, isGenerating }: { isOpen: boolean; onClose: () => void; onGenerate: (data: any) => void; isGenerating: boolean }) {
    const [formData, setFormData] = useState({
        topic: '',
        exam: 'CSIR NET',
        tone: 'Professional',
        length: 'Medium'
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl rounded-[40px] p-0 overflow-hidden border-none glass shadow-2xl">
                <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-bl-[100px] blur-3xl animate-pulse" />
                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <Wand2 className="w-8 h-8 text-green-400" /> AI Architect
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Self-Expanding Intelligence API</p>
                </div>

                <div className="p-10 space-y-8 bg-white">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Blog Topic</label>
                        <Input
                            value={formData.topic}
                            onChange={e => setFormData({ ...formData, topic: e.target.value })}
                            placeholder="Ex. Real Analysis Master Guide for CSIR NET"
                            className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold px-6"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Exam</label>
                            <Select value={formData.exam} onValueChange={v => setFormData({ ...formData, exam: v })}>
                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold px-6"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CSIR NET">CSIR NET</SelectItem>
                                    <SelectItem value="GATE">GATE</SelectItem>
                                    <SelectItem value="IIT JAM">IIT JAM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tone</label>
                            <Select value={formData.tone} onValueChange={v => setFormData({ ...formData, tone: v })}>
                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold px-6"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                    <SelectItem value="Beginner Friendly">Beginner Friendly</SelectItem>
                                    <SelectItem value="Intense Expert">Intense Expert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        className="w-full h-16 rounded-[24px] bg-slate-900 text-white font-black text-lg gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        disabled={!formData.topic || isGenerating}
                        onClick={() => onGenerate(formData)}
                    >
                        {isGenerating ? (
                            <><Loader2 className="w-6 h-6 animate-spin" /> Materializing Content...</>
                        ) : (
                            <><Sparkles className="w-6 h-6" /> Construct Blog Architecture</>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
