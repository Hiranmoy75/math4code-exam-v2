import { ExamHero } from "@/components/exam/ExamHero";
import { AppDownloadSection } from "@/components/AppDownloadSection";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Video, FileText, Smartphone, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Join CSIR NET 2026 Batch | Math4Code",
    description: "Enroll in the comprehensive CSIR NET Mathematical Sciences 2026 preparation program. Live classes, study material, and test series.",
};

const FEATURES = [
    {
        icon: Video,
        title: "Live Interactive Classes",
        description: "Daily live sessions with two-way interaction for doubt clearing."
    },
    {
        icon: FileText,
        title: "Detailed Study Material",
        description: "Hard copy notes delivered to your doorstep covering the entire syllabus."
    },
    {
        icon: Smartphone,
        title: "Mobile App Access",
        description: "Watch recorded lectures anytime, anywhere on our Android app."
    },
    {
        icon: Users,
        title: "Personal Mentorship",
        description: "Regular guidance sessions and strategy planning with faculty."
    }
];

export default function CSIRNETJoinPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="CSIR NET 2026 Mathematics Batch"
                subtitle="Secure your JRF with India's most structured classroom program. Admissions closing soon for the June 2026 cycle."
                ctaText="Enroll Now"
                ctaHref="/auth/sign-up?exam=csir-net"
                secondaryCtaText="Download Brochure"
                secondaryCtaHref="#"
                badge="New Batch Starting"
                features={["600+ Hrs Live Classes", "HARD Copy Notes", "Part A Coverage"]}
            />

            <section className="py-20 bg-slate-50">
                <div className="container max-w-container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need to Crack JRF</h2>
                        <p className="text-lg text-slate-600">Our program is designed to cover every aspect of the examination - from concepts to problem solving.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURES.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
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
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Started with CSIR NET Prep</h2>
                            <ul className="text-left max-w-lg mx-auto space-y-4 mb-10">
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 mr-3" />
                                    <span>Structured 6-Month & 1-Year Programs</span>
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 mr-3" />
                                    <span>Weekly Tests & Comprehensive Analysis</span>
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 mr-3" />
                                    <span>24/7 Doubt Support via App</span>
                                </li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/sign-up?exam=csir-net">
                                    <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 h-14 rounded-xl w-full sm:w-auto">
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
