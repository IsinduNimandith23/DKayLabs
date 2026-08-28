/**
 * Central content + config. Edit copy here, not in components.
 */

export const SITE = {
  name: "DKayLABS",
  // Drives the browser <title> and footer.
  tagline: "Websites, SaaS & AI Products Built to Perform",
  /**
   * Canonical origin - NO trailing slash. `metadataBase`, every canonical
   * URL, robots.txt and sitemap.xml all derive from this, so the domain is
   * never written down twice. Override per-environment (preview deploys)
   * with NEXT_PUBLIC_SITE_URL.
   *
   * The `www` is load-bearing: Vercel serves this site from www and the bare
   * apex 308s to it. Declaring the apex here pointed every canonical at a
   * URL that redirects, so the host actually serving the page was disowning
   * itself. If the primary domain is ever flipped, flip this with it.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dkaylabs.com",
  description:
    "DKayLABS is a digital services company building high-performance websites, SaaS platforms, and AI-powered products.",
  email: "contact@dkaylabs.com",
  phone: "+94 77 037 2960",
  /** Same number, digits only - the format wa.me links require. */
  whatsapp: "94770372960",
  /** Pre-typed into the chat when the floating WhatsApp button is tapped. */
  whatsappMessage: "Hi DKayLABS, I'd like to talk about a project.",
  location: "Colombo, Sri Lanka",
  hours: "Available 24/7",
} as const;

/** Inline icon keys, all resolved in components/ui/ServiceIcon.tsx. */
export type IconKey =
  | "code"
  | "mobile"
  | "layers"
  | "cart"
  | "design"
  | "seo"
  | "wrench"
  | "spark"
  | "factory"
  | "car";

/* ============================================================
   Products - what DKayLABS is building in-house.
   Declared above NAV_LINKS because the navbar dropdown is
   derived from this list, so there is one source of truth.
   ============================================================ */

export type Product = {
  /** Anchor id on /products, also used in the navbar deep-link. */
  slug: string;
  name: string;
  /** One-liner shown under the name in the navbar dropdown. */
  tagline: string;
  /** Card body copy on /products. */
  description: string;
  icon: IconKey;
  status: "in-development" | "beta" | "live";
  /** Short bullets listed under the description on the product card. */
  highlights: string[];
  /** Long-form copy for the product's own page at /products/<slug>. */
  detail: {
    /** A paragraph or two expanding on `description`. */
    overview: string;
    /** Where the build is up to - always framed as an estimate. */
    timeline: string;
  };
};

/** Badge copy per status - keeps the label out of the components. */
export const PRODUCT_STATUS: Record<Product["status"], string> = {
  "in-development": "In Development",
  beta: "Private Beta",
  live: "Live",
};

export const PRODUCTS: Product[] = [
  {
    slug: "mrp",
    name: "MRP Platform",
    tagline: "Manufacturing & Inventory Platform",
    description:
      "Software for small manufacturers who have outgrown the stock spreadsheet. The inventory module runs today - live stock by warehouse, shelf and batch, with a permanent record behind every number. Manufacturing, sales and accounting follow, one module at a time.",
    icon: "factory",
    status: "in-development",
    highlights: [
      "Live stock by warehouse, shelf location and batch",
      "Serial-number tracking on high-value items",
      "A permanent record of every stock movement",
      "Manufacturing, sales and accounting modules to follow",
    ],
    detail: {
      overview:
        "Most small manufacturers run their stock in a spreadsheet that only one person really understands - and the number in it is whatever someone last typed. The MRP Platform replaces it with a system where every quantity on screen traces back to a movement somebody actually recorded.\n\nIt is built to be adopted a piece at a time rather than all at once. Inventory is live today; manufacturing, sales and purchasing, and accounting are designed and follow behind it.",
      timeline:
        "In active development. The inventory module is running today, and we're onboarding a small group of manufacturers for feedback before general release.",
    },
  },
  {
    slug: "driving-school",
    name: "Driving School Manager",
    tagline: "Driving School Management System",
    // TODO: replace with final product copy.
    description:
      "A management system for driving schools - student records, instructor and vehicle scheduling, lesson bookings, and payments in one place, so the office stops running on spreadsheets and phone calls. Currently in active development.",
    icon: "car",
    status: "in-development",
    // TODO: replace with the final feature list.
    highlights: [
      "Student enrolment, documents, and licence progress",
      "Instructor rosters and vehicle scheduling",
      "Lesson booking with automated reminders",
      "Payments, packages, and progress reports",
    ],
    // TODO: replace with final product copy.
    detail: {
      overview:
        "Driving schools juggle students, instructors, vehicles, and a calendar that changes every day - usually across a paper diary, a phone, and someone's memory. This brings all of it into one system: enrol a student, track their documents and lesson history, and book them against an instructor and a car that are actually free.\n\nAutomated reminders cut no-shows, and payments and packages are tracked per student so the office always knows who owes what.",
      timeline:
        "In active development. We're working with driving schools now to shape the booking and scheduling flow.",
    },
  },
];

