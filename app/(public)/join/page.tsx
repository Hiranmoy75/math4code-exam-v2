import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import { ExamHero } from "@/components/exam/ExamHero";
import { AppDownloadSection } from "@/components/AppDownloadSection";
import { ExamCTA } from "@/components/exam/ExamCTA";

export const metadata = {
    title: "Join Math4Code 2026 Batch | CSIR NET, GATE & IIT JAM Mathematics",
    description: "Enroll in the 2026 Batch for CSIR NET, GATE, and IIT JAM Mathematics. Get structured learning, expert guidance, and proven results.",
};

const BATCHES = [
    {
        title: "CSIR NET Mathematical Sciences",
        subtitle: "June & Dec 2026 Cycles",
        features: ["Live & Recorded Classes", "Complete Study Material", "Test Series Included", "Doubt Clearing Sessions"],
        href: "/csir-net/course",
        tag: "Most Popular",
        color: "green"
    },
    {
        title: "GATE Mathematics (MA)",
        subtitle: "Target GATE 2026",
        features: ["In-depth Concept Building", "Previous Year Solutions", "Topic-wise Tests", "Personal Mentorship"],
        href: "/gate/course",
        tag: "Recommended",
        color: "blue"
    },
    {
        title: "IIT JAM Mathematics",
        subtitle: "For M.Sc. Entrances 2026",
        features: ["Foundation to Advanced", "Full Syllabus Coverage", "Mock Interviews", "Regular Assessments"],
        href: "/iit-jam/course",
        tag: "Best for B.Sc.",
        color: "emerald"
    }
];

export default function JoinPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="Join the Math4Code 2026 Batch"
                subtitle="Select your exam and start your journey towards success with India's best mathematics faculty."
                ctaText="Start Free Trial"
                ctaHref="/auth/sign-up"
                secondaryCtaText="Contact Us"
                secondaryCtaHref="/contact"
                badge="Admissions Open"
                features={["Structured Curriculum", "Expert Faculty", "Proven Results"]}
            />

            <section className="py-20 bg-slate-50">
                <div className="container max-w-container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Choose Your Program
                        </h2>
                        <p className="text-lg text-slate-600">
                            Comprehensive classroom programs designed to help you crack the toughest exams.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {BATCHES.map((batch, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col group overflow-hidden hover:-translate-y-1">
                                <div className="p-1 h-1.5 bg-gradient-to-r from-green-500 to-emerald-600 w-full" />
                                <div className="p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <GraduationCap className="w-8 h-8" />
                                        </div>
                                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wide">
                                            {batch.tag}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors">
                                        {batch.title}
                                    </h3>
                                    <p className="text-slate-500 font-medium mb-6">
                                        {batch.subtitle}
                                    </p>

                                    <ul className="space-y-3 mb-8 flex-grow">
                                        {batch.features.map((feature, i) => (
                                            <li key={i} className="flex items-start text-sm text-slate-600">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href={batch.href} className="w-full mt-auto">
                                        <Button className="w-full bg-slate-900 hover:bg-green-600 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-slate-900/10 hover:shadow-green-600/20 flex items-center justify-between px-6">
                                            <span>View Details</span>
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <AppDownloadSection />

            <ExamCTA
                title="Not sure which batch to join?"
                subtitle="Talk to our academic counselors for free guidance."
                ctaText="Request a Call Back"
                ctaLink="/contact"
            />
        </div>
    );
}
