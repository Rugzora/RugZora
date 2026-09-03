"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// 🌟 Universal Image Selector Component (Drag & Drop + Open File + Direct URL)
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
        {/* Preview Box */}
        <div className="w-24 h-24 bg-[#EBE5DA] border border-[#DFD8CC] rounded-sm overflow-hidden flex-shrink-0 relative group">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8C7A63] uppercase">No Image</div>
          )}
        </div>

        {/* Drag & Drop Zone + URL + Browse */}
        <div className="flex-1 w-full space-y-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-3 text-center rounded-sm transition-colors cursor-pointer ${
              isDragging ? "border-[#C19A6B] bg-[#F8F5F0]" : "border-[#DFD8CC] bg-[#FAFAF8] hover:border-[#C19A6B]"
            }`}
          >
            <p className="text-xs text-[#7A7065]">
              {isUploading ? "Uploading file..." : "Drag & Drop any image format here, or "}
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
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... or paste image URL"
              className="w-full border border-[#DFD8CC] px-3 py-1.5 text-xs bg-white focus:border-[#C19A6B] outline-none text-[#3A332C]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// DEFAULT CONTENTS FOR ALL PAGES
const defaultData: Record<string, any> = {
  home: {
    hero: {
      tag: "Bespoke Artisanal Floor Coverings",
      title: "Eco-Conscious Luxury.",
      subtitle: "Born in The Carpet City.",
      description: "Handcrafted chunky braided rugs woven from sustainable recycled PET fibers. Ultra-soft wool-like feel, 100% reversible, and tailored directly in our Bhadohi workshop.",
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
    promise: {
      title: "Sustainable Braided Luxury. Straight from our Workshop in Bhadohi.",
      ctaText: "Explore All Handcrafted Rugs",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000"
    }
  },
  collections: {
    hero: {
      tag: "The Catalog",
      title: "Artisanal Floor Sculptures",
      description: "Browse our hand-braided rPET area rugs, runners, and custom silhouettes. 100% reversible, stain-resistant, and woven for mindful living.",
      bgImage: "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1600&auto=format&fit=crop"
    },
    banner: {
      title: "Need Custom Architectural Dimensions?",
      description: "Every room has distinct proportions. Configure size, shape, and dual-tone cords through our bespoke studio.",
      ctaText: "Start Custom Order",
      ctaLink: "/collections"
    }
  },
  legacy: {
    hero: {
      tag: "Origins & Lineage",
      title: "The Heartbeat of Bhadohi",
      subtitle: "Centuries of Craftsmanship in every braided cord.",
      description: "Known globally as The Carpet City, Bhadohi's soil carries centuries of weaving mastery. At RugZora, we honor this ancestral discipline by combining it with cutting-edge yarn recycling.",
      bgImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop"
    },
    section1: {
      tag: "Zero Compromise",
      title: "The Heavy-Gauge Braiding Method",
      text: "Unlike flat-weave mats, our artisans twist post-consumer fibers into robust structural cords. Spiraled tightly and locked with reinforced industrial zigzag stitching, our carpets withstand pets, family foot-traffic, and generations of wear.",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1000&auto=format&fit=crop"
    }
  },
  about: {
    hero: {
      tag: "Conscious Luxury",
      title: "Sustainable Innovation Meets Indian Heritage",
      description: "RugZora was established to prove that high-end floor coverings do not require shearing sheep or producing virgin synthetic plastics.",
      bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
    },
    mission: {
      title: "Our Circular Fiber Philosophy",
      text: "Every square meter of a RugZora rug diverts dozens of plastic bottles from landfill ecosystems. Micro-spun to achieve pure wool-grade tactile softness, our carpets remain hypoallergenic, itch-free, and effortlessly washable.",
      image: "https://images.unsplash.com/photo-1615876234886-fd1a8f947122?q=80&w=1000&auto=format&fit=crop"
    }
  },
  contact: {
    header: {
      tag: "Get In Touch",
      title: "Bespoke Consultations & Direct Inquiries",
      description: "Direct communication with our manufacturing workshop in Bhadohi, Uttar Pradesh. Let's design your ideal rug together.",
      bgImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop"
    },
    info: {
      address: "Bhadohi Nagar Palika, Uttar Pradesh, India - 221401",
      email: "concierge@rugzora.com",
      phone: "+91 98765 43210",
      hours: "Monday – Saturday: 9:00 AM – 7:00 PM IST"
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

  useEffect(() => {
    async function loadAllContent() {
      try {
        const { data, error } = await supabase.from("site_content").select("id, data");
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
        console.error("Failed to load CMS content:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllContent();
  }, []);

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    setIsUploading(true);
    setStatusMsg(`Uploading "${file.name}"...`);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `site-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      callback(publicData.publicUrl);
      setStatusMsg("Photo uploaded successfully! ✔");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: any) {
      alert("Photo upload failed: " + err.message);
      setStatusMsg("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCurrentPage = async () => {
    setIsSaving(true);
    setStatusMsg(`Saving changes for ${activeTab.toUpperCase()}...`);
    try {
      const { error } = await supabase.from("site_content").upsert({
        id: activeTab,
        data: siteContent[activeTab],
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      setStatusMsg(`"${activeTab.toUpperCase()}" page updated live! ✔`);
      setTimeout(() => setStatusMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
      setStatusMsg("");
    } finally {
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
        
        {/* 🌟 1. NAVIGATION BAR - CHOOSE WHICH PAGE TO EDIT */}
        <div className="bg-white p-4 border border-[#EBE5DA] rounded-sm shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30">
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

        {/* 🌟 2. ACTIVE PAGE EDITOR */}
        
        {/* TAB 1: HOME PAGE */}
        {activeTab === "home" && (
          <div className="space-y-10">
            {/* HERO */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">1. Hero Section</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tagline (Top Small Text)</label>
                  <input type="text" value={currentContent.hero.tag} onChange={(e) => updateField("hero", "tag", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Main Heading Line 1</label>
                    <input type="text" value={currentContent.hero.title} onChange={(e) => updateField("hero", "title", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Italic Subtitle Line 2</label>
                    <input type="text" value={currentContent.hero.subtitle} onChange={(e) => updateField("hero", "subtitle", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                  <textarea rows={3} value={currentContent.hero.description} onChange={(e) => updateField("hero", "description", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Button Text</label>
                  <input type="text" value={currentContent.hero.ctaText} onChange={(e) => updateField("hero", "ctaText", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                </div>
                <ImageUploader
                  label="Hero Background Image"
                  value={currentContent.hero.bgImage}
                  onChange={(url) => updateField("hero", "bgImage", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            {/* ETHOS 3 CARDS */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">2. Three Ethos Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentContent.ethos.map((card: any, idx: number) => (
                  <div key={idx} className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 rounded-sm space-y-4">
                    <ImageUploader
                      label={`Card #${idx + 1} Image`}
                      value={card.img}
                      onChange={(url) => {
                        const updated = [...currentContent.ethos];
                        updated[idx].img = url;
                        setSiteContent((prev) => ({ ...prev, home: { ...prev.home, ethos: updated } }));
                      }}
                      onUpload={handleImageUpload}
                      isUploading={isUploading}
                    />
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Title</label>
                      <input type="text" value={card.title} onChange={(e) => {
                        const updated = [...currentContent.ethos];
                        updated[idx].title = e.target.value;
                        setSiteContent((prev) => ({ ...prev, home: { ...prev.home, ethos: updated } }));
                      }} className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Description</label>
                      <textarea rows={3} value={card.desc} onChange={(e) => {
                        const updated = [...currentContent.ethos];
                        updated[idx].desc = e.target.value;
                        setSiteContent((prev) => ({ ...prev, home: { ...prev.home, ethos: updated } }));
                      }} className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none" />
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
                  <input type="text" value={currentContent.story.tag} onChange={(e) => updateField("story", "tag", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Heading</label>
                  <input type="text" value={currentContent.story.title} onChange={(e) => updateField("story", "title", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                  <textarea rows={4} value={currentContent.story.description} onChange={(e) => updateField("story", "description", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                </div>
                <ImageUploader
                  label="Side Photo"
                  value={currentContent.story.image}
                  onChange={(url) => updateField("story", "image", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            {/* BOTTOM PROMISE */}
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">4. Bottom Artisan Promise Banner</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Banner Title</label>
                  <input type="text" value={currentContent.promise.title} onChange={(e) => updateField("promise", "title", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Button Text</label>
                  <input type="text" value={currentContent.promise.ctaText} onChange={(e) => updateField("promise", "ctaText", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none" />
                </div>
                <ImageUploader
                  label="Full Bleed Background Image"
                  value={currentContent.promise.image}
                  onChange={(url) => updateField("promise", "image", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLLECTIONS PAGE */}
        {activeTab === "collections" && (
          <div className="space-y-10">
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <div className="flex items-center justify-between border-b border-[#DFD8CC] pb-3 mb-6">
                <div>
                  <h2 className="text-lg font-serif text-[#3A332C]">Collections Page Header</h2>
                  <p className="text-xs text-[#7A7065] mt-1">Leave background image blank to keep standard light background.</p>
                </div>
                {currentContent.hero.bgImage && (
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tagline (Top Small Text)</label>
                  <input
                    type="text"
                    value={currentContent.hero.tag || ""}
                    onChange={(e) => updateField("hero", "tag", e.target.value)}
                    placeholder="e.g. THE"
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Main Heading</label>
                  <input
                    type="text"
                    value={currentContent.hero.title || ""}
                    onChange={(e) => updateField("hero", "title", e.target.value)}
                    placeholder="e.g. Artisanal Floor Sculptures"
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={currentContent.hero.description || ""}
                    onChange={(e) => updateField("hero", "description", e.target.value)}
                    placeholder="Browse our hand-braided rPET area rugs..."
                    className="w-full border border-[#DFD8CC] p-3 text-sm outline-none focus:border-[#C19A6B]"
                  />
                </div>

                <ImageUploader
                  label="Header Background Image (Optional)"
                  value={currentContent.hero.bgImage || ""}
                  onChange={(url) => updateField("hero", "bgImage", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OUR LEGACY */}
        {activeTab === "legacy" && (
          <div className="space-y-10">
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">Legacy Hero Section</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tag</label>
                  <input type="text" value={currentContent.hero.tag} onChange={(e) => updateField("hero", "tag", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Title</label>
                  <input type="text" value={currentContent.hero.title} onChange={(e) => updateField("hero", "title", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Subtitle</label>
                  <input type="text" value={currentContent.hero.subtitle} onChange={(e) => updateField("hero", "subtitle", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                  <textarea rows={3} value={currentContent.hero.description} onChange={(e) => updateField("hero", "description", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <ImageUploader
                  label="Hero Heritage Image"
                  value={currentContent.hero.bgImage}
                  onChange={(url) => updateField("hero", "bgImage", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">Craftsmanship Feature Section</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Feature Tag</label>
                  <input type="text" value={currentContent.section1.tag} onChange={(e) => updateField("section1", "tag", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Feature Heading</label>
                  <input type="text" value={currentContent.section1.title} onChange={(e) => updateField("section1", "title", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Text Content</label>
                  <textarea rows={4} value={currentContent.section1.text} onChange={(e) => updateField("section1", "text", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <ImageUploader
                  label="Weaving Machinery / Artisan Photo"
                  value={currentContent.section1.image}
                  onChange={(url) => updateField("section1", "image", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ABOUT US */}
        {activeTab === "about" && (
          <div className="space-y-10">
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">About Us Hero</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tag</label>
                  <input type="text" value={currentContent.hero.tag} onChange={(e) => updateField("hero", "tag", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Title</label>
                  <input type="text" value={currentContent.hero.title} onChange={(e) => updateField("hero", "title", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                  <textarea rows={3} value={currentContent.hero.description} onChange={(e) => updateField("hero", "description", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <ImageUploader
                  label="About Hero Image"
                  value={currentContent.hero.bgImage}
                  onChange={(url) => updateField("hero", "bgImage", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">Mission & Fiber Science</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Mission Heading</label>
                  <input type="text" value={currentContent.mission.title} onChange={(e) => updateField("mission", "title", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Mission Statement</label>
                  <textarea rows={4} value={currentContent.mission.text} onChange={(e) => updateField("mission", "text", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <ImageUploader
                  label="Recycled Yarn / Wool Feel Image"
                  value={currentContent.mission.image}
                  onChange={(url) => updateField("mission", "image", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT */}
        {activeTab === "contact" && (
          <div className="space-y-10">
            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">Contact Page Header</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tag</label>
                  <input type="text" value={currentContent.header.tag} onChange={(e) => updateField("header", "tag", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Title</label>
                  <input type="text" value={currentContent.header.title} onChange={(e) => updateField("header", "title", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                  <textarea rows={2} value={currentContent.header.description} onChange={(e) => updateField("header", "description", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <ImageUploader
                  label="Header Image"
                  value={currentContent.header.bgImage}
                  onChange={(url) => updateField("header", "bgImage", url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </div>
            </div>

            <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
              <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">Workshop & Concierge Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Workshop Address</label>
                  <input type="text" value={currentContent.info.address} onChange={(e) => updateField("info", "address", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Email Address</label>
                  <input type="text" value={currentContent.info.email} onChange={(e) => updateField("info", "email", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Phone / WhatsApp</label>
                  <input type="text" value={currentContent.info.phone} onChange={(e) => updateField("info", "phone", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Operational Hours</label>
                  <input type="text" value={currentContent.info.hours} onChange={(e) => updateField("info", "hours", e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}