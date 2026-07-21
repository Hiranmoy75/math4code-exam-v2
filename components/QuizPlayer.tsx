"use client"

import { useState, useEffect, useRef } from "react"
import { EmbeddedExam, PreviousResultView } from "@/components/EmbeddedExam"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileQuestion, ListChecks, Trophy, Play, RotateCcw, ChevronRight, History } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useExamAccess } from "@/hooks/useExamAccess"
import { ExamAccessChecker } from "@/components/ExamAccessChecker"
import { Loader2 } from "lucide-react"
import { ExamInstructionPage } from "@/components/exam/ExamInstructionPage"
import { useCurrentUser } from "@/hooks/student/useCurrentUser"

interface QuizPlayerProps {
    exam: {
        id: string
        title: string
        duration_minutes: number
        total_marks: number
        description?: string
        max_attempts?: number
    }
    attempts: any[]
    userId: string
    questionsCount: number
    maxAttempts?: number
}

export function QuizPlayer({ exam, attempts, userId, questionsCount, maxAttempts = 1 }: QuizPlayerProps) {
    const queryClient = useQueryClient()
    const playerRef = useRef<HTMLDivElement>(null)
    const [view, setView] = useState<"landing" | "instruction" | "exam" | "result" | "review">("landing")
    const [selectedAttempt, setSelectedAttempt] = useState<any>(null)

    // ⚡ INSTANT CACHED ACCESS: Use React Query for access check
    // First visit: Checks access (~50ms), caches result
    // Return visits: Uses cached result (0ms instant!)
    const { data: accessStatus, isPending: isCheckingAccess } = useExamAccess(exam.id, userId)

    // Fetch attempts with React Query
    const { data: attemptsData, refetch } = useQuery({
        queryKey: ["exam-attempts", exam.id, userId],
        queryFn: async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from("exam_attempts")
                .select("*, result:results(*)")
                .eq("exam_id", exam.id)
                .eq("student_id", userId)
                .order("created_at", { ascending: false })
            return data || []
        },
        initialData: attempts,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true
    })

    const completedAttempts = (attemptsData || []).filter((a: any) => a.status === 'submitted')
    const limit = exam.max_attempts !== undefined ? exam.max_attempts : maxAttempts
    const attemptsLeft = limit !== null && limit !== undefined ? Math.max(0, limit - completedAttempts.length) : Infinity
    const activeAttempt = (attemptsData || []).find((a: any) => a.status !== 'submitted')
    const hasAttempted = completedAttempts.length > 0 || !!activeAttempt

    const handleStart = () => {
        queryClient.invalidateQueries({ queryKey: ["exam-session"] })
        setView("instruction")
    }

    const handleViewResult = (attempt: any) => {
        setSelectedAttempt(attempt)
        setView("result")
    }

    useEffect(() => {
        if (view === "landing") {
            refetch()
        }
    }, [view, refetch])

    // ⚡ INSTANT STATE: Show skeleton ONLY while checking access for first time
    // Cached access status returns instantly (0ms), no spinner!
    if (isCheckingAccess && !accessStatus) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Access denied / locked state
    if (accessStatus && !accessStatus.accessible) {
        return (

            <ExamAccessChecker status={accessStatus} />

        )
    }

    // ── Instruction Page (before exam) ──────────────────────────────────────────
    if (view === "instruction") {
        return (
            <div ref={playerRef} className="w-full h-full bg-background flex flex-col">
                <InstructionWrapper
                    exam={exam}
                    onReady={async () => {
                        try {
                            if (playerRef.current?.requestFullscreen) {
                                await playerRef.current.requestFullscreen()
                            }
                        } catch (err) {
                            console.warn("Fullscreen request failed:", err)
                        }
                        setView("exam")
                    }}
                    onBack={() => setView("landing")}
                />
            </div>
        )
    }

    if (view === "review") {
        return (
            <div ref={playerRef} className="w-full h-full bg-background flex flex-col">
                <EmbeddedExam 
                    examId={exam.id} 
                    onExit={() => {
                        if (document.fullscreenElement) {
                            document.exitFullscreen()
                        }
                        setView("result")
                    }} 
                    isReviewMode={true} 
                    reviewAttemptId={selectedAttempt?.id} 
                />
            </div>
        )
    }

    if (view === "exam") {
        return (
            <div ref={playerRef} className="w-full h-full bg-background flex flex-col">
                <EmbeddedExam 
                    examId={exam.id} 
                    onExit={() => {
                        if (document.fullscreenElement) {
                            document.exitFullscreen()
                        }
                        setView("landing")
                    }} 
                    isRetake={hasAttempted && !activeAttempt} 
                    retakeAttempt={completedAttempts.length}
                />
            </div>
        )
    }

    if (view === "result") {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Button
                    variant="ghost"
                    onClick={() => setView("landing")}
                    className="pl-0 hover:pl-2 transition-all gap-2"
                >
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back to Quiz Overview
                </Button>
                <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                    <PreviousResultView
                        examId={exam.id}
                        userId={userId}
                        onRetake={() => setView("instruction")}
                        attemptId={selectedAttempt?.id}
                        initialResult={selectedAttempt?.result}
                        onReviewExamMode={() => setView("review")}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto bg-app transition-theme">
            {/* Main Info Card with watercolor effect */}
            <div className="lg:col-span-2 relative">
                <Card className="relative border-none border-border shadow-xl bg-card overflow-hidden z-10 transition-theme">
                    <CardHeader className="pb-2 pt-8 text-center">
                        <CardTitle className="text-4xl font-serif font-medium mb-3 tracking-wide text-foreground">
                            {exam.title}
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground max-w-xl mx-auto">
                            {exam.description || 'This exam covers the comprehensive syllabus including Algebra, Calculus, and more.'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-10 px-6 py-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 md:gap-6">
                            {/* Questions */}
                            <div className="p-4 py-8 rounded-xl border border-border flex flex-col items-center justify-center text-center shadow-sm transition-theme"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(59,130,246,0.06), transparent)',
                                }}>
                                <div className="p-2.5 rounded-full mb-3" style={{ background: 'rgba(59,130,246,0.12)' }}>
                                    <FileQuestion className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                                </div>
                                <span className="text-2xl font-bold text-foreground min-w-[2ch]">{questionsCount}</span>
                                <span className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                    Questions
                                </span>
                            </div>

                            {/* Duration */}
                            <div className="p-4 py-8 rounded-xl border border-border flex flex-col items-center justify-center text-center shadow-sm transition-theme"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(249,115,22,0.06), transparent)',
                                }}>
                                <div className="p-2.5 rounded-full mb-3" style={{ background: 'rgba(249,115,22,0.12)' }}>
                                    <Clock className="w-6 h-6 text-orange-700 dark:text-orange-300" />
                                </div>
                                <span className="text-2xl font-bold text-foreground min-w-[2ch]">{exam.duration_minutes ?? 0}m</span>
                                <span className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                    Duration
                                </span>
                            </div>

                            {/* Attempts */}
                            <div className="p-4 py-8 rounded-xl border border-border flex flex-col items-center justify-center text-center shadow-sm transition-theme"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(16,185,129,0.06), transparent)',
                                }}>
                                <div className="p-2.5 rounded-full mb-3" style={{ background: 'rgba(16,185,129,0.12)' }}>
                                    <ListChecks className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
                                </div>
                                <span className="text-2xl font-bold text-foreground min-w-[2ch]">
                                    {limit === null || limit === undefined ? '∞' : attemptsLeft}
                                </span>
                                <span className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                    Attempts Left
                                </span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="pb-8 px-6">
                        {(limit === null || limit === undefined || attemptsLeft > 0 || activeAttempt) ? (
                            <Button
                                onClick={handleStart}
                                size="lg"
                                className="w-full text-base font-bold uppercase tracking-wider py-6 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 border-0 rounded-lg transition-all transform hover:scale-[1.01]"
                            >
                                {activeAttempt ? (
                                    <>
                                        <Play className="w-5 h-5 mr-2" /> Resume Quiz
                                    </>
                                ) : hasAttempted ? (
                                    <>
                                        <RotateCcw className="w-5 h-5 mr-2" /> Retake Quiz
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 mr-2" /> Start Quiz
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button disabled size="lg" className="w-full py-6 text-base uppercase font-bold tracking-wider">
                                No Attempts Remaining
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>

            {/* Sidebar / History */}
            <div className="space-y-6">
                <Card className="border-none border-border shadow-md bg-card h-full min-h-[400px] transition-theme">
                    <CardHeader className="pb-4 border-b border-border/50">
                        <CardTitle className="text-xl font-serif tracking-wide text-foreground flex items-center gap-2">
                            HISTORY
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6 relative">
                        {/* Decorative Top Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                        {/* Timeline Line */}
                        <div className="absolute left-[38px] top-6 bottom-6 w-0.5 bg-border z-0" />

                        <div className="space-y-6 relative z-10">
                            {(completedAttempts.length === 0 && !activeAttempt) && (
                                <p className="text-sm text-muted-foreground pl-4">No history yet.</p>
                            )}

                            {activeAttempt && (
                                <div className="flex gap-4 items-start group">
                                    <div className="w-4 h-4 rounded-full bg-orange-500 border-4 border-orange-100 dark:border-orange-900 mt-1 relative z-10 shadow-sm" />
                                    <div className="flex-1 -mt-0.5">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-foreground">In Progress</h4>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">Just now</span>
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground mt-1">Attempt #{completedAttempts.length + 1}</p>
                                        <Button
                                            variant="link"
                                            onClick={handleStart}
                                            className="p-0 h-auto text-xs text-orange-600 font-semibold mt-1 hover:text-orange-700"
                                        >
                                            Resume
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {completedAttempts.map((attempt: any, idx: number) => {
                                const result = Array.isArray(attempt.result) ? attempt.result[0] : attempt.result;
                                const score = result?.score ?? result?.obtained_marks ?? 0;
                                return (
                                    <div key={attempt.id} className="flex gap-4 items-start group">
                                        <div className="w-3 h-3 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors mt-1.5 relative z-10" />
                                        <div className="flex-1 -mt-0.5">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                                    Attempt #{completedAttempts.length - idx}
                                                </h4>
                                                <span className="text-xs text-muted-foreground font-bold">
                                                    {score}/{exam.total_marks ?? '-'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleDateString() : '-'}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 px-2 text-[10px] uppercase font-bold tracking-wider opacity-100 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleViewResult(attempt)}
                                                >
                                                    View Result
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// ── Wrapper to fetch student name for instruction page ────────────────────────
function InstructionWrapper({
    exam,
    onReady,
    onBack,
}: {
    exam: { title: string; duration_minutes: number }
    onReady: () => void
    onBack: () => void
}) {
    const { data: userProfile } = useCurrentUser()
    return (
        <ExamInstructionPage
            examTitle={exam.title}
            durationMinutes={exam.duration_minutes}
            studentName={userProfile?.fullName || userProfile?.email?.split("@")[0] || "Student"}
            onReady={onReady}
            onBack={onBack}
        />
    )
}
