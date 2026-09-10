"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlugOrId, getRelatedBlogs, BlogPost } from "@/lib/blogsData";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const blog = getBlogBySlugOrId(resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = getRelatedBlogs(blog.slug || blog.id, 2);
  const [copied, setCopied] = useState(false);

  const authorName = typeof blog.author === "string" ? blog.author : blog.author?.name || "RugZora Editorial";
  const authorRole = typeof blog.author === "object" ? blog.author?.role : "Atelier & Design Team";
  const featuredImg = blog.featuredImage || "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788885350236-wdp51.webp";
  const category = blog.category || "Design & Styling";
  const readTime = blog.readTime || "5 min read";
  const publishDate = blog.publishDate || "Latest Edition";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <article className="min-h-screen bg-[#FDFBF7] text-[#2C2724] pt-24 pb-20 sm:pt-28 sm:pb-28">
      {/* 🌟 BREADCRUMB & HEADER */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-2 text-xs font-mono text-[#8C7A6B] mb-6">
          <Link href="/" className="hover:text-[#1E1B18] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#1E1B18] transition-colors">
            Journal
          </Link>
          <span>/</span>
          <span className="text-[#9E744E] truncate max-w-[200px] sm:max-w-xs">{category}</span>
        </nav>

        {/* Category & Read Time */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider text-[#8C7A6B] mb-4">
          <span className="px-3 py-1 rounded-full bg-[#EAE3D8] text-[#7C6347] font-semibold">
            {category}
          </span>
          <span>•</span>
          <span>{readTime}</span>
          <span>•</span>
          <span>{publishDate}</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1E1B18] tracking-tight leading-[1.18] mb-4">
          {blog.title}
        </h1>

        {blog.subtitle && (
          <p className="text-base sm:text-lg text-[#6C635B] font-light leading-relaxed mb-6">
            {blog.subtitle}
          </p>
        )}

        {/* Author Byline & Share */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E6DED3] mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B58A60] text-white flex items-center justify-center font-serif text-base font-semibold shadow-sm">
              {authorName[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1E1B18]">{authorName}</p>
              <p className="text-xs text-[#8C7A6B]">{authorRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-full border border-[#D5C7B5] bg-[#F5EFE6] text-[#6C635B] hover:text-[#1E1B18] hover:border-[#B58A60] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {copied ? "Link Copied!" : "Share Story"}
            </button>
          </div>
        </div>
      </div>

      {/* 🌟 HERO FEATURED IMAGE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="relative h-72 sm:h-96 md:h-[480px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E3D9CC] shadow-md">
          <Image
            src={featuredImg}
            alt={blog.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* 🌟 ARTICLE BODY */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Intro Excerpt Callout */}
        {blog.excerpt && (
          <div className="p-5 sm:p-6 bg-[#F5EFE6] rounded-2xl border-l-4 border-[#B58A60] mb-10 text-sm sm:text-base text-[#4A433E] font-light leading-relaxed italic">
            "{blog.excerpt}"
          </div>
        )}

        {/* 1. DIRECT AI HTML CONTENT RENDERING */}
        {blog.contentHtml ? (
          <div
            className="blog-rich-content text-[#3D3732] leading-relaxed font-light text-base sm:text-lg space-y-6 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:text-[#1E1B18] [&_h2]:pt-6 [&_h2]:pb-2 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-[#7C6347] [&_h3]:pt-4 [&_p]:leading-relaxed [&_blockquote]:my-6 [&_blockquote]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#B58A60] [&_blockquote]:font-serif [&_blockquote]:text-lg [&_blockquote]:sm:text-xl [&_blockquote]:text-[#1E1B18] [&_blockquote]:italic [&_blockquote]:bg-[#FAF5EE]/70 [&_blockquote]:py-3 [&_blockquote]:rounded-r-xl [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:text-sm [&_li]:sm:text-base [&_li]:text-[#4A433E] [&_strong]:font-semibold [&_strong]:text-[#1E1B18]"
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : blog.content ? (
          /* 2. PLAIN TEXT / PARAGRAPH RENDERING */
          <div className="space-y-6 text-[#3D3732] leading-relaxed font-light text-base sm:text-lg whitespace-pre-line">
            {blog.content}
          </div>
        ) : blog.sections && blog.sections.length > 0 ? (
          /* 3. STRUCTURED SECTIONS RENDERING */
          <div className="space-y-10 sm:space-y-12 text-[#3D3732] leading-relaxed font-light text-base sm:text-lg">
            {blog.sections.map((sec, idx) => (
              <section key={idx} className="space-y-4">
                {sec.heading && (
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1B18] tracking-tight pt-4">
                    {sec.heading}
                  </h2>
                )}

                {sec.subheading && (
                  <h3 className="font-serif text-lg sm:text-xl text-[#7C6347]">
                    {sec.subheading}
                  </h3>
                )}

                <p className="leading-relaxed">{sec.content}</p>

                {sec.quote && (
                  <blockquote className="my-6 pl-5 border-l-2 border-[#B58A60] font-serif text-lg sm:text-xl text-[#1E1B18] italic bg-[#FAF5EE]/70 py-3 rounded-r-xl">
                    “{sec.quote}”
                  </blockquote>
                )}

                {sec.tip && (
                  <div className="my-6 p-4 rounded-xl bg-[#EFE8DD] border border-[#DCD0C0] text-xs sm:text-sm text-[#4A433E]">
                    <strong className="text-[#7C6347] font-mono uppercase tracking-wider block mb-1">
                      💡 Artisan Pro-Tip
                    </strong>
                    {sec.tip}
                  </div>
                )}

                {sec.list && sec.list.length > 0 && (
                  <ul className="space-y-2 my-4 pl-2">
                    {sec.list.map((item, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#4A433E]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B58A60] mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        ) : null}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-10 mt-12 border-t border-[#E6DED3]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#8C7A6B] mb-3">
              Article Topics & Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono bg-[#EAE3D8] text-[#7C6347] px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Curated Products Mentioned */}
        {blog.relatedProducts && blog.relatedProducts.length > 0 && (
          <div className="my-12 p-6 sm:p-8 bg-[#F5EFE6] rounded-2xl border border-[#E3D9CC]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C6347] px-2.5 py-1 rounded-full bg-[#EAE3D8] inline-block mb-2 font-semibold">
              Curated from this story
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1E1B18] mb-4">
              Explore Rugs Inspired by This Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {blog.relatedProducts.map((prod, pIdx) => (
                <Link
                  key={pIdx}
                  href={prod.link}
                  className="group flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-xl border border-[#DCD0C0] hover:border-[#B58A60] transition-all"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1E1B18] group-hover:text-[#9E744E] transition-colors">
                      {prod.title}
                    </p>
                    <span className="text-[11px] font-mono text-[#8C7A6B]">{prod.tag}</span>
                  </div>
                  <span className="text-xs font-mono text-[#9E744E] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🌟 RELATED ARTICLES */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 pt-12 border-t border-[#E6DED3]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#8C7A6B]">
                More from the Journal
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1E1B18]">
                Recommended Reading
              </h3>
            </div>
            <Link
              href="/blog"
              className="text-xs font-mono font-medium text-[#9E744E] hover:underline"
            >
              View All Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedBlogs.map((rel) => {
              const relImg = rel.featuredImage || "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788885350236-wdp51.webp";
              return (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug || rel.id}`}
                  className="group block bg-[#F7F2EA] rounded-2xl border border-[#E3D9CC] overflow-hidden hover:border-[#B58A60]/60 transition-all p-5"
                >
                  <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                    <Image
                      src={relImg}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-[#9E744E] font-semibold">
                    {rel.category || "Journal"} • {rel.readTime || "5 min read"}
                  </span>
                  <h4 className="font-serif text-lg text-[#1E1B18] group-hover:text-[#9E744E] transition-colors mt-1 mb-2 line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#6C635B] line-clamp-2 font-light">
                    {rel.excerpt}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
