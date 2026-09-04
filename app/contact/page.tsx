"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Contact() {
  const [contactData, setContactData] = useState<any>(null);

  useEffect(() => {
    async function loadContactContent() {
      try {
        const { data } = await supabase
          .from("site_content")
          .select("data")
          .eq("id", "contact")
          .maybeSingle();
        if (data && data.data) {
          setContactData(data.data);
        }
      } catch (err) {
        console.error("Error loading contact content:", err);
      }
    }
    loadContactContent();
  }, []);

  const title = contactData?.header?.title || "Connect With Us";
  const description = contactData?.header?.description || "For bespoke dimensions, bulk orders, or manufacturing inquiries directly from our Bhadohi unit.";
  const btnText = contactData?.header?.btnText || "Send Inquiry";
  const info = contactData?.info;

  return (
    <div className="pt-40 pb-24 px-6 max-w-2xl mx-auto min-h-screen font-sans">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif mb-4 text-[#3E362E]">
          {title}
        </h1>
        <p className="text-[#7A7265] text-sm leading-relaxed max-w-lg mx-auto">
          {description}
        </p>
      </div>
      
      <form className="space-y-10 bg-white/50 p-10 rounded-sm shadow-sm border border-[#EAE5D9]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="First Name" 
              className="w-full border-b border-[#DCD5C9] bg-transparent py-3 outline-none focus:border-[#C5A059] transition text-[#3E362E] placeholder-[#A39A8F]" 
            />
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Last Name" 
              className="w-full border-b border-[#DCD5C9] bg-transparent py-3 outline-none focus:border-[#C5A059] transition text-[#3E362E] placeholder-[#A39A8F]" 
            />
          </div>
        </div>

        <div className="relative">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full border-b border-[#DCD5C9] bg-transparent py-3 outline-none focus:border-[#C5A059] transition text-[#3E362E] placeholder-[#A39A8F]" 
          />
        </div>

        <div className="relative">
          <textarea 
            placeholder="Your Message" 
            rows={5} 
            className="w-full border-b border-[#DCD5C9] bg-transparent py-3 outline-none focus:border-[#C5A059] transition text-[#3E362E] placeholder-[#A39A8F] resize-none"
          ></textarea>
        </div>

        <button 
          type="button" 
          className="w-full bg-[#3E362E] text-white px-10 py-4 rounded-sm text-xs tracking-[0.2em] hover:bg-[#C5A059] transition duration-500 uppercase shadow-md font-semibold"
        >
          {btnText}
        </button>
      </form>

      {/* Workshop Direct Contact Info */}
      {(info?.address || info?.email || info?.phone) && (
        <div className="mt-16 pt-12 border-t border-[#DFD8CC] grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {info?.address && (
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#8C7A63] mb-1">Workshop</span>
              <p className="text-xs text-[#3E362E]">{info.address}</p>
            </div>
          )}
          {info?.email && (
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#8C7A63] mb-1">Inquiries</span>
              <p className="text-xs text-[#3E362E]">{info.email}</p>
            </div>
          )}
          {info?.phone && (
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#8C7A63] mb-1">Direct Line</span>
              <p className="text-xs text-[#3E362E]">{info.phone}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}