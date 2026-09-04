"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

const InputField = ({ label, name, placeholder, required = false, type = "text", value, onChange }: any) => (
  <div className="w-full">
    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3A332C] mb-2">{label}</label>
    <input 
      type={type} 
      name={name} 
      required={required} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      className="w-full border border-[#DFD8CC] p-3 text-sm focus:outline-none focus:border-[#C19A6B]" 
    />
  </div>
);

type ImageFile = { id: string; file: File | null; preview: string; isExisting: boolean; };

export default function AdminUpload() {
  const [loadingAction, setLoadingAction] = useState<"publish" | "draft" | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingProductId, setEditingProductId] = useState<string>("");

  const [images, setImages] = useState<ImageFile[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  const [globalUsdRate, setGlobalUsdRate] = useState<string>("83.50");
  const [initialUsdRate, setInitialUsdRate] = useState<string>("83.50");
  const [isSavingRate, setIsSavingRate] = useState(false);
  const [rateSavedSuccess, setRateSavedSuccess] = useState(false);

  const [showCelebration, setShowCelebration] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const defaultCategories = [
    "Rectangular",
    "Round & Oval",
    "Runners",
    "Traditional"
  ];

  const initialFormState = {
    name: "", original_name: "", sku: "", quantity: "1", 
    category: "Rectangular", custom_category: "", 
    color: "", shape: "Rectangular", style: "", room: "", pattern: "", material: "100% Recycled PET (rPET)",
    tags: "", features: "100% Reversible, Shed-free, Stain-resistant, Wool-like soft feel", description: "",
    processing_type: "Made to Order",
    care_instructions: "Spot clean or hose wash. Do not machine wash.", processing_time: "2-3 business days", return_policy: "Returns accepted within 14 days",
    is_customizable: false,
    customization_surcharge: "20",
    free_delivery: false,
    show_etsy: false,
    etsy_url: "",
    related_products: [] as string[],
    variants: [{ dimensions: "", unit: "ft", price: "" }] 
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    const { data: products } = await supabase.from("products").select("id, name, images").order("created_at", { ascending: false });
    if (products) setAvailableProducts(products);

    const { data: settings } = await supabase.from("store_settings").select("usd_rate").eq("id", 1).maybeSingle();
    if (settings && settings.usd_rate) {
      setGlobalUsdRate(settings.usd_rate.toString());
      setInitialUsdRate(settings.usd_rate.toString());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveGlobalRate = async () => {
    setIsSavingRate(true);
    await supabase.from("store_settings").upsert({ id: 1, usd_rate: parseFloat(globalUsdRate) });
    setInitialUsdRate(globalUsdRate);
    setIsSavingRate(false);
    
    setRateSavedSuccess(true);
    setTimeout(() => setRateSavedSuccess(false), 3000);
  };

  const parseSizeStr = (sizeStr: string) => {
    const match = sizeStr.match(/(.*?)\s*(ft|cm|m|in)$/i);
    if (match) return { dimensions: match[1].trim(), unit: match[2].toLowerCase() };
    return { dimensions: sizeStr.trim(), unit: "ft" };
  };

  const loadProductForEdit = async (productId: string) => {
    setEditingProductId(productId);
    if (!productId) {
      resetForm();
      return;
    }

    setLoadingAction("publish"); 
    setStatusMsg("Loading product details...");
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();
      if (error) throw error;
      if (data) {
        let loadedVariants = [];
        if (data.variants && data.variants.length > 0) {
          loadedVariants = data.variants.map((v: any) => ({
            ...parseSizeStr(v.size || ""),
            price: v.price ? v.price.toString().replace(/[^0-9.]/g, "") : ""
          }));
        } else {
          loadedVariants = [{ ...parseSizeStr(data.sizes?.[0] || ""), price: data.price ? data.price.replace(/[^0-9.]/g, "") : "" }];
        }

        const isCustomCategory = !defaultCategories.includes(data.category);

        setFormData({
          name: data.name || "",
          original_name: data.original_name || "",
          sku: data.sku || "",
          quantity: data.stock_quantity?.toString() || "1",
          category: isCustomCategory ? "Custom" : (data.category || defaultCategories[0]),
          custom_category: isCustomCategory ? data.category : "",
          color: data.color || "",
          shape: data.shape || "Rectangular",
          style: data.style || "",
          room: data.room || "",
          pattern: data.pattern || "",
          material: data.material || "100% Recycled PET (rPET)",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
          features: Array.isArray(data.features) ? data.features.join(", ") : (data.features || ""),
          description: data.description || "",
          processing_type: data.processing_type || "Made to Order",
          care_instructions: data.care_instructions || "",
          processing_time: data.processing_time || "",
          return_policy: data.return_policy || "",
          is_customizable: data.is_customizable || false,
          customization_surcharge: data.customization_surcharge?.toString() || "20",
          free_delivery: data.free_delivery || false,
          show_etsy: data.show_etsy || false,
          etsy_url: data.etsy_url || "",
          related_products: data.related_products || [],
          variants: loadedVariants
        });

        if (data.images && Array.isArray(data.images)) {
          setImages(data.images.map((url: string) => ({ id: Math.random().toString(36).substring(2, 9), file: null, preview: url, isExisting: true })));
        } else {
          setImages([]);
        }
      }
    } catch (err: any) {
      alert("Failed to load product.");
    } finally {
      setLoadingAction(null);
      setStatusMsg("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value });
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => setFormData({ ...formData, variants: [...formData.variants, { dimensions: "", unit: "ft", price: "" }] });

  const removeVariant = (index: number) => {
    if (formData.variants.length === 1) return alert("Must have at least one size variant.");
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) });
  };

  const handleRelatedProductChange = (productId: string) => {
    setFormData(prev => {
      const isSelected = prev.related_products.includes(productId);
      if (isSelected) return { ...prev, related_products: prev.related_products.filter(id => id !== productId) };
      if (prev.related_products.length >= 4) { alert("Maximum 4 related products allowed."); return prev; }
      return { ...prev, related_products: [...prev.related_products, productId] };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = selectedFiles.map(file => ({ id: Math.random().toString(36).substring(2, 9), file, preview: URL.createObjectURL(file), isExisting: false }));
      setImages(prev => [...prev, ...newImages]); 
    }
  };

  const removeImage = (indexToRemove: number) => setImages(images.filter((_, index) => index !== indexToRemove));

  const handleDragStart = (e: React.DragEvent, position: number) => { dragItem.current = position; };
  const handleDragEnter = (e: React.DragEvent, position: number) => { dragOverItem.current = position; };
  const handleDrop = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const copyImages = [...images];
      const dragItemContent = copyImages[dragItem.current];
      copyImages.splice(dragItem.current, 1);
      copyImages.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setImages(copyImages);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setImages([]);
    setStatusMsg("");
    setShowCelebration(false);
    setNewlyCreatedId(null);
    setEditingProductId("");
    fetchData();
  };

  const submitData = async (statusType: "publish" | "draft") => {
    if (images.length === 0) return alert("Please add at least 1 photo.");
    if (formData.variants.some(v => !v.dimensions || !v.price)) return alert("Please fill all size dimensions and price fields.");
    
    const finalCategory = formData.category === "Custom" ? formData.custom_category.trim() : formData.category;
    if (!finalCategory) return alert("Please specify a category.");

    if (formData.show_etsy && !formData.etsy_url.trim()) {
      return alert("Please enter the Etsy URL or uncheck the View on Etsy box.");
    }

    setLoadingAction(statusType); 
    setStatusMsg("Processing upload...");
    try {
      const finalImageUrls: string[] = [];
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.isExisting) {
          finalImageUrls.push(img.preview);
        } else if (img.file) {
          const fileExt = img.file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, img.file);
          if (uploadError) throw uploadError;
          const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
          finalImageUrls.push(publicUrlData.publicUrl);
        }
      }

      setStatusMsg("Saving product data...");
      const tagsArray = formData.tags.split(",").map((s) => s.trim()).filter(Boolean);
      const featuresArray = formData.features.split(",").map((s) => s.trim()).filter(Boolean);

      const constructedVariants = formData.variants.map(v => ({
        size: `${v.dimensions.trim()} ${v.unit}`,
        price: v.price
      }));
      
      const basePrice = constructedVariants[0].price;
      const sizesArray = constructedVariants.map(v => v.size);

      const productPayload = {
        name: formData.name, 
        original_name: formData.original_name,
        price: `₹${basePrice}`, 
        sizes: sizesArray, 
        variants: constructedVariants,
        sku: formData.sku,
        stock_quantity: parseInt(formData.quantity) || 1, 
        category: finalCategory, 
        color: formData.color,
        shape: formData.shape, style: formData.style, room: formData.room, pattern: formData.pattern, material: formData.material,
        tags: tagsArray, features: featuresArray, description: formData.description,
        processing_type: formData.processing_type,
        care_instructions: formData.care_instructions, processing_time: formData.processing_time, return_policy: formData.return_policy,
        is_customizable: formData.is_customizable, 
        customization_surcharge: parseFloat(formData.customization_surcharge) || 20,
        free_delivery: formData.free_delivery,
        show_etsy: formData.show_etsy,
        etsy_url: formData.etsy_url.trim(),
        images: finalImageUrls, 
        related_products: formData.related_products,
        status: statusType === "publish" ? "published" : "draft" 
      };

      let submittedId = null;

      if (mode === "create") {
        const { data: insertedData, error: dbError } = await supabase.from("products").insert([productPayload]).select("id").maybeSingle();
        if (dbError) throw dbError;
        submittedId = insertedData?.id;
      } else {
        const { error: updateError } = await supabase.from("products").update(productPayload).eq("id", editingProductId);
        if (updateError) throw updateError;
        submittedId = editingProductId;
      }

      if (submittedId) setNewlyCreatedId(submittedId);
      
      if (statusType === "publish") {
        setShowCelebration(true);
      } else {
        alert("Draft saved successfully!");
        if (mode === "create") resetForm();
      }
      
      setStatusMsg("");
      
    } catch (err: any) {
      setStatusMsg(`Error processing request: ${err.message || 'Please check database fields'}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-20 pb-24 px-6 relative">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-sm shadow-sm border border-[#EBE5DA]">
        
        {/* HEADER & GLOBAL SETTINGS */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#EBE5DA] pb-6">
          <div>
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs block mb-1">RugZora Studio CMS</span>
            <h1 className="text-3xl font-serif text-[#3A332C]">Listing Management</h1>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="flex bg-[#F8F5F0] p-1 rounded-sm border border-[#EBE5DA]">
              <button onClick={() => { setMode("create"); resetForm(); }} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded-sm ${mode === "create" ? "bg-white text-[#C19A6B] shadow-sm border border-[#DFD8CC]" : "text-[#7A7065] hover:text-[#3A332C]"}`}>Create New</button>
              <button onClick={() => setMode("edit")} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded-sm ${mode === "edit" ? "bg-white text-[#C19A6B] shadow-sm border border-[#DFD8CC]" : "text-[#7A7065] hover:text-[#3A332C]"}`}>Edit Existing</button>
            </div>

            <div className="flex items-center gap-3 bg-white border border-[#DFD8CC] px-4 py-2 rounded-sm shadow-sm h-[42px]">
              <span className="text-xs font-semibold text-[#3A332C] uppercase tracking-wider">Global Rate: 1 USD =</span>
              <div className="flex items-center gap-2">
                <span className="text-[#6B6054] font-medium">₹</span>
                <input type="number" value={globalUsdRate} onChange={(e) => setGlobalUsdRate(e.target.value)} className="w-20 text-sm font-semibold text-[#C19A6B] border-b border-[#DFD8CC] focus:outline-none focus:border-[#C19A6B] text-center bg-transparent" />
              </div>
              
              {globalUsdRate !== initialUsdRate && !rateSavedSuccess && (
                <button onClick={saveGlobalRate} disabled={isSavingRate} className="text-[10px] uppercase bg-[#3A332C] text-white px-3 py-1.5 rounded-sm hover:bg-[#C19A6B] transition-colors">{isSavingRate ? "..." : "Save"}</button>
              )}
              {rateSavedSuccess && (
                <span className="text-[11px] uppercase tracking-widest text-emerald-600 font-bold px-2">Saved ✔</span>
              )}
            </div>
          </div>
        </div>

        {mode === "edit" && (
          <div className="mb-8 p-6 bg-[#F8F5F0] border border-[#DFD8CC] rounded-sm">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3A332C] mb-3">Select Product to Edit</label>
            <select value={editingProductId} onChange={(e) => loadProductForEdit(e.target.value)} className="w-full border border-[#DFD8CC] p-3 text-sm focus:outline-none focus:border-[#C19A6B] bg-white cursor-pointer">
              <option value="">-- Select a product --</option>
              {availableProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}

        {statusMsg && <div className="mb-6 p-4 bg-[#F4F0E8] border border-[#C19A6B] text-[#3A332C] text-sm font-medium">{statusMsg}</div>}

        <form className={`space-y-10 ${(mode === "edit" && !editingProductId) ? "opacity-40 pointer-events-none" : ""}`}>
          
          <div>
            <h3 className="text-lg font-serif text-[#3A332C] mb-4 border-b border-[#DFD8CC] pb-2">1. Basic Information & Pricing Variants</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              
              <InputField label="Carpet Title (Public) *" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Royal Golden Jute Rug" />
              
              <InputField label="Original Name (Optional - Internal)" name="original_name" value={formData.original_name} onChange={handleInputChange} placeholder="e.g. Artisan Design Alpha" />
              
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3A332C] mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-[#DFD8CC] p-3 text-sm focus:outline-none focus:border-[#C19A6B] bg-white mb-2">
                  {defaultCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Custom">Custom (Type your own)</option>
                </select>
                {formData.category === "Custom" && (
                  <input 
                    type="text" name="custom_category" value={formData.custom_category} onChange={handleInputChange} 
                    placeholder="Enter custom category..." 
                    className="w-full border border-[#C19A6B] bg-[#F8F5F0] p-3 text-sm focus:outline-none" 
                  />
                )}
              </div>

            </div>

            <div className="bg-[#F8F5F0] p-6 border border-[#EBE5DA] rounded-sm">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3A332C] mb-4">Size & Price Configurations</label>
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-end gap-4 bg-white p-4 border border-[#DFD8CC] shadow-sm rounded-sm">
                    <div className="w-full">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3A332C] mb-2">Dimensions & Unit</label>
                      <div className="flex">
                        <input type="text" required value={variant.dimensions} onChange={(e) => handleVariantChange(index, 'dimensions', e.target.value)} placeholder="e.g. 3 x 5" className="w-2/3 border border-[#DFD8CC] border-r-0 p-3 text-sm focus:outline-none focus:border-[#C19A6B]" />
                        <select value={variant.unit} onChange={(e) => handleVariantChange(index, 'unit', e.target.value)} className="w-1/3 border border-[#DFD8CC] p-3 text-sm focus:outline-none focus:border-[#C19A6B] bg-[#F8F5F0]">
                          <option value="ft">ft</option>
                          <option value="cm">cm</option>
                          <option value="m">m</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>
                    <InputField label="Base Price (in ₹)" type="number" required value={variant.price} onChange={(e: any) => handleVariantChange(index, 'price', e.target.value)} placeholder="e.g. 4500" />
                    <button type="button" onClick={() => removeVariant(index)} className="px-4 py-3 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors uppercase tracking-wider mb-px shrink-0">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addVariant} className="text-[#C19A6B] text-xs font-bold uppercase tracking-wider hover:text-[#3A332C] flex items-center gap-2 mt-4">
                  <span>+ Add New Size Variant</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif text-[#3A332C] mb-4 border-b border-[#DFD8CC] pb-2">2. Visuals</h3>
            <div className="flex items-center gap-4">
              <label className="bg-[#EBE5DA] text-[#3A332C] px-6 py-3 text-xs tracking-wider uppercase font-semibold cursor-pointer hover:bg-[#C19A6B] hover:text-white transition-colors rounded-sm">
                + Select Images
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <span className="text-xs text-[#7A7065]">Drag and drop to rearrange order.</span>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6 p-4 bg-[#F8F5F0] border border-[#EBE5DA] rounded-sm">
                {images.map((img, index) => (
                  <div
                    key={img.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDrop} onDragOver={(e) => e.preventDefault()}
                    className={`relative aspect-square cursor-grab active:cursor-grabbing rounded-sm overflow-hidden border-2 transition-colors ${index === 0 ? "border-[#C19A6B] shadow-md" : "border-transparent hover:border-[#DFD8CC]"}`}
                  >
                    <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✕</button>
                    {index === 0 && <div className="absolute bottom-0 left-0 w-full bg-[#C19A6B] text-white text-[10px] text-center py-1 uppercase tracking-wider font-semibold">Thumbnail</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-serif text-[#3A332C] mb-4 border-b border-[#DFD8CC] pb-2">3. Search & Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <InputField label="Primary Color" name="color" value={formData.color} onChange={handleInputChange} placeholder="e.g. Ivory, Navy Blue" />
              <InputField label="Shape" name="shape" value={formData.shape} onChange={handleInputChange} placeholder="e.g. Rectangular, Round" />
              <InputField label="Style" name="style" value={formData.style} onChange={handleInputChange} placeholder="e.g. Bohemian, Minimalist" />
              <InputField label="Pattern" name="pattern" value={formData.pattern} onChange={handleInputChange} placeholder="e.g. Geometric, Floral" />
              <InputField label="Room Context" name="room" value={formData.room} onChange={handleInputChange} placeholder="e.g. Living Room, Bedroom" />
              <InputField label="Material Composition" name="material" value={formData.material} onChange={handleInputChange} placeholder="e.g. 100% Recycled PET (rPET)" />
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3A332C] mb-2">Description *</label>
                <textarea name="description" required rows={4} value={formData.description} onChange={handleInputChange} placeholder="Detailed product description..." className="w-full border border-[#DFD8CC] p-3 text-sm focus:outline-none focus:border-[#C19A6B]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Tags (Comma Separated)" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="handmade rug, living room carpet" />
                <InputField label="Features (Comma Separated)" name="features" value={formData.features} onChange={handleInputChange} placeholder="100% Reversible, Shed-free, Stain-resistant" />
                <InputField label="Care Instructions" name="care_instructions" value={formData.care_instructions} onChange={handleInputChange} placeholder="Spot clean or hose wash..." />
                <InputField label="SKU / Internal Ref" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="e.g. RUG-PET-001" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif text-[#3A332C] mb-4 border-b border-[#DFD8CC] pb-2">4. Processing, Logistics & External Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3A332C] mb-2">Processing Type</label>
                <select name="processing_type" value={formData.processing_type} onChange={handleInputChange} className="w-full border border-[#DFD8CC] p-3 text-sm focus:outline-none focus:border-[#C19A6B] bg-white">
                  <option value="Made to Order">Made to Order</option>
                  <option value="Ready to Ship">Ready to Ship</option>
                </select>
              </div>

              <InputField label="Estimated Processing Time" name="processing_time" value={formData.processing_time} onChange={handleInputChange} placeholder="e.g. 2-3 days" />
              <InputField label="Inventory Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-start">
               <InputField label="Return Policy" name="return_policy" value={formData.return_policy} onChange={handleInputChange} placeholder="e.g. Returns accepted within 14 days" />
               
               <div className="flex flex-col space-y-3">
                  <div className="flex flex-col bg-[#F8F5F0] p-3 border border-[#EBE5DA] rounded-sm gap-3">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" name="is_customizable" id="is_customizable" checked={formData.is_customizable} onChange={handleInputChange} className="w-4 h-4 text-[#C19A6B] border-[#DFD8CC] focus:ring-[#C19A6B]" />
                      <label htmlFor="is_customizable" className="text-sm text-[#3A332C] font-medium cursor-pointer">Accept Customization Requests</label>
                    </div>
                    
                    {formData.is_customizable && (
                      <div className="pl-7">
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C7A63] mb-1">Customization Surcharge (%)</label>
                        <div className="flex items-center gap-2">
                          <span className="text-[#6B6054] font-medium">+</span>
                          <input type="number" name="customization_surcharge" value={formData.customization_surcharge} onChange={handleInputChange} placeholder="20" className="w-20 border-b border-[#DFD8CC] bg-transparent p-1 text-sm focus:outline-none focus:border-[#C19A6B] text-[#3A332C]" />
                          <span className="text-[#6B6054] font-medium">%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 bg-emerald-50 p-3 border border-emerald-100 rounded-sm">
                    <input type="checkbox" name="free_delivery" id="free_delivery" checked={formData.free_delivery} onChange={handleInputChange} className="w-4 h-4 text-emerald-600 border-emerald-200 focus:ring-emerald-500" />
                    <label htmlFor="free_delivery" className="text-sm text-emerald-800 font-bold cursor-pointer">Offer Free Worldwide Delivery</label>
                  </div>

                  {/* 🌟 VIEW ON ETSY CONFIGURATION */}
                  <div className="flex flex-col bg-[#FAF7F2] p-4 border border-[#E4DCce] rounded-sm gap-3">
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        name="show_etsy" 
                        id="show_etsy" 
                        checked={formData.show_etsy} 
                        onChange={handleInputChange} 
                        className="w-4 h-4 text-[#C19A6B] border-[#DFD8CC] focus:ring-[#C19A6B]" 
                      />
                      <label htmlFor="show_etsy" className="text-sm text-[#3A332C] font-semibold cursor-pointer flex items-center gap-2">
                        <span>View on Etsy</span>
                        <span className="text-[10px] uppercase tracking-wider bg-[#F26522]/10 text-[#F26522] px-2 py-0.5 rounded font-bold">Channel</span>
                      </label>
                    </div>

                    {formData.show_etsy && (
                      <div className="pl-7 pt-1">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#8C7A63] mb-1.5">
                          Etsy Listing URL *
                        </label>
                        <input 
                          type="url" 
                          name="etsy_url" 
                          value={formData.etsy_url} 
                          onChange={handleInputChange} 
                          placeholder="https://www.etsy.com/listing/..." 
                          className="w-full border border-[#DFD8CC] bg-white p-2.5 text-sm focus:outline-none focus:border-[#C19A6B] text-[#3A332C]" 
                        />
                        <span className="text-[11px] text-[#7A7065] mt-1 block">
                          This will display a "View on Etsy" direct redirect button on the live product page.
                        </span>
                      </div>
                    )}
                  </div>

               </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between border-b border-[#DFD8CC] pb-2 mb-4">
              <h3 className="text-lg font-serif text-[#3A332C]">5. Related Products Merchandising</h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#EBE5DA] text-[#3A332C] rounded-full">
                {formData.related_products.length} / 4 Selected
              </span>
            </div>
            
            <p className="text-xs text-[#7A7065] mb-4 leading-relaxed">
              Select priorities (Max 4 items). They will appear on the product page in the exact sequence (#1, #2, #3, #4) selected.
            </p>
            
            <div className="max-h-64 overflow-y-auto border border-[#DFD8CC] rounded-sm p-4 bg-[#F8F5F0]/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availableProducts.length > 0 ? (
                availableProducts.filter(p => p.id !== editingProductId).map(p => {
                  const selectedIndex = formData.related_products.indexOf(p.id);
                  const isSelected = selectedIndex !== -1;

                  return (
                    <div 
                      key={p.id} 
                      onClick={() => handleRelatedProductChange(p.id)}
                      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-sm transition-all border relative select-none ${
                        isSelected ? 'bg-white border-[#C19A6B] shadow-sm ring-1 ring-[#C19A6B]' : 'bg-transparent border-transparent hover:bg-white hover:border-[#EBE5DA]'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                        isSelected ? 'bg-[#C19A6B] text-white shadow-sm' : 'border border-[#DFD8CC] text-[#7A7065] bg-white'
                      }`}>
                        {isSelected ? `#${selectedIndex + 1}` : ''}
                      </div>

                      <div className="w-10 h-10 bg-[#EBE5DA] rounded-sm overflow-hidden flex-shrink-0">
                        {p.images && p.images.length > 0 ? (
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#C19A6B] text-[10px]">No Img</div>
                        )}
                      </div>
                      <span className="text-sm text-[#3A332C] font-medium truncate flex-1" title={p.name}>{p.name}</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-sm text-[#7A7065] text-center py-6">No published products available.</div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4 border-t border-[#DFD8CC]">
            <button 
              type="button" 
              onClick={() => submitData("draft")} 
              disabled={loadingAction !== null || (mode === "edit" && !editingProductId)} 
              className="w-full sm:w-1/3 bg-[#F8F5F0] border-2 border-[#DFD8CC] text-[#6B6054] py-4 text-sm tracking-[0.2em] uppercase font-bold hover:bg-[#EBE5DA] hover:text-[#3A332C] transition duration-300 disabled:opacity-50"
            >
              {loadingAction === "draft" ? "Saving..." : "Save as Draft"}
            </button>
            <button 
              type="button" 
              onClick={() => submitData("publish")} 
              disabled={loadingAction !== null || (mode === "edit" && !editingProductId)} 
              className="w-full sm:w-2/3 bg-[#3A332C] text-[#F8F5F0] py-4 text-sm tracking-[0.2em] uppercase font-bold hover:bg-[#C19A6B] transition duration-300 disabled:opacity-50 shadow-lg"
            >
              {loadingAction === "publish" ? "Processing..." : (mode === "create" ? "Publish New Listing" : "Update Listing")}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.85, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 10 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-white rounded-sm max-w-md w-full p-8 text-center shadow-2xl border-t-4 border-emerald-500 relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 200 }} className="w-20 h-20 bg-emerald-50 border-2 border-emerald-400 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </motion.div>
              <h2 className="text-2xl font-serif text-[#3A332C] mb-2 font-medium">{mode === "create" ? "Listing Published!" : "Listing Updated!"}</h2>
              <p className="text-sm text-[#7A7065] mb-8 leading-relaxed">The product has been successfully {mode === "create" ? "published to" : "updated on"} the live store.</p>
              <div className="space-y-3">
                {newlyCreatedId && <Link href={`/product/${newlyCreatedId}`} target="_blank" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-xs uppercase tracking-[0.15em] font-semibold rounded-sm transition-colors shadow-md">View Live Listing ↗</Link>}
                <button type="button" onClick={resetForm} className="w-full border border-[#DFD8CC] text-[#3A332C] hover:bg-[#F8F5F0] py-3.5 text-xs uppercase tracking-[0.15em] font-semibold rounded-sm transition-colors">Close Menu</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}