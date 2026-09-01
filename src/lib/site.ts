/**
 * Single source of truth for every piece of copy and contact detail on the site.
 *
 * Content is grounded in the operator's own supplied and published material
 * (services, service areas, process, testimonials, clients, leadership, the
 * delivery milestone, vision and mission). Nothing here is invented: no
 * statistics beyond the supplied volume figure, no awards, no certifications,
 * no partner claims and no customer logos.
 */

export const site = {
  name: "FuelOnSpot",
  tagline: "Mobile Refueling | Anytime. Anywhere.",
  proposition: "Your fuel, delivered to you.",
  phoneDisplay: "+91 99986 21701",
  phoneHref: "tel:+919998621701",
  /* Second line, listed in the footer only. Every CTA on the page — navbar,
     hero, emergency band, contact panel — stays on the primary number above,
     so there is exactly one number to call from anywhere that asks for a
     delivery. Grouped 5+5 to match the primary. */
  phoneAltDisplay: "+91 94280 28112",
  phoneAltHref: "tel:+919428028112",
  email: "info@fuelonspot.com",
  emailHref: "mailto:info@fuelonspot.com",
  /* "Location" — the short form used in the hero chip, the mobile sheet and
     the map link. */
  addressShort: "Kalol, Panchmahal",
  /* Postal address, one entry per printed line. */
  addressLines: [
    "Jay Narayan Filling Station",
    "Halol - Kalol Road,",
    "Madhvas, Kalol,",
    "Panchmahal - 389330",
  ],
  /* The same address split for schema.org PostalAddress. Kept beside
     `addressLines` so the two can never drift apart. */
  addressParts: {
    street: "Jay Narayan Filling Station, Halol - Kalol Road, Madhvas",
    locality: "Kalol, Panchmahal",
    region: "Gujarat",
    postalCode: "389330",
    country: "IN",
  },
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Jay+Narayan+Filling+Station+Halol+Kalol+Road+Madhvas+Kalol+Panchmahal+389330",
  url: "https://fuelonspot.in",
} as const;

/**
 * WhatsApp destination for the delivery-request form.
 *
 * Derived from `site.phoneHref` so the number is written down exactly once —
 * wa.me wants bare international digits with no "+", spaces or punctuation.
 * This is a plain click-to-chat link: no Business API, no tokens, no backend.
 */
