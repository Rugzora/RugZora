"use client";

import { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

// 1. PRODUCT SKELETON CARD (Loading state ke liye)
const ProductSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="aspect-[4/5] w-full bg-[#EBE5DA] mb-6 rounded-sm shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-[#E0DBCF] rounded-sm"></div>
    </div>
    <div className="flex flex-col items-center text-center mt-auto space-y-2">
      <div className="h-3 w-16 bg-[#EBE5DA] rounded"></div>
      <div className="h-5 w-40 bg-[#EBE5DA] rounded"></div>
      <div className="h-4 w-20 bg-[#EBE5DA] rounded"></div>
    </div>
  </div>
);

// 2. SKELETON GRID AREA
const SkeletonProductGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
    {[...Array(4)].map((_, i) => <ProductSkeleton key={`skeleton-${i}`} />)}
  </div>
);

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Database Products (Only Real Data)
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
    } catch (err) {
      // Silently catch errors without logging to console
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Constants
  const categories = ["All", "Cut-Pile", "Jute", "Modern", "Traditional"];

  // Derived filtered products (No dummy products included)
  const filteredProducts = (() => {
    if (isLoading) return [];
    return activeCategory === "All" ? dbProducts : dbProducts.filter(item => item.category === activeCategory);
  })();

  // Luxury Animation Variants
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] } }
  };
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.1 } },
  };
  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 1, 0.5, 1] } }
  };

  return (
    <div className="bg-[#F8F5F0] pt-40 pb-32 px-6 min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-[#3A332C]">The Complete Collection</h1>
          <p className="text-[#6B6054] text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Explore our expertly manufactured fresh designs. From the golden threads of Bhadohi's Jute to the luxurious touch of premium Cut-Pile.
          </p>
        </motion.div>

        {/* Filter Navigation */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="flex flex-wrap justify-center gap-8 mb-20 md:mb-28"
        >
          {categories.map((category) => (
            <motion.button
              variants={buttonVariants}
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-[13px] tracking-[0.15em] uppercase pb-2 transition-all duration-300 ${
                activeCategory === category ? "text-[#C19A6B] border-b-2 border-[#C19A6B] font-semibold" : "text-[#6B6054] hover:text-[#3A332C]"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Product Grid Area */}
        {isLoading ? (
          <SkeletonProductGrid />
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((item, index) => {
                const displayImg = Array.isArray(item.images) && item.images.length > 0 
                  ? item.images[0] 
                  : (item.image || "");

                return (
                  <motion.div 
                    key={item.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.95, y: 60 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                    transition={{ 
                      duration: 1.2, 
                      delay: index * 0.08, 
                      ease: [0.25, 1, 0.5, 1] 
                    }}
                    className="flex flex-col group h-full"
                  >
                    <Link href={`/product/${item.id}`} className="flex flex-col h-full w-full cursor-pointer">
                      <div className="aspect-[4/5] w-full bg-[#EBE5DA] mb-6 overflow-hidden relative rounded-sm shadow-sm">
                        {displayImg && (
                          <img 
                            src={displayImg} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] opacity-95 group-hover:opacity-100" 
                          />
                        )}
                        {/* Hover Overlay Button */}
                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-full block text-center bg-white/90 backdrop-blur-sm text-[#3A332C] py-3 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#3A332C] hover:text-white transition-colors duration-300">
                            View Details
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center text-center mt-auto space-y-1">
                        <span className="text-xs text-[#C19A6B] uppercase tracking-[0.1em] mb-1">{item.category}</span>
                        <span className="text-lg text-[#3A332C] font-serif font-medium leading-tight">{item.name}</span>
                        <span className="text-sm text-[#6B6054] tracking-wider">{item.price}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 md:py-32 text-[#6B6054]">
            <p>No products found in this collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}