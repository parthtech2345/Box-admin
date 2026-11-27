export interface ContactHeroData {
  title: string;
  breadcrumbRoot: string;
  breadcrumbCurrent: string;
  backgroundImage: string;
  backgroundImageAlt?: string;
  characterImage: string;
  characterAlt: string;
  characterMediaType?: "image" | "gif" | "video";
  dialogueIcon: string;
  dialogueTitle: string;
  dialogueSubtext: string;
  updatedAt?: string;
}

export interface ContactInfoCardItem {
  title: string;
  value: string;
  subtext: string;
  href?: string;
  actionText?: string;
  icon: string;
}

export interface ContactInfoCardsData {
  cards: ContactInfoCardItem[];
  updatedAt?: string;
}

export interface ContactShowcaseCard {
  tag: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
}

export interface ContactFormFieldsConfig {
  section1Title: string;
  nameLabel: string;
  namePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  section2Title: string;
  inquiryTypeLabel: string;
  inquiryTypeOptions: string[];
  categoryLabel: string;
  categoryOptions: string[];
  boxTypeLabel: string;
  boxTypeOptions: string[];
  quantityLabel: string;
  quantityOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
  fileUploadLabel: string;
  fileUploadHint: string;
  submitButtonText: string;
  privacyNote: string;
  successTitle: string;
  successMessage: string;
}

export interface ContactInquiryFormData {
  badge: string;
  title: string;
  description: string;
  form?: ContactFormFieldsConfig;
  showcaseCards: ContactShowcaseCard[];
  updatedAt?: string;
}

export interface ContactLocationMapData {
  badge: string;
  title: string;
  subtitle: string;
  embedUrl: string;
  googleMapsUrl: string;
  plantName: string;
  address: string;
  transitHighlights: string[];
  updatedAt?: string;
}

export interface WhyContactReasonItem {
  title: string;
  description: string;
  icon: string;
  tag: string;
}

export interface WhyContactUsData {
  badge: string;
  title: string;
  subtitle: string;
  reasons: WhyContactReasonItem[];
  updatedAt?: string;
}

export interface ContactFAQItem {
  question: string;
  answer: string;
}

export interface ContactFAQsData {
  badge: string;
  title: string;
  subtitle: string;
  faqs: ContactFAQItem[];
  updatedAt?: string;
}

export interface ContactSEOData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalLink: string;
  ogImage?: string;
  ogImageAlt?: string;
  schemaMarkup: string;
  updatedAt?: string;
}

export const DEFAULT_CONTACT_HERO: ContactHeroData = {
  title: "Contact Us",
  breadcrumbRoot: "Home",
  breadcrumbCurrent: "Contact Us",
  backgroundImage: "/contact/contact_banner_pano.png",
  backgroundImageAlt: "Contact Support Workspace - AAVRIT PACKAGING",
  characterImage: "/contact/character_contact_support.png",
  characterAlt: "Customer Support Specialist - AAVRIT PACKAGING",
  characterMediaType: "image",
  dialogueIcon: "💬",
  dialogueTitle: "We're Here to Help!",
  dialogueSubtext: "Get instant quotes & custom packaging guidance",
};

export const DEFAULT_CONTACT_INFO_CARDS: ContactInfoCardsData = {
  cards: [
    {
      title: "Direct Phone Line",
      value: "+91 98765 43210",
      subtext: "Technical inquiries & rapid quotes",
      href: "tel:+919876543210",
      actionText: "Call Now",
      icon: "Phone",
    },
    {
      title: "Official Email Desk",
      value: "inquiry@aavritpackaging.com",
      subtext: "Send purchase RFPs & specifications",
      href: "mailto:inquiry@aavritpackaging.com",
      actionText: "Send Email",
      icon: "Mail",
    },
    {
      title: "Plant & Head Office",
      value: "Plot No. 42, Phase II GIDC",
      subtext: "Gujarat 382445, India",
      href: "https://maps.google.com/?q=Plot+No.+42,+Phase+II+GIDC+Industrial+Estate,+Gujarat+382445,+India",
      actionText: "View on Map",
      icon: "MapPin",
    },
    {
      title: "Business Hours",
      value: "Mon – Sat: 9:00 AM – 6:30 PM",
      subtext: "Sunday: Closed (Dispatch on request)",
      icon: "Clock",
    },
  ],
};

