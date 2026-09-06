"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Browser window scroll ko top par reset karein
    window.scrollTo(0, 0);

    // 2. Agar aapne global Lenis setup kiya hai toh usko bhi top par laayein
    if (typeof window !== "undefined" && (window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}