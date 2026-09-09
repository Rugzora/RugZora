import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col items-center justify-center px-6 text-center font-sans">
      <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C19A6B] mb-3 block">
        404 Page Not Found
      </span>

      <h1 className="text-4xl md:text-6xl font-serif text-[#3A332C] mb-4">
        Lost in the Weave
      </h1>

      <p className="text-sm md:text-base text-[#7A7065] max-w-md mx-auto mb-10 font-light leading-relaxed">
        The page you are looking for doesn't exist or may have been relocated. Explore our handcrafted collection of bespoke rugs instead.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/collections"
          className="bg-[#3A332C] text-[#F8F5F0] px-8 py-4 text-xs tracking-[0.18em] uppercase hover:bg-[#C19A6B] transition-colors rounded-sm shadow-md font-semibold"
        >
          Explore Collections
        </Link>
        <Link
          href="/"
          className="border border-[#DFD8CC] text-[#3A332C] px-8 py-4 text-xs tracking-[0.18em] uppercase hover:border-[#3A332C] transition-colors rounded-sm font-semibold"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
