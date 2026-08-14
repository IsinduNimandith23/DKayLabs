/**
 * Central content + config. Edit copy here, not in components.
 */

export const SITE = {
  name: "DKayLabs",
  // Drives the browser <title> and footer.
  tagline: "Websites, SaaS & AI Products Built to Perform",
  description:
    "DKayLabs is a digital services company building high-performance websites, SaaS platforms, and AI-powered products.",
  email: "isindunimandith23@gmail.com",
  phone: "+94 77 037 2960",
  /** Same number, digits only - the format wa.me links require. */
  whatsapp: "94770372960",
  /** Pre-typed into the chat when the floating WhatsApp button is tapped. */
  whatsappMessage: "Hi DKayLabs, I'd like to talk about a project.",
  location: "Colombo, Sri Lanka",
  hours: "Available 24/7",
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
  /** Long-form copy shown in the ServiceModal when the card is clicked. */
  detail: {
    /** One or two paragraphs expanding on `description`. */
    overview: string;
    /** Concrete things the client walks away with. */
    deliverables: string[];
    /** Rough delivery window - always framed as an estimate. */
    timeline: string;
  };
};

/**
 * Shown in every ServiceModal. We quote per-project rather than list prices,
 * so this is deliberately a single shared line - edit once, changes everywhere.
 */
export const PRICING_NOTE =
  "Every project is scoped and priced around what you actually need - features, complexity, and timeline all move the number. Tell us what you're building and we'll send a tailored quote, no templates.";

/**
 * Starter text dropped into the contact form's message field when someone
 * applies for a service. Name and email stay blank on purpose - those are the
 * user's to fill in.
 */
export function buildInquiryMessage(serviceTitle: string) {
  return `Hi DKayLabs,

I'd like to apply for your ${serviceTitle} service.

What I'm looking to build:
-

Budget range (if you have one in mind):
-

Please send over a tailored quote. Thanks!`;
}

