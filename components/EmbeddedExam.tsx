"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useTenantId } from "@/hooks/useTenantId"
import { awardCoins } from "@/app/actions/rewardActions"
import { useExamSession, useSubmitExam, useSaveAnswer, useUpdateTimer } from "@/hooks/student/useExamSession"
import { useCurrentUser } from "@/hooks/student/useCurrentUser"
import { useExamResult } from "@/hooks/useExamResult"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Clock, CheckCircle2, Loader2, ArrowLeft, Flag, TrendingUp, Award, Target, BarChart3,
    Menu, AlertTriangle, Save, ListChecks, Maximize, Minimize, PauseCircle, X, Calculator,
    ChevronLeft, ChevronRight
} from "lucide-react"
import { renderWithLatex } from "@/lib/renderWithLatex"
import { useRouter } from "next/navigation"
import { useLessonContext } from "@/context/LessonContext"
import { ResponseExpiryWarning } from "@/components/exam/ResponseExpiryWarning"
import { isResponseExpired } from "@/lib/responseCleanup"
import { ExamTimer } from "@/components/exam/ExamTimer"
import { QuestionDisplay } from "@/components/exam/QuestionDisplay"
import { QuestionPalette } from "@/components/exam/QuestionPalette"
import { ScientificCalculator } from "@/components/exam/ScientificCalculator"
import { ExamLeaderboard } from "@/components/exam/ExamLeaderboard"

interface EmbeddedExamProps {
    examId: string
    onExit?: () => void
    isRetake?: boolean
    onSuccessfulSubmit?: (attemptId: string) => void
    isReviewMode?: boolean
    reviewAttemptId?: string
    retakeAttempt?: number
}

interface QuizResult {
    id: string
    score: number
    total_marks: number
    percentage: number
    passed: boolean
    time_taken: number
    correct_answers: number
    wrong_answers: number
    unattempted: number
}

