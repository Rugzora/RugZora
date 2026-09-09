"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

// 🌟 Ultra-Smooth Single-Run Slide + Fade Image Component (Lag-Free & GPU Accelerated)
function ScrollFadeImage({
  src,
  alt,
  className = "",
  fetchPriority,
}: {
  src: string;
  alt: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
}) {
  if (!src) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-full overflow-hidden will-change-transform"
      style={{ transform: "translateZ(0)" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        priority={fetchPriority === "high"}
        loading={fetchPriority === "high" ? "eager" : "lazy"}
        quality={88}
        className={`object-cover ${className}`}
      />
    </motion.div>
  );
}

const defaultEthos = [
  { 
    num: "01",
    title: "Japandi & Modern Boho", 
    desc: "Warm neutral tones and marled textures designed to blend seamlessly into Minimalist, Scandinavian, and Modern living spaces." 
  },
  { 
    num: "02",
    title: "100% Reversible Architecture", 
    desc: "Completely unbacked with identical texture on both sides. Flip your rug anytime to double its usable lifespan and endurance." 
  },
  { 
    num: "03",
    title: "Reinforced Zigzag Craft", 
    desc: "Hand-braided chunky cords spiraled and locked using heavy-duty zigzag machine stitching to eliminate edge curl completely." 
  }
];

const defaultSilhouettes = [
  { 
    img: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886012994-8g4u8.webp", 
    title: "Chunky Braided Oval & Rectangular", 
    desc: "Heavy-gauge cord construction that frames living and dining areas with organic marled depth." 
  },
  { 
    img: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886024241-zce9i.webp", 
    title: "Round Medallions", 
    desc: "Spiraled center-out to accentuate entryways, reading nooks, and circular seating layouts.", 
    extraClass: "md:-translate-y-12" 
  },
  { 
    img: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886038028-z7xhf.webp", 
    title: "Architectural Bespoke", 
    desc: "Custom hallway runners and oversized rugs tailored to your exact floor plan dimensions." 
  }
];

const defaultTextures = [
  "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886295894-ffj9q.webp",
  "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886306008-81jhk.webp",
  "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886347448-6x1b3.webp",
  "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886380175-ve8io.webp"
];

const defaultSpaces = [
  { img: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886388939-yniy5.webp", title: "Living Room Statement", link: "Shop Area Rugs" },
  { img: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886406504-masi0.webp", title: "Pet & Kid Friendly", link: "Zero-Shed Textures" },
  { img: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886436771-unhjx.webp", title: "Covered Patio & Hallways", link: "Shop Runners" }
];

const defaultSiteData = {
  hero: {
    tag: "",
    tagSize: 21,
    title: "RugZora Premium Rugs & Carpets",
    titleSize: 63,
    subtitle: "",
    subtitleSize: undefined,
    description: "RUGZORA. CRAFTED WITH CARE IN INDIA.",
    descriptionSize: 19,
    ctaText: "Explore Handcrafted Rugs",
    ctaLink: "/collections",
    bgImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788885350236-wdp51.webp"
  },
  ethos: defaultEthos,
  curatedGallery: {
    tag: "Visual Perspectives",
    title: "Artisan Silhouettes in Motion",
    desc: "A closer look at texture, depth, and the natural drape of hand-braided rPET cords.",
    images: ["", "", "", ""]
  },
  story: {
    tag: "The Heritage of Bhadohi",
    image: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886800397-5cw5v.webp",
    title: "Centuries of Tradition. Reimagined with rPET.",
    description: "Operating right from Bhadohi, India's world-renowned 'Carpet City', RugZora bridges ancient braiding legacy with conscious innovation. We turn post-consumer plastic waste into micro-spun yarns that mimic pure wool—delivering an itch-free, luxuriously soft step directly from the loom to your room."
  },
  silhouettes: defaultSilhouettes,
  silhouettesHeader: {
    title: "Signature Silhouettes",
    desc: "Braided profiles tailored to balance your home's geometry."
  },
  spacesHeader: {
    title: "Built for Family & High Traffic",
    desc: "Hydrophobic, stain-resistant fibers designed for effortless living."
  },
  materialScience: {
    img: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886853069-vqtwe.webp",
    tag: "Material Science",
    desc: "Zero plastic stiffness. By micro-spinning recycled polyester, our rugs offer pure wool-grade plushness without scratching skin. Naturally hydrophobic, they repel liquid spills and maintain pristine air quality with 100% shed-free construction.",
    title: "The Softness of Wool. The Strength of rPET.",
    btnText: "Explore Our Fiber Craft"
  },
  spaces: defaultSpaces,
  bespoke: {
    mainImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886447966-jvzf4.webp",
    detailImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886455661-3etz7.webp",
    btnLink: "/customize"
  },
  promise: {
    image: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788885376486-16q3c.webp",
    title: "Sustainable Braided Luxury. Straight from our Workshop in Bhadohi.",
    ctaText: "Explore All Handcrafted Rugs"
  },
  textureLibrary: { images: defaultTextures }
};

export default function Home() {
  const [siteData, setSiteData] = useState<any>(defaultSiteData);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("rz_home_content");
      if (cached) {
        setSiteData((prev: any) => ({ ...prev, ...JSON.parse(cached) }));
      }
    } catch (e) {
      console.error(e);
    }

    async function getDynamicContent() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "home")
          .maybeSingle();

        if (error) {
          console.error("Error fetching homepage content:", error);
          return;
        }

        if (data && data.data) {
          setSiteData((prev: any) => ({ ...prev, ...data.data }));
          localStorage.setItem("rz_home_content", JSON.stringify(data.data));
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    getDynamicContent();
  }, []);

  return (
    <div className="w-full flex flex-col bg-[#F8F5F0] overflow-x-hidden font-sans">
      
      {/* 1. AIRY HERO SECTION */}
      <section className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[#EBE5DA]">
          {siteData?.hero?.bgImage && (
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-full h-full will-change-transform"
              style={{ transform: "translateZ(0)" }}
            >
              <Image
                src={siteData.hero.bgImage}
                alt="RugZora Premium Living Room"
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5F0] via-[#F8F5F0]/30 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 mt-20 max-w-6xl w-full mx-auto">
          {siteData?.hero?.tag && (
            <span 
              style={{ fontSize: siteData.hero.tagSize ? `${siteData.hero.tagSize}px` : undefined }}
              className="text-[#C19A6B] uppercase tracking-[0.3em] font-semibold mb-6 block"
            >
              {siteData.hero.tag}
            </span>
          )}

          {(siteData?.hero?.title || siteData?.hero?.subtitle) && (
            <h1 className="text-[#3A332C] font-serif mb-6 leading-[1.1]">
              {siteData?.hero?.title && (
                <span 
                  style={{ fontSize: siteData.hero.titleSize ? `${siteData.hero.titleSize}px` : undefined }} 
                  className="block md:whitespace-nowrap"
                >
                  {siteData.hero.title}
                </span>
              )}
              {siteData?.hero?.subtitle && (
                <span 
                  style={{ fontSize: siteData.hero.subtitleSize ? `${siteData.hero.subtitleSize}px` : undefined }}
                  className="italic font-light text-[#6B6054] block mt-1 md:whitespace-nowrap"
                >
                  {siteData.hero.subtitle}
                </span>
              )}
            </h1>
          )}

          {siteData?.hero?.description && (
            <p 
              style={{ fontSize: siteData.hero.descriptionSize ? `${siteData.hero.descriptionSize}px` : undefined }}
              className="text-[#6B6054] mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            >
              {siteData.hero.description}
            </p>
          )}

          {/* Symmetrical Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-4 w-full max-w-xl mx-auto px-2">
            {siteData?.hero?.ctaText && (
              <a 
                href={siteData?.hero?.ctaLink || "/collections"} 
                className="w-full sm:flex-1 min-h-[52px] py-4 px-4 sm:px-6 flex items-center justify-center bg-[#3A332C] text-[#F8F5F0] text-xs tracking-[0.14em] sm:tracking-[0.18em] uppercase hover:bg-[#C19A6B] hover:text-white transition duration-300 shadow-xl font-semibold text-center rounded-sm"
              >
                {siteData.hero.ctaText}
              </a>
            )}

            <a 
              href="/process" 
              className="w-full sm:flex-1 min-h-[52px] py-4 px-4 sm:px-6 flex items-center justify-center bg-white/90 backdrop-blur-md text-[#3A332C] border border-[#DFD8CC] text-xs tracking-[0.14em] sm:tracking-[0.18em] uppercase hover:bg-[#3A332C] hover:text-white hover:border-[#3A332C] transition duration-300 shadow-md font-semibold text-center rounded-sm"
            >
              <span>See What We Do When You Order</span>
              <span className="ml-1.5 text-sm shrink-0">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. THE BRAND ETHOS (CLEAN EDITORIAL PILLARS - NO IMAGES, ZERO LAG) */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-28 border-b border-[#EBE5DA]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {(siteData?.ethos || defaultEthos).map((item: any, index: number) => {
            const numLabel = `0${index + 1}`;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="flex flex-col justify-start bg-white/60 border border-[#EBE5DA] p-8 md:p-10 rounded-sm hover:border-[#C19A6B] transition-colors duration-300 shadow-sm"
              >
                <span className="text-[#C19A6B] font-serif text-2xl font-bold mb-4 block">
                  {numLabel}
                </span>
                <h3 className="text-xl md:text-2xl font-serif text-[#3A332C] mb-4">
                  {item.title}
                </h3>
                <div className="w-12 h-[1.5px] bg-[#DFD8CC] mb-6"></div>
                <p className="text-[#7A7065] font-light leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 🌟 2.5 CURATED VISUAL GALLERY (IMAGE BLANKS WITH SLIDE ANIMATION) */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-24 border-b border-[#EBE5DA]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
        >
          <div>
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-3 block">
              {siteData?.curatedGallery?.tag || "Visual Perspectives"}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#3A332C]">
              {siteData?.curatedGallery?.title || "Artisan Silhouettes in Motion"}
            </h2>
          </div>
          <p className="text-sm text-[#7A7065] font-light max-w-md">
            {siteData?.curatedGallery?.desc || "A closer look at texture, depth, and the natural drape of hand-braided rPET cords."}
          </p>
        </motion.div>

        {/* 4 Image Slots (Masonry/Mosaic Balance) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((idx) => {
            const raw = siteData?.curatedGallery?.images?.[idx];
            const imgUrl = typeof raw === "string" && raw.trim().length > 0 ? raw : raw?.url || "";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-[4/5] bg-[#EBE5DA] rounded-sm overflow-hidden relative group border border-[#DFD8CC] shadow-sm flex items-center justify-center will-change-transform"
                style={{ transform: "translateZ(0)" }}
              >
                {imgUrl ? (
                  <ScrollFadeImage
                    src={imgUrl}
                    alt={`Curated Frame ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-[#8C7A63]">
                    <div className="w-10 h-10 rounded-full border border-dashed border-[#C19A6B] flex items-center justify-center mb-3">
                      <span className="text-[#C19A6B] text-lg font-light">+</span>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold">
                      Spotlight Frame #{idx + 1}
                    </span>
                    <span className="text-[9px] text-[#A89F91] mt-1 uppercase tracking-widest font-mono">
                      Empty Slot
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. SPLIT STORY - The Bhadohi Heritage */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-24 border-b border-[#EBE5DA]">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-4 block">
              {siteData?.story?.tag || "The Heritage of Bhadohi"}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-8 leading-[1.2]">
              {siteData?.story?.title || "Centuries of Tradition. Reimagined with rPET."}
            </h2>
            <p className="text-[#6B6054] text-lg leading-relaxed font-light mb-10 whitespace-pre-line">
              {siteData?.story?.description || "Operating right from Bhadohi, India's world-renowned 'Carpet City', RugZora bridges ancient braiding legacy with conscious innovation."}
            </p>
            <a href="/about" className="inline-flex items-center text-[#3A332C] uppercase tracking-[0.15em] text-xs font-semibold hover:text-[#C19A6B] transition-colors border-b border-[#3A332C] hover:border-[#C19A6B] pb-1">
              Read Our Full Story
            </a>
          </motion.div>
          <div className="w-full md:w-1/2 relative h-[600px] rounded-sm overflow-hidden group bg-[#EBE5DA] flex items-center justify-center">
            {siteData?.story?.image ? (
              <ScrollFadeImage 
                src={siteData.story.image} 
                alt="Bespoke Chunky Braided Rug" 
                className="group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            ) : (
              <span className="text-xs uppercase text-[#8C7A63] tracking-widest font-semibold">No Image Configured</span>
            )}
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE CATALOG PROFILES */}
      <section className="w-full bg-[#EBE5DA] py-40">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1400px] mx-auto px-6 text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-6">
            {siteData?.silhouettesHeader?.title || "Signature Silhouettes"}
          </h2>
          <p className="text-[#6B6054] font-light text-lg">
            {siteData?.silhouettesHeader?.desc || "Braided profiles tailored to balance your home's geometry."}
          </p>
        </motion.div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
          {(siteData?.silhouettes || defaultSilhouettes).map((item: any, index: number) => {
            const silhouetteImg = typeof item.img === "string" ? item.img : item.img?.url || defaultSilhouettes[index]?.img;
            const isCenterCard = index === 1;

            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-[#F8F5F0] p-6 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col min-h-[480px] sm:min-h-[540px] ${
                  isCenterCard ? "lg:-translate-y-8 shadow-md" : ""
                }`}
              >
                <div className="flex-grow overflow-hidden relative mb-8 rounded-sm bg-[#DFD8CC] flex items-center justify-center">
                  {silhouetteImg ? (
                    <ScrollFadeImage 
                      src={silhouetteImg} 
                      className="group-hover:scale-105 transition-transform duration-700 ease-out" 
                      alt={item.title} 
                    />
                  ) : (
                    <span className="text-xs uppercase text-[#8C7A63] tracking-widest font-semibold">No Image</span>
                  )}
                </div>
                <h3 className="text-3xl font-serif text-[#3A332C] mb-3">{item.title}</h3>
                <p className="text-[#7A7065] font-light mb-8">{item.desc}</p>
                <a 
                  href="/collections" 
                  className="text-xs uppercase tracking-[0.1em] text-[#C19A6B] font-semibold mt-auto inline-block"
                >
                  Shop Silhouettes →
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. MATERIAL SCIENCE */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32 border-b border-[#EBE5DA]">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-5/12 order-2 md:order-1"
          >
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-4 block">
              {siteData?.materialScience?.tag || "Material Science"}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-8 leading-[1.2]">
              {siteData?.materialScience?.title || "The Softness of Wool. The Strength of rPET."}
            </h2>
            <p className="text-[#6B6054] text-lg leading-relaxed font-light mb-10">
              {siteData?.materialScience?.desc || "Zero plastic stiffness. By micro-spinning recycled polyester, our rugs offer pure wool-grade plushness without scratching skin."}
            </p>
            <a href="/about" className="inline-block border border-[#3A332C] px-10 py-4 text-xs tracking-[0.2em] uppercase text-[#3A332C] hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-300">
              {siteData?.materialScience?.btnText || "Explore Our Fiber Craft"}
            </a>
          </motion.div>
          <div className="w-full md:w-7/12 order-1 md:order-2 relative h-[600px] md:h-[700px] rounded-sm overflow-hidden group bg-[#EBE5DA] flex items-center justify-center">
            {siteData?.materialScience?.img ? (
              <ScrollFadeImage 
                src={siteData.materialScience.img} 
                alt="Micro-spun recycled yarn detail" 
                className="group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            ) : (
              <span className="text-xs uppercase text-[#8C7A63] tracking-widest font-semibold">No Image Configured</span>
            )}
          </div>
        </div>
      </section>

      {/* 6. THE TEXTURE LIBRARY */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-28 border-b border-[#EBE5DA]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-3 block">
              {siteData?.textureLibrary?.tag || "Natural Warmth"}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#3A332C]">
              {siteData?.textureLibrary?.title || "Neutral & Marled Palettes"}
            </h2>
          </div>
          <a
            href="/collections"
            className="text-xs uppercase tracking-[0.15em] font-bold text-[#8C7A63] hover:text-[#3A332C] transition-colors underline underline-offset-8"
          >
            View All Textures
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((idx) => {
            const raw = siteData?.textureLibrary?.images?.[idx];
            const imageUrl = typeof raw === "string" && raw.trim().length > 0 
              ? raw 
              : raw?.url && raw.url.trim().length > 0 
                ? raw.url 
                : "";

            return (
              <div
                key={idx}
                className="aspect-square bg-[#EBE5DA] rounded-sm overflow-hidden relative group shadow-sm flex items-center justify-center"
              >
                {imageUrl ? (
                  <ScrollFadeImage
                    src={imageUrl}
                    alt={`Braided texture swatch ${idx + 1}`}
                    className="group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <span className="text-[10px] uppercase text-[#8C7A63] tracking-widest font-semibold">No Swatch</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. DESIGNED FOR LIVING SPACES */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-28">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-serif text-[#3A332C] mb-3">
            {siteData?.spacesHeader?.title || "Built for Family & High Traffic"}
          </h2>
          <p className="text-[#6B6054] text-base font-light">
            {siteData?.spacesHeader?.desc || "Hydrophobic, stain-resistant fibers designed for effortless living."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[0, 1, 2].map((idx) => {
            const spaceItem = siteData?.spaces?.[idx] || defaultSpaces[idx];
            const spaceImg = typeof spaceItem?.img === "string" && spaceItem.img.trim().length > 0 
              ? spaceItem.img 
              : spaceItem?.img?.url || "";

            return (
              <div
                key={idx}
                className="group relative h-[480px] md:h-[580px] rounded-sm overflow-hidden bg-[#EBE5DA] shadow-md flex flex-col justify-end p-8"
              >
                {spaceImg ? (
                  <ScrollFadeImage
                    src={spaceImg}
                    alt={spaceItem?.title || "Living space"}
                    className="group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs uppercase text-[#8C7A63] font-semibold">No Space Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#241F1A]/80 via-black/20 to-transparent"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-serif text-[#F8F5F0] mb-2">
                    {spaceItem?.title}
                  </h3>
                  {spaceItem?.link && (
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C19A6B] group-hover:underline">
                      {spaceItem.link}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. BESPOKE STUDIO SPOTLIGHT */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32 relative">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-2/3 h-[700px] bg-[#EBE5DA] relative overflow-hidden rounded-sm flex items-center justify-center">
            {siteData?.bespoke?.mainImage ? (
              <ScrollFadeImage 
                src={siteData.bespoke.mainImage} 
                alt={siteData?.bespoke?.title || "Custom RugZora Braided Floor Covering"} 
              />
            ) : (
              <span className="text-xs uppercase text-[#8C7A63] tracking-widest font-semibold">No Main Bespoke Image</span>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/3 md:absolute md:right-10 md:top-48 bg-white p-12 shadow-2xl max-w-md"
          >
            <span className="text-[#C19A6B] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">
              {siteData?.bespoke?.tag || "End-to-End Bespoke"}
            </span>
            <h2 className="text-4xl font-serif text-[#3A332C] mb-6">
              {siteData?.bespoke?.title || "Tailored to Your Floor Plan"}
            </h2>
            <p className="text-[#6B6054] font-light leading-relaxed mb-10">
              {siteData?.bespoke?.description || "Need non-standard proportions? Customize shapes, custom foot measurements, and duo-tone palette contrasts crafted individually in our Bhadohi facility."}
            </p>
            
            <div className="h-40 bg-[#EBE5DA] mb-8 overflow-hidden rounded-sm flex items-center justify-center">
               {siteData?.bespoke?.detailImage ? (
                 <ScrollFadeImage 
                    src={siteData.bespoke.detailImage} 
                    alt="Close-up braided cord finish" 
                    className="hover:scale-105 transition-transform duration-500 ease-out" 
                 />
               ) : (
                 <span className="text-[10px] uppercase text-[#8C7A63] tracking-widest font-semibold">No Detail Image</span>
               )}
            </div>

            <Link 
              href={
                siteData?.bespoke?.btnLink && siteData.bespoke.btnLink !== "/collections"
                  ? siteData.bespoke.btnLink
                  : "/customize"
              } 
              className="w-full min-h-[48px] flex items-center justify-center text-center border border-[#3A332C] text-[#3A332C] py-3.5 px-4 text-xs tracking-[0.18em] uppercase hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-300 font-semibold rounded-sm"
            >
              {siteData?.bespoke?.btnText || "Customize Your Rug"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 9. THE RUGZORA DISTINCTION */}
      <section className="w-full bg-[#F4F0E8] border-y border-[#E8E1D5] py-24 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="text-[#C19A6B] uppercase tracking-[0.25em] font-semibold text-xs mb-4 block">The RugZora Standard</span>
          <h3 className="text-3xl md:text-4xl font-serif text-[#3A332C] mb-6">Conscious Luxury. Uncompromised Resilience.</h3>
          <p className="text-[#6B6054] text-base md:text-lg font-light leading-relaxed max-w-3xl mx-auto mb-16">
            Engineered for longevity and hand-locked with industrial zigzag stitching. Each piece honors the handmade mark with unique speckle subtleties and genuine Indian craft.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left border-t border-[#E0D8CA] pt-12">
            {[
              { 
                num: "01", 
                title: "100% Recycled PET Fiber", 
                desc: "Diverts landfill plastic while providing an itch-free, ultra-soft, and family-safe wool alternative." 
              },
              { 
                num: "02", 
                title: "Zero Shedding & Stain Proof", 
                desc: "Naturally hydrophobic cords resist liquid spills and mildew. Completely shed-free for clean indoor air." 
              },
              { 
                num: "03", 
                title: "Direct from Bhadohi", 
                desc: "No middlemen or retail markup. Every reversible carpet is shipped straight from our workshop looms to your doorstep." 
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <span className="text-[#C19A6B] font-serif text-2xl font-bold mb-2 block">{item.num}</span>
                <h4 className="text-lg font-serif text-[#3A332C] mb-2">{item.title}</h4>
                <p className="text-sm text-[#7A7065] font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. THE ARTISAN PROMISE */}
      <section className="relative w-full py-40 flex items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#241F1A]">
          {siteData?.promise?.image && (
            <ScrollFadeImage 
              src={siteData.promise.image} 
              alt="Artisanal RugZora Workshop" 
              className="opacity-85" 
            />
          )}
          <div className="absolute inset-0 bg-[#241F1A]/85"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <svg className="w-10 h-10 text-[#C19A6B] mx-auto mb-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h2 className="text-3xl md:text-5xl font-serif text-[#F8F5F0] mb-6 leading-snug drop-shadow-lg">
            {siteData?.promise?.title || "Sustainable Braided Luxury. Straight from our Workshop in Bhadohi."}
          </h2>
          <a 
            href="/collections" 
            className="text-[#C19A6B] border-b border-[#C19A6B] pb-1 uppercase tracking-[0.2em] text-xs md:text-sm hover:text-white hover:border-white transition-colors duration-300"
          >
            {siteData?.promise?.ctaText || "Explore All Handcrafted Rugs"}
          </a>
        </div>
      </section>

    </div>
  );
}