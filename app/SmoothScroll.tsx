"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Page reload hone par scroll ko wapas top par lana (Jhatka rokne ke liye)
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    // 2. Lenis Initialization
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true, // Touch aur scroll ko perfectly sync karta hai
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. THE MAGIC FIX: Pehle scroll event par force resize
    const forceResizeOnFirstScroll = () => {
      lenis.resize();
      // Ek baar chalne ke baad event listener hata dein taaki performance par asar na ho
      window.removeEventListener('wheel', forceResizeOnFirstScroll);
      window.removeEventListener('touchstart', forceResizeOnFirstScroll);
    };

    window.addEventListener('wheel', forceResizeOnFirstScroll, { once: true });
    window.addEventListener('touchstart', forceResizeOnFirstScroll, { once: true });

    // Framer motion ke animations load hote waqt background me height update karte rehna
    const resizeInterval = setInterval(() => {
      lenis.resize();
    }, 200);

    setTimeout(() => {
      clearInterval(resizeInterval);
    }, 2000); // 2 second baad background checking band kar dena

    return () => {
      clearInterval(resizeInterval);
      window.removeEventListener('wheel', forceResizeOnFirstScroll);
      window.removeEventListener('touchstart', forceResizeOnFirstScroll);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}