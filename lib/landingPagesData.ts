export interface LandingFeature {
  title: string;
  description: string;
  badge?: string;
  iconName?: string;
}

export interface LandingComparisonRow {
  feature: string;
  rugzora: string;
  others: string;
}

export interface LandingTestimonial {
  name: string;
  role: string;
  location: string;
  comment: string;
  rating: number;
  avatar?: string;
}

export interface LandingFAQ {
  question: string;
  answer: string;
}

export interface LandingProductShowcase {
  title: string;
  desc: string;
  image: string;
  link: string;
  tag: string;
  priceEstimate?: string;
}

export interface LandingPageConfig {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  headline: string;
  highlightedText: string;
  subheadline: string;
  heroImage: string;
  heroCtaText: string;
  heroCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  trustMetrics: {
    value: string;
    label: string;
  }[];
  featuresSectionTitle: string;
  featuresSectionSubtitle: string;
  features: LandingFeature[];
  showcaseSectionTitle?: string;
  showcaseSectionSubtitle?: string;
  products: LandingProductShowcase[];
  comparisonTitle?: string;
  comparisonSubtitle?: string;
  comparison: LandingComparisonRow[];
  testimonialsTitle?: string;
  testimonials: LandingTestimonial[];
  faqTitle?: string;
  faqs: LandingFAQ[];
  bottomCta: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    bgGradient?: string;
  };
}

