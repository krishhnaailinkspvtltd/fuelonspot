import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StructuredData } from "@/components/StructuredData";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { Solutions } from "@/components/sections/Solutions";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyFuelOnSpot } from "@/components/sections/WhyFuelOnSpot";
import { Industries } from "@/components/sections/Industries";
import { EmergencyCTA } from "@/components/sections/EmergencyCTA";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { About } from "@/components/sections/About";
import { VisionMission } from "@/components/sections/VisionMission";
import { Leadership } from "@/components/sections/Leadership";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[3px] focus:bg-navy-800 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        {/* Clears the fixed header: utility strip (36px) + bar (76px) on lg. */}
        <div aria-hidden="true" className="h-[72px] lg:h-[112px]" />

        <Hero />
        <TrustStrip />
        <ValueProposition />
        <Solutions />
        <HowItWorks />
        <WhyFuelOnSpot />
        <Industries />
        <EmergencyCTA />
        <ServiceAreas />
        <About />
        <VisionMission />
        <Leadership />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
      <StructuredData />
    </>
  );
}