// Component to show detailed question analysis
function QuestionAnalysisView({
    structured,
    responseMap,
    onBack,
    isExpired = false
}: {
    structured: any[],
    responseMap: Record<string, any>,
    onBack: () => void,
    isExpired?: boolean
}) {
    const [activeSectionIdx, setActiveSectionIdx] = useState(0)

    const allQuestions = structured.flatMap(s => s.questions)
    const activeSection = structured[activeSectionIdx]

    return (
        <div className="bg-background rounded-xl border border-border overflow-hidden shadow-sm flex flex-col h-[80vh]">
            {/* Header */}
            <div className="bg-card border-b border-border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground px-0 md:px-3">
                        <ArrowLeft className="w-4 h-4 mr-2" /> <span className="hidden md:inline">Back to Result</span><span className="md:hidden">Back</span>
                    </Button>
                    <h2 className="text-lg font-bold text-foreground truncate">Question Analysis</h2>
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {structured.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSectionIdx(i)}
                            className={`px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap ${activeSectionIdx === i
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {s.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {activeSection?.questions.map((q: any, idx: number) => {
                    // Hide user response if expired
                    const userAns = isExpired ? undefined : responseMap[q.id]

                    // If expired, we can't really judge Correct/Incorrect based on userAns (it's undefined).
                    // But we likely want to show just the question and correct answer.
                    // However, `isCorrect` logic depends on `userAns`.
                    // If isExpired, isCorrect will be false (undefined ans).
                    // We should probably adjust the display to generic "View Solution" mode.

                    const isCorrect = !isExpired && checkAnswer(q, userAns)
                    const isSkipped = !isExpired && (userAns === undefined || userAns === null || (Array.isArray(userAns) && userAns.length === 0))

                    return (
                        <div key={q.id} className={`p-4 md:p-6 rounded-xl border ${isExpired ? "border-border bg-card" :
                            isCorrect ? "border-emerald-500/30 bg-emerald-500/5" :
                                isSkipped ? "border-border bg-muted/20" :
                                    "border-rose-500/30 bg-rose-500/5"
                            }`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                                        Q{idx + 1}
                                    </span>
                                    {!isExpired && isCorrect && <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Correct</span>}
                                    {!isExpired && !isCorrect && !isSkipped && <span className="text-xs font-bold text-rose-500 flex items-center gap-1"><X className="w-3 h-3" /> Incorrect</span>}
                                    {!isExpired && isSkipped && <span className="text-xs font-bold text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Skipped</span>}
                                    {isExpired && <span className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Response Expired</span>}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Marks: {isCorrect ? `+${q.marks}` : isSkipped || isExpired ? "0" : `-${q.negative_marks}`}
                                </div>
                            </div>

                            <div className="text-base text-foreground mb-6">
                                {renderWithLatex(q.question_text)}
                            </div>

                            <div className="space-y-2 mb-6">
                                {q.options?.map((opt: any, optIdx: number) => {
                                    const isSelected = !isExpired && isOptionSelected(q, opt.id, userAns)
                                    const isRightOption = isOptionCorrect(q, opt.id)

                                    let optClass = "border-border bg-muted/30 text-muted-foreground"
                                    if (isRightOption) optClass = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500"
                                    else if (isSelected && !isRightOption) optClass = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500"

                                    return (
                                        <div key={opt.id} className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${optClass}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isRightOption ? "bg-emerald-500 text-white" :
                                                    isSelected ? "bg-rose-500 text-white" :
                                                        "border border-muted-foreground/30"
                                                    }`}>
                                                    {isRightOption ? <CheckCircle2 className="w-3 h-3" /> : isSelected ? <X className="w-3 h-3" /> : String.fromCharCode(65 + optIdx)}
                                                </div>
                                                <span className="text-sm">{renderWithLatex(opt.option_text)}</span>
                                            </div>
                                            {isSelected && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isRightOption
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                                                    : "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"
                                                    }`}>
                                                    Your Answer
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                                {q.question_type === "NAT" && (
                                    <div className="p-3 rounded-lg border border-border bg-muted/30">
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Correct Answer: <span className="text-emerald-500 font-mono">{q.correct_answer}</span>
                                            <span className="text-xs text-muted-foreground ml-2">
                                                (Range: {(Number(q.correct_answer) - 0.01).toFixed(2)} - {(Number(q.correct_answer) + 0.01).toFixed(2)})
                                            </span>
                                        </div>
                                        {!isExpired && <div className="text-sm text-muted-foreground">Your Answer: <span className={`${isCorrect ? "text-emerald-500" : "text-rose-500"} font-mono`}>{userAns ?? "N/A"}</span></div>}
                                    </div>
                                )}
                            </div>

                            {q.explanation && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <h4 className="text-sm font-bold text-blue-500 mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" /> Explanation
                                    </h4>
                                    <div className="text-sm text-foreground/90">
                                        {renderWithLatex(q.explanation)}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Helper functions for analysis
function checkAnswer(q: any, ans: any) {
    if (ans === undefined || ans === null || (Array.isArray(ans) && ans.length === 0)) return false
    if (q.question_type === "NAT") return Number(Math.abs(Number(ans) - Number(q.correct_answer)).toFixed(2)) <= 0.01;
    if (q.question_type === "MCQ") {
        const correctOpt = q.options.find((o: any) => o.is_correct)?.id
        return ans === correctOpt
    }
    if (q.question_type === "MSQ") {
        const correctIds = q.options.filter((o: any) => o.is_correct).map((o: any) => o.id).sort()
        const ansIds = (Array.isArray(ans) ? ans : [ans]).sort()
        return correctIds.length === ansIds.length && correctIds.every((x: string, i: number) => x === ansIds[i])
    }
    return false
}

function isOptionSelected(q: any, optId: string, ans: any) {
    if (!ans) return false
    if (q.question_type === "MCQ") return ans === optId
    if (q.question_type === "MSQ") return (Array.isArray(ans) ? ans : [ans]).includes(optId)
    return false
}

function isOptionCorrect(q: any, optId: string) {
    return q.options?.find((o: any) => o.id === optId)?.is_correct
}

export function PreviousResultView({
    examId,
    userId,
    onRetake,
    attemptId,
    initialResult,
    onBack,
    onReviewExamMode
}: {
    examId: string,
    userId: string,
    onRetake: () => void,
    attemptId?: string,
    initialResult?: any,
    onBack?: () => void,
    onReviewExamMode?: () => void
}) {
    const [effectiveAttemptId, setEffectiveAttemptId] = useState<string | null>(attemptId || null)
    const [showAnalysis, setShowAnalysis] = useState(false)
    const supabase = createClient()

    // If no attemptId provided, fetch the latest one
    useEffect(() => {
        if (attemptId) {
            setEffectiveAttemptId(attemptId)
            return
        }

        const fetchLatestAttempt = async () => {
            const { data: attempts } = await supabase
                .from("exam_attempts")
                .select("id")
                .eq("exam_id", examId)
                .eq("student_id", userId)
                .eq("status", "submitted")
                .order("created_at", { ascending: false })
                .limit(1)

            if (attempts && attempts.length > 0) {
                setEffectiveAttemptId(attempts[0].id)
            }
        }

        fetchLatestAttempt()
    }, [examId, userId, attemptId, supabase])

    const { data: resultData, isLoading } = useExamResult(effectiveAttemptId || "")

    if (isLoading || !effectiveAttemptId) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    if (!resultData || !resultData.result) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center p-8 bg-card rounded-xl border border-border">
                    <h3 className="text-lg font-bold text-amber-500 mb-2">Result Not Found</h3>
                    <p className="text-muted-foreground text-sm mb-4">Could not find the result for this attempt.</p>
                    <Button onClick={onRetake} className="bg-primary hover:bg-primary/90">
                        Retake Quiz
                    </Button>
                </div>
            </div>
        )
    }

    const { result, structured, responseMap, attempt } = resultData
    const passed = result.passed ?? (result.percentage >= 40)

    // Check for response expiry
    const isExpired = attempt?.submitted_at ? isResponseExpired(attempt.submitted_at) : false

    // Check visibility settings
    const examSettings = attempt?.exams
    const visibility = examSettings?.result_visibility || "immediate"
    const releaseTime = examSettings?.result_release_time
    const showAnswers = examSettings?.show_answers ?? true

    const isResultVisible = () => {
        if (visibility === "immediate") return true
        if (visibility === "manual") return false
        if (visibility === "scheduled" && releaseTime) {
            return new Date() >= new Date(releaseTime)
        }
        return false
    }

    if (!isResultVisible()) {
        return (
            <div className="bg-background rounded-xl border border-border p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Results Not Yet Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {visibility === "scheduled" && releaseTime
                        ? `The results for this exam will be released on ${new Date(releaseTime).toLocaleString()}.`
                        : "The instructor has not released the results for this exam yet."}
                </p>
                <Button onClick={onRetake} variant="outline" className="border-border text-foreground hover:bg-muted">
                    Back to Exam
                </Button>
            </div>
        )
    }

    if (showAnalysis) {
        return <QuestionAnalysisView structured={structured} responseMap={responseMap} onBack={() => setShowAnalysis(false)} isExpired={isExpired} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-6 md:p-8 shadow-2xl"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <Award className="w-10 h-10 md:w-12 md:h-12" />
                                <h1 className="text-3xl md:text-4xl font-bold">Exam Result</h1>
                            </div>
                            <p className="text-indigo-100 text-sm md:text-base">
                                Completed on {new Date(result.created_at).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        {result.rank && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border-2 border-white/30"
                            >
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-yellow-300">#{result.rank}</div>
                                    <div className="text-xs md:text-sm text-white/90 font-medium mt-1">Your Rank</div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Stats Grid - Redesigned */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {/* Score Card */}
                    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 md:p-6 shadow-lg border border-blue-100 dark:border-blue-800/50 hover:shadow-xl transition-shadow">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                                <Target className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                                {result.score ?? result.obtained_marks ?? 0}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Score</div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                out of {result.total_marks}
                            </div>
                        </div>
                    </div>

                    {/* Percentage Card */}
                    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 md:p-6 shadow-lg border border-purple-100 dark:border-purple-800/50 hover:shadow-xl transition-shadow">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                                <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                                {result.percentage?.toFixed(1) || 0}%
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Percentage</div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {result.percentage >= 90 ? 'Excellent!' : result.percentage >= 75 ? 'Great!' : result.percentage >= 60 ? 'Good' : 'Keep trying'}
                            </div>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className={`bg-white dark:bg-slate-800/90 rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-shadow ${passed ? 'border-emerald-100 dark:border-emerald-800/50' : 'border-amber-100 dark:border-amber-800/50'
                        }`}>
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 ${passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                                }`}>
                                {passed ? (
                                    <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-amber-600 dark:text-amber-400" />
                                )}
                            </div>
                            <div className={`text-xl md:text-2xl font-bold mb-1 ${passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'
                                }`}>
                                {passed ? 'Passed' : 'Not Passed'}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status</div>
                        </div>
                    </div>

                    {/* Time Card */}
                    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 md:p-6 shadow-lg border border-indigo-100 dark:border-indigo-800/50 hover:shadow-xl transition-shadow">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                                <Clock className="w-6 h-6 md:w-7 md:h-7 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="text-xl md:text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                                {(() => {
                                    const totalSeconds = attempt?.total_time_spent || 0;
                                    const hours = Math.floor(totalSeconds / 3600);
                                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                                    const seconds = totalSeconds % 60;
                                    if (hours > 0) {
                                        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                    }
                                    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                })()}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Time Taken</div>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons - Moved to top */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row justify-center gap-3"
                >
                    {showAnswers && (
                        <Button
                            onClick={() => setShowAnalysis(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                            size="lg"
                        >
                            <ListChecks className="w-5 h-5 mr-2" />
                            Review Questions
                        </Button>
                    )}
                    {onReviewExamMode && (
                        <Button
                            onClick={onReviewExamMode}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all"
                            size="lg"
                        >
                            <Maximize className="w-5 h-5 mr-2" />
                            Review (Exam Mode)
                        </Button>
                    )}
                    <Button
                        onClick={onRetake}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                    >
                        <Flag className="w-5 h-5 mr-2" />
                        Retake Exam
                    </Button>
                    {onBack && (
                        <Button
                            onClick={onBack}
                            variant="outline"
                            className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md"
                            size="lg"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Attempts
                        </Button>
                    )}
                    {/* <Button
                        onClick={() => window.location.reload()}
                        variant="secondary"
                        className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-md"
                        size="lg"
                    >
                        Continue Learning
                    </Button> */}
                </motion.div>

                {/* 2-Column Layout: Section Analysis + Leaderboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Section Analysis - Enhanced */}
                    {structured && structured.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Section Analysis</h2>
                            </div>
                            <div className="space-y-4">
                                {structured.map((section: any, idx: number) => {
                                    const secResult = section.result
                                    const totalQuestions = section.questions.length
                                    const accuracy = secResult ? (secResult.correct_answers / totalQuestions * 100) : 0

                                    return (
                                        <motion.div
                                            key={section.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + idx * 0.1 }}
                                            className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-700/50 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{section.title}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        {totalQuestions} Questions Ã¢â‚¬Â¢ {secResult?.obtained_marks || 0}/{secResult?.total_marks || 0} Marks
                                                    </p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${accuracy >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    accuracy >= 60 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}>
                                                    {accuracy.toFixed(0)}% Accuracy
                                                </div>
                                            </div>

                                            {secResult ? (
                                                <>
                                                    {/* Progress Bar */}
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
                                                            <span>Progress</span>
                                                            <span>{secResult.correct_answers + secResult.wrong_answers}/{totalQuestions} Attempted</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                                                style={{ width: `${(secResult.correct_answers + secResult.wrong_answers) / totalQuestions * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Stats Grid */}
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-900">
                                                            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                                {secResult.correct_answers}
                                                            </div>
                                                            <div className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium mt-1">Correct</div>
                                                        </div>
                                                        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3 text-center border border-rose-100 dark:border-rose-900">
                                                            <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
                                                                {secResult.wrong_answers}
                                                            </div>
                                                            <div className="text-[10px] text-rose-600 dark:text-rose-500 font-medium mt-1">Wrong</div>
                                                        </div>
                                                        <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-600">
                                                            <div className="text-xl font-bold text-slate-600 dark:text-slate-400">
                                                                {secResult.unanswered}
                                                            </div>
                                                            <div className="text-[10px] text-slate-600 dark:text-slate-500 font-medium mt-1">Skipped</div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-4">
                                                    No detailed result available for this section.
                                                </div>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Leaderboard - Enhanced */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <ExamLeaderboard
                            examId={examId}
                            examTitle={examSettings?.title}
                            currentUserId={userId}
                            limit={50}
                        />
                    </motion.div>
                </div>

                {/* Response Expiry Warning - Moved to bottom */}
                {attempt?.submitted_at && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <ResponseExpiryWarning submittedAt={attempt.submitted_at} />
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export function EmbeddedExam({
    examId,
    onExit,
    isRetake = false,
    onSuccessfulSubmit,
    isReviewMode = false,
    reviewAttemptId,
    retakeAttempt: initialRetakeAttempt
}: EmbeddedExamProps) {
    const queryClient = useQueryClient()
    const supabase = createClient()
    const router = useRouter()
    const examContainerRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(
        typeof document !== "undefined" ? !!document.fullscreenElement : false
    )
    // const [userId, setUserId] = useState<string | null>(null) // REMOVED: Derived from hook now
    const [responses, setResponses] = useState<Record<string, any>>({})
    const [marked, setMarked] = useState<Record<string, boolean>>({})
    const [visited, setVisited] = useState<Record<string, boolean>>({})
    const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)

    // Timer Logic - Ref to avoid re-renders
    const timeRef = useRef(0)
    const [initialTime, setInitialTime] = useState(0)
    const [isTimerActive, setIsTimerActive] = useState(false)

    const [showSubmitDialog, setShowSubmitDialog] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [paletteOpenMobile, setPaletteOpenMobile] = useState(false)
    const [retakeAttempt, setRetakeAttempt] = useState(
        initialRetakeAttempt !== undefined ? initialRetakeAttempt : (isRetake ? 1 : 0)
    )
    const [submittedAttemptId, setSubmittedAttemptId] = useState<string | null>(null)
    const [showPauseDialog, setShowPauseDialog] = useState(false)
    const [isPausing, setIsPausing] = useState(false)
    const [showCalculator, setShowCalculator] = useState(false)  // NEW: Calculator state
    const { markComplete } = useLessonContext()
    const tenantId = useTenantId()

    // Use centralized user hook (handles retries and caching)
    const { data: userProfile, isLoading: isUserLoading } = useCurrentUser()
    const userId = userProfile?.id || null

    const [isDark, setIsDark] = useState(false)
    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"))
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"))
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
        return () => observer.disconnect()
    }, [])

    const theme = {
        bg: isDark ? "#0f172a" : "#ffffff",
        text: isDark ? "#f8fafc" : "#1e293b",
        border: isDark ? "#334155" : "#cbd5e1",
        headerBg: isDark ? "#1e293b" : "#f0f0f0",
        tabsBg: isDark ? "#0f172a" : "#e8e8e8",
        tabActiveBg: "#007bff",
        tabInactiveBg: isDark ? "#1e293b" : "#e8e8e8",
        tabActiveText: "#ffffff",
        tabInactiveText: isDark ? "#94a3b8" : "#495057",
        leftPanelBg: isDark ? "#0f172a" : "#ffffff",
        rightPanelBg: isDark ? "#1e293b" : "#ffffff",
        topBarBg: isDark ? "#020617" : "#333333",
    }


    useEffect(() => {
        if (!isUserLoading && !userId) {
            router.push("/auth/login")
        }
    }, [isUserLoading, userId, router])

    const { data: reviewResultData, isLoading: isReviewLoading } = useExamResult(
        isReviewMode ? reviewAttemptId || "" : ""
    )

    const { data: activeSessionData, isLoading: isActiveLoading, error: activeError } = useExamSession(
        examId,
        userId,
        retakeAttempt,
        !showResults && !isReviewMode
    )

    const sessionData = React.useMemo(() => {
        if (isReviewMode) {
            if (!reviewResultData) return null
            return {
                exam: reviewResultData.attempt.exams,
                sections: reviewResultData.structured,
                attempt: reviewResultData.attempt,
                previousResponses: reviewResultData.responseMap
            }
        }
        return activeSessionData
    }, [isReviewMode, reviewResultData, activeSessionData])

    const isLoading = isReviewMode ? isReviewLoading : isActiveLoading
    const error = isReviewMode ? null : activeError

    const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam()
    const { mutate: saveAnswer, isPending: isSaving } = useSaveAnswer()
    const { mutate: updateTimer } = useUpdateTimer()

    // Initialize session & Timer Logic
    useEffect(() => {
        if (!sessionData) return

        // Safety: If already submitted, show results immediately
        if (!isReviewMode && sessionData.attempt?.status === 'submitted') {
            setSubmittedAttemptId(sessionData.attempt.id)
            setShowResults(true)
            return
        }

        if (sessionData.previousResponses) {
            setResponses(sessionData.previousResponses)
            const newVisited: Record<string, boolean> = {}
            Object.keys(sessionData.previousResponses).forEach(k => newVisited[k] = true)
            if (isReviewMode) {
                const allQids = sessionData.sections.flatMap((s: any) => s.questions.map((q: any) => q.id))
                allQids.forEach((qid: string) => {
                    newVisited[qid] = true
                })
            }
            setVisited(newVisited)
        }

        const exam = sessionData.exam
        const attempt = sessionData.attempt
        const totalDuration = exam.duration_minutes * 60
        let remaining = 0

        if (exam.allow_pause === false) {
            // MODE 1: PAUSE OFF (Deadline based)
            if (attempt.exam_deadline) {
                const deadline = new Date(attempt.exam_deadline).getTime()
                remaining = Math.max(0, (deadline - Date.now()) / 1000)
            } else {
                remaining = Math.max(0, totalDuration - (attempt.total_time_spent || 0))
            }
            setIsTimerActive(true)
        } else {
            // MODE 2: PAUSE ON (Elapsed based)
            const elapsed = attempt.elapsed_time_seconds || 0

            if (attempt.is_paused) {
                // Auto-Resume logic: If user is back, we resume!
                remaining = Math.max(0, totalDuration - elapsed)
                setIsTimerActive(true)

                // Fire update to server to mark as active
                updateTimer({
                    attemptId: attempt.id,
                    timeSpent: elapsed,
                    isPaused: false,
                    lastActivityAt: new Date().toISOString()
                })
            } else {
                // Active: elapsed + (now - last_activity)
                const lastActivity = attempt.last_activity_at ? new Date(attempt.last_activity_at).getTime() : Date.now()
                const currentSession = (Date.now() - lastActivity) / 1000
                remaining = Math.max(0, totalDuration - (elapsed + currentSession))
                setIsTimerActive(true)
            }
        }

        setInitialTime(Math.floor(remaining))
        timeRef.current = Math.floor(remaining)

        // If time is up, submit immediately
        if (remaining <= 0) {
            setInitialTime(0)
            timeRef.current = 0
            if (!showSubmitDialog && !isSubmitting && !submittedAttemptId) {
                toast.error("Time expired. Submitting exam...")
                // Trigger submission
                handleAutoSubmit()
            }
            return
        }



        // Ã¢Å“â€¦ CLEANUP: Prevent memory leak
        return () => {
            setIsTimerActive(false);
        };
    }, [sessionData])


    // Auto-pause handler (Tab Close)
    useEffect(() => {
        if (!sessionData?.exam?.allow_pause) return

        const handleBeforeUnload = () => {
            // Attempt to pause on exit (best effort)
            const attempt = sessionData.attempt
            const currentElapsed = (attempt.elapsed_time_seconds || 0) +
                Math.floor((Date.now() - new Date(attempt.last_activity_at || Date.now()).getTime()) / 1000)

            // Fire and forget update
            supabase.from('exam_attempts').update({
                is_paused: true,
                elapsed_time_seconds: currentElapsed
            }).eq('id', attempt.id).then()
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [sessionData, supabase])






    // Fullscreen handler
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    const toggleFullscreen = async () => {
        if (!examContainerRef.current) return

        if (!document.fullscreenElement) {
            try {
                await examContainerRef.current.requestFullscreen()
            } catch (err) {
                console.error("Error attempting to enable fullscreen:", err)
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen()
            }
        }
    }

    const forceExitFullscreen = async () => {
        if (document.fullscreenElement && document.exitFullscreen) {
            try {
                await document.exitFullscreen()
            } catch (err) {
                console.error("Error exiting fullscreen:", err)
            }
        }
    }

    const confirmPauseAndExit = async () => {
        setIsPausing(true)
        try {
            if (sessionData?.attempt?.id) {
                // Determine time spent
                const currentSecondsLeft = timeRef.current
                const totalDur = sessionData.exam.duration_minutes * 60
                const timeSpent = Math.max(0, totalDur - currentSecondsLeft)

                await new Promise<void>((resolve, reject) => {
                    updateTimer(
                        {
                            attemptId: sessionData.attempt.id,
                            timeSpent,
                            isPaused: true,
                            elapsedSeconds: timeSpent
                        },
                        {
                            onSuccess: () => resolve(),
                            onError: (error) => reject(error)
                        }
                    )
                })
            }

            // Invalidate queries to ensure fresh data on return
            await queryClient.invalidateQueries({ queryKey: ["exam-attempts", examId, userId] })
            await queryClient.invalidateQueries({ queryKey: ["exam-session"] })

            // Exit fullscreen if active
            await forceExitFullscreen()

            setShowPauseDialog(false)
            if (onExit) onExit()
        } catch (error) {
            console.error("Error pausing exam:", error)
            toast.error("Failed to save progress")
        } finally {
            setIsPausing(false)
        }
    }

    const allQuestions = sessionData?.sections.flatMap((s) => s.questions) || []
    const currentQuestion = allQuestions[activeQuestionIdx]

    // Mark question as visited when it becomes active
    useEffect(() => {
        if (currentQuestion?.id) {
            setVisited((v) => {
                if (v[currentQuestion.id]) return v
                return { ...v, [currentQuestion.id]: true }
            })
        }
    }, [currentQuestion?.id])


    const isAnswered = useCallback((val: any) => {
        return val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0)
    }, [])

    const getSectionAttemptCount = useCallback((sectionId: string) => {
        const section = sessionData?.sections.find((s: any) => s.id === sectionId)
        if (!section) return 0
        return section.questions.filter((q: any) => isAnswered(responses[q.id])).length
    }, [sessionData, responses, isAnswered])

    const currentSection = sessionData?.sections.find((s: any) => s.id === currentQuestion?.section_id)

    const handleSaveResponse = useCallback((qid: string, ans: any) => {
        // Max Attempts Enforcement
        if (currentSection?.max_questions_to_attempt) {
            const wasAnswered = isAnswered(responses[qid])
            // Check if this is a "clearing" action (empty string or explicit null/undefined)
            const isClearing = ans === "" || ans === null || ans === undefined || (Array.isArray(ans) && ans.length === 0);
            const willBeAnswered = isAnswered(ans)

            // Only block if we are ADDING an answer (was not answered, and will be answered)
            // If we are clearing (willBeAnswered is false), we should ALWAYS allow it.
            if (!wasAnswered && willBeAnswered && !isClearing) {
                const currentCount = getSectionAttemptCount(currentSection.id)
                if (currentCount >= currentSection.max_questions_to_attempt) {
                    toast.error(`Maximum attempts (${currentSection.max_questions_to_attempt}) reached for this section. Clear an existing answer to change.`)
                    return // Prevent saving
                }
            }
        }

        setResponses((r) => ({ ...r, [qid]: ans }))
        setVisited((v) => ({ ...v, [qid]: true }))

        if (sessionData?.attempt?.id) {
            saveAnswer({ attemptId: sessionData.attempt.id, questionId: qid, answer: ans, tenantId: tenantId || undefined })
        }
    }, [currentSection, getSectionAttemptCount, isAnswered, responses, sessionData?.attempt?.id, saveAnswer])


    const handleMark = useCallback((qid: string) => {
        setMarked((m) => ({ ...m, [qid]: !m[qid] }))
    }, [])

    const performSubmit = useCallback(async () => {
        if (!sessionData?.attempt?.id || !sessionData?.exam) return

        // Calculate final time spent
        const currentSecondsLeft = timeRef.current
        const totalDur = sessionData.exam.duration_minutes * 60
        const timeSpent = Math.max(0, totalDur - currentSecondsLeft)

        // Ensure timer is saved before submitting
        // We act "optimistically" but waiting ensures DB has it for the result view
        try {
            await new Promise<void>((resolve) => {
                updateTimer(
                    {
                        attemptId: sessionData.attempt.id,
                        timeSpent,
                        isPaused: false, // Not paused, just finished
                        elapsedSeconds: timeSpent // Sync elapsed too for consistency
                    },
                    {
                        onSuccess: () => resolve(),
                        onError: () => resolve() // Continue anyway 
                    }
                )
            })
        } catch (e) {
            console.error("Failed to sync final time", e)
        }

        submitExam({
            attemptId: sessionData.attempt.id,
            examId: sessionData.exam.id,
            responses: responses,
            sections: sessionData.sections,
            totalMarks: sessionData.exam.total_marks || 0,
            tenantId: tenantId || undefined
        }, {
            onSuccess: async (result: any) => {
                // Exit Fullscreen IMMEDIATELY
                await forceExitFullscreen()

                toast.success("Quiz submitted successfully!")
                setIsTimerActive(false)

                // Wait a moment for database to update
                await new Promise(resolve => setTimeout(resolve, 500))

                // Award coins and mark complete
                if (userId) {
                    try {
                        const rewardRes = await awardCoins(userId, 'quiz_completion', examId, `Completed quiz: ${sessionData.exam.title}`, tenantId || undefined);
                        if (rewardRes.success && rewardRes.message) {
                            toast.success(rewardRes.message, { icon: "Ã°Å¸Âªâ„¢" });
                        }
                    } catch (error) {
                        // Silently fail - don't break submission if reward fails
                        console.error("Failed to award coins:", error);
                    }

                    // Mark lesson complete via context
                    markComplete();
                }

                // Check if results should be shown immediately
                let shouldShowResults = true; // Default to showing results
                try {
                    const { data: examData, error } = await supabase
                        .from("exams")
                        .select("result_visibility")
                        .eq("id", examId)
                        .single()

                    if (!error && examData) {
                        // Only hide results if explicitly set to manual or scheduled
                        shouldShowResults = examData.result_visibility === "immediate" || !examData.result_visibility
                    }
                } catch (error) {
                    console.error("Error fetching result visibility:", error)
                    // On error, default to showing results
                }

                // Close the submit dialog
                setShowSubmitDialog(false)

                if (shouldShowResults) {
                    // If onSuccessfulSubmit is provided (standalone mode), use it
                    if (onSuccessfulSubmit) {
                        onSuccessfulSubmit(sessionData.attempt.id)
                    } else {
                        // Otherwise show results inline (embedded mode)
                        setSubmittedAttemptId(sessionData.attempt.id)
                        setShowResults(true)
                    }
                } else {
                    toast.info("Results will be available once the instructor releases them")
                    if (onExit) onExit()
                }
            },
            onError: (error: any) => {
                console.error("Submission error:", error)
                toast.error("Failed to submit quiz. Please try again.")
                setShowSubmitDialog(false)
            }
        })
    }, [sessionData, responses, submitExam, examId, userId, awardCoins, markComplete, onExit, onSuccessfulSubmit, supabase])

    const handleAutoSubmit = useCallback(() => {
        toast.info("Time's up! Submitting quiz...")
        performSubmit()
    }, [performSubmit])

    const validateMinimumAttempts = () => {
        if (!sessionData) return true
        let isValid = true
        sessionData.sections.forEach(s => {
            if (s.required_attempts && getSectionAttemptCount(s.id) < s.required_attempts) {
                isValid = false
                toast.warning(`Section "${s.title}" requires at least ${s.required_attempts} attempted questions.`)
            }
        })
        return isValid
    }

    const [showTimeout, setShowTimeout] = useState(false)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isLoading) {
            timer = setTimeout(() => setShowTimeout(true), 10000) // 10s timeout
        }
        return () => clearTimeout(timer)
    }, [isLoading])

    if (isLoading || !userId) {
        return (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    <p>Loading Quiz...</p>
                    {showTimeout && (
                        <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-xs text-amber-600">Taking longer than expected?</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.reload()}
                                className="gap-2"
                            >
                                <TrendingUp className="w-4 h-4" /> Reload Page
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (error || (!sessionData && !isLoading)) {
        const errorMessage = (error as Error)?.message || "Unknown error"
        const isAlreadySubmitted = errorMessage.includes("already been submitted")

        if (isAlreadySubmitted && userId) {
            return <PreviousResultView
                examId={examId}
                userId={userId}
                onRetake={() => {
                    queryClient.invalidateQueries({ queryKey: ["exam-session"] })
                    setRetakeAttempt(prev => prev + 1)
                }}
            />
        }

        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center p-8 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800">
                    <h3 className="text-lg font-bold text-rose-900 dark:text-rose-400 mb-2">Failed to Load Quiz</h3>
                    <p className="text-rose-700 dark:text-rose-500 text-sm">{errorMessage}</p>
                </div>
            </div>
        )
    }

    if (showResults && submittedAttemptId && userId) {
        return (
            <PreviousResultView
                examId={examId}
                userId={userId}
                attemptId={submittedAttemptId}
                onRetake={() => {
                    setRetakeAttempt(prev => {
                        const newRetakeAttempt = prev + 1
                        queryClient.invalidateQueries({ queryKey: ["exam-session", examId, userId, prev] })
                        queryClient.invalidateQueries({ queryKey: ["exam-session", examId, userId, newRetakeAttempt] })
                        return newRetakeAttempt
                    })
                    setShowResults(false)
                    setSubmittedAttemptId(null)
                }}
                onBack={onExit ? () => onExit() : undefined}
            />
        )
    }

    if (!sessionData) return null

    const currentSectionIndex = sessionData.sections.findIndex(s => s.id === currentSection?.id)
    const currentSectionStartIdx = currentSectionIndex !== -1
        ? sessionData.sections.slice(0, currentSectionIndex).reduce((sum, s) => sum + s.questions.length, 0)
        : 0
    const localActiveIdx = activeQuestionIdx - currentSectionStartIdx

    const answeredCount = Object.values(responses).filter(
        v => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
    ).length
    const markedCount = Object.values(marked).filter(Boolean).length
    const notVisitedCount = allQuestions.length - Object.keys(visited).length
    const notAnsweredCount = allQuestions.length - answeredCount

    return (
        <div
            ref={examContainerRef}
            className={`flex flex-col overflow-hidden select-none ${isFullscreen
                    ? "fixed inset-0 z-50 w-full h-[100dvh]"
                    : "h-full w-full"
                }`}
            style={{
                fontFamily: "'Segoe UI', Arial, sans-serif",
                fontSize: "13px",
                backgroundColor: theme.bg,
                color: theme.text
            }}
        >
            {/* ══ ROW 1: Dark Title Bar ══════════════════════════════════════ */}
            <div className="shrink-0 flex items-center text-white px-3 py-1 gap-3 min-h-[32px]" style={{ backgroundColor: theme.topBarBg }}>
                {/* Exam title - green text like official */}
                <span className="text-sm font-semibold text-[#4ade80] truncate flex-1">
                    {sessionData.exam.title}
                </span>
                {/* Right links */}
                <div className="hidden md:flex items-center gap-3 text-xs shrink-0">
                    <button className="flex items-center gap-1 text-orange-400 hover:text-orange-300">
                        <span className="w-4 h-4 rounded-full bg-orange-400 text-black flex items-center justify-center text-[9px] font-bold">?</span>
                        Useful Data
                    </button>
                    <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                        <span className="w-4 h-4 rounded-full bg-blue-400 text-black flex items-center justify-center text-[9px] font-bold">i</span>
                        Instructions
                    </button>
                    <button className="flex items-center gap-1 text-green-400 hover:text-green-300">
                        <span className="w-4 h-4 rounded-full bg-green-400 text-black flex items-center justify-center text-[9px] font-bold">Q</span>
                        Question Paper
                    </button>
                </div>
                {/* Mobile menu */}
                <button
                    onClick={() => setPaletteOpenMobile(true)}
                    className="md:hidden p-1 text-white"
                >
                    <Menu className="w-4 h-4" />
                </button>
            </div>

            {/* ══ BODY: 2-Column Layout ═══════════════════════════════════ */}
            <div className="flex flex-1 min-h-0 overflow-hidden" style={{ borderTop: `1px solid ${theme.border}` }}>

                {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ borderRight: `1px solid ${theme.border}` }}>

                    {/* Sub-header (exam chip + calc) */}
                    <div className="shrink-0 flex items-center border-b min-h-[40px] px-1 gap-1" style={{ backgroundColor: theme.headerBg, borderBottomColor: theme.border }}>
                        <button className="p-1 text-slate-500 hover:text-slate-700 shrink-0">
                            <ChevronLeft className="w-3.5 h-3.5" style={{ color: theme.text }} />
                        </button>
                        <div className="flex items-center gap-1 text-white px-2.5 py-1 rounded text-xs font-medium max-w-[200px] truncate" style={{ backgroundColor: "#007bff" }}>
                            <span className="truncate">{sessionData.exam.title}</span>
                            <span className="w-4 h-4 rounded-full bg-white text-blue-600 flex items-center justify-center text-[9px] font-bold ml-1 shrink-0">i</span>
                        </div>
                        <button className="p-1 text-slate-500 hover:text-slate-700 shrink-0">
                            <ChevronRight className="w-3.5 h-3.5" style={{ color: theme.text }} />
                        </button>

                        {/* Action buttons aligned to the right */}
                        <div className="ml-auto flex items-center gap-1.5 pr-2">
                            {/* Calculator */}
                            <button
                                onClick={() => setShowCalculator(!showCalculator)}
                                className="p-1.5 rounded border transition-colors text-white"
                                style={{
                                    backgroundColor: showCalculator ? "#28a745" : "#c8860a",
                                    borderColor: showCalculator ? "#218838" : "#a06a00"
                                }}
                                title="Calculator"
                            >
                                <Calculator className="w-4 h-4" />
                            </button>

                            {/* Fullscreen */}
                            <button
                                onClick={toggleFullscreen}
                                className="p-1.5 hover:opacity-80"
                                style={{ color: theme.text }}
                                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                            >
                                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                            </button>

                            {/* Pause */}
                            {sessionData?.exam?.allow_pause && (
                                <button
                                    onClick={() => setShowPauseDialog(true)}
                                    className="p-1.5 text-amber-600 hover:text-amber-700"
                                    title="Pause"
                                >
                                    <PauseCircle className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sections / Timer bar */}
                    <div className="shrink-0 flex items-center justify-between px-3 py-1 border-b min-h-[30px]" style={{ backgroundColor: theme.bg, borderBottomColor: theme.border }}>
                        <span className="text-xs font-medium" style={{ color: theme.text }}>Sections</span>
                        <div className="flex items-center gap-1 text-xs font-semibold">
                            {isReviewMode ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                                    Review Mode
                                </span>
                            ) : (
                                <ExamTimer
                                    key={initialTime}
                                    initialSeconds={initialTime}
                                    isActive={isTimerActive}
                                    onTimeUp={handleAutoSubmit}
                                    timeRef={timeRef}
                                />
                            )}
                        </div>
                    </div>

                    {/* Section Tabs */}
                    <div className="shrink-0 flex items-center border-b min-h-[34px]" style={{ backgroundColor: theme.tabsBg, borderBottomColor: theme.border }}>
                        <button className="px-1 py-1 border-r h-full flex items-center" style={{ borderColor: theme.border, color: theme.text }}>
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex flex-1 overflow-x-auto">
                            {sessionData.sections.map((s, i) => {
                                const startIdx = sessionData.sections.slice(0, i).reduce((a, b) => a + b.questions.length, 0)
                                const isActive = activeQuestionIdx >= startIdx && activeQuestionIdx < startIdx + s.questions.length
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveQuestionIdx(startIdx)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium whitespace-nowrap border-r transition-colors"
                                        style={{
                                            backgroundColor: isActive ? "#007bff" : theme.tabInactiveBg,
                                            color: isActive ? "#ffffff" : theme.tabInactiveText,
                                            borderColor: theme.border
                                        }}
                                    >
                                        {s.title}
                                        <span
                                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold"
                                            style={{
                                                backgroundColor: isActive ? "#ffffff" : "#888888",
                                                color: isActive ? "#007bff" : "#ffffff"
                                            }}
                                        >
                                            i
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        <button className="px-1 py-1 border-l h-full flex items-center" style={{ borderColor: theme.border, color: theme.text }}>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Question Area */}
                    <QuestionDisplay
                        question={currentQuestion}
                        activeQuestionIdx={activeQuestionIdx}
                        response={responses[currentQuestion?.id]}
                        isMarked={marked[currentQuestion?.id] || false}
                        onSave={handleSaveResponse}
                        onMark={handleMark}
                        onNext={() => {
                            if (activeQuestionIdx < allQuestions.length - 1) setActiveQuestionIdx(i => i + 1)
                        }}
                        onPrev={() => {
                            if (activeQuestionIdx > 0) setActiveQuestionIdx(i => i - 1)
                        }}
                        onClear={() => handleSaveResponse(currentQuestion.id, "")}
                        onSubmit={isReviewMode ? () => onExit?.() : () => setShowSubmitDialog(true)}
                        isFirst={activeQuestionIdx === 0}
                        isLast={activeQuestionIdx === allQuestions.length - 1}
                        isReviewMode={isReviewMode}
                    />
                </div>

                {/* ── RIGHT COLUMN: Palette ────────────────────────────────── */}
                <div className="hidden lg:flex flex-col w-[220px] xl:w-[240px] shrink-0 bg-white overflow-hidden">
                    <QuestionPalette
                        questions={currentSection?.questions || []}
                        activeQuestionIdx={localActiveIdx}
                        responses={responses}
                        marked={marked}
                        visited={visited}
                        onNavigate={(idx) => setActiveQuestionIdx(currentSectionStartIdx + idx)}
                        onSubmit={isReviewMode ? () => onExit?.() : () => setShowSubmitDialog(true)}
                        sectionTitle={currentSection?.title}
                        isMobileOpen={paletteOpenMobile}
                        onMobileClose={() => setPaletteOpenMobile(false)}
                        studentName={userProfile?.fullName || "Student"}
                        isReviewMode={isReviewMode}
                    />
                </div>
            </div>

            {/* Mobile palette drawer */}
            <div className="lg:hidden">
                <QuestionPalette
                    questions={currentSection?.questions || []}
                    activeQuestionIdx={localActiveIdx}
                    responses={responses}
                    marked={marked}
                    visited={visited}
                    onNavigate={(idx) => setActiveQuestionIdx(currentSectionStartIdx + idx)}
                    onSubmit={isReviewMode ? () => onExit?.() : () => setShowSubmitDialog(true)}
                    sectionTitle={currentSection?.title}
                    isMobileOpen={paletteOpenMobile}
                    onMobileClose={() => setPaletteOpenMobile(false)}
                    studentName={userProfile?.fullName || "Student"}
                    isReviewMode={isReviewMode}
                />
            </div>

            {/* ══ SUBMIT DIALOG ═════════════════════════════════════════════ */}
            <AnimatePresence>
                {showSubmitDialog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowSubmitDialog(false)}
                            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md rounded border shadow-2xl overflow-hidden"
                                style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
                            >
                                <div className="px-4 py-2.5 text-white" style={{ backgroundColor: theme.topBarBg }}>
                                    <h3 className="text-sm font-bold">Submit Examination</h3>
                                </div>
                                <div className="p-5">
                                    <p className="text-sm mb-4" style={{ color: isDark ? "#94a3b8" : "#4b5563" }}>
                                        Are you sure you want to submit? You cannot change answers after submission.
                                    </p>
                                    <div className="border rounded mb-5 overflow-hidden" style={{ borderColor: theme.border }}>
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b" style={{ backgroundColor: theme.headerBg, borderColor: theme.border }}>
                                                    <th className="text-left px-3 py-2 font-semibold" style={{ color: theme.text }}>Status</th>
                                                    <th className="text-center px-3 py-2 font-semibold" style={{ color: theme.text }}>Count</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b" style={{ borderColor: theme.border }}>
                                                    <td className="px-3 py-2 flex items-center gap-2">
                                                        <span className="w-4 h-4 rounded-full bg-[#28a745] inline-block" /> Answered
                                                    </td>
                                                    <td className="px-3 py-2 text-center font-bold text-green-600">{answeredCount}</td>
                                                </tr>
                                                <tr className="border-b" style={{ borderColor: theme.border }}>
                                                    <td className="px-3 py-2 flex items-center gap-2">
                                                        <span className="w-4 h-4 rounded-full bg-[#dc3545] inline-block" /> Not Answered
                                                    </td>
                                                    <td className="px-3 py-2 text-center font-bold text-rose-600">{notAnsweredCount}</td>
                                                </tr>
                                                <tr className="border-b" style={{ borderColor: theme.border }}>
                                                    <td className="px-3 py-2 flex items-center gap-2">
                                                        <span className="w-4 h-4 bg-slate-300 inline-block" style={{ borderRadius: "2px" }} /> Not Visited
                                                    </td>
                                                    <td className="px-3 py-2 text-center font-bold text-slate-600">{notVisitedCount}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-3 py-2 flex items-center gap-2">
                                                        <span className="w-4 h-4 bg-[#7c4dff] inline-block" style={{ borderRadius: "50%" }} /> Marked for Review
                                                    </td>
                                                    <td className="px-3 py-2 text-center font-bold text-purple-600">{markedCount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowSubmitDialog(false)}
                                            className="flex-1 py-2 border rounded text-sm font-medium transition-colors"
                                            style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.bg }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={performSubmit}
                                            disabled={isSubmitting}
                                            className="flex-1 py-2 text-white text-sm font-bold rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-60 hover:brightness-95"
                                            style={{ backgroundColor: "#007bff" }}
                                        >
                                            {isSubmitting ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                            ) : "Submit Now"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ══ PAUSE DIALOG ══════════════════════════════════════════════ */}
            <AnimatePresence>
                {showPauseDialog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowPauseDialog(false)}
                            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-sm rounded border shadow-2xl overflow-hidden"
                                style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
                            >
                                <div className="px-4 py-2.5 text-white" style={{ backgroundColor: "#d97706" }}>
                                    <h3 className="text-sm font-bold">Pause & Exit</h3>
                                </div>
                                <div className="p-5 text-center">
                                    <p className="text-sm mb-5" style={{ color: isDark ? "#94a3b8" : "#4b5563" }}>
                                        Your progress will be saved and you can resume this exam later.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowPauseDialog(false)}
                                            className="flex-1 py-2 border rounded text-sm font-medium transition-colors"
                                            style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.bg }}
                                        >Cancel</button>
                                        <button
                                            onClick={confirmPauseAndExit}
                                            disabled={isPausing}
                                            className="flex-1 py-2 text-white text-sm font-bold rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-60 hover:brightness-95"
                                            style={{ backgroundColor: "#d97706" }}
                                        >
                                            {isPausing ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                            ) : (
                                                <><PauseCircle className="w-4 h-4" /> Pause & Exit</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* â•â• SCIENTIFIC CALCULATOR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <AnimatePresence>
                {showCalculator && (
                    <ScientificCalculator onClose={() => setShowCalculator(false)} />
                )}
            </AnimatePresence>
            {/* ── FULLSCREEN WARNING OVERLAY ────────────────────────────── */}
            {!isReviewMode && !isFullscreen && !showResults && !showPauseDialog && (
                <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        {/* Warning Icon */}
                        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400 animate-bounce">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                Fullscreen Mode Required
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                You have exited fullscreen mode. For security and anti-cheating compliance, you must remain in fullscreen mode during the exam.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                onClick={toggleFullscreen}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all text-sm"
                            >
                                Return to Fullscreen
                            </button>
                            <button
                                onClick={() => {
                                    setShowSubmitDialog(true)
                                }}
                                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl font-medium transition-all text-xs"
                            >
                                Submit &amp; Exit Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
