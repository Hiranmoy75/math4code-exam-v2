"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, User, CheckCircle2, Clock, BookOpen } from "lucide-react"

interface ExamInstructionPageProps {
    examTitle: string
    durationMinutes: number
    studentName?: string
    onReady: () => void
    onBack?: () => void  // optional: go back to landing
}

// ─── Instruction content based on exam type ───────────────────────────────────

type ExamType = "JAM" | "CSIR" | "GATE" | "DEFAULT"

function detectExamType(title: string): ExamType {
    const upper = title.toUpperCase()
    if (upper.includes("JAM")) return "JAM"
    if (upper.includes("CSIR") || upper.includes("NET")) return "CSIR"
    if (upper.includes("GATE")) return "GATE"
    return "DEFAULT"
}

function getPage1Instructions(type: ExamType, durationMinutes: number) {
    const common = [
        { text: <>Total duration of examination is <strong>{durationMinutes} minutes</strong>.</> },
        { text: <>A Virtual Scientific Calculator is available on the top right hand side of the screen. Any other calculators, graph sheets, tables, smart watches, watches, bags, pouches, Bluetooth devices are <strong>NOT</strong> allowed.</> },
        { text: <>The clock will be set at the server. The countdown timer at the top right corner of the screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You need not terminate the examination or submit your paper.</> },
        { text: <>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</> },
    ]

    const specific: Record<ExamType, React.ReactNode[]> = {
        JAM: [
            <>This is a Mock Test for candidates to familiarize themselves with the JAM Examination pattern. Candidates are advised to practice with Online Calculator as its functionality will be different from Physical Calculators used.</>,
        ],
        CSIR: [
            <>This is a Mock Test for candidates to familiarize themselves with the CSIR NET Examination pattern. Candidates are advised to practice with Online Calculator as its functionality will be different from Physical Calculators used.</>,
        ],
        GATE: [
            <>This is a Mock Test for candidates to familiarize themselves with the GATE Examination pattern. Candidates are advised to practice with Online Calculator as its functionality will be different from Physical Calculators used.</>,
        ],
        DEFAULT: [
            <>This is a Mock Test to help you familiarize yourself with the examination pattern.</>,
        ],
    }

    return { specific: specific[type], common }
}

