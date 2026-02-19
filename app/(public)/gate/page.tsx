import { ExamHero } from "@/components/exam/ExamHero";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { ExamFAQ } from "@/components/exam/ExamFAQ";
import { AppDownloadSection } from "@/components/AppDownloadSection";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamContent } from "@/components/exam/ExamContent";
import { BookOpen, CheckCircle, GraduationCap, LayoutDashboard, Database } from "lucide-react";

export const metadata = {
    title: "GATE Mathematics 2026 Batch | Math4Code",
    description: "Comprehensive online coaching for GATE Mathematics (MA). Crack GATE with top rank using our structured course, test series, and mentorship.",
};

const FEATURES = [
    {
        title: "Complete GATE Syllabus",
        description: "Detailed coverage of Calculus, Linear Algebra, Real Analysis, Complex Analysis, ODE, PDE, Algebra, Topology, and more.",
        icon: LayoutDashboard,
    },
    {
        title: "Topic-wise & Subject-wise Tests",
        description: "Rigorous practice with tests designed to match the GATE exam pattern and difficulty level.",
        icon: CheckCircle,
    },
    {
        title: "General Aptitude Included",
        description: "Special sessions and tests for the General Aptitude section to maximize your score.",
        icon: Database, // Representing general/misc
    },
    {
        title: "Previous Year Solutions",
        description: "Learn smart techniques to solve previous year GATE questions quickly and accurately.",
        icon: GraduationCap,
    },
];

const CONTENT = [
    {
        heading: "About GATE Mathematics (MA)",
        body: (
            <>
                <p>
                    The Graduate Aptitude Test in Engineering (GATE) for Mathematics is a gateway to M.Tech programs in top IITs and IISc, as well as lucrative jobs in Public Sector Undertakings (PSUs).
                </p>
                <p>
                    A good rank in GATE opens up opportunities for PhD programs with high stipends and research fellowships. Our course is tailor-made to help you master the concepts required for this competitive exam.
                </p>
            </>
        ),
    },
    {
        heading: "Key Highlights of Our Program",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Focused Approach:</strong> We cover the syllabus purely from the GATE perspective, emphasizing problem-solving speed.</li>
                <li><strong>Regular Assessments:</strong> Weekly tests to track your progress and improve consistency.</li>
                <li><strong>Post-GATE Guidance:</strong> Support for IIT/IISc interview preparation and counseling.</li>
            </ul>
        ),
    },
];

const FAQS = [
    {
        question: "What is the eligibility for GATE Mathematics?",
        answer: "Candidates currently in the 3rd or higher years of any undergraduate degree program or who have already completed any government-approved degree program in Engineering / Technology / Architecture / Science / Commerce / Arts are eligible.",
    },
    {
        question: "Does the course cover General Aptitude?",
        answer: "Yes, we cover the entire General Aptitude syllabus which constitutes 15 marks in the GATE exam.",
    },
    {
        question: "What is the validity of the course?",
        answer: "The course is valid until the GATE 2026 exam date, ensuring you have access for revision till the very end.",
    },
];

export default function GATEPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="Crack GATE Mathematics 2026"
                subtitle="Achieve a top rank in GATE MA with India's best online coaching platform. Structured learning for serious aspirants."
                ctaText="Join Course"
                ctaHref="/gate/course"
                secondaryCtaText="Syllabus PDF"
                secondaryCtaHref="/gate/syllabus"
                features={["Complete Syllabus", "Test Series", "Aptitude Covered", "Interview Prep"]}
                badge="Target GATE 2026"
            />

            <ExamFeatures
                features={FEATURES}
                sectionTitle="Secure Your PSU Job or IIT Seat"
                sectionSubtitle="Everything you need to succeed in GATE Mathematics."
            />

            <ExamContent content={CONTENT} />

            <AppDownloadSection />

            <ExamCTA
                title="Start Your GATE Preparation"
                subtitle="Join the league of toppers. Structure your studies with our expert guidance."
                ctaText="Enroll for GATE 2026"
                ctaLink="/auth/sign-up"
            />

            <ExamFAQ faqs={FAQS} title="GATE FAQs" />
        </div>
    );
}
