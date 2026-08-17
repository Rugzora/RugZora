export default function About() {
    return (
      <div className="pt-40 pb-24 px-6 max-w-3xl mx-auto text-center min-h-screen">
        <h3 className="tracking-[0.2em] text-xs font-semibold mb-6 text-[#C5A059] uppercase">Our Heritage</h3>
        <h1 className="text-5xl md:text-6xl font-serif mb-12 text-[#3E362E]">Crafted in Bhadohi</h1>
        
        <div className="space-y-8 text-[#5A524A] leading-[1.8] font-light text-lg">
          <p>
            RugZora represents the pinnacle of modern carpet manufacturing, rooted in the rich textile heritage of Bhadohi, Uttar Pradesh. We bring the fresh, golden warmth of artisanal design directly from our production house to your floors.
          </p>
          <p>
            As direct manufacturers, we operate our own specialized setup. Utilizing precision straight-stitch machinery and advanced zigzag sewing techniques, our artisans meticulously shape both the rugged, natural beauty of Jute and the smooth, luxurious finish of Cut-Pile carpets. 
          </p>
          <p>
            By maintaining complete control over our manufacturing, we ensure that every thread aligns with our standard of premium elegance, offering you unparalleled quality and authentic craftsmanship without the retail markup.
          </p>
        </div>
        
        <div className="mt-16">
          <img src="https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=1200" alt="Craftsmanship" className="w-full h-96 object-cover rounded-sm opacity-80" />
        </div>
      </div>
    );
  }