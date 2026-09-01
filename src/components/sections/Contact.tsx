"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Building2,
  Check,
  ChevronDown,
  ExternalLink,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import {
  deliveryWindows,
  serviceAreas,
  serviceTypes,
  site,
  trustItems,
  whatsappHref,
} from "@/lib/site";

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

/**
 * "handoff", not "success". The request is only prepared here — it is not sent
 * until the customer presses Send inside WhatsApp, and the UI must not claim
 * otherwise.
 */
type Status = "idle" | "handoff";

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

/* The closing note reuses the trust strip's own wording rather than writing a
   fresh claim at the bottom of the page. It is the quality-and-quantity
   commitment, NOT an availability claim: operating hours are not verified and
   nothing on this page may imply them. */
const assurance =
  trustItems.find((item) => item.icon === "shield") ?? trustItems[0];

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

/* ---------------------------------------------------------- the message */

/**
 * Normalises the typed quantity to a plain number.
 *
 * "000001" is a real thing people type, and it has to reach WhatsApp as "1".
 * Returns null when the field is empty or the value is not a usable positive
 * quantity — both the validator and the message builder key off that, so
 * neither can ever emit NaN or a meaningless figure.
 */
function normalisedQuantity(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // A signed quantity is rejected rather than reinterpreted: stripping the
  // minus below would silently turn "-5" into 5, and quietly correcting a
  // number the customer typed is worse than asking them to retype it.
  if (trimmed.includes("-")) return null;

  // Tolerate a typed unit or separators; keep the digits and one point.
  const numeric = trimmed.replace(/[^\d.]/g, "");
  if (!numeric) return null;

  const value = Number(numeric);
  if (!Number.isFinite(value) || value <= 0) return null;

  // Number() drops the leading zeros and String() gives the shortest exact
  // form back, so 000001 becomes "1" and 2.50 becomes "2.5".
  return String(value);
}

/**
 * Builds the WhatsApp body as PLAIN ASCII TEXT.
 *
 * No emoji, no asterisks, no em dashes — nothing outside printable ASCII. An
 * earlier version used emoji headings and WhatsApp's own *bold* markers, and
 * some clients rendered the prefilled text back with literal backslash escapes
 * and U+FFFD replacement characters. Plain ASCII cannot be mangled that way,
 * so it stays plain ASCII. Do not reintroduce either.
 *
 * Nothing here is escaped by hand. Values are the customer's own text, passed
 * through untouched apart from trimming, and the ONLY transform applied to the
 * finished string is a single encodeURIComponent at the URL step. Never add a
 * markdown escaper, an HTML encoder, or a second encode pass.
 *
 * Empty optional fields drop their whole line rather than printing a dash or
 * "Not provided".
 */
function buildMessage(values: FormValues) {
  const v = (field: FieldName) => values[field].trim();

  const lines: string[] = ["FUELONSPOT - NEW FUEL DELIVERY REQUEST", ""];

  /** Drops the line entirely when the value behind it is empty or absent. */
  const push = (line: string | false | null) => {
    if (line) lines.push(line);
  };

  push(`Name: ${v("name")}`);
  push(v("company") && `Company: ${v("company")}`);
  push(`Customer Phone: ${v("phone")}`);
  push(v("email") && `Email: ${v("email")}`);

  lines.push("", "Delivery Location:", v("location"));

  /* Gathered first, then pushed behind a single blank line only if anything
     survived. Emitting that separator unconditionally left a double blank line
     whenever all three of these were empty. */
  const details: string[] = [];
  const quantity = normalisedQuantity(v("quantity"));
  if (quantity) details.push(`Required Quantity: ${quantity} Litres`);
  if (v("serviceType")) details.push(`Service Type: ${v("serviceType")}`);
  if (v("deliveryWindow")) {
    details.push(`Preferred Delivery Time: ${v("deliveryWindow")}`);
  }
  if (details.length) lines.push("", ...details);

  if (v("message")) {
    lines.push("", "Additional Message:", v("message"));
  }

  lines.push(
    "",
    "--------------------------------",
    "",
    "Request submitted through the FuelOnSpot website.",
  );

  return lines.join("\n");
}

