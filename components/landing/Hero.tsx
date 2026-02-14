"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Math4Code",
      subtitle: "Mathematics by Hiranmoy Mandal",
      description: "Data-driven learning for IIT-JAM, CSIR NET & GATE with expert teaching by Hiranmoy Mandal",
      cta: "Start Free Trial",
      package: "General Course",
      bgGradient: "from-green-50 via-white to-emerald-50",
      textColor: "text-slate-900",
      accentColor: "text-green-600",
      buttonBg: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      buttonOutline: "border-green-500 text-green-600 hover:bg-green-500 hover:text-white",
      image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "IIT-JAM 2026",
      subtitle: "Complete Preparation. Expert Guidance.",
      description: "Comprehensive course packages with full syllabus coverage",
      cta: "Explore Courses",
      package: "IIT-JAM Course",
      bgGradient: "from-green-50 via-white to-emerald-50",
      textColor: "text-slate-900",
      accentColor: "text-green-600",
      buttonBg: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      buttonOutline: "border-green-500 text-green-600 hover:bg-green-500 hover:text-white",
      badge: "1000+ Students",
      badgeBg: "from-green-500 to-emerald-600",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "CSIR NET & GATE",
      subtitle: "AIR-1 Level Test Series & Analytics",
      description: "Smart analytics and expert mentorship for competitive success",
      cta: "View Test Series",
      package: "Test Series Package",
      bgGradient: "from-emerald-50 via-white to-green-50",
      textColor: "text-slate-900",
      accentColor: "text-emerald-600",
      buttonBg: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700",
      buttonOutline: "border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800"
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-white pt-20 md:pt-24 pb-6 md:pb-8">
      <div className="max-w-container-hero mx-auto px-6 lg:px-8">
        {/* Banner-style Carousel Container */}
        <div className="relative h-[320px] sm:h-[300px] md:h-[280px] lg:h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgGradient} rounded-2xl shadow-lg overflow-hidden`}
            >
              <div className="h-full flex items-center relative">
                {/* Content Container */}
                <div className="w-full lg:w-[60%] px-6 md:px-8 lg:px-10 py-4 md:py-5 z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-3 md:space-y-4"
                  >
                    {/* Text Content */}
                    <div className="space-y-4 md:space-y-2 text-center lg:text-left">
                      <h1 className={`text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold ${slides[currentSlide].textColor} leading-tight`}>
                        {slides[currentSlide].title}
                      </h1>
                      <h2 className={`text-base sm:text-lg md:text-lg lg:text-xl font-semibold ${slides[currentSlide].accentColor}`}>
                        {slides[currentSlide].subtitle}
                      </h2>
                      <p className="text-slate-600 text-sm sm:text-base md:text-base max-w-xl mx-auto lg:mx-0">
                        {slides[currentSlide].description}
                      </p>
                    </div>

                    {/* Buttons and Badge */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start flex-wrap w-full mt-2">
                      {/* Badge if exists - Mobile Optimized */}
                      {slides[currentSlide].badge && (
                        <div className="bg-white p-1 rounded-full shadow-lg border border-white mb-2 sm:mb-0">
                          <div className={`bg-gradient-to-br ${slides[currentSlide].badgeBg || 'from-green-500 to-green-600'} text-white w-12 h-12 rounded-full flex flex-col items-center justify-center text-center font-bold leading-none shadow-md`}>
                            <span className="text-lg">1K+</span>
                            <span className="text-[8px] font-normal opacity-90">Students</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 w-full sm:w-auto justify-center">
                        <Link href="/auth/login" className="flex-1 sm:flex-initial">
                          <Button
                            className={`w-full ${slides[currentSlide].buttonBg} text-white font-semibold text-xs sm:text-sm md:text-base px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 border-0 truncate`}
                          >
                            {slides[currentSlide].cta}
                          </Button>
                        </Link>
                        <Link href="/courses" className="flex-1 sm:flex-initial">
                          <Button
                            variant="outline"
                            className={`w-full inline-flex bg-white border-2 ${slides[currentSlide].buttonOutline} font-semibold text-xs text-sm px-4 py-2 rounded-full transition-all hover:shadow-md truncate`}
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="hidden md:flex flex-wrap items-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Expert Faculty
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Smart Analytics
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Image - Desktop Only */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="hidden lg:block absolute right-8 xl:right-12 top-1/2 -translate-y-1/2 z-0"
                >
                  <div className="relative">
                    {/* Image Container */}
                    <div className="relative rounded-2xl overflow-hidden w-[240px] xl:w-[280px] h-[240px] xl:h-[280px] shadow-xl border-4 border-white/60">
                      <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Floating Trust Badge */}
                    <div className="absolute -right-2 top-1/4 bg-white px-2.5 py-2 rounded-lg shadow-lg border border-slate-100">
                      <div className="text-center">
                        <div className="text-lg xl:text-xl font-bold text-primary">4.9★</div>
                        <div className="text-[9px] xl:text-[10px] text-slate-500 font-medium">Rating</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white p-1.5 sm:p-2 rounded-full shadow-md transition-all hover:scale-110 border border-slate-200"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white p-1.5 sm:p-2 rounded-full shadow-md transition-all hover:scale-110 border border-slate-200"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 rounded-full shadow-md border border-slate-200">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all rounded-full ${index === currentSlide
                  ? "w-5 sm:w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
