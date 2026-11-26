export interface SectionMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const HOME_SECTIONS_LIST: SectionMeta[] = [
  { id: "hero", name: "Hero Section", description: "Main banner with video or image display", icon: "PlaySquare" },
  { id: "about-us", name: "About Us & Statistics", description: "Company profile, credentials & live statistics counters", icon: "Building2" },
  { id: "product-categories", name: "Product Categories", description: "Grid of corrugated box types and product links", icon: "Boxes" },
  { id: "why-choose-us", name: "Why Choose Us", description: "6 core value propositions and industrial strengths", icon: "ShieldCheck" },
  { id: "custom-packaging", name: "Custom Packaging Solutions", description: "Tailored configurator steps & dimensions", icon: "Sliders" },
  { id: "manufacturing-process", name: "Manufacturing Process", description: "From raw paper reel to finished box workflow", icon: "Factory" },
  { id: "industries-we-serve", name: "Industries We Serve", description: "Automotive, Pharma, Food, E-Commerce sectors", icon: "Layers" },
  { id: "case-studies", name: "Case Studies & Applications", description: "Real-world industrial packaging deployments", icon: "Briefcase" },
  { id: "box-construction", name: "Corrugated Box Construction", description: "3-Ply, 5-Ply & 7-Ply board anatomy", icon: "Layers3" },
  { id: "sustainability", name: "Sustainability", description: "100% recyclable, circular economy principles", icon: "Leaf" },
  { id: "our-clients", name: "Our Clients", description: "Partner brand logos and infinite marquee", icon: "Handshake" },
  { id: "testimonials", name: "Testimonials", description: "Rotating client reviews and feedback cards", icon: "MessageSquareQuote" },
  { id: "faq", name: "Frequently Asked Questions", description: "Accordion questions, answers and ply selection tips", icon: "HelpCircle" },
  { id: "cta", name: "Final Call To Action", description: "Lead generation, inquiry telephone and quote CTA", icon: "Sparkles" },
];

