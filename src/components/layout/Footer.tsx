import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { navItems, site } from "@/lib/site";

/**
 * Site footer. Deliberately not built on the `Section` primitive: it is a page
 * landmark rather than a content band, so it owns its own rhythm and sits on
 * navy with the blueprint grid — the same "engineered surface" treatment the
 * dark sections use, never a gradient.
 */
export function Footer() {
  return (
    <footer className="blueprint-grid border-t border-white/10 bg-navy-950 pb-8 pt-16 lg:pt-20">
      <Container>
        {/* ------------------------------------------------- top region
            Mobile stacks brand → links → contact. At sm the brand keeps the
            full width and the two short columns pair up; only at lg does the
            12-col split (5 / 3 / 4) apply. */}
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* ------------------------------------------------------ brand */}
          <div className="sm:col-span-2 lg:col-span-5">
            {/* The lockup's wordmark is navy, so on this surface it sits on a
                white plate rather than being recoloured. */}
            <Logo plate width={190} />

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-onnavy-300">
              {site.name} is doorstep diesel delivery for industries,
              construction sites, generators, commercial fleets and
              institutions across nine districts of Gujarat. Quantity and
              quality are verified with your team at handover, and the helpline
              runs 24×7.
            </p>
          </div>

          {/* ------------------------------------------------ quick links */}
          <nav aria-labelledby="footer-links-title" className="lg:col-span-3">
            <h2
              id="footer-links-title"
              className="text-micro font-sans text-onnavy-500"
            >
              Quick Links
            </h2>
            {/* py-2.5 on a 24px line gives a 44px touch target without needing
                extra list spacing. */}
            <ul className="mt-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex items-center py-2.5 text-sm leading-6 text-onnavy-300 transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------------------------------------------------- contact */}
          <div className="lg:col-span-4">
            <h2 className="text-micro font-sans text-onnavy-500">Contact</h2>

            {/* Vertical padding (and min-h-11 on the shorter email row) keeps
                every tappable row at 44px; the address is static text so it
                only needs the matching optical gap. */}
            <div className="mt-3 space-y-1">
              <a
                href={site.phoneHref}
                className="group flex items-start gap-3 py-2 text-white"
              >
                <Phone
                  className="mt-1.5 size-4 shrink-0 text-fuel-400"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
                <span className="nums font-display text-xl font-bold tracking-[-0.02em] transition-colors duration-200 group-hover:text-fuel-400 sm:text-2xl">
                  {site.phoneDisplay}
                </span>
              </a>

              <a
                href={site.emailHref}
                className="flex min-h-11 items-center gap-3 py-2 text-sm text-onnavy-300 transition-colors duration-200 hover:text-white"
              >
                <Mail
                  className="size-4 shrink-0 text-fuel-400"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                {/* min-w-0 lets the email wrap inside the flex row instead of
                    pushing the column wider on a 375px screen. */}
                <span className="min-w-0 break-words">{site.email}</span>
              </a>

              <address className="flex items-start gap-3 pt-2 text-sm not-italic text-onnavy-300">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-fuel-400"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  {site.addressLines.map((line) => (
                    <span key={line} className="block break-words leading-6">
                      {line}
                    </span>
                  ))}
                </span>
              </address>
            </div>
          </div>
        </div>

        {/* Back to top is a plain anchor — `scroll-behavior: smooth` in
            globals.css does the easing, so no scroll script is needed. */}
        <div className="mt-12 flex justify-center sm:justify-end lg:mt-14">
          <a
            href="#home"
            className="group inline-flex h-11 items-center gap-2 rounded-[3px] border border-white/15 px-4 text-[0.8125rem] font-medium text-onnavy-300 transition-colors duration-200 hover:border-white/40 hover:text-white"
          >
            Back to top
            <ArrowUp
              className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </a>
        </div>

        {/* ----------------------------------------------------- legal bar */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
          <p className="text-[0.8125rem] text-onnavy-500">
            © 2026 {site.name}. All Rights Reserved.
          </p>
          <p className="text-micro text-onnavy-500">{site.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
