"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MathPreviewRenderer } from "@/components/MathPreviewRenderer";
import {
    Bold, Italic, Strikethrough, Code, Link as LinkIcon,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Minus, Undo, Redo,
    Eye, PenLine, Columns2, ChevronDown, Image as ImageIcon,
    HelpCircle, X, Keyboard, Sigma, FunctionSquare,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

type ViewMode = "split" | "editor" | "preview";

// ─── Toolbar Config ───────────────────────────────────────────────────────────

const MATH_BLOCKS = [
    { cmd: "\\definition{}", label: "Definition",  icon: "📘", offset: 12, color: "text-blue-600 dark:text-blue-400" },
    { cmd: "\\theorem{}",    label: "Theorem",     icon: "📐", offset: 9,  color: "text-purple-600 dark:text-purple-400" },
    { cmd: "\\lemma{}",      label: "Lemma",       icon: "🔹", offset: 7,  color: "text-violet-600 dark:text-violet-400" },
    { cmd: "\\corollary{}", label: "Corollary",   icon: "🔸", offset: 11, color: "text-fuchsia-600 dark:text-fuchsia-400" },
    { cmd: "\\proposition{}", label: "Proposition", icon: "💡", offset: 13, color: "text-indigo-600 dark:text-indigo-400" },
    { cmd: "\\proof{}",     label: "Proof",       icon: "✍️", offset: 7,  color: "text-slate-600 dark:text-slate-400" },
    { cmd: "\\example{}",   label: "Example",     icon: "✏️", offset: 9,  color: "text-green-600 dark:text-green-400" },
    { cmd: "\\question{}",  label: "Question",    icon: "❓", offset: 10, color: "text-orange-600 dark:text-orange-400" },
    { cmd: "\\answer{}",    label: "Answer",      icon: "✅", offset: 8,  color: "text-teal-600 dark:text-teal-400" },
    { cmd: "\\note{}",      label: "Note",        icon: "📝", offset: 6,  color: "text-amber-600 dark:text-amber-400" },
    { cmd: "\\warning{}",   label: "Warning",     icon: "⚠️", offset: 9,  color: "text-red-600 dark:text-red-400" },
    { cmd: "\\remark{}",    label: "Remark",      icon: "💬", offset: 8,  color: "text-sky-600 dark:text-sky-400" },
];

// ─── Syntax Help Panel Content ────────────────────────────────────────────────
const HELP_SECTIONS = [
    {
        title: "⌨️ Keyboard Shortcuts",
        color: "bg-slate-50 dark:bg-slate-800/60",
        rows: [
            ["Ctrl + B", "**bold text**"],
            ["Ctrl + I", "*italic text*"],
            ["Ctrl + K", "[link text](url)"],
            ["Ctrl + `", "`inline code`"],
            ["Tab",      "Indent 2 spaces"],
        ],
    },
    {
        title: "∑ Math (LaTeX)",
        color: "bg-indigo-50 dark:bg-indigo-950/40",
        rows: [
            ["$E = mc^2$",                      "Inline math"],
            ["$$\\int_0^\\infty e^{-x^2} dx$$", "Display / block math"],
            ["\\frac{a}{b}",                     "Fraction"],
            ["\\sum_{i=1}^{n} i",                "Summation"],
            ["\\mathbb{R}, \\mathbb{N}",         "Number sets"],
            ["\\alpha, \\beta, \\gamma",         "Greek letters"],
            ["x^{n}, x_{n}",                     "Superscript / subscript"],
        ],
    },
    {
        title: "📦 Math Boxes",
        color: "bg-purple-50 dark:bg-purple-950/40",
        rows: MATH_BLOCKS.map(b => [
            `\\${b.label.toLowerCase()}{...}`,
            b.icon + " " + b.label + " box",
        ]),
    },
    {
        title: "📝 Markdown",
        color: "bg-emerald-50 dark:bg-emerald-950/40",
        rows: [
            ["# Title",             "Heading 1"],
            ["## Section",          "Heading 2"],
            ["### Subsection",      "Heading 3"],
            ["**bold**",            "Bold text"],
            ["*italic*",            "Italic text"],
            ["~~strikethrough~~",   "Strikethrough"],
            ["`code`",              "Inline code"],
            ["```python\\n...\\n```", "Code block"],
            ["- item",              "Bullet list"],
            ["1. item",             "Numbered list"],
            ["> quote",             "Blockquote"],
            ["---",                 "Horizontal rule"],
            ["[text](url)",         "Link"],
        ],
    },
    {
        title: "🖼️ Images",
        color: "bg-green-50 dark:bg-green-950/40",
        rows: [
            ["![caption](url)",         "Block image with caption"],
            ["\\image{url}{caption}",   "Same, custom syntax"],
        ],
    },
];

// ─── Syntax Help Modal ────────────────────────────────────────────────────────
function SyntaxHelpPanel({ onClose }: { onClose: () => void }) {
    const [activeSection, setActiveSection] = useState(0);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
            <div
                className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-indigo-500" />
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Syntax Reference</h2>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-normal ml-1">Press Esc to close</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Tab Bar */}
                <div className="flex gap-1 px-4 pt-3 pb-0 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 overflow-x-auto">
                    {HELP_SECTIONS.map((sec, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiveSection(i)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold rounded-t-lg whitespace-nowrap transition-all border-b-2 -mb-px",
                                activeSection === i
                                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-[#0d1117]"
                                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {sec.title}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    <div className={cn("rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800", HELP_SECTIONS[activeSection].color)}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/2">Syntax</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {HELP_SECTIONS[activeSection].rows.map(([syntax, result], idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-white/60 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-4 py-2.5">
                                            <code className="text-xs bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-mono whitespace-pre">
                                                {syntax}
                                            </code>
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 text-xs">{result}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer tip */}
                <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                        💡 Math blocks automatically render with MathJax — use <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">$...$</code> for inline and <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">$$...$$</code> for display math inside any block.
                    </span>
                </div>
            </div>
            {/* Backdrop click closes */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("split");
    const [showBlockMenu, setShowBlockMenu] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const blockMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (blockMenuRef.current && !blockMenuRef.current.contains(e.target as Node)) {
                setShowBlockMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Text Insertion ────────────────────────────────────────────────────────
    const insertText = useCallback((before: string, after: string = "", ph: string = "") => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = ta.value.slice(start, end) || ph;
        const newVal = ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
        onChange(newVal);
        requestAnimationFrame(() => {
            ta.focus();
            const selectStart = start + before.length;
            ta.setSelectionRange(selectStart, selectStart + selected.length);
        });
    }, [onChange]);

    const insertBlock = useCallback((prefix: string) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const prefix2 = start > 0 ? "\n" : "";
        const newVal = ta.value.slice(0, start) + prefix2 + prefix + ta.value.slice(start);
        onChange(newVal);
        requestAnimationFrame(() => {
            ta.focus();
            const pos = start + prefix2.length + prefix.length;
            ta.setSelectionRange(pos, pos);
        });
    }, [onChange]);

    const insertMathBlock = useCallback((cmd: string, innerOffset: number) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const selected = ta.value.slice(ta.selectionStart, ta.selectionEnd);
        const prefix = start > 0 && ta.value[start - 1] !== "\n" ? "\n" : "";
        const inner = selected || "Content here";
        const insertion = prefix + cmd.slice(0, innerOffset) + inner + cmd.slice(innerOffset) + "\n";
        const newVal = ta.value.slice(0, start) + insertion + ta.value.slice(ta.selectionEnd);
        onChange(newVal);
        setShowBlockMenu(false);
        requestAnimationFrame(() => {
            ta.focus();
            const s = start + prefix.length + innerOffset;
            ta.setSelectionRange(s, s + inner.length);
        });
    }, [onChange]);

    // ── Keyboard shortcuts ────────────────────────────────────────────────────
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const ta = textareaRef.current;
        if (!ta) return;
        if (e.key === "Tab") {
            e.preventDefault();
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const newVal = ta.value.slice(0, start) + "  " + ta.value.slice(end);
            onChange(newVal);
            requestAnimationFrame(() => { ta.setSelectionRange(start + 2, start + 2); });
            return;
        }
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case "b": e.preventDefault(); insertText("**", "**", "bold text"); return;
                case "i": e.preventDefault(); insertText("*", "*", "italic text"); return;
                case "k": e.preventDefault(); insertText("[", "](url)", "link text"); return;
                case "`": e.preventDefault(); insertText("`", "`", "code"); return;
            }
        }
    }, [insertText, onChange]);

    const insertImage = useCallback(() => {
        const url = window.prompt("Image URL:");
        if (!url) return;
        const caption = window.prompt("Caption (optional):") || "";
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const prefix = start > 0 && ta.value[start - 1] !== "\n" ? "\n" : "";
        const insertion = `${prefix}![${caption}](${url})\n`;
        const newVal = ta.value.slice(0, start) + insertion + ta.value.slice(start);
        onChange(newVal);
        requestAnimationFrame(() => { ta.focus(); });
    }, [onChange]);

    // ─── Toolbar Button ───────────────────────────────────────────────────────
    const TB = ({ onClick, icon, title, cls = "" }: { onClick: () => void; icon: React.ReactNode; title: string; cls?: string }) => (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            className={cn(
                "flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white dark:hover:bg-slate-700 dark:hover:text-white transition-all text-sm",
                cls
            )}
        >
            {icon}
        </button>
    );

    const Divider = () => <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />;

    return (
        <>
            {/* ── Syntax Help Modal ── */}
            {showHelp && <SyntaxHelpPanel onClose={() => setShowHelp(false)} />}

            <div className={cn("flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#0d1117]", className)}>

                {/* ── Toolbar ── */}
                <div className="flex items-center gap-0.5 px-3 py-1.5 bg-slate-50 dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-700 flex-wrap min-h-[44px]">

                    {/* Undo / Redo */}
                    <TB onClick={() => document.execCommand("undo")} icon={<Undo className="h-3.5 w-3.5" />} title="Undo (Ctrl+Z)" />
                    <TB onClick={() => document.execCommand("redo")} icon={<Redo className="h-3.5 w-3.5" />} title="Redo (Ctrl+Y)" />
                    <Divider />

                    {/* Headings */}
                    <TB onClick={() => insertBlock("# ")}   icon={<Heading1 className="h-3.5 w-3.5" />} title="Heading 1" />
                    <TB onClick={() => insertBlock("## ")}  icon={<Heading2 className="h-3.5 w-3.5" />} title="Heading 2" />
                    <TB onClick={() => insertBlock("### ")} icon={<Heading3 className="h-3.5 w-3.5" />} title="Heading 3" />
                    <Divider />

                    {/* Inline formatting */}
                    <TB onClick={() => insertText("**", "**", "bold")}   icon={<Bold className="h-3.5 w-3.5" />}         title="Bold (Ctrl+B)" />
                    <TB onClick={() => insertText("*", "*", "italic")}   icon={<Italic className="h-3.5 w-3.5" />}       title="Italic (Ctrl+I)" />
                    <TB onClick={() => insertText("~~", "~~", "text")}   icon={<Strikethrough className="h-3.5 w-3.5" />} title="Strikethrough" />
                    <TB onClick={() => insertText("`", "`", "code")}     icon={<Code className="h-3.5 w-3.5" />}         title="Inline Code" />
                    <TB onClick={() => insertText("[", "](url)", "link")} icon={<LinkIcon className="h-3.5 w-3.5" />}    title="Link (Ctrl+K)" />
                    <Divider />

                    {/* Lists */}
                    <TB onClick={() => insertBlock("- ")}    icon={<List className="h-3.5 w-3.5" />}        title="Bullet List" />
                    <TB onClick={() => insertBlock("1. ")}   icon={<ListOrdered className="h-3.5 w-3.5" />} title="Numbered List" />
                    <TB onClick={() => insertBlock("> ")}    icon={<Quote className="h-3.5 w-3.5" />}       title="Blockquote" />
                    <TB onClick={() => insertBlock("\n---\n")} icon={<Minus className="h-3.5 w-3.5" />}    title="Horizontal Rule" />
                    <Divider />

                    {/* Image */}
                    <TB onClick={insertImage} icon={<ImageIcon className="h-3.5 w-3.5 text-emerald-600" />} title="Insert Image" />
                    <Divider />

                    {/* Math */}
                    <TB
                        onClick={() => insertText("$", "$", "E = mc^2")}
                        icon={<span className="font-serif text-xs font-bold text-indigo-600">∑</span>}
                        title="Inline Math: $...$"
                    />
                    <TB
                        onClick={() => insertBlock("\n$$\n")}
                        icon={<span className="font-serif text-xs font-bold text-purple-600">∫∫</span>}
                        title="Display Math: $$...$$"
                    />
                    <Divider />

                    {/* Math Blocks dropdown */}
                    <div className="relative" ref={blockMenuRef}>
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowBlockMenu((v) => !v)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 transition-all"
                        >
                            📦 Math Blocks
                            <ChevronDown className={cn("h-3 w-3 transition-transform duration-150", showBlockMenu && "rotate-180")} />
                        </button>
                        {showBlockMenu && (
                            <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-[#1a1f2e] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-1.5 w-64 flex flex-col gap-0.5">
                                <div className="px-2.5 py-1.5 mb-0.5 border-b border-slate-100 dark:border-slate-700">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Insert Block</span>
                                </div>
                                {MATH_BLOCKS.map((blk) => (
                                    <button
                                        key={blk.cmd}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => insertMathBlock(blk.cmd, blk.offset)}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all group"
                                    >
                                        <span className="text-base w-5 text-center flex-shrink-0 leading-none">{blk.icon}</span>
                                        <span className="flex-1">{blk.label}</span>
                                        <span className={cn("text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0", blk.color)}>
                                            \{blk.label.toLowerCase()}{'{}'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Syntax Help button */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowHelp(true)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                        title="Open syntax reference"
                    >
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Help</span>
                    </button>
                    <Divider />

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-0.5 bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5">
                        {(["editor", "split", "preview"] as ViewMode[]).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setViewMode(mode)}
                                title={mode.charAt(0).toUpperCase() + mode.slice(1)}
                                className={cn(
                                    "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                                    viewMode === mode
                                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                {mode === "editor"  && <PenLine className="h-3 w-3" />}
                                {mode === "split"   && <Columns2 className="h-3 w-3" />}
                                {mode === "preview" && <Eye className="h-3 w-3" />}
                                <span className="hidden sm:inline capitalize">{mode}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Editor + Preview Panes ── */}
                <div className="flex flex-1 min-h-0" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>

                    {/* Editor Pane */}
                    {(viewMode === "editor" || viewMode === "split") && (
                        <div className={cn(
                            "flex flex-col",
                            viewMode === "split" ? "w-1/2 border-r border-slate-200 dark:border-slate-700" : "w-full"
                        )}>
                            <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Markdown + LaTeX</span>
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder || `Start typing...\n\nExamples:\n# Heading\n**bold** *italic*\n$E = mc^2$ (inline math)\n$$\\int_0^\\infty f(x) dx$$ (block math)\n\\definition{A set is...}\n\\theorem{...}`}
                                spellCheck={false}
                                className={cn(
                                    "flex-1 resize-none outline-none p-5 font-mono text-sm leading-7",
                                    "bg-white dark:bg-[#0d1117]",
                                    "text-slate-800 dark:text-slate-200",
                                    "placeholder:text-slate-300 dark:placeholder:text-slate-600",
                                )}
                            />
                        </div>
                    )}

                    {/* Preview Pane */}
                    {(viewMode === "preview" || viewMode === "split") && (
                        <div className={cn(
                            "flex flex-col overflow-hidden",
                            viewMode === "split" ? "w-1/2" : "w-full"
                        )}>
                            <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Live Preview</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#0d1117]">
                                <MathPreviewRenderer content={value} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Status Bar ── */}
                <div className="flex items-center justify-between px-4 py-1.5 bg-slate-50 dark:bg-[#161b22] border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
                    <span>
                        {(value || "").split("\n").length} lines · {(value || "").length} chars
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LaTeX enabled · Press <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-mono">?</kbd> Help
                    </span>
                </div>
            </div>
        </>
    );
}
