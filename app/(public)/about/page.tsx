"use client";

import React from "react";
import { Header } from "@/components/landing/Header";
import { CheckCircle2, Users, Trophy, Target } from "lucide-react";
import { PersonSchema } from "@/components/seo/StructuredData";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900">


            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                        Empowering the Next Generation of Developers
                    </h1>
                    <p className="text-xl text-slate-600">
                        Math4Code is a premium learning platform designed to help students master mathematics and coding concepts through interactive exams and comprehensive courses.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            We believe that quality education should be accessible, engaging, and effective. Our mission is to bridge the gap between theoretical knowledge and practical application by providing a platform where students can test their skills, track their progress, and achieve their academic goals.
                        </p>
                        <div className="space-y-4">
                            {[
                                "Comprehensive Exam Preparation",
                                "Expert-Led Courses",
                                "Real-time Performance Analytics",
                                "Community of Learners"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-green-50 p-6 rounded-2xl text-center">
                            <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-slate-900">1k+</div>
                            <div className="text-sm text-slate-600">Students</div>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-2xl text-center">
                            <Trophy className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-slate-900">50+</div>
                            <div className="text-sm text-slate-600">Exams</div>
                        </div>
                        <div className="bg-teal-50 p-6 rounded-2xl text-center col-span-2">
                            <Target className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-slate-900">95%</div>
                            <div className="text-sm text-slate-600">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Founder Section */}
            <div className="py-20 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8 text-slate-900">Meet the Founder</h2>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-105 transition-transform">
                            HM
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">Hiranmoy Mandal</h3>
                        <p className="text-green-600 font-medium mb-6">Mathematics Educator & Founder of Math4Code</p>
                        <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto italic">
                            &quot;Mathematics is not just about solving equations, but about understanding the logical structure of the universe.&quot;
                        </p>
                        <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mt-4">
                            With years of experience in coaching students for competitive exams like IIT-JAM, CSIR NET, and GATE, Hiranmoy Mandal founded Math4Code to make high-quality mathematics education accessible to everyone. His unique teaching methodology simplifies complex concepts, helping thousands of students achieve their dreams.
                        </p>
                    </div>
                </div>
            </div>

            <PersonSchema />
        </main>
    );
}
