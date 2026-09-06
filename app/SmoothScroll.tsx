"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      lerp: 0.1, // 🌟 Yeh scroll ko ultra-smooth banata hai bina lag ke
      syncTouch: true, // 🌟 Mobile aur trackpad touch scrolling ko hardware sync karta hai
    });
    // 🌟 YEH LINE JODI HAI: Taaki ScrollToTop ishe access karke turant upar laa sake
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
    }

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleInitialSync = () => {
      lenis.resize();
    };

    window.addEventListener("load", handleInitialSync, { once: true });
    window.addEventListener("resize", handleInitialSync);

    const resizeTimer = setTimeout(() => {
      lenis.resize();
    }, 500);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("load", handleInitialSync);
      window.removeEventListener("resize", handleInitialSync);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete (window as any).lenis;
      }
    };
  }, []);

  return <>{children}</>;
}