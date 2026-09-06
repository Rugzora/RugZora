"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { compressAndConvertToWebP } from "@/lib/compressImage";

function ImageUploader({
  label,
  value,
  onChange,
  onUpload,
  isUploading,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onUpload: (file: File, cb: (url: string) => void) => void;
  isUploading: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0], onChange);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63]">
        {label}
      </label>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-20 h-20 bg-[#EBE5DA] border border-[#DFD8CC] rounded-sm overflow-hidden flex-shrink-0 relative group">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[9px] text-[#8C7A63] uppercase">No Image</div>
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-2.5 text-center rounded-sm transition-colors cursor-pointer ${
              isDragging ? "border-[#C19A6B] bg-[#F8F5F0]" : "border-[#DFD8CC] bg-[#FAFAF8] hover:border-[#C19A6B]"
            }`}
          >
            <p className="text-xs text-[#7A7065]">
              {isUploading ? "Uploading..." : "Drag & Drop image here, or "}
              <label className="text-[#C19A6B] font-bold underline cursor-pointer hover:text-[#3A332C]">
                browse file
                <input
                  type="file"
                  accept="image/*,.webp,.avif,.svg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onUpload(e.target.files[0], onChange);
                    }
                  }}
                />
              </label>
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-[10px] uppercase font-bold text-[#8C7A63] shrink-0">Direct URL:</span>
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste image URL directly"
              className="w-full border border-[#DFD8CC] px-3 py-1.5 text-xs bg-white focus:border-[#C19A6B] outline-none text-[#3A332C]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const defaultData: Record<string, any> = {
  home: {
    hero: {
      tag: "Bespoke Artisanal Floor Coverings",
      tagSize: 12,
      title: "Eco-Conscious Luxury.",
      titleSize: 64,
      subtitle: "Born in The Carpet City.",
      subtitleSize: 48,
      description: "Handcrafted chunky braided rugs woven from sustainable recycled PET fibers. Ultra-soft wool-like feel, 100% reversible, and tailored directly in our Bhadohi workshop.",
      descriptionSize: 16,
      ctaText: "Explore Handcrafted Rugs",
      ctaLink: "/collections",
      bgImage: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop"
    },
    ethos: [
      { title: "Japandi & Modern Boho", desc: "Warm neutral tones and marled textures designed to blend into Minimalist, Scandinavian, and Modern living spaces.", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800" },
      { title: "100% Reversible Architecture", desc: "Completely unbacked with identical texture on both sides. Flip your rug anytime to double its usable lifespan.", img: "https://images.pexels.com/photos/39005790/pexels-photo-39005790.jpeg?auto=compress&w=800" },
      { title: "Reinforced Zigzag Craft", desc: "Hand-braided chunky cords spiraled and locked using heavy-duty zigzag machine stitching to eliminate edge curl.", img: "https://images.pexels.com/photos/31598222/pexels-photo-31598222.jpeg?auto=compress&w=800" }
    ],
    story: {
      tag: "The Heritage of Bhadohi",
      title: "Centuries of Tradition. Reimagined with rPET.",
      description: "Operating right from Bhadohi, India's world-renowned 'Carpet City', RugZora bridges ancient braiding legacy with conscious innovation. We turn post-consumer plastic waste into micro-spun yarns that mimic pure wool—delivering an itch-free, luxuriously soft step directly from the loom to your room.",
      image: "https://media.istockphoto.com/id/2241474699/photo/rolling-up-a-colorful-rug-in-a-cozy-living-space.jpg?b=1&s=612x612&w=0&k=20&c=YCZM8PgDSFYKG7JTCxgW4HqYBrUVqECzMpiVk3J3x2I="
    },
    silhouettesHeader: {
      title: "Signature Silhouettes",
      desc: "Braided profiles tailored to balance your home's geometry."
    },
    silhouettes: [
      { title: "Chunky Braided Oval & Rectangular", desc: "Heavy-gauge cord construction that frames living and dining areas with organic marled depth.", link: "Shop Silhouettes →", img: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800" },
      { title: "Round Medallions", desc: "Spiraled center-out to accentuate entryways, reading nooks, and circular seating layouts.", link: "Shop Silhouettes →", img: "https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?w=800" },
      { title: "Architectural Bespoke", desc: "Custom hallway runners and oversized rugs tailored to your exact floor plan dimensions.", link: "Shop Silhouettes →", img: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=800" }
    ],
    materialScience: {
      tag: "Material Science",
      title: "The Softness of Wool. The Strength of rPET.",
      desc: "Zero plastic stiffness. By micro-spinning recycled polyester, our rugs offer pure wool-grade plushness without scratching skin. Naturally hydrophobic, they repel liquid spills and maintain pristine air quality with 100% shed-free construction.",
      btnText: "Explore Our Fiber Craft",
      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200"
    },
    textureLibrary: {
      tag: "Natural Warmth",
      title: "Neutral & Marled Palettes",
      images: [
        "https://images.unsplash.com/photo-1615876234886-fd1a8f947122?w=600",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
        "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=600"
      ]
    },
    spacesHeader: {
      title: "Built for Family & High Traffic",
      desc: "Hydrophobic, stain-resistant fibers designed for effortless living."
    },
    spaces: [
      { title: "Living Room Statement", link: "Shop Area Rugs", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800" },
      { title: "Pet & Kid Friendly", link: "Zero-Shed Textures", img: "https://images.unsplash.com/photo-1522771731478-44eb11de520b?w=800" },
      { title: "Covered Patio & Hallways", link: "Shop Runners", img: "https://images.unsplash.com/photo-1598928506311-c55dd129a0f4?w=800" }
    ],
    promise: {
      title: "Sustainable Braided Luxury. Straight from our Workshop in Bhadohi.",
      ctaText: "Explore All Handcrafted Rugs",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000"
    }
  },
  collections: {
    hero: {
      tag: "THE",
      title: "Artisanal Floor Sculptures",
      description: "Browse our hand-braided rPET area rugs, runners, and custom silhouettes. 100% reversible, stain-resistant, and woven for mindful living.",
      bgImage: ""
    }
  },
  legacy: {
    hero: {
      tag: "Our Heritage",
      title: "Crafted in Bhadohi",
      subtitle: "The Carpet City of India",
      bgImage: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=1600&auto=format&fit=crop"
    },
    intro: {
      quote: "RugZora represents the pinnacle of modern carpet manufacturing, rooted deeply in the rich textile heritage of Uttar Pradesh.",
      description: "We bring the fresh, golden warmth of artisanal design directly from our production house to your floors. By operating as direct manufacturers, we strip away the traditional retail markup, ensuring that every thread aligns with our standard of premium elegance and absolute authenticity."
    },
    workshop: {
      tag: "Our Workshop",
      title: "Precision in Every Stitch",
      desc1: "Our specialized setup is the heartbeat of RugZora. Equipped with an array of dedicated zigzag sewing technology and highly accurate straight-stitch machinery, our artisans maintain absolute control over every phase of production.",
      desc2: "This hands-on, mechanical precision allows us to meticulously shape the rugged, natural textures of Jute, while simultaneously achieving the flawless, luxurious finish required for our Cut-Pile carpets.",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop"
    },
    materials: {
      title: "Tale of Two Textures",
      subtitle: "Mastering the duality of natural warmth and refined luxury.",
      pillar1: {
        tag: "The Earthy",
        title: "Golden Jute",
        desc: "Eco-friendly, highly durable, and naturally textured. Hand-guided through our straight-stitch machines to create a robust foundation that breathes life into any room.",
        img: "https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?w=1000&auto=format&fit=crop"
      },
      pillar2: {
        tag: "The Luxurious",
        title: "Plush Cut-Pile",
        desc: "Soft, dense, and incredibly inviting. Crafted utilizing advanced zigzag techniques to ensure the yarn stands upright, delivering an exceptionally smooth and premium feel underfoot.",
        img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1000&auto=format&fit=crop"
      }
    },
    cta: {
      title: "Experience the Legacy",
      description: "Bring the unmatched quality of direct manufacturing into your home.",
      btnText: "Explore Our Collections",
      btnLink: "/collections"
    }
  },
  about: {
    hero: {
      tag: "Our Heritage",
      title: "Crafted in Bhadohi",
      para1: "RugZora represents the pinnacle of modern carpet manufacturing, rooted in the rich textile heritage of Bhadohi, Uttar Pradesh. We bring the fresh, golden warmth of artisanal design directly from our production house to your floors.",
      para2: "As direct manufacturers, we operate our own specialized setup. Utilizing precision straight-stitch machinery and advanced zigzag sewing techniques, our artisans meticulously shape both the rugged, natural beauty of Jute and the smooth, luxurious finish of Cut-Pile carpets.",
      para3: "By maintaining complete control over our manufacturing, we ensure that every thread aligns with our standard of premium elegance, offering you unparalleled quality and authentic craftsmanship without the retail markup.",
      image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=1200"
    }
  },
  bespoke: {
    tag: "End-to-End Bespoke",
    title: "Tailored to Your Floor Plan",
    description: "Need non-standard proportions? Customize shapes, custom foot measurements, and duo-tone palette contrasts crafted individually in our Bhadohi facility.",
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    detailImage: "https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    btnText: "Customize Your Rug",
    btnLink: "/collections"
  },
  contact: {
    header: {
      title: "Connect With Us",
      description: "For bespoke dimensions, bulk orders, or manufacturing inquiries directly from our Bhadohi unit.",
      btnText: "Send Inquiry"
    },
    info: {
      address: "Bhadohi Nagar Palika, Uttar Pradesh, India - 221401",
      email: "concierge@rugzora.com",
      phone: "+91 98765 43210"
    }
  }
};

const PAGES = [
  { id: "home", label: "Home", livePath: "/" },
  { id: "collections", label: "Collections", livePath: "/collections" },
  { id: "legacy", label: "Our Legacy", livePath: "/legacy" },
  { id: "about", label: "About Us", livePath: "/about" },
  { id: "contact", label: "Contact", livePath: "/contact" }
];

export default function SiteContentAdmin() {
  const [activeTab, setActiveTab] = useState("home");
  const [siteContent, setSiteContent] = useState<Record<string, any>>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  // 🌟 Live Quick Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAllContent() {
      try {
        const { data } = await supabase.from("site_content").select("id, data");
        if (data && data.length > 0) {
          const loaded: Record<string, any> = { ...defaultData };
          data.forEach((row: any) => {
            if (row.id) {
              loaded[row.id] = { ...defaultData[row.id], ...row.data };
            }
          });
          setSiteContent(loaded);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllContent();
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    setIsUploading(true);
    setStatusMsg(`Optimizing "${file.name}" to WebP...`);

    try {
      // 🌟 1. Auto-convert and compress to WebP before uploading
      const optimizedFile = await compressAndConvertToWebP(file);

      const fileName = `site-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;

      setStatusMsg(`Uploading optimized WebP image...`);

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, optimizedFile, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      callback(publicData.publicUrl);
      setStatusMsg("Photo optimized & uploaded! ✔");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
      setStatusMsg("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCurrentPage = async () => {
    setIsSaving(true);
    setStatusMsg(`Saving changes for ${activeTab.toUpperCase()}...`);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert(
          {
            id: activeTab,
            data: siteContent[activeTab],
            updated_at: new Date().toISOString()
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      setIsSaving(false);
      setShowCelebration(true); // 🌟 Green tick popup trigger
      setTimeout(() => setShowCelebration(false), 2500);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
      setIsSaving(false);
    }
  };

  const updateField = (section: string, field: string, value: any) => {
    setSiteContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [section]: {
          ...prev[activeTab]?.[section],
          [field]: value
        }
      }
    }));
  };

  // 🌟 Scan all text fields across all tabs for live search
  const searchableEntries = useMemo(() => {
    const results: Array<{
      tabId: string;
      tabLabel: string;
      sectionTitle: string;
      fieldLabel: string;
      targetId: string;
      valueText: string;
    }> = [];

    const formatLabel = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

    const recurse = (obj: any, tabId: string, tabLabel: string, path: string[]) => {
      if (!obj || typeof obj !== "object") return;
      Object.entries(obj).forEach(([key, val]) => {
        const currentPath = [...path, key];
        if (typeof val === "string") {
          // ignore URLs in search matches
          if (val.startsWith("http://") || val.startsWith("https://")) return;
          const targetId = `${tabId}-${currentPath.join("-")}`;
          results.push({
            tabId,
            tabLabel,
            sectionTitle: formatLabel(path[0] || "Section"),
            fieldLabel: formatLabel(key),
            targetId,
            valueText: val
          });
        } else if (typeof val === "object") {
          recurse(val, tabId, tabLabel, currentPath);
        }
      });
    };

    PAGES.forEach((p) => {
      const pageData = siteContent[p.id] || defaultData[p.id];
      if (pageData) {
        recurse(pageData, p.id, p.label, []);
      }
    });

    return results;
  }, [siteContent]);

  // Filtered Results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchableEntries
      .filter((item) => 
        item.valueText.toLowerCase().includes(q) ||
        item.fieldLabel.toLowerCase().includes(q) ||
        item.sectionTitle.toLowerCase().includes(q) ||
        item.tabLabel.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [searchQuery, searchableEntries]);

  // 🌟 Auto Jump & Highlight Function
  const handleJumpToField = (tabId: string, targetId: string) => {
    setActiveTab(tabId);
    setSearchQuery("");
    setIsSearchFocused(false);

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
        element.classList.add("ring-4", "ring-[#C19A6B]/50", "border-[#C19A6B]", "bg-amber-50/50");
        setTimeout(() => {
          element.classList.remove("ring-4", "ring-[#C19A6B]/50", "border-[#C19A6B]", "bg-amber-50/50");
        }, 2500);
      }
    }, 150);
  };

  const currentContent = siteContent[activeTab] || defaultData[activeTab];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] pt-32 text-center text-[#C19A6B] font-serif text-lg animate-pulse">
        Loading RugZora Studio CMS...
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-20 pb-32 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* 🌟 1. INTERACTIVE LIVE SEARCH BAR (TOP) */}
        <div ref={searchContainerRef} className="relative mb-6 z-40">
          <div className="relative flex items-center bg-white border border-[#DFD8CC] rounded-sm shadow-sm focus-within:border-[#C19A6B] focus-within:ring-2 focus-within:ring-[#C19A6B]/20 transition-all">
            <div className="pl-4 pr-2 text-[#8C7A63]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Quick Jump: Search any text, title, or section name across all pages..."
              className="w-full py-3.5 pr-10 text-sm bg-transparent outline-none text-[#3A332C] placeholder-[#8C7A63]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="pr-4 text-xs font-bold text-[#8C7A63] hover:text-[#3A332C]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#DFD8CC] rounded-sm shadow-xl max-h-80 overflow-y-auto z-50 divide-y divide-[#EBE5DA]">
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseDown={() => handleJumpToField(item.tabId, item.targetId)}
                    className="p-3.5 hover:bg-[#F8F5F0] cursor-pointer transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#3A332C] text-[#F8F5F0] rounded-xs">
                          {item.tabLabel}
                        </span>
                        <span className="text-xs font-semibold text-[#C19A6B]">
                          {item.sectionTitle} → {item.fieldLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#3A332C] truncate font-medium">
                        "{item.valueText}"
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C7A63] shrink-0 mt-1">
                      Jump To Box ↗
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#7A7065]">
                  No matching text found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🌟 2. PAGE NAVIGATION TABS BAR */}
        <div className="bg-white p-4 border border-[#EBE5DA] rounded-sm shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7A63] mr-2">
              Select Page:
            </span>
            {PAGES.map((page) => (
              <button
                key={page.id}
                onClick={() => setActiveTab(page.id)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all ${
                  activeTab === page.id
                    ? "bg-[#3A332C] text-[#F8F5F0] shadow-sm"
                    : "bg-[#F8F5F0] text-[#6B6054] hover:bg-[#EBE5DA] hover:text-[#3A332C]"
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={PAGES.find((p) => p.id === activeTab)?.livePath || "/"}
              target="_blank"
              className="text-xs uppercase font-semibold text-[#8C7A63] hover:text-[#3A332C] px-3 py-2 border border-[#DFD8CC] rounded-sm"
            >
              View Live ↗
            </Link>
            <button
              onClick={handleSaveCurrentPage}
              disabled={isSaving}
              className="bg-[#C19A6B] text-white hover:bg-[#3A332C] transition-colors px-6 py-2 text-xs uppercase font-bold tracking-widest rounded-sm shadow-md disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-sm shadow-sm">
            {statusMsg}
          </div>
        )}

        {/* 🌟 3. ACTIVE TAB CONTENTS */}

        {/* --- TAB 1: HOME --- */}
        {activeTab === "home" && (
          <div className="space-y-10">
            {/* 1. HERO WITH FONT SIZE CONTROLLERS */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">
                1. Hero Section (Text & Font Sizes)
              </h2>
              <div className="space-y-6">
                
                {/* Tagline & Size */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                      Tagline (Blank = Hide)
                    </label>
                    <input
                      id="home-hero-tag"
                      type="text"
                      value={currentContent.hero?.tag ?? ""}
                      onChange={(e) => updateField("hero", "tag", e.target.value)}
                      placeholder="Bespoke Artisanal Floor Coverings"
                      className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none transition-all"
                    />
                  </div>
                  <div className="bg-[#F8F5F0] p-3 border border-[#DFD8CC] rounded-sm">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A63]">Font Size</label>
                      <span className="text-xs font-bold text-[#C19A6B]">{currentContent.hero?.tagSize || 12}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={currentContent.hero?.tagSize || 12}
                      onChange={(e) => updateField("hero", "tagSize", Number(e.target.value))}
                      className="w-full accent-[#C19A6B] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Heading Line 1 & Size */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                      Heading Line 1 (Blank = Hide)
                    </label>
                    <input
                      id="home-hero-title"
                      type="text"
                      value={currentContent.hero?.title ?? ""}
                      onChange={(e) => updateField("hero", "title", e.target.value)}
                      placeholder="Premium Rugs"
                      className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none transition-all"
                    />
                  </div>
                  <div className="bg-[#F8F5F0] p-3 border border-[#DFD8CC] rounded-sm">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A63]">Font Size</label>
                      <span className="text-xs font-bold text-[#C19A6B]">{currentContent.hero?.titleSize || 64}px</span>
                    </div>
                    <input
                      type="range"
                      min="28"
                      max="96"
                      value={currentContent.hero?.titleSize || 64}
                      onChange={(e) => updateField("hero", "titleSize", Number(e.target.value))}
                      className="w-full accent-[#C19A6B] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Subtitle Line 2 & Size */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                      Subtitle Line 2 (Blank = Hide)
                    </label>
                    <input
                      id="home-hero-subtitle"
                      type="text"
                      value={currentContent.hero?.subtitle ?? ""}
                      onChange={(e) => updateField("hero", "subtitle", e.target.value)}
                      placeholder="By RugZora"
                      className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none transition-all"
                    />
                  </div>
                  <div className="bg-[#F8F5F0] p-3 border border-[#DFD8CC] rounded-sm">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A63]">Font Size</label>
                      <span className="text-xs font-bold text-[#C19A6B]">{currentContent.hero?.subtitleSize || 48}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="72"
                      value={currentContent.hero?.subtitleSize || 48}
                      onChange={(e) => updateField("hero", "subtitleSize", Number(e.target.value))}
                      className="w-full accent-[#C19A6B] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Description & Size */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                      Description (Blank = Hide)
                    </label>
                    <textarea
                      id="home-hero-description"
                      rows={3}
                      value={currentContent.hero?.description ?? ""}
                      onChange={(e) => updateField("hero", "description", e.target.value)}
                      placeholder="Handcrafted chunky braided rugs..."
                      className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none transition-all"
                    />
                  </div>
                  <div className="bg-[#F8F5F0] p-3 border border-[#DFD8CC] rounded-sm">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A63]">Font Size</label>
                      <span className="text-xs font-bold text-[#C19A6B]">{currentContent.hero?.descriptionSize || 16}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="26"
                      value={currentContent.hero?.descriptionSize || 16}
                      onChange={(e) => updateField("hero", "descriptionSize", Number(e.target.value))}
                      className="w-full accent-[#C19A6B] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Button Text */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                    Button Text (Blank = Hide)
                  </label>
                  <input
                    id="home-hero-ctaText"
                    type="text"
                    value={currentContent.hero?.ctaText ?? ""}
                    onChange={(e) => updateField("hero", "ctaText", e.target.value)}
                    placeholder="Explore Handcrafted Rugs"
                    className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none transition-all"
                  />
                </div>

                <ImageUploader
                  label="Hero Background Image"
                  value={currentContent.hero?.bgImage || ""}
                  onChange={(url) => updateField("hero", "bgImage", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            {/* THREE ETHOS CARDS */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">2. Three Brand Ethos Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(currentContent.ethos || defaultData.home.ethos).map((card: any, idx: number) => (
                  <div key={idx} className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 rounded-sm space-y-4">
                    <ImageUploader
                      label={`Card #${idx + 1} Image`}
                      value={card.img}
                      onChange={(url) => {
                        const updated = [...(currentContent.ethos || defaultData.home.ethos)];
                        updated[idx].img = url;
                        setSiteContent((prev) => ({ ...prev, home: { ...prev.home, ethos: updated } }));
                      }}
                      onUpload={handleImageUpload}
                      isUploading={isUploading}
                    />
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Title</label>
                      <input
                        id={`home-ethos-${idx}-title`}
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = [...(currentContent.ethos || defaultData.home.ethos)];
                          updated[idx].title = e.target.value;
                          setSiteContent((prev) => ({ ...prev, home: { ...prev.home, ethos: updated } }));
                        }}
                        className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Description</label>
                      <textarea
                        id={`home-ethos-${idx}-desc`}
                        rows={3}
                        value={card.desc}
                        onChange={(e) => {
                          const updated = [...(currentContent.ethos || defaultData.home.ethos)];
                          updated[idx].desc = e.target.value;
                          setSiteContent((prev) => ({ ...prev, home: { ...prev.home, ethos: updated } }));
                        }}
                        className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STORY */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">3. Heritage & Story Section</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tagline</label>
                  <input
                    id="home-story-tag"
                    type="text"
                    value={currentContent.story?.tag || ""}
                    onChange={(e) => updateField("story", "tag", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Heading</label>
                  <input
                    id="home-story-title"
                    type="text"
                    value={currentContent.story?.title || ""}
                    onChange={(e) => updateField("story", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                  <textarea
                    id="home-story-description"
                    rows={4}
                    value={currentContent.story?.description || ""}
                    onChange={(e) => updateField("story", "description", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none transition-all"
                  />
                </div>
                <ImageUploader
                  label="Side Photo"
                  value={currentContent.story?.image || ""}
                  onChange={(url) => updateField("story", "image", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            {/* SILHOUETTES */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">4. Signature Silhouettes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Section Title</label>
                  <input
                    id="home-silhouettesHeader-title"
                    type="text"
                    value={currentContent.silhouettesHeader?.title || "Signature Silhouettes"}
                    onChange={(e) => updateField("silhouettesHeader", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Section Description</label>
                  <input
                    id="home-silhouettesHeader-desc"
                    type="text"
                    value={currentContent.silhouettesHeader?.desc || ""}
                    onChange={(e) => updateField("silhouettesHeader", "desc", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(currentContent.silhouettes || defaultData.home.silhouettes).map((card: any, idx: number) => (
                  <div key={idx} className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 rounded-sm space-y-4">
                    <ImageUploader
                      label={`Silhouette #${idx + 1} Image`}
                      value={card.img}
                      onChange={(url) => {
                        const updated = [...(currentContent.silhouettes || defaultData.home.silhouettes)];
                        updated[idx].img = url;
                        setSiteContent((prev) => ({ ...prev, home: { ...prev.home, silhouettes: updated } }));
                      }}
                      onUpload={handleImageUpload}
                      isUploading={isUploading}
                    />
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Title</label>
                      <input
                        id={`home-silhouettes-${idx}-title`}
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = [...(currentContent.silhouettes || defaultData.home.silhouettes)];
                          updated[idx].title = e.target.value;
                          setSiteContent((prev) => ({ ...prev, home: { ...prev.home, silhouettes: updated } }));
                        }}
                        className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Description</label>
                      <textarea
                        id={`home-silhouettes-${idx}-desc`}
                        rows={3}
                        value={card.desc}
                        onChange={(e) => {
                          const updated = [...(currentContent.silhouettes || defaultData.home.silhouettes)];
                          updated[idx].desc = e.target.value;
                          setSiteContent((prev) => ({ ...prev, home: { ...prev.home, silhouettes: updated } }));
                        }}
                        className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MATERIAL SCIENCE */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">5. Material Science Section</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Small Tag</label>
                  <input
                    id="home-materialScience-tag"
                    type="text"
                    value={currentContent.materialScience?.tag || ""}
                    onChange={(e) => updateField("materialScience", "tag", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Heading</label>
                  <input
                    id="home-materialScience-title"
                    type="text"
                    value={currentContent.materialScience?.title || ""}
                    onChange={(e) => updateField("materialScience", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                  <textarea
                    id="home-materialScience-desc"
                    rows={3}
                    value={currentContent.materialScience?.desc || ""}
                    onChange={(e) => updateField("materialScience", "desc", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Button Text</label>
                  <input
                    id="home-materialScience-btnText"
                    type="text"
                    value={currentContent.materialScience?.btnText || ""}
                    onChange={(e) => updateField("materialScience", "btnText", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none transition-all"
                  />
                </div>
               {/* Material Science Side Image */}
               <ImageUploader
                  label="Material Science Side Image"
                  value={currentContent.materialScience?.img || ""}
                  onChange={(url) => updateField("materialScience", "img", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            {/* 6. THE TEXTURE LIBRARY */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">6. The Texture Library (4 Swatches)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tag</label>
                  <input
                    id="home-textureLibrary-tag"
                    type="text"
                    value={currentContent.textureLibrary?.tag || ""}
                    onChange={(e) => updateField("textureLibrary", "tag", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Title</label>
                  <input
                    id="home-textureLibrary-title"
                    type="text"
                    value={currentContent.textureLibrary?.title || ""}
                    onChange={(e) => updateField("textureLibrary", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 rounded-sm">
                    <ImageUploader
                      label={`Swatch #${idx + 1}`}
                      value={
                        typeof currentContent.textureLibrary?.images?.[idx] === "string"
                          ? currentContent.textureLibrary.images[idx]
                          : currentContent.textureLibrary?.images?.[idx]?.url || ""
                      }
                      onChange={(url) => {
                        const updated = [
                          ...(currentContent.textureLibrary?.images || defaultData.home.textureLibrary.images),
                        ];
                        updated[idx] = url;
                        setSiteContent((prev) => ({
                          ...prev,
                          home: {
                            ...prev.home,
                            textureLibrary: {
                              ...prev.home?.textureLibrary,
                              images: updated,
                            },
                          },
                        }));
                      }}
                      onUpload={handleImageUpload}
                      isUploading={isUploading}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* LIVING SPACES */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">7. Designed For Living Spaces</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Section Title</label>
                  <input
                    id="home-spacesHeader-title"
                    type="text"
                    value={currentContent.spacesHeader?.title || ""}
                    onChange={(e) => updateField("spacesHeader", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Section Description</label>
                  <input
                    id="home-spacesHeader-desc"
                    type="text"
                    value={currentContent.spacesHeader?.desc || ""}
                    onChange={(e) => updateField("spacesHeader", "desc", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(currentContent.spaces || defaultData.home.spaces).map((card: any, idx: number) => (
                  <div key={idx} className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 rounded-sm space-y-4">
                    <ImageUploader
                      label={`Space #${idx + 1} Image`}
                      value={card.img}
                      onChange={(url) => {
                        const updated = [...(currentContent.spaces || defaultData.home.spaces)];
                        updated[idx].img = url;
                        setSiteContent((prev) => ({ ...prev, home: { ...prev.home, spaces: updated } }));
                      }}
                      onUpload={handleImageUpload}
                      isUploading={isUploading}
                    />
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Title</label>
                      <input
                        id={`home-spaces-${idx}-title`}
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = [...(currentContent.spaces || defaultData.home.spaces)];
                          updated[idx].title = e.target.value;
                          setSiteContent((prev) => ({ ...prev, home: { ...prev.home, spaces: updated } }));
                        }}
                        className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Link Label</label>
                      <input
                        id={`home-spaces-${idx}-link`}
                        type="text"
                        value={card.link}
                        onChange={(e) => {
                          const updated = [...(currentContent.spaces || defaultData.home.spaces)];
                          updated[idx].link = e.target.value;
                          setSiteContent((prev) => ({ ...prev, home: { ...prev.home, spaces: updated } }));
                        }}
                        className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* BESPOKE STUDIO SPOTLIGHT (TWO IMAGES CONTROL) */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">
                8. Bespoke Studio Spotlight (Two Images & Content)
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tagline</label>
                  <input
                    type="text"
                    value={currentContent.bespoke?.tag ?? ""}
                    onChange={(e) => updateField("bespoke", "tag", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Heading</label>
                  <input
                    type="text"
                    value={currentContent.bespoke?.title ?? ""}
                    onChange={(e) => updateField("bespoke", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={currentContent.bespoke?.description ?? ""}
                    onChange={(e) => updateField("bespoke", "description", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#DFD8CC]">
                  {/* Image 1: Main Large Architecture Photo */}
                  <ImageUploader
                    label="1. Main Large Background Photo"
                    value={currentContent.bespoke?.mainImage || ""}
                    onChange={(url) => updateField("bespoke", "mainImage", url)}
                    onUpload={handleImageUpload}
                    isUploading={isUploading}
                  />

                  {/* Image 2: Close-up Rug Card Photo */}
                  <ImageUploader
                    label="2. Floating Card Close-up Detail Photo"
                    value={currentContent.bespoke?.detailImage || ""}
                    onChange={(url) => updateField("bespoke", "detailImage", url)}
                    onUpload={handleImageUpload}
                    isUploading={isUploading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Button Text</label>
                    <input
                      type="text"
                      value={currentContent.bespoke?.btnText ?? ""}
                      onChange={(e) => updateField("bespoke", "btnText", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none focus:border-[#C19A6B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Button Link</label>
                    <input
                      type="text"
                      value={currentContent.bespoke?.btnLink ?? ""}
                      onChange={(e) => updateField("bespoke", "btnLink", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none focus:border-[#C19A6B]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: COLLECTIONS --- */}
        {activeTab === "collections" && (
          <div className="space-y-10">
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <div className="flex items-center justify-between border-b border-[#DFD8CC] pb-3 mb-6">
                <div>
                  <h2 className="text-lg font-serif text-[#3A332C]">Collections Page Header</h2>
                  <p className="text-xs text-[#7A7065] mt-1">Leave background image blank to keep standard light background.</p>
                </div>
                {currentContent.hero?.bgImage && (
                  <button
                    type="button"
                    onClick={() => updateField("hero", "bgImage", "")}
                    className="text-xs text-red-600 hover:underline font-semibold uppercase tracking-wider"
                  >
                    Remove Image
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tagline</label>
                  <input
                    id="collections-hero-tag"
                    type="text"
                    value={currentContent.hero?.tag || ""}
                    onChange={(e) => updateField("hero", "tag", e.target.value)}
                    placeholder="e.g. THE"
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Main Heading</label>
                  <input
                    id="collections-hero-title"
                    type="text"
                    value={currentContent.hero?.title || ""}
                    onChange={(e) => updateField("hero", "title", e.target.value)}
                    placeholder="e.g. Artisanal Floor Sculptures"
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Subtitle / Description</label>
                  <textarea
                    id="collections-hero-description"
                    rows={3}
                    value={currentContent.hero?.description || ""}
                    onChange={(e) => updateField("hero", "description", e.target.value)}
                    placeholder="Browse our hand-braided rPET area rugs..."
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>

                <ImageUploader
                  label="Header Background Image (Optional)"
                  value={currentContent.hero?.bgImage || ""}
                  onChange={(url) => updateField("hero", "bgImage", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: OUR LEGACY --- */}
        {activeTab === "legacy" && (
          <div className="space-y-10">
            {/* 1. HERO */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">1. Cinematic Hero Section</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tag</label>
                  <input
                    id="legacy-hero-tag"
                    type="text"
                    value={currentContent.hero?.tag || ""}
                    onChange={(e) => updateField("hero", "tag", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Title</label>
                    <input
                      id="legacy-hero-title"
                      type="text"
                      value={currentContent.hero?.title || ""}
                      onChange={(e) => updateField("hero", "title", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Subtitle</label>
                    <input
                      id="legacy-hero-subtitle"
                      type="text"
                      value={currentContent.hero?.subtitle || ""}
                      onChange={(e) => updateField("hero", "subtitle", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                    />
                  </div>
                </div>
                <ImageUploader
                  label="Hero Background Image"
                  value={currentContent.hero?.bgImage || ""}
                  onChange={(url) => updateField("hero", "bgImage", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            {/* 2. EDITORIAL INTRO */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">2. Editorial Quote & Intro</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Main Quote</label>
                  <textarea
                    id="legacy-intro-quote"
                    rows={3}
                    value={currentContent.intro?.quote || ""}
                    onChange={(e) => updateField("intro", "quote", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Detailed Paragraph</label>
                  <textarea
                    id="legacy-intro-description"
                    rows={4}
                    value={currentContent.intro?.description || ""}
                    onChange={(e) => updateField("intro", "description", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. WORKSHOP & MACHINERY */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">3. Workshop & Stitch Precision</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Small Tag</label>
                  <input
                    id="legacy-workshop-tag"
                    type="text"
                    value={currentContent.workshop?.tag || ""}
                    onChange={(e) => updateField("workshop", "tag", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Heading</label>
                  <input
                    id="legacy-workshop-title"
                    type="text"
                    value={currentContent.workshop?.title || ""}
                    onChange={(e) => updateField("workshop", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Paragraph 1</label>
                  <textarea
                    id="legacy-workshop-desc1"
                    rows={3}
                    value={currentContent.workshop?.desc1 || ""}
                    onChange={(e) => updateField("workshop", "desc1", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Paragraph 2</label>
                  <textarea
                    id="legacy-workshop-desc2"
                    rows={3}
                    value={currentContent.workshop?.desc2 || ""}
                    onChange={(e) => updateField("workshop", "desc2", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <ImageUploader
                  label="Workshop Image"
                  value={currentContent.workshop?.image || ""}
                  onChange={(url) => updateField("workshop", "image", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            {/* 4. TALE OF TWO TEXTURES */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">4. Tale of Two Textures (Two Pillars)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Section Title</label>
                  <input
                    id="legacy-materials-title"
                    type="text"
                    value={currentContent.materials?.title || ""}
                    onChange={(e) => updateField("materials", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Section Subtitle</label>
                  <input
                    id="legacy-materials-subtitle"
                    type="text"
                    value={currentContent.materials?.subtitle || ""}
                    onChange={(e) => updateField("materials", "subtitle", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pillar 1 */}
                <div className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 rounded-sm space-y-4">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#C19A6B]">Pillar 1 (Earthy)</span>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Tag</label>
                    <input
                      id="legacy-materials-pillar1-tag"
                      type="text"
                      value={currentContent.materials?.pillar1?.tag || ""}
                      onChange={(e) => setSiteContent((prev: any) => ({ ...prev, legacy: { ...prev.legacy, materials: { ...prev.legacy.materials, pillar1: { ...prev.legacy.materials.pillar1, tag: e.target.value } } } }))}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Title</label>
                    <input
                      id="legacy-materials-pillar1-title"
                      type="text"
                      value={currentContent.materials?.pillar1?.title || ""}
                      onChange={(e) => setSiteContent((prev: any) => ({ ...prev, legacy: { ...prev.legacy, materials: { ...prev.legacy.materials, pillar1: { ...prev.legacy.materials.pillar1, title: e.target.value } } } }))}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Description</label>
                    <textarea
                      id="legacy-materials-pillar1-desc"
                      rows={3}
                      value={currentContent.materials?.pillar1?.desc || ""}
                      onChange={(e) => setSiteContent((prev: any) => ({ ...prev, legacy: { ...prev.legacy, materials: { ...prev.legacy.materials, pillar1: { ...prev.legacy.materials.pillar1, desc: e.target.value } } } }))}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                    />
                  </div>
                  <ImageUploader
                    label="Pillar 1 Image"
                    value={currentContent.materials?.pillar1?.img || ""}
                    onChange={(url) => setSiteContent((prev: any) => ({ ...prev, legacy: { ...prev.legacy, materials: { ...prev.legacy.materials, pillar1: { ...prev.legacy.materials, pillar1: { ...prev.legacy.materials.pillar1, img: url } } } } }))}
                    onUpload={handleImageUpload}
                    isUploading={isUploading}
                  />
                </div>

                {/* Pillar 2 */}
                <div className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 rounded-sm space-y-4">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#C19A6B]">Pillar 2 (Luxurious)</span>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Tag</label>
                    <input
                      id="legacy-materials-pillar2-tag"
                      type="text"
                      value={currentContent.materials?.pillar2?.tag || ""}
                      onChange={(e) => setSiteContent((prev: any) => ({ ...prev, legacy: { ...prev.legacy, materials: { ...prev.legacy.materials, pillar2: { ...prev.legacy.materials.pillar2, tag: e.target.value } } } }))}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Title</label>
                    <input
                      id="legacy-materials-pillar2-title"
                      type="text"
                      value={currentContent.materials?.pillar2?.title || ""}
                      onChange={(e) => setSiteContent((prev: any) => ({ ...prev, legacy: { ...prev.legacy, materials: { ...prev.legacy.materials, pillar2: { ...prev.legacy.materials.pillar2, title: e.target.value } } } }))}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Description</label>
                    <textarea
                      id="legacy-materials-pillar2-desc"
                      rows={3}
                      value={currentContent.materials?.pillar2?.desc || ""}
                      onChange={(e) => setSiteContent((prev: any) => ({ ...prev, legacy: { ...prev.legacy, materials: { ...prev.legacy.materials, pillar2: { ...prev.legacy.materials.pillar2, desc: e.target.value } } } }))}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none transition-all"
                    />
                  </div>
                  <ImageUploader
                    label="Pillar 2 Image"
                    value={currentContent.materials?.pillar2?.img || ""}
                    onChange={(url) => setSiteContent((prev: any) => ({ ...prev, legacy: { ...prev.legacy, materials: { ...prev.legacy.materials, pillar2: { ...prev.legacy.materials.pillar2, img: url } } } }))}
                    onUpload={handleImageUpload}
                    isUploading={isUploading}
                  />
                </div>
              </div>
            </div>

            {/* 5. CALL TO ACTION */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">5. Final Call To Action</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Heading</label>
                  <input
                    id="legacy-cta-title"
                    type="text"
                    value={currentContent.cta?.title || ""}
                    onChange={(e) => updateField("cta", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                  <textarea
                    id="legacy-cta-description"
                    rows={2}
                    value={currentContent.cta?.description || ""}
                    onChange={(e) => updateField("cta", "description", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Button Text</label>
                    <input
                      id="legacy-cta-btnText"
                      type="text"
                      value={currentContent.cta?.btnText || ""}
                      onChange={(e) => updateField("cta", "btnText", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Button Link</label>
                    <input
                      id="legacy-cta-btnLink"
                      type="text"
                      value={currentContent.cta?.btnLink || ""}
                      onChange={(e) => updateField("cta", "btnLink", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: ABOUT US --- */}
        {activeTab === "about" && (
          <div className="space-y-10">
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">About Us Editorial Content</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tagline</label>
                  <input
                    id="about-hero-tag"
                    type="text"
                    value={currentContent.hero?.tag || ""}
                    onChange={(e) => updateField("hero", "tag", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Main Heading</label>
                  <input
                    id="about-hero-title"
                    type="text"
                    value={currentContent.hero?.title || ""}
                    onChange={(e) => updateField("hero", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Paragraph 1 (Origin & Heritage)</label>
                  <textarea
                    id="about-hero-para1"
                    rows={3}
                    value={currentContent.hero?.para1 || ""}
                    onChange={(e) => updateField("hero", "para1", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Paragraph 2 (Workshop & Craftsmanship)</label>
                  <textarea
                    id="about-hero-para2"
                    rows={3}
                    value={currentContent.hero?.para2 || ""}
                    onChange={(e) => updateField("hero", "para2", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Paragraph 3 (Promise & Direct Manufacture)</label>
                  <textarea
                    id="about-hero-para3"
                    rows={3}
                    value={currentContent.hero?.para3 || ""}
                    onChange={(e) => updateField("hero", "para3", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <ImageUploader
                  label="About Us Bottom Feature Image"
                  value={currentContent.hero?.image || ""}
                  onChange={(url) => updateField("hero", "image", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>
          </div>
        )}
        {/* --- TAB 5: CONTACT --- */}
        {activeTab === "contact" && (
          <div className="space-y-10">
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">Contact Page Form & Header</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Main Heading</label>
                  <input
                    id="contact-header-title"
                    type="text"
                    value={currentContent.header?.title || ""}
                    onChange={(e) => updateField("header", "title", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description / Subtitle</label>
                  <textarea
                    id="contact-header-description"
                    rows={3}
                    value={currentContent.header?.description || ""}
                    onChange={(e) => updateField("header", "description", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Submit Button Text</label>
                  <input
                    id="contact-header-btnText"
                    type="text"
                    value={currentContent.header?.btnText || ""}
                    onChange={(e) => updateField("header", "btnText", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">Workshop & Direct Contact Info (Optional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Workshop Address</label>
                  <input
                    id="contact-info-address"
                    type="text"
                    value={currentContent.info?.address || ""}
                    onChange={(e) => updateField("info", "address", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Email Address</label>
                  <input
                    id="contact-info-email"
                    type="text"
                    value={currentContent.info?.email || ""}
                    onChange={(e) => updateField("info", "email", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Phone / WhatsApp</label>
                  <input
                    id="contact-info-phone"
                    type="text"
                    value={currentContent.info?.phone || ""}
                    onChange={(e) => updateField("info", "phone", e.target.value)}
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 🌟 1. FULLSCREEN DARK BACKDROP WITH ROUND GREEN SPINNER */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm select-none"
          >
            <div className="bg-white border border-[#DFD8CC] p-8 rounded-sm shadow-2xl flex flex-col items-center gap-5 max-w-xs w-full text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 animate-pulse"></div>
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
              </div>
              <div>
                <h4 className="text-base font-serif text-[#3A332C] font-semibold">
                  Processing...
                </h4>
                <p className="text-xs text-[#7A7065] mt-1 font-medium">
                  Saving and synchronizing content...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 2. ANIMATED GREEN CHECKMARK SUCCESS MODAL */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-sm max-w-xs w-full p-8 text-center shadow-2xl border-t-4 border-emerald-500"
            >
              <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-serif text-[#3A332C] font-semibold">
                Changes Saved!
              </h3>
              <p className="text-xs text-[#7A7065] mt-1">
                Updated live across the storefront.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}