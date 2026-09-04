"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
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
        delayChildren: 0.2,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  const tag = aboutData?.hero?.tag || "Our Heritage";
  const title = aboutData?.hero?.title || "Crafted in Bhadohi";
  const para1 = aboutData?.hero?.para1 || "RugZora represents the pinnacle of modern carpet manufacturing, rooted in the rich textile heritage of Bhadohi, Uttar Pradesh. We bring the fresh, golden warmth of artisanal design directly from our production house to your floors.";
  const para2 = aboutData?.hero?.para2 || "As direct manufacturers, we operate our own specialized setup. Utilizing precision straight-stitch machinery and advanced zigzag sewing techniques, our artisans meticulously shape both the rugged, natural beauty of Jute and the smooth, luxurious finish of Cut-Pile carpets.";
  const para3 = aboutData?.hero?.para3 || "By maintaining complete control over our manufacturing, we ensure that every thread aligns with our standard of premium elegance, offering you unparalleled quality and authentic craftsmanship without the retail markup.";
  const image = aboutData?.hero?.image || "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=1200";

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="pt-40 pb-24 px-6 max-w-3xl mx-auto text-center min-h-screen font-sans"
    >
      <motion.h3 variants={itemVariants} className="tracking-[0.2em] text-xs font-semibold mb-6 text-[#C5A059] uppercase">
        {tag}
      </motion.h3>
      
      <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-serif mb-12 text-[#3E362E]">
        {title}
      </motion.h1>
      
      <div className="space-y-8 text-[#5A524A] leading-[1.8] font-light text-lg">
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
      
      <motion.div variants={itemVariants} className="mt-16">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-96 object-cover rounded-sm opacity-90 hover:opacity-100 transition-opacity duration-700 shadow-md" 
        />
      </motion.div>
    </motion.div>
  );
}