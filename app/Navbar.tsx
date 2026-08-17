"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "Our Legacy", href: "/legacy" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-[#F8F5F0]/90 backdrop-blur-md border-b border-[#EBE5DA] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-9 h-9 bg-[#C19A6B] flex items-center justify-center rounded-sm">
            <span className="text-white font-serif text-sm">RZ</span>
          </div>
          <span className={`text-3xl tracking-wider text-[#3A332C] font-semibold ${playfair.className}`}>RugZora</span>
        </Link>
        
        {/* Center Navigation Links with Smooth Animated Underline */}
        <nav className="hidden lg:flex space-x-8 text-[13px] tracking-[0.15em] font-medium uppercase">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-2 transition-colors duration-300 ${
                  isActive ? "text-[#C19A6B] font-semibold" : "text-[#6B6054] hover:text-[#C19A6B]"
                }`}
              >
                {link.name}
                {/* Smooth Underline Animation */}
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-[#C19A6B] transition-all duration-300 ease-out ${
                    isActive ? "w-full opacity-100" : "w-0 opacity-0 hover:w-full hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
        
        {/* Right Icons (Search, Wishlist, Cart) */}
        <div className="flex items-center space-x-6 text-[#6B6054]">
          <button className="hover:text-[#C19A6B] transition-colors" aria-label="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <button className="hover:text-[#C19A6B] transition-colors" aria-label="Wishlist">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <button className="hover:text-[#C19A6B] transition-colors flex items-center space-x-1" aria-label="Cart">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}