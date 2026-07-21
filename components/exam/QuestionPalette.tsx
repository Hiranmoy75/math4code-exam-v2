"use client"

import React, { memo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface QuestionPaletteProps {
    questions: any[]
    activeQuestionIdx: number
    responses: Record<string, any>
    marked: Record<string, boolean>
    visited: Record<string, boolean>
    onNavigate: (index: number) => void
    onSubmit: () => void
    sectionTitle?: string
    isMobileOpen: boolean
    onMobileClose: () => void
    studentName?: string
    isReviewMode?: boolean
}

function QuestionPaletteComponent({
    questions,
    activeQuestionIdx,
    responses,
    marked,
    visited,
    onNavigate,
    onSubmit,
    sectionTitle,
    isMobileOpen,
    onMobileClose,
    studentName,
    isReviewMode = false,
}: QuestionPaletteProps) {

    const isAnswered = (qid: string) => {
        const val = responses[qid]
        return val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0)
    }

    // Calculate real-time counts
    const completedAttempts = [] // Unused placeholder to prevent errors
    const answeredCount = questions.filter(q => isAnswered(q.id) && !marked[q.id]).length
    const markedCount = questions.filter(q => marked[q.id] && !isAnswered(q.id)).length
    const answeredAndMarkedCount = questions.filter(q => isAnswered(q.id) && marked[q.id]).length
    const visitedCount = questions.filter(q => visited[q.id]).length
    const notAnsweredCount = questions.filter(q => visited[q.id] && !isAnswered(q.id) && !marked[q.id]).length
    const notVisitedCount = questions.length - visitedCount

    const checkIsCorrect = (q: any) => {
        const response = responses[q.id]
        const hasResponse = response !== undefined && response !== null && response !== "" && !(Array.isArray(response) && response.length === 0)
        if (!hasResponse) return null // Skipped!

        if (q.question_type === "NAT") {
            return Math.abs(Number(response) - Number(q.correct_answer)) <= 0.01
        } else {
            const correctOptionIds = q.options?.filter((o: any) => o.is_correct).map((o: any) => o.id) || [];
            if (q.question_type === "MCQ") {
                return response === correctOptionIds[0]
            } else {
                const current = (Array.isArray(response) ? response : []) as string[]
                const allCorrectSelected = correctOptionIds.every((id: string) => current.includes(id))
                const noIncorrectSelected = current.every((id: string) => correctOptionIds.includes(id))
                return allCorrectSelected && noIncorrectSelected
            }
        }
    }

    const correctCount = questions.filter(q => checkIsCorrect(q) === true).length
    const incorrectCount = questions.filter(q => checkIsCorrect(q) === false).length
    const skippedCount = questions.filter(q => checkIsCorrect(q) === null).length

    // Retrieve style attributes for grid buttons
    const getStatusStyle = (qid: string, isActive: boolean) => {
        const answered = isAnswered(qid)
        const isMarked = marked[qid]
        const isVisited = visited[qid]

        let style: React.CSSProperties = {}
        let textClass = "text-slate-800"
        let hasDot = false

        if (isReviewMode) {
            const question = questions.find((q: any) => q.id === qid)
            if (question) {
                const correctness = checkIsCorrect(question)
                if (correctness === true) {
                    textClass = "text-white font-semibold"
                    style = { borderRadius: "4px", backgroundColor: "#22c55e" } // Emerald/Green
                } else if (correctness === false) {
                    textClass = "text-white font-semibold"
                    style = { borderRadius: "4px", backgroundColor: "#ef4444" } // Red
                } else {
                    textClass = "text-slate-700 font-medium"
                    style = { borderRadius: "4px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" } // Slate/Gray
                }
                if (isActive) {
                    style = { ...style, border: "2px solid #3b82f6", boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.4)" }
                }
                return { style, textClass, hasDot }
            }
        }

        if (answered && isMarked) {
            textClass = "text-white"
            style = { borderRadius: "50%", backgroundColor: "#7c4dff" }
            hasDot = true
        } else if (answered) {
            textClass = "text-white"
            style = { clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)", backgroundColor: "#28a745" }
        } else if (isMarked) {
            textClass = "text-white"
            style = { borderRadius: "50%", backgroundColor: "#7c4dff" }
        } else if (isVisited) {
            textClass = "text-white"
            style = { clipPath: "polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%)", backgroundColor: "#dc3545" }
        } else {
            textClass = "text-slate-700"
            style = { borderRadius: "4px", backgroundColor: "#e2e8f0", border: "1px solid #cbd5e1" }
        }

        if (isActive) {
            style = { ...style, border: "2px solid #3b82f6", boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.4)" }
        }

        return { style, textClass, hasDot }
    }

    const PaletteContent = () => (
        <div className="flex flex-col h-full bg-white text-slate-800" style={{ fontSize: "12px" }}>
            
            {/* ── Candidate Info Box ── */}
            <div className="shrink-0 p-3 flex items-center gap-3" style={{ backgroundColor: "#e5f2f7", borderBottom: "1px solid #cbd5e1" }}>
                <div className="w-14 h-16 bg-white border border-slate-300 rounded overflow-hidden flex items-center justify-center p-1 shrink-0">
                    <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center">
                        <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                </div>
                <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 block font-medium">Candidate Name:</span>
                    <span className="text-sm font-bold text-slate-800 truncate block">
                        {studentName || "Student"}
                    </span>
                </div>
            </div>

            {/* ── Status Legend Grid ── */}
            <div className="shrink-0 p-3 border-b border-slate-300">
                {isReviewMode ? (
                    <div className="grid grid-cols-3 gap-2 py-1">
                        <div className="flex flex-col items-center justify-center p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded text-center">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</span>
                            <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Correct</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 rounded text-center">
                            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{incorrectCount}</span>
                            <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Incorrect</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded text-center">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{skippedCount}</span>
                            <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Skipped</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <span 
                                    className="flex items-center justify-center text-white font-bold text-xs shrink-0" 
                                    style={{ 
                                        width: "28px", 
                                        height: "28px", 
                                        backgroundColor: "#28a745", 
                                        clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)" 
                                    }}
                                >
                                    {answeredCount}
                                </span>
                                <span className="text-[10px] text-slate-600 leading-tight">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span 
                                    className="flex items-center justify-center text-white font-bold text-xs shrink-0" 
                                    style={{ 
                                        width: "28px", 
                                        height: "28px", 
                                        backgroundColor: "#dc3545", 
                                        clipPath: "polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%)" 
                                    }}
                                >
                                    {notAnsweredCount}
                                </span>
                                <span className="text-[10px] text-slate-600 leading-tight">Not Answered</span>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <span 
                                    className="flex items-center justify-center text-slate-700 font-bold text-xs shrink-0"
                                    style={{ 
                                        width: "28px", 
                                        height: "28px", 
                                        backgroundColor: "#e2e8f0", 
                                        border: "1px solid #cbd5e1",
                                        borderRadius: "4px"
                                    }}
                                >
                                    {notVisitedCount}
                                </span>
                                <span className="text-[10px] text-slate-600 leading-tight">Not Visited</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span 
                                    className="flex items-center justify-center text-white font-bold text-xs shrink-0"
                                    style={{ 
                                        width: "28px", 
                                        height: "28px", 
                                        backgroundColor: "#7c4dff", 
                                        borderRadius: "50%"
                                    }}
                                >
                                    {markedCount}
                                </span>
                                <span className="text-[10px] text-slate-600 leading-tight">Marked for Review</span>
                            </div>
                        </div>

                        {/* Row 3: Answered & Marked for Review */}
                        <div className="flex items-center gap-2 pt-0.5">
                            <span 
                                className="flex items-center justify-center text-white font-bold text-xs relative shrink-0"
                                style={{ 
                                    width: "28px", 
                                    height: "28px", 
                                    backgroundColor: "#7c4dff", 
                                    borderRadius: "50%"
                                }}
                            >
                                {answeredAndMarkedCount}
                                <span 
                                    className="absolute -bottom-0.5 -right-0.5 rounded-full border border-white flex items-center justify-center text-[7px] text-white"
                                    style={{ width: "14px", height: "14px", backgroundColor: "#28a745" }}
                                >
                                    ✓
                                </span>
                            </span>
                            <span className="text-[10px] text-slate-600 leading-tight">Answered &amp; Marked for Review (will also be evaluated)</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Section Title Header ── */}
            <div className="shrink-0 px-3 py-2 text-white font-bold text-xs" style={{ backgroundColor: "#007bff" }}>
                {sectionTitle || "Section"}
            </div>
            
            <div className="shrink-0 px-3 py-1.5 border-b font-bold text-slate-800 text-[11px]" style={{ backgroundColor: "#e5f2f7", borderBottomColor: "#cbd5e1" }}>
                Choose a Question
            </div>

            {/* ── Question Grid ── */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                <div className="grid grid-cols-4 gap-2">
                    {questions.map((q, idx) => {
                        const isActive = idx === activeQuestionIdx
                        const { style, textClass, hasDot } = getStatusStyle(q.id, isActive)
                        return (
                            <div key={q.id} className="relative">
                                <button
                                    onClick={() => {
                                        onNavigate(idx)
                                        if (isMobileOpen) onMobileClose()
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "32px",
                                        ...style
                                    }}
                                    className={`flex items-center justify-center text-xs font-semibold shadow-sm transition-all duration-150 ${textClass} ${
                                        isActive ? "ring-2 ring-offset-2 ring-blue-600 scale-105 font-bold" : "hover:brightness-95"
                                    }`}
                                    aria-label={`Question ${idx + 1}`}
                                >
                                    {idx + 1}
                                </button>
                                {hasDot && (
                                    <span 
                                        className="absolute -bottom-1 -right-1 rounded-full border border-white flex items-center justify-center text-[7px] text-white pointer-events-none"
                                        style={{ width: "14px", height: "14px", backgroundColor: "#28a745" }}
                                    >
                                        ✓
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Submit / Exit Review Button ── */}
            <div className="p-3 border-t border-slate-300 bg-slate-50">
                <button
                    onClick={onSubmit}
                    className="w-full py-2 text-white text-xs font-bold rounded shadow transition-colors"
                    style={{ backgroundColor: isReviewMode ? "#dc3545" : "#4ca6cf" }}
                >
                    {isReviewMode ? "Exit Review" : "Submit"}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop palette */}
            <div className="hidden lg:flex flex-col h-full bg-white border-l border-slate-300 overflow-hidden">
                <PaletteContent />
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onMobileClose}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl border-l border-slate-300 lg:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 bg-[#1a1a2e]">
                                <span className="text-sm font-bold text-white">Question Palette</span>
                                <button onClick={onMobileClose} className="p-1 text-white/80 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <PaletteContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export const QuestionPalette = memo(QuestionPaletteComponent)
