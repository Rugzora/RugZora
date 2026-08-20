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
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

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
    };
  }, []);

  return <>{children}</>;
}