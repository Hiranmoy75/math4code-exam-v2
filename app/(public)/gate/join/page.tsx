import { ExamHero } from "@/components/exam/ExamHero";
import { AppDownloadSection } from "@/components/AppDownloadSection";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Video, FileText, Smartphone, Trophy } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Join GATE 2026 Batch | Math4Code",
    description: "Enroll in the GATE 2026 Mathematics (MA) preparation program. Live classes, study material, and test series.",
};

const FEATURES = [
    {
        icon: Video,
        title: "Concept Building",
        description: "Deep dive into core mathematical concepts with practical problem solving."
    },
    {
        icon: FileText,
        title: "PYQ Solutions",
        description: "Detailed video solutions for the last 15 years of GATE MA papers."
    },
    {
        icon: Smartphone,
        title: "Topic-wise Analysis",
        description: "Personalized performance reports to identify your weak areas."
    },
    {
        icon: Trophy,
        title: "All India Test Series",
        description: "Compete with thousands of aspirants in our GATE mock tests."
    }
];

export default function GATEJoinPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="GATE 2026 Mathematics Batch"
                subtitle="Aim for a top rank in GATE MA with our expert-led classroom program. Admissions open for 2026 aspirants."
                ctaText="Enroll Now"
                ctaHref="/auth/sign-up?exam=gate"
                secondaryCtaText="Download Syllabus"
                secondaryCtaHref="#"
                badge="Target GATE 2026"
                features={["500+ Hrs Live Classes", "Comprehensive Notes", "Aptitude Coverage"]}
            />

            <section className="py-20 bg-slate-50">
                <div className="container max-w-container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Cracking GATE Made Simpler</h2>
                        <p className="text-lg text-slate-600">Our structured approach ensures you master every topic needed for a top GATE score.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURES.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your GATE Preparation</h2>
                            <ul className="text-left max-w-lg mx-auto space-y-4 mb-10">
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" />
                                    <span>Subject-wise & Full-length Mocks</span>
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" />
                                    <span>General Aptitude Live Sessions</span>
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" />
                                    <span>Detailed Solutions & Doubt Clearing</span>
                                </li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/sign-up?exam=gate">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-14 rounded-xl w-full sm:w-auto">
                                        Register & Pay
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 font-bold px-8 h-14 rounded-xl w-full sm:w-auto">
                                        Talk to Counselor
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <AppDownloadSection />
        </div>
    );
}