export const DEFAULT_HOME_DATA: Record<string, any> = {
  hero: {
    sectionId: "hero",
    sectionName: "Hero Section",
    mediaType: "video", // "video" or "image"
    videoMode: "frames", // "frames" or "video-url"
    videoUrl: "", // custom mp4/webm URL if chosen
    imageUrl: "/home/company img.png", // fallback or chosen image
    title: "Engineered Corrugated Packaging",
    subtitle: "High-strength, precision-crafted boxes for industrial, retail, and e-commerce supply chains",
    primaryButtonText: "Explore Products",
    primaryButtonLink: "/products",
    secondaryButtonText: "Get Instant Quote",
    secondaryButtonLink: "/contact",
    updatedAt: new Date().toISOString(),
  },
  "about-us": {
    sectionId: "about-us",
    sectionName: "About Us & Statistics",
    badge: "ABOUT AAVRIT PACKAGING",
    title: "Protection Begins With Better Packaging.",
    description: "At AAVRIT Packaging, we believe packaging is more than just a box. It is an essential part of protecting products, maintaining quality and helping businesses deliver with confidence.",
    bulletPoints: [
      "Continuous Quality Assurance & Burst Strength Testing",
      "High-Precision Auto Die-Cutting & Multi-Color Printing",
      "Sustainable & 100% Recyclable Paper-Based Materials"
    ],
    mediaType: "image",
    mediaUrl: "/home/company img.png",
    image: "/home/company img.png",
    stats: [
      { id: "stat-1", value: 25, suffix: "+", label: "Years of Experience", subtext: "Dedicated manufacturing journey" },
      { id: "stat-2", value: 500, suffix: "+", label: "Clients Served", subtext: "Across major industrial sectors" },
      { id: "stat-3", value: 1200, suffix: "+", label: "Packaging Solutions", subtext: "Engineered box designs" },
      { id: "stat-4", value: 65, suffix: "+", label: "Cities Reached", subtext: "Pan-India delivery network" }
    ],
    updatedAt: new Date().toISOString(),
  },
  "product-categories": {
    sectionId: "product-categories",
    sectionName: "Product Categories",
    badge: "OUR PRODUCT RANGE",
    title: "Comprehensive Packaging Categories",
    subtitle: "Explore our range of heavy-duty industrial boxes, printed retail mailers, and specialized corrugated packaging solutions.",
    categories: [
      { id: "corrugated-boxes", title: "Corrugated Boxes", image: "/home/product-categories/corrugated-boxes.png", href: "/products?category=corrugated-boxes" },
      { id: "printed-corrugated-boxes", title: "Printed Corrugated Boxes", image: "/home/product-categories/printed-corrugated-boxes.png", href: "/products?category=printed-corrugated-boxes" },
      { id: "die-cut-boxes", title: "Die-Cut Boxes", image: "/home/product-categories/die-cut-boxes.png", href: "/products?category=die-cut-boxes" },
      { id: "industrial-packaging", title: "Industrial Packaging", image: "/home/product-categories/industrial-packaging.png", href: "/products?category=industrial-packaging" },
      { id: "food-packaging", title: "Food Packaging", image: "/home/product-categories/food-packaging.png", href: "/products?category=food-packaging" },
      { id: "ecommerce-packaging", title: "E-commerce Packaging", image: "/home/product-categories/ecommerce-packaging.png", href: "/products?category=ecommerce-packaging" }
    ],
    updatedAt: new Date().toISOString(),
  },
  "why-choose-us": {
    sectionId: "why-choose-us",
    sectionName: "Why Choose Us",
    badge: "WHY WORK WITH US",
    title: "Built for Strength, Engineered for Protection",
    subtitle: "Discover how our manufacturing standards and rigorous quality assurance deliver dependable packaging performance.",
    features: [
      { number: "01", title: "Quality-Focused Manufacturing", description: "Careful attention to materials, construction and packaging quality at every stage.", tag: "Certified Testing" },
      { number: "02", title: "Strength & Durability", description: "Corrugated packaging solutions designed to provide dependable product protection.", tag: "High Burst Factor" },
      { number: "03", title: "Customized Packaging Solutions", description: "Flexible packaging designs tailored to different product dimensions and requirements.", tag: "Precision CAD" },
      { number: "04", title: "Manufacturing Precision", description: "Attention to structural accuracy, folding quality and consistent packaging construction.", tag: "Automated Lines" },
      { number: "05", title: "Reliable Supply", description: "Packaging solutions planned around business and commercial supply requirements.", tag: "On-Time Dispatch" },
      { number: "06", title: "Customer-Centric Approach", description: "Focused on understanding customer requirements and providing suitable packaging solutions.", tag: "Dedicated Support" }
    ],
    updatedAt: new Date().toISOString(),
  },
  "custom-packaging": {
    sectionId: "custom-packaging",
    sectionName: "Custom Packaging Solutions",
    badge: "CUSTOM SOLUTIONS",
    title: "Custom Box Configurator & Prototyping",
    subtitle: "Tailored to your exact dimensional, flute, and branding specifications with fast turnaround sampling.",
    mediaType: "image",
    mediaUrl: "/home/custom-packaging/box-open.png",
    steps: [
      { step: "01", title: "Size & Dimensions", description: "Specify internal length, width, and depth for exact fitment." },
      { step: "02", title: "Board & Flute Selection", description: "Choose 3-ply, 5-ply, or 7-ply with single or double fluting." },
      { step: "03", title: "Branding & Print", description: "Flexographic multi-color printing, custom logos, and barcodes." },
      { step: "04", title: "Prototype & Dispatch", description: "Rapid digital CAD sample approval before batch production." }
    ],
    updatedAt: new Date().toISOString(),
  },
  "manufacturing-process": {
    sectionId: "manufacturing-process",
    sectionName: "Manufacturing Process",
    badge: "PRODUCTION WORKFLOW",
    title: "Precision Manufacturing From Reel to Box",
    subtitle: "Step-by-step glimpse into our automated corrugation, slitting, printing, and gluing lines.",
    stages: [
      {
        id: "stage-01",
        number: "01",
        title: "Raw Material Selection",
        description: "Selection of suitable kraft paper and raw materials for corrugated board production.",
        visualLabel: "Industrial Kraft Paper Jumbo Rolls",
        mediaType: "image",
        image: "/home/manufacturing-process/raw-material-selection.png",
        technicalSpecs: [
          "120 to 450 GSM Virgin Kraft & Semi-Chemical Fluting",
          "Burst Factor (BF) certified Indian & imported paper mills",
          "Moisture controlled roll storage with traceability codes"
        ]
      },
      {
        id: "stage-02",
        number: "02",
        title: "Corrugation & Board Formation",
        description: "Heat, steam, and fluting rollers bond linerboard to corrugated medium.",
        visualLabel: "High-Speed Corrugation Line",
        mediaType: "image",
        image: "/home/manufacturing-process/corrugation-line.png",
        technicalSpecs: [
          "Flute profiles: B, C, E, BC, and Triple Wall",
          "Starch-based eco adhesive bonding",
          "Calibrated thickness monitoring"
        ]
      },
      {
        id: "stage-03",
        number: "03",
        title: "Flexographic Printing & Slotting",
        description: "High-definition brand printing and precise creasing and slotting.",
        visualLabel: "Flexo Printer Slotter Unit",
        mediaType: "image",
        image: "/home/manufacturing-process/printing-slotting.png",
        technicalSpecs: [
          "Water-based environmentally safe inks",
          "High-accuracy rotary slotting knives",
          "Multi-colour registered printing"
        ]
      },
      {
        id: "stage-04",
        number: "04",
        title: "Die-Cutting & Assembly",
        description: "Rotary and flatbed die-cutting with automated folder-gluer strapping.",
        visualLabel: "Automatic Folder Gluer",
        mediaType: "image",
        image: "/home/manufacturing-process/die-cutting-assembly.png",
        technicalSpecs: [
          "Laser-cut hardened steel dies",
          "Hot-melt and cold PVA adhesive binding",
          "Palletized shrink-wrapped bundling"
        ]
      }
    ],
    updatedAt: new Date().toISOString(),
  },
  "industries-we-serve": {
    sectionId: "industries-we-serve",
    sectionName: "Industries We Serve",
    badge: "TARGET SECTORS",
    title: "Specialized Packaging for Every Industry",
    subtitle: "Engineered box solutions catering to unique weight, barrier, and stacking requirements.",
    industries: [
      {
        id: "automotive",
        slug: "automotive",
        name: "Automotive",
        description: "Protective packaging solutions for automotive components and transportation.",
        mediaType: "image",
        image: "/home/industries/automotive.jpg",
        applications: ["Auto Components", "Spare Parts", "Engine Components", "Metal & Plastic Parts"]
      },
      {
        id: "pharmaceutical",
        slug: "pharmaceutical",
        name: "Pharmaceutical",
        description: "Reliable secondary packaging for pharmaceutical products and medical supplies.",
        mediaType: "image",
        image: "/home/industries/pharmaceutical.jpg",
        applications: ["Medicine Packaging", "Secondary Packaging", "Bottle Packaging", "Medical Equipment"]
      },
      {
        id: "food-beverage",
        slug: "food-beverage",
        name: "Food & Beverage",
        description: "Hygienic corrugated boxes for fresh produce, confectionery, and beverages.",
        mediaType: "image",
        image: "/home/industries/food-beverage.jpg",
        applications: ["Bakery Products", "Beverage Cartons", "Snacks Packaging", "Produce Trays"]
      },
      {
        id: "ecommerce",
        slug: "ecommerce",
        name: "E-Commerce & Retail",
        description: "Lightweight, tamper-evident mailers and custom shipper boxes.",
        mediaType: "image",
        image: "/home/industries/ecommerce.jpg",
        applications: ["Courier Boxes", "Subscription Packaging", "Mailers", "Fragile Item Cushioning"]
      },
      {
        id: "electronics",
        slug: "electronics",
        name: "Electronics & Appliances",
        description: "Anti-static, impact-resistant packaging for precision electronics.",
        mediaType: "image",
        image: "/home/industries/electronics.jpg",
        applications: ["Home Appliances", "Circuit Boards", "Lighting Fixtures", "Audio Equipment"]
      },
      {
        id: "textile",
        slug: "textile",
        name: "Textiles & Garments",
        description: "High-volume master cartons designed for export garments and apparel.",
        mediaType: "image",
        image: "/home/industries/textile.jpg",
        applications: ["Apparel Export", "Fabric Rolls", "Retail Garment Boxes", "Hanger Cartons"]
      }
    ],
    updatedAt: new Date().toISOString(),
  },
  "case-studies": {
    sectionId: "case-studies",
    sectionName: "Case Studies & Applications",
    badge: "PACKAGING APPLICATIONS",
    title: "Proven in Action: Real-World Applications",
    subtitle: "Explore how our custom packaging structures solve transit safety and shipping efficiency.",
    applications: [
      {
        id: "automotive",
        projectNumber: "PROJECT 01",
        category: "AUTOMOTIVE",
        title: "Packaging for Automotive Components",
        description: "Corrugated packaging applications for automotive components, spare parts, metal parts and industrial supplies.",
        mediaType: "image",
        image: "/home/case-studies/automotive-packaging.png",
        href: "/industries/automotive",
        highlights: ["Engine & Machined Parts", "Heavy-Duty 7-Ply Protection", "Custom Internal Partitions"]
      },
      {
        id: "food-beverage",
        projectNumber: "PROJECT 02",
        category: "FOOD & BEVERAGE",
        title: "Packaging for Food & FMCG Products",
        description: "Practical corrugated packaging applications for food products, bakery items, snacks and FMCG goods.",
        mediaType: "image",
        image: "/home/case-studies/food-beverage-packaging.png",
        href: "/industries/food-beverage",
        highlights: ["Bakery & Confectionery", "Food-Grade Sourcing", "Ventilated Air-Flow"]
      },
      {
        id: "ecommerce",
        projectNumber: "PROJECT 03",
        category: "E-COMMERCE",
        title: "Reliable Packaging for Every Shipment",
        description: "Corrugated shipping boxes, mailers and protective packaging applications for online orders and delivery operations.",
        mediaType: "image",
        image: "/home/case-studies/ecommerce-packaging.png",
        href: "/industries/ecommerce",
        highlights: ["Rapid Assembly", "Crush-Resistant Edges", "Branded Flexo Print"]
      }
    ],
    updatedAt: new Date().toISOString(),
  },
  "box-construction": {
    sectionId: "box-construction",
    sectionName: "Corrugated Box Construction",
    badge: "CORRUGATED ANATOMY",
    title: "Understanding Board Construction (3 / 5 / 7 Ply)",
    subtitle: "Select the ideal wall thickness and fluting combination to maximize stacking strength and reduce costs.",
    plyOptions: [
      {
        id: "3-ply",
        name: "3-Ply Single Wall",
        category: "Lightweight & E-Commerce",
        construction: "2 Liners + 1 Fluted Medium",
        layersSummary: "Outer Liner + Wave Medium + Inner Liner",
        description: "Standard single-wall corrugated board engineered for parcels, consumer retail, and lightweight storage.",
        mediaType: "image",
        image: "/home/box-construction/3ply.png",
        bestFor: ["Up to 15 kg product payload", "E-commerce courier mailers", "Dry grocery & retail displays"]
      },
      {
        id: "5-ply",
        name: "5-Ply Double Wall",
        category: "Industrial & Heavy Duty",
        construction: "3 Liners + 2 Fluted Mediums",
        layersSummary: "Outer Liner + B Flute + Mid Liner + C Flute + Inner Liner",
        description: "Double-wall board delivering substantial compressive strength and puncture protection for industrial logistics.",
        mediaType: "image",
        image: "/home/box-construction/5ply.png",
        bestFor: ["15 kg to 45 kg product payload", "Bulk export master cartons", "Electronics & home appliances"]
      },
      {
        id: "7-ply",
        name: "7-Ply Triple Wall",
        category: "Heavy Machinery & Wooden Crate Replacement",
        construction: "4 Liners + 3 Fluted Mediums",
        layersSummary: "Heavy Outer + Flute 1 + Liner + Flute 2 + Liner + Flute 3 + Inner",
        description: "Maximum strength triple-wall corrugated board capable of replacing traditional wooden packaging.",
        mediaType: "image",
        image: "/home/box-construction/7ply.png",
        bestFor: ["Over 45 kg heavy loads", "Automotive machinery parts", "Sea freight export shipments"]
      }
    ],
    updatedAt: new Date().toISOString(),
  },
  sustainability: {
    sectionId: "sustainability",
    sectionName: "Sustainability",
    badge: "PACKAGING WITH PURPOSE",
    title: "Committed to Circular & Sustainable Packaging",
    subtitle: "Environmentally responsible corrugated solutions made from renewable, biodegradable fiber.",
    principles: [
      {
        number: "01",
        title: "Recyclable Paper-Based Packaging",
        description: "Corrugated cardboard is paper-based and can generally be recycled through suitable paper recovery and recycling facilities.",
        badge: "Circular Material Recovery"
      },
      {
        number: "02",
        title: "Smarter Packaging Design",
        description: "Appropriate box dimensions and construction can help avoid unnecessary packaging material while maintaining product protection.",
        badge: "Right-Sized Engineering"
      },
      {
        number: "03",
        title: "Efficient Material Usage",
        description: "Thoughtful material selection and production planning can help make better use of packaging resources.",
        badge: "Resource Optimization"
      },
      {
        number: "04",
        title: "Eco-Conscious Manufacturing Flow",
        description: "Modern box assembly practices reduce scrap and energy consumption while ensuring consistent structural strength.",
        badge: "Sustainable Operations"
      }
    ],
    updatedAt: new Date().toISOString(),
  },
  "our-clients": {
    sectionId: "our-clients",
    sectionName: "Our Clients",
    badge: "OUR CLIENTS",
    title: "Trusted by Businesses",
    subtitle: "Building reliable packaging partnerships across industries.",
    clients: [
      {
        id: "kavron",
        name: "Kavron Auto Components",
        industry: "Automotive Components",
        location: "Vapi, Gujarat",
        logo: "/home/clients/kavron-auto-components.svg",
        alt: "Kavron Auto Components logo",
      },
      {
        id: "mivora",
        name: "Mivora Foods",
        industry: "Food & Beverage",
        location: "Valsad, Gujarat",
        logo: "/home/clients/mivora-foods.svg",
        alt: "Mivora Foods logo",
      },
      {
        id: "truvolt",
        name: "Truvolt Electricals",
        industry: "Electrical Products",
        location: "Surat, Gujarat",
        logo: "/home/clients/truvolt-electricals.svg",
        alt: "Truvolt Electricals logo",
      },
      {
        id: "nivaan",
        name: "Nivaan Textiles",
        industry: "Textile & Garments",
        location: "Silvassa, D&NH and D&D",
        logo: "/home/clients/nivaan-textiles.svg",
        alt: "Nivaan Textiles logo",
      },
      {
        id: "westora",
        name: "Westora Industrial Supplies",
        industry: "Industrial Supplies",
        location: "Umbergaon, Gujarat",
        logo: "/home/clients/westora-industrial-supplies.svg",
        alt: "Westora Industrial Supplies logo",
      },
    ],
    updatedAt: new Date().toISOString(),
  },
  testimonials: {
    sectionId: "testimonials",
    sectionName: "Testimonials",
    badge: "CLIENT EXPERIENCES",
    title: "What Our Partners Say",
    subtitle: "Strong packaging builds stronger business relationships.",
    testimonials: [
      {
        id: "kavron",
        companyName: "Kavron Auto Components",
        industry: "Automotive Components",
        location: "Vapi, Gujarat",
        logo: "/home/clients/kavron-auto-components.svg",
        contactPerson: "Rajesh Panchal",
        designation: "Supply Chain & Operations",
        quote: "The packaging solution has been designed to meet our component handling and transportation requirements.",
      },
      {
        id: "mivora",
        companyName: "Mivora Foods",
        industry: "Food & Beverage",
        location: "Valsad, Gujarat",
        logo: "/home/clients/mivora-foods.svg",
        contactPerson: "Pooja Desai",
        designation: "Packaging Quality Lead",
        quote: "The customized box design gives our products a neat and professional packaging presentation.",
      },
      {
        id: "truvolt",
        companyName: "Truvolt Electricals",
        industry: "Electrical Products",
        location: "Surat, Gujarat",
        logo: "/home/clients/truvolt-electricals.svg",
        contactPerson: "Amitabh Shah",
        designation: "Logistics Manager",
        quote: "The packaging design focuses on keeping our electrical products organized and protected during handling.",
      },
      {
        id: "nivaan",
        companyName: "Nivaan Textiles",
        industry: "Textile & Garments",
        location: "Silvassa",
        logo: "/home/clients/nivaan-textiles.svg",
        contactPerson: "Dhiren Patel",
        designation: "Dispatch & Export Coordinator",
        quote: "The packaging solution provides a practical way to organize and dispatch our textile products.",
      },
      {
        id: "westora",
        companyName: "Westora Industrial Supplies",
        industry: "Industrial Supplies",
        location: "Umbergaon, Gujarat",
        logo: "/home/clients/westora-industrial-supplies.svg",
        contactPerson: "Kishore Mehta",
        designation: "Plant Head",
        quote: "The packaging requirements for our industrial supplies are addressed with a practical and suitable box design.",
      },
    ],
    updatedAt: new Date().toISOString(),
  },
  faq: {
    sectionId: "faq",
    sectionName: "Frequently Asked Questions",
    badge: "KNOWLEDGE BASE",
    title: "Frequently Asked Questions",
    subtitle: "Clear answers on flute selections, burst factor testing, custom dimensions, and minimum order quantities.",
    faqs: [
      {
        id: "faq-1",
        number: "01",
        tag: "Board Basics",
        q: "What is a corrugated box and how is it constructed?",
        a: "A corrugated box is made of wavy arched paper (fluting) sandwiched between flat kraft paper liners. This arched structure creates air cushions that provide high stacking strength and impact protection during shipping."
      },
      {
        id: "faq-2",
        number: "02",
        tag: "Ply Selection",
        q: "What is the difference between 3-ply, 5-ply, and 7-ply boxes?",
        a: "3-ply (Single Wall) has 1 fluted layer for lightweight goods and e-commerce. 5-ply (Double Wall) has 2 fluted layers for master shipping and appliances. 7-ply (Triple Wall) has 3 fluted layers for heavy industrial machinery and export freight."
      },
      {
        id: "faq-3",
        number: "03",
        tag: "Customization",
        q: "Can boxes be customized in exact dimensions and printing?",
        a: "Yes. All boxes can be manufactured to your exact internal size (Length × Width × Height) to avoid wasted space. We also offer multi-colour brand printing, barcodes, and custom artwork on kraft or white liners."
      },
      {
        id: "faq-4",
        number: "04",
        tag: "Flute Engineering",
        q: "Which flute profile is suitable for my specific packaging needs?",
        a: "B-Flute (~3mm) is best for puncture resistance and sharp printing. C-Flute (~4mm) delivers maximum vertical stacking strength for warehouse storage. BC Double Wall combines both for heavy-duty protection."
      },
      {
        id: "faq-5",
        number: "05",
        tag: "Quotations & Orders",
        q: "How do I request a technical consultation or production quote?",
        a: "Simply share your box dimensions, product weight, ply choice, and estimated quantity via our online form or phone. Our engineering desk will recommend the optimal paper GSM and share a detailed quotation within 24 hours."
      }
    ],
    updatedAt: new Date().toISOString(),
  },
  cta: {
    sectionId: "cta",
    sectionName: "Final Call To Action",
    badge: "READY TO GET STARTED",
    title: "Let's Engineer Your Ideal Corrugated Packaging",
    subtitle: "Request a custom sample, technical consultation, or bulk production quote from our packaging specialists.",
    primaryButtonText: "Request Instant Quote",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Call Packaging Desk",
    secondaryButtonPhone: "+91 98765 43210",
    mediaType: "gif",
    mediaUrl: "/home/cta/animated-welcoming-businessman.gif",
    updatedAt: new Date().toISOString(),
  }
};
