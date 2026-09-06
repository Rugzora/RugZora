"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

const defaultHomeContent = {
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
    description: "Operating right from Bhadohi, India's world-renowned 'Carpet City', RugZora bridges ancient braiding legacy with conscious innovation.",
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
    desc: "Zero plastic stiffness. By micro-spinning recycled polyester, our rugs offer pure wool-grade plushness without scratching skin.",
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
};

const NAV_TABS = [
  { label: "HOME", href: "/admin/content", active: true },
  { label: "COLLECTIONS", href: "/admin/collections" },
  { label: "OUR LEGACY", href: "/admin/legacy" },
  { label: "ABOUT US", href: "/admin/about" },
  { label: "CONTACT", href: "/admin/contact" },
];

export default function HomeAdminPage() {
  const [content, setContent] = useState<any>(defaultHomeContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "home")
          .maybeSingle();

        if (error) {
          console.error("Supabase load error:", error);
        }

        if (data && data.data) {
          setContent((prev: any) => ({
            ...prev,
            ...data.data,
            hero: { ...prev.hero, ...data.data.hero },
            ethos: Array.isArray(data.data.ethos) ? data.data.ethos : prev.ethos,
            story: { ...prev.story, ...data.data.story },
            silhouettesHeader: { ...prev.silhouettesHeader, ...data.data.silhouettesHeader },
            silhouettes: Array.isArray(data.data.silhouettes) ? data.data.silhouettes : prev.silhouettes,
            materialScience: { ...prev.materialScience, ...data.data.materialScience },
            textureLibrary: { ...prev.textureLibrary, ...data.data.textureLibrary },
            spacesHeader: { ...prev.spacesHeader, ...data.data.spacesHeader },
            spaces: Array.isArray(data.data.spaces) ? data.data.spaces : prev.spaces,
            promise: { ...prev.promise, ...data.data.promise }
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    setIsUploading(true);
    setStatusMsg(`Uploading "${file.name}"...`);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `home-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const { error } = await supabase.storage.from("product-images").upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
      callback(data.publicUrl);
      setStatusMsg("Photo uploaded successfully! ✔");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
      setStatusMsg("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMsg("Saving changes for Home Page...");
    try {
      const { data, error } = await supabase
        .from("site_content")
        .upsert(
          {
            id: "home",
            data: content,
            updated_at: new Date().toISOString()
          },
          { onConflict: "id" }
        )
        .select();

      if (error) throw error;

      setStatusMsg("Home Page updated live! ✔");
      setTimeout(() => setStatusMsg(""), 4000);
    } catch (err: any) {
      console.error("Save error:", err);
      alert("Failed to save: " + (err.message || JSON.stringify(err)));
      setStatusMsg("");
    } finally {
      setIsSaving(false);
    }
  };

  // State Update Helpers (handles empty strings without defaulting back)
  const updateObj = (section: string, field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArr = (section: string, idx: number, field: string, value: string) => {
    setContent((prev: any) => {
      const newArr = [...(prev[section] || [])];
      newArr[idx] = { ...newArr[idx], [field]: value };
      return { ...prev, [section]: newArr };
    });
  };

  const updateTextureImg = (idx: number, url: string) => {
    setContent((prev: any) => {
      const newImgs = [...(prev.textureLibrary?.images || [])];
      newImgs[idx] = url;
      return {
        ...prev,
        textureLibrary: {
          ...prev.textureLibrary,
          images: newImgs
        }
      };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] pt-32 text-center text-[#C19A6B] font-serif text-lg animate-pulse">
        Loading Home Editor...
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-20 pb-32 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="bg-white p-4 border border-[#EBE5DA] rounded-sm shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7A63] mr-2">
              Select Page:
            </span>
            {NAV_TABS.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all ${
                  tab.active
                    ? "bg-[#3A332C] text-[#F8F5F0] shadow-sm"
                    : "bg-[#F8F5F0] text-[#6B6054] hover:bg-[#EBE5DA]"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs uppercase font-semibold text-[#8C7A63] hover:text-[#3A332C] px-3 py-2 border border-[#DFD8CC] rounded-sm"
            >
              View Live ↗
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#C19A6B] text-white hover:bg-[#3A332C] transition-colors px-6 py-2 text-xs uppercase font-bold tracking-widest rounded-sm shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-sm">
            {statusMsg}
          </div>
        )}

        <div className="space-y-10">
          {/* 1. HERO SECTION (WITH LIVE FONT RESIZING & BLANK HIDING) */}
          <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
            <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">
              1. Hero Section (Text & Typography)
            </h2>
            <div className="space-y-6">
              {/* Tagline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                    Tagline (Khali chhodne par hide ho jayega)
                  </label>
                  <input
                    type="text"
                    value={content.hero?.tag ?? ""}
                    onChange={(e) => updateObj("hero", "tag", e.target.value)}
                    placeholder="Bespoke Artisanal Floor Coverings"
                    className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                    Font Size: {content.hero?.tagSize || 12}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="22"
                    value={content.hero?.tagSize || 12}
                    onChange={(e) => updateObj("hero", "tagSize", Number(e.target.value))}
                    className="w-full accent-[#C19A6B]"
                  />
                </div>
              </div>

              {/* Heading Line 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                    Heading Line 1 (Khali chhodne par hide ho jayega)
                  </label>
                  <input
                    type="text"
                    value={content.hero?.title ?? ""}
                    onChange={(e) => updateObj("hero", "title", e.target.value)}
                    placeholder="Eco-Conscious Luxury."
                    className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                    Font Size: {content.hero?.titleSize || 64}px
                  </label>
                  <input
                    type="range"
                    min="32"
                    max="96"
                    value={content.hero?.titleSize || 64}
                    onChange={(e) => updateObj("hero", "titleSize", Number(e.target.value))}
                    className="w-full accent-[#C19A6B]"
                  />
                </div>
              </div>

              {/* Subtitle Line 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                    Subtitle Line 2 (Khali chhodne par hide ho jayega)
                  </label>
                  <input
                    type="text"
                    value={content.hero?.subtitle ?? ""}
                    onChange={(e) => updateObj("hero", "subtitle", e.target.value)}
                    placeholder="Born in The Carpet City."
                    className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                    Font Size: {content.hero?.subtitleSize || 48}px
                  </label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={content.hero?.subtitleSize || 48}
                    onChange={(e) => updateObj("hero", "subtitleSize", Number(e.target.value))}
                    className="w-full accent-[#C19A6B]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                    Description (Khali chhodne par hide ho jayega)
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero?.description ?? ""}
                    onChange={(e) => updateObj("hero", "description", e.target.value)}
                    placeholder="Handcrafted chunky braided rugs..."
                    className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                    Font Size: {content.hero?.descriptionSize || 16}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={content.hero?.descriptionSize || 16}
                    onChange={(e) => updateObj("hero", "descriptionSize", Number(e.target.value))}
                    className="w-full accent-[#C19A6B]"
                  />
                </div>
              </div>

              {/* Button 1 Text */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">
                  Button Text (Khali chhodne par button hide ho jayega)
                </label>
                <input
                  type="text"
                  value={content.hero?.ctaText ?? ""}
                  onChange={(e) => updateObj("hero", "ctaText", e.target.value)}
                  placeholder="Explore Handcrafted Rugs"
                  className="w-full border border-[#DFD8CC] p-3 text-sm focus:border-[#C19A6B] outline-none"
                />
              </div>

              <ImageUploader
                label="Hero Background Image"
                value={content.hero?.bgImage || ""}
                onChange={(url) => updateObj("hero", "bgImage", url)}
                onUpload={handleImageUpload}
                isUploading={isUploading}
              />
            </div>
          </div>

          {/* 2. ETHOS CARDS */}
          <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
            <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">
              2. Three Brand Ethos Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.ethos?.map((card: any, idx: number) => (
                <div key={idx} className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 space-y-4 rounded-sm">
                  <ImageUploader
                    label={`Card #${idx + 1} Image`}
                    value={card.img}
                    onChange={(url) => updateArr("ethos", idx, "img", url)}
                    onUpload={handleImageUpload}
                    isUploading={isUploading}
                  />
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title ?? ""}
                      onChange={(e) => updateArr("ethos", idx, "title", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={card.desc ?? ""}
                      onChange={(e) => updateArr("ethos", idx, "desc", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. STORY */}
          <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
            <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">
              3. Heritage & Story Section
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Tag</label>
                <input
                  type="text"
                  value={content.story?.tag ?? ""}
                  onChange={(e) => updateObj("story", "tag", e.target.value)}
                  className="w-full border border-[#DFD8CC] p-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Heading</label>
                <input
                  type="text"
                  value={content.story?.title ?? ""}
                  onChange={(e) => updateObj("story", "title", e.target.value)}
                  className="w-full border border-[#DFD8CC] p-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Description</label>
                <textarea
                  rows={4}
                  value={content.story?.description ?? ""}
                  onChange={(e) => updateObj("story", "description", e.target.value)}
                  className="w-full border border-[#DFD8CC] p-3 text-sm outline-none"
                />
              </div>
              <ImageUploader
                label="Story Image"
                value={content.story?.image || ""}
                onChange={(url) => updateObj("story", "image", url)}
                onUpload={handleImageUpload}
                isUploading={isUploading}
              />
            </div>
          </div>

          {/* 4. SILHOUETTES */}
          <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
            <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">
              4. Signature Silhouettes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Section Title</label>
                <input
                  type="text"
                  value={content.silhouettesHeader?.title ?? ""}
                  onChange={(e) => updateObj("silhouettesHeader", "title", e.target.value)}
                  className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A63] mb-2">Section Description</label>
                <input
                  type="text"
                  value={content.silhouettesHeader?.desc ?? ""}
                  onChange={(e) => updateObj("silhouettesHeader", "desc", e.target.value)}
                  className="w-full border border-[#DFD8CC] p-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.silhouettes?.map((card: any, idx: number) => (
                <div key={idx} className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 space-y-4 rounded-sm">
                  <ImageUploader
                    label={`Silhouette #${idx + 1}`}
                    value={card.img}
                    onChange={(url) => updateArr("silhouettes", idx, "img", url)}
                    onUpload={handleImageUpload}
                    isUploading={isUploading}
                  />
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title ?? ""}
                      onChange={(e) => updateArr("silhouettes", idx, "title", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={card.desc ?? ""}
                      onChange={(e) => updateArr("silhouettes", idx, "desc", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. TEXTURE LIBRARY */}
          <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
            <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">
              5. The Texture Library (4 Swatches)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 rounded-sm">
                  <ImageUploader
                    label={`Swatch #${idx + 1}`}
                    value={content.textureLibrary?.images?.[idx] || ""}
                    onChange={(url) => updateTextureImg(idx, url)}
                    onUpload={handleImageUpload}
                    isUploading={isUploading}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 6. LIVING SPACES */}
          <div className="bg-white p-8 border border-[#EBE5DA] rounded-sm shadow-sm">
            <h2 className="text-lg font-serif text-[#3A332C] mb-6 border-b border-[#DFD8CC] pb-3">
              6. Designed For Living Spaces
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.spaces?.map((card: any, idx: number) => (
                <div key={idx} className="border border-[#DFD8CC] p-4 bg-[#F8F5F0]/60 space-y-4 rounded-sm">
                  <ImageUploader
                    label={`Space #${idx + 1}`}
                    value={card.img}
                    onChange={(url) => updateArr("spaces", idx, "img", url)}
                    onUpload={handleImageUpload}
                    isUploading={isUploading}
                  />
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title ?? ""}
                      onChange={(e) => updateArr("spaces", idx, "title", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C7A63] mb-1">Link Label</label>
                    <input
                      type="text"
                      value={card.link ?? ""}
                      onChange={(e) => updateArr("spaces", idx, "link", e.target.value)}
                      className="w-full border border-[#DFD8CC] p-2 text-sm bg-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}