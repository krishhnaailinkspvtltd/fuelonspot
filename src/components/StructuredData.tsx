import { about, districts, faqs, leadership, site, solutions } from "@/lib/site";

/**
 * JSON-LD for the single-page site. Everything here mirrors copy that is
 * actually on the page — no ratings, no review counts, no invented claims.
 */
export function StructuredData() {
  const business = {
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    slogan: site.proposition,
    description: about.paragraphs[0],
    url: site.url,
    telephone: `+91${site.phoneDisplay.replace(/\D/g, "")}`,
    email: site.email,
    logo: `${site.url}/fuelonspot-logo.png`,
    image: `${site.url}/images/hero-refueling.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ajwa Road",
      addressLocality: "Vadodara",
      postalCode: "390019",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    areaServed: districts.map((d) => ({
      "@type": "AdministrativeArea",
      name: `${d.name}, Gujarat`,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    founder: leadership.map((person) => ({
      "@type": "Person",
      name: person.name,
      jobTitle: person.role,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Fuel delivery services",
      itemListElement: solutions.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
      })),
    },
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${site.url}/#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const graph = { "@context": "https://schema.org", "@graph": [business, faqPage] };

  return (
    <script
      type="application/ld+json"
      // Content is fully static and derived from site.ts.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
