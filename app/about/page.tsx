"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function About() {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    async function loadAboutContent() {
      try {
        const { data } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "about")
          .maybeSingle();
        if (data && data.data) {
          setAboutData(data.data);
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const tag = aboutData?.hero?.tag || "Our Heritage";
  const title = aboutData?.hero?.title || "Crafted in Bhadohi";
  const para1 = aboutData?.hero?.para1 || "RugZora represents the pinnacle of modern carpet manufacturing, rooted in the rich textile heritage of Bhadohi, Uttar Pradesh. We bring the fresh, golden warmth of artisanal design directly from our production house to your floors.";
  const para2 = aboutData?.hero?.para2 || "As direct manufacturers, we operate our own specialized setup. Utilizing precision straight-stitch machinery and advanced zigzag sewing techniques, our artisans meticulously shape both the rugged, natural beauty of Jute and the smooth, luxurious finish of Cut-Pile carpets.";
  const para3 = aboutData?.hero?.para3 || "By maintaining complete control over our manufacturing, we ensure that every thread aligns with our standard of premium elegance, offering you unparalleled quality and authentic craftsmanship without the retail markup.";
  
  // 🌟 Admin Panel se aane wali image (support both keys)
  const displayImage = 
    (typeof aboutData?.footerImage === "string" && aboutData.footerImage.trim()) ||
    (typeof aboutData?.hero?.image === "string" && aboutData.hero.image.trim()) ||
    "";

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-center min-h-screen font-sans"
    >
      <motion.h3 variants={itemVariants} className="tracking-[0.2em] text-xs font-semibold mb-6 text-[#C5A059] uppercase">
        {tag}
      </motion.h3>
      
      <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-serif mb-12 text-[#3E362E]">
        {title}
      </motion.h1>
      
      <div className="space-y-8 text-[#5A524A] leading-[1.8] font-light text-lg max-w-3xl mx-auto">
        <motion.p variants={itemVariants} className="whitespace-pre-line">
          {para1}
        </motion.p>
        
        <motion.p variants={itemVariants} className="whitespace-pre-line">
          {para2}
        </motion.p>
        
        <motion.p variants={itemVariants} className="whitespace-pre-line">
          {para3}
        </motion.p>
      </div>
      
      {/* 🌟 LAST IMAGE SPOT (Admin Panel se manage hone wala area) */}
      <motion.div variants={itemVariants} className="mt-20 w-full">
        <div className="relative w-full h-[400px] md:h-[550px] bg-[#EBE5DA] rounded-sm overflow-hidden border border-[#DFD8CC] shadow-sm group flex items-center justify-center">
          {displayImage ? (
            <Image 
              src={displayImage} 
              alt={title || "RugZora Bhadohi Workshop"} 
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              quality={85}
              loading="lazy"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-[#8C7A63]">
              <svg className="w-12 h-12 mb-3 text-[#C19A6B]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold">
                Workshop Showcase Image Slot
              </span>
              <p className="text-[11px] text-[#A89F91] mt-1 font-light">
                Upload image from Admin Panel (`/admin/content`) to display here.
              </p>
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
}