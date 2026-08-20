"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../lib/supabase";

const SpecItem = ({ label, value }: { label: string; value: string }) => {
  if (!value) return null;
  return (
    <div className="border-t border-[#DFD8CC]/70 pt-4">
      <span className="block text-xs uppercase tracking-widest text-[#8C7A63] font-medium mb-1.5">{label}</span>
      <span className="block text-base text-[#3A332C] font-serif">{value}</span>
    </div>
  );
};

export default function ProductPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [product, setProduct] = useState<any>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState("");
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const lightboxImageRef = useRef<HTMLImageElement>(null);
  const lightboxBackdropRef = useRef<HTMLDivElement>(null);

  const [globalUsdRate, setGlobalUsdRate] = useState<number>(83.50);
  const [userCurrency, setUserCurrency] = useState("USD");

  useEffect(() => {
    setUserCurrency(localStorage.getItem("user_currency") || "USD");
    const handleCurrencyUpdate = () => setUserCurrency(localStorage.getItem("user_currency") || "USD");
    window.addEventListener("currency_changed", handleCurrencyUpdate);

    const fetchGlobalRate = async () => {
      const { data } = await supabase.from("store_settings").select("usd_rate").eq("id", 1).maybeSingle();
      if (data && data.usd_rate) setGlobalUsdRate(parseFloat(data.usd_rate));
    };
    fetchGlobalRate();

    return () => window.removeEventListener("currency_changed", handleCurrencyUpdate);
  }, []);

  useEffect(() => {
    if (!product || !selectedVariant) return;
    const cart = JSON.parse(localStorage.getItem("rugzora_cart") || "[]");
    const exists = cart.some((item: any) => item.id === product.id && item.size === selectedVariant.size);
    setIsInCart(exists);
  }, [product, selectedVariant]);

  useEffect(() => {
    if (!product) return;
    const wishlist = JSON.parse(localStorage.getItem("rugzora_wishlist") || "[]");
    const exists = wishlist.some((item: any) => item.id === product.id);
    setIsWishlisted(exists);
  }, [product]);

  const getConvertedPrice = (inrPrice: string | number, qty: number = 1) => {
    if (!inrPrice) return "Price on Request";
    const numericInrPrice = parseFloat(inrPrice.toString().replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericInrPrice) || numericInrPrice === 0) return "Price on Request";

    const relativeRates: Record<string, number> = { USD: 1.00, EUR: 0.92, GBP: 0.79, CAD: 1.36, AUD: 1.53, INR: globalUsdRate };
    const targetRate = relativeRates[userCurrency] || 1;
    const convertedPrice = (numericInrPrice / globalUsdRate) * targetRate * qty;
    const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", CAD: "CA$", AUD: "AU$", INR: "₹" };
    
    return `${symbols[userCurrency] || "$"}${convertedPrice.toFixed(2)}`;
  };

  const fetchProduct = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError("");

      const { data, error: dbError } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

      if (dbError) throw dbError;
      if (!data) { setError("Product not found."); setProduct(null); return; }

      let mappedVariants = data.variants;
      if (!mappedVariants || mappedVariants.length === 0) {
        const fallbackSizes = Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ["Standard Size"];
        mappedVariants = fallbackSizes.map((sz: string) => ({ size: sz, price: data.price || "0" }));
      }
      
      data.variants = mappedVariants;
      setProduct(data);
      setSelectedVariant(mappedVariants[0]);

      const imgs = Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image || ""];
      setActiveImage(imgs[0]);

      if (data.related_products && Array.isArray(data.related_products) && data.related_products.length > 0) {
        const { data: relData } = await supabase.from("products").select("*").in("id", data.related_products).limit(4);
        if (relData) setRelatedItems(relData);
      } else {
        const { data: fallbackData } = await supabase.from("products").select("*").eq("category", data.category).neq("id", data.id).limit(4);
        if (fallbackData) setRelatedItems(fallbackData);
      }
    } catch (err: any) { setError("Product not found."); setProduct(null); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const getLightboxIndex = () => (!product || !product.images) ? 0 : product.images.indexOf(activeImage);
  const navigateLightbox = (step: number, e?: React.MouseEvent | Event) => {
    if (e) e.stopPropagation(); 
    if (!product || !product.images) return;
    const currentIdx = getLightboxIndex();
    const newIdx = (currentIdx + step + product.images.length) % product.images.length;
    setActiveImage(product.images[newIdx]);
  };

  useEffect(() => {
    if (isLightboxOpen) { document.body.style.overflow = "hidden"; document.documentElement.style.overflow = "hidden"; } 
    else { document.body.style.overflow = ""; document.documentElement.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; document.documentElement.style.overflow = ""; };
  }, [isLightboxOpen]);

  useEffect(() => {
    if (!isLightboxOpen || !lightboxBackdropRef.current) return;
    const backdrop = lightboxBackdropRef.current;
    const stopScroll = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    backdrop.addEventListener('wheel', stopScroll, { passive: false });
    backdrop.addEventListener('touchmove', stopScroll, { passive: false });
    return () => { backdrop.removeEventListener('wheel', stopScroll); backdrop.removeEventListener('touchmove', stopScroll); };
  }, [isLightboxOpen]);

  useEffect(() => {
    if (!isLightboxOpen || !lightboxImageRef.current) return;
    const img = lightboxImageRef.current;
    let scale = 1, pointX = 0, pointY = 0, startX = 0, startY = 0, isPinching = false;
    const updateTransform = () => img.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    updateTransform();
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); e.stopPropagation();
      img.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)';
      const rect = img.getBoundingClientRect();
      const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
      let nextScale = Math.max(1, Math.min(5, scale * (e.deltaY > 0 ? 0.8 : 1.25))); 
      if (nextScale <= 1) { scale = 1; pointX = 0; pointY = 0; } 
      else { const factor = nextScale / scale; pointX -= mouseX * (factor - 1); pointY -= mouseY * (factor - 1); scale = nextScale; }
      updateTransform();
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (scale <= 1) return;
      e.preventDefault(); isPinching = true; startX = e.clientX - pointX; startY = e.clientY - pointY;
      img.style.transition = 'none'; img.style.cursor = 'grabbing';
    };
    const handleMouseMove = (e: MouseEvent) => { if (!isPinching) return; pointX = e.clientX - startX; pointY = e.clientY - startY; updateTransform(); };
    const handleMouseUp = () => { isPinching = false; img.style.cursor = scale > 1 ? 'grab' : 'zoom-in'; };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      else if (e.key === 'ArrowRight') navigateLightbox(1, e as any);
      else if (e.key === 'ArrowLeft') navigateLightbox(-1, e as any);
    };

    img.addEventListener('wheel', handleWheel, { passive: false }); img.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); window.addEventListener('keydown', handleKeyDown);
    img.style.cursor = scale > 1 ? 'grab' : 'zoom-in';

    return () => {
      img.removeEventListener('wheel', handleWheel); img.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, activeImage]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    setIsAddingToCart(true);

    const existingCart = JSON.parse(localStorage.getItem("rugzora_cart") || "[]");
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id && item.size === selectedVariant.size);

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.images?.[0] || product.image || "",
        size: selectedVariant.size,
        price: selectedVariant.price,
        quantity: quantity
      });
    }

    localStorage.setItem("rugzora_cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cart_updated"));
    
    setTimeout(() => {
      setIsAddingToCart(false);
      setIsInCart(true);
      window.dispatchEvent(new Event("open_cart")); 
    }, 400);
  };

  const toggleWishlist = () => {
    if (!product) return;
    let wishlist = JSON.parse(localStorage.getItem("rugzora_wishlist") || "[]");
    
    if (isWishlisted) {
      wishlist = wishlist.filter((item: any) => item.id !== product.id);
    } else {
      wishlist.push({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.images?.[0] || product.image || "",
        price: product.variants?.[0]?.price || product.price || "0", 
      });
    }
    
    localStorage.setItem("rugzora_wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  if (isLoading) return <div className="text-center pt-32 pb-40 text-[#C19A6B] font-serif text-xl animate-pulse min-h-screen bg-[#F8F5F0]">Loading details...</div>;
  if (error || !product) return (
    <div className="flex flex-col items-center justify-center pt-32 pb-40 min-h-screen bg-[#F8F5F0] px-6 text-center">
      <div className="w-20 h-20 bg-[#EBE5DA] rounded-full flex items-center justify-center text-[#C19A6B] mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h2 className="text-3xl font-serif text-[#3A332C] mb-4">Product Not Found</h2>
      <p className="text-[#7A7065] max-w-md mx-auto mb-8">We couldn't find the carpet you're looking for. It may have been removed or the link might be incorrect.</p>
      <Link href="/collections" className="bg-[#C19A6B] text-white px-8 py-4 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-[#3A332C] transition-colors rounded-sm shadow-md">Explore Collections</Link>
    </div>
  );

  return (
    <div className="bg-[#F8F5F0] pt-[80px] pb-40 min-h-screen font-sans">
      
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 mb-16 md:mb-20">
        
        {/* BIG IMAGE */}
        <div 
          className="w-full h-[65vh] md:h-[85vh] bg-[#DFD8CC] overflow-hidden rounded-sm cursor-pointer group relative flex items-center justify-center shadow-md"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
        </div>
        
        {/* THUMBNAILS */}
        {Array.isArray(product.images) && product.images.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {product.images.map((img: string, idx: number) => (
              <div 
                key={idx} onClick={() => setActiveImage(img)}
                className={`w-20 h-20 md:w-24 md:h-24 bg-[#DFD8CC] overflow-hidden cursor-pointer rounded-sm transition ${activeImage === img ? 'opacity-100 border-2 border-[#C19A6B] shadow-inner scale-105' : 'opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Gallery view ${idx + 1}`}/>
              </div>
            ))}
          </div>
        )}

        {/* WISHLIST BUTTON */}
        <div className="flex justify-end mt-10 md:pr-4">
          <button 
            onClick={toggleWishlist}
            className="flex items-center gap-3 text-sm md:text-base uppercase tracking-[0.15em] font-bold transition-all duration-300 hover:opacity-70"
          >
            {isWishlisted ? (
              <svg className="w-6 h-6 md:w-8 md:h-8 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            ) : (
              <svg className="w-6 h-6 md:w-8 md:h-8 text-[#6B6054]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            )}
            <span className={isWishlisted ? "text-red-500" : "text-[#6B6054]"}>
              {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
            </span>
          </button>
        </div>

      </div>

      <div className="w-full max-w-4xl mx-auto px-6 flex flex-col">
        
        <div className="mb-14">
          <div className="mb-8 text-left">
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">{product.category} Collection</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#3A332C] mb-2 font-medium leading-tight">{product.name}</h1>
            
            {/* 🌟 ORIGINAL NAME */}
            {product.original_name && (
              <p className="text-sm text-[#8C7A63] italic mb-6 font-medium">Original Artisan Design: {product.original_name}</p>
            )}
            
            <div className="flex items-end flex-wrap gap-x-4 gap-y-2 mt-4">
              {selectedVariant && (
                quantity > 1 && getConvertedPrice(selectedVariant.price, 1) !== "Price on Request" ? (
                  <div className="flex items-center text-[#8C7A63] text-xl font-medium bg-white px-4 py-2 rounded-sm border border-[#DFD8CC] shadow-sm">
                    <span>{getConvertedPrice(selectedVariant.price, 1)}</span>
                    <span className="mx-3 opacity-60">×</span>
                    <span>{quantity}</span>
                    <span className="mx-3 opacity-60">=</span>
                    <span className="text-3xl text-[#3A332C] font-semibold">Total: {getConvertedPrice(selectedVariant.price, quantity)}</span>
                  </div>
                ) : (
                  <div className="text-4xl text-[#6B6054] font-light">
                    {getConvertedPrice(selectedVariant?.price, 1)}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 border border-[#EBE5DA] shadow-sm rounded-sm">
            <div className="mb-6 relative z-0">
              <label htmlFor="size" className="text-xs uppercase tracking-widest text-[#3A332C] font-semibold mb-3 block">Select Size</label>
              <div className="relative">
                <select 
                  id="size"
                  value={selectedVariant?.size || ""} 
                  onChange={(e) => {
                     const variant = product?.variants?.find((v: any) => v.size === e.target.value);
                     if (variant) setSelectedVariant(variant);
                  }}
                  className="w-full appearance-none bg-[#F8F5F0] border border-[#DFD8CC] text-[#3A332C] py-4 px-5 pr-12 rounded-sm focus:outline-none focus:border-[#C19A6B] transition-colors cursor-pointer text-base font-medium outline-none"
                >
                  {product?.variants?.map((v: any, index: number) => (
                    <option key={index} value={v.size} className="bg-white text-[#3A332C] py-2">{v.size}</option>
                  ))}
                </select>
                <svg className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-[#C19A6B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex items-center justify-between border border-[#DFD8CC] rounded-sm px-4 py-3 sm:w-1/4 bg-[#F8F5F0]">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-[#6B6054] hover:text-[#C19A6B] px-3 text-xl font-medium select-none" aria-label="Decrease quantity">-</button>
                <span className="text-[#3A332C] font-semibold text-lg select-none">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(q + 1, product.stock_quantity || 999))} className="text-[#6B6054] hover:text-[#C19A6B] px-3 text-xl font-medium select-none" aria-label="Increase quantity">+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || isInCart}
                className={`flex-1 border-2 py-4 uppercase tracking-[0.15em] text-sm font-semibold transition-colors duration-300 rounded-sm disabled:opacity-90 ${
                  isInCart 
                    ? "border-emerald-600 bg-emerald-600 text-white cursor-default" 
                    : "border-[#3A332C] bg-[#3A332C] text-[#F8F5F0] hover:bg-transparent hover:text-[#3A332C]"
                }`}
              >
                {isAddingToCart ? "Adding..." : (isInCart ? "Added To Cart ✓" : "Add To Cart")}
              </button>
            </div>

          {/* 🌟 CUSTOMIZE BUTTON UPDATE */}
          {product.is_customizable && (
            <Link 
               href={`/product/${product.id}/customize`}
                className="w-full border-2 border-[#C19A6B] text-[#C19A6B] py-4 uppercase tracking-[0.15em] text-sm font-semibold hover:bg-[#C19A6B] hover:text-white transition-colors duration-300 rounded-sm mb-6 flex items-center justify-center text-center"
                  >
                 Customise Product Yourself
            </Link>
          )}

            {/* 🌟 DELIVERY, PROCESSING, & STOCK INFO */}
            <div className="flex flex-col gap-3 text-xs text-[#8C7A63] uppercase tracking-wider pt-5 border-t border-[#DFD8CC]/70">
              
              {/* 🌟 FREE DELIVERY HIGHLIGHT */}
              {product.free_delivery && (
                <span className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 w-fit px-3 py-1.5 rounded-sm border border-emerald-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  Free Worldwide Delivery
                </span>
              )}

              {/* 🌟 PROCESSING TYPE */}
              {product.processing_type && (
                <span className="flex items-center gap-2 text-[#3A332C] font-semibold">
                  <svg className="w-4 h-4 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                  {product.processing_type}
                </span>
              )}

              {product.stock_quantity && product.stock_quantity > 0 ? (
                <span className="flex items-center gap-2"><svg className="w-4 h-4 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"/></svg> In Stock ({product.stock_quantity} units available)</span>
              ) : (
                <span className="flex items-center gap-2 text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg> Out of Stock</span>
              )}
              {product.processing_time && (
                 <span className="flex items-center gap-2"><svg className="w-4 h-4 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Dispatches in {product.processing_time}</span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#EBE5DA] mb-12"></div>

        <h4 className="text-base uppercase tracking-widest text-[#3A332C] font-semibold mb-4">Description & Details</h4>
        <p className="text-[#7A7065] text-lg leading-relaxed mb-12 whitespace-pre-line font-light">
          {product.description || "Meticulously manufactured in our Bhadohi workshop using advanced zigzag and straight-stitch techniques."}
        </p>

        {/* 🌟 FEATURES & TAGS */}
        {(Array.isArray(product.features) && product.features.length > 0) || (Array.isArray(product.tags) && product.tags.length > 0) ? (
          <div className="mb-12">
            {Array.isArray(product.features) && product.features.length > 0 && (
              <div className="mb-6">
                <h5 className="text-xs uppercase tracking-widest text-[#8C7A63] font-semibold mb-3">Key Features</h5>
                <ul className="list-disc pl-5 text-[#7A7065] space-y-2 font-light">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-[#EBE5DA] text-[#6B6054] px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-sm font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : null}
        
        <div className="space-y-6 mb-12 border-b border-[#DFD8CC]/70 pb-12 border-t pt-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
            <SpecItem label="Primary Color" value={product.color} />
            <SpecItem label="Material" value={product.material} />
            <SpecItem label="Style" value={product.style} />
            <SpecItem label="Room Context" value={product.room} />
            <SpecItem label="Pattern" value={product.pattern} />
            <SpecItem label="Shape" value={product.shape} />
            {product.is_customizable && (
               <SpecItem label="Customization" value="Requests Accepted" />
            )}
          </div>
        </div>

        <div className="space-y-8 mb-16">
          {product.care_instructions && (
            <div>
              <h5 className="text-xs uppercase tracking-widest text-[#8C7A63] font-semibold mb-3">Care Instructions</h5>
              <p className="text-base text-[#7A7065] font-light leading-relaxed whitespace-pre-line">{product.care_instructions}</p>
            </div>
          )}
          {product.return_policy && (
            <div className="mt-8">
              <h5 className="text-xs uppercase tracking-widest text-[#8C7A63] font-semibold mb-3">Return & Exchange Policy</h5>
              <p className="text-base text-[#7A7065] font-light leading-relaxed whitespace-pre-line">{product.return_policy}</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-8 bg-white border border-[#EBE5DA] shadow-sm rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-serif text-[#3A332C] mb-2">Ready to secure your piece?</h4>
            <p className="text-sm text-[#7A7065]">Checkout directly with your preferred payment method.</p>
          </div>
          <button className="w-full md:w-auto px-12 bg-[#C19A6B] text-white py-4 uppercase tracking-[0.2em] text-sm font-semibold hover:bg-[#A8855A] transition-colors duration-300 shadow-md rounded-sm">
            Buy It Now
          </button>
        </div>

      </div>

      {relatedItems.length > 0 && (
        <div className="mt-24 border-t border-[#DFD8CC]/70 pt-20 max-w-5xl mx-auto">
            <h3 className="text-3xl font-serif text-[#3A332C] mb-10 text-left px-4">You May Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                {relatedItems.map((item) => {
                    const displayImg = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : (item.image || "");
                    return (
                    <Link href={`/product/${item.id}`} key={item.id} className="flex flex-col group cursor-pointer">
                        <div className="aspect-[4/5] w-full bg-[#EBE5DA] mb-4 overflow-hidden rounded-sm shadow-sm relative">
                            {displayImg && <img src={displayImg} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />}
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] text-[#C19A6B] uppercase tracking-[0.1em] mb-1">{item.category}</span>
                            <span className="text-base text-[#3A332C] font-serif font-medium leading-tight mb-1 truncate">{item.name}</span>
                            <span className="text-sm text-[#6B6054]">{getConvertedPrice(item.price, 1)}</span>
                        </div>
                    </Link>
                )})}
            </div>
        </div>
      )}
      
      <AnimatePresence>
        {isLightboxOpen && product && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            ref={lightboxBackdropRef} data-lenis-prevent="true"
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-zoom-out overflow-hidden bg-[#3A332C]" 
            onClick={() => setIsLightboxOpen(false)} 
          >
            <img src={activeImage} alt="" className="absolute inset-0 w-full h-full object-cover blur-[8px] scale-110 opacity-100 z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-[#F8F5F0]/20 backdrop-blur-md z-0 pointer-events-none"></div>

            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-30 text-[#3A332C] select-none pointer-events-none">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-semibold opacity-80">{product.category} Collection</span>
                <span className="font-serif text-2xl font-medium drop-shadow-sm">{product.name}</span>
              </div>
              
              <div className="flex gap-4 pointer-events-auto">
                {Array.isArray(product.images) && product.images.length > 1 && (
                  <span className="text-sm font-medium bg-[#DFD8CC]/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center">
                    {getLightboxIndex() + 1} / {product.images.length}
                  </span>
                )}
                <button onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }} className="w-12 h-12 flex items-center justify-center rounded-full bg-[#DFD8CC]/80 backdrop-blur-md hover:bg-[#C19A6B] hover:text-white transition-colors shadow-lg" aria-label="Close Viewer">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="relative z-10 w-full h-full flex items-center justify-center p-12 overflow-hidden">
              <img
                ref={lightboxImageRef} src={activeImage} alt={product.name}
                className="max-w-[90%] max-h-[85vh] object-contain shadow-[0_0_80px_rgba(0,0,0,0.4)] rounded-sm select-none"
                style={{ willChange: 'transform', transformOrigin: '0 0' }} onClick={(e) => e.stopPropagation()} 
              />
              {Array.isArray(product.images) && product.images.length > 1 && (
                <>
                  <button onClick={(e) => navigateLightbox(-1, e)} className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-[#DFD8CC]/80 hover:bg-[#C19A6B] transition-all text-[#3A332C] hover:text-white group z-20 shadow-xl backdrop-blur-md">
                    <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={(e) => navigateLightbox(1, e)} className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-[#DFD8CC]/80 hover:bg-[#C19A6B] transition-all text-[#3A332C] hover:text-white group z-20 shadow-xl backdrop-blur-md">
                    <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}