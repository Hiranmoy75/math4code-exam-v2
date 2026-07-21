"use client";

import { MathJax } from "better-react-mathjax";
import { useEffect, useMemo, useRef } from "react";

interface MathPreviewRendererProps {
    content: string;
    className?: string;
}

// ─── Custom Block Definitions ────────────────────────────────────────────────
const BLOCKS: Record<string, { label: string; icon: string; className: string }> = {
    definition:  { label: "Definition",  icon: "📘", className: "math-block-definition" },
    theorem:     { label: "Theorem",     icon: "📐", className: "math-block-theorem" },
    lemma:       { label: "Lemma",       icon: "🔹", className: "math-block-lemma" },
    corollary:   { label: "Corollary",   icon: "🔸", className: "math-block-corollary" },
    proposition: { label: "Proposition", icon: "💡", className: "math-block-proposition" },
    proof:       { label: "Proof",       icon: "✍️", className: "math-block-proof" },
    example:     { label: "Example",     icon: "✏️", className: "math-block-example" },
    question:    { label: "Question",    icon: "❓", className: "math-block-question" },
    answer:      { label: "Answer",      icon: "✅", className: "math-block-answer" },
    note:        { label: "Note",        icon: "📝", className: "math-block-note" },
    warning:     { label: "Warning",     icon: "⚠️", className: "math-block-warning" },
    remark:      { label: "Remark",      icon: "💬", className: "math-block-remark" },
};

