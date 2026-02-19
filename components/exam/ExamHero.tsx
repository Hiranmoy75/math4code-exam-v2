import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowRight, Download, PlayCircle } from "lucide-react";

interface ExamHeroProps {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
    badge?: string;
    features?: string[];
}

export function ExamHero({
    title,
    subtitle,
    ctaText,
    ctaHref,
    secondaryCtaText,
    secondaryCtaHref,
    badge = "Batch of 2026",
    features
}: ExamHeroProps) {
    return (
        <section className="relative overflow-hidden bg-white pt-20 pb-16 md:pt-2 md:pb-24">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-emerald-50/30 -z-10" />

            {/* Animated Blobs */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-green-100/40 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-3xl animate-pulse-slow delay-1000" />

            <div className="container max-w-container-hero mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-green-50 border border-green-100 shadow-sm animate-fade-in-up">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-green-700 tracking-wide uppercase">{badge}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 animate-fade-in-up delay-100 leading-[1.15]">
                        {title.split(" ").map((word, i) => (
                            word === "CSIR" || word === "NET" || word === "GATE" || word === "JAM" || word === "Mathematics" ? (
                                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 inline-block mr-2 md:mr-3">
                                    {word}
                                </span>
                            ) : (
                                <span key={i} className="inline-block mr-2 md:mr-3">{word}</span>
                            )
                        ))}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        {subtitle}
                    </p>

                    {/* Features - Optional */}
                    {features && features.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-10 animate-fade-in-up delay-300">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm md:text-base font-medium text-slate-700 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
                        <Link href={ctaHref} className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-1 text-base md:text-lg">
                                {ctaText} <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href={secondaryCtaHref} className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-200 hover:border-green-200 hover:bg-green-50 text-slate-700 hover:text-green-700 font-semibold px-8 py-6 rounded-xl transition-all text-base md:text-lg">
                                {secondaryCtaText.includes("Test") ? <PlayCircle className="mr-2 w-5 h-5" /> : <Download className="mr-2 w-5 h-5" />}
                                {secondaryCtaText}
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
