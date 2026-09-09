"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col items-center justify-center px-6 text-center font-sans">
      <div className="w-16 h-16 bg-[#EBE5DA] rounded-full flex items-center justify-center text-[#C19A6B] mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C19A6B] mb-3 block">
        Momentary Hiccup
      </span>

      <h1 className="text-3xl md:text-4xl font-serif text-[#3A332C] mb-4">
        Something unexpected occurred
      </h1>

      <p className="text-sm text-[#7A7065] max-w-md mx-auto mb-8 font-light leading-relaxed">
        We encountered an issue loading this page. Please try refreshing or return to our handcrafted collections.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button
          onClick={() => reset()}
          className="bg-[#3A332C] text-[#F8F5F0] px-8 py-3.5 text-xs tracking-[0.18em] uppercase hover:bg-[#C19A6B] transition-colors rounded-sm shadow-md font-semibold cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-[#DFD8CC] text-[#3A332C] px-8 py-3.5 text-xs tracking-[0.18em] uppercase hover:border-[#3A332C] transition-colors rounded-sm font-semibold"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
