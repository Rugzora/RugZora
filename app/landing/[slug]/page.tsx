"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getLandingPageBySlug, getAllLandingPages, LandingPageConfig } from "@/lib/landingPagesData";

export default function DynamicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const page = getLandingPageBySlug(resolvedParams.slug);

  if (!page) {
    notFound();
  }

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2724] pt-20 sm:pt-24 pb-20">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[#E6DED3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Copy Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE3D8] border border-[#D5C7B5] text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#7C6347] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B58A60] animate-pulse" />
                {page.badge}
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1E1B18] tracking-tight leading-[1.12] mb-4">
                {page.headline}{" "}
                <span className="text-[#9E744E] italic block sm:inline">
                  {page.highlightedText}
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base lg:text-lg text-[#6C635B] font-light max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                {page.subheadline}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 mb-10">
                <Link
                  href={page.heroCtaLink}
                  className="bg-[#1E1B18] text-[#FAF8F5] hover:bg-[#38332E] px-7 py-4 rounded-full text-xs font-mono uppercase tracking-wider font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {page.heroCtaText} →
                </Link>

                {page.secondaryCtaText && (
                  <Link
                    href={page.secondaryCtaLink || "/collections"}
                    className="bg-[#F5EFE6] text-[#1E1B18] border border-[#D5C7B5] hover:bg-[#EBE2D4] px-6 py-4 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-300"
                  >
                    {page.secondaryCtaText}
                  </Link>
                )}
              </div>

              {/* Trust Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#E6DED3]">
                {page.trustMetrics.map((metric, mIdx) => (
                  <div key={mIdx} className="text-center lg:text-left">
                    <p className="font-serif text-lg sm:text-xl font-bold text-[#1E1B18]">
                      {metric.value}
                    </p>
                    <p className="text-[11px] font-mono text-[#8C7A6B] uppercase tracking-wider leading-tight">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Hero Visual Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative h-[360px] sm:h-[460px] lg:h-[520px] w-full rounded-3xl overflow-hidden border border-[#E3D9CC] shadow-2xl">
                <Image
                  src={page.heroImage}
                  alt={page.headline}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B18]/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D5C7B5] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                    Atelier Spotlight
                  </span>
                  <p className="font-serif text-lg sm:text-xl mt-2 font-medium">
                    Hand-Braided in Bhadohi, India
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 2. VALUE PROPOSITIONS / FEATURES */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#9E744E] font-semibold">
            Distinctive Architecture
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#1E1B18] mt-2 mb-3">
            {page.featuresSectionTitle}
          </h2>
          <p className="text-xs sm:text-base text-[#6C635B] font-light">
            {page.featuresSectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {page.features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#F5EFE6] rounded-2xl p-6 sm:p-7 border border-[#E3D9CC] hover:border-[#B58A60] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {feat.badge && (
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#7C6347] bg-[#EAE3D8] px-2.5 py-1 rounded-md mb-4 font-semibold">
                    {feat.badge}
                  </span>
                )}
                <h3 className="font-serif text-lg text-[#1E1B18] mb-2 font-medium">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6C635B] font-light leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🌟 3. PRODUCT SHOWCASE / SILHOUETTES */}
      {page.products && page.products.length > 0 && (
        <section className="py-16 sm:py-24 bg-[#F3EDE3] border-y border-[#E3D9CC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#9E744E] font-semibold">
                Curated Collection
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#1E1B18] mt-2 mb-3">
                {page.showcaseSectionTitle || "Featured Silhouettes"}
              </h2>
              <p className="text-xs sm:text-base text-[#6C635B] font-light">
                {page.showcaseSectionSubtitle || "Explore hand-braided rugs tailored for your floor layout."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {page.products.map((prod, pIdx) => (
                <div
                  key={pIdx}
                  className="group bg-[#FAF8F5] rounded-2xl border border-[#E0D5C5] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-64 w-full overflow-hidden bg-[#EAE3D8]">
                      <Image
                        src={prod.image}
                        alt={prod.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#1E1B18]/85 backdrop-blur-sm text-white font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {prod.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <h3 className="font-serif text-lg text-[#1E1B18] group-hover:text-[#9E744E] transition-colors mb-1.5">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-[#6C635B] font-light leading-relaxed mb-4">
                        {prod.desc}
                      </p>
                      {prod.priceEstimate && (
                        <p className="text-xs font-mono text-[#7C6347] font-semibold">
                          {prod.priceEstimate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#EAE3D8]">
                    <Link
                      href={prod.link}
                      className="block w-full text-center bg-[#1E1B18] hover:bg-[#9E744E] text-white py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
                    >
                      View & Customize →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🌟 4. DIRECT COMPARISON TABLE */}
      {page.comparison && page.comparison.length > 0 && (
        <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#9E744E] font-semibold">
              The Engineering Difference
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1B18] mt-2 mb-2">
              {page.comparisonTitle || "Why RugZora Stands Apart"}
            </h2>
            <p className="text-xs sm:text-sm text-[#6C635B] font-light">
              {page.comparisonSubtitle || "Compare hand-braided reversible rugs against mass-market alternatives."}
            </p>
          </div>

          <div className="bg-[#F5EFE6] rounded-2xl border border-[#E3D9CC] overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-[#1E1B18] text-[#FAF8F5] p-4 text-xs font-mono uppercase tracking-wider">
              <div className="col-span-4 font-semibold">Feature Metric</div>
              <div className="col-span-4 text-[#D5C7B5] font-semibold">RugZora Atelier</div>
              <div className="col-span-4 text-[#A09384]">Standard Tufted Rugs</div>
            </div>

            <div className="divide-y divide-[#E3D9CC]">
              {page.comparison.map((row, rIdx) => (
                <div
                  key={rIdx}
                  className={`grid grid-cols-12 p-4 text-xs sm:text-sm ${
                    rIdx % 2 === 0 ? "bg-[#FAF7F2]" : "bg-[#F5EFE6]"
                  }`}
                >
                  <div className="col-span-4 font-medium text-[#1E1B18]">{row.feature}</div>
                  <div className="col-span-4 text-[#7C6347] font-semibold flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span>
                    <span>{row.rugzora}</span>
                  </div>
                  <div className="col-span-4 text-[#8C7A6B] flex items-center gap-1.5">
                    <span className="text-rose-500">✗</span>
                    <span>{row.others}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🌟 5. TESTIMONIALS */}
      {page.testimonials && page.testimonials.length > 0 && (
        <section className="py-16 sm:py-20 bg-[#EFE8DD] border-t border-[#E0D5C5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7C6347] font-semibold">
              Verified Design Feedback
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1B18] mt-2 mb-10">
              {page.testimonialsTitle || "Client & Architect Reviews"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {page.testimonials.map((testi, tIdx) => (
                <div
                  key={tIdx}
                  className="bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#DCD0C0] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="text-amber-500 text-sm mb-3">
                      {"★".repeat(testi.rating)}
                    </div>
                    <p className="font-serif text-sm sm:text-base text-[#3D3732] italic leading-relaxed mb-6">
                      “{testi.comment}”
                    </p>
                  </div>

                  <div className="border-t border-[#EAE3D8] pt-3">
                    <p className="text-xs font-semibold text-[#1E1B18]">{testi.name}</p>
                    <p className="text-[11px] text-[#8C7A6B]">
                      {testi.role} • {testi.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🌟 6. FAQS ACCORDION */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="py-16 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#9E744E] font-semibold">
              Got Questions?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1B18] mt-2">
              {page.faqTitle || "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="space-y-3">
            {page.faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="bg-[#F5EFE6] border border-[#E3D9CC] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-medium text-[#1E1B18]"
                >
                  <span>{faq.question}</span>
                  <span className="font-mono text-base text-[#9E744E]">
                    {openFaq === fIdx ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {openFaq === fIdx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#6C635B] font-light leading-relaxed border-t border-[#EAE3D8] pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🌟 7. BOTTOM CTA HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-10">
        <div className="bg-[#1E1B18] text-[#FAF8F5] rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B58A60_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D5C7B5] px-3 py-1 rounded-full border border-[#D5C7B5]/30 inline-block mb-3">
              Direct from Bhadohi Atelier
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#FAF8F5] mb-4">
              {page.bottomCta.title}
            </h3>
            <p className="text-xs sm:text-base text-[#D5C7B5] font-light leading-relaxed mb-8">
              {page.bottomCta.subtitle}
            </p>
            <Link
              href={page.bottomCta.buttonLink}
              className="inline-block bg-[#FAF8F5] text-[#1E1B18] hover:bg-[#EBE2D4] px-8 py-4 rounded-full text-xs font-mono uppercase tracking-wider font-semibold shadow-xl transition-all"
            >
              {page.bottomCta.buttonText} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
