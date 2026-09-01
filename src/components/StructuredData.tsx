import {
  about,
  faqs,
  leadership,
  serviceAreas,
  site,
  solutions,
} from "@/lib/site";

/**
 * JSON-LD for the single-page site. Everything here mirrors copy that is
 * actually on the page — no ratings, no review counts, no opening hours and no
 * invented claims.
 */
export function StructuredData() {
  const business = {
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    slogan: site.proposition,
    description: about.paragraphs[0],
    url: site.url,
    // Taken from the tel: href, which is already E.164 — deriving it from the
    // formatted display string would double the country code.
    telephone: site.phoneHref.replace(/^tel:/, ""),
    email: site.email,
    logo: `${site.url}/fuelonspot-logo.png`,
    image: `${site.url}/images/hero-refueling.jpg`,
    // Split out of `site.addressParts`, which sits directly beside the
    // printed `addressLines` so the two cannot drift. No geo coordinates and
    // no place id: neither has been supplied, and neither may be guessed.
    address: {
      "@type": "PostalAddress",
      streetAddress: site.addressParts.street,
      addressLocality: site.addressParts.locality,
      postalCode: site.addressParts.postalCode,
      addressRegion: site.addressParts.region,
      addressCountry: site.addressParts.country,
    },
    areaServed: serviceAreas.map((area) => ({
      "@type": "AdministrativeArea",
      name: `${area.name}, ${site.addressParts.region}`,
    })),
    // No openingHoursSpecification: the operating hours are not verified, and
    // schema.org is the last place to guess at them.
    // Name, title and portrait only — no biographies, dates, credentials or
    // social profiles exist for either person, so none are asserted.
    founder: leadership.map((person) => ({
      "@type": "Person",
      name: person.name,
      jobTitle: person.role,
      image: `${site.url}${person.photo}`,
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