/* -------------------------------------------------------------- validation */

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

  // Quantity stays optional, but a typed value has to be a real positive
  // number — otherwise the request would carry a meaningless figure.
  if (values.quantity.trim() && normalisedQuantity(values.quantity) === null) {
    errors.quantity =
      "Enter a quantity greater than zero, or leave this blank.";
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

  /* Set when window.open comes back null — a blocked popup is the one failure
     mode this flow has, and it must not look like nothing happened. */
  const [openFailed, setOpenFailed] = useState(false);

  useEffect(() => {
    if (status === "handoff") {
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

  /**
   * Hands the request to WhatsApp. Deliberately NOT async: `window.open` only
   * counts as user-initiated while the click's activation is still live, and a
   * single `await` here is enough for a popup blocker to swallow the tab. So
   * everything between the submit and the open stays synchronous — which also
   * means there is no real pending phase worth showing a spinner for.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

    openWhatsApp();
  }

  function openWhatsApp() {
    const url = `${whatsappHref}?text=${encodeURIComponent(buildMessage(values))}`;
    const win = window.open(url, "_blank", "noopener,noreferrer");

    if (win) {
      setOpenFailed(false);
      setStatus("handoff");
    } else {
      // Blocked, or no handler. Stay on the form with everything typed intact
      // so the number below is the way out.
      setOpenFailed(true);
    }
  }

  function handleReset() {
    returnFocus.current = true;
    setValues(EMPTY);
    setErrors({});
    setOpenFailed(false);
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
              {status === "handoff" ? (
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
                    Ready to send in WhatsApp
                  </h3>

                  {/* Echoing user input: `break-words` keeps a long unspaced
                      address from pushing the card past the viewport at 375px. */}
                  <p className="mt-4 break-words text-[0.9375rem] leading-relaxed text-ink-500">
                    Your request for{" "}
                    <span className="font-semibold text-navy-800">
                      {values.location.trim()}
                    </span>
                    {normalisedQuantity(values.quantity) ? (
                      <>
                        {" "}
                        (
                        <span className="nums font-semibold text-navy-800">
                          {normalisedQuantity(values.quantity)} Litres
                        </span>
                        )
                      </>
                    ) : null}{" "}
                    is prepared in WhatsApp.
                  </p>

                  {/* Stated plainly: nothing has reached us yet. The form must
                      not take credit for a message the customer has not sent. */}
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">
                    <span className="font-semibold text-navy-800">
                      Press Send in WhatsApp
                    </span>{" "}
                    to deliver it to our team — it does not reach us until you
                    do.
                  </p>

                  <div className="mt-7 border-t border-line pt-6">
                    <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap">
                      {/* WhatsApp may have been opened in a tab the customer
                          has since closed, so re-opening stays one click away
                          for as long as the values are still on screen. */}
                      <Button
                        type="button"
                        size="lg"
                        onClick={openWhatsApp}
                        className="justify-center"
                      >
                        <MessageCircle
                          className="size-4"
                          strokeWidth={2.1}
                          aria-hidden="true"
                        />
                        Open WhatsApp again
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleReset}
                        className="justify-center"
                      >
                        Start a new request
                      </Button>
                    </div>
                    <p className="mt-3.5 text-[0.8125rem] text-ink-500">
                      Prefer to talk? Call{" "}
                      <a
                        href={site.phoneHref}
                        className="nums font-semibold text-navy-800 underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-fuel-700"
                      >
                        {site.phoneDisplay}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  aria-labelledby="contact-title"
                >
                  <p className="text-[0.8125rem] text-ink-500">
                    <span className="font-semibold text-fuel-600">*</span>{" "}
                    Required
                  </p>

                  <div className="mt-5 grid gap-x-5 gap-y-5 sm:grid-cols-2">
                    <Field
                      id={ID.name}
                      label="Name"
                      required
                      error={errors.name}
                    >
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
                        placeholder="Your company name"
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
                        placeholder="you@example.com"
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

                    <Field
                      id={ID.quantity}
                      label="Required Quantity (litres)"
                      error={errors.quantity}
                    >
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
                      className="w-full xs:w-auto"
                    >
                      <MessageCircle
                        className="size-4"
                        strokeWidth={2.1}
                        aria-hidden="true"
                      />
                      Send Request on WhatsApp
                    </Button>

                    {/* Says what the button actually does before it is pressed,
                        so opening another app is never a surprise. */}
                    <p className="mt-3.5 text-[0.8125rem] text-ink-500">
                      Your request opens in WhatsApp for you to review and send.
                    </p>

                    {/* role="alert" so the failure is announced, not just
                        painted. Rendered only after an open actually fails. */}
                    {openFailed ? (
                      <p
                        role="alert"
                        className="mt-3.5 rounded-[3px] border border-line-strong bg-surface-alt px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-600"
                      >
                        Unable to open WhatsApp — your browser may have blocked
                        it. Nothing you typed has been lost. Please contact us
                        at{" "}
                        <a
                          href={site.phoneHref}
                          className="nums font-semibold text-navy-800 underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-fuel-700"
                        >
                          {site.phoneDisplay}
                        </a>
                        .
                      </p>
                    ) : null}
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
                height: the slack goes to the middle block and the closing note
                stays pinned to the bottom rule instead of floating mid-panel. */}
            <div className="blueprint-grid flex h-full flex-col rounded-[4px] border border-navy-900 bg-navy-950 p-7 lg:p-8">
              <PanelBlock icon={PhoneCall} label="Call now">
                <a
                  href={site.phoneHref}
                  /* py-2.5 on a 24px line clears 44px: on a phone this number
                     is the primary tap target, not just a heading. */
                  className="nums mt-1 block py-2.5 font-display text-[1.5rem] font-extrabold leading-none tracking-[-0.02em] text-white transition-colors duration-200 hover:text-fuel-400"
                >
                  {site.phoneDisplay}
                </a>
                <ButtonLink
                  href={site.phoneHref}
                  size="md"
                  className="mt-2.5 w-full"
                >
                  <Phone
                    className="size-4"
                    strokeWidth={2.1}
                    aria-hidden="true"
                  />
                  Call Now
                </ButtonLink>
              </PanelBlock>

              {/* Location → address → email → coverage, in the order someone
                  checking us out actually asks for them. The number stays
                  pinned above this block: it is the fastest path to a
                  delivery, so nothing pushes it down. */}
              <div className="mt-7 grow space-y-6 border-t border-white/10 pt-7">
                <PanelBlock icon={MapPin} label="Location">
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-onnavy-100">
                    {site.addressShort}
                  </p>
                </PanelBlock>

                <PanelBlock icon={Building2} label="Address">
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
                    View on map
                    <ExternalLink
                      className="size-3.5 shrink-0"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </a>
                </PanelBlock>

                <PanelBlock icon={Mail} label="Email">
                  <a
                    href={site.emailHref}
                    className="mt-0.5 block break-words py-1.5 text-[0.9375rem] text-onnavy-100 underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-fuel-400 hover:decoration-fuel-400"
                  >
                    {site.email}
                  </a>
                </PanelBlock>

                {/* Chips rather than a stacked list: four short names wrap
                    inside the panel at any width, and the row stays one
                    object instead of four lines of ragged text. */}
                <PanelBlock icon={Map} label="Delivering in">
                  <ul role="list" className="mt-2.5 flex flex-wrap gap-1.5">
                    {serviceAreas.map((area) => (
                      <li
                        key={area.name}
                        className="rounded-[3px] border border-white/15 px-2.5 py-1 text-[0.8125rem] leading-5 text-onnavy-100"
                      >
                        {area.name}
                      </li>
                    ))}
                  </ul>
                </PanelBlock>
              </div>

              <div className="mt-7 flex gap-3.5 border-t border-white/10 pt-6">
                <ShieldCheck
                  aria-hidden="true"
                  strokeWidth={1.7}
                  className="mt-0.5 size-[1.15rem] shrink-0 text-fuel-400"
                />
                <p className="min-w-0 flex-1 text-[0.9375rem] leading-relaxed text-onnavy-300">
                  <span className="block font-semibold text-white">
                    {assurance.title}
                  </span>
                  {assurance.note}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
