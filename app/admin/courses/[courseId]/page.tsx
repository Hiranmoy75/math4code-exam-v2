"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    BarChart3,
    Users,
    Settings,
    ArrowLeft,
    ChevronRight,
    PlayCircle,
    FileText,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import { useCourseAnalytics } from "@/hooks/admin/useCourseAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function CourseDashboardContent() {
    const { courseId } = useParams();
    const router = useRouter();
    const { data, isLoading } = useCourseAnalytics(courseId as string);

    if (isLoading) return <DashboardSkeleton />;

    const { course, stats } = data || {};

    const quickActions = [
        {
            title: "Course Builder",
            description: "Edit curriculum, add lessons, and organize modules.",
            icon: <BookOpen className="w-6 h-6 text-green-500" />,
            href: `/admin/courses/${courseId}/builder`,
            color: "green"
        },
        {
            title: "Performance Analytics",
            description: "View enrollment trends, revenue, and student progress.",
            icon: <BarChart3 className="w-6 h-6 text-teal-500" />,
            href: `/admin/courses/${courseId}/analytics`,
            color: "teal"
        },
        {
            title: "Learner Management",
            description: "Manage enrolled students and grant access manualy.",
            icon: <Users className="w-6 h-6 text-emerald-500" />,
            href: `/admin/students`, // Could be filtered in future
            color: "emerald"
        },
        {
            title: "Course Settings",
            description: "Update pricing, description, and visibility status.",
            icon: <Settings className="w-6 h-6 text-slate-500" />,
            href: `/admin/courses/${courseId}/settings`, // Future page
            color: "slate"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                {/* Floating Blobs */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-400/5 dark:bg-green-600/5 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -left-40 w-80 h-80 bg-teal-400/5 dark:bg-teal-600/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-400/4 dark:bg-emerald-600/4 rounded-full blur-3xl" />
            </div>

            <div className="relative p-6 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
                {/* Header Section with Gradient Background */}
                <div className="relative mb-2 -mx-6 md:-mx-8 lg:-mx-10 px-6 md:px-8 lg:px-10 py-8 bg-gradient-to-r from-slate-50/80 via-white/50 to-slate-50/80 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50">
                    {/* Decorative Math SVG in corner */}
                    <svg className="absolute top-4 right-8 w-24 h-24 text-green-500/5 dark:text-green-400/5" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
                    </svg>

                    <div className="flex items-center gap-4 relative z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/admin/courses')}
                            className="rounded-full hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text">
                                {course?.title}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">Course Management Hub</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Banner with Enhanced Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Total Students Card */}
                    <Card className="relative bg-gradient-to-br from-white via-teal-50/30 to-white dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                        {/* Decorative Pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] dark:opacity-[0.05]">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-teal-600">
                                <circle cx="20" cy="20" r="2" fill="currentColor" />
                                <circle cx="40" cy="20" r="2" fill="currentColor" />
                                <circle cx="60" cy="20" r="2" fill="currentColor" />
                                <circle cx="80" cy="20" r="2" fill="currentColor" />
                                <circle cx="20" cy="40" r="2" fill="currentColor" />
                                <circle cx="40" cy="40" r="2" fill="currentColor" />
                                <circle cx="60" cy="40" r="2" fill="currentColor" />
                                <circle cx="80" cy="40" r="2" fill="currentColor" />
                            </svg>
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Total Students
                                    </p>
                                    <h3 className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
                                        {stats?.totalLearners}
                                    </h3>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-500/10 dark:to-teal-600/5 shadow-inner">
                                    <Users className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue Card */}
                    <Card className="relative bg-gradient-to-br from-white via-emerald-50/30 to-white dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] dark:opacity-[0.05]">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-600">
                                <path d="M10 50 L30 30 L50 40 L70 20 L90 35" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path d="M10 60 L30 40 L50 50 L70 30 L90 45" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Revenue Generated
                                    </p>
                                    <h3 className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
                                        ₹{stats?.totalRevenue.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-600/5 shadow-inner">
                                    <TrendingUp className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Card */}
                    <Card className="relative bg-gradient-to-br from-white via-indigo-50/30 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] dark:opacity-[0.05]">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-600">
                                <rect x="20" y="20" width="15" height="15" fill="currentColor" />
                                <rect x="45" y="20" width="15" height="15" fill="currentColor" />
                                <rect x="70" y="20" width="15" height="15" fill="currentColor" />
                                <rect x="20" y="45" width="15" height="15" fill="currentColor" />
                            </svg>
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Status
                                    </p>
                                    <div className="flex items-center gap-2.5 mt-2">
                                        <Badge
                                            variant={course?.is_published ? "default" : "secondary"}
                                            className={course?.is_published ? "bg-green-500 hover:bg-green-600 shadow-sm" : "shadow-sm"}
                                        >
                                            {course?.is_published ? "Published" : "Draft"}
                                        </Badge>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            {course?.is_published ? "Visible to students" : "Hidden from search"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-500/10 dark:to-indigo-600/5 shadow-inner">
                                    <ShieldCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Management Tools Section */}
                <div className="space-y-5 pt-4">
                    <div>
                        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Management Tools
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {quickActions.map((action, i) => (
                            <Link key={i} href={action.href} prefetch={true}>
                                <Card className="relative group h-full border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-green-300 dark:hover:border-green-700 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer overflow-hidden active:scale-[0.99]">
                                    {/* Background Graphic */}
                                    <div className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05] transition-opacity duration-200">
                                        <svg viewBox="0 0 100 100" className="w-full h-full text-green-600">
                                            <circle cx="50" cy="50" r="40" fill="currentColor" />
                                            <circle cx="50" cy="50" r="25" fill="white" />
                                        </svg>
                                    </div>

                                    <CardContent className="p-6 relative z-10">
                                        <div className="flex items-start gap-4">
                                            <div className="relative p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-gradient-to-br group-hover:from-green-50 group-hover:to-green-100/50 dark:group-hover:from-green-500/10 dark:group-hover:to-green-600/5 transition-all duration-150 shrink-0 shadow-sm">
                                                {action.icon}
                                                {/* Icon background glow */}
                                                <div className="absolute inset-0 rounded-xl bg-green-500/0 group-hover:bg-green-500/5 blur-xl transition-all duration-150" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                                    <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-150">
                                                        {action.title}
                                                    </h3>
                                                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-green-500 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-150 shrink-0" />
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Content Snapshot Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
                    <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-500/10 dark:to-green-600/5">
                                    <PlayCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                Curriculum Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Total Lessons</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {stats?.totalLessons} lessons published
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 h-full w-full shadow-sm"></div>
                            </div>
                            <Button variant="outline" className="w-full h-10 mt-2 hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-300 dark:hover:border-green-700 transition-all" asChild>
                                <Link href={`/admin/courses/${courseId}/builder`}>Manage Curriculum</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-600/5">
                                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                                <Users className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Join Student Management to see live activity logs
                            </p>
                            <Button variant="link" size="sm" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300" asChild>
                                <Link href="/admin/students">Go to Students</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/50">
            <div className="p-6 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto animate-pulse">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-9 w-80" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <div className="space-y-5 pt-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
                    {[1, 2].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
                </div>
            </div>
        </div>
    );
}

export default function CourseDashboardPageWrapper() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <CourseDashboardContent />
        </Suspense>
    );
}
