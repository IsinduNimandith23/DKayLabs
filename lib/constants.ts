/**
 * Central content + config. Edit copy here, not in components.
 */

export const SITE = {
  name: "DKayLabs",
  // TODO: replace with your DKayLabs tagline (drives the browser <title> and footer).
  tagline: "Your tagline goes here.",
  description:
    "DKayLabs is a digital services company building high-performance websites, SaaS platforms, and AI-powered products.",
  email: "hello@dkaylabs.com",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export type Service = {
  title: string;
  description: string;
  /** Lucide-style inline icon key, resolved in ServiceCard. */
  icon:
    | "code"
    | "mobile"
    | "layers"
    | "cart"
    | "design"
    | "seo"
    | "wrench"
    | "spark";
  status: "available" | "coming-soon";
};

export const SERVICES: Service[] = [
  {
    title: "Website Development",
    description:
      "Blazing-fast, conversion-focused sites built on modern stacks - pixel-perfect, animated, and engineered to rank.",
    icon: "code",
    status: "available",
  },
  {
    title: "Mobile App Development",
    description:
      "Sleek, native-feel iOS and Android apps built from a single codebase - fast, stable, and store-ready.",
    icon: "mobile",
    status: "available",
  },
  {
    title: "SaaS Development",
    description:
      "End-to-end product engineering: auth, billing, dashboards, and scalable cloud infrastructure that grows with you.",
    icon: "layers",
    status: "available",
  },
  {
    title: "E-commerce Solutions",
    description:
      "High-converting online stores with seamless checkout, payments, and inventory - built to sell around the clock.",
    icon: "cart",
    status: "available",
  },
  {
    title: "UI/UX Design",
    description:
      "Interfaces that look sharp and convert harder - research-driven design systems, prototypes, and pixel-perfect handoff.",
    icon: "design",
    status: "available",
  },
  {
    title: "SEO & Digital Marketing",
    description:
      "Rank higher and reach further - technical SEO, content strategy, and campaigns that turn traffic into revenue.",
    icon: "seo",
    status: "available",
  },
  {
    title: "Website Maintenance",
    description:
      "Updates, monitoring, backups, and support - we keep your site fast, secure, and always online after launch.",
    icon: "wrench",
    status: "available",
  },
  {
    title: "AI Solutions",
    description:
      "Intelligent automation, custom models, and AI-native experiences that put your business a level above the rest.",
    icon: "spark",
    status: "coming-soon",
  },
];

/** Scrolling keyword strip shown under the hero. */
export const MARQUEE_ITEMS = [
  "Websites",
  "SaaS Platforms",
  "AI Products",
  "UI / UX Design",
  "E-Commerce",
  "Automation",
  "Branding",
  "Performance",
] as const;

export type Project = {
  title: string;
  category: string;
  /** Which SERVICES entry this project belongs to - drives the portfolio filter. */
  service: string;
  description: string;
  tags: string[];
  /** Live site URL. */
  url: string;
  /** Monogram shown in the stylized thumbnail. */
  monogram: string;
};

/** Real shipped work - first three are featured on the homepage. */
export const PROJECTS: Project[] = [
  {
    title: "CGShift",
    category: "Agency Website",
    service: "Website Development",
    description:
      "Website for a Colombo creative & performance marketing agency - showcasing 400+ delivered projects and clients like MAS Holdings and SLT Mobitel.",
    tags: ["Agency", "Portfolio", "Marketing"],
    url: "https://www.cgshift.com/",
    monogram: "CG",
  },
  {
    title: "Fallowkind",
    category: "Fashion E-Commerce",
    service: "E-commerce Solutions",
    description:
      "Storefront and brand hub for a sustainable slow-fashion label - natural-fiber clothing, ethical production, zero hidden plastics.",
    tags: ["E-Commerce", "Branding", "Fashion"],
    url: "https://www.fallowkind.com/",
    monogram: "FK",
  },
  {
    title: "The Brush Master",
    category: "Digital Products Store",
    service: "E-commerce Solutions",
    description:
      "E-commerce for a creative studio selling Photoshop & Procreate brush packs and Lightroom presets to artists and content creators.",
    tags: ["E-Commerce", "Digital Goods", "Creators"],
    url: "https://www.thebrushmaster.shop/",
    monogram: "BM",
  },
  {
    title: "Serendib Prime",
    category: "Food Brand E-Commerce",
    service: "E-commerce Solutions",
    description:
      "Product site and online ordering for premium ready-to-eat Sri Lankan sprat curry - traditional recipes, islandwide delivery.",
    tags: ["E-Commerce", "FMCG", "Delivery"],
    url: "https://www.serendibprime.lk/",
    monogram: "SP",
  },
  {
    title: "New Sagarika Driving School",
    category: "Business Website",
    service: "Website Development",
    description:
      "Lead-generating site for a Colombo driving school covering every vehicle class - with their 96% first-attempt pass rate front and center.",
    tags: ["Business Site", "Local SEO", "Lead Gen"],
    url: "https://www.newsagarikadrivingschool.lk/",
    monogram: "NS",
  },
];

/** Homepage "Our Drive" section - why we do this. */
export const DRIVES = [
  {
    title: "Your win is the metric",
    description:
      "We don't measure success in deliverables shipped - we measure it in the ground you gain. Traffic, conversions, market position: that's the scoreboard.",
  },
  {
    title: "Quality without compromise",
    description:
      "Every build is engineered like it carries our own name - because it does. No templates, no shortcuts, no 'good enough'.",
  },
  {
    title: "Partners, not vendors",
    description:
      "We stay in your corner after launch. Iterating, optimizing, and scaling alongside you as the goals get bigger.",
  },
] as const;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};

// TODO: replace with real client quotes as they come in.
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "DKayLabs rebuilt our site in three weeks and it instantly felt like a different company. Faster, sharper, and our leads doubled.",
    name: "Maya Chen",
    role: "Founder, NovaCart",
    rating: 5,
  },
  {
    quote:
      "The team thinks like owners. They pushed back on our ideas when it mattered and the product is better for it.",
    name: "Andre Silva",
    role: "CTO, PulseBoard",
    rating: 5,
  },
  {
    quote:
      "From first call to launch, everything was tight. Clear timelines, honest communication, and a finish that outclassed agencies twice the price.",
    name: "Sasha Ivanov",
    role: "Product Lead, ForgeAI",
    rating: 5,
  },
];

export const SOCIALS = [
  { label: "X", href: "#", key: "x" },
  { label: "GitHub", href: "#", key: "github" },
  { label: "LinkedIn", href: "#", key: "linkedin" },
  { label: "Discord", href: "#", key: "discord" },
] as const;
