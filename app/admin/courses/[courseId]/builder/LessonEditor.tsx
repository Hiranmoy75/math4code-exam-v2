"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lesson, Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, FileText, File, HelpCircle, Trash, Save, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { BunnyUploader } from "./BunnyUploader";
import { BunnyPlayer } from "@/components/BunnyPlayer";
import { ExamSettingsDialog } from "@/components/ExamSettingsDialog";

// Code split RichTextEditor
const RichTextEditor = dynamic(
    () => import("@/components/RichTextEditor").then((mod) => ({ default: mod.RichTextEditor })),
    {
        loading: () => (
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
        ),
        ssr: false,
    }
);

// Lazy load VideoPlayer
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
    loading: () => (
        <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
    ),
    ssr: false,
});

interface LessonEditorProps {
    lesson: Lesson;
    course: Course;
    onUpdate: (updates: Partial<Lesson>) => Promise<any>;
    onDelete: (id: string) => void;
}

export function LessonEditor({ lesson, course, onUpdate, onDelete }: LessonEditorProps) {
    const [title, setTitle] = useState(lesson.title);
    const [contentUrl, setContentUrl] = useState(lesson.content_url || "");
    const [contentText, setContentText] = useState(lesson.content_text || "");
    const [isSaving, setIsSaving] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfMode, setPdfMode] = useState<"upload" | "link">(lesson.content_url && !lesson.content_url.includes("supabase") ? "link" : "upload");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showExamSettings, setShowExamSettings] = useState(false);
    const [availableExams, setAvailableExams] = useState<any[]>([]);
    const [selectedExamId, setSelectedExamId] = useState(lesson.exam_id || "");
    const [isLoadingExams, setIsLoadingExams] = useState(false);
    const supabase = createClient();

    // Load available exams for quiz lessons
    useEffect(() => {
        if (lesson.content_type === "quiz") {
            loadAvailableExams();
        }
    }, [lesson.content_type]);

    const loadAvailableExams = async () => {
        setIsLoadingExams(true);
        try {
            // ✅ Get tenant ID
            const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

            let query = supabase
                .from("exams")
                .select("id, title, status")
                .eq("status", "published")
                .order("created_at", { ascending: false });

            // ✅ Filter by tenant if available
            if (tenantId) {
                query = query.eq("tenant_id", tenantId);
            }

            const { data, error } = await query;

            if (error) throw error;
            setAvailableExams(data || []);
        } catch (error) {
            console.error("Error loading exams:", error);
        } finally {
            setIsLoadingExams(false);
        }
    };

    const handleExamChange = async (newExamId: string) => {
        try {
            await onUpdate({ exam_id: newExamId || null });
            setSelectedExamId(newExamId);
            toast.success(newExamId ? "Exam linked successfully" : "Exam unlinked");
        } catch (error) {
            console.error("Error updating exam:", error);
            toast.error("Failed to update exam");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let finalContentUrl = contentUrl;

            // Handle PDF upload if new file selected (upload mode)
            if (lesson.content_type === "pdf" && pdfMode === "upload" && pdfFile) {
                const fileName = `course-content/${Date.now()}-${pdfFile.name.replace(/\s+/g, "_")}`;
                const { error: uploadError } = await supabase.storage
                    .from("uploads")
                    .upload(fileName, pdfFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);
                finalContentUrl = data.publicUrl;
            }

            // Handle PDF link mode — convert Google Drive share link to embed link if needed
            if (lesson.content_type === "pdf" && pdfMode === "link") {
                finalContentUrl = convertGoogleDriveLink(contentUrl);
            }

            // Convert video URL to embed format
            if (lesson.content_type === "video") {
                finalContentUrl = convertToEmbedUrl(contentUrl);
            }

            const updates = {
                title,
                content_url: finalContentUrl,
                content_text: contentText,
                is_downloadable: lesson.is_downloadable,
            };

            // Optimistic Update: Don't await the result
            onUpdate(updates).catch((error) => {

                toast.error("Background save failed! Your work is preserved.", {
                    duration: Infinity,
                    action: {
                        label: "Retry Save",
                        onClick: () => {
                            toast.info("Retrying save...");
                            onUpdate(updates).then(() => toast.success("Retry successful!"))
                                .catch(() => toast.error("Retry failed again."));
                        }
                    }
                });
            });

            toast.success("Saved");
        } catch (error: any) {

            toast.error(error.message || "Failed to update lesson");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-[#161b22]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                    {lesson.content_type === "video" && <Video className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
                    {lesson.content_type === "text" && <FileText className="h-5 w-5 text-green-500 dark:text-green-400" />}
                    {lesson.content_type === "pdf" && <File className="h-5 w-5 text-red-500 dark:text-red-400" />}
                    {lesson.content_type === "quiz" && <HelpCircle className="h-5 w-5 text-purple-500 dark:text-purple-400" />}
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="font-semibold text-lg border-none shadow-none focus-visible:ring-0 px-0 bg-transparent dark:text-white"
                        placeholder="Lesson Title"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="free-preview-toggle"
                            checked={lesson.is_free_preview}
                            onCheckedChange={(checked) => onUpdate({ is_free_preview: checked })}
                        />
                        <Label htmlFor="free-preview-toggle" className="text-sm font-medium dark:text-slate-300 whitespace-nowrap">Free Preview</Label>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)} className="dark:bg-transparent dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-red-400">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            {/* Sequential Learning Section */}
            <SequentialLearningSection
                lesson={lesson}
                onUpdate={onUpdate}
            />

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="dark:bg-[#161b22] dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="dark:text-white">Delete Lesson</AlertDialogTitle>
                        <AlertDialogDescription className="dark:text-slate-400">
                            Are you sure you want to delete "{title}"?
                            {lesson.video_provider === 'bunny' && lesson.bunny_video_id && (
                                <span className="block mt-2 text-amber-600 dark:text-amber-500">
                                    ⚠️ This will also delete the associated video from Bunny.net.
                                </span>
                            )}
                            <span className="block mt-2">
                                This action cannot be undone.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="dark:bg-transparent dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(lesson.id);
                                setShowDeleteDialog(false);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {lesson.content_type === "video" && (
                        <>
                            {/* Live Class - Show simple join button */}
                            {lesson.is_live && lesson.meeting_url ? (
                                <div className="space-y-4">
                                    <div className="p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Live Class Meeting</h3>
                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                    Scheduled for: {lesson.meeting_date ? new Date(lesson.meeting_date).toLocaleString() : 'Not scheduled'}
                                                </p>
                                            </div>
                                            <div className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                                {lesson.meeting_platform?.toUpperCase() || 'GOOGLE MEET'}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm font-medium text-blue-900 dark:text-blue-100">Meeting URL</Label>
                                                <div className="flex gap-2 mt-1">
                                                    <Input
                                                        value={lesson.meeting_url}
                                                        readOnly
                                                        className="bg-white dark:bg-slate-900 font-mono text-sm"
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(lesson.meeting_url || '');
                                                            toast.success('Meeting URL copied!');
                                                        }}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => lesson.meeting_url && window.open(lesson.meeting_url, '_blank', 'noopener,noreferrer')}
                                                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                                                size="lg"
                                            >
                                                <Video className="mr-2 h-5 w-5" />
                                                Start Live Class
                                            </Button>

                                            <p className="text-xs text-center text-blue-600 dark:text-blue-400">
                                                This will open the meeting in a new tab
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                                        <h4 className="font-medium mb-2 text-sm">📝 Instructions</h4>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <li>• Click "Start Live Class" to join the meeting</li>
                                            <li>• Students will see a countdown and join button</li>
                                            <li>• The meeting link is: {lesson.meeting_platform || 'Google Meet'}</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                /* Regular Video Lesson - Show 3 tabs */
                                <Tabs defaultValue="youtube" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="youtube">YouTube</TabsTrigger>
                                        <TabsTrigger value="upload">Upload Video</TabsTrigger>
                                        <TabsTrigger value="live">Go Live</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="youtube" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300">Video URL</Label>
                                            <Input
                                                value={contentUrl}
                                                onChange={(e) => setContentUrl(e.target.value)}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                            />
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Paste a YouTube or Vimeo URL</p>
                                        </div>

                                        {contentUrl && (
                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Preview</Label>
                                                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                                                    <VideoPlayer url={convertToEmbedUrl(contentUrl)} />
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="upload" className="space-y-4">
                                        <BunnyUploader
                                            lessonTitle={title}
                                            courseId={course.id}
                                            courseTitle={course.title}
                                            onUploadComplete={async (videoData) => {

                                                const updates: Partial<Lesson> = {
                                                    video_provider: 'bunny',
                                                    video_type: 'vod',
                                                    bunny_video_id: videoData.videoId,
                                                    bunny_guid: videoData.guid,
                                                    bunny_library_id: videoData.libraryId,
                                                    video_status: 'ready',
                                                    content_url: `https://iframe.mediadelivery.net/embed/${videoData.libraryId}/${videoData.guid}`
                                                };

                                                onUpdate(updates).then(() => {
                                                    toast.success('Video uploaded and saved successfully!');
                                                }).catch((error) => {

                                                    toast.error('Video uploaded but save failed! Your work is preserved.', {
                                                        duration: Infinity,
                                                        action: {
                                                            label: "Retry Save",
                                                            onClick: () => {
                                                                toast.info("Retrying save...");
                                                                onUpdate(updates).then(() => toast.success("Retry successful!"))
                                                                    .catch(() => toast.error("Retry failed again."));
                                                            }
                                                        }
                                                    });
                                                });
                                            }}
                                            onError={(error) => {
                                                toast.error(error);
                                            }}
                                        />

                                        {lesson.bunny_video_id && lesson.bunny_library_id && (
                                            <div className="space-y-2">
                                                <Label className="dark:text-slate-300">Uploaded Video Preview</Label>
                                                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                                                    <BunnyPlayer
                                                        videoId={lesson.bunny_video_id}
                                                        libraryId={lesson.bunny_library_id}
                                                        videoType="vod"
                                                        videoStatus={lesson.video_status}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            )}
                        </>
                    )}


                    {lesson.content_type === "pdf" && (
                        <Tabs value={pdfMode} onValueChange={(v) => setPdfMode(v as "upload" | "link")} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="upload" className="flex items-center gap-2">
                                    <File className="h-4 w-4" />
                                    Upload PDF
                                </TabsTrigger>
                                <TabsTrigger value="link" className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                    Link (Google Drive / Other)
                                </TabsTrigger>
                            </TabsList>

                            {/* Upload PDF Tab */}
                            <TabsContent value="upload" className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="dark:text-slate-300">Upload New PDF (Optional)</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                        className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                    />
                                    {contentUrl && !pdfFile && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Current file: <a href={contentUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">View PDF</a>
                                        </p>
                                    )}
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch
                                            id="is-downloadable"
                                            checked={lesson.is_downloadable ?? true}
                                            onCheckedChange={(checked) => onUpdate({ ...lesson, is_downloadable: checked })}
                                        />
                                        <Label htmlFor="is-downloadable" className="dark:text-slate-300">Allow Download</Label>
                                    </div>
                                </div>

                                {contentUrl && !pdfFile && (
                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300">Preview</Label>
                                        <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                                            <iframe src={contentUrl} className="w-full h-full" />
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Link Tab */}
                            <TabsContent value="link" className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="dark:text-slate-300">PDF Link</Label>
                                    <Input
                                        value={contentUrl}
                                        onChange={(e) => setContentUrl(e.target.value)}
                                        placeholder="https://drive.google.com/file/d/... or any direct PDF URL"
                                        className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        💡 Google Drive share link automatically converted to embeddable preview. You can also paste any direct PDF URL.
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is-downloadable-link"
                                        checked={lesson.is_downloadable ?? true}
                                        onCheckedChange={(checked) => onUpdate({ ...lesson, is_downloadable: checked })}
                                    />
                                    <Label htmlFor="is-downloadable-link" className="dark:text-slate-300">Allow Download</Label>
                                </div>

                                {contentUrl && (
                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300">Preview</Label>
                                        <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                                            <iframe
                                                src={convertGoogleDriveLink(contentUrl)}
                                                className="w-full h-full"
                                                allow="autoplay"
                                            />
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    )}

                    {lesson.content_type === "text" && (
                        <div className="space-y-2">
                            <Label className="dark:text-slate-300">Content</Label>
                            <RichTextEditor
                                value={contentText}
                                onChange={setContentText}
                                placeholder="Enter your lesson content here..."
                                className="min-h-[400px] dark:bg-slate-900 dark:border-slate-700"
                            />
                        </div>
                    )}

                    {lesson.content_type === "quiz" && (
                        <div className="space-y-6">
                            {/* Exam Selection */}
                            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-4">
                                    <HelpCircle className="h-5 w-5 text-purple-500" />
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Exam Configuration</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium dark:text-slate-300">Linked Exam</Label>
                                        {isLoadingExams ? (
                                            <div className="text-sm text-slate-500">Loading exams...</div>
                                        ) : (
                                            <select
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                                value={selectedExamId}
                                                onChange={(e) => handleExamChange(e.target.value)}
                                            >
                                                <option value="">None - Upcoming Exam Placeholder</option>
                                                {availableExams.map((exam) => (
                                                    <option key={exam.id} value={exam.id}>
                                                        {exam.title}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {selectedExamId
                                                ? "Students will take this exam when they access this lesson."
                                                : "This is a placeholder. Link an exam when ready."}
                                        </p>
                                    </div>

                                    {selectedExamId && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowExamSettings(true)}
                                            className="w-full dark:bg-transparent dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                                        >
                                            Manage Exam Settings
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {selectedExamId && (
                                <ExamSettingsDialog
                                    open={showExamSettings}
                                    onOpenChange={setShowExamSettings}
                                    examId={selectedExamId}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

// Sequential Learning Configuration Component
function SequentialLearningSection({ lesson, onUpdate }: { lesson: Lesson, onUpdate: (updates: Partial<Lesson>) => Promise<any> }) {
    const [previousLessons, setPreviousLessons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // Local state for immediate UI update
    const [isSequentialEnabled, setIsSequentialEnabled] = useState(lesson.sequential_unlock_enabled || false);
    const [prerequisiteId, setPrerequisiteId] = useState(lesson.prerequisite_lesson_id || "");
    const supabase = createClient();

    // Sync local state with prop changes
    useEffect(() => {
        setIsSequentialEnabled(lesson.sequential_unlock_enabled || false);
        setPrerequisiteId(lesson.prerequisite_lesson_id || "");
    }, [lesson.sequential_unlock_enabled, lesson.prerequisite_lesson_id]);

    // Load previous lessons in the same module
    useEffect(() => {
        loadPreviousLessons();
    }, [lesson.module_id, lesson.lesson_order]);

    const loadPreviousLessons = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("lessons")
                .select("id, title, lesson_order, content_type")
                .eq("module_id", lesson.module_id)
                .lt("lesson_order", lesson.lesson_order)
                .order("lesson_order", { ascending: true });

            if (error) throw error;
            setPreviousLessons(data || []);
        } catch (error) {
            console.error("Error loading previous lessons:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleSequential = async (enabled: boolean) => {
        // Immediate UI update
        setIsSequentialEnabled(enabled);

        try {
            const updates: Partial<Lesson> = {
                sequential_unlock_enabled: enabled,
                // Auto-select previous lesson if enabling
                prerequisite_lesson_id: enabled && previousLessons.length > 0
                    ? previousLessons[previousLessons.length - 1].id
                    : null
            };

            // Update prerequisite ID in local state if auto-selecting
            if (enabled && previousLessons.length > 0) {
                setPrerequisiteId(previousLessons[previousLessons.length - 1].id);
            } else if (!enabled) {
                setPrerequisiteId("");
            }

            await onUpdate(updates);
            toast.success(enabled ? "Sequential unlock enabled" : "Sequential unlock disabled");
        } catch (error) {
            // Revert on error
            setIsSequentialEnabled(!enabled);
            toast.error("Failed to update sequential settings");
        }
    };

    const handlePrerequisiteChange = async (newPrerequisiteId: string) => {
        // Immediate UI update
        const previousValue = prerequisiteId;
        setPrerequisiteId(newPrerequisiteId);

        try {
            await onUpdate({ prerequisite_lesson_id: newPrerequisiteId || null });
            toast.success("Prerequisite updated");
        } catch (error) {
            // Revert on error
            setPrerequisiteId(previousValue);
            toast.error("Failed to update prerequisite");
        }
    };

    // Don't show for first lesson in module
    if (previousLessons.length === 0 && !isLoading) {
        return null;
    }

    return (
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Sequential Learning</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Require students to complete a previous lesson first
                        </p>
                    </div>
                    <Switch
                        id="sequential-toggle"
                        checked={isSequentialEnabled}
                        onCheckedChange={handleToggleSequential}
                        disabled={isLoading || previousLessons.length === 0}
                    />
                </div>

                {isSequentialEnabled && previousLessons.length > 0 && (
                    <div className="space-y-2 pl-4 border-l-2 border-orange-200 dark:border-orange-800">
                        <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            Previous Lesson Required
                        </Label>
                        <select
                            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            value={prerequisiteId}
                            onChange={(e) => handlePrerequisiteChange(e.target.value)}
                        >
                            {previousLessons.map((prevLesson) => (
                                <option key={prevLesson.id} value={prevLesson.id}>
                                    {prevLesson.title} ({prevLesson.content_type})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                            🔒 Students must complete the selected lesson to unlock this one
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper function to convert YouTube/Vimeo URLs to embed format
function convertToEmbedUrl(url: string): string {
    if (!url) return "";

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
}

// Helper function to convert Google Drive share/view links to embeddable preview URLs
function convertGoogleDriveLink(url: string): string {
    if (!url) return "";

    // Match Google Drive file share link: https://drive.google.com/file/d/FILE_ID/view?...
    const driveFileRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const driveFileMatch = url.match(driveFileRegex);
    if (driveFileMatch) {
        return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
    }

    // Match Google Drive open link: https://drive.google.com/open?id=FILE_ID
    const driveOpenRegex = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
    const driveOpenMatch = url.match(driveOpenRegex);
    if (driveOpenMatch) {
        return `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`;
    }

    // Already an embed/preview link — return as-is
    return url;
}
