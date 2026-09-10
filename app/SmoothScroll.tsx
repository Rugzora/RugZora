"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user is on mobile/tablet or touch-only device
    const isMobileDevice = () => {
      const isNarrow = window.innerWidth < 1024;
      const isTouch = window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(pointer: fine)").matches;
      return isNarrow || isTouch;
    };

    if (isMobileDevice()) {
      // 🌟 MOBILE / TABLET: 100% native hardware smooth scrolling
      window.history.scrollRestoration = "auto";
      if ((window as any).lenis) {
        delete (window as any).lenis;
      }
      return;
    }

    // 🌟 DESKTOP ONLY: Frame-rate independent spring damping (butter-smooth, zero image-load lag)
    window.history.scrollRestoration = "manual";

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085, // Spring-damped interpolation (immune to image decode / network micro-stutter)
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
      syncTouch: false,
    });

    (window as any).lenis = lenis;

    const handleResize = () => {
      if (isMobileDevice()) {
        lenis.destroy();
        delete (window as any).lenis;
      } else {
        lenis.resize();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete (window as any).lenis;
      }
    };
  }, []);

  return <>{children}</>;
}