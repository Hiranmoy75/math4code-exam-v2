"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SuccessIllustration } from "./Illustrations";

export const CTA: React.FC = () => {
    return (
        <section className="relative py-20 lg:py-24 px-6 lg:px-8 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white -z-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-3xl opacity-20 -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-100 to-emerald-100 rounded-full blur-3xl opacity-20 -z-10" />

            <div className="max-w-container-narrow mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-3xl lg:rounded-[2rem] p-10 lg:p-16 overflow-hidden shadow-2xl"
                >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Floating sparkles */}
                    <motion.div
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute top-8 right-8 text-yellow-300"
                    >
                        <Sparkles className="w-8 h-8" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-8 left-8 text-emerald-300"
                    >
                        <Sparkles className="w-6 h-6" />
                    </motion.div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <div className="text-center lg:text-left space-y-6">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl lg:text-5xl font-extrabold text-white leading-tight"
                            >
                                Ready to Master Mathematics?
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="text-lg lg:text-xl text-green-50 leading-relaxed max-w-xl"
                            >
                                Join thousands of students using <span className="font-bold text-white">Math4Code</span> for authentic learning and data-driven progress. No credit card required for the trial.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link href="/auth/sign-up">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group bg-white text-green-700 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-3 mx-auto lg:mx-0"
                                    >
                                        Start Learning Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4"
                            >
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-white mb-1">1000+</div>
                                    <div className="text-sm text-green-100">Active Students</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-white mb-1">50K+</div>
                                    <div className="text-sm text-green-100">Questions Solved</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-white mb-1">4.9★</div>
                                    <div className="text-sm text-green-100">Average Rating</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="hidden lg:block"
                        >
                            <SuccessIllustration className="w-full h-auto drop-shadow-2xl" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
