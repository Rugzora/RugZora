"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [siteData, setSiteData] = useState<any>(null);

  useEffect(() => {
    async function getDynamicContent() {
      try {
        // "homepage" ki jagah "home" karein:
        const { data } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "home")
          .maybeSingle();
        if (data && data.data) {
          setSiteData(data.data);
        }
      } catch (err) {
        console.error("Error fetching homepage dynamic content:", err);
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

  return (
    <div className="w-full flex flex-col bg-[#F8F5F0] overflow-x-hidden font-sans">
      
      {/* 1. AIRY HERO SECTION (DYNAMIC) */}
      <section className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[#EBE5DA]">
          <img 
            src={siteData?.hero?.bgImage || "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
            alt="Handcrafted RugZora Interior" 
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5F0] via-[#F8F5F0]/30 to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="relative z-10 text-center px-6 mt-20 max-w-4xl mx-auto"
        >
          <span className="text-[#C19A6B] uppercase tracking-[0.3em] font-semibold text-xs mb-6 block">
            {siteData?.hero?.tag || "Bespoke Artisanal Floor Coverings"}
          </span>
          <h1 className="text-5xl md:text-7xl text-[#3A332C] font-serif mb-6 leading-[1.1]">
            {siteData?.hero?.title || "Eco-Conscious Luxury."} <br />
            <span className="italic font-light text-[#6B6054]">
              {siteData?.hero?.subtitle || "Born in The Carpet City."}
            </span>
          </h1>
          <p className="text-lg text-[#6B6054] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            {siteData?.hero?.description || "Handcrafted chunky braided rugs woven from sustainable recycled PET fibers. Ultra-soft wool-like feel, 100% reversible, and tailored directly in our Bhadohi workshop."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={siteData?.hero?.ctaLink || "/collections"} 
              className="w-full sm:w-auto bg-[#3A332C] text-[#F8F5F0] px-10 py-5 text-xs tracking-[0.2em] uppercase hover:bg-[#C19A6B] hover:text-white transition duration-500 shadow-xl inline-block font-semibold"
            >
              {siteData?.hero?.ctaText || "Explore Handcrafted Rugs"}
            </a>

            <a 
              href="/process" 
              className="w-full sm:w-auto bg-white/70 backdrop-blur-md text-[#3A332C] border border-[#DFD8CC] px-8 py-5 text-xs tracking-[0.2em] uppercase hover:bg-[#3A332C] hover:text-white hover:border-[#3A332C] transition duration-500 shadow-md inline-flex items-center justify-center gap-2 font-semibold"
            >
              <span>See What We Do When You Order</span>
              <span className="text-sm">→</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* 2. THE BRAND ETHOS (DYNAMIC) */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {(siteData?.ethos || defaultEthos).map((item: any, index: number) => (
            <div 
              key={index}
              className={`flex flex-col group cursor-pointer ${index === 1 ? "md:mt-16" : ""}`}
            >
              <div className="aspect-[4/3] overflow-hidden mb-8 rounded-sm bg-[#EBE5DA]">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  loading="lazy" 
                  decoding="async" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" 
                />
              </div>
              <h3 className="text-xl font-serif text-[#3A332C] mb-3">{item.title}</h3>
              <p className="text-[#7A7065] font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
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
          <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-6">Signature Silhouettes</h2>
          <p className="text-[#6B6054] font-light text-lg">Braided profiles tailored to balance your home's geometry.</p>
        </motion.div>

        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
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
          ].map((item, index) => (
            <motion.div 
              key={index} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: item.delay, duration: 1.2 }}
              className={`bg-[#F8F5F0] p-8 shadow-sm hover:shadow-2xl transition-shadow duration-500 group flex flex-col h-[600px] ${item.extraClass || ""}`}
            >
              <div className="flex-grow overflow-hidden relative mb-8 rounded-sm bg-[#DFD8CC]">
                <img src={item.img} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition duration-[2s]" alt={item.title} />
              </div>
              <h3 className="text-3xl font-serif text-[#3A332C] mb-3">{item.title}</h3>
              <p className="text-[#7A7065] font-light mb-8">{item.desc}</p>
              <a href="/collections" className="text-xs uppercase tracking-[0.1em] text-[#C19A6B] font-semibold mt-auto inline-block">Shop Silhouettes →</a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. MATERIAL SCIENCE */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32 border-b border-[#EBE5DA]">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full md:w-5/12 order-2 md:order-1">
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-4 block">Material Science</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-8 leading-[1.2]">The Softness of Wool. <br/> The Strength of rPET.</h2>
            <p className="text-[#6B6054] text-lg leading-relaxed font-light mb-10">
              Zero plastic stiffness. By micro-spinning recycled polyester, our rugs offer pure wool-grade plushness without scratching skin. Naturally hydrophobic, they repel liquid spills and maintain pristine air quality with 100% shed-free construction.
            </p>
            <a href="/about" className="inline-block border border-[#3A332C] px-10 py-4 text-xs tracking-[0.2em] uppercase text-[#3A332C] hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-500">
              Explore Our Fiber Craft
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }} className="w-full md:w-7/12 order-1 md:order-2 relative h-[800px] rounded-sm overflow-hidden group bg-[#EBE5DA]">
            <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" loading="lazy" decoding="async" alt="Micro-spun recycled yarn detail" className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" />
          </motion.div>
        </div>
      </section>

      {/* 6. THE TEXTURE LIBRARY */}
      <section className="w-full py-32 bg-[#F8F5F0]">
        <div className="max-w-[1600px] mx-auto px-6">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#C19A6B] uppercase tracking-[0.2em] text-xs font-semibold mb-2 block">Natural Warmth</span>
              <h2 className="text-3xl font-serif text-[#3A332C]">Neutral & Marled Palettes</h2>
            </div>
            <a href="/collections" className="text-xs uppercase tracking-[0.1em] text-[#C19A6B] font-semibold hidden md:block border-b border-[#C19A6B]">View All Textures</a>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              "https://images.unsplash.com/photo-1615876234886-fd1a8f947122?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ].map((img, index) => (
              <motion.div key={index} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 1 }} className="aspect-square bg-[#EBE5DA] overflow-hidden group">
                <img src={img} alt={`Braided texture swatch ${index+1}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DESIGNED FOR LIVING SPACES */}
      <section className="w-full py-32 bg-[#EBE5DA]">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-6">Built for Family & High Traffic</h2>
            <p className="text-[#6B6054] font-light text-lg">Hydrophobic, stain-resistant fibers designed for effortless living.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[700px]">
            {[
              { img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Living Room Statement", link: "Shop Area Rugs" },
              { img: "https://images.unsplash.com/photo-1522771731478-44eb11de520b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Pet & Kid Friendly", link: "Zero-Shed Textures" },
              { img: "https://images.unsplash.com/photo-1598928506311-c55dd129a0f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Covered Patio & Hallways", link: "Shop Runners" }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.2, duration: 1.2 }} className="relative overflow-hidden group rounded-sm cursor-pointer h-[400px] md:h-full">
                <img src={item.img} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition duration-[1.5s]" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>
                <div className="absolute bottom-10 left-10 text-white z-10">
                  <h3 className="text-3xl font-serif mb-3">{item.title}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] border-b border-white pb-1 font-semibold">{item.link}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BESPOKE STUDIO SPOTLIGHT */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32 relative">
        <div className="flex flex-col md:flex-row gap-10">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }} className="w-full md:w-2/3 h-[700px] bg-[#EBE5DA] relative overflow-hidden rounded-sm">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" loading="lazy" decoding="async" alt="Custom RugZora Braided Floor Covering" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full md:w-1/3 md:absolute md:right-10 md:top-48 bg-white p-12 shadow-2xl max-w-md">
            <span className="text-[#C19A6B] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">End-to-End Bespoke</span>
            <h2 className="text-4xl font-serif text-[#3A332C] mb-6">Tailored to Your Floor Plan</h2>
            <p className="text-[#6B6054] font-light leading-relaxed mb-10">
              Need non-standard proportions? Customize shapes, custom foot measurements, and duo-tone palette contrasts crafted individually in our Bhadohi facility.
            </p>
            <div className="h-40 bg-[#EBE5DA] mb-8 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" loading="lazy" decoding="async" alt="Close-up braided cord finish" className="w-full h-full object-cover" />
            </div>
            <a href="/collections" className="w-full block text-center border border-[#3A332C] text-[#3A332C] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-300">
              Customize Your Rug
            </a>
          </motion.div>
        </div>
      </section>

      {/* 9. INSPIRATION GALLERY */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32">
        <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C]">Artisanal Living Spaces</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[800px]">
          <div className="flex flex-col gap-6">
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="h-[400px] bg-[#EBE5DA] rounded-sm overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" loading="lazy" decoding="async" alt="Warm Boho Setup" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
            </motion.div>
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }} className="h-[400px] bg-[#EBE5DA] rounded-sm overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1598928506311-c55dd129a0f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" loading="lazy" decoding="async" alt="Hallway Runner Setting" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
            </motion.div>
          </div>
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }} className="h-[400px] md:h-full bg-[#EBE5DA] rounded-sm overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1600566753086-00f18efc2294?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" loading="lazy" decoding="async" alt="Clean Japandi Interior" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
          </motion.div>
        </div>
      </section>

      {/* 10. THE RUGZORA DISTINCTION */}
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

      {/* 11. THE ARTISAN PROMISE (DYNAMIC) */}
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