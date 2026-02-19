import { ExamHero } from "@/components/exam/ExamHero";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamFAQ } from "@/components/exam/ExamFAQ";
import { CheckCircle, Clock, Award, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
    title: "CSIR NET Mathematics Test Series 2026 | Topic-wise & Full Length",
    description: "Best online test series for CSIR NET Mathematical Sciences. 50+ Tests with detailed solutions and AIR ranking.",
};

const TEST_FEATURES = [
    {
        title: "Real Exam Interface",
        description: "Experience the exact NTA exam interface to build familiarity and confidence before the big day.",
        icon: LayoutDashboard,
    },
    {
        title: "Detailed Analytics",
        description: "Get in-depth analysis of your strong and weak areas with topic-wise performance reports.",
        icon: BarChart2,
    },
    {
        title: "All India Ranking",
        description: "Compete with thousands of aspirants and gauge your preparation level on a national scale.",
        icon: Award,
    },
    {
        title: "Sectional Tests",
        description: "Focused tests on Real Analysis, Linear Algebra, and other core topics to strengthen your foundation.",
        icon: CheckCircle,
    },
    {
        title: "Full Length Mocks",
        description: "20+ Full-length mock tests designed by experts to simulate the actual exam difficulty.",
        icon: Clock,
    },
    {
        title: "Video Solutions",
        description: "Comprehensive video solutions for tricky questions to understand the best approach.",
        icon: GraduationCap,
    }
];

import { LayoutDashboard, GraduationCap } from "lucide-react";

export default function CSIRNETTestSeriesPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="CSIR NET Mathematics Test Series"
                subtitle="Boost your score with India's most trusted test series. Practice with 50+ high-quality tests and get AI-driven performance insights."
                ctaText="Start Free Test"
                ctaHref="/auth/sign-up"
                secondaryCtaText="View Schedule"
                secondaryCtaHref="#schedule"
                features={["50+ Tests", "AI Analytics", "Video Solutions"]}
                badge="New Pattern 2026"
            />

            <ExamFeatures
                features={TEST_FEATURES}
                sectionTitle="Why Our Test Series?"
                sectionSubtitle="Designed to maximize your score through rigorous practice."
            />

            {/* Pricing/Plans Section - Simplified for now */}
            <section className="py-20 bg-slate-50" id="plans">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
                        <p className="text-slate-600">Flexible options to suit your preparation needs.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Plan 1 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Topic-wise Series</h3>
                            <div className="text-4xl font-bold text-slate-900 mb-6">₹1,999<span className="text-sm text-slate-500 font-normal">/year</span></div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-slate-600"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> 30+ Topic Tests</li>
                                <li className="flex items-center text-slate-600"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Detailed Solutions</li>
                                <li className="flex items-center text-slate-600"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> 1 Year Validity</li>
                            </ul>
                            <Link href="/auth/sign-up">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-xl">Get Started</Button>
                            </Link>
                        </div>

                        {/* Plan 2 - Main */}
                        <div className="bg-white p-8 rounded-2xl border-2 border-green-500 shadow-xl relative overflow-hidden transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">Best Value</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Complete Series (Batch 2026)</h3>
                            <div className="text-4xl font-bold text-green-700 mb-6">₹3,499<span className="text-sm text-slate-500 font-normal">/year</span></div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> 50+ Total Tests (Topic + Full)</li>
                                <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Video Solutions for key q's</li>
                                <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> All India Ranking</li>
                                <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Performance Analytics</li>
                            </ul>
                            <Link href="/auth/sign-up">
                                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-green-500/20 animate-pulse-slow">Join Now</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <ExamFAQ
                title="Test Series FAQs"
                faqs={[
                    { question: "Can I attempt the tests on mobile?", answer: "Yes, our test interface is fully responsive and works on both mobile and desktop." },
                    { question: "Are the tests based on the latest pattern?", answer: "Absolutely. We update our question bank regularly to reflect the latest NTA CSIR NET pattern." },
                    { question: "Can I re-attempt the tests?", answer: "Yes, you can re-attempt tests to practice and improve your speed and accuracy." }
                ]}
            />

            <ExamCTA
                title="Ready to test your knowledge?"
                subtitle="Sign up now and take a free mock test to check your preparation level."
                ctaText="Take Free Mock Test"
                ctaLink="/auth/sign-up"
            />
        </div>
    );
}