/* ============================================================
   MRP Platform - long-form page content.

   The MRP product gets a bespoke page at /products/mrp instead of the
   generic ProductDetail layout (see app/products/[slug]/page.tsx). All of
   its copy lives here, same as everything else on the site.

   AUDIENCE NOTE: this page is read by factory owners and stock controllers,
   not engineers. Nothing here names the stack, and the concepts are
   described in plain language - "a permanent record", not "an immutable
   append-only ledger". Keep it that way when editing.

   TRUTHFULNESS NOTE: the feature copy describes the inventory module as it
   actually exists. Manufacturing, sales and accounting are listed as
   designed, because that is what they are. Don't promote a module here
   before it ships.
   ============================================================ */

/** Enquiry link shared by every CTA on the MRP page. */
export const MRP_ENQUIRY_HREF = `/contact?product=${encodeURIComponent("MRP Platform")}`;

/** How a movement type is coloured wherever it appears in a mock table. */
export type MrpTagTone = "receipt" | "issue" | "transfer" | "adjust" | "low";

/**
 * One cell in a mock table.
 *   text - plain copy
 *   code - part numbers and batch codes, set in mono
 *   num  - quantities and prices, mono + tabular + right-aligned
 *   tag  - a coloured pill, needs `tone`
 */
/*
 * Readonly throughout: MRP_PAGE is declared `as const` like the other content
 * exports in this file, so every array in it is a readonly tuple. A mutable
 * signature here would reject the real data.
 */
export type MrpCell = {
  readonly text: string;
  readonly kind?: "text" | "code" | "num" | "tag";
  readonly tone?: MrpTagTone;
};

export type MrpTable = {
  /** Column headings. `num` cells right-align, so their heading does too. */
  readonly columns: readonly {
    readonly label: string;
    readonly kind?: MrpCell["kind"];
  }[];
  readonly rows: readonly (readonly MrpCell[])[];
};

