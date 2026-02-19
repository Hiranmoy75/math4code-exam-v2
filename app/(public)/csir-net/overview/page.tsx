import { ExamHero } from "@/components/exam/ExamHero";
import { ExamContent } from "@/components/exam/ExamContent";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { Info, Calendar, GraduationCap, Banknote } from "lucide-react";

export const metadata = {
    title: "About CSIR NET Mathematical Sciences | Eligibility, Pattern & Dates",
    description: "Complete guide to CSIR NET Mathematics. Check eligibility criteria, age limit, exam pattern, fellowship amount, and career opportunities.",
};

const OVERVIEW_FEATURES = [
    {
        title: "Junior Research Fellowship",
        description: "Qualify for JRF to get a monthly stipend of ₹37,000+ HRA while pursuing Ph.D.",
        icon: Banknote,
    },
    {
        title: "Assistant Professor",
        description: " Become eligible for Lecturership (LS) in Indian universities and colleges.",
        icon: GraduationCap,
    },
    {
        title: "Ph.D. Admission",
        description: "Get direct admission into Ph.D. programs at top institutes like IISERs, IITs, and CSIR labs.",
        icon: GraduationCap,
    },
    {
        title: "Exam Frequency",
        description: "The exam is conducted twice a year, typically in June and December.",
        icon: Calendar,
    },
];

const OVERVIEW_CONTENT = [
    {
        heading: "What is CSIR NET?",
        body: (
            <div className="space-y-4">
                <p>
                    The Council of Scientific and Industrial Research National Eligibility Test (CSIR NET) is a national-level exam conducted by the National Testing Agency (NTA). It determines the eligibility of Indian nationals for:
                </p>
                <ul className="list-disc pl-6">
                    <li><strong>Junior Research Fellowship (JRF)</strong></li>
                    <li><strong>Lecturership (LS) / Assistant Professor</strong></li>
                </ul>
                <p>
                    For Mathematics students, the paper code is <strong>Mathematical Sciences</strong>. It is one of the toughest and most prestigious exams in India for science graduates.
                </p>
            </div>
        ),
    },
    {
        heading: "Eligibility Criteria",
        subheading: "Educational Qualification",
        body: (
            <p>
                M.Sc. or equivalent degree/Integrated BS-MS/BS-4 years/BE/B.Tech/B.Pharma/MBBS with at least <strong>55% marks</strong> for General (UR) and General-EWS candidates and <strong>50% marks</strong> for OBC (NCL)/SC/ST/PwD/Third gender candidates.
            </p>
        ),
    },
    {
        heading: "",
        subheading: "Age Limit",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>For JRF:</strong> Maximum 28 years (relaxable up to 5 years for SC/ST/PwD/Female and 3 years for OBC-NCL).</li>
                <li><strong>For Lecturership (LS):</strong> No upper age limit.</li>
            </ul>
        ),
    },
    {
        heading: "Career Scope after CSIR NET",
        body: (
            <div className="space-y-4">
                <p>
                    Qualifying CSIR NET opens up multiple avenues:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Research:</strong> Pursue research in prestigious labs like DRDO, BARC, and ISRO.</li>
                    <li><strong>Teaching:</strong> Apply for permanent Assistant Professor positions in Universities and Colleges across India.</li>
                    <li><strong>PSU Jobs:</strong> Some Public Sector Undertakings (PSUs) use NET scores for recruitment.</li>
                    <li><strong>Consultancy:</strong> Work as a subject matter expert for EdTech companies and publication houses.</li>
                </ul>
            </div>
        ),
    }
];

export default function CSIRNETOverviewPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="About CSIR NET Mathematical Sciences"
                subtitle="Your complete guide to understanding the exam, eligibility, and opportunities."
                ctaText="Check Syllabus"
                ctaHref="/csir-net/syllabus"
                secondaryCtaText="Preparation Strategy"
                secondaryCtaHref="/csir-net/course"
                features={["Eligibility", "JRF Scope", "Exam Pattern"]}
                badge="Information Guide"
            />

            <ExamFeatures
                features={OVERVIEW_FEATURES}
                sectionTitle="Why Qualify CSIR NET?"
                sectionSubtitle="Unlock a world of academic and research opportunities."
            />

            <ExamContent content={OVERVIEW_CONTENT} />

            <ExamCTA
                title="Start Your Preparation"
                subtitle="math4code offers the most structured online coaching for CSIR NET."
                ctaText="Explore Courses"
                ctaLink="/csir-net/course"
            />
        </div>
    );
}
