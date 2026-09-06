"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [siteData, setSiteData] = useState<any>(null);
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
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    getDynamicContent();
  }, []);

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const defaultEthos = [
    { 
      img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      title: "Japandi & Modern Boho", 
      desc: "Warm neutral tones and marled textures designed to blend into Minimalist, Scandinavian, and Modern living spaces." 
    },
    { 
      img: "https://images.pexels.com/photos/39005790/pexels-photo-39005790.jpeg", 
      title: "100% Reversible Architecture", 
      desc: "Completely unbacked with identical texture on both sides. Flip your rug anytime to double its usable lifespan.", 
      extraClass: "md:mt-16" 
    },
    { 
      img: "https://images.pexels.com/photos/31598222/pexels-photo-31598222.jpeg", 
      title: "Reinforced Zigzag Craft", 
      desc: "Hand-braided chunky cords spiraled and locked using heavy-duty zigzag machine stitching to eliminate edge curl." 
    }
  ];

  const defaultSilhouettes = [
    { 
      img: "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      title: "Chunky Braided Oval & Rectangular", 
      desc: "Heavy-gauge cord construction that frames living and dining areas with organic marled depth.", 
      delay: 0 
    },
    { 
      img: "https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      title: "Round Medallions", 
      desc: "Spiraled center-out to accentuate entryways, reading nooks, and circular seating layouts.", 
      delay: 0.2, 
      extraClass: "md:-translate-y-12" 
    },
    { 
      img: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      title: "Architectural Bespoke", 
      desc: "Custom hallway runners and oversized rugs tailored to your exact floor plan dimensions.", 
      delay: 0.4 
    }
  ];

  const defaultTextures = [
    "https://images.unsplash.com/photo-1615876234886-fd1a8f947122?w=600",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
    "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=600"
  ];

  const defaultSpaces = [
    { img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800", title: "Living Room Statement", link: "Shop Area Rugs" },
    { img: "https://images.unsplash.com/photo-1522771731478-44eb11de520b?w=800", title: "Pet & Kid Friendly", link: "Zero-Shed Textures" },
    { img: "https://images.unsplash.com/photo-1598928506311-c55dd129a0f4?w=800", title: "Covered Patio & Hallways", link: "Shop Runners" }
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
            <img 
              src={siteData.hero.bgImage} 
              alt="Handcrafted RugZora Interior" 
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover opacity-80" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5F0] via-[#F8F5F0]/30 to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="relative z-10 text-center px-6 mt-20 max-w-6xl w-full mx-auto"
        >
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
        </motion.div>
      </section>

      {/* 2. THE BRAND ETHOS (DYNAMIC) */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {(siteData?.ethos || defaultEthos).map((item: any, index: number) => {
            const itemImg = typeof item.img === "string" ? item.img : item.img?.url || defaultEthos[index]?.img;
            return (
              <div 
                key={index}
                className={`flex flex-col group cursor-pointer ${index === 1 ? "md:mt-16" : ""}`}
              >
                <div className="aspect-[4/3] overflow-hidden mb-8 rounded-sm bg-[#EBE5DA]">
                  <img 
                    src={itemImg} 
                    alt={item.title || "Ethos Card"} 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" 
                  />
                </div>
                <h3 className="text-xl font-serif text-[#3A332C] mb-3">{item.title}</h3>
                <p className="text-[#7A7065] font-light leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SPLIT STORY - The Bhadohi Heritage (DYNAMIC) */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-24 border-t border-[#EBE5DA]">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <motion.div 
            variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-4 block">
              {siteData?.story?.tag || "The Heritage of Bhadohi"}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-8 leading-[1.2]">
              {siteData?.story?.title || "Centuries of Tradition. Reimagined with rPET."}
            </h2>
            <p className="text-[#6B6054] text-lg leading-relaxed font-light mb-10 whitespace-pre-line">
              {siteData?.story?.description || "Operating right from Bhadohi, India's world-renowned 'Carpet City', RugZora bridges ancient braiding legacy with conscious innovation. We turn post-consumer plastic waste into micro-spun yarns that mimic pure wool—delivering an itch-free, luxuriously soft step directly from the loom to your room."}
            </p>
            <a href="/about" className="inline-flex items-center text-[#3A332C] uppercase tracking-[0.15em] text-xs font-semibold hover:text-[#C19A6B] transition-colors border-b border-[#3A332C] hover:border-[#C19A6B] pb-1">
              Read Our Full Story
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }}
            className="w-full md:w-1/2 relative h-[600px] rounded-sm overflow-hidden group bg-[#EBE5DA]"
          >
            <img 
              src={siteData?.story?.image || "https://media.istockphoto.com/id/2241474699/photo/rolling-up-a-colorful-rug-in-a-cozy-living-space.jpg?b=1&s=612x612&w=0&k=20&c=YCZM8PgDSFYKG7JTCxgW4HqYBrUVqECzMpiVk3J3x2I="} 
              alt="Bespoke Chunky Braided Rug" 
              loading="lazy" 
              decoding="async" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" 
            />
          </motion.div>
        </div>
      </section>

     
      {/* 4. SIGNATURE CATALOG PROFILES */}
      <section className="w-full bg-[#EBE5DA] py-40">
        <motion.div 
          variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
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
            
            // 🌟 Beech wale frame (index === 1) ko thoda upar uthane ke liye
            const isCenterCard = index === 1;

            return (
              <motion.div 
                key={index} 
                variants={fadeUpVariant} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.2, duration: 1.2 }}
                className={`bg-[#F8F5F0] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-[600px] ${
                  isCenterCard ? "md:-translate-y-12 shadow-md" : ""
                }`}
              >
                <div className="flex-grow overflow-hidden relative mb-8 rounded-sm bg-[#DFD8CC]">
                  <img 
                    src={silhouetteImg} 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-[2s]" 
                    alt={item.title} 
                  />
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
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full md:w-5/12 order-2 md:order-1">
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-4 block">
              {siteData?.materialScience?.tag || "Material Science"}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-8 leading-[1.2]">
              {siteData?.materialScience?.title || "The Softness of Wool. The Strength of rPET."}
            </h2>
            <p className="text-[#6B6054] text-lg leading-relaxed font-light mb-10">
              {siteData?.materialScience?.desc || "Zero plastic stiffness. By micro-spinning recycled polyester, our rugs offer pure wool-grade plushness without scratching skin. Naturally hydrophobic, they repel liquid spills and maintain pristine air quality with 100% shed-free construction."}
            </p>
            <a href="/about" className="inline-block border border-[#3A332C] px-10 py-4 text-xs tracking-[0.2em] uppercase text-[#3A332C] hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-500">
              {siteData?.materialScience?.btnText || "Explore Our Fiber Craft"}
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }} className="w-full md:w-7/12 order-1 md:order-2 relative h-[600px] md:h-[700px] rounded-sm overflow-hidden group bg-[#EBE5DA]">
            <img 
              src={siteData?.materialScience?.img || "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
              loading="lazy" 
              decoding="async" 
              alt="Micro-spun recycled yarn detail" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" 
            />
          </motion.div>
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
                : defaultTextures[idx];

            return (
              <div
                key={idx}
                className="aspect-square bg-[#EBE5DA] rounded-sm overflow-hidden relative group shadow-sm"
              >
                <img
                  src={imageUrl}
                  alt={`Braided texture swatch ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
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
              : spaceItem?.img?.url || defaultSpaces[idx]?.img;

            return (
              <div
                key={idx}
                className="group relative h-[480px] md:h-[580px] rounded-sm overflow-hidden bg-[#EBE5DA] shadow-md flex flex-col justify-end p-8"
              >
                <img
                  src={spaceImg}
                  alt={spaceItem?.title || "Living space"}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
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

   {/* 8. BESPOKE STUDIO SPOTLIGHT (FULLY DYNAMIC) */}
   <section className="w-full max-w-[1400px] mx-auto px-6 py-32 relative">
        <div className="flex flex-col md:flex-row gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1.5, ease: "easeOut" }} 
            viewport={{ once: true }} 
            className="w-full md:w-2/3 h-[700px] bg-[#EBE5DA] relative overflow-hidden rounded-sm"
          >
            <img 
              src={siteData?.bespoke?.mainImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
              loading="lazy" 
              decoding="async" 
              alt={siteData?.bespoke?.title || "Custom RugZora Braided Floor Covering"} 
              className="w-full h-full object-cover" 
            />
          </motion.div>

          <motion.div 
            variants={fadeUpVariant} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
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
            
            <div className="h-40 bg-[#EBE5DA] mb-8 overflow-hidden rounded-sm">
               <img 
                 src={siteData?.bespoke?.detailImage || "https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
                 loading="lazy" 
                 decoding="async" 
                 alt="Close-up braided cord finish" 
                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
               />
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
      <motion.section variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="w-full bg-[#F4F0E8] border-y border-[#E8E1D5] py-24 px-6">
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
              <motion.div key={i} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 1.2 }}>
                <span className="text-[#C19A6B] font-serif text-2xl font-bold mb-2 block">{item.num}</span>
                <h4 className="text-lg font-serif text-[#3A332C] mb-2">{item.title}</h4>
                <p className="text-sm text-[#7A7065] font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 10. THE ARTISAN PROMISE (DYNAMIC) */}
      <motion.section 
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 2 }} viewport={{ once: true }}
        className="relative w-full py-40 flex items-center justify-center text-center px-6 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={siteData?.promise?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"} 
            loading="lazy" 
            decoding="async" 
            alt="Artisanal RugZora Workshop" 
            className="w-full h-full object-cover" 
          />
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
      </motion.section>

    </div>
  );
}