"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { deliveryWindows, serviceTypes, site, trustItems } from "@/lib/site";

/* ------------------------------------------------------------------ model */

type FieldName =
  | "name"
  | "company"
  | "phone"
  | "email"
  | "location"
  | "quantity"
  | "serviceType"
  | "deliveryWindow"
  | "message";

type FormValues = Record<FieldName, string>;
type Status = "idle" | "submitting" | "success";

/** Visual order, which is also the order focus walks when validation fails. */
const FIELD_ORDER: readonly FieldName[] = [
  "name",
  "company",
  "phone",
  "email",
  "location",
  "quantity",
  "serviceType",
  "deliveryWindow",
  "message",
];

/** One id per field: it wires `htmlFor`, `aria-describedby` and focus recovery. */
const ID: Record<FieldName, string> = {
  name: "contact-name",
  company: "contact-company",
  phone: "contact-phone",
  email: "contact-email",
  location: "contact-location",
  quantity: "contact-quantity",
  serviceType: "contact-service-type",
  deliveryWindow: "contact-delivery-window",
  message: "contact-message",
};

const EMPTY: FormValues = {
  name: "",
  company: "",
  phone: "",
  email: "",
  location: "",
  quantity: "",
  serviceType: "",
  deliveryWindow: "",
  message: "",
};

/* The 24×7 line reuses the trust strip's own wording rather than making a
   fresh availability claim at the bottom of the page. */
const helpline =
  trustItems.find((item) => item.icon === "clock") ?? trustItems[0];

/* -------------------------------------------------------------- validation */

/** Ten national digits, mobile series only. */
const INDIAN_MOBILE = /^[6-9]\d{9}$/;

/** Deliberately loose — enough to catch a typo, not to police valid addresses. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Reduce a typed number to its ten national digits. The country code or trunk
 * prefix is stripped only when exactly ten digits are left behind, so a real
 * number that happens to begin "91…" is never truncated.
 */
function nationalNumber(raw: string) {
  return raw.replace(/\D/g, "").replace(/^(?:0{0,2}91|0)(?=\d{10}$)/, "");
}

function validate(values: FormValues) {
  const errors: Partial<Record<FieldName, string>> = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  const phone = values.phone.trim();
  if (!phone) {
    errors.phone = "Please enter a number we can call you back on.";
  } else if (!INDIAN_MOBILE.test(nationalNumber(phone))) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  // Email is optional; it is only checked once something has been typed.
  const email = values.email.trim();
  if (email && !EMAIL_SHAPE.test(email)) {
    errors.email = "Enter a valid email address, or leave this blank.";
  }

  if (!values.location.trim()) {
    errors.location = "Please tell us where the fuel should be delivered.";
  }

  return errors;
}

/* ------------------------------------------------------------- form pieces */

const controlBase =
  "w-full rounded-[3px] border bg-white px-4 text-[0.9375rem] text-navy-800 " +
  "transition-colors duration-200 placeholder:text-ink-500/70 " +
  "focus:border-navy-800 focus:ring-0";

function controlClass(invalid: boolean, extra?: string) {
  return cn(
    controlBase,
    invalid ? "border-red-500" : "border-line-strong",
    extra,
  );
}

/**
 * Label + control + inline error. The control is passed as children so each
 * field keeps its own input type, autocomplete hint and placeholder, while the
 * surrounding structure (and therefore the vertical rhythm) stays identical.
 */
