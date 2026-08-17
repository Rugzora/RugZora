"use client";

import { useState, use } from "react"; // 'use' ko import kiya gaya hai
import { motion } from "framer-motion";

// Params ab ek Promise hai
export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  // Params ko unwrap karein
  const resolvedParams = use(params);

  // Dummy product data
  const product = {
    id: resolvedParams.id, // Yahan ab unwrapped id ka use ho raha hai
    name: "Premium Cut-Pile Rug",
    price: "₹3,500",
    category: "Cut-Pile",
    description: "Experience unparalleled luxury with our Premium Cut-Pile Rug. Woven directly at our Bhadohi facility, this masterpiece features a dense, plush surface that feels incredibly soft underfoot. Its elegant design seamlessly blends with both modern and classic interiors.",
    material: "100% Premium Wool & Synthetic Blend",
    care: "Vacuum regularly. Spot clean with mild soap and water. Professional cleaning recommended for deep stains.",
    images: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ],
    sizes: ["3 x 5 ft", "5 x 8 ft", "8 x 10 ft", "Custom Size (Contact Us)"]
  };

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]); // Default 5x8

  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity(prev => prev + 1);

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-32 pb-24 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="text-[11px] tracking-widest uppercase text-[#8C8276] mb-12">
          <a href="/" className="hover:text-[#C19A6B]">Home</a>
          <span className="mx-2">/</span>
          <a href="/collections" className="hover:text-[#C19A6B]">Collections</a>
          <span className="mx-2">/</span>
          <span className="text-[#3A332C]">{product.category}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 h-auto md:h-[700px]">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto w-full md:w-24 shrink-0 no-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-24 shrink-0 bg-[#EBE5DA] rounded-sm overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#C19A6B]' : 'border-transparent hover:border-[#DFD8CC]'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <motion.div 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[400px] md:h-full bg-[#EBE5DA] rounded-sm overflow-hidden"
            >
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="text-xs text-[#C19A6B] uppercase tracking-[0.2em] font-semibold mb-3 block">
              {product.category} Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-[#6B6054] font-light mb-8">{product.price}</p>
            
            <p className="text-[#7A7065] leading-relaxed font-light mb-10">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <label className="block text-[11px] uppercase tracking-[0.15em] text-[#3A332C] font-semibold mb-3">
                Select Size
              </label>
              <div className="relative">
                <select 
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full md:w-2/3 appearance-none bg-transparent border border-[#DFD8CC] text-[#6B6054] py-4 px-5 text-sm focus:outline-none focus:border-[#C19A6B] transition-colors cursor-pointer rounded-none"
                >
                  {product.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-[#6B6054] md:right-[33%]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-10">
              <label className="block text-[11px] uppercase tracking-[0.15em] text-[#3A332C] font-semibold mb-3">
                Quantity
              </label>
              <div className="flex items-center border border-[#DFD8CC] w-[140px]">
                <button onClick={handleDecrease} className="w-12 h-12 flex items-center justify-center text-[#6B6054] hover:text-[#C19A6B] transition">-</button>
                <span className="flex-1 text-center text-[#3A332C] font-medium">{quantity}</span>
                <button onClick={handleIncrease} className="w-12 h-12 flex items-center justify-center text-[#6B6054] hover:text-[#C19A6B] transition">+</button>
              </div>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <button className="w-full sm:w-1/2 bg-[#3A332C] text-[#F8F5F0] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#C19A6B] hover:text-white transition duration-300">
                Add to Cart
              </button>
              <button className="w-full sm:w-1/2 border border-[#3A332C] text-[#3A332C] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-300">
                Buy It Now
              </button>
            </div>

            {/* Extra Info Accordion/Details */}
            <div className="border-t border-[#DFD8CC] pt-8">
              <div className="mb-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#3A332C] mb-2">Materials</h4>
                <p className="text-sm text-[#7A7065] font-light">{product.material}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#3A332C] mb-2">Care Instructions</h4>
                <p className="text-sm text-[#7A7065] font-light">{product.care}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}