export const DEFAULT_CONTACT_FORM_FIELDS: ContactFormFieldsConfig = {
  section1Title: "1. Contact Details",
  nameLabel: "Full Name",
  namePlaceholder: "e.g. Rajesh Patel",
  companyLabel: "Company Name",
  companyPlaceholder: "e.g. Acme Logistics Pvt Ltd",
  emailLabel: "Email Address",
  emailPlaceholder: "name@company.com",
  phoneLabel: "Phone / WhatsApp Number",
  phonePlaceholder: "+91 98765 00000",
  section2Title: "2. Packaging Specifications",
  inquiryTypeLabel: "Inquiry Type",
  inquiryTypeOptions: [
    "Product Inquiry",
    "Custom Packaging",
    "Bulk Order",
    "General Inquiry",
    "Other",
  ],
  categoryLabel: "Product Category",
  categoryOptions: [
    "Corrugated Boxes",
    "Printed Corrugated Boxes",
    "Die-Cut Boxes",
    "Industrial Packaging",
    "Food Packaging",
    "E-Commerce Packaging",
  ],
  boxTypeLabel: "Box Construction / Ply",
  boxTypeOptions: [
    "3-Ply Single Wall",
    "5-Ply Double Wall",
    "7-Ply Triple Wall",
    "Die-Cut Custom",
    "Not Sure / Need Advice",
  ],
  quantityLabel: "Target Quantity",
  quantityOptions: [
    "500 - 1,000 units",
    "1,000 - 5,000 units",
    "5,000 - 10,000 units",
    "10,000+ units",
    "Sample / Prototyping",
  ],
  messageLabel: "Message / Additional Requirements",
  messagePlaceholder:
    "Please specify box dimensions (L x W x H in mm/inches), payload weight, printing requirements, or destination...",
  fileUploadLabel: "Upload Reference Drawing / Artwork",
  fileUploadHint: "(Optional, PDF/JPG/PNG up to 10MB)",
  submitButtonText: "Submit Inquiry",
  privacyNote: "Your information will only be used to respond to your inquiry.",
  successTitle: "Inquiry Received Successfully!",
  successMessage:
    "Thank you! Your packaging inquiry has been received. Our technical team will review your specifications and contact you within 24 hours.",
};

export const DEFAULT_CONTACT_INQUIRY_FORM: ContactInquiryFormData = {
  badge: "DIRECT INQUIRY DESK",
  title: "Send Us Your Inquiry",
  description: "Tell us a little about your packaging requirements. Our team will review your inquiry and get back to you.",
  form: DEFAULT_CONTACT_FORM_FIELDS,
  showcaseCards: [
    {
      tag: "CUSTOM PACKAGING",
      title: "Precision-Cut Corrugated Solutions",
      description: "Tailored flute calibers and custom-dimensioned master cartons designed to match your product weight, drop tests, and transit demands.",
      image: "/custom pack/custom-corrugated-solutions.png",
      imageAlt: "AAVRIT PACKAGING Custom Kraft Packaging Solutions",
    },
    {
      tag: "STATE-OF-THE-ART PLANT",
      title: "High-Speed Manufacturing Lines",
      description: "Equipped with automated multi-color flexo folder-gluers, rotary die-cutters, and computerized bursting strength testing units.",
      image: "/machinery/gallery-plant-overview.png",
      imageAlt: "AAVRIT PACKAGING High-Speed Corrugation Facility",
    },
  ],
};

export const DEFAULT_CONTACT_LOCATION_MAP: ContactLocationMapData = {
  badge: "PLANT ACCESSIBILITY",
  title: "Find Our Manufacturing Plant",
  subtitle: "Visit our manufacturing facility or use the interactive map below for route planning and dispatch logistics.",
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117502.83605481745!2d72.50284759999999!3d22.998059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85c2e17e4e13%3A0xb304b4f5358045b!2sGIDC%20Phase%20II%2C%20Vatva%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  googleMapsUrl: "https://maps.google.com/?q=Plot+No.+42,+Phase+II+GIDC+Industrial+Estate,+Gujarat+382445,+India",
  plantName: "AAVRIT PACKAGING",
  address: "Plot No. 42, Phase II GIDC Industrial Estate, Gujarat 382445, India.",
  transitHighlights: [
    "Direct arterial connectivity to National Highway freight corridors.",
    "Equipped with heavy commercial vehicle loading and unloading bays.",
  ],
};

