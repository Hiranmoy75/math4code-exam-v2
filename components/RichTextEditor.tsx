"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Bold, Italic, List, ListOrdered, Palette, Underline, Link as LinkIcon,
    Heading1, Heading2, Heading3, Strikethrough, Quote, Minus,
    AlignLeft, AlignCenter, AlignRight, Type, Eraser, Code, Image as ImageIcon,
    Undo, Redo, Table as TableIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Initialize content
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            if (value !== editorRef.current.innerHTML) {
                editorRef.current.innerHTML = value || "";
            }
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            onChange(html === "<br>" ? "" : html);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
        document.execCommand(command, false, value);
        handleInput();
    };

    const addLink = () => {
        const url = window.prompt("Enter the URL:");
        if (url) {
            execCommand("createLink", url);
        }
    };

    const addImage = () => {
        const url = window.prompt("Enter the Image URL:");
        if (url) {
            execCommand("insertImage", url);
            // Post-insertion cleanup
            setTimeout(() => {
                if (editorRef.current) {
                    const imgs = editorRef.current.getElementsByTagName('img');
                    for (let i = 0; i < imgs.length; i++) {
                        if (!imgs[i].classList.contains('prose-img')) {
                            imgs[i].classList.add('prose-img');
                        }
                    }
                    handleInput();
                }
            }, 50);
        }
    };

    const addTable = () => {
        const rows = window.prompt("Number of rows:", "3");
        const cols = window.prompt("Number of columns:", "3");
        if (rows && cols) {
            let tableHtml = '<table class="prose-table"><tbody>';
            for (let i = 0; i < parseInt(rows); i++) {
                tableHtml += '<tr>';
                for (let j = 0; j < parseInt(cols); j++) {
                    tableHtml += '<td>Cell</td>';
                }
                tableHtml += '</tr>';
            }
            tableHtml += '</tbody></table><p></p>';
            execCommand("insertHTML", tableHtml);
        }
    };

    return (
        <div className={cn("flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden", className)}>
            {/* Professional Writing Toolbar */}
            <div className="sticky top-0 z-30 flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 flex-wrap">

                <div className="flex items-center gap-0.5 mr-2">
                    <ToolbarButton onClick={() => execCommand("undo")} icon={<Undo className="h-4 w-4" />} title="Undo" />
                    <ToolbarButton onClick={() => execCommand("redo")} icon={<Redo className="h-4 w-4" />} title="Redo" />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 mr-2" />

                <div className="flex items-center gap-0.5 mr-2">
                    <ToolbarButton onClick={() => execCommand("formatBlock", "H1")} icon={<Heading1 className="h-4 w-4" />} title="H1" />
                    <ToolbarButton onClick={() => execCommand("formatBlock", "H2")} icon={<Heading2 className="h-4 w-4" />} title="H2" />
                    <ToolbarButton onClick={() => execCommand("formatBlock", "H3")} icon={<Heading3 className="h-4 w-4" />} title="H3" />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 mr-2" />

                <div className="flex items-center gap-0.5 mr-2">
                    <ToolbarButton onClick={() => execCommand("bold")} icon={<Bold className="h-4 w-4" />} title="Bold" />
                    <ToolbarButton onClick={() => execCommand("italic")} icon={<Italic className="h-4 w-4" />} title="Italic" />
                    <ToolbarButton onClick={() => execCommand("underline")} icon={<Underline className="h-4 w-4" />} title="Underline" />
                    <ToolbarButton onClick={() => execCommand("inverse")} icon={<Strikethrough className="h-4 w-4" />} title="Strikethrough" />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 mr-2" />

                <div className="flex items-center gap-0.5 mr-2 text-green-600">
                    <ToolbarButton onClick={() => execCommand("insertUnorderedList")} icon={<List className="h-4 w-4" />} title="Bullet List" />
                    <ToolbarButton onClick={() => execCommand("insertOrderedList")} icon={<ListOrdered className="h-4 w-4" />} title="Numbered List" />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 mr-2" />

                <div className="flex items-center gap-0.5 mr-2">
                    <ToolbarButton onClick={() => execCommand("justifyLeft")} icon={<AlignLeft className="h-4 w-4" />} title="Align Left" />
                    <ToolbarButton onClick={() => execCommand("justifyCenter")} icon={<AlignCenter className="h-4 w-4" />} title="Align Center" />
                    <ToolbarButton onClick={() => execCommand("justifyRight")} icon={<AlignRight className="h-4 w-4" />} title="Align Right" />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 mr-2" />

                <div className="flex items-center gap-0.5 mr-2">
                    <ToolbarButton onClick={addImage} icon={<ImageIcon className="h-4 w-4 text-blue-600" />} title="Insert Image" />
                    <ToolbarButton onClick={addTable} icon={<TableIcon className="h-4 w-4 text-purple-600" />} title="Insert Table" />
                    <ToolbarButton onClick={addLink} icon={<LinkIcon className="h-4 w-4" />} title="Add Link" />
                    <ToolbarButton onClick={() => execCommand("formatBlock", "blockquote")} icon={<Quote className="h-4 w-4" />} title="Quote" />
                    <ToolbarButton onClick={() => execCommand("insertHorizontalRule")} icon={<Minus className="h-4 w-4" />} title="Divider" />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 mr-2" />

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 border-r pr-3">
                        <Palette className="h-4 w-4 text-slate-400" />
                        <input
                            type="color"
                            className="h-6 w-6 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                            onChange={(e) => execCommand("foreColor", e.target.value)}
                            title="Text Color"
                        />
                    </div>
                    <ToolbarButton onClick={() => execCommand("removeFormat")} icon={<Eraser className="h-4 w-4" />} title="Clear Formatting" />
                </div>
            </div>

            {/* Premium Content Area */}
            <div className="flex-1 bg-white overflow-y-auto min-h-[700px] flex justify-center py-16 px-8 cursor-text" onClick={() => editorRef.current?.focus()}>
                <div
                    ref={editorRef}
                    className="max-w-[780px] w-full outline-none prose prose-slate lg:prose-xl dark:prose-invert blog-editor-canvas"
                    contentEditable
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    data-placeholder={placeholder}
                />
            </div>

            <style jsx global>{`
                /* Editor Placeholder */
                .blog-editor-canvas:empty:before {
                    content: attr(data-placeholder);
                    color: #94a3b8;
                    font-style: italic;
                    pointer-events: none;
                }
                
                /* Editor Canvas Styles - Bulletproof Fixes */
                .blog-editor-canvas {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                    line-height: 1.8;
                    font-size: 1.125rem;
                }

                .blog-editor-canvas h1 { font-size: 2.5rem !important; font-weight: 800 !important; margin: 2rem 0 1rem !important; line-height: 1.2 !important; }
                .blog-editor-canvas h2 { font-size: 2rem !important; font-weight: 700 !important; margin: 1.5rem 0 0.75rem !important; }
                .blog-editor-canvas h3 { font-size: 1.5rem !important; font-weight: 600 !important; margin: 1.25rem 0 0.5rem !important; }
                .blog-editor-canvas p { margin-bottom: 1.5rem !important; }

                /* List Support */
                .blog-editor-canvas ul, .blog-editor-canvas ol {
                    margin-bottom: 1.5rem !important;
                    padding-left: 2rem !important;
                }
                .blog-editor-canvas ul { list-style-type: disc !important; }
                .blog-editor-canvas ol { list-style-type: decimal !important; }
                .blog-editor-canvas li { 
                    display: list-item !important; 
                    margin-bottom: 0.5rem !important; 
                    list-style: inherit !important;
                }

                /* Blockquote */
                .blog-editor-canvas blockquote {
                    border-left: 5px solid #22c55e !important;
                    padding: 1.5rem 2rem !important;
                    margin: 2.5rem 0 !important;
                    background: #f0fdf4 !important;
                    font-style: italic !important;
                    border-radius: 0 0.75rem 0.75rem 0 !important;
                    color: #166534 !important;
                }

                /* Images */
                .prose-img {
                    max-width: 100% !important;
                    height: auto !important;
                    border-radius: 1rem !important;
                    margin: 2.5rem 0 !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                    display: block !important;
                }

                /* Tables */
                .prose-table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                    margin: 2rem 0 !important;
                }
                .prose-table td {
                    border: 1px solid #e2e8f0 !important;
                    padding: 0.75rem !important;
                    min-width: 80px !important;
                }

                /* Horizontal Rule */
                .blog-editor-canvas hr {
                    border: 0 !important;
                    border-top: 2px solid #f1f5f9 !important;
                    margin: 3rem 0 !important;
                }

                /* Code */
                .blog-editor-canvas pre {
                    background: #0f172a !important;
                    color: #f8fafc !important;
                    padding: 1.5rem !important;
                    border-radius: 0.75rem !important;
                    overflow-x: auto !important;
                    margin: 1.5rem 0 !important;
                    font-family: monospace !important;
                }
                
                /* Selection Color */
                .blog-editor-canvas ::selection {
                    background: #dcfce7 !important;
                    color: #166534 !important;
                }
            `}</style>
        </div>
    );
}

function ToolbarButton({ onClick, icon, title }: { onClick: () => void; icon: React.ReactNode; title: string }) {
    return (
        <Button
            variant="ghost"
            size="sm"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className="h-10 w-10 p-0 rounded-lg hover:bg-white hover:shadow-sm text-slate-500 hover:text-slate-900 transition-all"
            title={title}
        >
            {icon}
        </Button>
    );
}
