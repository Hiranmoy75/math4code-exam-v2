import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, User, Clock, Star, ChevronRight, Filter, Award } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CourseThumbnail } from "@/components/ui/CourseThumbnail";
import { getTenantId } from "@/lib/tenant";

export { metadata } from './metadata';

export default async function TestSeriesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    const { q, category } = await searchParams;
    const supabase = await createClient();

    const tenantId = getTenantId();

    // Build query with tenant filtering
    let query = supabase
        .from("courses")
        .select("*, profiles:creator_id(full_name)")
        .eq("is_published", true)
        .eq("course_type", "test_series")
        .order("created_at", { ascending: false })
        .range(0, 19);

    // Add tenant filter
    if (tenantId) {
        query = query.eq("tenant_id", tenantId);
    }

    if (q) {
        query = query.ilike("title", `%${q}%`);
    }

    if (category) {
        query = query.eq("category", category);
    }

    const { data: testSeries } = await query;

    const categories = [
        { label: "IIT-JAM Mathematics", value: "iit_jam" },
        { label: "CSIR NET Mathematical Sciences", value: "csir_net" },
        { label: "GATE Mathematics", value: "gate" },
        { label: "Foundation Courses", value: "foundation" },
        { label: "Advanced Topics", value: "advanced" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />

            {/* Hero Section - Balanced Layout */}
            <div className="pt-28 pb-10 md:pt-36 md:pb-12 bg-gradient-to-b from-green-50/50 to-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[80px] -z-10 translate-x-1/3 -translate-y-1/4" />
                <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[80px] -z-10 -translate-x-1/4" />

                <div className="container max-w-[1200px] mx-auto px-4 md:px-6 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 mb-5 animate-fade-in-up bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Exam Preparation</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-[1.1]">
                            Master Your Exams with <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Premium Test Series</span>
                        </h1>

                        <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                            Comprehensive mock tests designed by experts to help you ace IIT-JAM, CSIR NET & GATE Mathematics.
                        </p>

                        {/* Search Bar - Fixed Icon Placement */}
                        <div className="relative w-full max-w-xl mx-auto shadow-xl shadow-green-900/5 rounded-2xl transform hover:-translate-y-0.5 transition-transform duration-300">
                            {/* Icon absolutely positioned with left-4 for correct spacing */}
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <form>
                                <input
                                    type="search"
                                    name="q"
                                    defaultValue={q}
                                    placeholder="Search for test series, exams..."
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all text-base font-medium shadow-inner"
                                />
                            </form>
                        </div>

                        {/* Quick Stats - Balanced spacing */}
                        <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs font-medium text-slate-500 hidden sm:flex">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span>Real Exam Pattern</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span>Detailed Analysis</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span>All India Rank</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container max-w-[1200px] mx-auto px-4 md:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden lg:block w-64 shrink-0 space-y-8">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 pb-3 border-b border-slate-50 text-sm uppercase tracking-wide">
                                <Filter className="w-4 h-4 text-green-600" /> Categories
                            </h3>
                            <div className="space-y-1">
                                <Link href="/test-series" className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${!category ? "bg-green-50 text-green-700 border border-green-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                                    All Categories
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.value}
                                        href={`/test-series?category=${cat.value}`}
                                        className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${category === cat.value ? "bg-green-50 text-green-700 border border-green-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                                        {cat.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        <div className="flex gap-2">
                            <Link href="/test-series">
                                <Badge variant={!category ? "default" : "outline"} className={`whitespace-nowrap py-2 px-4 text-sm rounded-full ${!category ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                                    All
                                </Badge>
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.value}
                                    href={`/test-series?category=${cat.value}`}
                                    className="no-underline"
                                >
                                    <Badge variant={category === cat.value ? "default" : "outline"} className={`whitespace-nowrap py-2 px-4 text-sm rounded-full ${category === cat.value ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                                        {cat.label}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Test Series Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {testSeries?.map((series) => (
                                <Link key={series.id} href={`/courses/${series.id}`} className="group h-full block">
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:border-green-100 transition-all duration-300 h-full flex flex-col overflow-hidden transform hover:-translate-y-1">
                                        {/* Thumbnail */}
                                        <div className="relative h-44 bg-slate-50 overflow-hidden">
                                            <CourseThumbnail
                                                src={series.thumbnail_url}
                                                title={series.title}
                                                category="Test Series"
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm border border-white/20">
                                                Test Series
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {series.category || "Exam"}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-base text-slate-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors">
                                                {series.title}
                                            </h3>

                                            <p className="text-slate-500 text-xs line-clamp-2 mb-3 flex-grow leading-relaxed">
                                                {series.description}
                                            </p>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-50">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="truncate max-w-[100px] font-medium">{(series.profiles as any)?.full_name || "Expert"}</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                <div className="flex items-center gap-1.5">
                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                                    <span className="font-medium text-slate-700">4.8</span>
                                                </div>
                                            </div>

                                            {/* Price & Action */}
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex flex-col">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-lg font-bold text-slate-900">
                                                            {series.price > 0 ? `₹${series.price}` : "Free"}
                                                        </span>
                                                        {series.price > 0 && (
                                                            <span className="text-xs text-slate-400 line-through">₹{Math.round(series.price * 1.5)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {(!testSeries || testSeries.length === 0) && (
                                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <Search className="w-8 h-8 text-green-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No test series found</h3>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto mb-4">Try adjusting filters or search terms.</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-green-200 text-green-700 hover:bg-green-50"
                                        asChild
                                    >
                                        <Link href="/test-series">Clear Filters</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
