"use client";

import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "rugzora@2026";

  useEffect(() => {
    // 1. Check if running on localhost (Bypass password)
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    if (isLocalhost) {
      setIsAuthenticated(true);
      setCheckingAuth(false);
      return;
    }

    // 2. Check if already unlocked in this session
    const savedAuth = sessionStorage.getItem("rz_admin_authenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === correctPassword) {
      sessionStorage.setItem("rz_admin_authenticated", "true");
      setIsAuthenticated(true);
      setErrorMessage("");
    } else {
      setErrorMessage("Incorrect Security PIN. Access Denied.");
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("rz_admin_authenticated");
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center font-serif text-[#C19A6B] text-sm animate-pulse">
        Verifying Security Credentials...
      </div>
    );
  }

  // If deployed on Vercel and not yet authenticated, show lock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex flex-col items-center justify-center px-6 font-sans">
        <div className="w-full max-w-sm bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-xl text-center">
          
          <div className="w-12 h-12 bg-[#F8F5F0] border border-[#DFD8CC] rounded-full mx-auto flex items-center justify-center text-[#C19A6B] mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8C7A63] block mb-1">
            RugZora Studio Security
          </span>
          <h1 className="text-2xl font-serif text-[#3A332C] mb-2 font-medium">
            Protected Console
          </h1>
          <p className="text-xs text-[#7A7065] mb-6 font-light leading-relaxed">
            Enter your management access key to open the administration panel.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Admin Password..."
                autoFocus
                className="w-full border border-[#DFD8CC] px-4 py-3 text-center text-sm outline-none focus:border-[#C19A6B] transition-all bg-[#FAFAF8]"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 font-medium">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#3A332C] text-[#F8F5F0] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#C19A6B] transition-colors rounded-sm shadow-md"
            >
              Authenticate ↗
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#EBE5DA]">
            <a href="/" className="text-[11px] text-[#8C7A63] hover:text-[#3A332C] uppercase tracking-wider font-semibold">
              ← Return to Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Once authenticated or on localhost:
  return (
    <div className="relative">
      {/* Small Logout Button for Live Deployments */}
      <div className="fixed bottom-4 right-4 z-[999]">
        <button
          onClick={handleLogout}
          title="Exit Admin Session"
          className="bg-white/80 backdrop-blur-sm border border-[#DFD8CC] text-[#7A7065] hover:text-red-600 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-sm transition-colors"
        >
          Lock Session ⎋
        </button>
      </div>
      {children}
    </div>
  );
}