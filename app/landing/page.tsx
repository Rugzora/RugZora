"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getAllLandingPages } from "@/lib/landingPagesData";

export default function LandingPagesIndex() {
  const landingPages = getAllLandingPages();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2724] pt-24 pb-24 sm:pt-28 sm:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 text-center mb-12 sm:mb-16">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#7C6347] bg-[#EAE3D8] border border-[#D5C7B5] px-3 py-1 rounded-full inline-block mb-3">
          Curated Campaigns & Stories
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1E1B18] tracking-tight mb-3">
          Special Editions & Architectural Spotlights
        </h1>
        <p className="text-xs sm:text-base text-[#6C635B] font-light max-w-xl mx-auto">
          Explore specialized landing pages dedicated to Japandi decor, sustainable material innovation, and bespoke trade projects.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {landingPages.map((page, idx) => (
          <motion.div
            key={page.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="group bg-[#F5EFE6] rounded-2xl border border-[#E3D9CC] overflow-hidden flex flex-col justify-between hover:border-[#B58A60] hover:shadow-xl transition-all duration-300"
          >
            <div>
              <div className="relative h-56 w-full overflow-hidden bg-[#EAE3D8]">
                <Image
                  src={page.heroImage}
                  alt={page.headline}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#1E1B18]/85 backdrop-blur-sm text-white font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {page.badge}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl text-[#1E1B18] group-hover:text-[#9E744E] transition-colors leading-snug mb-2">
                  {page.headline} {page.highlightedText}
                </h3>
                <p className="text-xs text-[#6C635B] font-light line-clamp-3 leading-relaxed mb-4">
                  {page.subheadline}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-[#EAE3D8]">
              <Link
                href={`/landing/${page.slug}`}
                className="block w-full text-center bg-[#1E1B18] hover:bg-[#9E744E] text-white py-3 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
              >
                View Campaign Page →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
