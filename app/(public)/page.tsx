"use client"
// export const runtime = 'edge';
import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { FeaturesStrip } from '@/components/landing/FeaturesStrip';
import { CoursesSection } from '@/components/landing/CoursesSection';
import { ExamSeriesSection } from '@/components/landing/ExamSeriesSection';
import { AIMentorSection } from '@/components/landing/AIMentorSection';
import { DemoSection } from '@/components/landing/DemoSection';
import { Testimonials } from '@/components/landing/Testimonials';
import { CTA } from '@/components/landing/CTA';
import { TrustSection } from '@/components/landing/TrustSection';
import { OrganizationSchema, PersonSchema } from '@/components/seo/StructuredData';
import { AppDownloadSection } from '@/components/AppDownloadSection';

export default function App() {
  return (
    <div className="font-sans antialiased text-slate-900 bg-[#FBFBFD]">
      <OrganizationSchema />
      <PersonSchema />
      <Hero />
      <TrustSection />
      <FeaturesStrip />
      <ExamSeriesSection />
      <CoursesSection />
      <AIMentorSection />
      <DemoSection />
      <Testimonials />
      <AppDownloadSection />
      <CTA />
    </div>
  );
}
