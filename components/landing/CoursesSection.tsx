"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { CourseCard } from "./CourseCard";

export const CoursesSection: React.FC = () => {
    const { data: courses, isLoading } = usePublicCourses();

    return (
        <section id="courses" className="py-16 bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-100/30 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-container mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            <span className="w-2 h-2 rounded-full bg-green-600"></span> Popular
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Popular Curriculum</h2>
                        <p className="text-gray-500 text-lg">Comprehensive courses for IIT-JAM, CSIR NET & GATE Mathematics.</p>
                    </div>
                </div>

                {/* Courses Horizontal Scroller */}
                <div className="relative">
                    {isLoading ? (
                        <div className="flex overflow-x-auto pb-8 pt-2 gap-5 md:gap-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="min-w-[260px] md:min-w-[280px] max-w-[260px] md:max-w-[280px] h-80 bg-gray-100 rounded-2xl animate-pulse flex-shrink-0" />
                            ))}
                        </div>
                    ) : courses && courses.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex overflow-x-auto pb-8 pt-2 gap-5 md:gap-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory"
                        >
                            {courses.map((course, index) => (
                                <div key={course.id} className="min-w-[260px] md:min-w-[280px] max-w-[260px] md:max-w-[280px] snap-start flex-shrink-0">
                                    <CourseCard course={course} index={index} />
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-16">
                            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">No courses available</p>
                        </div>
                    )}
                </div>

                {/* View All Button */}
                {!isLoading && courses && courses.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <Link href="/courses">
                            <button className="inline-flex items-center gap-2 px-8 py-3 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-full group transition-all">
                                <span>View All Courses</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};
