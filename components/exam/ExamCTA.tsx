import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
}

export function ExamCTA({ title, subtitle, ctaText, ctaLink }: CTASectionProps) {
    return (
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-20 md:py-24 text-white relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-green-500/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

            <div className="container max-w-container mx-auto px-4 md:px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 drop-shadow-sm">
                    {title}
                </h2>

                <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto mb-10 font-medium">
                    {subtitle}
                </p>

                <Link href={ctaLink}>
                    <Button
                        size="lg"
                        className="bg-white text-green-700 hover:bg-green-50 hover:text-green-800 font-bold px-10 py-7 rounded-xl shadow-xl shadow-green-900/20 text-lg md:text-xl transform hover:scale-105 transition-all duration-300 group"
                    >
                        {ctaText} <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </section>
    );
}
