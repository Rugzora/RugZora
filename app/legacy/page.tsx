"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Legacy() {
  const [legacyData, setLegacyData] = useState<any>(null);

  useEffect(() => {
    async function loadLegacyContent() {
      try {
        const { data } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "legacy")
          .maybeSingle();
        if (data && data.data) {
          setLegacyData(data.data);
        }
      } catch (err) {
        console.error("Error loading legacy page content:", err);
      }
    }
    loadLegacyContent();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.4,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.8,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  const hero = legacyData?.hero;
  const intro = legacyData?.intro;
  const workshop = legacyData?.workshop;
  const materials = legacyData?.materials;
  const cta = legacyData?.cta;

  return (
    <div className="bg-[#F8F5F0] min-h-screen font-sans">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={hero?.bgImage || "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=1600&auto=format&fit=crop&q=80"} 
            alt="Bhadohi Heritage" 
            className="w-full h-full object-cover opacity-90" 
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="relative z-10 text-center px-6"
        >
          <motion.span variants={itemVariants} className="text-[#C19A6B] uppercase tracking-[0.3em] font-semibold text-xs mb-4 block drop-shadow-md">
            {hero?.tag || "Our Heritage"}
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif text-[#F8F5F0] mb-6 drop-shadow-lg">
            {hero?.title || "Crafted in Bhadohi"}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-[#DFD8CC] font-light tracking-widest uppercase text-xs md:text-sm">
            {hero?.subtitle || "The Carpet City of India"}
          </motion.p>
        </motion.div>
      </section>

      {/* 2. THE INTRODUCTION (Editorial Text) */}
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.3 }} 
        className="w-full max-w-[1000px] mx-auto px-6 py-32 text-center"
      >
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-serif text-[#3A332C] mb-10 leading-snug">
          "{intro?.quote || "RugZora represents the pinnacle of modern carpet manufacturing, rooted deeply in the rich textile heritage of Uttar Pradesh."}"
        </motion.h2>
        <motion.p variants={itemVariants} className="text-[#6B6054] text-lg leading-relaxed font-light mb-8 whitespace-pre-line">
          {intro?.description || "We bring the fresh, golden warmth of artisanal design directly from our production house to your floors. By operating as direct manufacturers, we strip away the traditional retail markup, ensuring that every thread aligns with our standard of premium elegance and absolute authenticity."}
        </motion.p>
        <motion.div variants={itemVariants} className="w-24 h-[1px] bg-[#C19A6B] mx-auto mt-12"></motion.div>
      </motion.section>

      {/* 3. THE WORKSHOP & MACHINERY (Split Layout) */}
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        className="w-full bg-[#EBE5DA] py-0 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <motion.div variants={itemVariants} className="w-full md:w-1/2 h-[500px] md:h-auto relative overflow-hidden">
            <img 
              src={workshop?.image || "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
              alt="Precision Sewing" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" 
            />
          </motion.div>
          <div className="w-full md:w-1/2 px-8 py-24 md:p-32 flex flex-col justify-center">
            <motion.span variants={itemVariants} className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-4">
              {workshop?.tag || "Our Workshop"}
            </motion.span>
            <motion.h3 variants={itemVariants} className="text-4xl font-serif text-[#3A332C] mb-8">
              {workshop?.title || "Precision in Every Stitch"}
            </motion.h3>
            <motion.p variants={itemVariants} className="text-[#6B6054] leading-relaxed font-light mb-6 whitespace-pre-line">
              {workshop?.desc1 || "Our specialized setup is the heartbeat of RugZora. Equipped with an array of dedicated zigzag sewing technology and highly accurate straight-stitch machinery, our artisans maintain absolute control over every phase of production."}
            </motion.p>
            <motion.p variants={itemVariants} className="text-[#6B6054] leading-relaxed font-light whitespace-pre-line">
              {workshop?.desc2 || "This hands-on, mechanical precision allows us to meticulously shape the rugged, natural textures of Jute, while simultaneously achieving the flawless, luxurious finish required for our Cut-Pile carpets."}
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* 4. THE MATERIALS (Two Tall Pillars) */}
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.1 }} 
        className="w-full max-w-[1400px] mx-auto px-6 py-32"
      >
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h2 className="text-4xl font-serif text-[#3A332C] mb-4">
            {materials?.title || "Tale of Two Textures"}
          </h2>
          <p className="text-[#6B6054] font-light">
            {materials?.subtitle || "Mastering the duality of natural warmth and refined luxury."}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-auto md:h-[700px]">
          {/* Pillar 1 */}
          <motion.div variants={itemVariants} className="relative group overflow-hidden rounded-sm h-[500px] md:h-full">
            <img 
              src={materials?.pillar1?.img || "https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
              alt="Jute Material" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-12 left-10 pr-10">
              <span className="text-[#C19A6B] tracking-[0.2em] uppercase text-xs mb-2 block font-semibold">
                {materials?.pillar1?.tag || "The Earthy"}
              </span>
              <h3 className="text-4xl font-serif text-white mb-4">
                {materials?.pillar1?.title || "Golden Jute"}
              </h3>
              <p className="text-[#DFD8CC] font-light text-sm leading-relaxed">
                {materials?.pillar1?.desc || "Eco-friendly, highly durable, and naturally textured. Hand-guided through our straight-stitch machines to create a robust foundation that breathes life into any room."}
              </p>
            </div>
          </motion.div>
          
          {/* Pillar 2 */}
          <motion.div variants={itemVariants} className="relative group overflow-hidden rounded-sm h-[500px] md:h-full">
            <img 
              src={materials?.pillar2?.img || "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
              alt="Cut-Pile Material" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-12 left-10 pr-10">
              <span className="text-[#C19A6B] tracking-[0.2em] uppercase text-xs mb-2 block font-semibold">
                {materials?.pillar2?.tag || "The Luxurious"}
              </span>
              <h3 className="text-4xl font-serif text-white mb-4">
                {materials?.pillar2?.title || "Plush Cut-Pile"}
              </h3>
              <p className="text-[#DFD8CC] font-light text-sm leading-relaxed">
                {materials?.pillar2?.desc || "Soft, dense, and incredibly inviting. Crafted utilizing advanced zigzag techniques to ensure the yarn stands upright, delivering an exceptionally smooth and premium feel underfoot."}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. FINAL CALL TO ACTION */}
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.3 }} 
        className="w-full bg-[#3A332C] py-32 flex flex-col items-center text-center px-6"
      >
        <motion.svg variants={itemVariants} className="w-8 h-8 text-[#C19A6B] mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </motion.svg>
        <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-serif text-[#F8F5F0] mb-8">
          {cta?.title || "Experience the Legacy"}
        </motion.h2>
        <motion.p variants={itemVariants} className="text-[#DFD8CC] font-light mb-12 max-w-lg">
          {cta?.description || "Bring the unmatched quality of direct manufacturing into your home."}
        </motion.p>
        <Link
          href={cta?.btnLink || "/collections"}
          className="bg-[#C19A6B] text-white px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#F8F5F0] hover:text-[#3A332C] transition duration-500 shadow-md inline-block"
        >
          {cta?.btnText || "Explore Our Collections"}
        </Link>
      </motion.section>

    </div>
  );
}