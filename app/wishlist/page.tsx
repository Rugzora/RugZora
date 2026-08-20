"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [globalUsdRate, setGlobalUsdRate] = useState<number>(83.50);
  const [userCurrency, setUserCurrency] = useState("USD");

  // 🌟 Undo States
  const [fadingOutIds, setFadingOutIds] = useState<string[]>([]);
  const [undoToast, setUndoToast] = useState<{ show: boolean; item: any; timeoutId?: NodeJS.Timeout | null }>({ show: false, item: null, timeoutId: null });

  useEffect(() => {
    const loadWishlist = () => setWishlistItems(JSON.parse(localStorage.getItem("rugzora_wishlist") || "[]"));
    loadWishlist();

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

  // 🌟 Handle Removal Request (Starts the fade & shows Undo)
  const handleRemoveRequest = (item: any) => {
    setFadingOutIds(prev => [...prev, item.id]);

    if (undoToast.timeoutId) clearTimeout(undoToast.timeoutId);

    const timer = setTimeout(() => {
      actuallyRemove(item.id);
      setUndoToast({ show: false, item: null, timeoutId: null });
    }, 5000); // 5 seconds to undo

    setUndoToast({ show: true, item: item, timeoutId: timer });
  };

  // 🌟 Execute Real Deletion
  const actuallyRemove = (idToRemove: string) => {
    setWishlistItems(prev => {
      const updated = prev.filter(item => item.id !== idToRemove);
      localStorage.setItem("rugzora_wishlist", JSON.stringify(updated));
      return updated;
    });
    setFadingOutIds(prev => prev.filter(id => id !== idToRemove));
  };

  // 🌟 Handle Undo Click
  const handleUndo = () => {
    if (undoToast.timeoutId) clearTimeout(undoToast.timeoutId);
    setFadingOutIds(prev => prev.filter(id => id !== undoToast.item?.id));
    setUndoToast({ show: false, item: null, timeoutId: null });
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (undoToast.timeoutId) clearTimeout(undoToast.timeoutId);
    };
  }, [undoToast.timeoutId]);

  const getConvertedPrice = (inrPrice: string | number) => {
    if (!inrPrice) return "Price on Request";
    const numericInrPrice = parseFloat(inrPrice.toString().replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericInrPrice) || numericInrPrice === 0) return "Price on Request";

    const relativeRates: Record<string, number> = { USD: 1.00, EUR: 0.92, GBP: 0.79, CAD: 1.36, AUD: 1.53, INR: globalUsdRate };
    const targetRate = relativeRates[userCurrency] || 1;
    const convertedPrice = (numericInrPrice / globalUsdRate) * targetRate;
    const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", CAD: "CA$", AUD: "AU$", INR: "₹" };
    
    return `${symbols[userCurrency] || "$"}${convertedPrice.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] pt-40 pb-20 px-6 font-sans relative">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-16 border-b border-[#DFD8CC] pb-6 flex items-end justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3A332C]">Your Wishlist</h1>
            <p className="text-[#7A7065] mt-4">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-24 h-24 bg-[#EBE5DA] rounded-full flex items-center justify-center text-[#C19A6B] mb-8">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-[#3A332C] mb-4">No Saved Items</h2>
            <p className="text-[#6B6054] max-w-md mx-auto mb-10">You haven't saved any items to your wishlist yet. Explore our collections and save your favorite carpets here.</p>
            <Link href="/collections" className="bg-[#C19A6B] text-white px-10 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-[#3A332C] transition-colors rounded-sm shadow-md">
              Discover Carpets
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className={`flex flex-col group relative transition-opacity ease-linear ${
                  fadingOutIds.includes(item.id) ? "opacity-0 duration-[3000ms] pointer-events-none" : "opacity-100 duration-300"
                }`}
              >
                <Link href={`/product/${item.id}`} className="aspect-[4/5] w-full bg-[#EBE5DA] mb-4 overflow-hidden rounded-sm shadow-sm relative block">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />}
                </Link>
                
                <button 
                  onClick={(e) => { e.preventDefault(); handleRemoveRequest(item); }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:scale-110 transition-all shadow-sm z-10"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>

                <Link href={`/product/${item.id}`} className="flex flex-col text-center mt-2 cursor-pointer">
                  <span className="text-[10px] text-[#C19A6B] uppercase tracking-[0.1em] mb-1">{item.category}</span>
                  <span className="text-lg text-[#3A332C] font-serif font-medium leading-tight mb-1 truncate">{item.name}</span>
                  <span className="text-sm text-[#6B6054]">{getConvertedPrice(item.price)}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌟 UNDO TOAST NOTIFICATION */}
      <AnimatePresence>
        {undoToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#3A332C] text-white px-6 py-4 rounded-sm shadow-2xl flex items-center gap-6 z-[100]"
          >
            <span className="text-sm font-medium tracking-wide">Item removed from wishlist.</span>
            <button
              onClick={handleUndo}
              className="text-[#C19A6B] font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}