// ─── Math-safe inline markdown ────────────────────────────────────────────────
function inlineMarkdownSafe(text: string): string {
    const tokens: string[] = [];

    let s = text;
    // Protect display math $$...$$
    s = s.replace(/\$\$([^$]+?)\$\$/g, (m) => { tokens.push(m); return `\x00M${tokens.length - 1}\x00`; });
    // Protect inline math $...$
    s = s.replace(/\$([^$\n]+?)\$/g, (m) => { tokens.push(m); return `\x00M${tokens.length - 1}\x00`; });
    // Protect \[...\]
    s = s.replace(/\\\[[\s\S]+?\\\]/g, (m) => { tokens.push(m); return `\x00M${tokens.length - 1}\x00`; });
    // Protect \(...\)
    s = s.replace(/\\\([\s\S]+?\\\)/g, (m) => { tokens.push(m); return `\x00M${tokens.length - 1}\x00`; });

    // Inline images ![alt](url) — before links
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
        (_, alt, src) => `<img src="${src}" alt="${alt}" class="math-img-inline" loading="lazy" />`);

    // Markdown transforms
    s = s
        .replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*\n]+?)\*/g, "<em>$1</em>")
        .replace(/__([^_]+?)__/g, "<strong>$1</strong>")
        .replace(/_([^_\n]+?)_/g, "<em>$1</em>")
        .replace(/~~([^~]+?)~~/g, "<del>$1</del>")
        .replace(/`([^`]+?)`/g, '<code class="math-inline-code">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="math-link">$1</a>');

    // Restore math
    s = s.replace(/\x00M(\d+)\x00/g, (_, i) => tokens[parseInt(i)]);
    return s;
}

// ─── Block body processor ─────────────────────────────────────────────────────
// Handles multi-line content inside \definition{...} etc.
function processBlockBody(raw: string): string {
    const lines = raw.split("\n");
    let html = "";
    let inDisplay = false;
    let displayBuf = "";

    for (const line of lines) {
        const t = line.trim();

        // Toggle for multi-line $$ ... $$
        if (t === "$$") {
            if (!inDisplay) {
                inDisplay = true;
                displayBuf = "$$\n";
            } else {
                inDisplay = false;
                displayBuf += "$$";
                html += `<div class="math-display-wrap">${displayBuf}</div>`;
                displayBuf = "";
            }
            continue;
        }
        if (inDisplay) { displayBuf += line + "\n"; continue; }

        // Single-line $$...$$ on one line
        if (t.startsWith("$$") && t.endsWith("$$") && t.length > 4) {
            html += `<div class="math-display-wrap">${t}</div>`;
            continue;
        }

        if (t === "") { html += "<br>"; continue; }

        html += `<p class="math-block-line">${inlineMarkdownSafe(line)}</p>`;
    }

    // Flush any unclosed display block
    if (inDisplay) html += `<div class="math-display-wrap">${displayBuf}</div>`;

    return html;
}

// ─── Balanced brace extractor ─────────────────────────────────────────────────
function extractBraceContent(text: string, startIdx: number): { content: string; endIdx: number } | null {
    if (text[startIdx] !== "{") return null;
    let depth = 0, i = startIdx, content = "";
    while (i < text.length) {
        const ch = text[i];
        if (ch === "{") { depth++; if (depth > 1) content += ch; }
        else if (ch === "}") { depth--; if (depth === 0) return { content, endIdx: i }; else content += ch; }
        else content += ch;
        i++;
    }
    return null;
}

function escapeHtml(t: string): string {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ─── Full document parser ─────────────────────────────────────────────────────
function renderBlockImage(src: string, alt: string, caption?: string): string {
    const capHtml = (caption || alt)
        ? `<figcaption class="math-img-caption">${escapeHtml(caption || alt)}</figcaption>`
        : "";
    return `<figure class="math-img-block"><img src="${src}" alt="${escapeHtml(alt)}" class="math-img" loading="lazy" />${capHtml}</figure>`;
}

function parseContent(raw: string): string {
    if (!raw || !raw.trim()) return "";

    // Pass 1a ── \image{url} and \image{url}{caption}
    let processed = raw;
    processed = processed.replace(
        /\\image\{([^}]+)\}(?:\{([^}]*)\})?/g,
        (_, src, caption) => `\n${renderBlockImage(src.trim(), caption || "", caption?.trim())}\n`
    );

    // Pass 1b ── replace \blockname{...} with styled HTML divs
    for (const [cmd, meta] of Object.entries(BLOCKS)) {
        const re = new RegExp(`\\\\${cmd}\\{`, "g");
        let result = "", lastIdx = 0, match: RegExpExecArray | null;
        re.lastIndex = 0;
        while ((match = re.exec(processed)) !== null) {
            const braceStart = match.index + match[0].length - 1;
            const extracted = extractBraceContent(processed, braceStart);
            if (!extracted) continue;
            result += processed.slice(lastIdx, match.index);
            result += `\n<div class="math-block ${meta.className}"><div class="math-block-header"><span class="math-block-icon">${meta.icon}</span><span class="math-block-label">${meta.label}</span></div><div class="math-block-body">${processBlockBody(extracted.content)}</div></div>\n`;
            lastIdx = extracted.endIdx + 1;
            re.lastIndex = lastIdx;
        }
        result += processed.slice(lastIdx);
        processed = result;
    }

    // Pass 2 ── line-by-line markdown for remaining text
    const lines = processed.split("\n");
    const out: string[] = [];
    let inCode = false, codeBuf = "", codeLang = "";
    let inList = false, listType = "", listItems: string[] = [];

    const flushList = () => {
        if (!inList) return;
        const tag = listType === "ol" ? "ol" : "ul";
        out.push(`<${tag} class="math-list math-${tag}">${listItems.map(li => `<li>${inlineMarkdownSafe(li)}</li>`).join("")}</${tag}>`);
        listItems = []; inList = false; listType = "";
    };

    for (const line of lines) {
        // Already-rendered HTML blocks / figures pass through
        if (line.startsWith('<div class="math-block') ||
            line.startsWith('<figure class="math-img')) { flushList(); out.push(line); continue; }

        // Code fences
        if (line.startsWith("```")) {
            flushList();
            if (!inCode) { inCode = true; codeLang = line.slice(3).trim(); codeBuf = ""; }
            else { inCode = false; out.push(`<pre class="math-code-block"><code class="lang-${codeLang}">${escapeHtml(codeBuf.trim())}</code></pre>`); codeBuf = ""; codeLang = ""; }
            continue;
        }
        if (inCode) { codeBuf += line + "\n"; continue; }

        // Horizontal rule
        if (/^(---+|===+|\*\*\*+)\s*$/.test(line)) { flushList(); out.push('<hr class="math-hr" />'); continue; }

        // Headings
        const hm = line.match(/^(#{1,6})\s+(.+)/);
        if (hm) {
            flushList();
            const lvl = hm[1].length;
            out.push(`<h${lvl} class="math-h${lvl}">${inlineMarkdownSafe(hm[2])}</h${lvl}>`);
            continue;
        }

        // Standalone block image: ![alt](url) on its own line
        const imgBlock = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgBlock) {
            flushList();
            out.push(renderBlockImage(imgBlock[2], imgBlock[1]));
            continue;
        }

        // Blockquote
        if (line.startsWith("> ")) { flushList(); out.push(`<blockquote class="math-blockquote">${inlineMarkdownSafe(line.slice(2))}</blockquote>`); continue; }

        // Display math block (standalone $$ line)
        if (line.trim().startsWith("$$")) {
            flushList();
            out.push(`<div class="math-display-wrap">${line.trim()}</div>`);
            continue;
        }

        // Unordered list
        const ulm = line.match(/^[\-\*\+]\s+(.+)/);
        if (ulm) { if (inList && listType !== "ul") flushList(); inList = true; listType = "ul"; listItems.push(ulm[1]); continue; }

        // Ordered list
        const olm = line.match(/^\d+\.\s+(.+)/);
        if (olm) { if (inList && listType !== "ol") flushList(); inList = true; listType = "ol"; listItems.push(olm[1]); continue; }

        // Empty line
        if (line.trim() === "") { flushList(); out.push('<div class="math-spacer"></div>'); continue; }

        // Non-list line after list
        if (inList) flushList();

        // Regular paragraph
        out.push(`<p class="math-p">${inlineMarkdownSafe(line)}</p>`);
    }

    flushList();
    return out.join("\n");
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MathPreviewRenderer({ content, className = "" }: MathPreviewRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const htmlContent = useMemo(() => parseContent(content), [content]);

    // Explicitly re-typeset MathJax after DOM updates
    useEffect(() => {
        if (!containerRef.current || typeof window === "undefined") return;
        const win = window as any;
        if (win.MathJax?.typesetPromise) {
            // Clear old typesetting first, then re-run
            win.MathJax.typesetClear?.([containerRef.current]);
            win.MathJax.typesetPromise?.([containerRef.current]).catch(() => {});
        }
    }, [htmlContent]);

    if (!content || !content.trim()) {
        return (
            <div className={`math-preview-empty ${className}`}>
                <p>Preview will appear here as you type…</p>
            </div>
        );
    }

    return (
        <MathJax dynamic>
            <div
                ref={containerRef}
                className={`math-preview-root ${className}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            <style>{`
                /* ── Root ─────────────────────────────────── */
                .math-preview-root {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    font-size: 1.05rem;
                    line-height: 1.9;
                    color: #1e293b;
                    max-width: 100%;
                }
                .dark .math-preview-root { color: #e2e8f0; }

                /* ── Typography ───────────────────────────── */
                .math-h1 { font-size: 2rem; font-weight: 800; margin: 1.5rem 0 0.75rem; color: #0f172a; border-bottom: 3px solid #6366f1; padding-bottom: 0.3rem; }
                .math-h2 { font-size: 1.6rem; font-weight: 700; margin: 1.25rem 0 0.6rem; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.2rem; }
                .math-h3 { font-size: 1.3rem; font-weight: 700; margin: 1rem 0 0.4rem; color: #334155; }
                .math-h4 { font-size: 1.1rem; font-weight: 600; margin: 0.8rem 0 0.3rem; color: #475569; }
                .math-h5, .math-h6 { font-size: 1rem; font-weight: 600; margin: 0.6rem 0 0.25rem; color: #64748b; }
                .dark .math-h1 { color: #f1f5f9; border-color: #818cf8; }
                .dark .math-h2 { color: #e2e8f0; border-color: #334155; }
                .dark .math-h3 { color: #cbd5e1; }
                .dark .math-h4, .dark .math-h5, .dark .math-h6 { color: #94a3b8; }

                .math-p { margin: 0.4rem 0; }
                .math-spacer { height: 0.6rem; }
                .math-hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.5rem 0; }
                .dark .math-hr { border-color: #334155; }

                .math-link { color: #6366f1; text-decoration: underline; }
                .math-link:hover { color: #4f46e5; }

                .math-inline-code {
                    background: #f1f5f9; color: #7c3aed;
                    padding: 0.1em 0.4em; border-radius: 4px;
                    font-family: monospace; font-size: 0.9em;
                }
                .dark .math-inline-code { background: #1e293b; color: #a78bfa; }

                .math-code-block {
                    background: #0f172a; color: #e2e8f0;
                    padding: 1.25rem 1.5rem; border-radius: 0.75rem;
                    overflow-x: auto; margin: 1rem 0;
                    font-family: 'Fira Code', 'Cascadia Code', monospace;
                    font-size: 0.9rem; line-height: 1.7;
                }

                .math-blockquote {
                    border-left: 4px solid #6366f1; background: #eef2ff;
                    padding: 0.75rem 1.25rem; margin: 1rem 0;
                    border-radius: 0 0.5rem 0.5rem 0;
                    color: #3730a3; font-style: italic;
                }
                .dark .math-blockquote { background: #1e1b4b; color: #a5b4fc; border-color: #818cf8; }

                /* ── Images ──────────────────────────────── */
                .math-img-block {
                    margin: 1.5rem 0;
                    text-align: center;
                }
                .math-img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
                    display: inline-block;
                }
                .math-img-caption {
                    margin-top: 0.5rem;
                    font-size: 0.875rem;
                    color: #64748b;
                    font-style: italic;
                    font-family: system-ui, sans-serif;
                }
                .dark .math-img-caption { color: #94a3b8; }
                .math-img-inline {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.4rem;
                    vertical-align: middle;
                    margin: 0 0.25rem;
                }

                /* ── Display math wrapper ─────────────────── */
                .math-display-wrap {
                    overflow-x: auto;
                    padding: 0.5rem 0;
                    text-align: center;
                }

                /* ── Lists ────────────────────────────────── */
                .math-list { padding-left: 1.75rem; margin: 0.5rem 0; }
                .math-ul { list-style: disc; }
                .math-ol { list-style: decimal; }
                .math-list li { margin-bottom: 0.3rem; }

                /* ── Math Blocks ──────────────────────────── */
                .math-block {
                    border-radius: 0.75rem; margin: 1.25rem 0;
                    overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.07);
                }
                .math-block-header {
                    display: flex; align-items: center; gap: 0.5rem;
                    padding: 0.55rem 1rem;
                    font-weight: 700; font-size: 0.8rem;
                    letter-spacing: 0.06em; text-transform: uppercase;
                    font-family: system-ui, sans-serif;
                }
                .math-block-icon { font-size: 1rem; }
                .math-block-body {
                    padding: 0.9rem 1.25rem;
                    font-size: 1rem; line-height: 1.8;
                }
                .math-block-line { margin: 0.2rem 0; }

                /* Definition — Blue */
                .math-block-definition { border-left: 5px solid #3b82f6; background: #eff6ff; }
                .math-block-definition .math-block-header { background: #dbeafe; color: #1d4ed8; }
                .math-block-definition .math-block-body { color: #1e3a8a; }
                .dark .math-block-definition { background: #172554; border-color: #60a5fa; }
                .dark .math-block-definition .math-block-header { background: #1e3a8a; color: #93c5fd; }
                .dark .math-block-definition .math-block-body { color: #bfdbfe; }

                /* Theorem — Purple */
                .math-block-theorem { border-left: 5px solid #8b5cf6; background: #f5f3ff; }
                .math-block-theorem .math-block-header { background: #ede9fe; color: #6d28d9; }
                .math-block-theorem .math-block-body { color: #4c1d95; }
                .dark .math-block-theorem { background: #2e1065; border-color: #a78bfa; }
                .dark .math-block-theorem .math-block-header { background: #4c1d95; color: #c4b5fd; }
                .dark .math-block-theorem .math-block-body { color: #ddd6fe; }

                /* Lemma — Violet */
                .math-block-lemma { border-left: 5px solid #7c3aed; background: #f5f3ff; }
                .math-block-lemma .math-block-header { background: #ede9fe; color: #5b21b6; }
                .math-block-lemma .math-block-body { color: #3b0764; }
                .dark .math-block-lemma { background: #1e1b4b; border-color: #a78bfa; }
                .dark .math-block-lemma .math-block-header { background: #3730a3; color: #c4b5fd; }
                .dark .math-block-lemma .math-block-body { color: #ddd6fe; }

                /* Corollary — Fuchsia */
                .math-block-corollary { border-left: 5px solid #a21caf; background: #fdf4ff; }
                .math-block-corollary .math-block-header { background: #fae8ff; color: #86198f; }
                .math-block-corollary .math-block-body { color: #4a044e; }
                .dark .math-block-corollary { background: #2d1f3a; border-color: #e879f9; }
                .dark .math-block-corollary .math-block-header { background: #4a044e; color: #f0abfc; }
                .dark .math-block-corollary .math-block-body { color: #f5d0fe; }

                /* Proposition — Indigo */
                .math-block-proposition { border-left: 5px solid #4f46e5; background: #eef2ff; }
                .math-block-proposition .math-block-header { background: #e0e7ff; color: #3730a3; }
                .math-block-proposition .math-block-body { color: #1e1b4b; }
                .dark .math-block-proposition { background: #1e1b4b; border-color: #818cf8; }
                .dark .math-block-proposition .math-block-header { background: #312e81; color: #a5b4fc; }
                .dark .math-block-proposition .math-block-body { color: #e0e7ff; }

                /* Proof — Gray/Slate */
                .math-block-proof { border-left: 5px solid #64748b; background: #f8fafc; }
                .math-block-proof .math-block-header { background: #f1f5f9; color: #334155; }
                .math-block-proof .math-block-body { color: #1e293b; font-style: italic; }
                .dark .math-block-proof { background: #1e293b; border-color: #94a3b8; }
                .dark .math-block-proof .math-block-header { background: #0f172a; color: #94a3b8; }
                .dark .math-block-proof .math-block-body { color: #cbd5e1; }

                /* Example — Green */
                .math-block-example { border-left: 5px solid #16a34a; background: #f0fdf4; }
                .math-block-example .math-block-header { background: #dcfce7; color: #15803d; }
                .math-block-example .math-block-body { color: #14532d; }
                .dark .math-block-example { background: #052e16; border-color: #4ade80; }
                .dark .math-block-example .math-block-header { background: #14532d; color: #86efac; }
                .dark .math-block-example .math-block-body { color: #bbf7d0; }

                /* Question — Orange */
                .math-block-question { border-left: 5px solid #ea580c; background: #fff7ed; }
                .math-block-question .math-block-header { background: #ffedd5; color: #c2410c; }
                .math-block-question .math-block-body { color: #7c2d12; }
                .dark .math-block-question { background: #2c1206; border-color: #fb923c; }
                .dark .math-block-question .math-block-header { background: #431407; color: #fdba74; }
                .dark .math-block-question .math-block-body { color: #fed7aa; }

                /* Answer — Teal */
                .math-block-answer { border-left: 5px solid #0d9488; background: #f0fdfa; }
                .math-block-answer .math-block-header { background: #ccfbf1; color: #0f766e; }
                .math-block-answer .math-block-body { color: #134e4a; }
                .dark .math-block-answer { background: #042f2e; border-color: #2dd4bf; }
                .dark .math-block-answer .math-block-header { background: #134e4a; color: #5eead4; }
                .dark .math-block-answer .math-block-body { color: #99f6e4; }

                /* Note — Amber */
                .math-block-note { border-left: 5px solid #d97706; background: #fffbeb; }
                .math-block-note .math-block-header { background: #fef3c7; color: #b45309; }
                .math-block-note .math-block-body { color: #78350f; }
                .dark .math-block-note { background: #1c1004; border-color: #fbbf24; }
                .dark .math-block-note .math-block-header { background: #451a03; color: #fcd34d; }
                .dark .math-block-note .math-block-body { color: #fde68a; }

                /* Warning — Red */
                .math-block-warning { border-left: 5px solid #dc2626; background: #fef2f2; }
                .math-block-warning .math-block-header { background: #fee2e2; color: #b91c1c; }
                .math-block-warning .math-block-body { color: #7f1d1d; }
                .dark .math-block-warning { background: #2d0a0a; border-color: #f87171; }
                .dark .math-block-warning .math-block-header { background: #450a0a; color: #fca5a5; }
                .dark .math-block-warning .math-block-body { color: #fecaca; }

                /* Remark — Sky */
                .math-block-remark { border-left: 5px solid #0284c7; background: #f0f9ff; }
                .math-block-remark .math-block-header { background: #e0f2fe; color: #0369a1; }
                .math-block-remark .math-block-body { color: #0c4a6e; }
                .dark .math-block-remark { background: #082f49; border-color: #38bdf8; }
                .dark .math-block-remark .math-block-header { background: #0c4a6e; color: #7dd3fc; }
                .dark .math-block-remark .math-block-body { color: #bae6fd; }

                /* ── Empty state ──────────────────────────── */
                .math-preview-empty {
                    display: flex; align-items: center; justify-content: center;
                    height: 100%; color: #94a3b8;
                    font-style: italic; font-size: 0.95rem;
                }
            `}</style>
        </MathJax>
    );
}
