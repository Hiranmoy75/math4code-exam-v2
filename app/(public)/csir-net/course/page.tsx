import { ExamHero } from "@/components/exam/ExamHero";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamFAQ } from "@/components/exam/ExamFAQ";
import { ExamContent } from "@/components/exam/ExamContent";
import { BookOpen, Video, Users, MessageSquare, Award, Clock } from "lucide-react";

export const metadata = {
    title: "CSIR NET Mathematics Online Coaching | LIVE Classes",
    description: "Join Math4Code's comprehensive CSIR NET Mathematical Sciences online course. Live interactive classes, doubt clearing, and study material.",
};

const COURSE_FEATURES = [
    {
        title: "Live Interactive Classes",
        description: "Learn concepts in real-time with our expert faculty. Ask doubts instantly during the class.",
        icon: Video,
    },
    {
        title: "Recorded Backup",
        description: "Missed a class? No worries. Get unlimited access to recorded sessions for revision anytime.",
        icon: Clock,
    },
    {
        title: "Comprehensive Study Material",
        description: "Curated PDF notes and problem sheets for every topic to ensure thorough practice.",
        icon: BookOpen,
    },
    {
        title: "Dedicated Doubt Engine",
        description: "Post your doubts on our platform and get solutions from experts within 24 hours.",
        icon: MessageSquare,
    },
    {
        title: "Mentorship Program",
        description: "Regular guidance sessions to help you stay motivated and on track with your preparation.",
        icon: Users,
    },
    {
        title: "Proven Results",
        description: "Join a legacy of success with hundreds of our students qualifying JRF and LS.",
        icon: Award,
    },
];

const COURSE_CURRICULUM = [
    {
        heading: "Core Mathematics Modules",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Module 1: Real Analysis</strong> (Sequences, Series, Functions, Integration)</li>
                <li><strong>Module 2: Linear Algebra</strong> (Vector Spaces, Matrices, Transformations)</li>
                <li><strong>Module 3: Complex Analysis</strong> (Analytic Functions, Integration)</li>
                <li><strong>Module 4: Modern Algebra</strong> (Group Theory, Ring Theory)</li>
            </ul>
        ),
    },
    {
        heading: "Advanced & Applied Modules",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Module 5: Ordinary Differential Equations</strong></li>
                <li><strong>Module 6: Partial Differential Equations</strong></li>
                <li><strong>Module 7: Numerical Analysis & Calculus of Variations</strong></li>
                <li><strong>Module 8: General Aptitude (Part A)</strong> Strategy & Practice</li>
            </ul>
        ),
    },
];

export default function CSIRNETCoursePage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="CSIR NET Mathematics Online Course (2026 Batch)"
                subtitle="Your complete roadmap to JRF success. Master the syllabus with live classes, structural learning paths, and personal mentorship."
                ctaText="Enroll Now"
                ctaHref="/auth/sign-up"
                secondaryCtaText="Download Syllabus"
                secondaryCtaHref="/csir-net/syllabus"
                features={["Live + Recorded", "Doubt Support", "Test Series Included"]}
                badge="Enrollment Open"
            />

            <ExamFeatures
                features={COURSE_FEATURES}
                sectionTitle="Why Math4Code?"
                sectionSubtitle="We provide everything you need to crack the exam in your first attempt."
            />

            <ExamContent content={COURSE_CURRICULUM} />

            <ExamCTA
                title="Start Your Journey Today"
                subtitle="Don't wait. The earlier you start, the better your chances of success."
                ctaText="Join 2026 Batch"
                ctaLink="/auth/sign-up"
            />

            <ExamFAQ
                title="Course FAQs"
                faqs={[
                    { question: "What is the duration of the course?", answer: "The course duration is 6-8 months, covering the entire syllabus comprehensively before the exam." },
                    { question: "Is the Test Series included?", answer: "Yes! The full Test Series is included with the Online Course at no extra cost." },
                    { question: "Can I watch videos offline?", answer: "Yes, you can download videos in our app to watch them without internet." },
                    { question: "What is the language of instruction?", answer: "Classes are conducted in a mix of Hindi and English (Hinglish) to ensure best understanding." }
                ]}
            />
        </div>
    );
}
