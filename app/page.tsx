"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

// 🌟 केवल प्योर फेड-इन (कोई स्लाइड नहीं)
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
  return (
    <motion.img
      src={src}
      alt={alt}
      loading={fetchPriority === "high" ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={fetchPriority}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    />
  );
}

export default function Home() {
  const [siteData, setSiteData] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("rz_home_content");
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

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
          setSiteData(data.data);
          localStorage.setItem("rz_home_content", JSON.stringify(data.data));
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    getDynamicContent();
  }, []);

  const defaultEthos = [
    { 
      img: "", 
      title: "Japandi & Modern Boho", 
      desc: "Warm neutral tones and marled textures designed to blend into Minimalist, Scandinavian, and Modern living spaces." 
    },
    { 
      img: "", 
      title: "100% Reversible Architecture", 
      desc: "Completely unbacked with identical texture on both sides. Flip your rug anytime to double its usable lifespan.", 
      extraClass: "md:mt-16" 
    },
    { 
      img: "", 
      title: "Reinforced Zigzag Craft", 
      desc: "Hand-braided chunky cords spiraled and locked using heavy-duty zigzag machine stitching to eliminate edge curl." 
    }
  ];

  const defaultSilhouettes = [
    { 
      img: "", 
      title: "Chunky Braided Oval & Rectangular", 
      desc: "Heavy-gauge cord construction that frames living and dining areas with organic marled depth." 
    },
    { 
      img: "", 
      title: "Round Medallions", 
      desc: "Spiraled center-out to accentuate entryways, reading nooks, and circular seating layouts.", 
      extraClass: "md:-translate-y-12" 
    },
    { 
      img: "", 
      title: "Architectural Bespoke", 
      desc: "Custom hallway runners and oversized rugs tailored to your exact floor plan dimensions." 
    }
  ];

  const defaultTextures = ["", "", "", ""];

  const defaultSpaces = [
    { img: "", title: "Living Room Statement", link: "Shop Area Rugs" },
    { img: "", title: "Pet & Kid Friendly", link: "Zero-Shed Textures" },
    { img: "", title: "Covered Patio & Hallways", link: "Shop Runners" }
  ];

  if (!mounted) {
    return <div className="min-h-screen bg-[#F8F5F0]" />;
  }

  return (
    <div className="w-full flex flex-col bg-[#F8F5F0] overflow-x-hidden font-sans">
      
      {/* 1. AIRY HERO SECTION */}
      <section className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[#EBE5DA]">
          {siteData?.hero?.bgImage && (
            <ScrollFadeImage 
              src={siteData.hero.bgImage} 
              alt="Handcrafted RugZora Interior" 
              fetchPriority="high"
              className="w-full h-full object-cover" 
            />
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-4">
            {siteData?.hero?.ctaText && (
              <a 
                href={siteData?.hero?.ctaLink || "/collections"} 
                className="w-full sm:w-80 h-14 flex items-center justify-center bg-[#3A332C] text-[#F8F5F0] text-xs tracking-[0.18em] uppercase hover:bg-[#C19A6B] hover:text-white transition duration-500 shadow-xl font-semibold px-6 text-center whitespace-nowrap"
              >
                {siteData.hero.ctaText}
              </a>
            )}

            <a 
              href="/process" 
              className="w-full sm:w-80 h-14 flex items-center justify-center bg-white/90 backdrop-blur-md text-[#3A332C] border border-[#DFD8CC] text-xs tracking-[0.18em] uppercase hover:bg-[#3A332C] hover:text-white hover:border-[#3A332C] transition duration-500 shadow-md font-semibold px-6 text-center whitespace-nowrap"
            >
              <span>See What We Do When You Order</span>
              <span className="ml-2 text-sm">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. THE BRAND ETHOS (ZERO SLIDING - PURE SMOOTH FADE-IN) */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {(siteData?.ethos || defaultEthos).map((item: any, index: number) => {
            const itemImg = typeof item.img === "string" ? item.img : item.img?.url || defaultEthos[index]?.img;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className={`flex flex-col group cursor-pointer ${index === 1 ? "md:mt-16" : ""}`}
              >
                <div className="aspect-[4/3] overflow-hidden mb-8 rounded-sm bg-[#EBE5DA] flex items-center justify-center relative">
                  {itemImg ? (
                    <img 
                      src={itemImg} 
                      alt={item.title || "Ethos Card"} 
                      loading="lazy" 
                      decoding="async" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                  ) : (
                    <span className="text-xs uppercase text-[#8C7A63] tracking-widest font-semibold">No Image</span>
                  )}
                </div>
                <h3 className="text-xl font-serif text-[#3A332C] mb-3">{item.title}</h3>
                <p className="text-[#7A7065] font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. SPLIT STORY - The Bhadohi Heritage */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-24 border-t border-[#EBE5DA]">
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
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

        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
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
                className={`bg-[#F8F5F0] p-8 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col h-[600px] ${
                  isCenterCard ? "md:-translate-y-12 shadow-md" : ""
                }`}
              >
                <div className="flex-grow overflow-hidden relative mb-8 rounded-sm bg-[#DFD8CC] flex items-center justify-center">
                  {silhouetteImg ? (
                    <ScrollFadeImage 
                      src={silhouetteImg} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
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
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
                className="w-full h-full object-cover" 
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
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out" 
                 />
               ) : (
                 <span className="text-[10px] uppercase text-[#8C7A63] tracking-widest font-semibold">No Detail Image</span>
               )}
            </div>

            <a 
              href={siteData?.bespoke?.btnLink || "/collections"} 
              className="w-full block text-center border border-[#3A332C] text-[#3A332C] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-300 font-semibold"
            >
              {siteData?.bespoke?.btnText || "Customize Your Rug"}
            </a>
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
              className="w-full h-full object-cover opacity-85" 
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