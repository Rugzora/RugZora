"use client";

import { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

const ProductSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="aspect-[4/5] w-full bg-[#EBE5DA] mb-4 rounded-sm shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-[#E0DBCF] rounded-sm"></div>
    </div>
    <div className="flex flex-col items-center text-center mt-auto space-y-2">
      <div className="h-3 w-16 bg-[#EBE5DA] rounded"></div>
      <div className="h-5 w-40 bg-[#EBE5DA] rounded"></div>
      <div className="h-4 w-20 bg-[#EBE5DA] rounded"></div>
    </div>
  </div>
);

const SkeletonProductGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
    {[...Array(4)].map((_, i) => <ProductSkeleton key={`skeleton-${i}`} />)}
  </div>
);

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // 🌟 Hydration guard

  const [pageContent, setPageContent] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("rz_collections_content");
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    setMounted(true); // 🌟 Client mount confirmation
    const fetchPageContent = async () => {
      try {
        const { data } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "collections")
          .maybeSingle();
        if (data && data.data) {
          setPageContent(data.data);
          localStorage.setItem("rz_collections_content", JSON.stringify(data.data));
        }
      } catch (err) {}
    };
    fetchPageContent();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDbProducts(data);
      }
    } catch (err) {} finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    "Rectangular",
    "Round & Oval",
    "Runners",
    "Traditional"
  ];

  const filteredProducts = (() => {
    if (isLoading) return [];
    if (activeCategory === "All") return dbProducts;
    return dbProducts.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  })();

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }
  };
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.1, staggerChildren: 0.05 } },
  };
  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } }
  };

  // Jab tak client mount na ho, tab tak safe fallback render karein taaki hydration error na aaye
  if (!mounted) {
    return <div className="min-h-screen bg-[#F8F5F0]" />;
  }

  const heroBg = pageContent?.hero?.bgImage;
  const hasBgImage = typeof heroBg === "string" && heroBg.trim() !== "";

  return (
    <div className="bg-[#F8F5F0] pt-20 pb-20 px-6 min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        {hasBgImage ? (
          <div className="relative w-full h-[220px] md:h-[300px] mb-8 rounded-sm overflow-hidden flex items-center justify-center text-center shadow-md">
            <img
              src={heroBg}
              alt="Collections Header"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#241F1A]/55 backdrop-blur-[1px]"></div>
            
            <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="relative z-10 px-6 max-w-3xl mx-auto">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#E0D8CA] font-semibold mb-2 block">
                {pageContent?.hero?.tag || "THE"}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-2 text-[#F8F5F0] leading-tight drop-shadow-sm font-normal">
                {pageContent?.hero?.title || "Artisanal Floor Sculptures"}
              </h1>
              <p className="text-[#EBE5DA] text-xs md:text-sm font-light leading-relaxed drop-shadow-sm line-clamp-2 max-w-xl mx-auto">
                {pageContent?.hero?.description || "Browse our hand-braided rPET area rugs, runners, and custom silhouettes. 100% reversible, stain-resistant, and woven for mindful living."}
              </p>
            </motion.div>
          </div>
        ) : (
          <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="text-center pt-2 mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C19A6B] font-semibold mb-2 block">
              {pageContent?.hero?.tag || "THE"}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-3 text-[#3A332C] leading-tight tracking-normal">
              {pageContent?.hero?.title || "Artisanal Floor Sculptures"}
            </h1>
            <p className="text-[#6B6054] text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              {pageContent?.hero?.description || "Browse our hand-braided rPET area rugs, runners, and custom silhouettes. 100% reversible, stain-resistant, and woven for mindful living."}
            </p>
          </motion.div>
        )}

        {/* Filter Navigation */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-14 mb-10 pb-3"
        >
          {categories.map((category) => (
            <motion.button
              variants={buttonVariants}
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-sm md:text-base tracking-[0.18em] uppercase pb-2 transition-all duration-300 relative ${
                activeCategory === category 
                  ? "text-[#C19A6B] font-bold" 
                  : "text-[#7A7065] hover:text-[#3A332C] font-medium"
              }`}
            >
              {category}
              {activeCategory === category && (
                <motion.div 
                  layoutId="activeTabUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C19A6B] rounded-full" 
                />
              )}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Product Grid Area */}
        {isLoading ? (
          <SkeletonProductGrid />
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((item, index) => {
                const displayImg = Array.isArray(item.images) && item.images.length > 0 
                  ? item.images[0] 
                  : (item.image || "");

                return (
                  <motion.div 
                    key={item.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.95, y: 25 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                    transition={{ 
                      duration: 0.7, 
                      delay: index * 0.05, 
                      ease: [0.25, 1, 0.5, 1] 
                    }}
                    className="flex flex-col group h-full"
                  >
                    <Link href={`/product/${item.id}`} className="flex flex-col h-full w-full cursor-pointer">
                      <div className="aspect-[4/5] w-full bg-[#EBE5DA] mb-4 overflow-hidden relative rounded-sm shadow-sm">
                        {displayImg && (
                          <img 
                            src={displayImg} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] opacity-95 group-hover:opacity-100" 
                          />
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-full block text-center bg-white/90 backdrop-blur-sm text-[#3A332C] py-3 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#3A332C] hover:text-white transition-colors duration-300">
                            View Details
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center text-center mt-auto space-y-1">
                        <span className="text-[11px] text-[#C19A6B] uppercase tracking-[0.1em]">{item.category}</span>
                        <span className="text-base md:text-lg text-[#3A332C] font-serif font-medium leading-tight line-clamp-1">{item.name}</span>
                        <span className="text-sm text-[#6B6054] tracking-wider font-medium">{item.price}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16 text-[#6B6054]">
            <p>No products found in this collection.</p>
          </div>
        )}

        {/* Dynamic Bespoke Custom Banner */}
        {pageContent?.banner?.title && (
          <div className="mt-20 p-8 md:p-12 bg-white border border-[#EBE5DA] shadow-sm rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="max-w-xl">
              <h3 className="text-xl md:text-2xl font-serif text-[#3A332C] mb-2">
                {pageContent.banner.title}
              </h3>
              <p className="text-xs md:text-sm text-[#7A7065] leading-relaxed">
                {pageContent.banner.description}
              </p>
            </div>
            <Link
              href={pageContent.banner.ctaLink || "/collections"}
              className="bg-[#3A332C] text-white hover:bg-[#C19A6B] px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-300 rounded-sm shadow-md shrink-0"
            >
              {pageContent.banner.ctaText || "Start Custom Order"}
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}