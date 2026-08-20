"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabase";

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  // States
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (error) throw error;

        setProduct(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err: any) {
        console.error(err);
        setError("Product not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F8F5F0] min-h-screen pt-32 pb-24 flex justify-center items-center">
        <div className="text-[#C19A6B] text-xl font-serif animate-pulse">Loading Luxury...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#F8F5F0] min-h-screen pt-32 pb-24 flex justify-center items-center">
        <div className="text-[#3A332C] text-xl font-serif">{error || "Product not found"}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-32 pb-24 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="text-[11px] tracking-widest uppercase text-[#8C8276] mb-10">
          <a href="/" className="hover:text-[#C19A6B] transition">Home</a>
          <span className="mx-2">/</span>
          <a href="/collections" className="hover:text-[#C19A6B] transition">Collections</a>
          <span className="mx-2">/</span>
          <span className="text-[#3A332C]">{product.category}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 h-auto md:h-[700px]">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto w-full md:w-24 shrink-0 no-scrollbar">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-24 shrink-0 bg-[#EBE5DA] rounded-sm overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#C19A6B]' : 'border-transparent hover:border-[#DFD8CC]'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <motion.div 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[400px] md:h-full bg-[#EBE5DA] rounded-sm overflow-hidden relative"
            >
              {product.stock_quantity === 0 && (
                <div className="absolute top-4 left-4 bg-[#3A332C] text-white text-[10px] uppercase tracking-widest px-3 py-1 z-10">
                  Sold Out
                </div>
              )}
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-[#C19A6B] uppercase tracking-[0.2em] font-semibold block">
                {product.category}
              </span>
              {product.sku && <span className="text-[10px] text-[#8C8276] uppercase tracking-wider">SKU: {product.sku}</span>}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-[#6B6054] font-light mb-8">{product.price}</p>
            
            <p className="text-[#7A7065] leading-relaxed font-light mb-10 whitespace-pre-line">
              {product.description}
            </p>

            {/* Quick Attributes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 mb-10 border-y border-[#DFD8CC] py-6">
              {product.material && <div><span className="block text-[10px] uppercase text-[#8C8276] mb-1">Material</span><span className="text-sm text-[#3A332C]">{product.material}</span></div>}
              {product.color && <div><span className="block text-[10px] uppercase text-[#8C8276] mb-1">Color</span><span className="text-sm text-[#3A332C]">{product.color}</span></div>}
              {product.shape && <div><span className="block text-[10px] uppercase text-[#8C8276] mb-1">Shape</span><span className="text-sm text-[#3A332C]">{product.shape}</span></div>}
              {product.style && <div><span className="block text-[10px] uppercase text-[#8C8276] mb-1">Style</span><span className="text-sm text-[#3A332C]">{product.style}</span></div>}
              {product.pattern && <div><span className="block text-[10px] uppercase text-[#8C8276] mb-1">Pattern</span><span className="text-sm text-[#3A332C]">{product.pattern}</span></div>}
              {product.room && <div><span className="block text-[10px] uppercase text-[#8C8276] mb-1">Ideal Room</span><span className="text-sm text-[#3A332C]">{product.room}</span></div>}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
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
                    {product.sizes.map((size: string, idx: number) => (
                      <option key={idx} value={size}>{size}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-[#6B6054] md:right-[33%]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-10">
              <label className="block text-[11px] uppercase tracking-[0.15em] text-[#3A332C] font-semibold mb-3 flex items-center gap-4">
                Quantity
                {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                  <span className="text-[#C19A6B] normal-case tracking-normal font-normal">Only {product.stock_quantity} left in stock!</span>
                )}
              </label>
              <div className="flex items-center border border-[#DFD8CC] w-[140px]">
                <button onClick={handleDecrease} className="w-12 h-12 flex items-center justify-center text-[#6B6054] hover:text-[#C19A6B] transition">-</button>
                <span className="flex-1 text-center text-[#3A332C] font-medium">{quantity}</span>
                <button onClick={handleIncrease} className="w-12 h-12 flex items-center justify-center text-[#6B6054] hover:text-[#C19A6B] transition">+</button>
              </div>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <button 
                disabled={product.stock_quantity === 0}
                className="w-full sm:w-1/2 bg-[#3A332C] text-[#F8F5F0] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#C19A6B] hover:text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button 
                disabled={product.stock_quantity === 0}
                className="w-full sm:w-1/2 border border-[#3A332C] text-[#3A332C] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy It Now
              </button>
            </div>

            {/* Extra Info / Policies */}
            <div className="border-t border-[#DFD8CC] pt-8 space-y-6">
              
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A332C] mb-3">Key Features</h4>
                  <ul className="list-disc list-inside text-sm text-[#7A7065] font-light space-y-1">
                    {product.features.map((feature: string, idx: number) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.care_instructions && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A332C] mb-2">Care Instructions</h4>
                  <p className="text-sm text-[#7A7065] font-light">{product.care_instructions}</p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-4">
                {product.processing_time && (
                  <p className="text-sm text-[#7A7065] font-light flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {product.processing_time}
                  </p>
                )}
                {product.return_policy && (
                  <p className="text-sm text-[#7A7065] font-light flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    {product.return_policy}
                  </p>
                )}
                {product.is_customizable && (
                  <p className="text-sm text-[#7A7065] font-light flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Customization available upon request.
                  </p>
                )}
              </div>

              {/* Tags (SEO) */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="bg-[#EBE5DA] text-[#6B6054] text-[10px] px-3 py-1 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}