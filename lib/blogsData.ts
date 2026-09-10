// ==============================================================================
// 🌟 RUGZORA BLOGS DATABASE (EASY AI COPY-PASTE FORMAT)
// ==============================================================================
// 💡 HOW TO ADD A NEW BLOG WITH AI (ChatGPT, Claude, Gemini):
//
// 1. Copy the prompt below and send it to AI:
//
//    "Write an informative, luxury-toned blog post for RugZora (a luxury hand-braided
//     rug brand from Bhadohi, India) about [YOUR TOPIC HERE].
//     Give me the output strictly in this TypeScript object format ready to paste:
//     {
//       id: [NEXT_ID_NUMBER],
//       slug: 'url-friendly-slug',
//       title: 'Catchy & Luxury Blog Title',
//       subtitle: 'Engaging subtitle explaining the key takeaway',
//       excerpt: '2-3 sentences summary of the article',
//       category: 'Design & Styling', // or 'Rug Care', 'Material Science', 'Artisan Heritage', 'Guides'
//       readTime: '5 min read',
//       publishDate: 'September 10, 2026',
//       author: 'Sahil Shahim',
//       featuredImage: 'https://images.unsplash.com/... or supabase image url',
//       tags: ['Rug Design', 'Japandi', 'Home Decor'],
//       contentHtml: \`
//         <h2>1. Heading Here</h2>
//         <p>Your paragraph text here...</p>
//         <blockquote>A memorable quote or design philosophy callout.</blockquote>
//         <h2>2. Next Heading</h2>
//         <p>More details...</p>
//         <ul>
//           <li>Key tip 1</li>
//           <li>Key tip 2</li>
//         </ul>
//       \`
//     }"
//
// 2. Paste the AI output into the `blogsData` array below with the next id (e.g. id: 1, id: 2, id: 3, id: 4...).
// 3. That's it! Your blog is instantly live at /blog and /blog/[slug] or /blog/[id]!
// ==============================================================================

export interface BlogSection {
  heading?: string;
  subheading?: string;
  content: string;
  quote?: string;
  tip?: string;
  list?: string[];
  imageUrl?: string;
  imageCaption?: string;
}

export interface BlogPost {
  id: number | string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category?: string;
  readTime?: string;
  publishDate?: string;
  author?:
    | string
    | {
        name: string;
        role?: string;
        avatar?: string;
      };
  featuredImage?: string;
  tags?: string[];
  contentHtml?: string;
  content?: string;
  sections?: BlogSection[];
  relatedProducts?: {
    title: string;
    link: string;
    tag: string;
  }[];
}