export const whatsappHref = `https://wa.me/${site.phoneHref.replace(/^tel:\+/, "")}`;

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Solutions", href: "#solutions" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Industries", href: "#industries" },
  { label: "Service Areas", href: "#service-areas" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------ hero */

export const hero = {
  status: "On-demand fuel delivery",
  headline: ["Fuel Delivered", "Right Where You Need It."],
  body: "Reliable doorstep diesel delivery for industries, businesses, construction sites, generators and commercial operations across Gujarat.",
  primaryCta: "Request Fuel Delivery",
  secondaryCta: `Call ${site.phoneDisplay}`,
} as const;

/* ----------------------------------------------------------- association */
/* Operator-supplied, and the only third-party name anywhere on the site. It is
   stated as TEXT: no authorised standalone Jio-bp logo asset has been supplied,
   and a mark cropped out of the campaign artwork would not be one. Do not add a
   logo here without a file from the operator.

   Stated exactly twice — the hero badge and the footer — never as a running
   claim, and never anywhere that would read as a joint offering. */

export const association = {
  label: "In association with",
  partner: "Jio-bp",
} as const;

/* ----------------------------------------------------------- trust strip */

export const trustItems = [
  /* Operating hours are not verified, so this cell states what is: the
     number to call. Do not restore an availability claim here. */
  {
    icon: "phone-call",
    title: "Call for Fuel Delivery",
    note: site.phoneDisplay,
  },
  {
    icon: "truck",
    title: "Doorstep Delivery",
    note: "Fuel comes to your site",
  },
  {
    icon: "shield",
    title: "Quality & Quantity Assurance",
    note: "Verified at handover",
  },
  {
    icon: "credit-card",
    title: "Flexible Payment Options",
    note: "Arranged to suit the business",
  },
  {
    icon: "map",
    title: "Delivering In",
    note: "Panchmahal · Vadodara · Chota Udepur · Savli",
  },
] as const;

/* ------------------------------------------------------ value proposition */

export const comparison = {
  heading: "Why Drive to the Fuel Station?",
  intro:
    "Every litre bought at a pump costs more than the litre. Someone has to stop work, take a vehicle or a set of cans across town, queue, carry the fuel back and hope none of it went missing on the way. That is time, labour and machine hours spent on procurement instead of production.",
  traditional: {
    label: "Traditional fuel procurement",
    steps: [
      {
        title: "Travel to the fuel station",
        note: "A vehicle and an operator leave the site.",
      },
      {
        title: "Equipment sits idle",
        note: "Machines wait while fuel is fetched.",
      },
      {
        title: "Transport it back",
        note: "Cans and drums handled manually, repeatedly.",
      },
      {
        title: "Hours gone from the day",
        note: "Queues and travel time nobody planned for.",
      },
      {
        title: "Handling risk",
        note: "Spillage, contamination and pilferage in transit.",
      },
    ],
  },
  withUs: {
    label: `With ${site.name}`,
    steps: [
      { title: "Order fuel", note: "One call to our team." },
      {
        title: "Confirm location",
        note: "Quantity, site and preferred time.",
      },
      {
        title: "Fuel arrives at your site",
        note: "Transported in pilferage-proof containment.",
      },
      {
        title: "Verify quantity and quality",
        note: "Checked with you at the point of delivery.",
      },
      { title: "Get back to work", note: "Nobody left the site." },
    ],
  },
} as const;

/* ------------------------------------------------------------- solutions */

export const solutions = [
  {
    id: "industrial",
    index: "01",
    icon: "factory",
    title: "Industrial Fuel Delivery",
    description:
      "Keep your critical machinery running with dependable diesel delivered directly to your facility.",
    servesLabel: "Built for",
    serves: [
      "Generators",
      "Industrial machinery",
      "Boilers",
      "Manufacturing facilities",
      "Industrial operations",
    ],
    image: "/images/industrial-facility.jpg",
    imageAlt:
      "Industrial processing plant lit at dusk, the kind of facility served by on-site diesel delivery",
  },
  {
    id: "construction",
    index: "02",
    icon: "hard-hat",
    title: "Construction Site Delivery",
    description:
      "Fuel your equipment directly at the job site and reduce unnecessary downtime.",
    servesLabel: "Built for",
    serves: [
      "Construction machinery",
      "Earthmovers",
      "Heavy equipment",
      "Infrastructure projects",
    ],
    image: "/images/construction-site.jpg",
    imageAlt: "Tracked excavator working on an active construction site",
  },
  {
    id: "fleet",
    index: "03",
    icon: "truck",
    title: "Commercial & Fleet Refueling",
    description:
      "Keep your fleet moving with convenient fuel delivery where your vehicles operate.",
    servesLabel: "Built for",
    serves: [
      "Commercial vehicles",
      "School buses",
      "Fleets",
      "Transport operators",
      "Showroom vehicles",
    ],
    image: "/images/commercial-fleet.jpg",
    imageAlt: "Commercial transport fleet parked at a depot",
  },
  {
    id: "generator",
    index: "04",
    icon: "battery-charging",
    title: "Generator / Backup Fuel",
    description: "Never let a fuel shortage interrupt your backup power.",
    servesLabel: "Built for",
    serves: [
      "DG sets",
      "Offices",
      "Hospitals",
      "Banks",
      "Hotels",
      "Apartment complexes",
      "Institutions",
    ],
    image: "/images/backup-generator.jpg",
    imageAlt: "Enclosed standby diesel generator installed outside a building",
  },
] as const;

/* ----------------------------------------------------------- how it works */

export const processSteps = [
  {
    step: "01",
    icon: "phone-call",
    title: "Request",
    description: "Call our team and tell us your fuel requirement.",
  },
  {
    step: "02",
    icon: "map-pin",
    title: "Confirm",
    description: "Share your delivery location, quantity and preferred time.",
  },
  {
    step: "03",
    icon: "truck",
    title: "Deliver",
    description:
      "Our team transports the required fuel safely to your location.",
  },
  {
    step: "04",
    icon: "clipboard-check",
    title: "Verify",
    description:
      "Fuel quantity and quality are checked at the time of delivery.",
  },
] as const;

/* --------------------------------------------------------- why fuelonspot */

export const reliabilityPillars = [
  {
    icon: "beaker",
    title: "Quality & Quantity Assurance",
    body: "What you ordered is what gets delivered — checked with your team before we leave.",
  },
  {
    icon: "home",
    title: "Doorstep Delivery",
    body: "Fuel reaches the machine, the DG room or the yard. No pump run, no cans in a car boot.",
  },
  {
    icon: "clock",
    title: "Time Savings",
    body: "Your operators stay on the job instead of spending half a shift in a queue.",
  },
  {
    icon: "activity",
    title: "Reduced Operational Downtime",
    body: "Equipment keeps running because fuel arrives where the equipment already is.",
  },
  {
    icon: "lock",
    title: "Pilferage-Proof Transportation",
    body: "Fuel moves in sealed, tamper-resistant containment from source to site.",
  },
  {
    icon: "credit-card",
    title: "Flexible Payment Options",
    /* No terms are stated on purpose — no credit period, limit or instrument
       has been supplied, and none may be implied here. */
    body: "Convenient and flexible payment arrangements based on business requirements. Contact us for applicable terms.",
  },
  {
    icon: "bar-chart",
    title: "Purchase & Cost Tracking",
    body: "A clear record of what was delivered, when and at what cost — per site.",
  },
  {
    icon: "siren",
    title: "Fast Emergency Response",
    body: "A running-low call goes to a team that is expecting it.",
  },
] as const;

/* ------------------------------------------------------------- industries */

export const industries = [
  { icon: "hard-hat", name: "Construction" },
  { icon: "factory", name: "Manufacturing" },
  { icon: "traffic-cone", name: "Infrastructure" },
  { icon: "radio-tower", name: "Telecommunications" },
  { icon: "sprout", name: "Agriculture" },
  { icon: "graduation-cap", name: "Education" },
  { icon: "heart-pulse", name: "Healthcare" },
  { icon: "building-2", name: "Commercial Buildings" },
  { icon: "concierge-bell", name: "Hospitality" },
  { icon: "party-popper", name: "Events & Party Plots" },
  { icon: "truck", name: "Transport & Logistics" },
  { icon: "snowflake", name: "Cold Storage" },
  { icon: "building", name: "Apartment Complexes" },
  { icon: "forklift", name: "Heavy Equipment" },
] as const;

/* ---------------------------------------------------------- service areas */
/* The four areas the operator currently delivers in — and only those four.
   Spellings are the operator's own ("Chota Udepur"). Nothing may be added here
   that has not been supplied as verified coverage.

   `lon`/`lat` are real WGS-84 coordinates, and the coverage map projects them
   directly — there are no hand-placed diagram positions to keep in sync. Each
   one has been checked to fall inside the district polygon it is drawn on.
   `marker` is the settlement the pin actually sits on, which is not always the
   row's name: the Panchmahal pin is the Kalol depot, not the district centre.
   `district` keys into DISTRICT_PATHS in lib/coverage-map.ts; Savli is a town
   inside Vadodara district, so it is a pin with no polygon of its own. */

export const serviceAreas = [
  {
    name: "Panchmahal",
    note: "Dispatch base — Kalol",
    marker: "Kalol",
    primary: true,
    lon: 73.4661,
    lat: 22.6079,
    district: "panchmahal",
  },
  {
    name: "Vadodara",
    note: "Delivery area",
    marker: "Vadodara",
    primary: false,
    lon: 73.1812,
    lat: 22.3072,
    district: "vadodara",
  },
  {
    name: "Chota Udepur",
    note: "Delivery area",
    marker: "Chota Udepur",
    primary: false,
    lon: 74.015,
    lat: 22.305,
    district: "chotaUdepur",
  },
  {
    name: "Savli",
    note: "Delivery area",
    marker: "Savli",
    primary: false,
    lon: 73.2,
    lat: 22.5667,
    district: null,
  },
] as const;

/* ------------------------------------------------------------------ about */

export const about = {
  heading: "Fuel logistics, handled at your gate",
  paragraphs: [
    `${site.name} exists to remove a daily errand from your operations. Instead of sending people and vehicles to a fuel station, we bring diesel to the place it is actually going to be used.`,
    "The focus is narrow on purpose: uncontaminated fuel, delivered on time, in the quantity that was ordered — and a delivery process that removes the handling, travel and paperwork burden that normally comes with procuring fuel yourself.",
  ],
  servesIntro: "Fuel goes to whatever needs it on your site:",
  serves: [
    "Generators",
    "Engines",
    "Industrial equipment",
    "Boilers",
    "Farm equipment",
    "Earthmovers",
    "Contractors",
    "Telecom towers",
    "Commercial operations",
  ],
  image: "/images/fuel-operations.jpg",
  imageAlt: "Road tanker used for transporting diesel to customer sites",
} as const;

export const visionMission = [
  {
    key: "vision",
    label: "Vision",
    statement:
      "To expand reliable doorstep fuel delivery across Gujarat and ensure every sector can access quality fuel when and where it is needed.",
  },
  {
    key: "mission",
    label: "Mission",
    statement:
      "To deliver quality diesel at the right time, in the right quantity, directly to the customer's location.",
  },
] as const;

/* Order is the org order and is load-bearing: Founder first, Co-Founder
   second. `photo` and `photoAlt` are paired per person — the portraits are the
   two supplied studio headshots and must never be swapped between entries. */

export const leadership = [
  {
    name: "Vipul P. Shah",
    role: "Founder",
    photo: "/images/leadership/vipul-p-shah.webp",
    photoAlt: `Vipul P. Shah, Founder of ${site.name}`,
  },
  {
    name: "Nirmit D. Shah",
    role: "Co-Founder",
    photo: "/images/leadership/nirmit-d-shah.webp",
    photoAlt: `Nirmit D. Shah, Co-Founder of ${site.name}`,
  },
] as const;

/* ------------------------------------------------------------ achievement */
/* The one figure on the site, and it is the operator's own published claim:
   total VOLUME delivered. It is not a customer count, an order count or a
   delivery count — do not restate it as one, and do not derive anything from
   it. `poster` is the operator's own campaign artwork, used unaltered. */

export const achievement = {
  eyebrow: "Milestone",
  lead: "Delivered more than",
  figure: "7 Lakh+",
  unit: "LTR",
  headline: "Trusted doorstep fuel delivery",
  body: "Delivering fuel directly to businesses and operations across Gujarat.",
  cta: "Book Fuel Now",
  poster: "/images/fuelonspot-7-lakh-delivered.webp",
  posterAlt: `${site.name} campaign poster — delivered more than 7 lakh+ litres of fuel, trusted doorstep fuel delivery for generators, industrial use, telecom towers, farm equipment and businesses`,
} as const;

/* ----------------------------------------------------------- testimonials */
/* Sourced from the operator's published customer feedback. Wording is the
   customers' own; only the brand name has been carried over to the new
   identity. No reviews have been added or embellished. */

export const testimonials = [
  {
    quote: `The service provided by ${site.name} is very good with quick response time. Thank You`,
    name: "Jayesh Shah",
    theme: "Quick response",
  },
  {
    quote: `Thank you ${site.name}. We had lot of trouble previously going to petrol pump and filling Diesel in Tanks. We find it convenient to get diesel directly delivered.`,
    name: "Mahesh Sharma",
    theme: "Convenience",
  },
  {
    quote:
      "Really an reliable service. Our order delivered on time. We are mainly using diesel for our Oil Filtering Machines. We got the solution on point of going to petrol pump every day. This is very handy. Thanks for everything",
    name: "Upen Patel",
    theme: "On-time delivery",
  },
] as const;

/* -------------------------------------------------------------------- faq */

export const faqs = [
  {
    q: `Who can use ${site.name}?`,
    a: `Any organisation that needs diesel at its own location. That includes industries and manufacturing units, construction and infrastructure contractors, commercial fleets and transport operators, offices, hospitals, banks, hotels, educational institutes, apartment complexes, cold storages, telecom tower operators, farms and event venues.`,
  },
  {
    q: `Which areas does ${site.name} serve?`,
    a: "We currently deliver in Panchmahal, Vadodara, Chota Udepur and Savli, dispatching from our base at Kalol in Panchmahal. If your site sits close to one of these areas, call us and we will confirm coverage for that location.",
  },
  {
    q: "What types of operations can use doorstep diesel delivery?",
    a: "Anything that runs on diesel and stays where it is: standby and DG generators, engines, industrial equipment, boilers, earthmovers and heavy equipment, farm equipment, telecom tower installations, and commercial vehicle fleets parked at a depot or yard.",
  },
  {
    q: "How does fuel delivery work?",
    a: `It is a four-step process. You call our team with your requirement, we confirm the delivery location, quantity and preferred time, our team transports the fuel safely to your site, and quantity and quality are verified at the time of delivery.`,
  },
  {
    q: `How can ${site.name} help reduce operational downtime?`,
    a: "Because nobody has to leave the site. A pump run takes an operator, a vehicle and a slice of the working day, and the equipment waiting on that fuel is idle the whole time. When fuel is delivered to the machine instead, that time stays in production.",
  },
  {
    q: "How do I request a delivery?",
    a: `Call ${site.phoneDisplay} and tell us what you need, or send your requirement through the form on this page and our team will call you back to confirm the details.`,
  },
  {
    q: `Can ${site.name} handle emergency fuel requirements?`,
    a: "Call us with your location and quantity and we will confirm availability and the delivery timing for your site.",
  },
] as const;

/* ---------------------------------------------------------------- contact */

export const serviceTypes = [
  "Industrial fuel delivery",
  "Construction site delivery",
  "Commercial & fleet refueling",
  "Generator / backup fuel",
  "Other requirement",
] as const;

export const deliveryWindows = [
  "As soon as possible",
  "Today",
  "Tomorrow",
  "Within this week",
  "Recurring / scheduled supply",
] as const;

export const emergencyCta = {
  heading: "Running Low on Fuel?",
  sub: "Don't stop your operations. Get fuel delivered to your location.",
} as const;