function getPage2Instructions(type: ExamType) {
    const jamInstructions = [
        {
            text: <>
                <strong>Section – A</strong> contains <strong>Multiple Choice Questions (MCQ)</strong>. Each MCQ type question has four choices, out of which only one choice is the correct answer. This section has 10 Questions carrying a total of 50 marks. Q.1 – Q.10 carry 1 mark each and Questions Q.11 – Q.30 carry 2 marks each.
            </>
        },
        {
            text: <>
                <strong>Section – B</strong> contains <strong>Multiple Select Questions (MSQ)</strong>. Each MSQ type question has four choices, out of which there may be one or more than one choice(s) that are correct. The candidate gets marks only if all the correct choices are selected and no incorrect choice(s) are selected. This section has 10 Questions and carry a total of 20 marks. Questions Q.31 – Q.40 in this section carry 2 marks each.
            </>
        },
        {
            text: <>
                <strong>Section – C</strong> contains <strong>Numerical Answer Type (NAT)</strong> questions. For these questions, the answer is a real number which needs to be entered using the virtual numerical keypad on the monitor. No choices will be shown for this type of questions. This section has 20 Questions and carry a total of 30 marks. Q.41 – Q.50 carry 1 mark each and Questions Q.51 – Q.60 carry 2 marks each.
            </>
        },
        {
            text: <>
                In all sections, questions not answered or not saved will result in zero mark. In <strong>Section – A</strong> (MCQ), wrong answer will result in <strong>NEGATIVE</strong> marks. For all 1 mark questions, 1/3 marks will be deducted for each wrong answer. For all 2 marks questions, 2/3 marks will be deducted for each wrong answer. In <strong>Section – B</strong> (MSQ), there is <strong>NO NEGATIVE</strong> and <strong>NO PARTIAL</strong> marking provision. There is <strong>NO NEGATIVE</strong> marking in <strong>Section – C</strong> (NAT).
            </>
        },
        {
            text: <>
                A Virtual Scientific Calculator is provided at top right corner on your computer screen. Any other calculators, charts, graph sheets, tables, smart watches, watches, bags, pouches, Bluetooth devices or any other prohibited material are <strong>NOT</strong> permitted inside the examination hall.
            </>
        },
        {
            text: <>
                Candidates are advised to use the online calculator for their calculations. Keep note of the procedure to use the online calculator.
            </>
        },
    ]

    const csirInstructions = [
        {
            text: <>
                <strong>Part A</strong> covers <strong>General Aptitude</strong>. This part shall carry 20 questions with two marks each. Candidates shall attempt any 15 questions. There will be negative marking of 0.5 marks for each wrong answer and a score of zero marks for each unattempted question.
            </>
        },
        {
            text: <>
                <strong>Part B</strong> covers subject-specific core topics. It shall carry 40 Multiple Choice Questions (MCQs), generally covering the topics given in the syllabus. A candidate shall attempt any 35 questions. There will be negative marking of 0.5 marks for each wrong answer.
            </>
        },
        {
            text: <>
                <strong>Part C</strong> shall contain higher value questions that may test the candidate's knowledge of scientific concepts and/or application of the scientific concepts. A candidate shall be required to answer any 25 questions. There will be negative marking of 0.5 marks for each wrong answer.
            </>
        },
        {
            text: <>
                Questions not answered will result in zero marks. Candidates are advised to read all questions carefully and use the online calculator provided. Any external calculator, mobile phone or electronic device is strictly <strong>NOT</strong> allowed.
            </>
        },
    ]

    const gateInstructions = [
        {
            text: <>
                The question paper will consist of questions of <strong>Multiple Choice Type (MCQ)</strong> and <strong>Numerical Answer Type (NAT)</strong>. MCQ carries 1 or 2 marks each. For 1-mark MCQs, 1/3 mark will be deducted for a wrong answer. For 2-mark MCQs, 2/3 mark will be deducted.
            </>
        },
        {
            text: <>
                <strong>Numerical Answer Type (NAT)</strong> questions: Answers are real numbers, to be entered via the virtual keyboard. There is <strong>NO negative marking</strong> for NAT questions.
            </>
        },
        {
            text: <>
                The GATE paper may also contain <strong>Multiple Select Questions (MSQ)</strong>. Each MSQ has one or more correct answer(s) among the four given choices. There is <strong>NO negative</strong> and <strong>NO partial</strong> marking for MSQ questions.
            </>
        },
        {
            text: <>
                Use of physical calculator, mobile phone, watch or any electronic gadget is <strong>strictly prohibited</strong>. Only the online virtual calculator provided on screen is permitted.
            </>
        },
    ]

    const defaultInstructions = [
        {
            text: <>
                <strong>Multiple Choice Questions (MCQ)</strong>: Each question has one correct answer out of four choices. Wrong answers may attract negative marking as specified.
            </>
        },
        {
            text: <>
                <strong>Multiple Select Questions (MSQ)</strong>: One or more choices may be correct. Marks are awarded only when all correct choices are selected. No negative marking applies.
            </>
        },
        {
            text: <>
                <strong>Numerical Answer Type (NAT)</strong>: Enter the exact numerical answer using the virtual keyboard. No negative marking applies.
            </>
        },
        {
            text: <>
                Questions not answered will receive zero marks. Use the online calculator provided on screen. No external devices are permitted.
            </>
        },
    ]

    const map: Record<ExamType, typeof jamInstructions> = {
        JAM: jamInstructions,
        CSIR: csirInstructions,
        GATE: gateInstructions,
        DEFAULT: defaultInstructions,
    }

    return map[type]
}

const DECLARATION = `I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations.`

// ─── Palette Legend ──────────────────────────────────────────────────────────

