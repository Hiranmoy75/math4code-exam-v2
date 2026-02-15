'use client';

import { useLessonData } from "@/hooks/useLessonData";
import { PlayCircle, FileText, Users, Clock, Target, Zap, CheckCircle, Sparkles, RefreshCw } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { BunnyPlayer } from "@/components/BunnyPlayer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizPlayer } from "@/components/QuizPlayer";
import CustomPDFViewer from "@/components/CustomPDFViewer";
import { CommunityButton } from "@/components/CommunityButton";
import { QuizSkeleton, VideoSkeleton, TextSkeleton } from "@/components/skeletons/LessonSkeletons";
import React from "react";
import { toast } from "sonner";

export default function LessonContentClient({
    lessonId,
    courseId,
    user,
    contentType // Optional: Use for showing specific skeleton
}: {
    lessonId: string;
    courseId: string;
    user: any;
    contentType?: 'video' | 'quiz' | 'text' | 'pdf';
}) {
    // ⚡ GUARD: Prevent query with invalid lessonId
    // Show skeleton while parent component determines the correct lesson
    if (!lessonId) {
        if (contentType === 'video') return <VideoSkeleton />;
        if (contentType === 'quiz') return <QuizSkeleton />;
        return <TextSkeleton />;
    }

    // ⚡ CRITICAL: Use isPending AND check for data existence
    // isPending = true only on FIRST load (no data at all)
    // isLoading = true even when showing placeholder data
    // This ensures we show previous lesson instantly while fetching new one
    const { data: fullData, isPending, isError, isFetching } = useLessonData(lessonId, courseId);

    // Only show skeleton if BOTH conditions are true:
    // 1. isPending (no query has run yet)
    // 2. No data exists (not even placeholder/cached data)
    if (isPending && !fullData) {
        if (contentType === 'video') return <VideoSkeleton />;
        if (contentType === 'quiz') return <QuizSkeleton />;
        return <TextSkeleton />;
    }

    if (isError || !fullData || fullData.error) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in">
                <div className="bg-destructive/10 border border-destructive/20 p-8 rounded-2xl shadow-sm max-w-md">
                    <h3 className="text-xl font-bold mb-2 text-destructive">Failed to Load Content</h3>
                    <p className="text-muted-foreground mb-6">We couldn't load the lesson content. Please try again.</p>
                </div>
            </div>
        );
    }

    const { lesson, exam, attempts, questionsCount, author } = fullData;
    const isQuiz = lesson.content_type === "quiz";
    const isVideo = lesson.content_type === "video";
    const isPdf = lesson.content_type === "pdf";
    const isText = lesson.content_type === "text";


    // ⚡ INSTANT TRANSITIONS: Detect stale data from keepPreviousData
    // When navigating Lesson 1 → Lesson 2, fullData still contains Lesson 1 briefly
    // Show skeleton instead of wrong content for instant, correct display

    // Check for stale data for ALL lesson types
    if (lesson.id !== lessonId) {
        if (isQuiz) return <QuizSkeleton />;
        if (isVideo) return <VideoSkeleton />;
        // PDF and text both use TextSkeleton
        if (isPdf || isText) return <TextSkeleton />;
    }

    if (isVideo) {
        // Live Class Check
        if (lesson.is_live && lesson.meeting_url) {
            return <LiveClassView lesson={lesson} author={author} user={user} />;
        }

        // Regular Video Lesson
        return (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-background animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Video Section */}
                <div className="w-full bg-background relative shadow-lg z-20 shrink-0 py-4 md:py-6">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <div className="w-full h-auto aspect-video bg-background flex items-center justify-center overflow-hidden rounded-xl shadow-2xl">
                            {lesson.content_url || lesson.bunny_video_id || lesson.bunny_stream_id ? (
                                <>
                                    {lesson.video_provider === 'bunny' && (lesson.bunny_video_id || lesson.bunny_stream_id) ? (
                                        <BunnyPlayer
                                            videoId={lesson.bunny_video_id || lesson.bunny_stream_id || ''}
                                            libraryId={lesson.bunny_library_id || ''}
                                            videoType={lesson.video_type || 'vod'}
                                            videoStatus={lesson.video_status}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <VideoPlayer
                                            url={lesson.content_url}
                                            className="w-full h-full"
                                            thumbUrl={lesson.thumbnail_url}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-white/50">
                                    <PlayCircle className="h-16 w-16 mb-2 opacity-50" />
                                    <span className="text-sm">Video content unavailable</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs & Details */}
                <div className="flex-1 bg-background">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="bg-muted/50 p-1 h-auto rounded-lg mb-6 inline-flex flex-wrap gap-1">
                                <TabsTrigger value="overview" className="px-4 py-1.5 text-sm rounded-md font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                                <TabsTrigger value="resources" className="px-4 py-1.5 text-sm rounded-md font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Resources</TabsTrigger>
                                <TabsTrigger value="discussion" className="px-4 py-1.5 text-sm rounded-md font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Discussion</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 duration-300">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="prose dark:prose-invert max-w-none">
                                            <h3 className="text-lg font-semibold mb-2">About this lesson</h3>
                                            {lesson.description ? (
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {lesson.description}
                                                </p>
                                            ) : (
                                                <p className="text-muted-foreground italic">No description available.</p>
                                            )}
                                        </div>
                                        {lesson.content_text && (
                                            <div className="mt-8 pt-8 border-t border-border">
                                                <h3 className="text-lg font-semibold mb-4">Lesson Transcript / Notes</h3>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: lesson.content_text }}
                                                    className="rich-text-content prose dark:prose-invert max-w-none text-sm text-muted-foreground"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-6">
                                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Avatar className="h-10 w-10 border border-border">
                                                    <AvatarImage src={author?.avatar_url || ""} />
                                                    <AvatarFallback>IN</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{author?.full_name || 'Instructor'}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Instructor</p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Duration</span>
                                                    <span>{Math.round((lesson.duration || 300) / 60)} mins</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="resources" className="animate-in fade-in-50 duration-300">
                                <div className="p-12 border border-dashed border-border rounded-xl text-center bg-muted/20">
                                    <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                    <h3 className="text-lg font-medium">No Resources</h3>
                                    <p className="text-muted-foreground">There are no additional resources attached to this lesson.</p>
                                </div>
                            </TabsContent>
                            <TabsContent value="discussion" className="animate-in fade-in-50 duration-300">
                                <div className="max-w-2xl mx-auto text-center py-12">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/20 p-4 rounded-full inline-flex mb-6">
                                        <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">Join the Conversation</h3>
                                    <p className="text-muted-foreground mb-8">
                                        Connect with fellow students, ask questions, and share insights about this lesson.
                                    </p>
                                    <CommunityButton />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }

    if (isQuiz) {
        return (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto relative bg-slate-50 dark:bg-background animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Main Content Area */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 w-full">

                    {lesson.exam_id && exam ? (
                        <div className="animate-in fade-in zoom-in-95 duration-500 ease-out">
                            {/* Quiz Player Container - Premium Card Design */}
                            <div className="bg-white/90 dark:bg-card/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200/80 dark:border-border overflow-hidden">
                                <QuizPlayer
                                    key={exam.id}
                                    exam={exam}
                                    attempts={attempts || []}
                                    userId={user.id}
                                    questionsCount={questionsCount || 0}
                                />
                            </div>
                        </div>
                    ) : (
                        /* Empty State - Enhanced "Coming Soon" Design */
                        <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-full max-w-xl bg-white/95 dark:bg-card/95 backdrop-blur-sm p-12 rounded-3xl border border-slate-200/80 dark:border-border shadow-2xl shadow-slate-300/40 dark:shadow-none text-center relative overflow-hidden">

                                {/* Decorative Top Accent */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                                {/* Icon Container - Multi-layer Design */}
                                <div className="relative inline-flex items-center justify-center mb-8">
                                    {/* Outer glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl blur-2xl opacity-20 animate-pulse" />
                                    {/* Main icon background */}
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                                        <Clock className="h-10 w-10 text-white" strokeWidth={2.5} />
                                    </div>
                                    {/* Sparkle accent */}
                                    <div className="absolute -top-1 -right-1">
                                        <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                                    </div>
                                </div>

                                {/* Heading with Gradient */}
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                                    Test in Preparation
                                </h3>

                                {/* Description */}
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-md mx-auto">
                                    Our team is crafting engaging questions to help you master this lesson.
                                    <br className="hidden sm:block" />
                                    Check back soon or continue exploring other lessons.
                                </p>

                                {/* Feature Highlights */}
                                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full">
                                        <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Comprehensive</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-full">
                                        <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Interactive</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full">
                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Validated</span>
                                    </div>
                                </div>

                                {/* Status Badge with Pulse */}
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-full mb-8">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 tracking-wide">IN PROGRESS</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // STANDARD LAYOUT (Text, PDF)
    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-background animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-full max-w-4xl mx-auto p-6 md:p-10 space-y-8">
                {/* Content Title / Metadata */}
                <div className="space-y-4 text-center border-b border-border pb-8">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        {lesson.content_type} Lesson
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{lesson.title}</h1>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-border">
                                <AvatarImage src={author?.avatar_url || ""} />
                                <AvatarFallback>IN</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{author?.full_name || "Instructor"}</span>
                        </div>
                        <span>•</span>
                        <span>{lesson.duration ? `${Math.round(lesson.duration / 60)} min read` : "5 min read"}</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="space-y-8">
                    {lesson.content_type === "pdf" && (
                        <div className="rounded-xl border border-border overflow-hidden bg-muted/20 shadow-sm">
                            {lesson?.content_url ? (
                                <div className="aspect-4/3 w-full">
                                    <CustomPDFViewer
                                        url={lesson.content_url}
                                        title={lesson.title}
                                        allowDownload={lesson.is_downloadable ?? true}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                    <FileText className="h-16 w-16 opacity-20 mb-4" />
                                    <span className="text-lg font-medium">PDF Content Not Available</span>
                                </div>
                            )}
                        </div>
                    )}

                    {lesson.content_type === "text" && (
                        <div className="prose dark:prose-invert max-w-none prose-lg">
                            {lesson.content_text ? (
                                <>
                                    <style>{`
                                        .rich-text-content { font-size: 1.125rem; line-height: 1.8; }
                                        .rich-text-content h1, .rich-text-content h2 { color: var(--foreground); margin-top: 2em; margin-bottom: 1em; }
                                        .rich-text-content p { margin-bottom: 1.5em; color: var(--muted-foreground); }
                                        .rich-text-content strong { color: var(--foreground); font-weight: 700; }
                                        .rich-text-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; }
                                        .rich-text-content blockquote { border-left: 4px solid var(--primary); padding-left: 1em; font-style: italic; color: var(--muted-foreground); }
                                        .rich-text-content code { background: var(--muted); padding: 0.2em 0.4em; rounded: 0.25em; font-size: 0.9em; }
                                    `}</style>
                                    <div dangerouslySetInnerHTML={{ __html: lesson.content_text }} className="rich-text-content" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
                                    <FileText className="h-20 w-20 opacity-20 mb-4" />
                                    <span className="text-lg font-medium">Text Content Not Available</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="pt-8 border-t border-border mt-12 flex flex-col items-center gap-4">
                    <p className="text-muted-foreground italic text-center text-sm">
                        End of lesson. Mark as complete to continue.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Live Class View Component with Countdown Timer
function LiveClassView({ lesson, author, user }: { lesson: any; author: any; user: any }) {
    const [timeLeft, setTimeLeft] = React.useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isLive: boolean;
        hasEnded: boolean;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false, hasEnded: false });

    React.useEffect(() => {
        const calculateTimeLeft = () => {
            if (!lesson.meeting_date) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true, hasEnded: false });
                return;
            }

            const meetingTime = new Date(lesson.meeting_date).getTime();
            const now = new Date().getTime();
            const difference = meetingTime - now;

            // Meeting has ended (more than 2 hours past)
            if (difference < -7200000) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false, hasEnded: true });
                return;
            }

            // Meeting is live (Starts 15 mins before, continues until 2 hours after)
            // 900000 ms = 15 minutes before start
            if (difference < 900000) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true, hasEnded: false });
                return;
            }

            // Meeting is upcoming
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds, isLive: false, hasEnded: false });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [lesson.meeting_date]);

    // Extract Zoom Details
    const zoomDetails = React.useMemo(() => {
        if (!lesson.meeting_url || !lesson.meeting_url.includes('zoom.us')) return null;

        try {
            const urlObj = new URL(lesson.meeting_url);
            // Support /j/MEETING_ID format
            const pathParts = urlObj.pathname.split('/');
            const jIndex = pathParts.indexOf('j');
            let meetingId = null;

            if (jIndex !== -1 && pathParts[jIndex + 1]) {
                meetingId = pathParts[jIndex + 1];
            }

            const password = urlObj.searchParams.get('pwd');

            if (meetingId) {
                return { meetingId, password };
            }
        } catch (e) {
            console.error("Zoom URL parse error", e);
        }
        return null;
    }, [lesson.meeting_url]);

    const handleJoinMeeting = () => {
        if (!timeLeft.hasEnded && lesson.meeting_url) {
            window.open(lesson.meeting_url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleCopyLink = () => {
        if (!timeLeft.hasEnded && lesson.meeting_url) {
            navigator.clipboard.writeText(lesson.meeting_url);
            toast.success("Meeting link copied!");
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-4xl space-y-6">
                    {/* Main Live Class Card - Professional Design */}
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-emerald-900/5">
                        {/* Subtle Professional Header Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

                        <div className="relative p-8 md:p-12 space-y-8">
                            {/* Header */}
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                                    <div className={`w-2 h-2 rounded-full ${timeLeft.isLive ? 'bg-red-500 animate-pulse' : timeLeft.hasEnded ? 'bg-slate-400' : 'bg-emerald-600'}`} />
                                    <span className={`text-xs font-bold tracking-wide ${timeLeft.isLive ? 'text-red-600 dark:text-red-400' : timeLeft.hasEnded ? 'text-slate-500' : 'text-emerald-700 dark:text-emerald-400'}`}>
                                        {timeLeft.isLive ? 'LIVE NOW' : timeLeft.hasEnded ? 'SESSION ENDED' : 'UPCOMING SESSION'}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                    {lesson.title}
                                </h1>

                                {lesson.meeting_platform && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                        <PlayCircle className="h-3 w-3" />
                                        {lesson.meeting_platform.toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Countdown Timer or Live Status */}
                            {(!timeLeft.hasEnded || timeLeft.isLive) && !timeLeft.hasEnded && (
                                <div className="bg-gradient-to-br from-muted/50 to-muted/30 dark:from-muted/30 dark:to-muted/20 rounded-2xl p-8 border border-border/50">
                                    {timeLeft.isLive ? (
                                        <div className="text-center space-y-4">
                                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50">
                                                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                                <span className="text-lg font-bold">Class is Live!</span>
                                            </div>
                                            <p className="text-muted-foreground">Join now to participate in the live session</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                                Starts In
                                            </p>
                                            <div className="grid grid-cols-4 gap-3 md:gap-4">
                                                {[
                                                    { label: 'Days', value: timeLeft.days },
                                                    { label: 'Hours', value: timeLeft.hours },
                                                    { label: 'Minutes', value: timeLeft.minutes },
                                                    { label: 'Seconds', value: timeLeft.seconds }
                                                ].map((item) => (
                                                    <div key={item.label} className="flex flex-col items-center">
                                                        <div className="w-full aspect-square flex items-center justify-center rounded-xl bg-gradient-to-br from-background to-muted border border-border shadow-sm">
                                                            <span className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                                                {String(item.value).padStart(2, '0')}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs font-medium text-muted-foreground mt-2 uppercase tracking-wide">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {timeLeft.hasEnded && (
                                <div className="text-center p-6 rounded-xl bg-muted/50 border border-border/50">
                                    <p className="text-muted-foreground font-medium">This live class has ended.</p>
                                    <p className="text-xs text-muted-foreground mt-1">Recording may be available soon.</p>
                                </div>
                            )}

                            {/* Meeting Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Instructor Card */}
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                                    <Avatar className="h-12 w-12 border-2 border-border">
                                        <AvatarImage src={author?.avatar_url || ""} />
                                        <AvatarFallback>IN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{author?.full_name || 'Instructor'}</p>
                                        <p className="text-xs text-muted-foreground">Host</p>
                                    </div>
                                </div>

                                {/* Date/Time Card */}
                                {lesson.meeting_date && (
                                    <div className="flex items-center gap-4 p-5 rounded-xl bg-muted/30 border border-border/60 hover:bg-muted/50 transition-colors">
                                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                                            <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {new Date(lesson.meeting_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(lesson.meeting_date).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Regular Join (App) */}
                                <button
                                    onClick={handleJoinMeeting}
                                    disabled={timeLeft.hasEnded || (!timeLeft.isLive && timeLeft.days > 0)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 ${timeLeft.hasEnded
                                        ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 shadow-none cursor-not-allowed border border-slate-200 dark:border-slate-700'
                                        : timeLeft.isLive
                                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-[1.02]'
                                            : timeLeft.days > 0
                                                ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02]'
                                        }`}
                                >
                                    <PlayCircle className="h-5 w-5" />
                                    {timeLeft.hasEnded ? 'Class Ended' : timeLeft.isLive ? 'Join Live Class' : 'Join Live Class'}
                                </button>

                                <button
                                    onClick={handleCopyLink}
                                    disabled={timeLeft.hasEnded}
                                    className={`px-4 py-4 rounded-xl font-semibold border-2 transition-all duration-200 ${timeLeft.hasEnded
                                        ? 'border-slate-200 text-slate-300 dark:border-slate-700 dark:text-slate-600 cursor-not-allowed bg-transparent'
                                        : 'border-border hover:bg-muted hover:scale-105'
                                        }`}
                                    title="Copy Link"
                                >
                                    <Sparkles className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    {lesson.description && (
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">About This Class</h3>
                            <p className="text-muted-foreground leading-relaxed">{lesson.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
