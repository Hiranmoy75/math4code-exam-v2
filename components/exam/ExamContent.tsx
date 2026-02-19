import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface ExamContentProps {
    content: {
        heading: string;
        subheading?: string;
        body: React.ReactNode;
    }[];
}

export function ExamContent({ content }: ExamContentProps) {
    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container max-w-4xl mx-auto px-4 md:px-6">
                <div className="prose prose-lg md:prose-xl prose-green mx-auto">
                    {content.map((section, idx) => (
                        <div key={idx} className="mb-16 last:mb-0">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 bg-left-bottom bg-gradient-to-r from-green-500 to-green-500 bg-[length:0%_3px] bg-no-repeat group-hover:bg-[length:100%_3px] transition-all duration-500 inline-block pb-1">
                                {section.heading}
                            </h2>
                            {section.subheading && (
                                <h3 className="text-xl md:text-2xl font-semibold text-slate-700 mb-4 mt-8">
                                    {section.subheading}
                                </h3>
                            )}
                            <div className="text-slate-600 leading-relaxed space-y-4 text-base md:text-lg">
                                {section.body}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