function PaletteLegend() {
    const items = [
        { color: "bg-emerald-500", text: "Answered" },
        { color: "bg-rose-500", text: "Not Answered" },
        { color: "bg-slate-300 dark:bg-slate-600", text: "Not Visited" },
        { color: "bg-amber-500", text: "Marked for Review" },
        { color: "bg-emerald-500 ring-2 ring-amber-500", text: "Answered & Marked for Review (will also be evaluated)" },
    ]
    return (
        <div className="mt-3 ml-4 space-y-1.5">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span className={`w-7 h-7 rounded-sm flex-shrink-0 ${item.color}`} />
                    <span>{item.text}</span>
                </div>
            ))}
        </div>
    )
}

// ─── Student Panel ───────────────────────────────────────────────────────────

function StudentPanel({ name }: { name?: string }) {
    return (
        <div className="flex flex-col items-center gap-3 p-5 bg-slate-50 dark:bg-slate-800/50 border-l border-slate-200 dark:border-slate-700 h-full">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center shadow-inner">
                <User className="w-10 h-10 text-slate-500 dark:text-slate-400" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">
                {name || "Student"}
            </span>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ExamInstructionPage({
    examTitle,
    durationMinutes,
    studentName,
    onReady,
    onBack,
}: ExamInstructionPageProps) {
    const [page, setPage] = useState<1 | 2>(1)
    const [agreed, setAgreed] = useState(false)

    const examType = detectExamType(examTitle)
    const { specific, common } = getPage1Instructions(examType, durationMinutes)
    const page2Instructions = getPage2Instructions(examType)

    const examTypeLabel: Record<ExamType, string> = {
        JAM: "IIT JAM",
        CSIR: "CSIR NET",
        GATE: "GATE",
        DEFAULT: "Examination",
    }

    const currentYear = new Date().getFullYear()

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
                style={{ minHeight: "540px", maxHeight: "90vh" }}>

                {/* ── Header ── */}
                <div className="shrink-0 bg-[#b8d8e8] dark:bg-[#1e3a4a] px-5 py-3 border-b border-[#a0c8dc] dark:border-[#2a4a5e]">
                    <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                        {page === 1 ? "Instructions" : "Other Important Instructions"}
                    </h1>
                </div>

                {/* ── Body ── */}
                <div className="flex flex-1 min-h-0">
                    {/* Left: Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            {page === 1 ? (
                                <motion.div
                                    key="page1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    {/* Title */}
                                    <h2 className="text-center text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                                        {examTypeLabel[examType]} {currentYear}: General Instructions during Examination
                                    </h2>

                                    {/* Specific intro note */}
                                    {specific.map((text, i) => (
                                        <p key={i} className="text-sm text-slate-700 dark:text-slate-300 text-center font-medium leading-relaxed border-b border-slate-100 dark:border-slate-800 pb-4">
                                            {text}
                                        </p>
                                    ))}

                                    {/* Common numbered instructions */}
                                    <ol className="list-decimal list-outside ml-5 space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {common.map((item, i) => (
                                            <li key={i}>{item.text}</li>
                                        ))}
                                    </ol>

                                    {/* Palette Legend */}
                                    <PaletteLegend />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="page2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <ol className="list-decimal list-outside ml-5 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {page2Instructions.map((item, i) => (
                                            <li key={i}>{item.text}</li>
                                        ))}
                                    </ol>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Student Panel */}
                    <div className="hidden sm:block w-36 md:w-44 shrink-0">
                        <StudentPanel name={studentName} />
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-5 py-3">
                    {/* Page 2: Declaration checkbox */}
                    {page === 2 && (
                        <label className="flex items-start gap-2 mb-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600 shrink-0"
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                                {DECLARATION}
                            </span>
                        </label>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between">
                        <div>
                            {page === 1 && onBack && (
                                <button
                                    onClick={onBack}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </button>
                            )}
                            {page === 2 && (
                                <button
                                    onClick={() => setPage(1)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Page indicator */}
                            <div className="flex gap-1.5">
                                {[1, 2].map((p) => (
                                    <div
                                        key={p}
                                        className={`w-2 h-2 rounded-full transition-colors ${page === p ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
                                    />
                                ))}
                            </div>

                            {page === 1 ? (
                                <button
                                    onClick={() => setPage(2)}
                                    className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={onReady}
                                    disabled={!agreed}
                                    className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded transition-all ${
                                        agreed
                                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                                            : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                    }`}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    I am ready to begin
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
