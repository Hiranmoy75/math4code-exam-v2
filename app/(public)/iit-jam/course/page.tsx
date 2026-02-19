import { ExamHero } from "@/components/exam/ExamHero";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamFAQ } from "@/components/exam/ExamFAQ";
import { ExamContent } from "@/components/exam/ExamContent";
import { BookOpen, Video, Users, MessageSquare, Award, Clock } from "lucide-react";

export const metadata = {
    title: "IIT JAM Mathematics Online Coaching 2026 | Math4Code",
    description: "Join Math4Code's comprehensive IIT JAM Mathematics online course. Live interactive classes, doubt clearing, and study material.",
};

const FEATURES = [
    { title: "IITian Faculty", description: "Mentored by IIT Alumni.", icon: Video },
    { title: "Recorded Access", description: "Watch lectures anytime.", icon: Clock },
    { title: "Study Material", description: "Concise notes for quick revision.", icon: BookOpen },
    { title: "Doubt Solving", description: "24/7 dedicated support.", icon: MessageSquare },
    { title: "Strategic Mentorship", description: "Guidance on how to crack JAM.", icon: Users },
    { title: "Previous Year Analysis", description: "Trend analysis of last 15 years.", icon: Award },
];

const CURRICULUM = [
    {
        heading: "Core JAM Syllabus",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Sequences & Series:</strong> Convergence, Tests, Power Series.</li>
                <li><strong>Functions of One Variable:</strong> Limit, Continuity, Differentiation, Integration.</li>
                <li><strong>Linear Algebra:</strong> Vector Spaces, Matrices, Systems of Equations.</li>
                <li><strong>Functions of Two Variables:</strong> Limits, Partial Derivatives, Maxima/Minima.</li>
                <li><strong>Integral Calculus:</strong> Double and Triple Integrals.</li>
                <li><strong>Differential Equations:</strong> First Order, Linear Higher Order.</li>
                <li><strong>Vector Calculus:</strong> Gradient, Divergence, Curl, Line Integrals.</li>
                <li><strong>Group Theory:</strong> Groups, Subgroups, Homomorphisms.</li>
            </ul>
        ),
    },
];

export default function IITJAMCoursePage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="IIT JAM Mathematics Online Course (2026 Batch)"
                subtitle="Your ticket to IITs. Master the syllabus with structured learning and expert guidance."
                ctaText="Enroll Now"
                ctaHref="/auth/sign-up"
                secondaryCtaText="Download Syllabus"
                secondaryCtaHref="/iit-jam/syllabus"
                features={["Live + Recorded", "Doubt Support", "Test Series Included"]}
                badge="Enrollment Open"
            />

            <ExamFeatures
                features={FEATURES}
                sectionTitle="Why Math4Code for JAM?"
                sectionSubtitle="We make mathematics easy and enjoyable."
            />

            <ExamContent content={CURRICULUM} />

            <ExamCTA
                title="Start Your IIT Journey"
                subtitle="Don't wait. The earlier you start, the better your chances of success."
                ctaText="Join 2026 Batch"
                ctaLink="/auth/sign-up"
            />

            <ExamFAQ
                title="Course FAQs"
                faqs={[
                    { question: "Who teaches the course?", answer: "The course is taught by experienced faculty who are IIT alumni and NET/GATE qualified." },
                    { question: "Is Test Series included?", answer: "Yes, full test series is included." },
                    { question: "Is the course helpful for TIFR/NBHM?", answer: "Yes, we cover additional topics required for these exams as well." }
                ]}
            />
        </div>
    );
}
