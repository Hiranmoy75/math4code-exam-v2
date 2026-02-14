"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Aarav P.',
        role: 'IIT-JAM Aspirant',
        text: "The adaptive practice problems changed the game for me. I finally understood where my logic was breaking down.",
        score: 'AIR 89',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'
    },
    {
        id: 2,
        name: 'Sarah L.',
        role: 'IIT-JAM Student',
        text: "Math4Code bridges the gap between theory and practice. The analytics-driven insights helped me identify my weak areas instantly.",
        score: 'AIR 127',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
        id: 3,
        name: 'Rahul K.',
        role: 'GATE Mathematics Aspirant',
        text: "The mock exams are actually harder than the real thing, which made the actual exam feel like a breeze. Best investment I made!",
        score: '99.8 Percentile',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'
    },
];

export const Testimonials: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 left-0 w-72 h-72 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-20 right-0 w-72 h-72 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full blur-3xl opacity-20" />

            <div className="relative max-w-container-narrow mx-auto px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
                        Success Stories
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        See how students are achieving their dreams with Math4Code
                    </p>
                </motion.div>

                {/* Testimonial Carousel */}
                <div className="relative min-h-[400px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 100, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -100, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="absolute w-full"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 lg:p-12 max-w-3xl mx-auto relative">
                                {/* Quote icon */}
                                <div className="absolute -top-6 left-8 bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                                    <Quote className="w-6 h-6 text-white" />
                                </div>

                                {/* Stars */}
                                <div className="flex justify-center mb-6 mt-4">
                                    <div className="flex gap-1 text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <Star fill="currentColor" className="w-6 h-6" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Testimonial Text */}
                                <blockquote className="text-xl lg:text-2xl font-medium text-slate-700 italic mb-8 leading-relaxed text-center">
                                    "{TESTIMONIALS[index].text}"
                                </blockquote>

                                {/* Author Info */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-white shadow-lg overflow-hidden">
                                        <img
                                            src={TESTIMONIALS[index].avatar}
                                            alt={TESTIMONIALS[index].name}
                                            className="w-full h-full"
                                        />
                                    </div>

                                    <div className="text-center">
                                        <div className="font-bold text-slate-900 text-lg mb-1">
                                            {TESTIMONIALS[index].name}
                                        </div>
                                        <div className="text-slate-600 text-sm mb-3">
                                            {TESTIMONIALS[index].role}
                                        </div>
                                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
                                            {TESTIMONIALS[index].score}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-3 mt-12">
                    {TESTIMONIALS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`transition-all duration-300 rounded-full ${i === index
                                ? 'w-12 h-3 bg-gradient-to-r from-green-600 to-emerald-600'
                                : 'w-3 h-3 bg-slate-300 hover:bg-slate-400'
                                }`}
                            aria-label={`Go to testimonial ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
