"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    X,
    ChevronDown,
    User,
    LogOut,
    LayoutDashboard,
    ChevronRight,
    BookOpen,
    FileText,
    GraduationCap,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/student/useCurrentUser";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// --- Configuration ---

const EXAMS = [
    {
        title: "CSIR NET",
        href: "/csir-net",
        items: [
            { title: "Overview", href: "/csir-net/overview", icon: BookOpen },
            { title: "Syllabus", href: "/csir-net/syllabus", icon: FileText },
            { title: "Test Series", href: "/csir-net/test-series", icon: GraduationCap },
            { title: "Online Course", href: "/csir-net/course", icon: LayoutDashboard },
            { title: "Previous Year Questions", href: "/csir-net/pyq", icon: History },
        ],
        cta: "🔥 Join 2026 Batch",
        ctaHref: "/csir-net/join"
    },
    {
        title: "GATE",
        href: "/gate",
        items: [
            { title: "Overview", href: "/gate/overview", icon: BookOpen },
            { title: "Syllabus", href: "/gate/syllabus", icon: FileText },
            { title: "Test Series", href: "/gate/test-series", icon: GraduationCap },
            { title: "Online Course", href: "/gate/course", icon: LayoutDashboard },
            { title: "Previous Year Questions", href: "/gate/pyq", icon: History },
        ],
        cta: "🔥 Join 2026 Batch",
        ctaHref: "/gate/join"
    },
    {
        title: "IIT JAM",
        href: "/iit-jam",
        items: [
            { title: "Overview", href: "/iit-jam/overview", icon: BookOpen },
            { title: "Syllabus", href: "/iit-jam/syllabus", icon: FileText },
            { title: "Test Series", href: "/iit-jam/test-series", icon: GraduationCap },
            { title: "Online Course", href: "/iit-jam/course", icon: LayoutDashboard },
            { title: "Previous Year Questions", href: "/iit-jam/pyq", icon: History },
        ],
        cta: "🔥 Join 2026 Batch",
        ctaHref: "/iit-jam/join"
    }
];

const NAV_LINKS = [
    { title: "Courses", href: "/courses" },
    { title: "Test Series", href: "/test-series" },
    { title: "Blogs", href: "/blog" },
    { title: "Free Resources", href: "/free-resources" }
];

