"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export const Footer: React.FC = () => (
    <footer className="bg-white text-slate-900 py-12 border-t border-slate-200">
        <div className="max-w-container mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 font-bold text-2xl text-slate-900 mb-4">
                    <span className="text-emerald-600">Math4Code</span>
                </div>
                <p className="max-w-xs text-sm text-slate-600 mb-6">
                    Master IIT-JAM, CSIR NET & GATE Mathematics with expert-led courses, intelligent mock tests, and AI-powered learning.
                </p>
                <div className="flex gap-4">
                    <Link href="https://www.youtube.com/@MathForCode" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                        <Youtube className="w-5 h-5" />
                    </Link>
                    <Link href="https://www.linkedin.com/in/hiranmoy-mandal-574031235" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </Link>
                    <Link href="https://www.facebook.com/hiranmoy.mandal.3781/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-700 transition-colors">
                        <Facebook className="w-5 h-5" />
                    </Link>
                    <Link href="https://www.instagram.com/Hiranmoy804/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
                        <Instagram className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/courses" className="hover:text-[#14B8A6] text-slate-600">Courses</Link></li>
                    <li><Link href="/contact" className="hover:text-[#14B8A6] text-slate-600">Contact Us</Link></li>
                    <li><Link href="/about" className="hover:text-[#14B8A6] text-slate-600">About Us</Link></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/privacy-policy" className="hover:text-[#14B8A6] text-slate-600">Privacy Policy</Link></li>
                    <li><Link href="/terms-of-use" className="hover:text-[#14B8A6] text-slate-600">Terms of Use</Link></li>
                    <li><Link href="/refund-policy" className="hover:text-[#14B8A6] text-slate-600">Refund Policy</Link></li>
                </ul>
            </div>
        </div>
        <div className="max-w-container mx-auto px-6 mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
            © 2025 Hiranmoy Mandal. All rights reserved. | Mathematics by Hiranmoy Mandal
        </div>
    </footer>
);
