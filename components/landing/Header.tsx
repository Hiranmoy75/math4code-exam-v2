"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, User, LogOut, LayoutDashboard } from "lucide-react";
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
import { RewardDisplay } from "@/components/RewardDisplay";

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const queryClient = useQueryClient();

    // Use the same hook as everywhere else for consistency
    const { data: userProfile, isLoading: isUserLoading } = useCurrentUser();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();

        // CRITICAL: Clear ALL cache to prevent data leaks between users
        queryClient.clear();

        // Replace history to prevent back button issues
        if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', '/');
        }
        router.replace("/");
    };

    const getDashboardLink = () => {
        if (userProfile?.role === "admin" || userProfile?.role === "creator") return "/admin/dashboard";
        return "/student/dashboard";
    };

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;

            // Lock scroll
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Get the scroll position before unlocking
            const scrollY = document.body.style.top;

            // Unlock scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';

            // Restore scroll position
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // Cleanup on unmount - ALWAYS unlock scroll
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isMobileMenuOpen]);

    // Force close menu on route change to prevent stuck states
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: "Courses", href: "/courses" },
        { name: "Test Series", href: "/test-series" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled || isMobileMenuOpen
                    ? "bg-white/95 backdrop-blur-lg border-b border-gray-100 py-2 shadow-sm"
                    : "bg-white/80 backdrop-blur-md border-b border-transparent py-3"
                    }`}
            >
                <div className="max-w-container-hero mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-bold text-xl font-mono">M</span>
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
                            Math<span className="text-green-600">4</span>Code
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors relative group ${isActive ? "text-green-600 font-semibold" : "text-slate-600 hover:text-green-600"}`}
                                >
                                    {link.name}
                                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-green-600 transition-all ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Auth Buttons / Profile */}
                    <div className="hidden md:flex items-center gap-3">
                        {userProfile ? (
                            <>
                                {/* Dashboard Button */}
                                <Link href={getDashboardLink()}>
                                    <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-green-600 hover:bg-green-50">
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span className="text-sm font-medium">Dashboard</span>
                                    </Button>
                                </Link>

                                {/* Profile Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="p-0 w-10 h-10 rounded-full hover:ring-2 hover:ring-green-200 transition-all">
                                            {userProfile?.avatarUrl ? (
                                                <Image
                                                    src={userProfile.avatarUrl}
                                                    alt={userProfile?.fullName || "Profile"}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover shadow-md hover:shadow-lg transition-shadow"
                                                    priority
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow">
                                                    {userProfile?.email?.[0].toUpperCase()}
                                                </div>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 p-2">
                                        {/* User Info Header */}
                                        <div className="px-3 py-3 mb-2 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                {userProfile?.avatarUrl ? (
                                                    <Image
                                                        src={userProfile.avatarUrl}
                                                        alt={userProfile?.fullName || "Profile"}
                                                        width={40}
                                                        height={40}
                                                        className="w-10 h-10 rounded-full object-cover shadow-md"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                        {userProfile?.email?.[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {userProfile?.fullName || userProfile?.email?.split('@')[0]}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {userProfile?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <DropdownMenuItem asChild>
                                            <Link href="/student/settings" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-green-50 transition-colors">
                                                <User className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium text-gray-700">Profile</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                            <Link href={getDashboardLink()} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-green-50 transition-colors">
                                                <LayoutDashboard className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium text-gray-700">Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="my-2" />

                                        <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-rose-50 transition-colors">
                                            <LogOut className="w-4 h-4 text-rose-600" />
                                            <span className="text-sm font-medium text-rose-600">Sign out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost" className="text-slate-600 hover:text-green-600 hover:bg-green-50">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/auth/sign-up">
                                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/20 rounded-full px-6">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-[101]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay & Content */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop Overlay - Clicks here close the menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80] md:hidden pt-[72px]"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="fixed top-[72px] left-0 right-0 bg-white z-[90] md:hidden overflow-hidden border-b border-gray-100 shadow-xl rounded-b-2xl mx-2"
                        >
                            <div className="px-6 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center justify-between p-4 rounded-xl font-semibold border-b border-gray-100 last:border-0 transition-colors ${isActive ? "bg-green-50 text-green-700" : "hover:bg-slate-50 text-gray-900 hover:text-green-600"}`}
                                        >
                                            <span className="text-base">{link.name}</span>
                                            <ChevronRight className={`w-5 h-5 ${isActive ? "text-green-600" : "text-gray-400"}`} />
                                        </Link>
                                    );
                                })}
                                <div className="pt-4 border-t border-slate-100">
                                    {userProfile ? (
                                        <div className="space-y-2">
                                            <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button variant="outline" className="w-full justify-start gap-2 border-slate-200 text-slate-600 hover:border-green-200 hover:bg-green-50 hover:text-green-600">
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    Dashboard
                                                </Button>
                                            </Link>
                                            <Button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full justify-start gap-2 border-rose-200 text-rose-600 hover:bg-rose-50">
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button variant="outline" className="w-full justify-center border-slate-200 text-slate-600 hover:border-green-200 hover:bg-green-50 hover:text-green-600">
                                                    Log in
                                                </Button>
                                            </Link>
                                            <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button className="w-full justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/20">
                                                    Sign up
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
