"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(redirectUrl);
      }
    });
  }, [redirectUrl, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Failed to sign in. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        router.push(redirectUrl);
      } else {
        setErrorMsg("Please verify your email to complete sign in.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-10 sm:pt-14 md:pt-16 pb-20 px-4 sm:px-6 flex items-center justify-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 md:p-12 border border-[#EBE5DA] shadow-xl rounded-sm"
      >
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C19A6B] font-semibold block mb-2">
            RugZora Atelier
          </span>
          <h1 className="text-3xl font-serif text-[#3A332C]">Sign In to Your Account</h1>
          <p className="text-[#7A7065] text-xs mt-2 font-light">
            Access your tailored carpet orders, bespoke requests, and private wishlist.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3.5 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] transition-colors rounded-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#8C7A63] hover:text-[#C19A6B] uppercase tracking-wider font-semibold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3.5 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] transition-colors rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3A332C] text-[#F8F5F0] py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#C19A6B] transition-colors duration-300 rounded-sm shadow-md disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#DFD8CC] text-center">
          <p className="text-xs text-[#7A7065]">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="text-[#C19A6B] font-bold uppercase tracking-wider hover:underline ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F5F0] pt-40 pb-40 text-center text-[#C19A6B] font-serif text-lg animate-pulse">
          Loading Sign In...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