export const DEFAULT_WHY_CONTACT_US: WhyContactUsData = {
  badge: "DIRECT COLLABORATION",
  title: "Why Connect With AAVRIT PACKAGING",
  subtitle: "We collaborate with businesses across industrial manufacturing, automotive, pharma, and retail to develop durable, cost-effective packaging.",
  reasons: [
    {
      title: "Packaging Requirement Discussion",
      description: "Consult directly with experienced manufacturing engineers to evaluate your product's weight, dimensions, and distribution stresses.",
      icon: "MessageSquareText",
      tag: "Technical Consult",
    },
    {
      title: "Product and Material Guidance",
      description: "Get unbiased guidance on selecting suitable kraft paperboard GSM, flute profiles (A, B, C, E), and multi-ply construction.",
      icon: "Layers",
      tag: "Material Selection",
    },
    {
      title: "Custom Packaging Inquiries",
      description: "Discuss bespoke box geometries, crash-lock auto bottoms, tamper-evident seals, and protective internal grid partitions.",
      icon: "Scissors",
      tag: "CAD Sampling",
    },
    {
      title: "Bulk Order Discussions",
      description: "Access direct factory pricing, scheduled recurring batch dispatches, and warehouse inventory buffer management.",
      icon: "Truck",
      tag: "Volume Supply",
    },
  ],
};

export const DEFAULT_CONTACT_FAQS: ContactFAQsData = {
  badge: "CLARITY & GUIDANCE",
  title: "Frequently Asked Questions",
  subtitle: "Find quick answers to common questions about inquiries, product guidance, custom box specifications, and working with AAVRIT PACKAGING.",
  faqs: [
    {
      question: "How can I request a packaging quotation?",
      answer: "You can submit your requirements through our online inquiry form on this page, or reach out to our team directly via phone (+91 98765 43210) or email (inquiry@aavritpackaging.com) with your box dimensions, required ply construction, and estimated order volume.",
    },
    {
      question: "What information should I provide for a custom packaging inquiry?",
      answer: "Providing your internal box dimensions (Length × Width × Height in mm or inches), product gross weight, stacking or transit environment, flute/ply preference (3-Ply, 5-Ply, or 7-Ply), and any custom flexographic branding artwork ensures we can quote quickly and accurately.",
    },
    {
      question: "Can I discuss bulk packaging requirements?",
      answer: "Yes. We specialize in high-volume industrial corrugated packaging and enterprise B2B supply agreements. Our manufacturing plant operates multi-station flexo folder-gluers and rotary die-cutters optimized for rapid turnaround and recurring scheduled dispatches.",
    },
    {
      question: "Can I share reference images or packaging specifications?",
      answer: "Absolutely. You can attach reference box photographs, technical CAD drawings, or structural specification sheets directly via the file upload field in our inquiry form, or email them to inquiry@aavritpackaging.com.",
    },
    {
      question: "How can I contact the company for product-related questions?",
      answer: "You can call our direct customer support desk at +91 98765 43210 during plant operating hours (Monday to Saturday: 9:00 AM – 6:30 PM), send us an email, or visit our manufacturing facility in GIDC Industrial Estate, Gujarat.",
    },
  ],
};

export const DEFAULT_CONTACT_SEO: ContactSEOData = {
  metaTitle: "Contact Us | AAVRIT PACKAGING",
  metaDescription: "Connect with AAVRIT PACKAGING for industrial corrugated box inquiries, custom packaging quotations, technical specifications, and factory visits.",
  metaKeywords: "contact aavrit packaging, corrugated box manufacturer, packaging inquiry, packaging quotation, box manufacturing plant gujarat",
  canonicalLink: "https://aavritpackaging.com/contact",
  ogImage: "/contact/Contact Support Workspace.png",
  ogImageAlt: "AAVRIT PACKAGING Contact Support Workspace",
  schemaMarkup: JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact AAVRIT PACKAGING",
      url: "https://aavritpackaging.com/contact",
      mainEntity: {
        "@type": "Organization",
        name: "AAVRIT PACKAGING",
        telephone: "+91-98765-43210",
        email: "inquiry@aavritpackaging.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Plot No. 42, Phase II GIDC Industrial Estate",
          addressRegion: "Gujarat",
          postalCode: "382445",
          addressCountry: "IN",
        },
      },
    },
    null,
    2
  ),
};