export const SERVICES: Service[] = [
  {
    title: "Website Development",
    description:
      "Blazing-fast, conversion-focused sites built on modern stacks - pixel-perfect, animated, and engineered to rank.",
    icon: "code",
    status: "available",
    detail: {
      overview:
        "We build marketing sites, landing pages, and content-driven platforms that load instantly and turn visitors into customers. Every build starts from your goals - not a template - and ships with clean, maintainable code you actually own.",
      deliverables: [
        "Fully responsive, pixel-perfect build",
        "Core Web Vitals tuned for speed",
        "On-page SEO and structured data",
        "CMS so you can edit content yourself",
        "Analytics and conversion tracking wired up",
      ],
      timeline: "2 - 6 weeks, depending on scope",
    },
  },
  {
    title: "Mobile App Development",
    description:
      "Sleek, native-feel iOS and Android apps built from a single codebase - fast, stable, and store-ready.",
    icon: "mobile",
    status: "available",
    detail: {
      overview:
        "One codebase, two platforms, no compromise on feel. We design and ship cross-platform apps with native gestures, offline support, and push notifications - then handle the App Store and Play Store submissions for you.",
      deliverables: [
        "iOS and Android apps from a single codebase",
        "Native-feel navigation, gestures, and animations",
        "Push notifications and deep linking",
        "Offline-first data handling",
        "Store listing, submission, and review support",
      ],
      timeline: "6 - 14 weeks, depending on scope",
    },
  },
  {
    title: "SaaS Development",
    description:
      "End-to-end product engineering: auth, billing, dashboards, and scalable cloud infrastructure that grows with you.",
    icon: "layers",
    status: "available",
    detail: {
      overview:
        "From idea to paying users. We handle the unglamorous parts of a SaaS - auth, roles, subscriptions, webhooks, admin tooling - so you can focus on the product itself. Built multi-tenant from day one so scaling later isn't a rewrite.",
      deliverables: [
        "Multi-tenant architecture with role-based access",
        "Subscription billing and invoicing",
        "Customer-facing dashboard and admin panel",
        "REST or GraphQL API with documentation",
        "CI/CD, monitoring, and error tracking",
      ],
      timeline: "8 - 20 weeks, depending on scope",
    },
  },
  {
    title: "E-commerce Solutions",
    description:
      "High-converting online stores with seamless checkout, payments, and inventory - built to sell around the clock.",
    icon: "cart",
    status: "available",
    detail: {
      overview:
        "Storefronts engineered around the checkout. We obsess over the path from product page to paid order - fewer steps, faster loads, fewer abandoned carts - and connect the back office so inventory, shipping, and orders stay in sync.",
      deliverables: [
        "Custom storefront and product experience",
        "Optimised, low-friction checkout",
        "Payment gateway and multi-currency setup",
        "Inventory, orders, and shipping integrations",
        "Abandoned-cart recovery and email flows",
      ],
      timeline: "4 - 12 weeks, depending on scope",
    },
  },
  {
    title: "UI/UX Design",
    description:
      "Interfaces that look sharp and convert harder - research-driven design systems, prototypes, and pixel-perfect handoff.",
    icon: "design",
    status: "available",
    detail: {
      overview:
        "Design that earns its keep. We start with your users and your funnel, then build an interface and a design system around what moves the numbers - handed off in a state engineers can build from without guesswork.",
      deliverables: [
        "User research and competitor teardown",
        "Wireframes and clickable prototypes",
        "High-fidelity UI across all breakpoints",
        "Reusable design system and components",
        "Developer handoff with specs and assets",
      ],
      timeline: "2 - 8 weeks, depending on scope",
    },
  },
  {
    title: "SEO & Digital Marketing",
    description:
      "Rank higher and reach further - technical SEO, content strategy, and campaigns that turn traffic into revenue.",
    icon: "seo",
    status: "available",
    detail: {
      overview:
        "Traffic is only useful if it converts. We fix the technical foundation first, then build content and campaigns around the keywords your buyers actually search - and report on revenue, not vanity metrics.",
      deliverables: [
        "Technical SEO audit and fixes",
        "Keyword research and content strategy",
        "On-page optimisation and internal linking",
        "Link building and local SEO",
        "Paid campaigns plus monthly reporting",
      ],
      timeline: "Ongoing, with a 3-month minimum for results",
    },
  },
  {
    title: "Website Maintenance",
    description:
      "Updates, monitoring, backups, and support - we keep your site fast, secure, and always online after launch.",
    icon: "wrench",
    status: "available",
    detail: {
      overview:
        "Launch day is the start, not the finish. We keep your site patched, backed up, and monitored around the clock - and you get a real person to call when something breaks, not a ticket queue.",
      deliverables: [
        "Security patches and dependency updates",
        "Automated backups with tested restores",
        "24/7 uptime and performance monitoring",
        "Content and small feature updates",
        "Monthly health report with priority support",
      ],
      timeline: "Monthly retainer, cancel anytime",
    },
  },
  {
    title: "AI Solutions",
    description:
      "Intelligent automation, custom models, and AI-native experiences that put your business a level above the rest.",
    icon: "spark",
    status: "coming-soon",
    detail: {
      overview:
        "We're putting the finishing touches on our AI practice: chatbots that actually understand your business, workflow automation that removes the busywork, and custom models trained on your own data. Early-access slots open soon.",
      deliverables: [
        "Custom chatbots and AI assistants",
        "Document and knowledge-base search (RAG)",
        "Workflow and process automation",
        "Model fine-tuning on your own data",
        "AI features embedded in your existing product",
      ],
      timeline: "Launching soon - join the early-access list",
    },
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
  /** Monogram - fallback thumbnail when no screenshot exists. */
  monogram: string;
  /** Screenshot in /public/portfolio. */
  image?: string;
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
    image: "/portfolio/CGShift.png",
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
    image: "/portfolio/Fallowkind.png",
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
    image: "/portfolio/Brushmaster.png",
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
    image: "/portfolio/SerendibPrime.png",
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
    image: "/portfolio/NewSagarikaDrivingSchool.png",
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
  { label: "Facebook", href: "#", key: "facebook" },
  { label: "Instagram", href: "#", key: "instagram" },
  { label: "TikTok", href: "#", key: "tiktok" },
  { label: "YouTube", href: "#", key: "youtube" },
  { label: "LinkedIn", href: "#", key: "linkedin" },
  { label: "Discord", href: "#", key: "discord" },
] as const;
