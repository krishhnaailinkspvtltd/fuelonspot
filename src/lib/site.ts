/**
 * Single source of truth for every piece of copy and contact detail on the site.
 *
 * Content is grounded in the operator's own published material (services,
 * districts served, process, testimonials, leadership, vision and mission).
 * Nothing here is invented: no statistics, awards, certifications, partner
 * claims or customer logos.
 */

export const site = {
  name: "FuelOnSpot",
  tagline: "Mobile Refueling | Anytime. Anywhere.",
  proposition: "Your fuel, delivered to you.",
  phoneDisplay: "844-844-4704",
  phoneHref: "tel:8448444704",
  email: "Info@readyfuel.in",
  emailHref: "mailto:Info@readyfuel.in",
  addressShort: "Vadodara, Gujarat",
  addressLines: ["Ajwa Road, Vadodara – 390019", "Gujarat, India"],
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Ajwa+Road+Vadodara+Gujarat+390019",
  url: "https://fuelonspot.in",
} as const;

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
  status: "24×7 on-demand delivery",
  headline: ["Fuel Delivered", "Right Where You Need It."],
  body: "Reliable doorstep diesel delivery for industries, businesses, construction sites, generators and commercial operations across Gujarat.",
  primaryCta: "Request Fuel Delivery",
  secondaryCta: `Call ${site.phoneDisplay}`,
} as const;

/* ----------------------------------------------------------- trust strip */

export const trustItems = [
  {
    icon: "clock",
    title: "24×7 Availability",
    note: "Helpline open round the clock",
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
    icon: "zap",
    title: "Fast Response",
    note: "Built for urgent requirements",
  },
  {
    icon: "map",
    title: "Serving Gujarat",
    note: "Nine districts covered",
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
      { title: "Order fuel", note: "One call to our helpline." },
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
    body: "Payment methods that suit how your business already settles its accounts.",
  },
  {
    icon: "bar-chart",
    title: "Purchase & Cost Tracking",
    body: "A clear record of what was delivered, when and at what cost — per site.",
  },
  {
    icon: "siren",
    title: "Fast Emergency Response",
    body: "A running-low call goes to a team that is expecting it, at any hour.",
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
  { icon: "landmark", name: "Banks & Financial Institutions" },
  { icon: "building", name: "Apartment Complexes" },
  { icon: "forklift", name: "Heavy Equipment" },
] as const;

/* ---------------------------------------------------------- service areas */

export const districts = [
  {
    name: "Vadodara",
    note: "Base of operations",
    primary: true,
    // Percentage coordinates on the stylised Gujarat service map.
    x: 32,
    y: 59,
  },
  { name: "Anand", note: "Central Gujarat", primary: false, x: 18, y: 45 },
  { name: "Kheda", note: "Central Gujarat", primary: false, x: 16, y: 30 },
  { name: "Panchmahal", note: "Eastern belt", primary: false, x: 55, y: 28 },
  { name: "Mahisagar", note: "Eastern belt", primary: false, x: 48, y: 14 },
  { name: "Dahod", note: "Eastern belt", primary: false, x: 80, y: 21 },
  {
    name: "Chhota Udepur",
    note: "Eastern belt",
    primary: false,
    x: 79,
    y: 55,
  },
  { name: "Bharuch", note: "Southern corridor", primary: false, x: 28, y: 79 },
  { name: "Narmada", note: "Southern corridor", primary: false, x: 59, y: 80 },
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

export const leadership = [
  { name: "Dhrumil Mehta", role: `Founder of ${site.name}`, initials: "DM" },
  { name: "Ruchik Vyas", role: `Co-Founder of ${site.name}`, initials: "RV" },
] as const;

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
    a: "We deliver across nine districts of Gujarat: Vadodara, Anand, Kheda, Dahod, Mahisagar, Bharuch, Panchmahal, Chhota Udepur and Narmada. If your site sits close to a district boundary, call us and we will confirm coverage for that location.",
  },
  {
    q: "What types of operations can use doorstep diesel delivery?",
    a: "Anything that runs on diesel and stays where it is: standby and DG generators, engines, industrial equipment, boilers, earthmovers and heavy equipment, farm equipment, telecom tower installations, and commercial vehicle fleets parked at a depot or yard.",
  },
  {
    q: "How does fuel delivery work?",
    a: `It is a four-step process. You call our helpline with your requirement, we confirm the delivery location, quantity and preferred time, our team transports the fuel safely to your site, and quantity and quality are verified at the time of delivery.`,
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
    a: "Our helpline runs 24×7 for exactly this reason. Call us with your location and quantity and we will confirm availability and the delivery timing for your site.",
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
