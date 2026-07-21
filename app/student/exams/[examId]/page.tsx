"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useCurrentUser } from "@/hooks/student/useCurrentUser"
import { EmbeddedExam } from "@/components/EmbeddedExam"
import LessonContext from "@/context/LessonContext"
import { Loader2 } from "lucide-react"
import { ExamInstructionPage } from "@/components/exam/ExamInstructionPage"

interface ExamMeta {
  title: string
  duration_minutes: number
}

export default function ExamPanelSections() {
  const supabase = createClient()
  const router = useRouter()
  const { examId } = useParams() as { examId: string }
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const isRetake = searchParams.get('retake') === 'true'

  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [instructionAccepted, setInstructionAccepted] = useState(false)
  const [examMeta, setExamMeta] = useState<ExamMeta | null>(null)

  // Auth check + Tenant membership verification
  const { data: userProfile, isLoading: isAuthLoading } = useCurrentUser()

  // Effect to handle redirection based on auth state
  useEffect(() => {
    if (!isAuthLoading) {
      if (!userProfile) {
        router.push("/auth/login")
      } else {
        const checkTenant = async () => {
          const { data: membership } = await supabase
            .from('user_tenant_memberships')
            .select('id, is_active')
            .eq('user_id', userProfile.id)
            .eq('is_active', true)
            .single()

          if (!membership) {
            console.error(`[EXAM] User ${userProfile.email} missing tenant membership`)
            router.push('/auth/login?error=Account setup incomplete. Please login again.')
          } else {
            setIsAuthChecking(false)
          }
        }
        checkTenant()
      }
    }
  }, [userProfile, isAuthLoading, router, supabase])

  // Fetch exam meta (title + duration) for instruction page
  useEffect(() => {
    if (!examId || isAuthChecking) return

    const fetchExamMeta = async () => {
      const { data } = await supabase
        .from("exams")
        .select("title, duration_minutes")
        .eq("id", examId)
        .single()

      if (data) {
        setExamMeta({ title: data.title, duration_minutes: data.duration_minutes })
      }
    }

    fetchExamMeta()
  }, [examId, isAuthChecking, supabase])

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isAuthChecking || isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // ── Instruction Page ───────────────────────────────────────────────────────
  if (!instructionAccepted) {
    // Show a minimal loader while exam meta is being fetched
    if (!examMeta) {
      return (
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading exam details...</p>
          </div>
        </div>
      )
    }

    return (
      <ExamInstructionPage
        examTitle={examMeta.title}
        durationMinutes={examMeta.duration_minutes}
        studentName={userProfile?.fullName || userProfile?.email?.split("@")[0] || "Student"}
        onReady={() => setInstructionAccepted(true)}
      />
    )
  }

  // ── Exam ───────────────────────────────────────────────────────────────────
  return (
    // Mock the LessonContext as EmbeddedExam expects it, but we don't need lesson tracking here.
    <LessonContext.Provider value={{ markComplete: () => { }, isCompleted: false }}>
      <EmbeddedExam
        examId={examId}
        isRetake={isRetake}
        onExit={() => router.push("/student/dashboard")}
        onSuccessfulSubmit={(attemptId) => {
          // In standalone mode, we redirect to the specialized results page instead of showing inline results
          router.push(`/student/results/attempt/${attemptId}`)
        }}
      />
    </LessonContext.Provider>
  )
}
