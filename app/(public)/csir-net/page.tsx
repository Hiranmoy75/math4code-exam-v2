import { ExamHero } from "@/components/exam/ExamHero";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { ExamFAQ } from "@/components/exam/ExamFAQ";
import { AppDownloadSection } from "@/components/AppDownloadSection";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamContent } from "@/components/exam/ExamContent";
import { BookOpen, CheckCircle, GraduationCap, LayoutDashboard, HelpCircle } from "lucide-react";

export const metadata = {
    title: "CSIR NET Mathematical Sciences 2026 Batch | Math4Code",
    description: "Join India's most structured CSIR NET Mathematics Coaching. Detailed video lectures, topic-wise tests, and previous year solutions for June & Dec 2026 attempts.",
};

const FEATURES = [
    {
        title: "1000+ Hours of Live Classes",
        description: "Comprehensive coverage of Real Analysis, Linear Algebra, Complex Analysis, and more with doubt clearing.",
        icon: LayoutDashboard,
    },
    {
        title: "Structured Test Series",
        description: "Practice with 20+ Full-Length Mock Tests and 50+ Topic-wise tests designed as per the latest NTA pattern.",
        icon: CheckCircle,
    },
    {
        title: "Detailed PDF Notes",
        description: "Get concise and effective revision notes for every chapter to boost your last-minute preparation.",
        icon: BookOpen,
    },
    {
        title: "Previous Year Solutions",
        description: "Step-by-step video solutions for the last 10 years of CSIR NET questions to understand exam trends.",
        icon: GraduationCap,
    },
    {
        title: "Personalized Mentorship",
        description: "One-on-one guidance from AIR holders to help you plan your study schedule effectively.",
        icon: HelpCircle,
    },
];

const CONTENT = [
    {
        heading: "About CSIR NET Mathematical Sciences",
        body: (
            <>
                <p>
                    The CSIR NET (Council of Scientific and Industrial Research National Eligibility Test) for Mathematical Sciences is one of the most prestigious exams in India for aspiring researchers and lecturers. Qualifying this exam opens doors to Junior Research Fellowship (JRF) and Assistant Professor roles in top Indian universities and colleges.
                </p>
                <p>
                    Our course is designed to take you from basic concepts to advanced problem-solving techniques required to crack Part B and Part C of the exam with high accuracy.
                </p>
            </>
        ),
    },
    {
        heading: "Why Choose Math4Code for CSIR NET?",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Expert Faculty:</strong> Learn from IITians and NET JRF qualified educators.</li>
                <li><strong>Adaptive Learning:</strong> Our platform identifies your weak areas and suggests practice questions.</li>
                <li><strong>Community Support:</strong> Join a vibrant community of math enthusiasts for peer learning.</li>
            </ul>
        ),
    },
];

const FAQS = [
    {
        question: "What is the eligibility for CSIR NET Mathematics?",
        answer: "Candidates with an M.Sc. or equivalent degree in Mathematics or Statistics with at least 55% marks (50% for SC/ST/PwD) are eligible.",
    },
    {
        question: "Is this course suitable for beginners?",
        answer: "Yes! We start from the very basics of every topic before moving to advanced concepts and Previous Year Questions (PYQs).",
    },
    {
        question: "Can I access the course on mobile?",
        answer: "Absolutely. Our platform is fully responsive and works seamlessly on mobile devices, tablets, and desktops.",
    },
    {
        question: "Do you provide doubt support?",
        answer: "Yes, we have dedicated doubt clearing sessions and a 24/7 discussion forum where experts answer your queries.",
    },
];

export default function CSIRNETPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="Crack CSIR NET Mathematical Sciences 2026"
                subtitle="The most comprehensive and structured online coaching for CSIR NET Mathematics. Master Real Analysis, Linear Algebra, and more with expert guidance."
                ctaText="Start Learning Now"
                ctaHref="/csir-net/course"
                secondaryCtaText="View Syllabus"
                secondaryCtaHref="/csir-net/syllabus"
                features={["Live Classes", "Test Series", "PYQ Solutions", "1-on-1 Mentorship"]}
            />

            <ExamFeatures
                features={FEATURES}
                sectionTitle="Everything You Need to Rank High"
                sectionSubtitle="A complete ecosystem for your mathematical journey."
            />

            <ExamContent content={CONTENT} />

            <AppDownloadSection />

            <ExamCTA
                title="Ready to achieve your JRF dream?"
                subtitle="Join thousands of students preparing with Math4Code. The best time to start is now."
                ctaText="Join 2026 Batch"
                ctaLink="/auth/sign-up"
            />

            <ExamFAQ faqs={FAQS} />
        </div>
    );
}
