"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, MessageCircle, Brain } from "lucide-react";

export const AIMentorSection: React.FC = () => {
    return (
        <section className="py-20 lg:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl -z-10" />

            <div className="max-w-container mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Heading */}
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3">
                                Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">AI Mentor</span>
                            </h2>
                            <p className="text-lg text-slate-600">
                                First human-quality AI math tutor designed to help you master mathematics.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-slate-700 leading-relaxed">
                                    <span className="font-semibold">Solve-AI</span> that interacts with students, answers questions, and drives learning.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-slate-700 leading-relaxed">
                                    <span className="font-semibold">Support-AI</span> that delivers instant help, answers queries, and provides insights.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-slate-700 leading-relaxed">
                                    <span className="font-semibold">Engage-AI</span> that provides mentorship & tailored guidance to personalize experiences.
                                </p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/auth/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>Try AI Mentor Now</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            <Link href="/about">
                                <button className="text-slate-700 hover:text-green-600 font-semibold flex items-center gap-2 transition-colors">
                                    Learn more
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right - Chat Interface Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Chat Card */}
                        <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-w-md mx-auto">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">AI Math Mentor</div>
                                    <div className="text-xs text-slate-500">Always ready to help</div>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                            </div>

                            {/* Sample Message */}
                            <div className="space-y-4 mb-6">
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
                                    <p className="text-sm text-slate-700 mb-2">
                                        I want to learn calculus and build strong foundations for IIT-JAM.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                                    <div className="flex items-start gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-green-900 mb-1">AI Mentor</p>
                                            <p className="text-sm text-slate-700">
                                                Great! Let's start with <span className="font-semibold text-green-600">Limits & Continuity</span>. I'll create a personalized learning path for you.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-green-200">
                                        <div className="text-xs font-semibold text-green-700 mb-2">Recommended:</div>
                                        <div className="bg-white rounded-lg p-2 border border-green-200">
                                            <div className="text-xs font-bold text-slate-900">Calculus Fundamentals</div>
                                            <div className="text-[10px] text-slate-500">24 lessons • 12 hours</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Input */}
                            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
                                <MessageCircle className="w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none"
                                    disabled
                                />
                                <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-10"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">24/7 Available</div>
                                    <div className="text-[10px] text-slate-500">Instant Responses</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
