"use client";

import { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Naye states modal ke liye
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("5 x 8 ft");

  // Reusable animation variant
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const products = [
    { id: 1, name: "Premium Cut-Pile Rug", category: "Cut-Pile", price: "₹3,500", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Natural Golden Jute", category: "Jute", price: "₹1,800", image: "https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Ivory Smooth Finish", category: "Cut-Pile", price: "₹2,200", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 4, name: "Earthy Jute Runner", category: "Jute", price: "₹1,200", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 5, name: "The Kasher Scrolls", category: "Traditional", price: "₹5,400", image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 6, name: "Modern Geometric Minimal", category: "Modern", price: "₹4,100", image: "https://images.unsplash.com/photo-1598928506311-c55dd129a0f4?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 7, name: "Charcoal Velvet Touch", category: "Cut-Pile", price: "₹3,800", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 8, name: "Rustic Braided Jute", category: "Jute", price: "₹1,600", image: "https://images.unsplash.com/photo-1615876234886-fd1a8f947122?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 9, name: "Persian Heritage Weave", category: "Traditional", price: "₹6,500", image: "https://images.unsplash.com/photo-1522771731478-44eb11de520b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 10, name: "Oatmeal Plush Area Rug", category: "Modern", price: "₹2,900", image: "https://images.unsplash.com/photo-1600566753086-00f18efc2294?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 11, name: "Deep Cashmere Cut-Pile", category: "Cut-Pile", price: "₹4,500", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
    { id: 12, name: "Artisan Hand-Knotted", category: "Traditional", price: "₹8,200", image: "https://images.unsplash.com/photo-1528394982635-c3fcefa66a01?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" },
  ];

  const categories = ["All", "Cut-Pile", "Jute", "Modern", "Traditional"];
  const sizes = ["3 x 5 ft", "5 x 8 ft", "8 x 10 ft", "9 x 12 ft", "Custom Size"];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(item => item.category === activeCategory);

  // Jab modal open ho toh pichhe ki screen scroll na ho
  useEffect(() => {
    if (selectedProduct) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [selectedProduct]);

  // Modal open karne ka function
  const openProductDetails = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1); // Naya product kholne par quantity 1 set karein
    setSelectedSize("5 x 8 ft");
  };

  return (
    <div className="bg-[#F8F5F0] pt-40 pb-32 px-6 min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-[#3A332C]">The Complete Collection</h1>
          <p className="text-[#6B6054] text-lg font-light max-w-2xl mx-auto">
            Explore our expertly manufactured fresh designs. From the golden threads of Bhadohi's Jute to the luxurious touch of premium Cut-Pile.
          </p>
        </motion.div>

        {/* Filter Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-wrap justify-center gap-8 mb-20">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-[13px] tracking-[0.15em] uppercase pb-2 transition-all duration-300 ${
                activeCategory === category ? "text-[#C19A6B] border-b-2 border-[#C19A6B] font-semibold" : "text-[#6B6054] hover:text-[#3A332C]"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
        
        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence>
            {filteredProducts.map((item, index) => (
              <motion.div 
                key={item.id} layout initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex flex-col group cursor-pointer"
                onClick={() => openProductDetails(item)} // Product par click karne par modal open
              >
                {/* Image Container with Hover Effect */}
                <div className="aspect-[4/5] bg-[#EBE5DA] mb-6 overflow-hidden relative rounded-sm shadow-sm">
                  <Link href={`/collections/${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] opacity-95 group-hover:opacity-100" 
                    />
                  </Link>
                  {/* View Details overlay on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Link href={`/collections/${item.id}`} className="w-full block text-center bg-white/90 backdrop-blur-sm text-[#3A332C] py-3 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#3A332C] hover:text-white transition-colors duration-300">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-[#C19A6B] uppercase tracking-[0.1em] mb-2">{item.category}</span>
                  <span className="text-lg text-[#3A332C] font-serif mb-1">{item.name}</span>
                  <span className="text-sm text-[#6B6054] tracking-wider">{item.price}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-[#6B6054]">
            <p>No products found in this collection.</p>
          </motion.div>
        )}
      </div>

      {/* PRODUCT DETAILS FULL-SCREEN MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3A332C]/40 backdrop-blur-md p-4 md:p-10"
            onClick={() => setSelectedProduct(null)} // Background click par close
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-[#F8F5F0] w-full max-w-[1200px] max-h-[95vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()} // Modal ke andar click karne par close na ho
            >
              
              {/* Close Button (X) */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-full text-[#3A332C] hover:bg-[#C19A6B] hover:text-white transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              {/* Left Side: Images Gallery */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col gap-4 bg-[#EBE5DA]/50">
                <div className="aspect-[4/5] bg-[#DFD8CC] w-full overflow-hidden rounded-sm">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                {/* Thumbnails (Dummy for now, using same image to show layout) */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-[#DFD8CC] overflow-hidden cursor-pointer opacity-100 border-2 border-[#C19A6B]"><img src={selectedProduct.image} className="w-full h-full object-cover" /></div>
                  <div className="aspect-square bg-[#DFD8CC] overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition"><img src={selectedProduct.image} className="w-full h-full object-cover grayscale" /></div>
                  <div className="aspect-square bg-[#DFD8CC] overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition"><img src={selectedProduct.image} className="w-full h-full object-cover grayscale" /></div>
                </div>
              </div>

              {/* Right Side: Product Details */}
              <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col">
                <span className="text-[#C19A6B] uppercase tracking-[0.2em] text-xs font-semibold mb-3">{selectedProduct.category} Collection</span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-4">{selectedProduct.name}</h2>
                <div className="text-2xl text-[#6B6054] mb-8">{selectedProduct.price}</div>

                <div className="w-full h-[1px] bg-[#EBE5DA] mb-8"></div>

                {/* Materials & Description */}
                <h4 className="text-sm uppercase tracking-widest text-[#3A332C] font-semibold mb-3">Materials & Craft</h4>
                <p className="text-[#7A7065] text-sm leading-relaxed mb-8">
                  Meticulously manufactured in our Bhadohi workshop using advanced zigzag and straight-stitch techniques. Designed to offer structural durability while maintaining an incredibly plush, premium feel underfoot.
                </p>

                {/* Size Dropdown */}
                <div className="mb-8">
                  <label className="text-sm uppercase tracking-widest text-[#3A332C] font-semibold mb-3 block">Select Size</label>
                  <div className="relative">
                    <select 
                      value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full appearance-none bg-transparent border border-[#DFD8CC] text-[#6B6054] py-4 px-5 pr-10 rounded-sm focus:outline-none focus:border-[#C19A6B] transition-colors"
                    >
                      {sizes.map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                    <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#C19A6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Quantity & Actions Row */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 mt-auto">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between border border-[#DFD8CC] rounded-sm px-4 py-3 sm:w-1/3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#6B6054] hover:text-[#C19A6B] p-2">-</button>
                    <span className="text-[#3A332C] font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-[#6B6054] hover:text-[#C19A6B] p-2">+</button>
                  </div>

                  {/* Add to Cart Button */}
                  <button className="sm:w-2/3 border border-[#3A332C] text-[#3A332C] py-4 uppercase tracking-[0.15em] text-xs font-semibold hover:bg-[#3A332C] hover:text-[#F8F5F0] transition-colors duration-300">
                    Add To Cart
                  </button>
                </div>

                {/* Buy Now Full Width Button */}
                <button className="w-full bg-[#C19A6B] text-white py-5 uppercase tracking-[0.2em] text-sm font-semibold hover:bg-[#3A332C] transition-colors duration-300 shadow-md">
                  Buy It Now
                </button>

                <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#8C8276] uppercase tracking-wider">
                  <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"/></svg> In Stock</span>
                  <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Dispatches in 48h</span>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}