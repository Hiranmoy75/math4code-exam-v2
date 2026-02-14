"use client";

import React, { useState, Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, BookOpen, Calculator, Rocket } from "lucide-react";
import { useCurrentUser } from "@/hooks/student/useCurrentUser";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const { data: userProfile, isLoading: isUserLoading } = useCurrentUser();
  const hasRedirected = useRef(false);
  const routerRef = useRef(router);
  const nextRef = useRef(next);

  // Update refs when values change
  useEffect(() => {
    routerRef.current = router;
    nextRef.current = next;
  }, [router, next]);

  // Instant redirect for logged-in users
  // NOTE: This is now handled server-side in middleware for better performance
  // Server-side redirect prevents flickering and is faster
  /*
  useEffect(() => {
    if (hasRedirected.current || !userProfile || isUserLoading) return;
    hasRedirected.current = true;

    const redirect = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('user_tenant_memberships')
          .select('role')
          .eq('user_id', userProfile.id)
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();

        const isAdmin = data?.role === 'admin' || data?.role === 'creator';
        const targetPath = nextRef.current || (isAdmin ? '/admin/dashboard' : '/student/dashboard');
        
        // Use router.replace only - it handles history correctly
        routerRef.current.replace(targetPath);
      } catch {
        routerRef.current.replace('/student/dashboard');
      }
    };

    redirect();
  }, [userProfile, isUserLoading]);
  */

  // Show spinner while checking auth (server will redirect if logged in)
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;
      if (!data.user) throw new Error("No user data");

      // CRITICAL: Don't redirect here - let middleware handle it
      // Just reload the page and middleware will redirect to correct dashboard
      if (next) {
        window.location.href = next;
      } else {
        window.location.href = '/student/dashboard';
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // DYNAMIC REDIRECT: Use current window origin + /auth/callback
      // This ensures if user is on math4code.com, they return to math4code.com
      // If user is on mathentics.com, they return to mathentics.com
      const origin = window.location.origin;
      const callbackUrl = `${origin}/auth/callback`;

      const redirectTo = new URL(callbackUrl);

      if (next) redirectTo.searchParams.set("next", next);

      if (!process.env.NEXT_PUBLIC_TENANT_ID) {
        const hostname = window.location.hostname;
        let tenantSlug = 'mathentics'; // Default tenant

        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          const parts = hostname.split('.');
          // Check for subdomain (e.g., test.mathentics.com)
          // But exclude 'www' as it's not a tenant
          if (parts.length >= 3 && parts[0] !== 'www') {
            tenantSlug = parts[0]; // Override with subdomain if exists
          }
        }

        redirectTo.searchParams.set("tenant_slug", tenantSlug);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Explicitly set the redirect URL to override Supabase default Site URL
          redirectTo: redirectTo.toString(),
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err?.message || "Google Sign In failed");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[1000px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[580px] border border-slate-100"
    >
      {/* LEFT PANEL: Features */}
      <div className="hidden md:flex flex-col w-[45%] bg-[#F8FAFC] p-10 lg:p-12 relative overflow-hidden border-r border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="flex-1 flex flex-col justify-center relative z-10 space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Crack Competitive Exams</h2>
            <p className="text-slate-500 text-sm">Join 1000+ aspirants aceing <span className="font-bold text-slate-700">IIT JAM, CSIR NET & GATE</span>.</p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 border border-transparent hover:border-green-100 group cursor-default">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-white border border-green-100 flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10 relative">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="absolute top-12 left-6 w-0.5 h-12 bg-green-100/50" />
              </div>
              <div className="pt-1">
                <h3 className="text-base font-bold text-slate-800 group-hover:text-green-600 transition-colors">Comprehensive Courses</h3>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">Deep dive into IIT JAM, CSIR NET & GATE syllabi with structured modules.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 border border-transparent hover:border-pink-100 group cursor-default">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-white border border-pink-100 flex items-center justify-center text-pink-600 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10 relative">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="absolute top-12 left-6 w-0.5 h-12 bg-pink-100/50" />
              </div>
              <div className="pt-1">
                <h3 className="text-base font-bold text-slate-800 group-hover:text-pink-600 transition-colors">Mock Tests & PYQs</h3>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">Solve past year questions and full-length mock tests to boost confidence.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 border border-transparent hover:border-emerald-100 group cursor-default">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10 relative">
                  <Rocket className="w-6 h-6" />
                </div>
              </div>
              <div className="pt-1">
                <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Expert Guidance</h3>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">Learn from top educators and rank holders to strategize your preparation.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-100 shadow-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-green-600">JD</div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-600">AS</div>
              <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-teal-600">MK</div>
            </div>
            <div className="text-xs font-medium text-slate-600">
              <span className="font-bold text-slate-900">1k+</span> Aspirants
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="flex-1 p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-white relative">
        <div className="max-w-[360px] mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Welcome Back! 👋</h2>
            <p className="text-slate-500 text-sm">One account for all your learning needs.</p>
          </div>

          <div className="space-y-3 mb-8">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-sm font-semibold transition-all active:scale-[0.98] group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 21" className="w-5 h-5"><path fill="#4285F4" d="M10 8.682v3.872h5.382a4.6 4.6 0 0 1-2.01 3.01l3.246 2.518c1.89-1.746 2.982-4.31 2.982-7.355 0-.709-.064-1.39-.182-2.045z"></path><path fill="#34A853" d="m4.396 12.403-.732.56-2.591 2.019C2.718 18.245 6.09 20.5 10 20.5c2.7 0 4.963-.89 6.618-2.418l-3.246-2.518c-.89.6-2.027.963-3.372.963-2.6 0-4.81-1.754-5.6-4.118z"></path><path fill="#FBBC05" d="M1.073 6.018A9.9 9.9 0 0 0 0 10.5c0 1.618.39 3.136 1.073 4.482C1.073 14.99 4.4 12.4 4.4 12.4c-.2-.6-.318-1.237-.318-1.9 0-.664.118-1.3.318-1.9z"></path><path fill="#EA4335" d="M10 4.482c1.473 0 2.782.509 3.827 1.49l2.864-2.863C14.954 1.491 12.7.5 10 .5 6.09.5 2.718 2.745 1.073 6.018L4.4 8.6c.79-2.364 3-4.118 5.6-4.118"></path></svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-[11px] uppercase tracking-wider font-semibold text-slate-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs font-bold text-green-600 hover:text-green-700 hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600 text-xs font-medium"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  Sign In <ArrowRight className="h-4 w-4 opacity-50" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-slate-500">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-green-600 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-[500px] p-4">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-indigo-600" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
