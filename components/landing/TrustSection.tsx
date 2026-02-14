"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Award, BookOpen, TrendingUp, CheckCircle2, Star } from "lucide-react";

const stats = [
    {
        icon: Users,
        value: "10,000+",
        label: "Active Students",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: Award,
        value: "95%",
        label: "Success Rate",
        color: "from-emerald-600 to-teal-600"
    },
    {
        icon: BookOpen,
        value: "500+",
        label: "Video Lectures",
        color: "from-teal-500 to-cyan-600"
    },
    {
        icon: TrendingUp,
        value: "AIR 1-100",
        label: "Top Rankers",
        color: "from-green-600 to-emerald-700"
    }
];

const features = [
    "Expert Faculty from IITs & NITs",
    "Live Doubt Solving Sessions",
    "Personalized Study Plans",
    "24/7 Learning Support"
];

export const TrustSection: React.FC = () => {
    return (
        <section className="relative py-12 md:py-16 bg-white overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-100/50 to-slate-50/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-50/50 to-slate-100/50 rounded-full blur-3xl -z-10" />

            <div className="max-w-container mx-auto px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-gradient-to-br from-white to-green-50/30 rounded-xl p-5 hover:shadow-lg transition-all duration-300 border border-green-100/50 hover:border-green-200"
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm`}>
                                    <stat.icon className="w-6 h-6 text-white" strokeWidth={2} />
                                </div>

                                {/* Value */}
                                <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                                    {stat.value}
                                </div>

                                {/* Label */}
                                <div className="text-xs md:text-sm text-slate-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Features Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-slate-200"
                >
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Left: Title & Rating */}
                        <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-5 h-5 fill-green-500 text-green-500" />
                                    ))}
                                </div>
                                <span className="text-slate-700 text-sm font-semibold">4.9/5 Rating</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                                Why Students Choose Math4Code
                            </h3>
                            <p className="text-slate-600 text-sm md:text-base">
                                Join thousands of successful students achieving their dreams
                            </p>
                        </div>

                        {/* Right: Feature List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 border-2 border-green-200 hover:border-green-400 transition-colors shadow-sm"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span className="text-slate-700 text-sm font-medium">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
