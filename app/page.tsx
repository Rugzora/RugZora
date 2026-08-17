"use client";

import { motion, Variants } from "framer-motion";

export default function Home() {
  // TypeScript ko batane ke liye ki ye Framer Motion ka 'Variants' object hai
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="w-full flex flex-col bg-[#F8F5F0] overflow-x-hidden">
      
      {/* 1. AIRY HERO SECTION */}
      <section className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[#EBE5DA]">
          <img 
            src="https://images.unsplash.com/photo-1444362408440-274ecb6fc730?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Bright Elegant Interior" 
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5F0] via-[#F8F5F0]/30 to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative z-10 text-center px-6 mt-20 max-w-4xl mx-auto"
        >
          <span className="text-[#C19A6B] uppercase tracking-[0.3em] font-semibold text-xs mb-6 block">Premium Carpet Manufacturers</span>
          <h1 className="text-5xl md:text-7xl text-[#3A332C] font-serif mb-6 leading-[1.1]">
            Exceptional Craftsmanship. <br />
            <span className="italic font-light text-[#6B6054]">Direct from Bhadohi.</span>
          </h1>
          <p className="text-lg text-[#6B6054] mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Fresh textures and smooth finishes. Discover our exquisite range of Jute and Cut-Pile carpets designed for modern living spaces.
          </p>
          <a href="/collections" className="bg-[#3A332C] text-[#F8F5F0] px-12 py-5 text-xs tracking-[0.2em] uppercase hover:bg-[#C19A6B] hover:text-white transition duration-500 shadow-xl inline-block">
            Explore the Collection
          </a>
        </motion.div>
      </section>

      {/* 2. THE BRAND ETHOS (Image Grid) */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Curated for Living", desc: "Designs that effortlessly blend with minimalism and classic elegance.", delay: 0 },
            { img: "https://images.pexels.com/photos/39005790/pexels-photo-39005790.jpeg", title: "Natural Textures", desc: "Embracing the raw, earthy beauty of pure materials and sustainable sourcing.", delay: 0.2, extraClass: "md:pt-16" },
            { img: "https://images.pexels.com/photos/31598222/pexels-photo-31598222.jpeg", title: "Master Craftsmanship", desc: "Every thread meticulously secured using precision zigzag machinery.", delay: 0.4 }
          ].map((item, index) => (
            <motion.div 
              key={index}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: item.delay }}
              className={`flex flex-col group cursor-pointer ${item.extraClass || ""}`}
            >
              <div className="aspect-[4/3] overflow-hidden mb-8 rounded-sm bg-[#EBE5DA]">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
              </div>
              <h3 className="text-xl font-serif text-[#3A332C] mb-3">{item.title}</h3>
              <p className="text-[#7A7065] font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. SPLIT STORY - Legacy */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-24 border-t border-[#EBE5DA]">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <motion.div 
            variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-4 block">Our Manufacturing</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-8 leading-[1.2]">
              Generations of <br/> Unbroken Legacy.
            </h2>
            <p className="text-[#6B6054] text-lg leading-relaxed font-light mb-10">
              Operating directly from our setup in Bhadohi, we utilize advanced straight-stitch technology. By eliminating middlemen, we bring the authentic beauty of natural Jute and plush Cut-Pile carpets straight from the artisans to your floor.
            </p>
            <a href="/about" className="inline-flex items-center text-[#3A332C] uppercase tracking-[0.15em] text-xs font-semibold hover:text-[#C19A6B] transition-colors border-b border-[#3A332C] hover:border-[#C19A6B] pb-1">
              Read Our Full Story
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}
            className="w-full md:w-1/2 relative h-[600px] rounded-sm overflow-hidden group bg-[#EBE5DA]"
          >
            <img src="https://media.istockphoto.com/id/2241474699/photo/rolling-up-a-colorful-rug-in-a-cozy-living-space.jpg?b=1&s=612x612&w=0&k=20&c=YCZM8PgDSFYKG7JTCxgW4HqYBrUVqECzMpiVk3J3x2I=" alt="Soft Cut Pile Carpet" className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" />
          </motion.div>
        </div>
      </section>

      {/* 4. THE MASTERPIECES (Staggered Cards) */}
      <section className="w-full bg-[#EBE5DA] py-40">
        <motion.div 
          variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-[1400px] mx-auto px-6 text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-6">The Masterpieces</h2>
          <p className="text-[#6B6054] font-light text-lg">Signature categories tailored for elegant homes.</p>
        </motion.div>

        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { img: "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Golden Jute", desc: "Earthy, durable, and naturally stunning for any room.", delay: 0 },
            { img: "https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Plush Cut-Pile", desc: "Incredibly smooth, soft, and luxurious finish underfoot.", delay: 0.2, extraClass: "md:-translate-y-12" },
            { img: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Bespoke Studio", desc: "Custom dimensions and tailored designs for your space.", delay: 0.4 }
          ].map((item, index) => (
            <motion.div 
              key={index} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: item.delay }}
              className={`bg-[#F8F5F0] p-8 shadow-sm hover:shadow-2xl transition-shadow duration-500 group flex flex-col h-[600px] ${item.extraClass || ""}`}
            >
              <div className="flex-grow overflow-hidden relative mb-8 rounded-sm bg-[#DFD8CC]">
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-[2s]" alt={item.title} />
              </div>
              <h3 className="text-3xl font-serif text-[#3A332C] mb-3">{item.title}</h3>
              <p className="text-[#7A7065] font-light mb-8">{item.desc}</p>
              <a href="/collections" className="text-xs uppercase tracking-[0.1em] text-[#C19A6B] font-semibold mt-auto inline-block">Shop Collection →</a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. NEW SECTION: THE CRAFT (Large Image Right) */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32 border-b border-[#EBE5DA]">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full md:w-5/12 order-2 md:order-1">
            <span className="text-[#C19A6B] uppercase tracking-[0.2em] font-semibold text-xs mb-4 block">The Process</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-8 leading-[1.2]">The Art of <br/> Threading</h2>
            <p className="text-[#6B6054] text-lg leading-relaxed font-light mb-10">
              Every spool of yarn is carefully selected to ensure perfect color consistency. Our artisans employ a blend of traditional knowledge and modern straight-stitch precision.
            </p>
            <a href="/about" className="inline-block border border-[#3A332C] px-10 py-4 text-xs tracking-[0.2em] uppercase text-[#3A332C] hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-500">
              Discover Our Process
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full md:w-7/12 order-1 md:order-2 relative h-[800px] rounded-sm overflow-hidden group bg-[#EBE5DA]">
            <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Weaving Thread Details" className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" />
          </motion.div>
        </div>
      </section>

      {/* 6. THE TEXTURE LIBRARY */}
      <section className="w-full py-32 bg-[#F8F5F0]">
        <div className="max-w-[1600px] mx-auto px-6">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-serif text-[#3A332C]">The Texture Library</h2>
            <a href="/collections" className="text-xs uppercase tracking-[0.1em] text-[#C19A6B] font-semibold hidden md:block border-b border-[#C19A6B]">View All Materials</a>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              "https://images.unsplash.com/photo-1615876234886-fd1a8f947122?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ].map((img, index) => (
              <motion.div key={index} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="aspect-square bg-[#EBE5DA] overflow-hidden group">
                <img src={img} alt={`Texture ${index+1}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SHOP BY SPACE */}
      <section className="w-full py-32 bg-[#EBE5DA]">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C] mb-6">Designed For Every Space</h2>
            <p className="text-[#6B6054] font-light text-lg">Find the perfect proportions for your home.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[700px]">
            {[
              { img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Living Room", link: "Shop Large Rugs" },
              { img: "https://images.unsplash.com/photo-1522771731478-44eb11de520b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Bedroom", link: "Shop Soft Textures" },
              { img: "https://images.unsplash.com/photo-1598928506311-c55dd129a0f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Hallways", link: "Shop Runners" }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.2 }} className="relative overflow-hidden group rounded-sm cursor-pointer h-[400px] md:h-full">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-[1.5s]" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>
                <div className="absolute bottom-10 left-10 text-white z-10">
                  <h3 className="text-3xl font-serif mb-3">{item.title}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] border-b border-white pb-1 font-semibold">{item.link}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOCUS COLLECTION */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32 relative">
        <div className="flex flex-col md:flex-row gap-10">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full md:w-2/3 h-[700px] bg-[#EBE5DA] relative overflow-hidden rounded-sm">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Living Area Jute" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full md:w-1/3 md:absolute md:right-10 md:top-48 bg-white p-12 shadow-2xl max-w-md">
            <span className="text-[#C19A6B] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Spotlight</span>
            <h2 className="text-4xl font-serif text-[#3A332C] mb-6">The Jute Focus</h2>
            <p className="text-[#6B6054] font-light leading-relaxed mb-10">
              Transform your space with the timeless elegance of hand-woven jute. Our manufacturing unit ensures every rug is tightly bound, offering unparalleled longevity.
            </p>
            <div className="h-40 bg-[#EBE5DA] mb-8 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1590118318182-3d5f35fc0ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Jute Detail" className="w-full h-full object-cover" />
            </div>
            <a href="/collections" className="w-full block text-center border border-[#3A332C] text-[#3A332C] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#3A332C] hover:text-[#F8F5F0] transition duration-300">
              Shop Jute Focus
            </a>
          </motion.div>
        </div>
      </section>

      {/* 9. INSPIRATION GALLERY */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-32">
        <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-[#3A332C]">The Inspiration Gallery</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[800px]">
          <div className="flex flex-col gap-6">
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="h-[400px] bg-[#EBE5DA] rounded-sm overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
            </motion.div>
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} className="h-[400px] bg-[#EBE5DA] rounded-sm overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1598928506311-c55dd129a0f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
            </motion.div>
          </div>
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }} className="h-[400px] md:h-full bg-[#EBE5DA] rounded-sm overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1600566753086-00f18efc2294?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
          </motion.div>
        </div>
      </section>

      {/* 10. THE DISTINCTION */}
      <motion.section variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="w-full bg-[#F4F0E8] border-y border-[#E8E1D5] py-24 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="text-[#C19A6B] uppercase tracking-[0.25em] font-semibold text-xs mb-4 block">The RugZora Standard</span>
          <h3 className="text-3xl md:text-4xl font-serif text-[#3A332C] mb-6">Purity of Material. Precision of Loom.</h3>
          <p className="text-[#6B6054] text-base md:text-lg font-light leading-relaxed max-w-3xl mx-auto mb-16">
            Every carpet is a balance of structural durability and tactile softness. Woven directly at our manufacturing setup in Bhadohi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left border-t border-[#E0D8CA] pt-12">
            {[
              { num: "01", title: "Pure Natural Fibers", desc: "Sustainably sourced jute and premium yarn chosen for natural resilience." },
              { num: "02", title: "Direct Manufacture", desc: "Zero retail markups. Every carpet arrives at your space straight from our production floor." },
              { num: "03", title: "Bespoke Proportions", desc: "Custom dimensions and tailored edge finishes created to fit your architectural layout." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.2 }}>
                <span className="text-[#C19A6B] font-serif text-2xl font-bold mb-2 block">{item.num}</span>
                <h4 className="text-lg font-serif text-[#3A332C] mb-2">{item.title}</h4>
                <p className="text-sm text-[#7A7065] font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 11. THE ARTISAN PROMISE */}
      <motion.section 
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true }}
        className="relative w-full py-40 flex items-center justify-center text-center px-6 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Authentic Bhadohi Carpet" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#241F1A]/85"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <svg className="w-10 h-10 text-[#C19A6B] mx-auto mb-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h2 className="text-3xl md:text-5xl font-serif text-[#F8F5F0] mb-6 leading-snug drop-shadow-lg">
            Authentic Quality. <br /> Straight from our Looms in Bhadohi.
          </h2>
          <a href="/collections" className="text-[#C19A6B] border-b border-[#C19A6B] pb-1 uppercase tracking-[0.2em] text-xs md:text-sm hover:text-white hover:border-white transition-colors duration-300">
            View All Collections
          </a>
        </div>
      </motion.section>

    </div>
  );
}