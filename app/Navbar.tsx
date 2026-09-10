"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase"; 
import { useCurrency } from "../context/CurrencyContext";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // 🌟 User Auth State
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🌟 Global Currency Context
  const { currency: selectedCurrency, setCurrency, formatPrice } = useCurrency();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
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

  // 🌟 Load Cart on Mount and Setup Listeners
  useEffect(() => {
    const loadCart = () => setCartItems(JSON.parse(localStorage.getItem("rugzora_cart") || "[]"));
    loadCart();

    window.addEventListener("cart_updated", loadCart);
    window.addEventListener("open_cart", () => setIsCartOpen(true));
    
    return () => {
      window.removeEventListener("cart_updated", loadCart);
      window.removeEventListener("open_cart", () => setIsCartOpen(true));
    };
  }, []);

  const handleCurrencyChange = (code: string) => {
    setCurrency(code);
    setIsCurrencyDropdownOpen(false);
  };

  const removeFromCart = (indexToRemove: number) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("rugzora_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const cartSubtotalINR = cartItems.reduce((total, item) => {
    const numericInr = parseFloat((item.price || "0").toString().replace(/[^0-9.]/g, ""));
    return total + (isNaN(numericInr) ? 0 : numericInr * (item.quantity || 1));
  }, 0);

  // Search Logic
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 1) { 
        setSearchResults([]); 
        return; 
      }
      setIsSearching(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, price, images")
        .ilike("name", `%${searchQuery}%`)
        .limit(5); 
        
      if (!error && data) setSearchResults(data);
      setIsSearching(false);
    };
    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) { 
        setIsSearchOpen(false); 
      }
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
    setIsMobileMenuOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery("");
        }
        if (isCartOpen) setIsCartOpen(false);
        if (isCurrencyDropdownOpen) setIsCurrencyDropdownOpen(false);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, isCartOpen, isCurrencyDropdownOpen, isMobileMenuOpen]);

  // 🌟 Global Mobile Swipe Gesture: Left-to-Right swipe opens sidebar on any page
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length !== 1) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchDuration = Date.now() - touchStartTime;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Only on mobile/tablet screens
      if (typeof window !== "undefined" && window.innerWidth >= 1024) return;

      // Only handle swipes that complete within 700ms
      if (touchDuration > 700) return;

      // Horizontal gesture check (deltaX must exceed deltaY)
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
      if (!isHorizontal) return;

      // 1. Swipe Left-to-Right: Open sidebar if swipe started on left side of screen
      if (deltaX > 40 && touchStartX < window.innerWidth * 0.65) {
        setIsMobileMenuOpen(true);
      }

      // 2. Swipe Right-to-Left: Close sidebar if already open
      if (deltaX < -40) {
        setIsMobileMenuOpen((open) => (open ? false : open));
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <>
      <header ref={headerRef} className="w-full bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#EBE5DA] sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between relative bg-transparent z-20">
          
          <button
            type="button"
            onClick={(e) => {
              if (typeof window !== "undefined" && window.innerWidth < 1024) {
                e.preventDefault();
                setIsMobileMenuOpen((prev) => !prev);
              } else {
                router.push("/");
              }
            }}
            className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer shrink-0 text-left focus:outline-none select-none"
            aria-label="RugZora Logo - Tap to open menu on mobile"
            title="RugZora"
          >
            <Image
              src="/logo.png"
              alt="RugZora Logo"
              width={36}
              height={36}
              priority
              className="object-contain rounded-sm sm:w-10 sm:h-10 transition-transform active:scale-95 duration-150"
            />
            <span className={`text-xl sm:text-2xl md:text-3xl tracking-wider text-[#3A332C] font-semibold ${playfair.className}`}>
              RugZora
            </span>
          </button>
          
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
          
          <div className="flex items-center space-x-2.5 sm:space-x-4 md:space-x-6 text-[#6B6054]">

            {/* ADMIN BUTTON (Desktop/Tablet) */}
            <div className="hidden sm:flex items-center gap-2 mr-1">
              <Link
                href="/admin"
                className="px-2.5 py-1 text-[11px] uppercase tracking-widest font-semibold text-[#3A332C] border border-[#DFD8CC] hover:border-[#C19A6B] hover:text-[#C19A6B] rounded-sm transition-colors"
              >
                Admin
              </Link>
            </div>
            
            {/* CURRENCY SWITCHER (Desktop/Tablet) */}
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)} 
                className="flex items-center space-x-1 text-sm font-semibold hover:text-[#C19A6B] transition-colors"
              >
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

            <button 
              onClick={() => { setIsSearchOpen(!isSearchOpen); if (isSearchOpen) setSearchQuery(""); }} 
              className={`${isSearchOpen ? "text-[#C19A6B]" : "hover:text-[#C19A6B]"} transition-colors p-1`}
              aria-label="Search"
            >
              {isSearchOpen ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            </button>
            
            {/* USER ACCOUNT BUTTON */}
            <Link
              href={user ? "/account" : "/login"}
              className="hover:text-[#C19A6B] transition-colors relative flex items-center p-1"
              aria-label={user ? "My Account" : "Sign In / Register"}
              title={user ? "My Account" : "Sign In / Register"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              {user && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#C19A6B] rounded-full ring-2 ring-[#F8F5F0]" />
              )}
            </Link>

            <Link href="/wishlist" className="hover:text-[#C19A6B] transition-colors p-1" aria-label="View Wishlist">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </Link>

            {/* CART BUTTON */}
            <button onClick={() => setIsCartOpen(true)} className="hover:text-[#C19A6B] transition-colors flex items-center space-x-1 relative p-1" aria-label="Open Shopping Bag">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C19A6B] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
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
                  <input 
                    type="text" 
                    autoFocus 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search for carpets, colors, styles..." 
                    aria-label="Search for carpets, colors, styles"
                    className="w-full bg-transparent border-b-2 border-[#3A332C] text-2xl md:text-3xl font-serif text-[#3A332C] placeholder-[#8C7A63]/50 focus:outline-none pb-3" 
                  />
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
                          <div className="w-16 h-16 bg-[#DFD8CC] rounded-sm overflow-hidden flex-shrink-0 relative">
                            {item.images?.[0] && (
                              <Image src={item.images[0]} alt={item.name} fill sizes="64px" className="object-cover" />
                            )}
                          </div>
                          <div className="flex flex-col"><span className="text-[10px] text-[#C19A6B] uppercase tracking-widest">{item.category}</span><span className="text-lg font-serif text-[#3A332C]">{item.name}</span></div>
                          <div className="ml-auto text-[#6B6054] font-medium">{formatPrice(item.price, 1)}</div>
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

      {/* 🌟 MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-[#F8F5F0] z-[121] shadow-2xl flex flex-col border-r border-[#DFD8CC] lg:hidden"
            >
              {/* Mobile Drawer Header */}
              <div className="p-6 border-b border-[#DFD8CC] flex items-center justify-between bg-white">
                <div className="flex items-center space-x-3">
                  <Image src="/logo.png" alt="RugZora Logo" width={32} height={32} className="object-contain rounded-sm" />
                  <span className={`text-xl font-serif font-semibold text-[#3A332C] ${playfair.className}`}>RugZora</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#EBE5DA] flex items-center justify-center text-[#3A332C] hover:bg-[#C19A6B] hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Drawer Links */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7A63] font-bold block">
                    Explore Atelier
                  </span>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-lg font-serif transition-colors py-1 ${
                        pathname === link.href ? "text-[#C19A6B] font-bold" : "text-[#3A332C] hover:text-[#C19A6B]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/customize"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-serif text-[#C19A6B] font-semibold py-1"
                  >
                    Bespoke Customizer Studio ★
                  </Link>
                </div>

                <div className="pt-6 border-t border-[#DFD8CC] space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7A63] font-bold block">
                    Account & Orders
                  </span>
                  {user ? (
                    <div className="space-y-3">
                      <Link
                        href="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-sm text-[#3A332C] font-semibold py-1"
                      >
                        <span>Patron Profile & Order History</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-sm text-[#7A7065] hover:text-[#3A332C] py-1"
                      >
                        <span>Saved Wishlist ({cartItems.length > 0 ? "Saved" : "0"})</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-center py-3 text-xs uppercase tracking-widest font-bold bg-[#3A332C] text-white rounded-sm"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-center py-3 text-xs uppercase tracking-widest font-bold border border-[#3A332C] text-[#3A332C] rounded-sm"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>

                {/* Currency in Mobile Menu */}
                <div className="pt-6 border-t border-[#DFD8CC]">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7A63] font-bold block mb-2.5">
                    Currency: {selectedCurrency}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          handleCurrencyChange(c.code);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`py-2 px-1 text-xs uppercase font-bold border rounded-sm transition-colors ${
                          selectedCurrency === c.code
                            ? "border-[#C19A6B] bg-[#C19A6B] text-white"
                            : "border-[#DFD8CC] bg-white text-[#3A332C]"
                        }`}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Shortcut in Mobile */}
                <div className="pt-4 border-t border-[#DFD8CC]">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-2.5 text-[11px] uppercase tracking-widest text-[#8C7A63] border border-[#DFD8CC] rounded-sm hover:border-[#C19A6B]"
                  >
                    Admin Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🌟 CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />
            
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F8F5F0] shadow-2xl z-[101] flex flex-col border-l border-[#DFD8CC]">
              
              <div className="px-6 py-5 border-b border-[#DFD8CC] flex justify-between items-center bg-white">
                <h2 className="text-xl font-serif text-[#3A332C]">Your Cart <span className="text-[#8C7A63] text-sm font-sans">({cartItems.length})</span></h2>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EBE5DA] text-[#3A332C] hover:bg-[#C19A6B] hover:text-white transition-colors" aria-label="Close Cart">
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
                        <button onClick={() => removeFromCart(idx)} className="absolute top-2 right-2 text-[#8C7A63] hover:text-red-500 transition-colors" aria-label="Remove item">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="w-20 h-20 bg-[#FAF8F5] rounded-sm overflow-hidden shrink-0 relative border border-[#EBE5DA] p-1 flex items-center justify-center">
                          {item.image && (
                            item.image.startsWith("data:") ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain drop-shadow-xs"
                              />
                            ) : (
                              <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                            )
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          {item.isCustom ? (
                            <span className="bg-[#C19A6B] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-xs self-start mb-1 shadow-2xs">
                              CUSTOM ORDER
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#C19A6B] uppercase tracking-[0.1em]">{item.category}</span>
                          )}
                          <span className="text-sm text-[#3A332C] font-serif font-medium leading-tight mb-1 truncate">{item.name}</span>
                          <span className="text-xs text-[#7A7065] font-medium leading-snug">Size: {item.size}</span>
                          {item.isCustom && item.customDetails && (
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#8C7A63]">
                              <span>Fibers:</span>
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: item.customDetails.brownFiberColor }} title="1st (Brown) Fiber" />
                                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: item.customDetails.whiteFiberColor }} title="2nd (White) Fiber" />
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-auto pt-1.5">
                            <span className="text-xs text-[#8C7A63]">Qty: {item.quantity}</span>
                            <span className="text-sm font-semibold text-[#3A332C]">{formatPrice(item.price, item.quantity)}</span>
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
                  <span>{formatPrice(cartSubtotalINR)}</span>
                </div>
                <p className="text-xs text-[#8C7A63] mb-4 text-center">Shipping & taxes calculated at checkout</p>
                <button
                  disabled={cartItems.length === 0}
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/checkout");
                  }}
                  className="w-full bg-[#3A332C] text-[#F8F5F0] py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#C19A6B] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
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