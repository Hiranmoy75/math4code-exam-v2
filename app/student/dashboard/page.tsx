'use client'
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Star,
  PlayCircle,
  Loader2,
  GraduationCap,
  ShoppingCart,
  ArrowRight,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

import { useCurrentUser } from "@/hooks/student/useCurrentUser";
import { useStudentStats } from "@/hooks/student/useStudentStats";
import { useStudentTestSeries } from "@/hooks/student/useStudentTestSeries";
import { useLastAttempt } from "@/hooks/student/useLastAttempt";
import { useStudentCourses } from "@/hooks/student/useStudentCourses";
import { useAllCourses } from "@/hooks/student/useAllCourses";
import { usePrefetchCourse } from "@/hooks/usePrefetchCourse";
import { useEnrollmentsWithExpiry } from "@/hooks/useEnrollmentsWithExpiry";
import { useAllTestSeries } from "@/hooks/student/useAllTestSeries";
import { Button } from "@/components/ui/button";
import { CourseThumbnail } from "@/components/ui/CourseThumbnail";
import { useEnrollCourse } from "@/hooks";
import { DashboardExpiryBadge } from "@/components/student/ExpiryComponents";

export default function StudentDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"overview" | "my-courses" | "all-courses" | "test-series" | "all-test-series">("overview");

  // Set active tab from URL parameter
  useEffect(() => {
    if (tabParam === "my-courses" || tabParam === "all-courses" || tabParam === "test-series" || tabParam === "all-test-series") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Fetch data
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useStudentStats(user?.id);
  const { data: testSeries, isLoading: seriesLoading } = useStudentTestSeries(user?.id);
  const { data: lastAttempt } = useLastAttempt(user?.id);
  const { data: myCourses, isLoading: myCoursesLoading } = useStudentCourses(user?.id);
  const { data: allCourses, isLoading: allCoursesLoading } = useAllCourses(user?.id);
  const { data: allTestSeries, isLoading: allTestSeriesLoading } = useAllTestSeries();
  const { data: enrollmentsWithExpiry } = useEnrollmentsWithExpiry();

  // Create a map of course ID to expiry info for quick lookup
  const expiryMap = useMemo(() => {
    const map = new Map();
    enrollmentsWithExpiry?.forEach((enrollment: any) => {
      map.set(enrollment.course_id, {
        daysRemaining: enrollment.daysRemaining,
        isExpired: enrollment.isExpired,
        urgencyLevel: enrollment.urgencyLevel
      });
    });
    return map;
  }, [enrollmentsWithExpiry]);

  // ⚡ INSTANT NAVIGATION: Prefetch course data on hover
  const { prefetchCourse } = usePrefetchCourse();

  // Enrollment mutation
  const enrollMutation = useEnrollCourse();
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6 },
    }),
  };

  const handleContinueTest = () => {
    if (lastAttempt) {
      router.push(`/student/exam/${lastAttempt.examId}/attempt/${lastAttempt.attemptId}`);
    }
  };

  const handleContinueCourse = (courseId: string) => {
    router.push(`/learn/${courseId}`);
  };

  const handleEnrollCourse = (courseId: string, price: number) => {
    if (!user?.id) {
      toast.error("Please log in to enroll");
      router.push("/auth/login");
      return;
    }
    router.push(`/courses/${courseId}`);

  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const getSeriesIcon = (index: number) => {
    const icons = [
      <BookOpen key="book" className="w-5 h-5 text-indigo-500" />,
      <Calendar key="cal" className="w-5 h-5 text-green-500" />,
      <Star key="star" className="w-5 h-5 text-yellow-500" />,
    ];
    return icons[index % icons.length];
  };

  const statsData = [
    {
      title: "Total Exams Given",
      value: statsLoading ? "..." : stats?.totalExams.toString() || "0",
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      color: "from-green-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900",
    },
    {
      title: "Average Score",
      value: statsLoading ? "..." : `${stats?.averageScore || 0}%`,
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      color: "from-green-50 to-teal-100 dark:from-slate-800 dark:to-slate-900",
    },
    {
      title: "Courses Enrolled",
      value: myCoursesLoading ? "..." : myCourses?.length.toString() || "0",
      icon: <GraduationCap className="w-6 h-6 text-teal-500" />,
      color: "from-teal-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900",
    },
    {
      title: "Test Series Enrolled",
      value: seriesLoading ? "..." : testSeries?.length.toString() || "0",
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      color: "from-orange-50 to-amber-100 dark:from-slate-800 dark:to-slate-900",
    },
    // {
    //   title: "Rank",
    //   value: statsLoading ? "..." : `#${stats?.rank || 0}`,
    //   icon: <Award className="w-6 h-6 text-yellow-500" />,
    //   color: "from-yellow-50 to-amber-100 dark:from-slate-800 dark:to-slate-900",
    // },
  ];

  if (userLoading) {
    return (
      <div className="p-6 md:p-10 space-y-8 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 min-h-screen transition-colors duration-700">
        {/* Welcome Skeleton */}
        <div className="rounded-3xl p-6 md:p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg shadow-xl border border-slate-100 dark:border-slate-700 animate-pulse">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-600 rounded" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 shadow-lg border border-slate-100 dark:border-slate-700 animate-pulse">
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <div className="h-4 w-16 bg-slate-100 dark:bg-slate-600 rounded" />
              </div>
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-3 w-24 bg-slate-100 dark:bg-slate-600 rounded" />
            </div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          ))}
        </div>

        {/* Course Cards Skeleton */}
        <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg p-6 shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md animate-pulse">
                <div className="h-40 w-full bg-slate-200 dark:bg-slate-700 rounded-lg mb-3" />
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-600 rounded mb-1" />
                <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-600 rounded mb-3" />
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-600 rounded mb-3" />
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 min-h-screen transition-colors duration-700">
      {/* Welcome Section */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0}
        className="rounded-3xl p-6 md:p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
            Welcome back, <span className="text-green-600 dark:text-green-400">{user?.fullName || "Student"}!</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Keep up the great work! You're progressing steadily towards your goals.
          </p>
        </div>

        {lastAttempt && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleContinueTest}
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <PlayCircle className="w-5 h-5" />
            <span className="font-medium">Continue Last Test</span>
          </motion.button>
        )}
      </motion.div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsData.map((stat, i) => (
          <motion.div
            key={i}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={i + 1}
            whileHover={{ scale: 1.03 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between`}
          >
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
            </div>
            {stat.icon}
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: "overview", label: "Overview" },
          { id: "test-series", label: "Test Series" },
          { id: "all-test-series", label: "All Test Series" },
          { id: "my-courses", label: "My Courses" },
          { id: "all-courses", label: "All Courses" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
              ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Recent Courses & Test Series */}
          {((myCourses && myCourses.length > 0) || (testSeries && testSeries.length > 0)) ? (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={5}
              className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg p-6 shadow-xl border border-slate-100 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Continue Learning</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("my-courses")}
                  className="text-green-600 dark:text-green-400"
                >
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Courses */}
                {myCourses?.slice(0, 2).map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleContinueCourse(course.id)}
                    onMouseEnter={() => prefetchCourse(course.id, true)}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 dark:text-white flex-1">{course.title}</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        Course
                      </span>
                    </div>
                    {expiryMap.has(course.id) && (
                      <DashboardExpiryBadge
                        daysRemaining={expiryMap.get(course.id).daysRemaining}
                        isExpired={expiryMap.get(course.id).isExpired}
                        urgencyLevel={expiryMap.get(course.id).urgencyLevel}
                      />
                    )}
                    <div className="flex justify-between text-xs mb-2 text-slate-500 dark:text-slate-400 mt-2">
                      <span>Progress</span>
                      <span>{course.progress_percentage ? course.progress_percentage.toFixed(0) : (course.total_lessons > 0 ? (course.completed_lessons / course.total_lessons * 100).toFixed(0) : 0)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${course.progress_percentage ? course.progress_percentage : (course.total_lessons > 0 ? course.completed_lessons / course.total_lessons * 100 : 0)}%` }}
                      />
                    </div>
                  </motion.div>
                ))}

                {/* Test Series */}
                {testSeries?.slice(0, 1).map((test) => (
                  <motion.div
                    key={test.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleContinueCourse(test.id)}
                    onMouseEnter={() => prefetchCourse(test.id, true)}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 dark:text-white flex-1">{test.title}</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Test Series
                      </span>
                    </div>
                    {expiryMap.has(test.id) && (
                      <DashboardExpiryBadge
                        daysRemaining={expiryMap.get(test.id).daysRemaining}
                        isExpired={expiryMap.get(test.id).isExpired}
                        urgencyLevel={expiryMap.get(test.id).urgencyLevel}
                      />
                    )}
                    <div className="flex justify-between text-xs mb-2 text-slate-500 dark:text-slate-400 mt-2">
                      <span>Progress</span>
                      <span>{test.progress ? test.progress.toFixed(0) : (test.completedExams / test.totalExams * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${test.progress ? test.progress : test.completedExams / test.totalExams * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={5}
              className="rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 p-12 shadow-xl border border-green-100 dark:border-slate-700"
            >
              <div className="text-center max-w-2xl mx-auto space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                      <GraduationCap className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 text-yellow-900" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Start Your Learning Journey! 🚀
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    You haven't enrolled in any courses or test series yet.
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Explore our comprehensive courses and test series designed to help you ace IIT-JAM, CSIR NET & GATE exams.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button
                    onClick={() => setActiveTab("all-courses")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Browse Courses
                  </Button>
                  <Button
                    onClick={() => setActiveTab("all-test-series")}
                    variant="outline"
                    className="border-2 border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-slate-700 px-8 py-6 text-lg"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Browse Test Series
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expert Content</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Track Progress</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
                    <Award className="w-8 h-8 text-yellow-500" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Achieve Goals</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {activeTab === "my-courses" && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={5}
          className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg p-6 shadow-xl border border-slate-100 dark:border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">My Courses</h3>

          {myCoursesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : myCourses && myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleContinueCourse(course.id)}
                  onMouseEnter={() => prefetchCourse(course.id, true)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md cursor-pointer"
                >
                  <div className="h-40 w-full mb-3 rounded-lg overflow-hidden">
                    <CourseThumbnail
                      src={course.thumbnail_url}
                      title={course.title}
                      category="Enrolled"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-800 dark:text-white flex-1">{course.title}</h4>
                    {expiryMap.has(course.id) && (
                      <DashboardExpiryBadge
                        daysRemaining={expiryMap.get(course.id).daysRemaining}
                        isExpired={expiryMap.get(course.id).isExpired}
                        urgencyLevel={expiryMap.get(course.id).urgencyLevel}
                      />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between text-xs mb-2 text-slate-500 dark:text-slate-400">
                    <span>{course.completed_lessons}/{course.total_lessons} lessons</span>
                    <span>{course.progress_percentage ? course.progress_percentage.toFixed(0) : (course.total_lessons > 0 ? (course.completed_lessons / course.total_lessons * 100).toFixed(0) : 0)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-3">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${course.progress_percentage ? course.progress_percentage : (course.total_lessons > 0 ? course.completed_lessons / course.total_lessons * 100 : 0)}%` }}
                    />
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContinueCourse(course.id);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Continue Learning
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No courses enrolled yet</p>
              <p className="text-sm mt-1">Browse available courses to get started</p>
              <Button
                onClick={() => setActiveTab("all-courses")}
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Browse Courses
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "all-courses" && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={5}
          className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg p-6 shadow-xl border border-slate-100 dark:border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">All Courses</h3>

          {allCoursesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : allCourses && allCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => prefetchCourse(course.id, course.is_enrolled)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md"
                >
                  <div className="h-40 w-full mb-3 rounded-lg overflow-hidden">
                    <CourseThumbnail
                      src={course.thumbnail_url}
                      title={course.title}
                      category="Course"
                      className="w-full h-full"
                    />
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{course.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">By {course.instructor_name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400">All lessons</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                    </span>
                  </div>
                  {course.is_enrolled ? (
                    <Button
                      onClick={() => handleContinueCourse(course.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEnrollCourse(course.id, course.price)}
                      disabled={enrollingCourseId === course.id}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {enrollingCourseId === course.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          View Course
                        </>
                      )}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No courses available yet</p>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "test-series" && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={5}
          className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg p-6 shadow-xl border border-slate-100 dark:border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Your Test Series</h3>

          {seriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : testSeries && testSeries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testSeries.map((test) => (
                <motion.div
                  key={test.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleContinueCourse(test.id)}
                  onMouseEnter={() => prefetchCourse(test.id, true)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md cursor-pointer"
                >
                  <div className="h-40 w-full mb-3 rounded-lg overflow-hidden">
                    <CourseThumbnail
                      src={test.thumbnail_url}
                      title={test.title}
                      category="Test Series"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-800 dark:text-white flex-1">{test.title}</h4>
                    {expiryMap.has(test.id) && (
                      <DashboardExpiryBadge
                        daysRemaining={expiryMap.get(test.id).daysRemaining}
                        isExpired={expiryMap.get(test.id).isExpired}
                        urgencyLevel={expiryMap.get(test.id).urgencyLevel}
                      />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{test.description}</p>
                  <div className="flex justify-between text-xs mb-2 text-slate-500 dark:text-slate-400">
                    <span>{test.completedExams}/{test.totalExams} exams</span>
                    <span>{test.progress ? test.progress.toFixed(0) : (test.totalExams > 0 ? (test.completedExams / test.totalExams * 100).toFixed(0) : 0)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-3">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${test.progress ? test.progress : (test.totalExams > 0 ? test.completedExams / test.totalExams * 100 : 0)}%` }}
                    />
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContinueCourse(test.id);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Continue Learning
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No test series enrolled yet</p>
              <p className="text-sm mt-1">Browse available test series to get started</p>
              <Button
                onClick={() => setActiveTab("all-test-series")}
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Browse Test Series
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "all-test-series" && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={5}
          className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg p-6 shadow-xl border border-slate-100 dark:border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">All Test Series</h3>

          {allTestSeriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : allTestSeries && allTestSeries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTestSeries.map((series: any) => (
                <motion.div
                  key={series.id}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => prefetchCourse(series.id, series.is_enrolled)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md"
                >
                  <div className="h-40 w-full mb-3 rounded-lg overflow-hidden">
                    <CourseThumbnail
                      src={series.thumbnail_url}
                      title={series.title}
                      category="Test Series"
                      className="w-full h-full"
                    />
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{series.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{series.description}</p>
                  <div className="flex justify-between text-xs mb-3 text-slate-500 dark:text-slate-400">
                    <span>All exams</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {series.price === 0 ? "Free" : `₹${series.price}`}
                    </span>
                  </div>
                  {series.is_enrolled ? (
                    <Button
                      onClick={() => handleContinueCourse(series.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEnrollCourse(series.id, series.price)}
                      disabled={enrollingCourseId === series.id}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {enrollingCourseId === series.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          View Details
                        </>
                      )}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No test series available yet</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Achievements Section */}
      {stats && stats.averageScore >= 75 && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={6}
          className="rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-semibold">Congratulations! 🎉</h3>
              <p className="text-sm opacity-90">
                You're performing excellently with {stats.averageScore}% average score!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/student/achievements")}
              className="px-4 py-2 rounded-lg bg-white text-green-600 font-semibold shadow-md"
            >
              View Achievements
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
