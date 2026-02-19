import { ExamHero } from "@/components/exam/ExamHero";
import { ExamContent } from "@/components/exam/ExamContent";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { GraduationCap, Building2, Globe, Rocket } from "lucide-react";

export const metadata = {
    title: "About IIT JAM Mathematics | Eligibility, Pattern and Top Institutes",
    description: "Complete guide to IIT JAM Mathematics (MA). Check eligibility, participating IITs, seat matrix, and career after M.Sc.",
};

const OVERVIEW_FEATURES = [
    {
        title: "M.Sc. at IITs",
        description: "Secure admission in 20+ IITs across India. The premier destination for science education.",
        icon: Building2,
    },
    {
        title: "Integrated Ph.D.",
        description: "Best route to research careers at IISc Bangalore and IISERs.",
        icon: Rocket,
    },
    {
        title: "NIT Admissions",
        description: "Use JAM score for admission to NITs and CFTIs through CCMN counseling.",
        icon: GraduationCap,
    },
    {
        title: "Global Recognition",
        description: "Strong foundation for future research in top global universities.",
        icon: Globe,
    },
];

const OVERVIEW_CONTENT = [
    {
        heading: "What is IIT JAM?",
        body: (
            <div className="space-y-4">
                <p>
                    The Joint Admission Test for Masters (JAM) is an all-India level online entrance exam conducted by Indian Institutes of Technology (IITs) on a rotational basis.
                </p>
                <p>
                    It is the gateway for admission to <strong>M.Sc.</strong> (Two Year), Joint M.Sc.-Ph.D., M.Sc.-Ph.D. Dual Degree, and other Post-Bachelor's Degree Programmes at the <strong>IITs</strong> and Integrated Ph.D. Degree Programmes at <strong>IISc Bangalore</strong>.
                </p>
            </div>
        ),
    },
    {
        heading: "Important Information",
        subheading: "Eligibility",
        body: (
            <div className="space-y-4">
                <p>
                    Candidates who have a Bachelor's degree with at least <strong>55% aggregate marks</strong> (50% for SC/ST/PwD) are eligible to appear for JAM.
                </p>
                <p>
                    For Mathematics (MA), the candidate must have studied Mathematics for at least two years/four semesters in their undergraduate degree.
                </p>
            </div>
        ),
    },
    {
        heading: "Participating Institutes",
        subheading: "Where can you study?",
        body: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>IIT Bombay</strong> (M.Sc. Mathematics)</li>
                <li><strong>IIT Delhi</strong> (M.Sc. Mathematics)</li>
                <li><strong>IIT Kanpur</strong> (M.Sc. Mathematics / Statistics)</li>
                <li><strong>IIT Madras</strong> (M.Sc. Mathematics)</li>
                <li><strong>IIT Kharagpur</strong> (M.Sc. Mathematics)</li>
                <li><strong>IIT Roorkee</strong> (M.Sc. Mathematics / Applied Mathematics)</li>
                <li><strong>IIT Guwahati</strong> (M.Sc. Mathematics and Computing)</li>
                <li>...andin many more new IITs like IIT Hyderabad, IIT Gandhinagar, etc.</li>
            </ul>
        ),
    },
    {
        heading: "Career Prospects after M.Sc. from IITs",
        body: (
            <div className="space-y-4">
                <p>An M.Sc. from an IIT is highly valued.</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Research:</strong> Pursue Ph.D. in India or abroad (USA, Europe).</li>
                    <li><strong>Corporate Jobs:</strong> Data Analyst, Quant Researcher, Financial Analyst roles (`Mathematics and Computing` graduates are in high demand).</li>
                    <li><strong>Teaching:</strong> Crack CSIR NET/GATE and become a professor.</li>
                    <li><strong>Government Jobs:</strong> UPSC, SSC CGL, Banking, etc.</li>
                </ul>
            </div>
        )
    }
];

export default function IITJAMOverviewPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="About IIT JAM Mathematics"
                subtitle="Your step-by-step guide to cracking the exam and entering the IIT ecosystem."
                ctaText="Check Syllabus"
                ctaHref="/iit-jam/syllabus"
                secondaryCtaText="Preparation Tips"
                secondaryCtaHref="/iit-jam/course"
                features={["M.Sc. & Ph.D.", "No Age Limit", "CCMN Counseling"]}
                badge="JAM Guide"
            />

            <ExamFeatures
                features={OVERVIEW_FEATURES}
                sectionTitle="Why Aim for IIT JAM?"
                sectionSubtitle="Transform your academic future."
            />

            <ExamContent content={OVERVIEW_CONTENT} />

            <ExamCTA
                title="Begin Your IIT Dream"
                subtitle="Math4Code provides the most comprehensive course for IIT JAM."
                ctaText="Join Course"
                ctaLink="/iit-jam/course"
            />
        </div>
    );
}
