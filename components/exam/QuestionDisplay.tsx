"use client"

import React, { memo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { renderWithLatex } from "@/lib/renderWithLatex"
import { Flag, BookOpen } from "lucide-react"

interface QuestionDisplayProps {
    question: any
    activeQuestionIdx: number
    response: any
    isMarked: boolean
    onSave: (qid: string, ans: any) => void
    onMark: (qid: string) => void
    onNext: () => void
    onPrev: () => void
    onClear: () => void
    onSubmit?: () => void
    isFirst: boolean
    isLast: boolean
    isReviewMode?: boolean
}

function QuestionDisplayComponent({
    question,
    activeQuestionIdx,
    response,
    isMarked,
    onSave,
    onMark,
    onNext,
    onPrev,
    onClear,
    onSubmit,
    isFirst,
    isLast,
    isReviewMode = false,
}: QuestionDisplayProps) {
    if (!question) return null

    const questionTypeLabel = question.question_type === "MCQ"
        ? "MCQ"
        : question.question_type === "MSQ"
            ? "MSQ"
            : "NAT"

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={question.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-900"
            >
                {/* ── Question meta bar ─────────────────────────────────────── */}
                <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium">
                        Question Type: <span className="font-bold text-slate-800 dark:text-slate-200">{questionTypeLabel}</span>
                    </span>
                    <span>
                        Marks for correct answer:{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">{question.marks}</span>
                        {question.negative_marks > 0 && (
                            <>
                                {" "}|Negative Marks:{" "}
                                <span className="font-bold text-rose-600 dark:text-rose-400">
                                    {question.negative_marks}
                                </span>
                            </>
                        )}
                    </span>
                </div>

                {/* ── Scrollable content ────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 md:py-8 custom-scrollbar">
                    {/* Review Mode Banner */}
                    {isReviewMode && (
                        <div className={`mb-5 px-4 py-2.5 rounded border flex items-center justify-between text-xs font-bold ${
                            (() => {
                                const hasResponse = response !== undefined && response !== null && response !== "" && !(Array.isArray(response) && response.length === 0);
                                if (!hasResponse) return "bg-slate-50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                                
                                let isCorrectAns = false;
                                if (question.question_type === "NAT") {
                                    isCorrectAns = Math.abs(Number(response) - Number(question.correct_answer)) <= 0.01;
                                } else {
                                    const correctOptionIds = question.options?.filter((o: any) => o.is_correct).map((o: any) => o.id) || [];
                                    if (question.question_type === "MCQ") {
                                        isCorrectAns = response === correctOptionIds[0];
                                    } else {
                                        const current = (Array.isArray(response) ? response : []) as string[];
                                        const allCorrectSelected = correctOptionIds.every((id: string) => current.includes(id));
                                        const noIncorrectSelected = current.every((id: string) => correctOptionIds.includes(id));
                                        isCorrectAns = allCorrectSelected && noIncorrectSelected;
                                    }
                                }
                                return isCorrectAns
                                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                                    : "bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-800 dark:text-rose-300";
                            })()
                        }`}>
                            <span>
                                STATUS:{" "}
                                {(() => {
                                    const hasResponse = response !== undefined && response !== null && response !== "" && !(Array.isArray(response) && response.length === 0);
                                    if (!hasResponse) return "SKIPPED";
                                    
                                    if (question.question_type === "NAT") {
                                        const isCorrectAns = Math.abs(Number(response) - Number(question.correct_answer)) <= 0.01;
                                        return isCorrectAns ? "CORRECT" : "INCORRECT";
                                    } else {
                                        const correctOptionIds = question.options?.filter((o: any) => o.is_correct).map((o: any) => o.id) || [];
                                        if (question.question_type === "MCQ") {
                                            return response === correctOptionIds[0] ? "CORRECT" : "INCORRECT";
                                        } else {
                                            const current = (Array.isArray(response) ? response : []) as string[];
                                            const allCorrectSelected = correctOptionIds.every((id: string) => current.includes(id));
                                            const noIncorrectSelected = current.every((id: string) => correctOptionIds.includes(id));
                                            return (allCorrectSelected && noIncorrectSelected) ? "CORRECT" : "INCORRECT";
                                        }
                                    }
                                })()}
                            </span>
                            <span>
                                Marks:{" "}
                                {(() => {
                                    const hasResponse = response !== undefined && response !== null && response !== "" && !(Array.isArray(response) && response.length === 0);
                                    if (!hasResponse) return "0";
                                    
                                    let isCorrectAns = false;
                                    if (question.question_type === "NAT") {
                                        isCorrectAns = Math.abs(Number(response) - Number(question.correct_answer)) <= 0.01;
                                    } else {
                                        const correctOptionIds = question.options?.filter((o: any) => o.is_correct).map((o: any) => o.id) || [];
                                        if (question.question_type === "MCQ") {
                                            isCorrectAns = response === correctOptionIds[0];
                                        } else {
                                            const current = (Array.isArray(response) ? response : []) as string[];
                                            const allCorrectSelected = correctOptionIds.every((id: string) => current.includes(id));
                                            const noIncorrectSelected = current.every((id: string) => correctOptionIds.includes(id));
                                            isCorrectAns = allCorrectSelected && noIncorrectSelected;
                                        }
                                    }
                                    return isCorrectAns ? `+${question.marks || 1}` : `-${question.negative_marks || 0}`;
                                })()}
                            </span>
                        </div>
                    )}

                    {/* Question number */}
                    <p className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
                        Question No. {activeQuestionIdx + 1}
                    </p>

                    {/* Question text */}
                    <div className="text-base md:text-lg lg:text-xl text-slate-800 dark:text-slate-100 leading-relaxed md:leading-loose mb-8 select-none font-medium">
                        {renderWithLatex(question.question_text)}
                    </div>

                    {/* ── MCQ Options ─────────────────────────────────────── */}
                    {question.question_type === "MCQ" && (
                        <div className="space-y-4 md:space-y-5">
                            {question.options?.map((opt: any, idx: number) => {
                                const chosen = response === opt.id
                                if (isReviewMode) {
                                    return (
                                        <div
                                            key={opt.id}
                                            className={`flex items-start gap-4 p-3.5 rounded-lg border transition-all ${
                                                opt.is_correct
                                                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-medium"
                                                    : chosen
                                                        ? "bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-800 dark:text-rose-300"
                                                        : "bg-slate-50/50 dark:bg-slate-800/10 border-slate-200 dark:border-slate-800/50 opacity-80"
                                            }`}
                                        >
                                            {/* Radio indicator */}
                                            <span className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                                opt.is_correct
                                                    ? "border-emerald-600 bg-emerald-600"
                                                    : chosen
                                                        ? "border-rose-600 bg-rose-600"
                                                        : "border-slate-300 dark:border-slate-700"
                                            }`}>
                                                {(opt.is_correct || chosen) && (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                                                )}
                                            </span>
                                            <div className="flex-1 text-sm md:text-base lg:text-lg leading-relaxed">
                                                {renderWithLatex(opt.option_text)}
                                                {opt.is_correct && (
                                                    <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                        Correct Answer
                                                    </span>
                                                )}
                                                {chosen && !opt.is_correct && (
                                                    <span className="ml-2 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                        Your Answer (Incorrect)
                                                    </span>
                                                )}
                                                {chosen && opt.is_correct && (
                                                    <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                        Your Answer (Correct)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                                return (
                                    <label
                                        key={opt.id}
                                        className="flex items-start gap-4 cursor-pointer group py-1"
                                        onClick={() => onSave(question.id, opt.id)}
                                    >
                                        {/* Radio circle */}
                                        <span className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                            chosen
                                                ? "border-blue-600 bg-blue-600"
                                                : "border-slate-400 dark:border-slate-500 group-hover:border-blue-500"
                                        }`}>
                                            {chosen && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                                        </span>
                                        <span className="text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {renderWithLatex(opt.option_text)}
                                        </span>
                                    </label>
                                )
                            })}
                        </div>
                    )}

                    {/* ── MSQ Options ─────────────────────────────────────── */}
                    {question.question_type === "MSQ" && (
                        <div className="space-y-4 md:space-y-5">
                            {question.options?.map((opt: any, idx: number) => {
                                const current = (Array.isArray(response) ? response : []) as string[]
                                const checked = current.includes(opt.id)
                                if (isReviewMode) {
                                    return (
                                        <div
                                            key={opt.id}
                                            className={`flex items-start gap-4 p-3.5 rounded-lg border transition-all ${
                                                opt.is_correct
                                                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-medium"
                                                    : checked
                                                        ? "bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-800 dark:text-rose-300"
                                                        : "bg-slate-50/50 dark:bg-slate-800/10 border-slate-200 dark:border-slate-800/50 opacity-80"
                                            }`}
                                        >
                                            {/* Checkbox indicator */}
                                            <span className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                                                opt.is_correct
                                                    ? "border-emerald-600 bg-emerald-600"
                                                    : checked
                                                        ? "border-rose-600 bg-rose-600"
                                                        : "border-slate-300 dark:border-slate-700"
                                            }`}>
                                                {(opt.is_correct || checked) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </span>
                                            <div className="flex-1 text-sm md:text-base lg:text-lg leading-relaxed">
                                                {renderWithLatex(opt.option_text)}
                                                {opt.is_correct && (
                                                    <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                        Correct Option
                                                    </span>
                                                )}
                                                {checked && !opt.is_correct && (
                                                    <span className="ml-2 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                        Selected (Incorrect)
                                                    </span>
                                                )}
                                                {checked && opt.is_correct && (
                                                    <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                        Selected (Correct)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                                return (
                                    <label
                                        key={opt.id}
                                        className="flex items-start gap-4 cursor-pointer group py-1"
                                        onClick={() => {
                                            const next = checked
                                                ? current.filter((x) => x !== opt.id)
                                                : [...current, opt.id]
                                            onSave(question.id, next)
                                        }}
                                    >
                                        {/* Checkbox square */}
                                        <span className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                            checked
                                                ? "border-blue-600 bg-blue-600"
                                                : "border-slate-400 dark:border-slate-500 group-hover:border-blue-500"
                                        }`}>
                                            {checked && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {renderWithLatex(opt.option_text)}
                                        </span>
                                    </label>
                                )
                            })}
                        </div>
                    )}

                    {/* ── NAT Input ───────────────────────────────────────── */}
                    {question.question_type === "NAT" && (
                        <div className="mt-4 md:mt-6">
                            <label className="block text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                Enter your answer:
                            </label>
                            <input
                                type="number"
                                disabled={isReviewMode}
                                className="w-full max-w-xs px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm disabled:opacity-80 disabled:cursor-not-allowed"
                                placeholder={isReviewMode ? "No answer submitted" : "Enter numeric value..."}
                                value={response || ""}
                                onChange={(e) => onSave(question.id, e.target.value)}
                                onFocus={(e) => {
                                    if (isReviewMode) return;
                                    setTimeout(() => {
                                        e.target.scrollIntoView({ behavior: "smooth", block: "nearest" })
                                    }, 300)
                                }}
                            />
                            {isReviewMode && (
                                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/50 rounded max-w-xs text-sm">
                                    <div className="font-bold text-emerald-800 dark:text-emerald-300">Correct Answer:</div>
                                    <div className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-base mt-0.5">{question.correct_answer}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        (Allowed Range: {(Number(question.correct_answer) - 0.01).toFixed(2)} to {(Number(question.correct_answer) + 0.01).toFixed(2)})
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Explanation Section ─────────────────────────────── */}
                    {isReviewMode && question.explanation && (
                        <div className="mt-8 p-5 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-200 dark:border-blue-800/60 rounded-xl leading-relaxed">
                            <h4 className="text-sm md:text-base font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Explanation / Solution
                            </h4>
                            <div className="text-sm md:text-base text-slate-700 dark:text-slate-300">
                                {renderWithLatex(question.explanation)}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Bottom Action Bar ─────────────────────────────────────── */}
                <div className="shrink-0 flex items-center justify-between gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    {/* Left actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {!isReviewMode && (
                            <>
                                <button
                                    onClick={() => {
                                        onMark(question.id)
                                        onNext()
                                    }}
                                    className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                                >
                                    <span className="hidden sm:inline">Mark for Review &amp; Next</span>
                                    <span className="sm:hidden">Mark &amp; Next</span>
                                </button>
                                <button
                                    onClick={onClear}
                                    disabled={!response || (Array.isArray(response) && response.length === 0)}
                                    className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                >
                                    <span className="hidden sm:inline">Clear Response</span>
                                    <span className="sm:hidden">Clear</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {!isFirst && (
                            <button
                                onClick={onPrev}
                                className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="hidden sm:inline">Previous</span>
                                <span className="sm:hidden">Prev</span>
                            </button>
                        )}
                        <button
                            onClick={isReviewMode && isLast ? onSubmit : onNext}
                            className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-white rounded transition-colors whitespace-nowrap ${
                                isReviewMode && isLast 
                                    ? "bg-rose-600 hover:bg-rose-700" 
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isReviewMode 
                                ? (isLast ? "Exit Review" : "Next") 
                                : (isLast ? "Review" : "Save & Next")
                            }
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export const QuestionDisplay = memo(QuestionDisplayComponent)