export const MRP_PAGE = {
  hero: {
    pill: "In active development - inventory live today",
    /** Split so the second half can take the shimmer treatment. */
    headingLead: "Know what's on the shelf. ",
    headingAccent: "Not what someone typed last Tuesday.",
    lede: "The MRP Platform is for small manufacturers who have outgrown the stock spreadsheet. Every quantity on screen traces back to a movement someone actually recorded - so the number you're looking at is the number in the building.",
    primaryCta: "Request early access",
    secondaryCta: "See what's running today",
    note: "Inventory module live today - manufacturing next",
  },

  /* --- Section 2: a mock of the real inventory dashboard --------------- */
  dashboard: {
    /** Illustrative only - swap this block for a screenshot when there is one. */
    caption:
      "Illustration of the MRP Platform inventory dashboard, showing stock totals, recent movements and low-stock items.",
    url: "app.mrp.dkaylabs.com/inventory/dashboard",
    title: "Inventory",
    subtitle: "Main Plant - Colombo, LK",
    action: "New Movement",
    /** `alert` tints the figure amber - the one number you'd want to act on. */
    kpis: [
      { label: "Total Products", value: "6", alert: false },
      { label: "Low Stock Items", value: "3", alert: true },
      { label: "Units On Hand", value: "1,284", alert: false },
      { label: "Total Warehouses", value: "2", alert: false },
    ],
    movementsTitle: "Recent movements",
    movementsMeta: "Last 24h",
    movements: {
      columns: [
        { label: "Item" },
        { label: "Type" },
        { label: "Route" },
        { label: "Qty", kind: "num" },
      ],
      rows: [
        [
          { text: "PRD-001-50", kind: "code" },
          { text: "Receipt", kind: "tag", tone: "receipt" },
          { text: "Supplier → Rack A" },
          { text: "+120", kind: "num" },
        ],
        [
          { text: "PRD-002-STD", kind: "code" },
          { text: "Issue", kind: "tag", tone: "issue" },
          { text: "Rack B → Production" },
          { text: "-45", kind: "num" },
        ],
        [
          { text: "PRD-005-A", kind: "code" },
          { text: "Transfer", kind: "tag", tone: "transfer" },
          { text: "Staging → Bay 1" },
          { text: "18", kind: "num" },
        ],
        [
          { text: "PRD-004-EPDM", kind: "code" },
          { text: "Adjust", kind: "tag", tone: "adjust" },
          { text: "Rack A - stock count" },
          { text: "-2", kind: "num" },
        ],
        [
          { text: "PRD-003-16B", kind: "code" },
          { text: "Receipt", kind: "tag", tone: "receipt" },
          { text: "Supplier → Bay 2" },
          { text: "+60", kind: "num" },
        ],
      ],
    },
    attentionTitle: "Needs attention",
    attentionMeta: "10 units or fewer",
    attention: [
      { name: "Hydraulic Pump C", meta: "PRD-005-A - Rack B", left: "4 left" },
      { name: "Thread Sealant", meta: "PRD-006-250 - Staging", left: "7 left" },
      { name: "Sealing Ring", meta: "PRD-004-EPDM - Quarantine", left: "9 left" },
    ],
  },

  /* --- Section 3: the spreadsheet, and the alternative ----------------- */
  problem: {
    eyebrow: "The problem",
    headingLead: "Your spreadsheet doesn't know ",
    headingAccent: "what's on the shelf.",
    lede: "It knows what somebody typed into it. Every manufacturer we spoke to had the same handful of problems, and none of them were fixed by a bigger spreadsheet.",
    now: {
      cap: "How it works now",
      title: "A number nobody trusts",
      points: [
        "Three versions of the same stock sheet, and the newest one isn't necessarily the right one",
        "Someone overwrites a quantity and the reason it changed is gone for good",
        "An order placed against a figure that was already a week out of date",
        "A customer asks which batch they were sent and the answer takes two days to find",
      ],
    },
    platform: {
      cap: "How the platform works",
      title: "A record, not a cell",
      points: [
        "Nothing is overwritten - every delivery, issue, transfer and stock count is added to the history",
        "Each one records who moved what, from where, to where, and when",
        "The on-hand figure is worked out from that history, so it can't quietly drift away from reality",
        "Batch and serial history is a search box, not an afternoon in the filing cabinet",
      ],
    },
  },

  /* --- Section 4: what actually ships today ---------------------------- */
  features: {
    eyebrow: "Inventory module",
    headingLead: "What's ",
    headingAccent: "running today.",
    lede: "Everything below is built and usable right now - not a roadmap item.",
    rows: [
      {
        eyebrow: "Catalogue",
        title: "One product, every version it ships in",
        body: "Set a product up once, then give it as many versions as reality demands - each with its own part number, barcode, price and unit. Size, material and colour describe the difference, so a 50mm cast iron valve and an 80mm one stay one product with two versions instead of two unrelated rows nobody can reconcile.",
        chips: ["Part numbers", "Barcodes", "Sizes & materials", "Units of measure"],
        tableTitle: "Industrial Valve A",
        tableMeta: "Valves",
        table: {
          columns: [
            { label: "Part no." },
            { label: "Size" },
            { label: "Material" },
            { label: "Price", kind: "num" },
          ],
          rows: [
            [
              { text: "PRD-001-50", kind: "code" },
              { text: "50mm" },
              { text: "Cast Iron" },
              { text: "120.50", kind: "num" },
            ],
            [
              { text: "PRD-001-80", kind: "code" },
              { text: "80mm" },
              { text: "Cast Iron" },
              { text: "168.00", kind: "num" },
            ],
            [
              { text: "PRD-002-STD", kind: "code" },
              { text: "20ft" },
              { text: "Carbon Steel" },
              { text: "85.00", kind: "num" },
            ],
            [
              { text: "PRD-002-GAL", kind: "code" },
              { text: "20ft" },
              { text: "Galvanised" },
              { text: "104.75", kind: "num" },
            ],
          ],
        },
      },
      {
        eyebrow: "Stock & traceability",
        title: "Know the shelf, not just the total",
        body: 'Stock is held per version, per warehouse, per shelf and per batch - so "we have 120" becomes "84 in Rack A on batch 123, 36 in Bay 2 on batch 130." High-value items get their own serial number, tracked through their whole life from delivered to installed to sold.',
        chips: ["Warehouse & shelf", "Batch numbers", "Expiry dates", "Serial numbers"],
        tableTitle: "Stock on hand",
        tableMeta: "PRD-001-50",
        table: {
          columns: [
            { label: "Warehouse" },
            { label: "Shelf" },
            { label: "Batch" },
            { label: "Qty", kind: "num" },
          ],
          rows: [
            [
              { text: "Main Plant" },
              { text: "Rack A" },
              { text: "BATCH-123", kind: "code" },
              { text: "84", kind: "num" },
            ],
            [
              { text: "Main Plant" },
              { text: "Staging" },
              { text: "BATCH-127", kind: "code" },
              { text: "12", kind: "num" },
            ],
            [
              { text: "Overflow Depot" },
              { text: "Bay 2" },
              { text: "BATCH-130", kind: "code" },
              { text: "36", kind: "num" },
            ],
            [
              { text: "Overflow Depot" },
              { text: "Quarantine" },
              { text: "BATCH-118", kind: "code" },
              { text: "6", kind: "num" },
            ],
          ],
        },
      },
      {
        eyebrow: "Stock movements",
        title: "Four movements cover every physical event",
        body: "Goods arriving, goods going out to a job or a customer, goods moving between shelves, and counts corrected after a stocktake. Each one is written down permanently and updates the balance in the same step, so two people can never sell the same last unit. That history is the audit trail your customers and inspectors ask for.",
        chips: ["Receipt", "Issue", "Transfer", "Adjustment"],
        tableTitle: "Movement history",
        tableMeta: "PRD-005-A",
        table: {
          columns: [
            { label: "When" },
            { label: "Type" },
            { label: "Route" },
            { label: "Qty", kind: "num" },
          ],
          rows: [
            [
              { text: "14 Aug 09:12" },
              { text: "Receipt", kind: "tag", tone: "receipt" },
              { text: "Supplier → Rack B" },
              { text: "+24", kind: "num" },
            ],
            [
              { text: "15 Aug 11:40" },
              { text: "Issue", kind: "tag", tone: "issue" },
              { text: "Rack B → Job 4412" },
              { text: "-6", kind: "num" },
            ],
            [
              { text: "17 Aug 08:05" },
              { text: "Transfer", kind: "tag", tone: "transfer" },
              { text: "Rack B → Bay 1" },
              { text: "10", kind: "num" },
            ],
            [
              { text: "18 Aug 16:22" },
              { text: "Adjust", kind: "tag", tone: "adjust" },
              { text: "Rack B - stock count" },
              { text: "-4", kind: "num" },
            ],
          ],
        },
      },
    ],
  },

  /* --- Section 5: honest status per module ----------------------------- */
  modules: {
    eyebrow: "Built in the open",
    headingLead: "Adopt ",
    headingAccent: "one module at a time.",
    lede: "Most manufacturing software fails because it arrives all at once and expects the whole business to change on a Monday. This is built to be taken on a piece at a time. Here is exactly where each one stands.",
    items: [
      {
        name: "Inventory",
        meta: "Running today",
        body: "Your product list with all its versions, units of measure, warehouses and shelves, stock by batch, serial numbers on high-value items, and the full movement history behind every figure.",
        status: "Live",
        tone: "live",
      },
      {
        name: "Manufacturing",
        meta: "Designed - in build",
        body: "Recipes and part lists for what you make, the steps and machines involved, job cards on the floor, time booked against each operation, materials consumed and quality checks recorded.",
        status: "Next up",
        tone: "next",
      },
      {
        name: "Sales & purchasing",
        meta: "Designed",
        body: "Quotes, customer orders and purchase orders, your suppliers and customers, deliveries, invoices, price lists and tax - all reading from the same stock figures.",
        status: "Designed",
        tone: "planned",
      },
      {
        name: "Accounting",
        meta: "Designed",
        body: "Your accounts, journals, payments and multiple currencies, posting automatically from what the other modules already recorded rather than being keyed in twice.",
        status: "Designed",
        tone: "planned",
      },
    ],
  },

  /* --- Section 6: research, NOT testimonials --------------------------- */
  voices: {
    eyebrow: "Why we built it",
    headingLead: "We read what manufacturers say about the systems they're stuck with. ",
    headingAccent: "Then we built the opposite.",
    /*
     * Deliberate framing: these are complaints manufacturers make about
     * OTHER people's software, drawn from public industry discussion. They
     * are not DKayLABS client quotes and must never be presented as such -
     * see the note on TESTIMONIALS below.
     */
    lede: "Before writing any of it we went through the places manufacturers complain honestly about the software they already have. Every complaint that kept coming up became a rule for how this one works. These are their words about the systems they're living with - not reviews of ours.",
    quoteCap: "What they say",
    answerCap: "What we did about it",
    pairs: [
      {
        quote:
          "These systems are built for accountants, not for the people on the floor.",
        answer:
          "The screens the floor uses came first, and accounting comes last. Every task is designed around the person holding the scanner, not the person closing the books.",
      },
      {
        quote:
          "If logging a movement takes too many clicks, people will find a way around it.",
        answer:
          "Recording a movement is one short form with the obvious answers already filled in and fields a barcode scanner can drive. If it's slower than the paper it replaces, it has already failed.",
      },
      {
        quote:
          "They tried to roll out everything at once and we all went back to Excel.",
        answer:
          "The modules stand on their own. Start with inventory, run it for a season, and add manufacturing when you're ready - not because a contract says this is the month.",
      },
      {
        quote:
          "Software won't fix a process that's already broken on paper.",
        answer:
          "Completely agree, so we don't pretend otherwise. We start by walking how stock actually moves through your building, then fit the software to that - not the other way round.",
      },
    ],
  },

  /* --- Section 7: conversion ------------------------------------------- */
  earlyAccess: {
    eyebrow: "Early access",
    headingLead: "Help shape it ",
    headingAccent: "before v1",
    body: "We're onboarding a small number of manufacturers while the platform is still being built. Free for the whole development period, a direct line to the people building it, and a real say in which module lands next.",
    cta: "Request early access",
    fine: "No card. No sales call. Expect rough edges - that's the deal.",
  },
} as const;