export const blogsData: BlogPost[] = [
  // ============================================================================
  // BLOG ID: 1
  // ============================================================================
  {
    id: 1,
    slug: "japandi-living-room-rug-styling-guide",
    title: "The Art of Japandi: How Natural Textures & Marled Rugs Transform Modern Spaces",
    subtitle: "A masterclass in blending Japanese minimalism with Scandinavian warmth using chunky braided floor architecture.",
    excerpt: "Discover the nuanced balance between minimalist discipline and tactile luxury. Learn how earth-toned braided cords, oval silhouettes, and neutral color blocking anchor mindful interiors.",
    category: "Design & Styling",
    readTime: "5 min read",
    publishDate: "September 8, 2026",
    author: {
      name: "Sahil Shahim",
      role: "Head of Design, RugZora",
    },
    featuredImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788885350236-wdp51.webp",
    tags: ["Japandi", "Minimalism", "Interior Design", "Neutral Decor", "Living Room"],
    contentHtml: `
      <h2>1. The Philosophy of Mindful Living</h2>
      <p>Japandi is far more than an aesthetic buzzword; it is a thoughtful philosophy rooted in wabi-sabi—the appreciation of organic imperfection—and hygge, the Scandinavian pursuit of cozy warmth. When designing with this ethos, the floor is never an afterthought; it is the visual and tactile anchor of the entire room.</p>
      
      <blockquote>True luxury is felt beneath the feet before it is processed by the eye. Natural textures ground the room in stillness.</blockquote>

      <h2>2. The Silhouette Rule: Rectangles vs. Stadium Ovals</h2>
      <p>In open-concept Japandi spaces with low-profile oak furniture, rigid sharp corners can sometimes feel clinical. Introducing an organic stadium oval or a rounded medallion softens geometric lines, inviting fluid foot traffic and seamless conversation clusters.</p>
      
      <ul>
        <li><strong>For rectangular rooms:</strong> opt for a 6' × 9' or 8' × 10' braided rectangle to frame the main seating area.</li>
        <li><strong>For conversational coffee nooks:</strong> choose a 5' × 8' stadium oval to soften hard corners.</li>
        <li><strong>For reading corners and entryways:</strong> a 4' round medallion creates an instant focal point.</li>
      </ul>

      <h2>3. The Dual-Tone Marled Advantage</h2>
      <p>Monochromatic flat rugs can look lifeless in daylight. RugZora's hand-braided yarns combine two complementary cord fibers (such as Oat Cream and Toasted Almond) in a tight machine zigzag lock. This creates micro-shadows that capture shifting sunlight throughout the day, imparting organic richness.</p>

      <h2>4. Layering Without Clutter</h2>
      <p>To achieve effortless warmth without visual clutter, pair your braided rug with raw linen curtains, unlacquered brass accents, and textured bouclé cushions. The tactile harmony between rough braided rope and soft linen creates a deeply soothing sensory balance.</p>
    `,
    relatedProducts: [
      { title: "Bespoke Stadium Oval Rug", link: "/customize", tag: "Customizable" },
      { title: "Artisan Area Rugs Collection", link: "/collections", tag: "In Stock" },
    ],
  },

  // ============================================================================
  // BLOG ID: 2
  // ============================================================================
  {
    id: 2,
    slug: "sustainable-rpet-fiber-technology-wool-alternative",
    title: "From Ocean Plastic to Wool-Like Softness: The Science of rPET Rugs",
    subtitle: "How recycled polyethylene terephthalate is revolutionizing luxury floor coverings without sacrificing softness.",
    excerpt: "Explore the cutting-edge recycling and spinning process that turns discarded plastic bottles into ultra-fine micro-cords that feel indistinguishable from virgin wool, with zero shedding.",
    category: "Material Science",
    readTime: "6 min read",
    publishDate: "August 28, 2026",
    author: {
      name: "Dr. Alistair Vance",
      role: "Textile Engineer & Sustainability Lead",
    },
    featuredImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886800397-5cw5v.webp",
    tags: ["rPET", "Sustainability", "Material Science", "Zero Shedding", "Eco Luxury"],
    contentHtml: `
      <h2>1. The Dilemma of Traditional Wool</h2>
      <p>For centuries, natural sheep wool has been the gold standard for luxury rugs. However, wool rugs harbor significant drawbacks for modern households: relentless shedding, moisture absorption, vulnerability to moth damage, and difficulty in deep cleaning. Enter rPET technology.</p>

      <h2>2. The Upcycling Lifecycle</h2>
      <p>Each RugZora 8' × 10' rug rescues approximately 1,200 post-consumer plastic bottles from landfills and coastal waterways. The bottles undergo a multi-stage cleaning and purification process before being melted into fine polymers and extruded into hollow-core micro-filaments.</p>

      <ul>
        <li><strong>Stage 1:</strong> Cleaned & sterilized post-consumer polymer sorting.</li>
        <li><strong>Stage 2:</strong> Micro-extrusion into cloud-soft staple fibers.</li>
        <li><strong>Stage 3:</strong> Multi-ply core braiding for supreme tensile resilience.</li>
        <li><strong>Stage 4:</strong> Precision high-density zigzag machine stitching.</li>
      </ul>

      <blockquote>Sustainability should never demand a compromise in comfort. Our rPET yarns mimic the natural crimp and drape of New Zealand wool.</blockquote>

      <h2>3. Non-Porous Stain & Spill Defense</h2>
      <p>Unlike organic wool or jute fibers that absorb spilled wine, coffee, and pet accidents deep into their core, rPET fibers are hydrophobic. Liquids pool on the surface instead of penetrating, allowing for instantaneous spot cleaning with a damp microfiber cloth.</p>
    `,
    relatedProducts: [
      { title: "Pet & Kid Friendly Rugs", link: "/collections", tag: "Hydrophobic" },
      { title: "Custom Sized Runners", link: "/customize", tag: "High Traffic" },
    ],
  },

  // ============================================================================
  // BLOG ID: 3
  // ============================================================================
  {
    id: 3,
    slug: "heritage-of-bhadohi-carpet-city-artisans",
    title: "Centuries on the Loom: The Untold Story of Bhadohi’s Master Braiders",
    subtitle: "Inside the carpet capital of India where four centuries of generational craft meets sustainable innovation.",
    excerpt: "A behind-the-scenes journey through Bhadohi, Uttar Pradesh. Discover how generational families of master artisans are infusing ancient braiding techniques with modern Scandinavian design.",
    category: "Artisan Heritage",
    readTime: "7 min read",
    publishDate: "August 15, 2026",
    author: {
      name: "Mohammad Irfan",
      role: "Master Weaver & Community Liaison",
    },
    featuredImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886024241-zce9i.webp",
    tags: ["Bhadohi", "Artisans", "Indian Craft", "Handmade", "Fair Trade"],
    contentHtml: `
      <h2>1. The Carpet City Legacy</h2>
      <p>Nestled along the banks of the Ganges in Uttar Pradesh, the historic town of Bhadohi accounts for nearly 60% of India's handcrafted carpet exports. The craft traces back to the 16th century under Mughal patronage, where master weavers honed techniques that passed seamlessly from parent to child over generations.</p>

      <h2>2. The Anatomy of Hand-Spiraled Braiding</h2>
      <p>Unlike tufted rugs where yarn is punched into a glue backing, RugZora rugs are constructed from continuous heavy-gauge braided ropes. The artisan begins at the central core, slowly rotating and feeding the cord through high-torque zigzag sewing machines, locking every millimeter with 8-ply polyester filament thread.</p>

      <blockquote>Every spiral requires an artisan's trained instinct. The tension must remain immaculate to ensure the rug lies completely flat without curling.</blockquote>

      <h2>3. Fair Wages & Ethical Craftsmanship</h2>
      <p>RugZora partners directly with artisan cooperatives in Bhadohi, eliminating middlemen and ensuring ethical compensation, healthcare support, and safe, well-ventilated workshop environments. Every rug purchased directly supports artisan families and preserves this heritage craft.</p>
    `,
    relatedProducts: [
      { title: "Explore Heritage Weaves", link: "/legacy", tag: "Fair Trade" },
      { title: "Custom Atelier Orders", link: "/customize", tag: "Bespoke" },
    ],
  },

  // ============================================================================
  // BLOG ID: 4
  // ============================================================================
  {
    id: 4,
    slug: "how-to-care-for-and-clean-braided-rugs",
    title: "The Ultimate Guide to Cleaning & Maintaining Hand-Braided Rugs",
    subtitle: "Expert tips on vacuuming, flipping, spot cleaning, and extending the lifespan of your reversible rug.",
    excerpt: "Keep your braided rug looking pristine for decades. Learn how reversible construction doubles durability and why straightforward maintenance keeps your home fresh.",
    category: "Care & Longevity",
    readTime: "4 min read",
    publishDate: "July 30, 2026",
    author: {
      name: "Priya Sharma",
      role: "Quality & Aftercare Specialist",
    },
    featuredImage: "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788886347448-6x1b3.webp",
    tags: ["Rug Care", "Cleaning Guide", "Reversible", "Home Maintenance"],
    contentHtml: `
      <h2>1. The Superpower of 100% Reversible Design</h2>
      <p>Most modern rugs have a rubberized or latex backing that degrades, crumbles, and stains hardwood floors over time. RugZora rugs are completely unbacked with identical texture on both sides. Flipping your rug every 6 months balances foot traffic and effectively doubles its usable lifespan.</p>

      <h2>2. Regular Vacuuming Best Practices</h2>
      <p>Vacuum your braided rug once or twice a week using suction-only mode. Avoid using a high-speed rotating beater bar, which can snag individual surface fibers over time.</p>

      <ul>
        <li>Use the floor brush or upholstery attachment for gentle suction.</li>
        <li>Vacuum in the direction of the braid spirals rather than aggressively across them.</li>
        <li>Rotate the rug 180 degrees every few months to equalize sun exposure and foot traffic.</li>
      </ul>

      <h2>3. Emergency Spot Cleaning Formula</h2>
      <p>For accidental spills, act promptly. Mix a few drops of mild clear dishwashing liquid in lukewarm water. Dip a clean microfiber towel and dab from the outside of the stain toward the center. Allow to air dry naturally.</p>
    `,
    relatedProducts: [
      { title: "Zero-Shed Entryway Runners", link: "/collections", tag: "Easy Care" },
      { title: "Heavy Gauge Dining Rugs", link: "/customize", tag: "Reversible" },
    ],
  },
];

// ==============================================================================
// 🌟 HELPER FUNCTIONS (SUPPORTING BOTH SLUG AND NUMERIC ID)
// ==============================================================================

export function getAllBlogs(): BlogPost[] {
  return blogsData;
}

export function getBlogBySlugOrId(param: string): BlogPost | undefined {
  const cleanParam = param.trim().toLowerCase();
  return blogsData.find((b) => {
    const matchesSlug = b.slug?.toLowerCase() === cleanParam;
    const matchesId = b.id.toString().toLowerCase() === cleanParam;
    return matchesSlug || matchesId;
  });
}

// Backwards-compatible alias
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return getBlogBySlugOrId(slug);
}

export function getRelatedBlogs(currentIdentifier: string | number, limit = 3): BlogPost[] {
  const currentStr = currentIdentifier.toString().toLowerCase();
  return blogsData
    .filter((b) => b.slug.toLowerCase() !== currentStr && b.id.toString() !== currentStr)
    .slice(0, limit);
}
