"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Star, ChevronRight } from "lucide-react";
import { CourseThumbnail } from "@/components/ui/CourseThumbnail";

export interface PublicTestSeries {
    id: string;
    title: string;
    description: string | null;
    price: number;
    thumbnail_url: string | null;
    created_at: string;
    creator_id: string;
    exam_type?: string;
    question_count?: number;
    category?: string;
}

export const ExamCard: React.FC<{ test: PublicTestSeries; index?: number }> = ({ test, index = 0 }) => {
    return (
        <Link href={`/courses/${test.id}`} className="h-full block">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:border-green-100 transition-all duration-300 h-full flex flex-col overflow-hidden transform hover:-translate-y-1 group">
                {/* Thumbnail */}
                <div className="relative h-44 bg-slate-50 overflow-hidden">
                    <CourseThumbnail
                        src={test.thumbnail_url}
                        title={test.title}
                        category={test.category || "Test Series"}
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
                            {test.category || "Exam"}
                        </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors">
                        {test.title}
                    </h3>

                    <p className="text-slate-500 text-xs line-clamp-2 mb-3 flex-grow leading-relaxed">
                        {test.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[100px] font-medium">Expert Faculty</span>
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
                                    {test.price > 0 ? `₹${test.price}` : "Free"}
                                </span>
                                {test.price > 0 && (
                                    <span className="text-xs text-slate-400 line-through">₹{Math.round(test.price * 1.5)}</span>
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
    );
};
