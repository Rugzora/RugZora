import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import SmoothScroll from "./SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "RugZora | Masterpiece Carpets",
  description: "Where Tradition Meets Tomorrow.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col bg-[#F8F5F0] text-[#3A332C] selection:bg-[#C19A6B] selection:text-white`}
      >
        {/* SmoothScroll component poori website ko wrap kar raha hai */}
        <SmoothScroll>
          
          {/* Yahan aapka Navbar.tsx jud raha hai */}
          <Navbar />

          <main className="flex-grow">{children}</main>

          <footer className="bg-[#EBE5DA] pt-20 pb-10 border-t border-[#DFD8CC]">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
              <div>
                <h4 className={`text-3xl mb-4 text-[#3A332C] ${playfair.className}`}>RugZora</h4>
                <p className="text-sm text-[#7A7065] leading-relaxed max-w-xs mx-auto md:mx-0">Bringing the golden touch of Bhadohi's craftsmanship directly to your modern living spaces.</p>
              </div>
              <div className="flex flex-col space-y-3 text-sm text-[#7A7065]">
                 <span className="text-[#3A332C] font-semibold tracking-widest uppercase mb-2 text-xs">Explore</span>
                 <a href="/collections" className="hover:text-[#C19A6B] transition">Jute Collections</a>
                 <a href="/collections" className="hover:text-[#C19A6B] transition">Cut-Pile Comfort</a>
                 <a href="/contact" className="hover:text-[#C19A6B] transition">Bespoke Orders</a>
              </div>
              <div className="flex flex-col space-y-3 text-sm text-[#7A7065]">
                 <span className="text-[#3A332C] font-semibold tracking-widest uppercase mb-2 text-xs">Support</span>
                 <a href="/contact" className="hover:text-[#C19A6B] transition">Contact Us</a>
                 <a href="#" className="hover:text-[#C19A6B] transition">Care Guide</a>
                 <a href="#" className="hover:text-[#C19A6B] transition">Shipping Information</a>
              </div>
            </div>
            <div className="text-center text-xs text-[#8C8276] font-medium tracking-wide">
              © 2026 RUGZORA. CRAFTED WITH CARE IN INDIA.
            </div>
          </footer>

        </SmoothScroll>
      </body>
    </html>
  );
}