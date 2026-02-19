import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
}

interface ExamFeaturesProps {
    features: Feature[];
    sectionTitle: string;
    sectionSubtitle?: string;
}

export function ExamFeatures({ features, sectionTitle, sectionSubtitle }: ExamFeaturesProps) {
    return (
        <section className="py-20 bg-slate-50/50 relative">
            <div className="container max-w-container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-br from-green-700 to-emerald-700">
                        {sectionTitle}
                    </h2>
                    {sectionSubtitle && <p className="text-lg text-slate-600">{sectionSubtitle}</p>}
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-green-100 hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-500 group-hover:text-white transition-all duration-300">
                                <feature.icon className="w-7 h-7" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-700 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
