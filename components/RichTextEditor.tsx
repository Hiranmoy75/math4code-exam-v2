"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MathPreviewRenderer } from "@/components/MathPreviewRenderer";
import {
    Bold, Italic, Strikethrough, Code, Link as LinkIcon,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Minus, Undo, Redo,
    Eye, PenLine, Columns2, ChevronDown, Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

type ViewMode = "split" | "editor" | "preview";

// ─── Toolbar Config ───────────────────────────────────────────────────────────

const MATH_BLOCKS = [
    { cmd: "\\definition{}", label: "Definition", icon: "📘", offset: 12 },
    { cmd: "\\theorem{}", label: "Theorem", icon: "📐", offset: 9 },
    { cmd: "\\lemma{}", label: "Lemma", icon: "🔹", offset: 7 },
    { cmd: "\\corollary{}", label: "Corollary", icon: "🔸", offset: 11 },
    { cmd: "\\proposition{}", label: "Proposition", icon: "💡", offset: 13 },
    { cmd: "\\proof{}", label: "Proof", icon: "✍️", offset: 7 },
    { cmd: "\\example{}", label: "Example", icon: "✏️", offset: 9 },
    { cmd: "\\question{}", label: "Question", icon: "❓", offset: 10 },
    { cmd: "\\answer{}", label: "Answer", icon: "✅", offset: 8 },
    { cmd: "\\note{}", label: "Note", icon: "📝", offset: 6 },
    { cmd: "\\warning{}", label: "Warning", icon: "⚠️", offset: 9 },
    { cmd: "\\remark{}", label: "Remark", icon: "💬", offset: 8 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("split");
    const [showBlockMenu, setShowBlockMenu] = useState(false);
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
    const insertText = useCallback((before: string, after: string = "", placeholder: string = "") => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = ta.value.slice(start, end) || placeholder;
        const newVal = ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
        onChange(newVal);
        // Restore cursor
        requestAnimationFrame(() => {
            ta.focus();
            const newCursor = start + before.length + selected.length + after.length;
            const selectStart = start + before.length;
            ta.setSelectionRange(selectStart, selectStart + selected.length);
        });
    }, [onChange]);

    const insertBlock = useCallback((prefix: string) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const currentLine = ta.value.lastIndexOf("\n", start - 1) + 1;
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

        // Tab → indent
        if (e.key === "Tab") {
            e.preventDefault();
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const newVal = ta.value.slice(0, start) + "  " + ta.value.slice(end);
            onChange(newVal);
            requestAnimationFrame(() => {
                ta.setSelectionRange(start + 2, start + 2);
            });
            return;
        }

        // Ctrl/Cmd shortcuts
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
        // Use markdown syntax: ![caption](url)
        const insertion = `${prefix}![${caption}](${url})\n`;
        const newVal = ta.value.slice(0, start) + insertion + ta.value.slice(start);
        onChange(newVal);
        requestAnimationFrame(() => { ta.focus(); });
    }, [onChange]);

    // ─── Toolbar Buttons ───────────────────────────────────────────────────────────
    const TB = ({ onClick, icon, title, className: cls = "" }: { onClick: () => void; icon: React.ReactNode; title: string; className?: string }) => (
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

    const mathSyntaxHelp = `KEYBOARD SHORTCUTS
Ctrl+B → **bold**   Ctrl+I → *italic*   Ctrl+K → [link](url)   Tab → indent

MATH SYNTAX
Inline math:   $E = mc^2$
Display math:  $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

CUSTOM BOXES (available from toolbar ↑)
\\definition{A set is a well-defined collection of objects}
\\theorem{If $n$ is even, then $n^2$ is even}
\\example{Find the derivative of $f(x) = x^3$}
\\question{Prove that $\\sqrt{2}$ is irrational}
\\answer{Assume $\\sqrt{2} = p/q$...}
\\note{This result generalizes to $\\mathbb{R}^n$}

IMAGES
![Caption](https://url-to-image.jpg)   — block image with caption
\\image{url}{caption}                   — same, custom syntax

MARKDOWN
# Heading 1   ## Heading 2   ### Heading 3
**bold**   *italic*   ~~strikethrough~~   \`inline code\`
- bullet   1. numbered list   > blockquote
\`\`\`python ... \`\`\`   ---  (horizontal rule)`;

    return (
        <div className={cn("flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#0d1117]", className)}>

            {/* ── Toolbar ── */}
            <div className="flex items-center gap-0.5 px-3 py-1.5 bg-slate-50 dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-700 flex-wrap min-h-[44px]">

                {/* Undo / Redo (cosmetic — textarea has native undo) */}
                <TB onClick={() => document.execCommand("undo")} icon={<Undo className="h-3.5 w-3.5" />} title="Undo (Ctrl+Z)" />
                <TB onClick={() => document.execCommand("redo")} icon={<Redo className="h-3.5 w-3.5" />} title="Redo (Ctrl+Y)" />
                <Divider />

                {/* Headings */}
                <TB onClick={() => insertBlock("# ")} icon={<Heading1 className="h-3.5 w-3.5" />} title="Heading 1" />
                <TB onClick={() => insertBlock("## ")} icon={<Heading2 className="h-3.5 w-3.5" />} title="Heading 2" />
                <TB onClick={() => insertBlock("### ")} icon={<Heading3 className="h-3.5 w-3.5" />} title="Heading 3" />
                <Divider />

                {/* Inline formatting */}
                <TB onClick={() => insertText("**", "**", "bold")} icon={<Bold className="h-3.5 w-3.5" />} title="Bold (Ctrl+B)" />
                <TB onClick={() => insertText("*", "*", "italic")} icon={<Italic className="h-3.5 w-3.5" />} title="Italic (Ctrl+I)" />
                <TB onClick={() => insertText("~~", "~~", "strikethrough")} icon={<Strikethrough className="h-3.5 w-3.5" />} title="Strikethrough" />
                <TB onClick={() => insertText("`", "`", "code")} icon={<Code className="h-3.5 w-3.5" />} title="Inline Code" />
                <TB onClick={() => insertText("[", "](url)", "link text")} icon={<LinkIcon className="h-3.5 w-3.5" />} title="Link (Ctrl+K)" />
                <Divider />

                {/* Lists */}
                <TB onClick={() => insertBlock("- ")} icon={<List className="h-3.5 w-3.5" />} title="Bullet List" />
                <TB onClick={() => insertBlock("1. ")} icon={<ListOrdered className="h-3.5 w-3.5" />} title="Numbered List" />
                <TB onClick={() => insertBlock("> ")} icon={<Quote className="h-3.5 w-3.5" />} title="Blockquote" />
                <TB onClick={() => insertBlock("\n---\n")} icon={<Minus className="h-3.5 w-3.5" />} title="Horizontal Rule" />
                <Divider />

                {/* Image */}
                <TB
                    onClick={insertImage}
                    icon={<ImageIcon className="h-3.5 w-3.5 text-emerald-600" />}
                    title="Insert Image"
                />
                <Divider />

                {/* Math */}
                <TB
                    onClick={() => insertText("$", "$", "E = mc^2")}
                    icon={<span className="font-serif text-xs font-bold text-indigo-600">∑</span>}
                    title="Inline Math: $...$"
                />
                <TB
                    onClick={() => insertBlock("\n$$\n") }
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
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 transition-all"
                    >
                        📦 Math Blocks
                        <ChevronDown className="h-3 w-3" />
                    </button>
                    {showBlockMenu && (
                        <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 min-w-[220px] grid grid-cols-2 gap-1">
                            {MATH_BLOCKS.map((blk) => (
                                <button
                                    key={blk.cmd}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => insertMathBlock(blk.cmd, blk.offset)}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-all"
                                >
                                    <span>{blk.icon}</span>
                                    <span>{blk.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

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
                            {mode === "editor" && <PenLine className="h-3 w-3" />}
                            {mode === "split" && <Columns2 className="h-3 w-3" />}
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
                            <button
                                type="button"
                                title={mathSyntaxHelp}
                                className="text-xs text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 font-medium px-1.5 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
                            >
                                ? Syntax Help
                            </button>
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
                                "scrollbar-thin",
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
                    LaTeX enabled
                </span>
            </div>
        </div>
    );
}
