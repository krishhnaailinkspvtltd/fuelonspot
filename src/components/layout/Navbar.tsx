"use client";

import { useEffect, useState } from "react";
import { Mail, Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { navItems, site } from "@/lib/site";

const sectionIds = navItems.map((item) => item.href.replace("#", ""));

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  /* Compact the bar once the hero starts leaving the viewport. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll spy so the current section is marked in the nav. */
  useEffect(() => {
    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (inView?.target.id) setActive(inView.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.15, 0.5] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  /* Lock the page behind the mobile sheet. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility strip — folds away on scroll to reclaim vertical space */}
      <div
        className={cn(
          "hidden overflow-hidden bg-navy-950 text-onnavy-300 transition-[height,opacity] duration-300 ease-out lg:block",
          scrolled ? "h-0 opacity-0" : "h-9 opacity-100",
        )}
      >
        <Container className="flex h-9 items-center justify-between">
          <p className="text-micro text-onnavy-500">{site.tagline}</p>
          <div className="flex items-center gap-6 text-[0.8125rem]">
            <a
              href={site.emailHref}
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <Mail className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
              {site.email}
            </a>
            <span aria-hidden="true" className="h-3.5 w-px bg-white/15" />
            <a
              href={site.phoneHref}
              className="nums inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-fuel-400"
            >
              <Phone className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
              {site.phoneDisplay}
            </a>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "border-b bg-white/95 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
          scrolled
            ? "border-line shadow-[0_1px_24px_-12px_rgba(4,24,46,0.45)]"
            : "border-transparent",
        )}
      >
        <Container>
          <nav
            aria-label="Primary"
            className={cn(
              "flex items-center justify-between gap-4 transition-[height] duration-300 ease-out",
              scrolled ? "h-[60px]" : "h-[72px] lg:h-[76px]",
            )}
          >
            <a
              href="#home"
              aria-label={`${site.name} — home`}
              className="shrink-0 transition-opacity hover:opacity-80"
            >
              <Logo
                priority
                width={scrolled ? 138 : 156}
                className="transition-[width] duration-300 ease-out"
              />
            </a>

            <ul className="hidden items-center gap-0.5 lg:flex">
              {navItems.map((item) => {
                const id = item.href.replace("#", "");
                const isActive = active === id;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-200",
                        isActive
                          ? "text-navy-800"
                          : "text-ink-500 hover:text-navy-800",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left bg-fuel-500 transition-transform duration-300 ease-out",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              {/* Wrapped rather than given `hidden` directly: the button base
                  already sets `inline-flex`, and Tailwind emits that after
                  `hidden`, so the utility would lose the cascade. */}
              <span className="hidden sm:block">
                <ButtonLink href={site.phoneHref} size="md">
                  <Phone
                    className="size-4"
                    strokeWidth={2.1}
                    aria-hidden="true"
                  />
                  <span className="xl:hidden">Call Now</span>
                  <span className="nums hidden xl:inline">
                    Call {site.phoneDisplay}
                  </span>
                </ButtonLink>
              </span>

              <a
                href={site.phoneHref}
                aria-label={`Call ${site.phoneDisplay}`}
                className="inline-flex size-11 items-center justify-center rounded-[3px] bg-fuel-600 text-white transition-colors hover:bg-fuel-700 sm:hidden"
              >
                <Phone className="size-[1.15rem]" strokeWidth={2.1} />
              </a>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? "Close menu" : "Open menu"}
                className="inline-flex size-11 items-center justify-center rounded-[3px] border border-line-strong text-navy-800 transition-colors hover:border-navy-800 lg:hidden"
              >
                {open ? (
                  <X className="size-5" strokeWidth={2} />
                ) : (
                  <Menu className="size-5" strokeWidth={2} />
                )}
              </button>
            </div>
          </nav>
        </Container>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="lg:hidden"
      >
        <div
          className="fixed inset-0 top-0 -z-10 bg-navy-950/45"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div className="max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-line bg-white shadow-[0_24px_48px_-24px_rgba(4,24,46,0.5)]">
          <Container className="py-5">
            <ul className="divide-y divide-line">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3.5 font-display text-lg font-bold tracking-[-0.02em] text-navy-800"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="h-px w-6 bg-line-strong"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-2.5">
              <ButtonLink
                href="#contact"
                size="lg"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Request Fuel Delivery
              </ButtonLink>
              <ButtonLink
                href={site.phoneHref}
                variant="outline"
                size="lg"
                className="nums w-full"
              >
                <Phone className="size-4" strokeWidth={2.1} aria-hidden="true" />
                {site.phoneDisplay}
              </ButtonLink>
            </div>

            <p className="mt-5 text-[0.8125rem] text-ink-500">
              <a
                href={site.emailHref}
                className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-navy-800"
              >
                {site.email}
              </a>
              <span className="mx-2 text-line-strong">·</span>
              {site.addressShort}
            </p>
          </Container>
        </div>
      </div>
    </header>
  );
}
