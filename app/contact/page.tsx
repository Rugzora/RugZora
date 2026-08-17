export default function Contact() {
    return (
      <div className="pt-40 pb-24 px-6 max-w-2xl mx-auto min-h-screen">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-4 text-[#3E362E]">Connect With Us</h1>
          <p className="text-[#7A7265] text-sm">For bespoke dimensions, bulk orders, or manufacturing inquiries directly from our Bhadohi unit.</p>
        </div>
        
        <form className="space-y-10 bg-white/50 p-10 rounded-sm shadow-sm border border-[#EAE5D9]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative">
              <input type="text" placeholder="First Name" className="w-full border-b border-[#DCD5C9] bg-transparent py-3 outline-none focus:border-[#C5A059] transition text-[#3E362E] placeholder-[#A39A8F]" />
            </div>
            <div className="relative">
              <input type="text" placeholder="Last Name" className="w-full border-b border-[#DCD5C9] bg-transparent py-3 outline-none focus:border-[#C5A059] transition text-[#3E362E] placeholder-[#A39A8F]" />
            </div>
          </div>
          <div className="relative">
            <input type="email" placeholder="Email Address" className="w-full border-b border-[#DCD5C9] bg-transparent py-3 outline-none focus:border-[#C5A059] transition text-[#3E362E] placeholder-[#A39A8F]" />
          </div>
          <div className="relative">
            <textarea placeholder="Your Message" rows={5} className="w-full border-b border-[#DCD5C9] bg-transparent py-3 outline-none focus:border-[#C5A059] transition text-[#3E362E] placeholder-[#A39A8F] resize-none"></textarea>
          </div>
          <button type="button" className="w-full bg-[#3E362E] text-white px-10 py-4 rounded-sm text-xs tracking-[0.2em] hover:bg-[#C5A059] transition duration-500 uppercase shadow-md">
            Send Inquiry
          </button>
        </form>
      </div>
    );
  }