export const landingPagesData: LandingPageConfig[] = [
  {
    slug: "japandi-braided-rugs",
    metaTitle: "Japandi Rugs Collection | Hand-Braided Organic Floor Art | RugZora",
    metaDescription: "Elevate your minimalist living space with authentic Japandi hand-braided rugs. 100% reversible, zero-shed, and crafted with sustainable marled rPET yarns.",
    badge: "2026 Interior Design Trend Edition",
    headline: "Serenity Beneath Every Step.",
    highlightedText: "Authentic Japandi Floor Art.",
    subheadline: "Designed for Scandinavian warmth and Japanese minimalist discipline. Hand-braided with marled earth tones directly in Bhadohi, India.",
    heroImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788885350236-wdp51.webp",
    heroCtaText: "Customize Your Japandi Rug",
    heroCtaLink: "/customize",
    secondaryCtaText: "Explore Ready In-Stock Rugs",
    secondaryCtaLink: "/collections",
    trustMetrics: [
      { value: "400+ Yrs", label: "Heritage Weaving Craft" },
      { value: "100%", label: "Reversible Usable Lifespan" },
      { value: "Zero", label: "Shedding Micro-Fiber" },
      { value: "4.9 / 5", label: "Architect & Client Rating" },
    ],
    featuresSectionTitle: "Why Architects & Minimalists Choose RugZora Japandi",
    featuresSectionSubtitle: "Engineered to soften hard geometric spaces with organic texture, wabi-sabi marled depth, and uncompromising endurance.",
    features: [
      {
        title: "Marled Dual-Tone Depth",
        description: "Intertwined contrasting cords capture ambient daylight with gentle organic micro-shadows, avoiding flat monochromatic boredom.",
        badge: "Organic Texture",
      },
      {
        title: "Double-Sided Reversible Life",
        description: "Completely free of brittle latex glue backings. Flip your rug anytime to balance foot traffic and enjoy 2x durability.",
        badge: "Unbacked Craft",
      },
      {
        title: "Curved Stadium & Medallion Silhouettes",
        description: "Fluid curves soften sharp sofa edges and rectilinear architecture, making living rooms feel twice as spacious.",
        badge: "Architectural Shapes",
      },
      {
        title: "Zero Shedding & Pet Resilience",
        description: "No annoying airborne fuzz or carpet lint. High-tensile rPET cords withstand claw friction and daily family life.",
        badge: "Zero Shed",
      },
    ],
    showcaseSectionTitle: "Signature Japandi Silhouettes",
    showcaseSectionSubtitle: "Curated shapes crafted to anchor open-plan living rooms, dining zones, and reading nooks.",
    products: [
      {
        title: "Stadium Oval Marled Earth",
        desc: "Smooth rounded ends that soften sectional sofas and coffee table corners.",
        image: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886012994-8g4u8.webp",
        link: "/customize",
        tag: "Bestseller",
        priceEstimate: "Custom Sizing Available",
      },
      {
        title: "Concentric Round Medallion",
        desc: "Spiraled center-out to accentuate dining sets and foyer entryways.",
        image: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886024241-zce9i.webp",
        link: "/customize",
        tag: "Focal Accent",
        priceEstimate: "From ₹4,999",
      },
      {
        title: "Rectangular Architectural Runner",
        desc: "Reinforced zigzag border machine stitch to prevent edge curl in hallways.",
        image: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886038028-z7xhf.webp",
        link: "/collections",
        tag: "High Traffic",
        priceEstimate: "From ₹3,499",
      },
    ],
    comparisonTitle: "RugZora Craft vs Standard Tufted Rugs",
    comparisonSubtitle: "See why hand-braided reversible construction outperforms mass-market machine rugs in every metric.",
    comparison: [
      {
        feature: "Backing Construction",
        rugzora: "100% Unbacked & Identical on Both Sides",
        others: "Glued latex backing that degrades & crumbles",
      },
      {
        feature: "Fiber Shedding",
        rugzora: "Zero Shedding Micro-Spun rPET",
        others: "Constant shedding and airborne fiber dust",
      },
      {
        feature: "Spill & Stain Cleaning",
        rugzora: "Hydrophobic (Damp towel spot wipe)",
        others: "Porous absorption requiring expensive chemical wash",
      },
      {
        feature: "Edge Curling",
        rugzora: "Zero edge curl (Heavy-gauge zigzag lock)",
        others: "Corners fray and lift after a few months",
      },
    ],
    testimonialsTitle: "What Interior Designers Say",
    testimonials: [
      {
        name: "Ananya Deshmukh",
        role: "Lead Architect, Studio Minimal",
        location: "Mumbai",
        comment: "RugZora’s stadium oval rugs are my go-to specification for client living spaces. The organic marled texture gives warm minimalism without being loud.",
        rating: 5,
      },
      {
        name: "Marcus Lindqvist",
        role: "Residential Designer",
        location: "Stockholm / Delhi",
        comment: "The hand feel is astonishingly soft—you cannot tell it is recycled fiber. The fact that it is reversible gives my clients double the peace of mind.",
        rating: 5,
      },
    ],
    faqs: [
      {
        question: "How do I choose the right size for my living room?",
        answer: "As a rule of thumb, ensure the rug is at least 6 to 8 inches wider than your sofa on both sides. For medium living rooms, an 8' × 10' or 6' × 9' rectangle or a 5' × 8' stadium oval allows the front sofa legs to comfortably anchor the seating perimeter.",
      },
      {
        question: "Can I order custom dimensions not listed in standard sizes?",
        answer: "Yes! Use our interactive Bespoke Rug Studio (/customize) to specify custom length and width to the exact half-foot, select your favorite shape, and preview live dual-tone yarn swatches in real-time.",
      },
      {
        question: "Are these rugs suitable for homes with pets and robotic vacuums?",
        answer: "Absolutely. The tight zigzag machine stitch prevents claws from snagging, and standard robotic vacuums easily glide over the low-profile corded border without getting jammed.",
      },
    ],
    bottomCta: {
      title: "Bring Mindful Texture Into Your Home",
      subtitle: "Customize your dream hand-braided rug or browse ready-to-ship artisan collections with complimentary door delivery.",
      buttonText: "Launch Bespoke Customizer",
      buttonLink: "/customize",
    },
  },
  {
    slug: "sustainable-luxury-rugs",
    metaTitle: "Sustainable Luxury Rugs | 100% Recycled rPET Fiber | RugZora",
    metaDescription: "Conscious luxury for modern homes. Hand-braided sustainable rugs made from upcycled ocean-bound plastic with wool-like cloud softness.",
    badge: "Eco-Conscious Architecture",
    headline: "Zero Guilt. Zero Shedding.",
    highlightedText: "Pure Sustainable Luxury.",
    subheadline: "Transforming 1,200+ plastic bottles per rug into ultra-soft, stain-resistant micro-cords crafted by master Bhadohi artisans.",
    heroImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886800397-5cw5v.webp",
    heroCtaText: "Explore Sustainable Collection",
    heroCtaLink: "/collections",
    secondaryCtaText: "Design a Custom Eco Rug",
    secondaryCtaLink: "/customize",
    trustMetrics: [
      { value: "1,200+", label: "Bottles Upcycled Per 8x10 Rug" },
      { value: "Zero", label: "Harmful VOCs or Chemical Glues" },
      { value: "100%", label: "Recyclable Circular Lifecycle" },
      { value: "Waterproof", label: "Hydrophobic Fiber Defense" },
    ],
    featuresSectionTitle: "Redefining Sustainable Floor Covering",
    featuresSectionSubtitle: "No itchy prickles. No environmental degradation. Just pure cloud-soft comfort.",
    features: [
      {
        title: "Wool-Mimicking Softness",
        description: "Micro-extruded filament structure provides the plush step of virgin wool without any coarse prickles or allergens.",
        badge: "Ultra-Soft Touch",
      },
      {
        title: "Circular Eco-Loop",
        description: "Rescuing post-consumer plastic from oceans and landfills, transforming waste into generational heirloom textiles.",
        badge: "Eco-Certified",
      },
      {
        title: "Chemical Glue Free",
        description: "Traditional rugs off-gas volatile organic compounds (VOCs) from latex glue. Our rugs are locked purely through mechanical machine stitching.",
        badge: "Hypoallergenic",
      },
      {
        title: "Direct Artisan Impact",
        description: "Fair-trade direct compensation empowers local weaving communities in Bhadohi with sustainable livelihood security.",
        badge: "Fair Trade",
      },
    ],
    products: [
      {
        title: "Oat & Cocoa Marled Masterpiece",
        desc: "Warm earth tones designed for conscious high-traffic modern living rooms.",
        image: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886295894-ffj9q.webp",
        link: "/customize",
        tag: "Top Rated",
      },
      {
        title: "Cloud Ivory Round Medallion",
        desc: "Bright, airy aesthetic with instant hydrophobic spot-clean convenience.",
        image: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886306008-81jhk.webp",
        link: "/collections",
        tag: "Stain Proof",
      },
    ],
    comparison: [
      {
        feature: "Eco Footprint",
        rugzora: "Upcycles 1,200+ plastic bottles into luxury decor",
        others: "Synthetic virgin petroleum nylon or chemical latex",
      },
      {
        feature: "Indoor Air Quality",
        rugzora: "0% Chemical off-gassing (Glue-free construction)",
        others: "Strong chemical smell from latex vulcanization",
      },
      {
        feature: "Lifespan",
        rugzora: "Decades of use (Reversible double-sided durability)",
        others: "Backing crumbles and tears after 2-3 years",
      },
    ],
    testimonials: [
      {
        name: "Devika & Rohan Mehta",
        role: "Eco-Conscious Homeowners",
        location: "Bengaluru",
        comment: "We wanted a pet-friendly rug that aligned with our sustainability values. RugZora exceeded every expectation—spills wipe right off with a paper towel!",
        rating: 5,
      },
    ],
    faqs: [
      {
        question: "Does recycled rPET feel like hard plastic?",
        answer: "Not at all! Our advanced micro-spinning technology spins the fibers so fine that they are softer to the touch than natural sheep wool, with zero itchiness.",
      },
      {
        question: "Can I place these rugs in sunlit rooms or covered patios?",
        answer: "Yes, our solution-dyed rPET fibers are UV resistant and colorfast, meaning they won't fade or discolor even in sun-drenched sunrooms or covered outdoor patios.",
      },
    ],
    bottomCta: {
      title: "Step Into Conscious Luxury Today",
      subtitle: "Discover the perfect fusion of timeless Indian weaving and cutting-edge sustainable materials.",
      buttonText: "Browse All Collections",
      buttonLink: "/collections",
    },
  },
  {
    slug: "bespoke-architectural-rugs",
    metaTitle: "Bespoke Architectural Rugs | Custom Sizing & Shapes | RugZora",
    metaDescription: "Tailor-made hand-braided rugs for luxury residences, boutique hotels, and architectural spaces. Custom sizes, silhouettes, and dual-tone yarn curation.",
    badge: "Architect & Trade Program",
    headline: "Crafted to Your Exact Floor Plan.",
    highlightedText: "Bespoke Living Room Rugs.",
    subheadline: "Whether you need a 14-foot oversized living room statement, a curved stadium oval, or an extra-long runner, our Bhadohi atelier handcrafts it to your precise specifications.",
    heroImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886038028-z7xhf.webp",
    heroCtaText: "Open Custom Rug Studio",
    heroCtaLink: "/customize",
    secondaryCtaText: "Trade & Project Inquiries",
    secondaryCtaLink: "/contact",
    trustMetrics: [
      { value: "0.5 ft", label: "Precision Dimension Control" },
      { value: "6 Shapes", label: "Rectangular, Oval, Round & More" },
      { value: "14 Days", label: "Atelier Crafting Speed" },
      { value: "Direct", label: "Atelier-to-Site Delivery" },
    ],
    featuresSectionTitle: "Total Creative Freedom for Your Space",
    featuresSectionSubtitle: "No compromising on standard off-the-shelf catalog dimensions that don't fit your layout.",
    features: [
      {
        title: "Exact Footprint Matching",
        description: "Specify length and width to the exact half-foot for precise room framing and door clearance.",
        badge: "Custom Dimensions",
      },
      {
        title: "Architectural Silhouette Selection",
        description: "Choose from Rectangles, Stadium Ovals, Circles, Squares, Arches, and Long Hallway Runners.",
        badge: "6 Unique Shapes",
      },
      {
        title: "Interactive Real-Time Preview",
        description: "Live 3D-inspired concentric braid visualizer with live Room Mockups (Living, Dining, Bedroom).",
        badge: "Instant Visualizer",
      },
      {
        title: "White-Glove Trade Support",
        description: "Dedicated project coordinators for architects, interior designers, and hospitality projects.",
        badge: "Trade Program",
      },
    ],
    products: [
      {
        title: "Architectural Bespoke Grand Area",
        desc: "Oversized living room centerpieces with reinforced zigzag joinery.",
        image: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886388939-yniy5.webp",
        link: "/customize",
        tag: "Custom Sized",
      },
      {
        title: "Custom Long Hallway Runner",
        desc: "High-density continuous spiral rope construction for grand galleries.",
        image: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886436771-unhjx.webp",
        link: "/customize",
        tag: "Any Length",
      },
    ],
    comparison: [
      {
        feature: "Custom Sizing",
        rugzora: "Custom length & width to the half-foot",
        others: "Rigid fixed catalog sizes (5x8 or 8x10 only)",
      },
      {
        feature: "Shape Variety",
        rugzora: "Rectangles, Ovals, Circles, Arches, Runners",
        others: "Only standard rectangular rugs",
      },
      {
        feature: "Craftsmanship",
        rugzora: "Direct from Bhadohi master artisans",
        others: "Mass industrial importer markups",
      },
    ],
    testimonials: [
      {
        name: "Siddharth Oberoi",
        role: "Principal Architect, Oberoi Design Partners",
        location: "New Delhi",
        comment: "We needed a 12' × 16' custom oval rug for a heritage villa project. RugZora delivered exceptional craftsmanship and flawless proportioning right on schedule.",
        rating: 5,
      },
    ],
    faqs: [
      {
        question: "How long does a custom bespoke rug take to craft and deliver?",
        answer: "Each custom rug is hand-braided and machine-locked in our Bhadohi atelier within 10 to 14 business days, followed by insured express courier delivery directly to your door.",
      },
      {
        question: "How can I request material swatches or trade discounts?",
        answer: "You can reach our design team directly at rugzora@gmail.com or via our Contact Page (/contact) for swatch kits, high-res 3D CAD textures, and trade pricing.",
      },
    ],
    bottomCta: {
      title: "Design Your Custom Rug in Under 2 Minutes",
      subtitle: "Choose your shape, input your room dimensions, and visualize your color combination in our live Bespoke Rug Studio.",
      buttonText: "Start Customizing Now",
      buttonLink: "/customize",
    },
  },
];

export function getAllLandingPages(): LandingPageConfig[] {
  return landingPagesData;
}

export function getLandingPageBySlug(slug: string): LandingPageConfig | undefined {
  return landingPagesData.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}
