"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    step: "01",
    phase: "Instant Notification",
    title: "Order Received at Bhadohi Workshop",
    time: "Within 5 Minutes",
    desc: "The moment your order is placed, our manufacturing unit in Bhadohi receives the complete specification sheet—including exact dimensions, color codes, and custom shapes. We generate the dedicated artisan production slip immediately.",
    badge: "Step 1 • Digital Dispatch",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    )
  },
  {
    step: "02",
    phase: "Fiber Curation",
    title: "Sourcing Grade-A Recycled PET Fiber",
    time: "Day 1",
    desc: "We avoid mass-market synthetic fibers. For each commission, we curate premium recycled PET (rPET) yarn lots that deliver an itch-free, ultra-soft wool-like tactile texture while remaining 100% shed-free and hydrophobic.",
    badge: "Step 2 • Material Sourcing",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
      </svg>
    )
  },
  {
    step: "03",
    phase: "Braiding Craft",
    title: "Forming Chunky Structural Cords",
    time: "Day 1 - Day 2",
    desc: "Micro-spun yarns are multi-plied and twisted into heavy-gauge chunky braided cords. This durable architectural core gives the rug grounding weight, structural stability, and superior plush comfort underfoot.",
    badge: "Step 3 • Cord Spinning",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    )
  },
  {
    step: "04",
    phase: "Precision Weaving",
    title: "Heavy-Duty Zigzag Machine Stitching",
    time: "Day 2",
    desc: "Our artisans spiral the braided cords outward from center, locking each row with high-tension zigzag stitching. No latex backing or toxic chemical glue is used, resulting in a 100% reversible rug that doubles its lifespan.",
    badge: "Step 4 • Master Construction",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.07a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091.491.077 1.009-.07 1.488l-2.008 2.438" />
      </svg>
    )
  },
  {
    step: "05",
    phase: "Artisanal Inspection",
    title: "Tension Balance & Edge Finishing",
    time: "Day 3",
    desc: "Every rug is laid across calibration tables to ensure balanced planar tension and zero edge curl. Cord ends are hand-finished and tucked before undergoing thorough spill-repellency and dimensional verification.",
    badge: "Step 5 • Quality Assurance",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    step: "06",
    phase: "Eco Packaging & Courier",
    title: "Rolled & Dispatched from Bhadohi",
    time: "Day 3 - Day 4",
    desc: "Your piece is carefully rolled, encased in protective weather-shield packaging, and assigned an express global tracking code. Direct from our looms to your doorstep with zero middleman markup.",
    badge: "Step 6 • Direct Delivery",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    )
  }
];

export default function OrderProcessTimeline() {
  return (
    <div className="bg-[#F8F5F0] min-h-screen font-sans pt-28 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Breadcrumb & Header */}
        <div className="text-center mb-20">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C19A6B] font-semibold mb-4 hover:text-[#3A332C] transition-colors"
          >
            ← Back to RugZora Home
          </Link>
          <span className="block text-[11px] uppercase tracking-[0.3em] font-semibold text-[#8C7A63] mb-3">
            The Journey of Your Carpet
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3A332C] mb-6 leading-tight">
            See What We Do <br />
            <span className="italic font-light text-[#6B6054]">When You Place an Order.</span>
          </h1>
          <p className="text-base md:text-lg text-[#6B6054] font-light max-w-2xl mx-auto leading-relaxed">
            Instead of shipping aged inventory off a dusty warehouse shelf, we craft every carpet made-to-order. Here is our step-by-step artisanal journey from the loom to your room:
          </p>
        </div>

        {/* Timeline Graphic Container */}
        <div className="relative">
          
          {/* Vertical Connecting Central Line */}
          <div className="absolute left-6 md:left-1/2 top-8 bottom-8 w-[2px] bg-[#E0D8CA] -translate-x-1/2"></div>

          <div className="space-y-16 md:space-y-24">
            {steps.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  
                  {/* Center Node Circle */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#3A332C] text-[#F8F5F0] flex items-center justify-center shadow-lg border-4 border-[#F8F5F0] z-20">
                    <span className="font-serif text-sm font-bold">{item.step}</span>
                  </div>

                  {/* Content Card */}
                  <div className="ml-16 md:ml-0 md:w-1/2 md:px-10">
                    <div className="bg-white p-8 rounded-sm border border-[#EBE5DA] shadow-sm hover:shadow-xl transition-shadow duration-300 relative group">
                      
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-[#F8F5F0] text-[#C19A6B] rounded-xs border border-[#DFD8CC]">
                          {item.badge}
                        </span>
                        <span className="text-xs font-semibold text-[#8C7A63] tracking-wider">
                          ⏱ {item.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3 text-[#3A332C]">
                        <div className="text-[#C19A6B]">
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-serif font-medium leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-sm text-[#7A7065] leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Empty Spacer on Opposite Side */}
                  <div className="hidden md:block md:w-1/2"></div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Bottom Call to Action */}
        <div className="mt-28 bg-[#3A332C] text-white p-10 md:p-14 text-center rounded-sm shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[#C19A6B] uppercase tracking-[0.25em] text-xs font-bold block mb-3">
              Direct Artisanal Craft
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-[#F8F5F0]">
              Ready to Order Your Bespoke Carpet?
            </h2>
            <p className="text-sm text-[#DFD8CC] font-light leading-relaxed mb-8">
              Explore our collection of chunky braided rugs handcrafted directly from our looms in Bhadohi.
            </p>
            <Link
              href="/collections"
              className="inline-block bg-[#C19A6B] hover:bg-white hover:text-[#3A332C] text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition-colors duration-300 shadow-md"
            >
              Explore Collections Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}