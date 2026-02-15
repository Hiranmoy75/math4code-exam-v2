"use client";

import { useState } from "react";
import { SmartLink } from "@/components/SmartLink";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutGrid,
    List as ListIcon,
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash,
    BookOpen,
    Users,
    Clock,
    DollarSign,
    BarChart,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CourseLearnersDialog } from "../CourseLearnersDialog";
import { formatDistanceToNow } from "date-fns";
import { CourseThumbnail } from "@/components/ui/CourseThumbnail";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDeleteCourse } from "@/hooks/admin/useAdminCourses";
import { CommunityToggle } from "@/components/admin/CommunityToggle";
import { useCommunityModal } from "@/context/CommunityModalContext";

interface Course {
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string | null;
    level: string | null;
    is_published: boolean;
    thumbnail_url: string | null;
    created_at: string;
    creator_id: string;
    community_enabled: boolean;
    course_type: "course" | "test_series";
}

interface CoursesListProps {
    initialCourses: Course[];
}

export default function CoursesList({ initialCourses }: CoursesListProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState(initialCourses);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    const deleteCourse = useDeleteCourse();
    const isDeleting = deleteCourse.isPending;

    const handleDelete = async () => {
        if (!courseToDelete) return;

        try {
            await deleteCourse.mutateAsync(courseToDelete.id);
            setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));
            router.refresh();
        } catch (error) {
            // Error handling is done in the hook
            console.error(error);
        } finally {
            setDeleteDialogOpen(false);
            setCourseToDelete(null);
        }
    };

    const confirmDelete = (course: Course) => {
        setCourseToDelete(course);
        setDeleteDialogOpen(true);
    };

    const handleToggleCommunity = (courseId: string, enabled: boolean) => {
        setCourses(prev => prev.map(c =>
            c.id === courseId ? { ...c, community_enabled: enabled } : c
        ));
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search courses..."
                        className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-md transition-all ${viewMode === "grid"
                                ? "bg-white dark:bg-slate-700 shadow-sm text-green-600 dark:text-green-400"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md transition-all ${viewMode === "list"
                                ? "bg-white dark:bg-slate-700 shadow-sm text-green-600 dark:text-green-400"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                        >
                            <ListIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <SmartLink href="/admin/courses/create">
                        <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20">
                            <Plus className="mr-2 h-4 w-4" /> Create Course
                        </Button>
                    </SmartLink>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {filteredCourses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700"
                    >
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No courses found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search terms</p>
                    </motion.div>
                ) : viewMode === "grid" ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                    >
                        {filteredCourses.map((course, index) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                index={index}
                                onDelete={() => confirmDelete(course)}
                                onToggle={(enabled) => handleToggleCommunity(course.id, enabled)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                    >
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredCourses.map((course, index) => (
                                <CourseRow
                                    key={course.id}
                                    course={course}
                                    index={index}
                                    onDelete={() => confirmDelete(course)}
                                    onToggle={(enabled) => handleToggleCommunity(course.id, enabled)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the course
                            <span className="font-bold text-slate-900 dark:text-white"> "{courseToDelete?.title}" </span>
                            and remove all associated data including lessons and enrollments.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                        >
                            {isDeleting ? "Deleting..." : "Delete Course"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function CourseCard({ course, index, onDelete, onToggle }: { course: Course; index: number; onDelete: () => void; onToggle: (enabled: boolean) => void }) {
    const { openCommunity } = useCommunityModal();
    const isNew = new Date(course.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="h-full"
        >
            <Card className="group h-full flex flex-col border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden relative">
                <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <CourseThumbnail
                        src={course.thumbnail_url}
                        title={course.title}
                        category={course.category || "Course"}
                        className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                        variant="card"
                    />

                    {/* Top Left Badges */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                        {isNew && (
                            <Badge className="bg-green-500 text-white border-0 shadow-sm text-[10px] px-1.5 h-5">
                                New
                            </Badge>
                        )}
                        <Badge
                            variant="secondary"
                            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 border-0 shadow-sm font-medium text-[10px] px-1.5 h-5"
                        >
                            {course.level || "General"}
                        </Badge>
                    </div>

                    {/* Top Right Status */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
                        <Badge
                            className={`border-0 shadow-sm backdrop-blur-md text-[10px] px-1.5 h-5 ${course.is_published
                                ? "bg-emerald-500/90 hover:bg-emerald-600 text-white"
                                : "bg-slate-500/90 hover:bg-slate-600 text-white"}`}
                        >
                            {course.is_published ? "Published" : "Draft"}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-3 flex-grow flex flex-col gap-2">
                    {/* Header: Category & Price */}
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase truncate max-w-[60%]">
                            {course.category || "Uncategorized"}
                        </div>
                        <div className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                            {course.price > 0 ? `₹${course.price}` : "Free"}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base leading-snug text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-1">
                        {course.description || "No description provided."}
                    </p>

                    {/* Meta Row */}
                    <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            <span>{formatDistanceToNow(new Date(course.created_at), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {course.course_type === 'test_series' && (
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-purple-200 text-purple-600 bg-purple-50 dark:bg-purple-900/10 dark:text-purple-300 dark:border-purple-800">
                                    Test Series
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-3 pt-0 flex flex-col gap-2">
                    <div className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg p-1.5 border border-slate-100 dark:border-slate-800">
                        <CommunityToggle
                            courseId={course.id}
                            initialEnabled={course.community_enabled || false}
                            onToggle={onToggle}
                            showLabel={false}
                        />
                        <div className="flex items-center gap-0.5">
                            <div className="scale-90">
                                <CourseLearnersDialog courseId={course.id} courseTitle={course.title} />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                                        <MoreVertical className="h-3.5 w-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onDelete()} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                        <Trash className="mr-2 h-4 w-4" /> Delete Course
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full">
                        <SmartLink href={`/admin/courses/${course.id}/analytics`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full h-8 text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                                <BarChart className="mr-2 h-3.5 w-3.5" />
                                Analytics
                            </Button>
                        </SmartLink>
                        <SmartLink href={`/admin/courses/${course.id}`} className="w-full">
                            <Button size="sm" className="w-full h-8 text-xs bg-slate-900 hover:bg-emerald-600 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-500 shadow-sm hover:shadow-md transition-all">
                                <Edit className="mr-2 h-3.5 w-3.5" />
                                Manage
                            </Button>
                        </SmartLink>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

function CourseRow({ course, index, onDelete, onToggle }: { course: Course; index: number; onDelete: () => void; onToggle: (enabled: boolean) => void }) {
    const { openCommunity } = useCommunityModal();
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group flex items-center gap-4 p-4 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all border-b border-slate-100 dark:border-slate-800 last:border-0"
        >
            <div className="h-16 w-28 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 shadow-sm">
                <CourseThumbnail
                    src={course.thumbnail_url}
                    title={course.title}
                    category={course.category || "Course"}
                    className="w-full h-full"
                    variant="card"
                />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-slate-200 text-slate-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                        {course.category || "General"}
                    </Badge>
                    {course.is_published ? (
                        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Published
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                            Draft
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {course.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                        <BarChart className="h-3 w-3" />
                        {course.level || "All Levels"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(course.created_at), { addSuffix: true })}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end min-w-[80px]">
                    <div className="font-bold text-slate-900 dark:text-white">
                        {course.price > 0 ? `₹${course.price}` : "Free"}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <CommunityToggle
                        courseId={course.id}
                        initialEnabled={course.community_enabled || false}
                        onToggle={onToggle}
                        className="scale-90"
                    />
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

                    <CourseLearnersDialog courseId={course.id} courseTitle={course.title} />

                    <SmartLink href={`/admin/courses/${course.id}`}>
                        <Button size="sm" className="bg-slate-900 hover:bg-emerald-600 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-500 shadow-sm transition-all">
                            Manage
                        </Button>
                    </SmartLink>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <SmartLink href={`/admin/courses/${course.id}/analytics`}>
                                <DropdownMenuItem>
                                    <BarChart className="mr-2 h-4 w-4" /> Analytics
                                </DropdownMenuItem>
                            </SmartLink>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                onClick={onDelete}
                            >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </motion.div>
    );
}
