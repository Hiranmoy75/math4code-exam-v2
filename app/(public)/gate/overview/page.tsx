import { ExamHero } from "@/components/exam/ExamHero";
import { ExamContent } from "@/components/exam/ExamContent";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { Briefcase, Building, GraduationCap, Percent } from "lucide-react";

export const metadata = {
    title: "About GATE Mathematics (MA) | Eligibility, Pattern and Benefits",
    description: "Complete guide to GATE Mathematics. Learn about M.Tech admissions, PSU jobs, exam pattern, cutoff trends, and GATE opportunities.",
};

const OVERVIEW_FEATURES = [
    {
        title: "M.Tech / MS",
        description: "Secure admission in IITs, IISc, NITs, and other top engineering colleges across India.",
        icon: GraduationCap,
    },
    {
        title: "PSU Jobs",
        description: "Get recruited by ONGC, DRDO, BARC, and other Public Sector Undertakings directly.",
        icon: Briefcase,
    },
    {
        title: "Ph.D. Admission",
        description: "Direct Ph.D. admissions after B.Tech or M.Sc. with lucrative stipends.",
        icon: Building,
    },
    {
        title: "Score Validity",
        description: "GATE score is valid for 3 years, allowing flexibility in career planning.",
        icon: Percent,
    },
];

const OVERVIEW_CONTENT = [
    {
        heading: "What is GATE Mathematics?",
        body: (
            <div className="space-y-4">
                <p>
                    The Graduate Aptitude Test in Engineering (GATE) is an all-India examination that primarily tests the comprehensive understanding of various undergraduate subjects in engineering and science.
                </p>
                <p>
                    For Mathematics students, the paper code is <strong>MA</strong>. It is conducted jointly by the Indian Institute of Science (IISc) and seven Indian Institutes of Technology (IITs).
                </p>
            </div>
        ),
    },
    {
        heading: "Eligibility Criteria",
        subheading: "Who can apply?",
        body: (
            <div className="space-y-4">
                <p>
                    A candidate who is currently studying in the <strong>3rd or higher years</strong> of any undergraduate degree program specifically in Engineering / Technology / Architecture / Science / Commerce / Arts is eligible.
                </p>
                <p>
                    Also, anyone who has already completed any government-approved degree program in the above disciplines is eligible.
                    <br />
                    <strong>Crucially: There is NO Age Limit to appear for the GATE exam.</strong>
                </p>
            </div>
        ),
    },
    {
        heading: "Career Opportunities",
        subheading: "Why appear for GATE MA?",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Higher Education:</strong> M.Tech/Ph.D. at IISc Bangalore, IIT Bombay, IIT Madras, IIT Delhi, etc.</li>
                <li><strong>Study Abroad:</strong> Some foreign universities accept GATE scores for postgraduate admissions (e.g., NUS/NTU Singapore, RWTH Aachen).</li>
                <li><strong>Research Fellowships:</strong> Junior Research Fellowship (JRF) in CSIR Labs and other research institutes.</li>
                <li><strong>Jobs:</strong> Recruitment in DRDO (Scientists 'B'), BARC (OCES/DGFS), ONGC, etc.</li>
            </ul>
        ),
    }
];

export default function GATEOverviewPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="About GATE Mathematics (MA)"
                subtitle="Unlock opportunities in PSUs, IITs, and Research. Your definitive guide to the GATE exam."
                ctaText="View Syllabus"
                ctaHref="/gate/syllabus"
                secondaryCtaText="Exam Pattern"
                secondaryCtaHref="/gate/syllabus#pattern"
                features={["No Age Limit", "PSU Jobs", "Result Validity: 3 Years"]}
                badge="GATE Information"
            />

            <ExamFeatures
                features={OVERVIEW_FEATURES}
                sectionTitle="Why Take The GATE Exam?"
                sectionSubtitle="More than just an entrance test. It's a career catalyst."
            />

            <ExamContent content={OVERVIEW_CONTENT} />

            <ExamCTA
                title="Crack GATE with Flying Colors"
                subtitle="Structured preparation is the key. Join Math4Code's specialized GATE course."
                ctaText="Enroll Now"
                ctaLink="/gate/course"
            />
        </div>
    );
}
