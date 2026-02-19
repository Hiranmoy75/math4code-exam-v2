import { ExamHero } from "@/components/exam/ExamHero";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamFeatures } from "@/components/exam/ExamFeatures";
import { ResourceCard } from "@/components/resources/ResourceCard";
import {
    FileText,
    Download,
    BookOpen,
    Video,
    Award,
    CheckCircle,
    FileBarChart,
    LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppDownloadSection } from "@/components/AppDownloadSection";

export const metadata = {
    title: "Free CSIR NET, GATE & IIT JAM Mathematics Resources | Math4Code",
    description: "Download free CSIR NET, GATE and IIT JAM Mathematics study materials, PYQs, mock tests and strategy PDFs from Math4Code.",
};

const RESOURCES = [
    {
        title: "CSIR NET PYQs",
        description: "Last 10 years Question Papers for CSIR NET Mathematical Sciences with Answer Keys.",
        icon: FileText,
        href: "/csir-net/pyq",
        badge: "Most Popular",
    },
    {
        title: "GATE Mathematics PYQs",
        description: "Download GATE MA previous year papers from 2015-2024 with detailed solutions.",
        icon: Download,
        href: "/gate/pyq",
    },
    {
        title: "IIT JAM Free Mock Test",
        description: "Experience the real exam interface with our free full-length mock test for IIT JAM.",
        icon: LayoutDashboard,
        href: "/iit-jam/test-series",
        badge: "Exam Ready",
    },
    {
        title: "Formula Sheet PDF",
        description: "Comprehensive formula sheet for Real Analysis, Linear Algebra, and Calculus.",
        icon: FileBarChart,
        href: "#",
        ctaText: "Download PDF",
    },
    {
        title: "Preparation Strategy",
        description: "Step-by-step guide to crack CSIR NET & GATE in first attempt by AIR 1 holder.",
        icon: Award,
        href: "/csir-net/overview",
        ctaText: "Read Guide",
    },
    {
        title: "Demo Lectures",
        description: "Watch free demo lectures on Complex Analysis and Abstract Algebra.",
        icon: Video,
        href: "/csir-net/course",
        ctaText: "Watch Now",
    },
];

export default function FreeResourcesPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="Free Mathematics Exam Resources"
                subtitle="Your one-stop destination for high-quality study material for CSIR NET, GATE, and IIT JAM Mathematics."
                ctaText="Join 2026 Batch"
                ctaHref="/auth/sign-up"
                secondaryCtaText="Download PDF"
                secondaryCtaHref="#downloads"
                features={["PYQ Papers", "Mock Tests", "Formula Sheets", "Strategy Guides"]}
                badge="Quality Content"
            />

            {/* Resource Grid Section */}
            <section className="py-20 bg-slate-50/30" id="downloads">
                <div className="container max-w-container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Everything You Need to Start
                        </h2>
                        <p className="text-lg text-slate-600">
                            Access premium quality resources curated by IIT alumni tailored for your exam success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {RESOURCES.map((resource, index) => (
                            <ResourceCard
                                key={index}
                                {...resource}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Free Test Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="container max-w-5xl mx-auto px-4 md:px-6">
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-6 inline-block">
                                    Live Now
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                                    All India Free Mock Test 2026
                                </h2>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center text-slate-300">
                                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                        <span>Based on Latest NTA/IIT Pattern</span>
                                    </li>
                                    <li className="flex items-center text-slate-300">
                                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                        <span>Detailed Video Solutions</span>
                                    </li>
                                    <li className="flex items-center text-slate-300">
                                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                        <span>Instant Performance Analytics</span>
                                    </li>
                                </ul>
                                <Button
                                    size="lg"
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-green-900/20 text-lg w-full md:w-auto"
                                >
                                    Start Free Test
                                </Button>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                                <div className="text-5xl font-bold text-green-400 mb-2">60+</div>
                                <div className="text-slate-300 font-medium mb-8">Questions</div>

                                <div className="w-full h-px bg-white/10 mb-8" />

                                <div className="text-5xl font-bold text-green-400 mb-2">3 Hrs</div>
                                <div className="text-slate-300 font-medium">Duration</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Authority Section */}
            <section className="py-20 bg-slate-50">
                <div className="container max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Trust Math4Code?</h2>
                    <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Our resources are crafted by expert faculty who are IIT alumni and have cracked CSIR NET, GATE, and JRF multiple times. We believe in providing structured, concept-oriented learning that builds a strong foundation for your success.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">10k+</div>
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Students</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Selections</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Free Tests</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">4.8/5</div>
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            <AppDownloadSection />

            <ExamCTA
                title="Ready to Level Up?"
                subtitle="Join our full-time classroom program or online course for guaranteed results."
                ctaText="Join 2026 Batch"
                ctaLink="/auth/sign-up"
            />
        </div>
    );
}
