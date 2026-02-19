import { ExamHero } from "@/components/exam/ExamHero";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamFAQ } from "@/components/exam/ExamFAQ";
import { ExamContent } from "@/components/exam/ExamContent";
import { BookOpen, Video, Users, MessageSquare, Award, Clock } from "lucide-react";

export const metadata = {
    title: "GATE Mathematics Online Coaching 2026 | Math4Code",
    description: "Join Math4Code's comprehensive GATE Mathematics online course. Live interactive classes, doubt clearing, and study material.",
};

const FEATURES = [
    { title: "Live Classes", description: "Interactive sessions with GATE toppers.", icon: Video },
    { title: "Recorded Access", description: "Watch lectures anytime, anywhere.", icon: Clock },
    { title: "Study PDF Notes", description: "Concise notes for quick revision.", icon: BookOpen },
    { title: "Doubt Solving", description: "24/7 dedicated support.", icon: MessageSquare },
    { title: "Mentorship", description: "Personal guidance for strategy.", icon: Users },
    { title: "Mock Interviews", description: "Prepare for post-GATE interviews.", icon: Award },
];

const CURRICULUM = [
    {
        heading: "Core GATE Topics",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Calculus & Real Analysis:</strong> Functions, Integration, Series.</li>
                <li><strong>Linear Algebra:</strong> Matrices, Vector Spaces.</li>
                <li><strong>Complex Analysis:</strong> Analytical functions, Residues.</li>
                <li><strong>Differential Equations:</strong> ODEs and PDEs.</li>
                <li><strong>Algebra:</strong> Groups, Rings, Fields.</li>
            </ul>
        ),
    },
    {
        heading: "Applied & General Aptitude",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Numerical Analysis:</strong> Methods for roots and integration.</li>
                <li><strong>Functional Analysis & Topology:</strong> Key concepts.</li>
                <li><strong>General Aptitude:</strong> Verbal & Numerical Ability.</li>
            </ul>
        )
    }
];

export default function GATECoursePage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="GATE Mathematics Online Course (2026 Batch)"
                subtitle="Your complete roadmap to a top GATE rank. Master the syllabus with live classes and structural learning paths."
                ctaText="Enroll Now"
                ctaHref="/auth/sign-up"
                secondaryCtaText="Download Syllabus"
                secondaryCtaHref="/gate/syllabus"
                features={["Live + Recorded", "Doubt Support", "Test Series Included"]}
                badge="Enrollment Open"
            />

            <ExamFeatures
                features={FEATURES}
                sectionTitle="Why Join Our GATE batch?"
                sectionSubtitle="Designed for serious aspirants aiming for top IITs."
            />

            <ExamContent content={CURRICULUM} />

            <ExamCTA
                title="Start Your GATE Journey"
                subtitle="Don't wait. The earlier you start, the better your chances of success."
                ctaText="Join 2026 Batch"
                ctaLink="/auth/sign-up"
            />

            <ExamFAQ
                title="Course FAQs"
                faqs={[
                    { question: "What is the duration?", answer: "6-8 months covering syllabus + revision." },
                    { question: "Is Test Series included?", answer: "Yes, full test series is included." },
                    { question: "Do you cover General Aptitude?", answer: "Yes, completely." }
                ]}
            />
        </div>
    );
}
