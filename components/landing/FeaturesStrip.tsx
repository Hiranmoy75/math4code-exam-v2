"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    FeatureIconStructuredLearning,
    FeatureIconSmartAnalytics,
    FeatureIconMockTests,
    FeatureIconAIMentor
} from "./Illustrations";

export const FeaturesStrip: React.FC = () => {
    const features = [
        {
            icon: <FeatureIconStructuredLearning className="w-full h-full" />,
            title: "Structured Learning",
            desc: "Comprehensive curriculum covering all topics for IIT-JAM, CSIR NET & GATE Mathematics."
        },
        {
            icon: <FeatureIconSmartAnalytics className="w-full h-full" />,
            title: "Smart Analytics",
            desc: "Track your progress with detailed performance insights and topic-wise analysis."
        },
        {
            icon: <FeatureIconMockTests className="w-full h-full" />,
            title: "Mock Tests",
            desc: "Practice with exam-style tests and compete on leaderboards."
        },
        {
            icon: <FeatureIconAIMentor className="w-full h-full" />,
            title: "AI Math Mentor",
            desc: "Get instant help with step-by-step solutions to complex mathematical problems."
        },
    ];

    return (
        <section className="relative py-20 lg:py-24 bg-white border-y border-slate-100 pt-20">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-50/20 via-white to-emerald-50/20 pointer-events-none" />

            <div className="relative max-w-container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative h-full bg-gradient-to-br from-white via-green-50/10 to-emerald-50/20 rounded-2xl p-6 lg:p-8 border border-green-100 shadow-md hover:shadow-2xl hover:border-green-300 transition-all duration-300">
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 to-emerald-50/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="relative z-10 space-y-4">
                                    {/* Icon */}
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-xl border border-green-200/50">
                                        {feature.icon}
                                    </div>

                                    {/* Text */}
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-slate-900 text-lg lg:text-xl group-hover:text-green-600 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative corner element */}
                                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
