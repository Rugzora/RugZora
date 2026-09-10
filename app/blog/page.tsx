"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getAllBlogs, BlogPost } from "@/lib/blogsData";

export default function BlogIndexPage() {
  const allBlogs = useMemo(() => getAllBlogs(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    allBlogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [allBlogs]);

  const featuredBlog = allBlogs[0];

  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blog) => {
      const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [allBlogs, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2724] pt-24 pb-20 sm:pt-28 sm:pb-28">
      {/* 🌟 HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE3D8]/60 border border-[#D5C7B5] text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#7C6347] mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B58A60]" />
          RugZora Journal & Gazette
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1E1B18] tracking-tight leading-[1.15] mb-4"
        >
          Craft, Design & Conscious Living
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-[#6C635B] max-w-2xl mx-auto font-light leading-relaxed"
        >
          Curated perspectives on Japandi aesthetics, sustainable textile engineering, and four centuries of Bhadohi weaving heritage.
        </motion.p>
      </section>

      {/* 🌟 FEATURED STORY SPOTLIGHT */}
      {featuredBlog && selectedCategory === "All" && !searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-16 sm:mb-20">
          <Link
            href={`/blog/${featuredBlog.slug || featuredBlog.id}`}
            className="group block relative bg-[#F5EFE6] rounded-2xl sm:rounded-3xl border border-[#E3D9CC] overflow-hidden hover:border-[#B58A60]/50 transition-all duration-500 shadow-sm hover:shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="relative lg:col-span-7 h-64 sm:h-80 lg:h-[440px] w-full overflow-hidden">
                <Image
                  src={featuredBlog.featuredImage || "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788885350236-wdp51.webp"}
                  alt={featuredBlog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1E1B18]/90 backdrop-blur-md text-[#FAF8F5] text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full">
                    ★ Featured Story
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono uppercase text-[#8C7A6B] mb-3">
                    <span className="text-[#9E744E] font-medium">{featuredBlog.category || "Journal"}</span>
                    <span>•</span>
                    <span>{featuredBlog.readTime || "5 min read"}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1B18] group-hover:text-[#9E744E] transition-colors leading-snug mb-3">
                    {featuredBlog.title}
                  </h2>

                  <p className="text-[#6C635B] text-sm sm:text-base font-light line-clamp-3 mb-6 leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E3D9CC]/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#B58A60] text-white flex items-center justify-center font-serif text-sm font-semibold">
                      {(typeof featuredBlog.author === "string" ? featuredBlog.author : featuredBlog.author?.name || "R")[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#1E1B18]">
                        {typeof featuredBlog.author === "string" ? featuredBlog.author : featuredBlog.author?.name || "RugZora Editorial"}
                      </p>
                      <p className="text-[11px] text-[#8C7A6B]">{featuredBlog.publishDate || "Latest Edition"}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-[#9E744E] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium">
                    Read Story →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* 🌟 SEARCH & CATEGORY FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#E6DED3]">
          {/* Categories */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-[#1E1B18] text-[#FAF8F5] shadow-sm"
                    : "bg-[#F3ECE0] text-[#6C635B] hover:bg-[#EBE2D4] hover:text-[#1E1B18]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search articles, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5EFE6] border border-[#E0D5C5] rounded-full px-4 py-2 pl-9 text-xs focus:outline-none focus:border-[#9E744E] transition-colors placeholder:text-[#A09384]"
            />
            <svg
              className="w-3.5 h-3.5 text-[#A09384] absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-[#A09384] hover:text-[#1E1B18]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 🌟 BLOG CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-[#F5EFE6] rounded-2xl border border-dashed border-[#DCD0C0]">
            <p className="font-serif text-xl text-[#6C635B] mb-2">No articles found matching your filter.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-3 text-xs font-mono uppercase tracking-wider text-[#9E744E] underline hover:text-[#7C5A38]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {filteredBlogs.map((blog, idx) => {
                const author = typeof blog.author === "string" ? blog.author : blog.author?.name || "RugZora";
                const img = blog.featuredImage || "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788885350236-wdp51.webp";
                const linkHref = `/blog/${blog.slug || blog.id}`;

                return (
                  <motion.article
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group bg-[#F7F2EA] rounded-2xl border border-[#E3D9CC] overflow-hidden flex flex-col justify-between hover:border-[#B58A60]/60 hover:shadow-lg transition-all duration-300"
                  >
                    <div>
                      {/* Thumbnail */}
                      <Link href={linkHref} className="block relative h-52 w-full overflow-hidden bg-[#EAE3D8]">
                        <Image
                          src={img}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#FAF8F5]/90 backdrop-blur-sm text-[#7C6347] font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold">
                            {blog.category || "Journal"}
                          </span>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8C7A6B] mb-2">
                          <span>{blog.publishDate || "Recent"}</span>
                          <span>•</span>
                          <span>{blog.readTime || "5 min read"}</span>
                        </div>

                        <Link href={linkHref}>
                          <h3 className="font-serif text-lg sm:text-xl text-[#1E1B18] group-hover:text-[#9E744E] transition-colors leading-snug line-clamp-2 mb-2.5">
                            {blog.title}
                          </h3>
                        </Link>

                        <p className="text-xs sm:text-sm text-[#6C635B] font-light line-clamp-3 leading-relaxed mb-4">
                          {blog.excerpt}
                        </p>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono bg-[#EAE3D8]/60 text-[#7C6347] px-2 py-0.5 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#EAE3D8] flex items-center justify-between">
                      <span className="text-[11px] text-[#8C7A6B]">{author}</span>
                      <Link
                        href={linkHref}
                        className="text-xs font-mono font-medium text-[#9E744E] group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                      >
                        Read →
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 🌟 BESPOKE CTA STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-20">
        <div className="bg-[#1E1B18] text-[#FAF8F5] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B58A60_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D5C7B5] px-3 py-1 rounded-full border border-[#D5C7B5]/30 inline-block mb-3">
              Crafted in Bhadohi, India
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#FAF8F5] mb-3">
              Ready to Design Your Custom Heirloom?
            </h3>
            <p className="text-xs sm:text-sm text-[#D5C7B5] font-light leading-relaxed mb-6">
              Tailor dimensions to the half-foot, select your favorite silhouette, and preview dual-tone yarns in real-time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/customize"
                className="bg-[#FAF8F5] text-[#1E1B18] hover:bg-[#EBE2D4] px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
              >
                Launch Custom Studio
              </Link>
              <Link
                href="/collections"
                className="bg-transparent text-[#FAF8F5] border border-[#D5C7B5]/40 hover:border-[#FAF8F5] px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
              >
                Explore In-Stock Rugs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
