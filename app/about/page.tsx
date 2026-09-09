"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function About() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 1. LocalStorage cache pehle load karein (Instant display bina server conflict ke)
    try {
      const cached = localStorage.getItem("rz_about_content");
      if (cached) {
        setAboutData(JSON.parse(cached));
      }
    } catch (e) {}

    // 2. Supabase se fresh dynamic content pull karein
    async function loadAboutContent() {
      try {
        const { data } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "about")
          .maybeSingle();

        if (data && data.data) {
          setAboutData(data.data);
          localStorage.setItem("rz_about_content", JSON.stringify(data.data));
        }
      } catch (err) {
        console.error("Error loading about page content:", err);
      }
    }

    loadAboutContent();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // 🌟 Zero Hardcoded Defaults: Sirf wahi data aayega jo Admin panel me hai
  const tag = aboutData?.hero?.tag || "";
  const title = aboutData?.hero?.title || "";
  const para1 = aboutData?.hero?.para1 || "";
  const para2 = aboutData?.hero?.para2 || "";
  const para3 = aboutData?.hero?.para3 || "";

  const displayImage = 
    (typeof aboutData?.footerImage === "string" && aboutData.footerImage.trim()) ||
    (typeof aboutData?.hero?.image === "string" && aboutData.hero.image.trim()) ||
    "";

  // Jab tak client hydrate nahi hota, clean background render karein (Hydration Error 100% khatam)
  if (!isMounted) {
    return <div className="min-h-screen bg-[#F8F5F0]" />;
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-center min-h-screen font-sans"
    >
      {tag && (
        <motion.h3 variants={itemVariants} className="tracking-[0.2em] text-xs font-semibold mb-6 text-[#C5A059] uppercase">
          {tag}
        </motion.h3>
      )}
      
      {title && (
        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-serif mb-12 text-[#3E362E]">
          {title}
        </motion.h1>
      )}
      
      <div className="space-y-8 text-[#5A524A] leading-[1.8] font-light text-lg max-w-3xl mx-auto">
        {para1 && (
          <motion.p variants={itemVariants} className="whitespace-pre-line">
            {para1}
          </motion.p>
        )}
        
        {para2 && (
          <motion.p variants={itemVariants} className="whitespace-pre-line">
            {para2}
          </motion.p>
        )}
        
        {para3 && (
          <motion.p variants={itemVariants} className="whitespace-pre-line">
            {para3}
          </motion.p>
        )}
      </div>
      
      {/* 🌟 Workshop / Showcase Image */}
      <motion.div variants={itemVariants} className="mt-20 w-full">
        <div className="relative w-full h-[400px] md:h-[550px] bg-[#EBE5DA] rounded-sm overflow-hidden border border-[#DFD8CC] shadow-sm group flex items-center justify-center">
          {displayImage ? (
            <Image 
              src={displayImage} 
              alt={title || "RugZora Workshop"} 
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-[#8C7A63]">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold">
                No Image Configured
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}