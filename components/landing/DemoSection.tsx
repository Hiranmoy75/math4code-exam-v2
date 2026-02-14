"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles, Bot, X, ArrowRight, Zap } from "lucide-react";
import { callGemini } from "@/components/landing/AIMentor";

// --- KaTeX Components (same as AIMentor) ---
const useKaTeX = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if ((window as any).katex) { setIsLoaded(true); return; }
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'; script.onload = () => setIsLoaded(true); document.head.appendChild(script);
    }, []);
    return isLoaded;
};

const LatexSpan = ({ content }: { content: string }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const katexLoaded = useKaTeX();
    useEffect(() => {
        if (katexLoaded && spanRef.current && (window as any).katex) {
            try { (window as any).katex.render(content, spanRef.current, { throwOnError: false, output: 'mathml' }); } catch (e) { spanRef.current.innerText = content; }
        }
    }, [content, katexLoaded]);
    if (!katexLoaded) return <span className="font-mono text-pink-600">{content}</span>;
    return <span ref={spanRef} className="mx-1" />;
};

// Helper to parse and render LaTeX in text
const renderMathText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\$[^\$]+\$)/g);
    return parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
            return <LatexSpan key={`math-${i}`} content={part.slice(1, -1)} />;
        }
        const latexPattern = /(\\frac\{[^}]+\}\{[^}]+\}|\\sqrt\{[^}]+\}|\\[a-zA-Z]+\{[^}]*\}|[a-zA-Z]\^[\{0-9]+\}?|[a-zA-Z]_[\{0-9]+\}?)/g;
        const subParts = part.split(latexPattern);
        return subParts.map((subPart, j) => {
            if (subPart && (subPart.includes('\\') || /[a-zA-Z][\^_]/.test(subPart))) {
                return <LatexSpan key={`math-${i}-${j}`} content={subPart} />;
            }
            return <span key={`text-${i}-${j}`}>{subPart}</span>;
        });
    });
};

export const DemoSection: React.FC = () => {
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mathProblem = `Find the derivative of f(x) = x³ + 2x² - 5x + 3`;
    const cacheKey = `ai-explanation-${mathProblem}`;

    const handleExplainMath = async () => {
        setIsModalOpen(true);
        const cachedExplanation = localStorage.getItem(cacheKey);
        if (cachedExplanation) {
            setExplanation(cachedExplanation);
            return;
        }
        setLoading(true);
        try {
            const response = await callGemini(
                `Explain how to solve this calculus problem step by step for a IIT-JAM, CSIR NET & GATE Mathematics student: ${mathProblem}. Use LaTeX notation for mathematical expressions (use $ for inline math and $$ for display math).`,
                "You are a mathematics tutor specializing in IIT-JAM, CSIR NET & GATE Mathematics preparation. Explain clearly and concisely using proper LaTeX notation for all mathematical expressions."
            );
            setExplanation(response);
            localStorage.setItem(cacheKey, response);
        } catch (e) {
            setExplanation("Could not load explanation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="demo" className="py-20 lg:py-24 bg-gradient-to-br from-white via-slate-50 to-green-50/30 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-100/20 to-emerald-100/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/20 to-teal-100/20 rounded-full blur-3xl -z-10" />

            <div className="max-w-container mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-full mb-6">
                            <Zap className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-slate-700">AI-Powered Learning</span>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
                            Instant <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-500">Step-by-Step</span> Solutions
                        </h2>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Get instant, detailed solutions to complex mathematical problems. Our AI mentor helps you understand concepts deeply, not just memorize formulas.
                        </p>

                        <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                            {[
                                { text: 'Instant step-by-step solutions', color: 'from-green-500 to-green-600' },
                                { text: 'Concept explanations tailored to your level', color: 'from-emerald-500 to-emerald-600' },
                                { text: 'Practice problems with detailed feedback', color: 'from-teal-500 to-teal-600' }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0`}>
                                        <Check size={14} strokeWidth={3} className="text-white" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/courses">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm md:text-base"
                            >
                                <span>Try Practice Problems</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Right - Math Problem Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative max-w-lg mx-auto"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border-2 border-slate-200">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <span className="text-2xl text-white">∫</span>
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Calculus Problem</div>
                                        <div className="text-green-100 text-xs">Differentiation</div>
                                    </div>
                                </div>
                                <div className="text-xs text-white bg-white/20 px-2.5 py-1 rounded-full font-semibold">Advanced</div>
                            </div>

                            <div className="p-5 text-slate-900">
                                {/* Problem Statement */}
                                <div className="mb-5">
                                    <div className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wide">Problem</div>
                                    <div className="bg-gradient-to-br from-slate-50 to-green-50 p-4 rounded-xl border-l-4 border-green-600">
                                        <div className="text-xs text-slate-600 mb-1.5">Find the derivative of</div>
                                        <div className="text-lg font-bold text-slate-900">
                                            <LatexSpan content="f(x) = x^3 + 2x^2 - 5x + 3" />
                                        </div>
                                    </div>
                                </div>

                                {/* AI Explain Button */}
                                <div className="mb-5">
                                    <button
                                        onClick={handleExplainMath}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-yellow-300" />}
                                        {loading ? "Analyzing..." : "Get AI Solution"}
                                    </button>
                                </div>

                                {/* Solution Preview */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                    <div className="text-xs font-bold text-green-800 mb-2.5 uppercase tracking-wide">Solution Preview</div>
                                    <div className="text-slate-700 space-y-2.5">
                                        <div className="flex items-start gap-2.5">
                                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <span className="text-xs">Apply power rule: <LatexSpan content="\frac{d}{dx}(x^n) = nx^{n-1}" /></span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <span className="text-xs font-semibold text-green-900"><LatexSpan content="f'(x) = 3x^2 + 4x - 5" /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="hidden md:block absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border-2 border-green-200 p-3 z-10"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">AI Powered</div>
                                    <div className="text-[10px] text-slate-500">Instant Help</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Solution Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-3xl max-h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <Bot size={24} className="text-white" />
                                    <div>
                                        <div className="text-white font-bold text-lg">AI Step-by-Step Solution</div>
                                        <div className="text-green-100 text-sm">Detailed Explanation</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={24} className="text-white" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 size={48} className="animate-spin text-green-600 mb-4" />
                                        <p className="text-slate-600">Generating detailed explanation...</p>
                                    </div>
                                ) : (
                                    <div className="prose prose-sm max-w-none text-slate-700">
                                        {renderMathText(explanation)}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
