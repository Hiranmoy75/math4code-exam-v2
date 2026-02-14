"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminClientLayout from "../admin/AdminClientLayout";
import { CommunityModalProvider } from "@/context/CommunityModalContext";
import { CommunityModal } from "@/components/community/CommunityModal";
import { useCurrentUser } from "@/hooks/student/useCurrentUser";
import { StudentAppContainer } from "@/components/StudentAppContainer";

export default function StudentClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: profile, isLoading, error } = useCurrentUser();

    useEffect(() => {
        // Only redirect if we have definitively finished loading and there is no user,
        // or if the user is not a student.
        if (!isLoading) {
            if (!profile) {
                // Profile is null - either not logged in or session conflict
                // Clear any stale cache and redirect to login
                console.log("No profile found, redirecting to login");
                router.replace("/auth/login");
            } else if (profile.role !== "student") {
                router.replace("/admin/dashboard");
            }
        }
    }, [profile, isLoading, router]);

    const links = [
        { icon: "home", label: "Dashboard", href: "/student/dashboard" },
        { icon: "trendingup", label: "My Series", href: "/student/my-series" },
        { icon: "layers", label: "All Series", href: "/student/all-test-series" },
        { icon: "bookopen", label: "My Courses", href: "/student/my-courses" },
        { icon: "layers", label: "All Courses", href: "/student/all-courses" },
        { icon: "messagesquare", label: "Community", href: "#", onClick: "openCommunity" },
        {
            icon: "award",
            label: "Result",
            href: "/student/results",
            prefetch: async () => {
                // Prefetch results data on hover
                // Optimization: Use cached profile ID if available
                if (!profile?.id) return null;

                const supabase = (await import('@/lib/supabase/client')).createClient();
                const { getTenantId } = await import('@/lib/tenant');
                const tenantId = await getTenantId();

                if (!tenantId) return null;

                const { data } = await supabase
                    .from("results")
                    .select(`
                        *,
                        exam_attempts!inner (
                            exam_id,
                            student_id,
                            exams (
                                title
                            )
                        )
                    `)
                    .eq("exam_attempts.student_id", profile.id)
                    .eq("tenant_id", tenantId)
                    .order("created_at", { ascending: false });

                return data;
            }
        },
        { icon: "gift", label: "Rewards", href: "/student/rewards" },
        { icon: "settings", label: "Settings", href: "/student/settings" },
    ];

    // Show loading state only while actively fetching
    // If error occurred, show error message instead of infinite loading
    if (isLoading && !profile) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                <p className="text-sm font-medium text-slate-600 animate-pulse">
                    Verifying secure access...
                </p>
            </div>
        );
    }

    // If error occurred, show error and redirect
    if (error) {
        console.error("Authentication error:", error);
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-slate-600 mb-2">
                    Authentication failed
                </p>
                <p className="text-xs text-slate-500">
                    Redirecting to login...
                </p>
            </div>
        );
    }

    // If not loading but no profile (will redirect in effect), allow render or return null to prevent flash
    if (!profile) return null;

    // Check if we're on a payment route - if so, render children directly
    const isPaymentRoute = pathname?.startsWith('/student/payment');

    return (
        <CommunityModalProvider>
            {isPaymentRoute ? (
                // For payment routes, render children directly without the SPA container
                <>{children}</>
            ) : (
                // For other routes, use the SPA container
                // Pass profile directly - AdminClientLayout will use it
                <AdminClientLayout profile={profile} links={links}>
                    <StudentAppContainer initialRoute={pathname} />
                </AdminClientLayout>
            )}
            <CommunityModal />
        </CommunityModalProvider>
    );
}