export type NavChild = {
  label: string;
  href: string;
  description: string;
  status: string;
};

export type NavLink = {
  label: string;
  href: string;
  /** Present = renders a hover dropdown (desktop) / accordion (mobile). */
  children?: NavChild[];
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  {
    label: "Products",
    href: "/products",
    children: PRODUCTS.map((p) => ({
      label: p.name,
      href: `/products/${p.slug}`,
      description: p.tagline,
      status: PRODUCT_STATUS[p.status],
    })),
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export type Service = {
  title: string;
  description: string;
  /** Inline icon key, resolved in ServiceCard. */
  icon: IconKey;
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
  return `Hi DKayLABS,

I'd like to apply for your ${serviceTitle} service.

What I'm looking to build:
-

Budget range (if you have one in mind):
-

Please send over a tailored quote. Thanks!`;
}

/**
 * Same idea as buildInquiryMessage, but for an in-house product. Products
 * aren't quoted per-project, so this asks for a demo / early access instead.
 */
export function buildProductInquiryMessage(productName: string) {
  return `Hi DKayLABS,

I'm interested in your ${productName} and would like to hear more.

A bit about our operation:
-

What we're hoping it solves:
-

Happy to join an early access list or see a demo. Thanks!`;
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

/*
 * REAL CLIENT QUOTES ONLY. The placeholder entries that used to pad this list
 * were removed - inventing reviews for a live business site is a lie to the
 * visitor, and marking them up as schema.org AggregateRating (the obvious
 * next SEO step) would be a structured-data policy violation on top of it.
 *
 * Add quotes here as they come in. Testimonials.tsx switches from a static
 * row to the scrolling marquee once there are three.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Really happy with the work DKayLABS did for The Brush Master. They understood what we wanted, were easy to communicate with, and handled all our changes without any hassle. The website turned out clean, professional, and exactly how we wanted it. Definitely recommend them!",
    name: "Steve Akash",
    role: "Co-founder, The Brush Master",
    rating: 5,
  },
  {
    quote:
      "DKayLABS did an incredible job building the website for FALLOWKIND. The design is clean, fast, and captures our brand aesthetic perfectly. Communication was smooth from start to finish, and he was super accommodating with unlimited revisions until everything was just right - definitely worth every penny if you need a standout site!",
    name: "Saniru Senanayake",
    role: "Co-founder, FALLOWKIND",
    rating: 5,
  },
];

/**
 * Footer social links. Entries whose href is still "#" have no live profile
 * yet - the Footer skips them rather than rendering a link that opens a blank
 * tab going nowhere. Fill in the URL and the icon appears automatically.
 */
export const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/dkaylabs", key: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/dkaylabs_/", key: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@dkaylabs", key: "tiktok" },
  { label: "YouTube", href: "#", key: "youtube" },
  { label: "LinkedIn", href: "#", key: "linkedin" },
  { label: "Discord", href: "#", key: "discord" },
] as const;
