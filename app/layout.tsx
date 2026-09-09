import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import SmoothScroll from "./SmoothScroll";
import ScrollToTop from "./components/ScrollToTop";
import { CurrencyProvider } from "../context/CurrencyContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://rugzora.com"),
  title: {
    default: "RugZora | Masterpiece Carpets & Handcrafted Rugs",
    template: "%s | RugZora",
  },
  description: "Where Tradition Meets Tomorrow. Handcrafted chunky braided rugs woven from sustainable recycled PET fibers directly from the Carpet City of Bhadohi.",
  keywords: [
    "RugZora",
    "handmade rugs",
    "braided carpets",
    "Bhadohi rugs",
    "sustainable carpets",
    "rPET rugs",
    "eco-friendly floor coverings",
    "reversible area rugs",
    "custom runners",
  ],
  authors: [{ name: "RugZora" }],
  creator: "RugZora",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rugzora.com",
    siteName: "RugZora",
    title: "RugZora | Masterpiece Carpets & Handcrafted Rugs",
    description: "Where Tradition Meets Tomorrow. Handcrafted chunky braided rugs woven from sustainable recycled PET fibers.",
    images: [
      {
        url: "/logo.png",
        width: 160,
        height: 160,
        alt: "RugZora Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "RugZora | Masterpiece Carpets",
    description: "Handcrafted sustainable chunky braided rugs from Bhadohi, India.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://rugzora.com/#organization",
      name: "RugZora",
      url: "https://rugzora.com",
      logo: "https://rugzora.com/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        areaServed: "Worldwide",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://rugzora.com/#website",
      url: "https://rugzora.com",
      name: "RugZora",
      publisher: {
        "@id": "https://rugzora.com/#organization",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://qjpjltaiazwybhsmnkve.supabase.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://qjpjltaiazwybhsmnkve.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body 
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col bg-[#F8F5F0] text-[#3A332C] selection:bg-[#C19A6B] selection:text-white`}
      >
        <CurrencyProvider>
          <SmoothScroll>
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow">{children}</main>

            <footer className="bg-[#EBE5DA] pt-20 pb-10 border-t border-[#DFD8CC]">
              <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
                <div>
                  <h4 className={`text-3xl mb-4 text-[#3A332C] ${playfair.className}`}>RugZora</h4>
                  <p className="text-sm text-[#7A7065] leading-relaxed max-w-xs mx-auto md:mx-0">
                    Bringing the golden touch of Bhadohi's craftsmanship directly to your modern living spaces.
                  </p>
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
        </CurrencyProvider>
      </body>
    </html>
  );
}