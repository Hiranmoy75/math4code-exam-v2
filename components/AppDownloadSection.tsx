import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Smartphone, Download, Star } from "lucide-react";
import Image from "next/image";

export function AppDownloadSection() {
    return (
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />

            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container max-w-container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Text Content */}
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 bg-green-100/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-green-200 mb-6 w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-bold text-green-700">1000+ Students Already Joined</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Practice Anytime, Anywhere with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Math4Code App</span>
                        </h2>

                        <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                            Get access to India's best CSIR NET, GATE & IIT JAM Mathematics content on your phone. Download now for a seamless learning experience.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {[
                                "Full-length Mock Tests",
                                "Instant Performance Analytics",
                                "Offline Video Access",
                                "Daily Practice Quizzes"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-green-200">
                                    <div className="bg-green-50 p-1.5 rounded-full">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="https://play.google.com/store/apps/details?id=com.math4code.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <Button
                                    size="lg"
                                    className="bg-slate-900 text-white hover:bg-slate-800 font-bold h-16 px-8 rounded-xl shadow-lg shadow-slate-900/20 w-full sm:w-auto flex items-center gap-4 transition-all hover:-translate-y-1"
                                >
                                    <div className="flex-shrink-0">
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.609 1.814L13.792 12 3.61 22.186a1.006 1.006 0 01-.61-.92V2.734a1 1 0 01.609-.92zm11.75 11.749L5.32 23.601c.712.384 1.579.172 2.05-.41l8.526-8.526-1.537-1.102zM15.93 11.45L7.37 2.81c-.48-.593-1.36-.788-2.05-.394l10.073 10.136 1.537-1.102-1-.708v.008zM15.42 12.56l1.31.938 3.868 2.37c1.11.68 1.115 1.764.004 2.454l-3.86 2.368-2.316-2.316.994-5.814z" />
                                        </svg>
                                    </div>
                                    <div className="text-left flex flex-col">
                                        <span className="text-xs uppercase font-semibold text-slate-400 group-hover:text-green-400 transition-colors">Get it on</span>
                                        <span className="text-xl leading-none font-bold">Google Play</span>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Phone Mockup Placeholder */}
                    <div className="lg:w-1/2 relative flex justify-center lg:justify-end">
                        <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden z-10">
                            {/* Screen Content Mock */}
                            <div className="absolute inset-0 bg-white">
                                <div className="h-full w-full bg-slate-50 flex flex-col">
                                    {/* Header */}
                                    <div className="h-16 bg-green-600 flex items-center justify-between px-6 pt-6">
                                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                                        <div className="w-24 h-4 bg-white/20 rounded-full"></div>
                                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                                    </div>
                                    {/* Content */}
                                    <div className="p-4 space-y-4">
                                        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="w-10 h-10 bg-green-100 rounded-full"></div>
                                                <div className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-bold">New Test</div>
                                            </div>
                                            <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                                            <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
                                                <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-bold">Video</div>
                                            </div>
                                            <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                                            <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                                        </div>
                                        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg mt-4 text-white">
                                            <div className="h-6 w-1/2 bg-white/20 rounded mb-3"></div>
                                            <div className="h-2 w-full bg-white/20 rounded mb-2"></div>
                                            <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                                        </div>
                                    </div>
                                    {/* Bottom Nav */}
                                    <div className="mt-auto h-20 bg-white border-t border-slate-100 flex justify-around items-center px-4 pb-4">
                                        <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                                        <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                                        <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                                        <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-slate-800 rounded-b-2xl z-20" />
                        </div>

                        {/* Floating Ratings Card */}
                        <div className="absolute top-1/4 -left-10 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce-slow hidden md:block z-20">
                            <div className="flex items-center gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                            </div>
                            <div className="font-bold text-slate-800">4.8/5 Rating</div>
                            <div className="text-xs text-slate-500">Based on 100+ Reviews</div>
                        </div>

                        {/* Floating Downloads Card */}
                        <div className="absolute bottom-1/4 -right-4 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-pulse-slow hidden md:block z-20">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                    <Download className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">10k+</div>
                                    <div className="text-xs text-slate-500">Downloads</div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
