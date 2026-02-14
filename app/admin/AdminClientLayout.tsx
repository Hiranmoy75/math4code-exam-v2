"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MobileNav from "./components/layout/MobileNav";
import { CommunityModalProvider } from "@/context/CommunityModalContext";
import { CommunityModal } from "@/components/community/CommunityModal";
import { useCurrentUser } from "@/hooks/student/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminClientLayout({
  profile: providedProfile,
  links,
  children,
}: {
  profile?: any; // Optional - if not provided, will fetch via hook
  links: any;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const queryClient = useQueryClient();

  // Fetch profile only if not provided (for admin layout)
  // Student layout provides profile directly to avoid duplicate fetch
  const { data: fetchedProfile, isLoading } = useCurrentUser({
    enabled: !providedProfile, // Only fetch if profile not provided
  });

  // Use provided profile or fetched profile
  const profile = providedProfile || fetchedProfile;

  const chartData = [
    { name: "Mon", users: 400, exams: 240 },
    { name: "Tue", users: 300, exams: 139 },
    { name: "Wed", users: 200, exams: 380 },
    { name: "Thu", users: 278, exams: 390 },
    { name: "Fri", users: 189, exams: 480 },
    { name: "Sat", users: 239, exams: 380 },
    { name: "Sun", users: 349, exams: 430 },
  ];

  useEffect(() => {
    // Cleanup: Remove any conflicting theme keys
    if (localStorage.getItem("theme")) {
      localStorage.removeItem("theme");
    }

    // Get saved theme from localStorage, default to "light" if not found
    const saved = localStorage.getItem("m4c_theme");
    const initial = saved || "light"; // Always default to light mode
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function applyTheme(t: string) {
    const root = document.documentElement;
    if (t === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("m4c_theme", next);
    applyTheme(next);
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };




  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();

    // CRITICAL: Clear ALL cache to prevent data leaks between users
    queryClient.clear();

    // Replace history to prevent back button issues
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/auth/login');
    }
    router.push('/auth/login');
  };

  // Show loading if fetching profile (admin layout case)
  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  // Profile is guaranteed to exist (either provided or fetched)
  return (
    <CommunityModalProvider>
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-black transition-colors duration-700">
        <Sidebar menuItems={links} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} profile={profile} />
        {/* <Sidebar menuItems={links} /> */}
        <Header theme={theme} toggleTheme={toggleTheme} sidebarCollapsed={sidebarCollapsed} profile={profile} setSidebarCollapsed={setSidebarCollapsed} />

        <main
          className={`flex-1 p-4 md:p-6 mt-16 pb-24 md:pb-8 transition-all duration-500 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"
            }`}
        >{children}
        </main>

        <MobileNav theme={theme} toggleTheme={toggleTheme} links={links} profile={profile} />
      </div>
      <CommunityModal />
    </CommunityModalProvider>
  );
}
