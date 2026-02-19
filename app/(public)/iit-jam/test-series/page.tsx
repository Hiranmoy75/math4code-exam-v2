import { ExamHero } from "@/components/exam/ExamHero";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamFAQ } from "@/components/exam/ExamFAQ";
import { CheckCircle, Clock, Award, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, GraduationCap } from "lucide-react";

export const metadata = {
    title: "IIT JAM Mathematics Test Series 2026 | Topic-wise & Full Length",
    description: "Best online test series for IIT JAM Mathematics (MA). Practice with unit-wise tests and full-length mocks.",
};

const TEST_FEATURES = [
    {
        title: "Real JAM Interface",
        description: "Familiarize yourself with the actual exam CBT interface.",
        icon: LayoutDashboard,
    },
    {
        title: "Video Solutions",
        description: "Detailed video explanations for tricky questions.",
        icon: GraduationCap,
    },
    {
        title: "AIR Prediction",
        description: "Know where you stand among thousands of aspirants.",
        icon: Award,
    },
    {
        title: "Topic-wise Mastery",
        description: "Master individual topics like Sequence & Series and Linear Algebra.",
        icon: CheckCircle,
    },
    {
        title: "Time Management",
        description: "Learn to manage 3 hours effectively.",
        icon: Clock,
    },
    {
        title: "Performance Analytics",
        description: "Identify weak areas and improve accuracy.",
        icon: BarChart2,
    },
];

export default function IITJAMTestSeriesPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="IIT JAM Mathematics Test Series"
                subtitle="Boost your score. Practice with rigorous tests and get detailed performance analysis."
                ctaText="Start Free Test"
                ctaHref="/auth/sign-up"
                secondaryCtaText="View Schedule"
                secondaryCtaHref="#schedule"
                features={["Topic-wise Tests", "Full-length Mocks", "NAT Type Practice"]}
                badge="JAM 2026 Ready"
            />

            <ExamFeatures
                features={TEST_FEATURES}
                sectionTitle="Why Choose Our Test Series?"
                sectionSubtitle="The perfect tool to gauge your preparation level."
            />

            {/* Pricing/Plans Section - Simplified */}
            <section className="py-20 bg-slate-50" id="plans">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
                        <p className="text-slate-600">Flexible options to suit your preparation needs.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Plan 1 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Subject Tests</h3>
                            <div className="text-4xl font-bold text-slate-900 mb-6">₹1,499<span className="text-sm text-slate-500 font-normal">/year</span></div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-slate-600"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> 25+ Topic Tests</li>
                                <li className="flex items-center text-slate-600"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Detailed Solutions</li>
                            </ul>
                            <Link href="/auth/sign-up">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-xl">Get Started</Button>
                            </Link>
                        </div>

                        {/* Plan 2 - Main */}
                        <div className="bg-white p-8 rounded-2xl border-2 border-green-500 shadow-xl relative overflow-hidden transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">Best Value</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Comprehensive Series</h3>
                            <div className="text-4xl font-bold text-green-700 mb-6">₹2,999<span className="text-sm text-slate-500 font-normal">/year</span></div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> 45+ Total Tests</li>
                                <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Video Solutions</li>
                                <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> All India Ranking</li>
                                <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Detailed Analytics</li>
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
                    { question: "Is the NAT type covered?", answer: "Yes, we focus heavily on Numerical Answer Type (NAT) questions as they are crucial for a good rank." },
                    { question: "Can I take the tests on mobile?", answer: "Yes, our interface is mobile-friendly." }
                ]}
            />

            <ExamCTA
                title="Ready to crack JAM?"
                subtitle="Take your first step towards IITs with our mock tests."
                ctaText="Take Free Mock"
                ctaLink="/auth/sign-up"
            />
        </div>
    );
}
