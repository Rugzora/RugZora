"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Legacy() {
  const [legacyData, setLegacyData] = useState<any>(null);

  useEffect(() => {
    // 1. Local storage cache check (Safe client-side only)
    try {
      const cached = localStorage.getItem("rz_legacy_content");
      if (cached) {
        setLegacyData(JSON.parse(cached));
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch fresh content from database
    async function loadLegacyContent() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "legacy")
          .maybeSingle();

        if (error) {
          console.error("Error loading legacy content:", error);
          return;
        }

        if (data && data.data) {
          setLegacyData(data.data);
          try {
            localStorage.setItem("rz_legacy_content", JSON.stringify(data.data));
          } catch (e) {
            console.error(e);
          }
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }

    loadLegacyContent();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const hero = legacyData?.hero;
  const intro = legacyData?.intro;
  const workshop = legacyData?.workshop;
  const materials = legacyData?.materials;
  const cta = legacyData?.cta;

  const heroBg = typeof hero?.bgImage === "string" ? hero.bgImage : hero?.bgImage?.url || "";
  const workshopImg = typeof workshop?.image === "string" ? workshop.image : workshop?.image?.url || "";
  const pillar1Img = typeof materials?.pillar1?.img === "string" ? materials.pillar1.img : materials?.pillar1?.img?.url || "";
  const pillar2Img = typeof materials?.pillar2?.img === "string" ? materials.pillar2.img : materials?.pillar2?.img?.url || "";

  return (
    <div className="bg-[#F8F5F0] min-h-screen font-sans overflow-x-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden bg-[#241F1A]">
        {heroBg && (
          <div className="absolute inset-0 z-0">
            <img 
              src={heroBg} 
              alt={hero?.title || "Bhadohi Heritage"} 
              className="w-full h-full object-cover opacity-80" 
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}
        
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="relative z-10 text-center px-6"
        >
          {hero?.tag && (
            <motion.span variants={itemVariants} className="text-[#C19A6B] uppercase tracking-[0.3em] font-semibold text-xs mb-4 block drop-shadow-md">
              {hero.tag}
            </motion.span>
          )}
          {hero?.title && (
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif text-[#F8F5F0] mb-6 drop-shadow-lg">
              {hero.title}
            </motion.h1>
          )}
          {hero?.subtitle && (
            <motion.p variants={itemVariants} className="text-[#DFD8CC] font-light tracking-widest uppercase text-xs md:text-sm">
              {hero.subtitle}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* 2. THE INTRODUCTION (Editorial Text) */}
      {(intro?.quote || intro?.description) && (
        <motion.section 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }} 
          className="w-full max-w-[1000px] mx-auto px-6 py-32 text-center"
        >
          {intro?.quote && (
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-serif text-[#3A332C] mb-10 leading-snug">
              "{intro.quote}"
            </motion.h2>
          )}
          {intro?.description && (
            <motion.p variants={itemVariants} className="text-[#6B6054] text-lg leading-relaxed font-light mb-8 whitespace-pre-line">
              {intro.description}
            </motion.p>
          )}
          <motion.div variants={itemVariants} className="w-24 h-[1px] bg-[#C19A6B] mx-auto mt-12"></motion.div>
        </motion.section>
      )}

      {/* 3. THE WORKSHOP & MACHINERY (Split Layout) */}
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        className="w-full bg-[#EBE5DA] py-0 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <motion.div variants={itemVariants} className="w-full md:w-1/2 h-[450px] md:h-auto min-h-[400px] relative overflow-hidden bg-[#DFD8CC]">
            {workshopImg ? (
              <img 
                src={workshopImg} 
                alt={workshop?.title || "Workshop Machinery"} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-[#8C7A63] font-semibold">
                No Image Configured
              </div>
            )}
          </motion.div>

          <div className="w-full md:w-1/2 px-8 py-20 md:p-28 flex flex-col justify-center">
            {workshop?.tag && (
              <motion.span variants={itemVariants} className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-4">
                {workshop.tag}
              </motion.span>
            )}
            {workshop?.title && (
              <motion.h3 variants={itemVariants} className="text-3xl md:text-4xl font-serif text-[#3A332C] mb-6">
                {workshop.title}
              </motion.h3>
            )}
            {workshop?.desc1 && (
              <motion.p variants={itemVariants} className="text-[#6B6054] leading-relaxed font-light mb-6 whitespace-pre-line text-sm md:text-base">
                {workshop.desc1}
              </motion.p>
            )}
            {workshop?.desc2 && (
              <motion.p variants={itemVariants} className="text-[#6B6054] leading-relaxed font-light whitespace-pre-line text-sm md:text-base">
                {workshop.desc2}
              </motion.p>
            )}
          </div>
        </div>
      </motion.section>

      {/* 4. THE MATERIALS (Two Pillars) */}
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.1 }} 
        className="w-full max-w-[1400px] mx-auto px-6 py-32"
      >
        <div className="text-center mb-20">
          {materials?.title && (
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-serif text-[#3A332C] mb-3">
              {materials.title}
            </motion.h2>
          )}
          {materials?.subtitle && (
            <motion.p variants={itemVariants} className="text-[#6B6054] font-light">
              {materials.subtitle}
            </motion.p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Pillar 1 */}
          <motion.div variants={itemVariants} className="relative group overflow-hidden rounded-sm h-[480px] md:h-[620px] bg-[#EBE5DA]">
            {pillar1Img ? (
              <img 
                src={pillar1Img} 
                alt={materials?.pillar1?.title || "Pillar 1 Material"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-[#8C7A63] font-semibold">
                No Image Configured
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
            <div className="absolute bottom-10 left-8 right-8">
              {materials?.pillar1?.tag && (
                <span className="text-[#C19A6B] tracking-[0.2em] uppercase text-xs mb-2 block font-semibold">
                  {materials.pillar1.tag}
                </span>
              )}
              {materials?.pillar1?.title && (
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">
                  {materials.pillar1.title}
                </h3>
              )}
              {materials?.pillar1?.desc && (
                <p className="text-[#DFD8CC] font-light text-xs md:text-sm leading-relaxed">
                  {materials.pillar1.desc}
                </p>
              )}
            </div>
          </motion.div>
          
          {/* Pillar 2 */}
          <motion.div variants={itemVariants} className="relative group overflow-hidden rounded-sm h-[480px] md:h-[620px] bg-[#EBE5DA]">
            {pillar2Img ? (
              <img 
                src={pillar2Img} 
                alt={materials?.pillar2?.title || "Pillar 2 Material"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-[#8C7A63] font-semibold">
                No Image Configured
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
            <div className="absolute bottom-10 left-8 right-8">
              {materials?.pillar2?.tag && (
                <span className="text-[#C19A6B] tracking-[0.2em] uppercase text-xs mb-2 block font-semibold">
                  {materials.pillar2.tag}
                </span>
              )}
              {materials?.pillar2?.title && (
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">
                  {materials.pillar2.title}
                </h3>
              )}
              {materials?.pillar2?.desc && (
                <p className="text-[#DFD8CC] font-light text-xs md:text-sm leading-relaxed">
                  {materials.pillar2.desc}
                </p>
              )}
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
        {cta?.title && (
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-serif text-[#F8F5F0] mb-6">
            {cta.title}
          </motion.h2>
        )}
        {cta?.description && (
          <motion.p variants={itemVariants} className="text-[#DFD8CC] font-light mb-10 max-w-lg text-sm md:text-base">
            {cta.description}
          </motion.p>
        )}
        {cta?.btnText && (
          <Link
            href={cta?.btnLink || "/collections"}
            className="bg-[#C19A6B] text-white px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#F8F5F0] hover:text-[#3A332C] transition duration-500 shadow-md inline-block font-semibold"
          >
            {cta.btnText}
          </Link>
        )}
      </motion.section>

    </div>
  );
}