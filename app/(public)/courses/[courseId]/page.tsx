import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, PlayCircle, FileText, Lock, Unlock, Clock, Award, BookOpen } from "lucide-react";
import EnrollButton from "@/components/course/EnrollButton";
import { CourseThumbnail } from "@/components/ui/CourseThumbnail";
import { CourseSchema } from "@/components/seo/StructuredData";
import { Header } from "@/components/landing/Header";

export { generateMetadata } from './metadata';

export default async function CourseLandingPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Fetch course details
    const { data: course } = await supabase
        .from("courses")
        .select("*, profiles:creator_id(full_name)")
        .eq("id", courseId)
        .single();

    if (!course) {
        redirect("/courses");
    }

    // Fetch modules and lessons (Optimized RPC)
    let { data: modulesData, error: modulesError } = await supabase
        .rpc('get_course_structure', { target_course_id: courseId });

    if (modulesError) {
        const { data: fallbackData } = await supabase
            .from("modules")
            .select(`
                *,
                lessons (*)
            `)
            .eq("course_id", courseId)
            .order("module_order", { ascending: true });

        // Manually sort since standard query doesn't sort nested by default in all cases or if needed
        if (fallbackData) {
            modulesData = fallbackData.map((m: any) => ({
                ...m,
                lessons: (m.lessons || []).sort((a: any, b: any) => a.lesson_order - b.lesson_order)
            }));
        } else {
            modulesData = [];
        }
    }

    // Check enrollment
    let isEnrolled = false;
    if (user) {
        const { data: enrollment } = await supabase
            .from("enrollments")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();
        isEnrolled = !!enrollment;
    }

    // RPC returns presorted data via SQL
    const modulesWithSortedLessons = (modulesData || []).map((module: any) => ({
        ...module,
        lessons: module.lessons || []
    }));

    const totalLessons = modulesWithSortedLessons.reduce((acc: any, m: any) => acc + m.lessons.length, 0);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />
            <CourseSchema
                name={course.title}
                description={course.description || ''}
                instructor={(course.profiles as any)?.full_name}
                price={course.price}
                image={course.thumbnail_url}
                url={`https://www.math4code.com/courses/${courseId}`}
            />
            <main className="pb-20">
                {/* Hero Section - Light & Fresh */}
                <div className="relative bg-gradient-to-b from-green-50/50 to-white overflow-hidden">
                    {/* Background Decor - Halka Green Blobs */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/40 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/4" />
                    <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[80px] -z-10 -translate-x-1/4" />

                    <div className="container mx-auto px-4 md:px-6 pt-32 pb-16 md:pt-40 md:pb-24 relative z-10">
                        <div className="grid lg:grid-cols-3 gap-12 items-start">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-4">
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 px-3 py-1 text-sm font-medium">
                                        {course.category || "Course"}
                                    </Badge>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
                                        {course.title}
                                    </h1>
                                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
                                        {course.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-sm ring-4 ring-slate-100 shadow-sm">
                                            {(course.profiles as any)?.full_name?.[0] || "I"}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Instructor</p>
                                            <p className="font-bold text-slate-900 text-sm">{(course.profiles as any)?.full_name || "Expert Faculty"}</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                                    <div className="flex items-center gap-2 text-slate-600 bg-white py-1.5 px-3 rounded-full border border-slate-100 shadow-sm">
                                        <BookOpen className="h-4 w-4 text-green-600" />
                                        <span className="font-medium text-sm">{totalLessons} Lessons</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 bg-white py-1.5 px-3 rounded-full border border-slate-100 shadow-sm">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium text-sm">Lifetime Access</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 bg-white py-1.5 px-3 rounded-full border border-slate-100 shadow-sm">
                                        <Award className="h-4 w-4 text-amber-500" />
                                        <span className="font-medium text-sm">Certificate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-20">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Course Content */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 pb-4 border-b border-slate-50">
                                    <span className="bg-green-50 p-2 rounded-xl text-green-600">
                                        <FileText className="h-6 w-6" />
                                    </span>
                                    Course Curriculum
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-3">
                                    {modulesWithSortedLessons.map((module: any) => (
                                        <AccordionItem key={module.id} value={module.id} className="border border-slate-200 rounded-xl px-2 overflow-hidden bg-slate-50/30 data-[state=open]:bg-white data-[state=open]:shadow-sm transition-all duration-200">
                                            <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-white rounded-lg transition-colors group">
                                                <div className="flex flex-col items-start text-left gap-1 transition-transform group-hover:translate-x-1 duration-200">
                                                    <div className="font-bold text-lg text-slate-800 group-hover:text-green-700 transition-colors">{module.title}</div>
                                                    <div className="text-sm text-slate-500 font-normal flex items-center gap-2">
                                                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                                                            {module.lessons.length} lessons
                                                        </span>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-2 pb-4 px-4 border-t border-slate-100 mt-2 bg-white">
                                                <div className="space-y-1">
                                                    {module.lessons.map((lesson: any) => {
                                                        const isAccessible = isEnrolled || lesson.is_free_preview;

                                                        return (
                                                            <div key={lesson.id} className={`flex items-center justify-between p-3 rounded-lg transition-all group/lesson w-full ${isAccessible ? 'hover:bg-green-50/50 hover:border-green-100 border border-transparent cursor-pointer' : 'opacity-70 cursor-default grayscale'}`}>
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2 rounded-lg ${lesson.content_type === "video" ? "bg-blue-50 text-blue-600 group-hover/lesson:bg-blue-100" : "bg-emerald-50 text-emerald-600 group-hover/lesson:bg-emerald-100"} transition-colors shadow-sm`}>
                                                                        {lesson.content_type === "video" ? (
                                                                            <PlayCircle className="h-4 w-4" />
                                                                        ) : (
                                                                            <FileText className="h-4 w-4" />
                                                                        )}
                                                                    </div>
                                                                    <span className={`font-medium text-sm transition-colors text-slate-700 ${isAccessible ? "group-hover/lesson:text-green-700" : ""}`}>{lesson.title}</span>
                                                                </div>
                                                                <div>
                                                                    {lesson.is_free_preview ? (
                                                                        <Badge variant="secondary" className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 border border-green-200 shadow-sm">
                                                                            <Unlock className="h-3 w-3" /> Preview
                                                                        </Badge>
                                                                    ) : (
                                                                        <Lock className="h-4 w-4 text-slate-300" />
                                                                    )}
                                                                </div>
                                                                {isAccessible && (
                                                                    <Link
                                                                        href={`/learn/${courseId}?lessonId=${lesson.id}`}
                                                                        className="absolute inset-0"
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>

                        {/* Sidebar - Floating Card */}
                        <div className="lg:col-span-1 lg:-mt-32 relative z-30">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ring-1 ring-slate-900/5">
                                    <div className="aspect-video bg-slate-100 relative group overflow-hidden">
                                        <CourseThumbnail
                                            src={course.thumbnail_url}
                                            title={course.title}
                                            category={course.category || "Course"}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center backdrop-blur-[1px]">
                                            <div className="bg-white/95 p-4 rounded-full shadow-2xl transform scale-100 group-hover:scale-110 transition-all duration-300 cursor-pointer text-green-600 ring-4 ring-white/30">
                                                <PlayCircle className="h-10 w-10 fill-current" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="space-y-1 pb-4 border-b border-slate-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-slate-500">Price</span>
                                                {course.price > 0 && (
                                                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-100">
                                                        30% OFF
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                                    {course.price === 0 ? "Free" : `₹ ${course.price}`}
                                                </div>
                                                {course.price > 0 && (
                                                    <div className="text-lg font-medium text-slate-400 line-through decoration-slate-300 decoration-2">
                                                        ₹ {Math.round(course.price * 1.5)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <EnrollButton
                                            courseId={course.id}
                                            price={course.price}
                                            isEnrolled={isEnrolled}
                                            isLoggedIn={!!user}
                                        />

                                        <div className="space-y-4 pt-2">
                                            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-2 rounded-lg">
                                                <div className="p-1.5 rounded-md bg-white text-green-600 shadow-sm border border-slate-100">
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="font-medium">Access on mobile and TV</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-2 rounded-lg">
                                                <div className="p-1.5 rounded-md bg-white text-blue-600 shadow-sm border border-slate-100">
                                                    <Clock className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="font-medium">{course.duration_months
                                                    ? `Valid for ${course.duration_months} months`
                                                    : 'Full lifetime access'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-2 rounded-lg">
                                                <div className="p-1.5 rounded-md bg-white text-amber-500 shadow-sm border border-slate-100">
                                                    <Award className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="font-medium">Certificate of completion</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Bar */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-slate-200 lg:hidden z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <div className="text-sm font-medium text-slate-500 mb-0.5">Total Price</div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-2xl font-bold text-slate-900">
                                    {course.price === 0 ? "Free" : `₹ ${course.price}`}
                                </div>
                                {course.price > 0 && (
                                    <div className="text-xs font-medium text-slate-400 line-through decoration-slate-300">
                                        ₹ {Math.round(course.price * 1.5)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 max-w-[200px]">
                            <EnrollButton
                                courseId={course.id}
                                price={course.price}
                                isEnrolled={isEnrolled}
                                isLoggedIn={!!user}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
