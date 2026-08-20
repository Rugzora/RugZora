"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

// Pre-defined elegant colors for carpets
const COLORS = [
  { name: 'Ivory', hex: '#FDFCF0' }, { name: 'Beige', hex: '#F5F5DC' }, { name: 'Oatmeal', hex: '#E3D8C4' },
  { name: 'Terracotta', hex: '#E2725B' }, { name: 'Rust', hex: '#b7410e' }, { name: 'Charcoal', hex: '#36454F' },
  { name: 'Navy', hex: '#1C2951' }, { name: 'Sage', hex: '#bcb88a' }, { name: 'Olive', hex: '#808000' },
  { name: 'Mustard', hex: '#ffdb58' }, { name: 'Blush', hex: '#F8C8DC' }, { name: 'Midnight', hex: '#0B1021' }
];

const SHAPES = ["Rectangular", "Round", "Oval", "Runner", "Square"];

export default function CustomizePage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Customization States
  const [shape, setShape] = useState("Rectangular");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [diameter, setDiameter] = useState(""); // For round
  const [unit, setUnit] = useState("ft");
  const [primaryColor, setPrimaryColor] = useState(COLORS[0]);
  const [secondaryColor, setSecondaryColor] = useState(COLORS[5]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [globalUsdRate, setGlobalUsdRate] = useState<number>(83.50);
  const [userCurrency, setUserCurrency] = useState("USD");

  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setUserCurrency(localStorage.getItem("user_currency") || "USD");
    const fetchInit = async () => {
      // Get Rate
      const { data: settings } = await supabase.from("store_settings").select("usd_rate").eq("id", 1).maybeSingle();
      if (settings?.usd_rate) setGlobalUsdRate(parseFloat(settings.usd_rate));

      // Get Product
      if (id) {
        const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
        if (data) {
          if (!data.is_customizable) {
            router.push(`/product/${id}`); // Redirect if not customizable
            return;
          }
          setProduct(data);
        }
      }
      setIsLoading(false);
    };
    fetchInit();
  }, [id, router]);

  // 🌟 Dynamic Custom Price Calculator
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) return;

    // Extract Base Rate per Square Foot from the first variant
    const baseVariant = product.variants[0];
    const basePriceStr = baseVariant.price.toString().replace(/[^0-9.]/g, "");
    const basePrice = parseFloat(basePriceStr) || 1;
    
    // Parse dimensions (e.g., "3 x 5 ft")
    const dimMatch = baseVariant.size?.match(/([\d.]+)\s*[xX]\s*([\d.]+)/);
    let baseArea = 15; // default 3x5
    if (dimMatch) {
      baseArea = parseFloat(dimMatch[1]) * parseFloat(dimMatch[2]);
    }
    const ratePerSqFt = basePrice / baseArea;

    // Calculate New Area based on user input
    let newArea = 0;
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const d = parseFloat(diameter) || 0;

    if (shape === "Round") {
      newArea = 3.14159 * Math.pow(d / 2, 2);
    } else {
      newArea = l * w;
    }

    // Default to a minimum size if nothing entered
    if (newArea === 0) newArea = baseArea;

    // Surcharge Logic (Default 20% if not set in DB)
    const surchargePercent = parseFloat(product.customization_surcharge) || 20;
    const multiplier = 1 + (surchargePercent / 100);

    const finalInrPrice = newArea * ratePerSqFt * multiplier;
    setCalculatedPrice(finalInrPrice);

  }, [length, width, diameter, shape, product]);

  const displayPrice = () => {
    const relativeRates: Record<string, number> = { USD: 1.00, EUR: 0.92, GBP: 0.79, CAD: 1.36, AUD: 1.53, INR: globalUsdRate };
    const targetRate = relativeRates[userCurrency] || 1;
    const converted = (calculatedPrice / globalUsdRate) * targetRate;
    const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", CAD: "CA$", AUD: "AU$", INR: "₹" };
    return `${symbols[userCurrency] || "$"}${converted.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (!length && !width && !diameter) return alert("Please enter custom dimensions.");
    setIsAdding(true);

    let customSizeStr = shape === "Round" ? `${diameter} ${unit} (Diameter)` : `${length} x ${width} ${unit}`;

    const customCartItem = {
      id: product.id + "_custom_" + Date.now(),
      product_id: product.id,
      name: `${product.name} (Custom)`,
      category: "Custom Order",
      image: product.images?.[0] || "",
      size: `${shape} - ${customSizeStr}`,
      price: calculatedPrice,
      quantity: 1,
      isCustom: true,
      customDetails: {
        shape, length, width, diameter, unit,
        primaryColor: primaryColor.name,
        secondaryColor: secondaryColor.name,
        instructions: specialInstructions
      }
    };

    const existingCart = JSON.parse(localStorage.getItem("rugzora_cart") || "[]");
    existingCart.push(customCartItem);
    localStorage.setItem("rugzora_cart", JSON.stringify(existingCart));
    
    window.dispatchEvent(new Event("cart_updated"));
    
    setTimeout(() => {
      setIsAdding(false);
      window.dispatchEvent(new Event("open_cart"));
      router.push(`/product/${id}`); // Redirect back to product page after adding
    }, 500);
  };

  if (isLoading) return <div className="text-center pt-40 pb-40 text-[#C19A6B] font-serif text-xl animate-pulse min-h-screen bg-[#F8F5F0]">Loading Studio...</div>;
  if (!product) return null;

  return (
    <div className="bg-[#F8F5F0] min-h-screen pt-32 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT: VISUAL PREVIEW & DETAILS */}
        <div className="w-full lg:w-5/12">
          <div className="sticky top-32">
            <button onClick={() => router.back()} className="text-xs uppercase tracking-widest text-[#8C7A63] hover:text-[#C19A6B] mb-6 flex items-center gap-2">
              ← Back to Product
            </button>
            <h1 className="text-4xl font-serif text-[#3A332C] mb-2">Bespoke Studio</h1>
            <p className="text-[#7A7065] text-sm leading-relaxed mb-8">
              Customizing: <strong className="text-[#3A332C]">{product.name}</strong>
            </p>
            
            <div className="aspect-square bg-[#EBE5DA] rounded-sm overflow-hidden shadow-inner relative mb-8">
              <img src={product.images?.[0]} alt="Preview" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
              {/* Dynamic Overlay Box just for visual feedback */}
              <div 
                className="absolute inset-4 border-2 border-dashed border-white/60 flex items-center justify-center backdrop-blur-sm bg-black/10 transition-all duration-500"
                style={{ borderRadius: shape === "Round" ? '50%' : shape === "Oval" ? '50% / 30%' : '4px' }}
              >
                 <div className="text-center text-white drop-shadow-md">
                   <span className="block text-2xl font-serif">{shape}</span>
                   <span className="block text-xs uppercase tracking-[0.2em] mt-2">
                     {shape === "Round" ? (diameter ? `${diameter} ${unit}` : 'Size') : (length && width ? `${length}x${width} ${unit}` : 'Size')}
                   </span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CUSTOMIZATION FORM */}
        <div className="w-full lg:w-7/12 bg-white p-8 md:p-12 border border-[#EBE5DA] shadow-xl rounded-sm">
          
          <h2 className="text-xl uppercase tracking-widest text-[#3A332C] font-semibold mb-8 border-b border-[#DFD8CC] pb-4">Configuration</h2>
          
          {/* 1. SHAPE */}
          <div className="mb-10">
            <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-4">1. Select Shape</label>
            <div className="flex flex-wrap gap-3">
              {SHAPES.map(s => (
                <button 
                  key={s} onClick={() => setShape(s)}
                  className={`px-5 py-3 text-sm font-semibold rounded-sm transition-all border ${shape === s ? 'border-[#C19A6B] bg-[#F8F5F0] text-[#C19A6B] shadow-inner' : 'border-[#DFD8CC] text-[#7A7065] hover:border-[#C19A6B]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 2. DIMENSIONS */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold">2. Dimensions</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="text-xs bg-[#F8F5F0] border border-[#DFD8CC] px-2 py-1 outline-none text-[#3A332C] font-bold">
                <option value="ft">Feet (ft)</option><option value="cm">Centimeters (cm)</option><option value="in">Inches (in)</option>
              </select>
            </div>
            
            {shape === "Round" ? (
              <div className="w-full md:w-1/2">
                <span className="text-[10px] uppercase text-[#7A7065] block mb-1">Diameter</span>
                <input type="number" placeholder="e.g. 8" value={diameter} onChange={(e) => setDiameter(e.target.value)} className="w-full border-b-2 border-[#DFD8CC] bg-transparent p-3 text-xl focus:outline-none focus:border-[#C19A6B] text-[#3A332C]" />
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <span className="text-[10px] uppercase text-[#7A7065] block mb-1">Length</span>
                  <input type="number" placeholder="e.g. 10" value={length} onChange={(e) => setLength(e.target.value)} className="w-full border-b-2 border-[#DFD8CC] bg-transparent p-3 text-xl focus:outline-none focus:border-[#C19A6B] text-[#3A332C]" />
                </div>
                <span className="text-2xl text-[#DFD8CC] pt-4">×</span>
                <div className="flex-1">
                  <span className="text-[10px] uppercase text-[#7A7065] block mb-1">Width</span>
                  <input type="number" placeholder="e.g. 8" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full border-b-2 border-[#DFD8CC] bg-transparent p-3 text-xl focus:outline-none focus:border-[#C19A6B] text-[#3A332C]" />
                </div>
              </div>
            )}
          </div>

          {/* 3. COLORS */}
          <div className="mb-10">
             <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-4">3. Palette Selection</label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               <div>
                 <span className="text-[10px] uppercase text-[#7A7065] block mb-3">Primary Color ({primaryColor.name})</span>
                 <div className="flex flex-wrap gap-2">
                   {COLORS.map(c => (
                     <button 
                       key={`p-${c.name}`} onClick={() => setPrimaryColor(c)} title={c.name}
                       className={`w-8 h-8 rounded-full border-2 transition-transform ${primaryColor.name === c.name ? 'border-[#C19A6B] scale-110 shadow-md' : 'border-transparent hover:scale-105 shadow-sm'}`}
                       style={{ backgroundColor: c.hex }}
                     />
                   ))}
                 </div>
               </div>

               <div>
                 <span className="text-[10px] uppercase text-[#7A7065] block mb-3">Secondary/Accent ({secondaryColor.name})</span>
                 <div className="flex flex-wrap gap-2">
                   {COLORS.map(c => (
                     <button 
                       key={`s-${c.name}`} onClick={() => setSecondaryColor(c)} title={c.name}
                       className={`w-8 h-8 rounded-full border-2 transition-transform ${secondaryColor.name === c.name ? 'border-[#C19A6B] scale-110 shadow-md' : 'border-transparent hover:scale-105 shadow-sm'}`}
                       style={{ backgroundColor: c.hex }}
                     />
                   ))}
                 </div>
               </div>

             </div>
          </div>

          {/* 4. NOTES */}
          <div className="mb-10">
            <label className="block text-xs uppercase tracking-widest text-[#8C7A63] font-bold mb-3">4. Artisan Notes (Optional)</label>
            <textarea 
              rows={3} 
              value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any specific pattern adjustments or finish requests..." 
              className="w-full border border-[#DFD8CC] p-4 text-sm focus:outline-none focus:border-[#C19A6B] bg-[#F8F5F0]" 
            />
          </div>

          {/* SUMMARY & ADD TO CART */}
          <div className="bg-[#3A332C] text-[#F8F5F0] p-8 -mx-8 md:-mx-12 -mb-8 md:-mb-12 mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C19A6B] block mb-1">Custom Order Total</span>
              <span className="text-4xl font-serif">{displayPrice()}</span>
              <span className="block text-[10px] opacity-70 mt-1">Includes artisan customization fees</span>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full md:w-auto bg-[#C19A6B] text-white px-10 py-5 uppercase tracking-[0.2em] text-sm font-semibold hover:bg-white hover:text-[#3A332C] transition-colors shadow-lg disabled:opacity-50"
            >
              {isAdding ? "Finalizing..." : "Add to Cart"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}