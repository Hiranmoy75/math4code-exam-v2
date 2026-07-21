"use client"

import React, { useEffect, useState, useRef, memo } from "react"

interface ExamTimerProps {
    initialSeconds: number
    onTimeUp: () => void
    timeRef: React.MutableRefObject<number>
    isActive: boolean
}

function ExamTimerComponent({ initialSeconds, onTimeUp, timeRef, isActive }: ExamTimerProps) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
    const onTimeUpRef = useRef(onTimeUp)

    useEffect(() => {
        setSecondsLeft(initialSeconds)
        timeRef.current = initialSeconds
    }, [initialSeconds, timeRef])

    useEffect(() => {
        onTimeUpRef.current = onTimeUp
    }, [onTimeUp])

    useEffect(() => {
        if (!isActive || secondsLeft <= 0) return

        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    onTimeUpRef.current()
                    return 0
                }
                const newVal = prev - 1
                timeRef.current = newVal
                return newVal
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isActive, timeRef])

    useEffect(() => {
        if (initialSeconds > 0 && secondsLeft === 0) return
        if (secondsLeft <= 0 && isActive) {
            onTimeUpRef.current()
        }
    }, [secondsLeft, isActive, initialSeconds])

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600)
        const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0")
        const sec = (s % 60).toString().padStart(2, "0")
        return h > 0 ? `${h}:${m}:${sec}` : `${m}:${sec}`
    }

    const isCritical = secondsLeft < 300 // 5 mins
    return (
        <span className={`font-mono font-bold tabular-nums text-sm md:text-base ${
            isCritical ? "text-rose-600 dark:text-rose-400 animate-pulse" : "text-slate-800 dark:text-slate-100"
        }`}>
            Time Left : {formatTime(secondsLeft)}
        </span>
    )
}

export const ExamTimer = memo(ExamTimerComponent)