function Field({
  id,
  label,
  required = false,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="text-micro block text-navy-600">
        {label}
        {required ? (
          // The asterisk is decoration; `aria-required` carries the meaning.
          <span aria-hidden="true" className="ml-1 text-fuel-600">
            *
          </span>
        ) : null}
      </label>
      <div className="relative mt-2">{children}</div>
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-[0.8125rem] leading-snug text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Native select styling is unusable across browsers, so the chevron is ours. */
function SelectChevron() {
  return (
    <ChevronDown
      aria-hidden="true"
      strokeWidth={2}
      className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-500"
    />
  );
}

/* ------------------------------------------------------------ contact panel */

function PanelBlock({
  icon: Glyph,
  label,
  children,
  className,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3.5", className)}>
      <Glyph
        aria-hidden="true"
        strokeWidth={1.7}
        className="mt-0.5 size-[1.15rem] shrink-0 text-fuel-400"
      />
      {/* min-w-0 is what lets the email wrap instead of widening the panel. */}
      <div className="min-w-0 flex-1">
        {/* font-sans: base sets the display face on every h3, and every other
            text-micro label on the site is Inter. */}
        <h3 className="text-micro font-sans text-onnavy-500">{label}</h3>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ section */

export function Contact() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const confirmationRef = useRef<HTMLDivElement>(null);
  /* Set when the user asks for a fresh form, so focus returns to the top of it
     rather than being dropped on <body> when the confirmation unmounts. */
  const returnFocus = useRef(false);

  const submitting = status === "submitting";

  useEffect(() => {
    if (status === "success") {
      confirmationRef.current?.focus();
      return;
    }
    if (status === "idle" && returnFocus.current) {
      returnFocus.current = false;
      document.getElementById(ID.name)?.focus();
    }
  }, [status]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const field = event.target.name as FieldName;
    const value = event.target.value;

    setValues((prev) => {
      const next = { ...prev };
      next[field] = value;
      return next;
    });

    // Clear an error the moment the user starts fixing it; errors only ever
    // come back on the next submit.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const found = validate(values);
    // Flushed, not batched: `aria-invalid` and `aria-describedby` have to be
    // on the input before focus lands on it, or the screen reader announces the
    // field without its error message.
    flushSync(() => setErrors(found));

    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(ID[firstInvalid])?.focus();
      return;
    }

    setStatus("submitting");
    // There is no backend. The delay exists so the pending state is a real
    // state the user can see, not a frame that flashes past.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
  }

  function handleReset() {
    returnFocus.current = true;
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
  }

  const fieldProps = (field: FieldName, required = false) => ({
    id: ID[field],
    name: field,
    value: values[field],
    onChange: handleChange,
    "aria-required": required || undefined,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${ID[field]}-error` : undefined,
  });

  return (
    <Section id="contact" tone="alt" labelledBy="contact-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="contact-title"
            eyebrow="Request a delivery"
            title="Let's Keep Your Operations Moving."
            description="Tell us what you need and where. Our team will call you back to confirm quantity, timing and price."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* -------------------------------------------------------- form */}
          <Reveal delay={70} className="lg:col-span-7 xl:col-span-8">
            <div className="rounded-[4px] border border-line bg-white p-6 sm:p-8 lg:p-9">
              {status === "success" ? (
                <div
                  ref={confirmationRef}
                  tabIndex={-1}
                  role="status"
                  aria-live="polite"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-12 items-center justify-center rounded-[3px] border border-fuel-600 bg-fuel-50 text-fuel-700"
                  >
                    <Check className="size-6" strokeWidth={2.4} />
                  </span>

                  <h3 className="text-h3 mt-5 text-navy-800">
                    Request received
                  </h3>

                  {/* Echoing user input: `break-words` keeps a long unspaced
                      address from pushing the card past the viewport at 375px. */}
                  <p className="mt-4 break-words text-[0.9375rem] leading-relaxed text-ink-500">
                    Logged for delivery to{" "}
                    <span className="font-semibold text-navy-800">
                      {values.location.trim()}
                    </span>
                    {values.quantity.trim() ? (
                      <>
                        , quantity{" "}
                        <span className="nums font-semibold text-navy-800">
                          {values.quantity.trim()}
                        </span>{" "}
                        litres
                      </>
                    ) : null}
                    .
                  </p>

                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">
                    Our team will call you back on{" "}
                    <span className="nums font-semibold text-navy-800">
                      {values.phone.trim()}
                    </span>{" "}
                    to confirm quantity, timing and price.
                  </p>

                  <div className="mt-7 border-t border-line pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleReset}
                      className="w-full xs:w-auto"
                    >
                      Send another request
                    </Button>
                    <p className="mt-3.5 text-[0.8125rem] text-ink-500">
                      Demo form — submissions are not sent anywhere.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  aria-labelledby="contact-title"
                  aria-busy={submitting || undefined}
                >
                  <p className="text-[0.8125rem] text-ink-500">
                    <span className="font-semibold text-fuel-600">*</span>{" "}
                    Required
                  </p>

                  <div className="mt-5 grid gap-x-5 gap-y-5 sm:grid-cols-2">
                    <Field id={ID.name} label="Name" required error={errors.name}>
                      <input
                        {...fieldProps("name", true)}
                        type="text"
                        autoComplete="name"
                        placeholder="Who should we ask for?"
                        className={controlClass(Boolean(errors.name), "h-12")}
                      />
                    </Field>

                    <Field id={ID.company} label="Company Name">
                      <input
                        {...fieldProps("company")}
                        type="text"
                        autoComplete="organization"
                        placeholder="Optional"
                        className={controlClass(false, "h-12")}
                      />
                    </Field>

                    <Field
                      id={ID.phone}
                      label="Phone Number"
                      required
                      error={errors.phone}
                    >
                      <input
                        {...fieldProps("phone", true)}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                        className={controlClass(
                          Boolean(errors.phone),
                          "nums h-12",
                        )}
                      />
                    </Field>

                    <Field id={ID.email} label="Email" error={errors.email}>
                      <input
                        {...fieldProps("email")}
                        type="email"
                        autoComplete="email"
                        placeholder="Optional"
                        className={controlClass(Boolean(errors.email), "h-12")}
                      />
                    </Field>

                    <Field
                      id={ID.location}
                      label="Delivery Location"
                      required
                      error={errors.location}
                    >
                      <input
                        {...fieldProps("location", true)}
                        type="text"
                        autoComplete="street-address"
                        placeholder="Site, area or full address"
                        className={controlClass(
                          Boolean(errors.location),
                          "h-12",
                        )}
                      />
                    </Field>

                    <Field id={ID.quantity} label="Required Quantity (litres)">
                      <input
                        {...fieldProps("quantity")}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="e.g. 500"
                        className={controlClass(false, "nums h-12")}
                      />
                    </Field>

                    <Field id={ID.serviceType} label="Service Type">
                      <select
                        {...fieldProps("serviceType")}
                        className={controlClass(
                          false,
                          cn(
                            "h-12 appearance-none pr-11",
                            !values.serviceType && "text-ink-500/70",
                          ),
                        )}
                      >
                        <option value="">Select a service type</option>
                        {serviceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </Field>

                    <Field
                      id={ID.deliveryWindow}
                      label="Preferred Delivery Time"
                    >
                      <select
                        {...fieldProps("deliveryWindow")}
                        className={controlClass(
                          false,
                          cn(
                            "h-12 appearance-none pr-11",
                            !values.deliveryWindow && "text-ink-500/70",
                          ),
                        )}
                      >
                        <option value="">Select a delivery time</option>
                        {deliveryWindows.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </Field>

                    <Field
                      id={ID.message}
                      label="Message"
                      className="sm:col-span-2"
                    >
                      <textarea
                        {...fieldProps("message")}
                        rows={4}
                        placeholder="Site access, timings or anything else we should know."
                        className={controlClass(
                          false,
                          "min-h-[7.5rem] resize-y py-3.5 leading-relaxed",
                        )}
                      />
                    </Field>
                  </div>

                  <div className="mt-7 border-t border-line pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="w-full xs:w-auto"
                    >
                      Request Fuel Delivery
                      {/* The spinner takes the arrow's slot rather than sitting
                          opposite it, so the label does not shift on submit. */}
                      {submitting ? (
                        <Loader2
                          className="size-4 animate-spin"
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowRight
                          className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                    <p className="mt-3.5 text-[0.8125rem] text-ink-500">
                      Demo form — submissions are not sent anywhere.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* ----------------------------------------------- contact panel */}
          {/* Hoisted above the form on small screens: on a phone the phone
              number is the fastest path to a delivery, not the form. */}
          <Reveal
            delay={140}
            className="order-first lg:order-none lg:col-span-5 xl:col-span-4"
          >
            {/* A column, because on lg the panel stretches to the form's
                height: the slack goes to the middle block and the 24×7 line
                stays pinned to the bottom rule instead of floating mid-panel. */}
            <div className="blueprint-grid flex h-full flex-col rounded-[4px] border border-navy-900 bg-navy-950 p-7 lg:p-8">
              <PanelBlock icon={PhoneCall} label="Call now">
                <a
                  href={site.phoneHref}
                  className="nums mt-1 block py-1.5 font-display text-[1.5rem] font-extrabold leading-none tracking-[-0.02em] text-white transition-colors duration-200 hover:text-fuel-400"
                >
                  {site.phoneDisplay}
                </a>
                <ButtonLink
                  href={site.phoneHref}
                  size="md"
                  className="mt-2.5 w-full"
                >
                  <Phone className="size-4" strokeWidth={2.1} aria-hidden="true" />
                  Call Now
                </ButtonLink>
              </PanelBlock>

              <div className="mt-7 grow space-y-6 border-t border-white/10 pt-7">
                <PanelBlock icon={Mail} label="Email">
                  <a
                    href={site.emailHref}
                    className="mt-0.5 block break-words py-1.5 text-[0.9375rem] text-onnavy-100 underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-fuel-400 hover:decoration-fuel-400"
                  >
                    {site.email}
                  </a>
                </PanelBlock>

                <PanelBlock icon={MapPin} label="Address">
                  <address className="mt-2 not-italic text-[0.9375rem] leading-relaxed text-onnavy-300">
                    {site.addressLines.map((line) => (
                      <span key={line} className="block break-words">
                        {line}
                      </span>
                    ))}
                  </address>
                  <a
                    href={site.mapsHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`View ${site.addressShort} on the map (opens in a new tab)`}
                    className="mt-1 inline-flex items-center gap-1.5 py-1.5 text-[0.8125rem] font-semibold text-fuel-400 transition-colors duration-200 hover:text-white"
                  >
                    {site.addressShort}
                    <ExternalLink
                      className="size-3.5 shrink-0"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </a>
                </PanelBlock>
              </div>

              <div className="mt-7 flex gap-3.5 border-t border-white/10 pt-6">
                <Clock
                  aria-hidden="true"
                  strokeWidth={1.7}
                  className="mt-0.5 size-[1.15rem] shrink-0 text-fuel-400"
                />
                <p className="min-w-0 flex-1 text-[0.9375rem] leading-relaxed text-onnavy-300">
                  <span className="block font-semibold text-white">
                    {helpline.title}
                  </span>
                  {helpline.note}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
