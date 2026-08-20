"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase"; 

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export default function Navbar() {
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  // 🌟 Currency State (For Cart Display)
  const [globalUsdRate, setGlobalUsdRate] = useState<number>(83.50);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  // 🌟 Cart State
  const [cartItems, setCartItems] = useState<any[]>([]);

  const currencies = [
    { code: "USD", symbol: "$", label: "United States (USD)" },
    { code: "EUR", symbol: "€", label: "Europe (EUR)" },
    { code: "GBP", symbol: "£", label: "United Kingdom (GBP)" },
    { code: "CAD", symbol: "CA$", label: "Canada (CAD)" },
    { code: "AUD", symbol: "AU$", label: "Australia (AUD)" },
    { code: "INR", symbol: "₹", label: "India (INR)" },
  ];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "Our Legacy", href: "/legacy" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // 🌟 Load Cart and Currency on Mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("user_currency") || "USD";
    setSelectedCurrency(savedCurrency);

    const loadCart = () => setCartItems(JSON.parse(localStorage.getItem("rugzora_cart") || "[]"));
    loadCart();

    const fetchGlobalRate = async () => {
      const { data } = await supabase.from("store_settings").select("usd_rate").eq("id", 1).maybeSingle();
      if (data && data.usd_rate) setGlobalUsdRate(parseFloat(data.usd_rate));
    };
    fetchGlobalRate();

    // Listen for Cart & Currency updates across tabs/components
    window.addEventListener("cart_updated", loadCart);
    window.addEventListener("open_cart", () => setIsCartOpen(true));
    
    return () => {
      window.removeEventListener("cart_updated", loadCart);
      window.removeEventListener("open_cart", () => setIsCartOpen(true));
    };
  }, []);

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem("user_currency", code);
    setIsCurrencyDropdownOpen(false);
    window.dispatchEvent(new Event("currency_changed")); 
  };

  const removeFromCart = (indexToRemove: number) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("rugzora_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const getConvertedPrice = (inrPriceString: string, qty: number = 1) => {
    if (!inrPriceString) return 0;
    const numericInrPrice = parseFloat(inrPriceString.toString().replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericInrPrice)) return 0;

    const relativeRates: Record<string, number> = { USD: 1.00, EUR: 0.92, GBP: 0.79, CAD: 1.36, AUD: 1.53, INR: globalUsdRate };
    const targetRate = relativeRates[selectedCurrency] || 1;
    return (numericInrPrice / globalUsdRate) * targetRate * qty;
  };

  const formatPrice = (value: number) => {
    const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", CAD: "CA$", AUD: "AU$", INR: "₹" };
    return `${symbols[selectedCurrency] || "$"}${value.toFixed(2)}`;
  };

  const cartSubtotal = cartItems.reduce((total, item) => total + getConvertedPrice(item.price, item.quantity), 0);

  // Search Logic
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 1) { setSearchResults([]); return; }
      setIsSearching(true);
      const { data, error } = await supabase.from("products").select("id, name, category, price, images").ilike("name", `%${searchQuery}%`).limit(5); 
      if (!error && data) setSearchResults(data);
      setIsSearching(false);
    };
    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) { setIsSearchOpen(false); }
    };
    if (isSearchOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isCartOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isCartOpen]);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  return (
    <>
      <header ref={headerRef} className="w-full bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#EBE5DA] sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between relative bg-transparent z-20">
          
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <Image src="/logo.png" alt="RugZora Logo" width={40} height={40} className="object-contain rounded-sm" />
            <span className={`text-2xl md:text-3xl tracking-wider text-[#3A332C] font-semibold ${playfair.className}`}>RugZora</span>
          </Link>
          
          <nav className="hidden lg:flex space-x-8 text-[12px] tracking-[0.15em] font-medium uppercase">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} className={`relative py-2 transition-colors duration-300 ${isActive ? "text-[#C19A6B] font-semibold" : "text-[#6B6054] hover:text-[#C19A6B]"}`}>
                  {link.name}
                  <span className={`absolute left-0 bottom-0 h-[2px] bg-[#C19A6B] transition-all duration-300 ease-out ${isActive ? "w-full opacity-100" : "w-0 opacity-0 hover:w-full hover:opacity-100"}`} />
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-6 text-[#6B6054]">
            
            {/* CURRENCY SWITCHER */}
            <div className="relative">
              <button onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)} className="flex items-center space-x-1 text-sm font-semibold hover:text-[#C19A6B] transition-colors">
                <span>{selectedCurrency}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              <AnimatePresence>
                {isCurrencyDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-48 bg-white border border-[#DFD8CC] shadow-xl rounded-sm overflow-hidden z-50">
                    {currencies.map((currency) => (
                      <button key={currency.code} onClick={() => handleCurrencyChange(currency.code)} className={`w-full text-left px-4 py-3 text-xs tracking-wider uppercase hover:bg-[#F8F5F0] transition-colors ${selectedCurrency === currency.code ? "text-[#C19A6B] font-bold bg-[#F8F5F0]" : "text-[#3A332C]"}`}>
                        {currency.symbol} - {currency.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => { setIsSearchOpen(!isSearchOpen); if (isSearchOpen) setSearchQuery(""); }} className={`${isSearchOpen ? "text-[#C19A6B]" : "hover:text-[#C19A6B]"} transition-colors`} >
              {isSearchOpen ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            </button>
            
            <Link href="/wishlist" className="hover:text-[#C19A6B] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </Link>

            {/* CART BUTTON */}
            <button onClick={() => setIsCartOpen(true)} className="hover:text-[#C19A6B] transition-colors flex items-center space-x-1 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C19A6B] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* INLINE LIVE SEARCH DROPDOWN */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="absolute top-full left-0 w-full bg-[#F8F5F0] border-b border-[#DFD8CC] shadow-xl overflow-hidden z-10">
              <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="relative">
                  <input type="text" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for carpets, colors, styles..." className="w-full bg-transparent border-b-2 border-[#3A332C] text-2xl md:text-3xl font-serif text-[#3A332C] placeholder-[#8C7A63]/50 focus:outline-none pb-3" />
                  {isSearching && <div className="absolute right-2 bottom-4 w-5 h-5 border-2 border-[#C19A6B] border-t-transparent rounded-full animate-spin"></div>}
                </div>

                <div className="mt-6">
                  {searchQuery.length < 1 ? (
                    <div className="flex items-center gap-4 text-sm text-[#8C7A63]">
                      <span className="font-semibold uppercase tracking-widest text-[10px]">Popular:</span>
                      <span className="hover:text-[#C19A6B] cursor-pointer" onClick={() => setSearchQuery("Jute")}>Jute</span>
                      <span className="hover:text-[#C19A6B] cursor-pointer" onClick={() => setSearchQuery("Cut-Pile")}>Cut-Pile</span>
                      <span className="hover:text-[#C19A6B] cursor-pointer" onClick={() => setSearchQuery("Minimalist")}>Minimalist</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                      {searchResults.map((item) => (
                        <Link key={item.id} href={`/product/${item.id}`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-4 p-3 hover:bg-[#EBE5DA] rounded-sm transition-colors">
                          <div className="w-16 h-16 bg-[#DFD8CC] rounded-sm overflow-hidden flex-shrink-0"><img src={item.images?.[0] || ""} alt={item.name} className="w-full h-full object-cover" /></div>
                          <div className="flex flex-col"><span className="text-[10px] text-[#C19A6B] uppercase tracking-widest">{item.category}</span><span className="text-lg font-serif text-[#3A332C]">{item.name}</span></div>
                          <div className="ml-auto text-[#6B6054] font-medium">{formatPrice(getConvertedPrice(item.price, 1))}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    !isSearching && <div className="text-[#8C7A63] py-4">No results found for "{searchQuery}".</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 🌟 CART DRAWER (Slide out from Right) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />
            
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F8F5F0] shadow-2xl z-[101] flex flex-col border-l border-[#DFD8CC]">
              
              <div className="px-6 py-5 border-b border-[#DFD8CC] flex justify-between items-center bg-white">
                <h2 className="text-xl font-serif text-[#3A332C]">Your Cart <span className="text-[#8C7A63] text-sm font-sans">({cartItems.length})</span></h2>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EBE5DA] text-[#3A332C] hover:bg-[#C19A6B] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="w-20 h-20 bg-[#EBE5DA] rounded-full flex items-center justify-center text-[#C19A6B] mb-6">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <h3 className="text-lg font-medium text-[#3A332C] mb-2">Your cart is empty</h3>
                    <p className="text-sm text-[#7A7065] mb-8">Looks like you haven't added any premium carpets to your cart yet.</p>
                    <button onClick={() => setIsCartOpen(false)} className="bg-[#C19A6B] text-white px-8 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-[#3A332C] transition-colors rounded-sm shadow-md">Explore Collections</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 bg-white p-4 rounded-sm border border-[#EBE5DA] relative">
                        <button onClick={() => removeFromCart(idx)} className="absolute top-2 right-2 text-[#8C7A63] hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="w-20 h-20 bg-[#F8F5F0] rounded-sm overflow-hidden shrink-0">
                          {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="text-[10px] text-[#C19A6B] uppercase tracking-[0.1em]">{item.category}</span>
                          <span className="text-base text-[#3A332C] font-serif font-medium leading-tight my-1">{item.name}</span>
                          <span className="text-xs text-[#7A7065] mb-2">Size: {item.size}</span>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm text-[#8C7A63]">Qty: {item.quantity}</span>
                            <span className="text-sm font-semibold text-[#3A332C]">{formatPrice(getConvertedPrice(item.price, item.quantity))}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-white border-t border-[#DFD8CC]">
                <div className="flex justify-between mb-4 text-[#3A332C] font-semibold text-lg">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                <p className="text-xs text-[#8C7A63] mb-4 text-center">Shipping & taxes calculated at checkout</p>
                <button disabled={cartItems.length === 0} className="w-full bg-[#3A332C] text-[#F8F5F0] py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#C19A6B] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  Checkout Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}