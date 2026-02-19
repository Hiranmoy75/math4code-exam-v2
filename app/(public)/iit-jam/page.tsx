import { ExamHero } from "@/components/exam/ExamHero";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { ExamFAQ } from "@/components/exam/ExamFAQ";
import { AppDownloadSection } from "@/components/AppDownloadSection";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamContent } from "@/components/exam/ExamContent";
import { BookOpen, CheckCircle, GraduationCap, LayoutDashboard, Globe } from "lucide-react";

export const metadata = {
    title: "IIT JAM Mathematics Coaching 2026 Batch | Math4Code",
    description: "Comprehensive online coaching for IIT JAM Mathematics. Crack JAM with top rank using our structured course, mock tests, and mentorship by IIT alumni.",
};

const FEATURES = [
    {
        title: "Complete JAM Syllabus",
        description: "In-depth coverage of Real Analysis, Multivariable Calculus, Diff. Eq., Algebra, and Vector Calculus.",
        icon: LayoutDashboard,
    },
    {
        title: "MSc Entrance Ready",
        description: "Also covers syllabus for TIFR, NBHM, and CMI entrances alongside JAM.",
        icon: Globe,
    },
    {
        title: "Mock Tests & Analysis",
        description: "Practice with exam-level questions and analyze your performance with AI insights.",
        icon: CheckCircle,
    },
    {
        title: "PYQ Solutions",
        description: "Master previous years' questions with our detailed video solutions and shortcut tricks.",
        icon: GraduationCap,
    },
];

const CONTENT = [
    {
        heading: "About IIT JAM Mathematics",
        body: (
            <>
                <p>
                    The Joint Admission Test for Masters (JAM) is the gateway to M.Sc. and Joint M.Sc.-Ph.D. programs at the prestigious IITs and IISc.
                </p>
                <p>
                    Qualifying JAM with a good rank is the first step towards a rewarding career in research, academia, or industry. Our course is designed to build a strong mathematical foundation required for these top institutes.
                </p>
            </>
        ),
    },
    {
        heading: "Why Choose Math4Code?",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>IITian Faculty:</strong> Learn from those who have cracked the exam themselves.</li>
                <li><strong>Structured Learning:</strong> From basics to advanced problem solving.</li>
                <li><strong>Doubt Clearing:</strong> Instant support for all your queries.</li>
            </ul>
        ),
    },
];

const FAQS = [
    {
        question: "What is the eligibility for IIT JAM Mathematics?",
        answer: "A Bachelor's degree with Mathematics as a subject for at least two years/four semesters.",
    },
    {
        question: "Does the course cover other MSc entrances?",
        answer: "Yes, the syllabus overlaps significantly with TIFR, NBHM, and CMI. We cover topics relevant to these exams as well.",
    },
    {
        question: "Is the course valid until the exam?",
        answer: "Yes, the course remains accessible until the date of the IIT JAM 2026 exam.",
    },
];

export default function IITJAMPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="Crack IIT JAM Mathematics 2026"
                subtitle="Secure your seat in IITs. Join India's most structured online coaching for IIT JAM MA."
                ctaText="Join Course"
                ctaHref="/iit-jam/course"
                secondaryCtaText="Syllabus PDF"
                secondaryCtaHref="/iit-jam/syllabus"
                features={["Complete Syllabus", "Test Series", "TIFR/NBHM Coverage", "1-on-1 Mentorship"]}
                badge="Target JAM 2026"
            />

            <ExamFeatures
                features={FEATURES}
                sectionTitle="Your Gateway to IITs"
                sectionSubtitle="Everything you need to master undergraduate mathematics."
            />

            <ExamContent content={CONTENT} />

            <AppDownloadSection />

            <ExamCTA
                title="Start Your IIT Journey"
                subtitle="Experience the best learning environment with Math4Code."
                ctaText="Enroll for JAM 2026"
                ctaLink="/auth/sign-up"
            />

            <ExamFAQ faqs={FAQS} title="IIT JAM FAQs" />
        </div>
    );
}