// Extracted Component to handle hover state properly
const ExamDropdown = ({ exam, isActive }: { exam: typeof EXAMS[0], isActive: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="relative h-full flex items-center"
        >
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors outline-none cursor-pointer py-4 px-1",
                    isActive || isOpen ? "text-green-600 font-semibold" : "text-slate-600 hover:text-green-600"
                )}>
                    {exam.title}
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-64 p-2 bg-white border-gray-100 text-slate-900 mt-2 z-[101]"
                    sideOffset={5}
                    align="start"
                >
                    <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {exam.title} Preparation
                    </div>
                    {exam.items.map((item) => (
                        <DropdownMenuItem key={item.title} asChild className="focus:bg-green-50 focus:text-green-700">
                            <Link href={item.href} className="flex items-center gap-3 cursor-pointer py-2.5">
                                <item.icon className="w-4 h-4 text-green-600/70" />
                                <span>{item.title}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="my-2 bg-gray-100" />
                    <Link href={exam.ctaHref} className="w-full">
                        <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md shadow-green-500/20">
                            {exam.cta}
                        </Button>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const queryClient = useQueryClient();
    const { data: userProfile } = useCurrentUser();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        queryClient.clear();
        if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', '/');
        }
        router.replace("/");
    };

    const getDashboardLink = () => {
        if (userProfile?.role === "admin" || userProfile?.role === "creator") return "/admin/dashboard";
        return "/student/dashboard";
    };

    // Helper for active state of dropdown parents
    const isExamActive = (items: typeof EXAMS[0]["items"]) => {
        return items.some(item => pathname === item.href);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b",
                isScrolled
                    ? "bg-white/95 backdrop-blur-lg border-gray-100 shadow-sm py-2"
                    : "bg-white border-transparent py-3"
            )}
        >
            <div className="max-w-container-hero mx-auto px-4 md:px-6 flex items-center justify-between">

                {/* --- Left Section: Logo --- */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-bold text-xl md:text-2xl font-mono">M</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                            Math<span className="text-green-600">4</span>Code
                        </span>
                        <span className="text-[0.65rem] md:text-xs font-medium text-slate-500 tracking-wide uppercase mt-0.5">
                            IIT-Level Mathematics Coaching
                        </span>
                    </div>
                </Link>

                {/* --- Center Navigation (Desktop) --- */}
                <nav className="hidden lg:flex items-center gap-6">
                    {/* Exam Dropdowns */}
                    {EXAMS.map((exam) => (
                        <ExamDropdown
                            key={exam.title}
                            exam={exam}
                            isActive={isExamActive(exam.items)}
                        />
                    ))}

                    {/* Direct Links */}
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-green-600 relative group py-4",
                                pathname === link.href ? "text-green-600 font-semibold" : "text-slate-600"
                            )}
                        >
                            {link.title}
                            <span className={cn(
                                "absolute bottom-1 left-0 h-0.5 bg-green-600 transition-all duration-300",
                                pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                            )} />
                        </Link>
                    ))}
                </nav>

                {/* --- Right Section: Actions --- */}
                <div className="flex items-center gap-3 md:gap-4">

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {userProfile ? (
                            <>
                                <Link href={getDashboardLink()}>
                                    <Button variant="ghost" className="text-slate-600 hover:text-green-600 hover:bg-green-50">
                                        Dashboard
                                    </Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="p-0 w-10 h-10 rounded-full hover:ring-2 hover:ring-green-200 transition-all">
                                            {userProfile?.avatarUrl ? (
                                                <Image
                                                    src={userProfile.avatarUrl}
                                                    alt="Profile"
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
                                                    {userProfile?.email?.[0].toUpperCase()}
                                                </div>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-white border-gray-100 text-slate-900">
                                        <div className="px-2 py-1.5 text-sm font-medium text-slate-900 border-b border-gray-100 mb-1">
                                            {userProfile.email}
                                        </div>
                                        <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-700">
                                            <Link href="/student/settings" className="cursor-pointer">
                                                <User className="w-4 h-4 mr-2" /> Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleSignOut} className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer">
                                            <LogOut className="w-4 h-4 mr-2" /> Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-green-600 transition-colors">
                                    Log in
                                </Link>
                                <Link href="/auth/sign-up">
                                    <Button className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 px-6 animate-pulse-slow">
                                        Join Now
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Trigger & Join Button (Mobile) */}
                    <div className="flex md:hidden items-center gap-3">
                        {!userProfile && (
                            <Link href="/auth/sign-up">
                                <Button size="sm" className="rounded-full bg-green-600 hover:bg-green-700 text-white text-xs px-4">
                                    Join Now
                                </Button>
                            </Link>
                        )}

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0 overflow-y-auto bg-white border-l-gray-100 text-slate-900">
                                <div className="flex flex-col h-full">
                                    <div className="p-5 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">M</div>
                                            <span className="font-bold text-lg text-slate-900">Math4Code</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto py-4">
                                        <Accordion type="single" collapsible className="w-full px-4">
                                            {EXAMS.map((exam) => (
                                                <AccordionItem key={exam.title} value={exam.title} className="border-b-gray-100">
                                                    <AccordionTrigger className="text-base font-semibold text-slate-800 hover:text-green-600 hover:no-underline py-4">
                                                        {exam.title}
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="flex flex-col gap-1 pb-2 pl-2">
                                                            {exam.items.map((item) => (
                                                                <SheetClose key={item.title} asChild>
                                                                    <Link
                                                                        href={item.href}
                                                                        className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-slate-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                                                                    >
                                                                        <item.icon className="w-4 h-4" />
                                                                        {item.title}
                                                                    </Link>
                                                                </SheetClose>
                                                            ))}
                                                            <div className="pt-2 mt-2 border-t border-dashed border-gray-100">
                                                                <SheetClose asChild>
                                                                    <Link href={exam.ctaHref}>
                                                                        <Button size="sm" className="w-full bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-sm">
                                                                            {exam.cta}
                                                                        </Button>
                                                                    </Link>
                                                                </SheetClose>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>

                                        <div className="flex flex-col gap-1 px-4 mt-2">
                                            {NAV_LINKS.map((link) => (
                                                <SheetClose key={link.title} asChild>
                                                    <Link
                                                        href={link.href}
                                                        className="py-4 text-base font-semibold text-slate-800 border-b border-gray-100 block hover:text-green-600 transition-colors"
                                                    >
                                                        {link.title}
                                                    </Link>
                                                </SheetClose>
                                            ))}

                                            <SheetClose asChild>
                                                <Link href="/about" className="py-4 text-base font-semibold text-slate-800 border-b border-gray-100 block hover:text-green-600 transition-colors">
                                                    About Us
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link href="/contact" className="py-4 text-base font-semibold text-slate-800 border-b border-gray-100 block hover:text-green-600 transition-colors">
                                                    Contact
                                                </Link>
                                            </SheetClose>
                                        </div>

                                        {userProfile && (
                                            <div className="px-4 mt-6">
                                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        {userProfile.avatarUrl ? (
                                                            <Image src={userProfile.avatarUrl} alt="Profile" width={32} height={32} className="rounded-full" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                                                                {userProfile.email?.[0].toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-semibold truncate text-slate-900">{userProfile.fullName || "Student"}</p>
                                                            <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <SheetClose asChild>
                                                            <Link href={getDashboardLink()}>
                                                                <Button variant="outline" size="sm" className="w-full justify-start text-slate-700 bg-white shadow-sm">
                                                                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                                                </Button>
                                                            </Link>
                                                        </SheetClose>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleSignOut}
                                                            className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 bg-white"
                                                        >
                                                            <LogOut className="w-4 h-4 mr-2" /> Sign out
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!userProfile && (
                                            <div className="px-4 mt-4 space-y-3">
                                                <SheetClose asChild>
                                                    <Link href="/auth/login">
                                                        <Button variant="outline" className="w-full border-slate-200 text-slate-700">
                                                            Log In
                                                        </Button>
                                                    </Link>
                                                </SheetClose>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Bottom Sticky CTA */}
                                    <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm sticky bottom-0 z-10 safe-area-bottom">
                                        <SheetClose asChild>
                                            <Link href="/auth/sign-up">
                                                <Button className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 py-6 text-lg font-bold animate-pulse-slow">
                                                    🔥 Join 2026 Batch
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};
