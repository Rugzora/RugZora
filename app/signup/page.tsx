"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(redirectUrl);
      }
    });
  }, [redirectUrl, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setErrorMsg(error.message || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        router.push(redirectUrl);
      } else {
        setSuccessMsg(
          "Account created successfully! If email verification is enabled, please check your inbox to confirm your account."
        );
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-36 pb-24 px-6 flex items-center justify-center font-sans">
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
          <h1 className="text-3xl font-serif text-[#3A332C]">Create an Account</h1>
          <p className="text-[#7A7065] text-xs mt-2 font-light">
            Join RugZora to track custom orders, access express checkout, and save your favorite bespoke weaves.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm leading-relaxed">
            {successMsg}
            <div className="mt-3">
              <Link
                href={`/login${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                className="underline font-bold"
              >
                Proceed to Sign In →
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aarav Sharma"
              className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3.5 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] transition-colors rounded-sm"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3.5 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] transition-colors rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full bg-[#F8F5F0] border border-[#DFD8CC] p-3.5 text-sm text-[#3A332C] outline-none focus:border-[#C19A6B] transition-colors rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3A332C] text-[#F8F5F0] py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#C19A6B] transition-colors duration-300 rounded-sm shadow-md disabled:opacity-50 mt-2"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#DFD8CC] text-center">
          <p className="text-xs text-[#7A7065]">
            Already have an account?{" "}
            <Link
              href={`/login${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="text-[#C19A6B] font-bold uppercase tracking-wider hover:underline ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F5F0] pt-40 pb-40 text-center text-[#C19A6B] font-serif text-lg animate-pulse">
          Loading Sign Up...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
