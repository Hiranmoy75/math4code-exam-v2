"use client";

import React from "react";
import { Header } from "@/components/landing/Header";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900">


            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                            Get in Touch with Hiranmoy Mandal
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Email</p>
                                            <p className="text-slate-600">math4codes@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Phone</p>
                                            <p className="text-slate-600">6297534924</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Office</p>
                                            <p className="text-slate-600">Math4Code, Kolkata, West Bengal, 700049, India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">First Name</label>
                                        <Input placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Last Name</label>
                                        <Input placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email</label>
                                    <Input type="email" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Message</label>
                                    <Textarea placeholder="How can we help you?" className="min-h-[150px]" />
                                </div>
                                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500">
                                    Send Message <Send className="w-4 h-4 ml-2" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
