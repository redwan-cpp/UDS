"use client";

import { useEffect, useRef, useState } from "react";

import { Button, Arrow } from "@/components/ui/Button";
import { Eyebrow } from "@/components/typography";
import type { EnquiryTopic } from "@/types/content";

/**
 * The enquiry form.
 *
 * One screen, and two required fields. This replaces a seven-step flow —
 * intent, project type, location, scale, description, details, review — built
 * on the reasoning that an architecture enquiry is a conversation and a long
 * form is an interrogation. The reasoning was sound and the result still asked
 * someone to answer seven screens before they could say hello, which is the
 * wrong trade for the visitor who already knows what they want to write.
 *
 * **Only name and email are required.** Everything else — area, size, topic,
 * the message itself — is optional, which is what keeps a form of six fields
 * finishable in seconds: a visitor who knows their site fills it all in, and
 * one who does not is never stopped by a question they cannot answer. That is
 * the same problem the old flow solved by giving both its sizing questions a
 * "Not established yet" option; not asking is cheaper than offering an escape
 * hatch, and reaches the same place.
 *
 * `topics` arrives as a prop rather than being imported here. The old flow
 * read `@/data/contact` directly from inside the component, which CLAUDE.md
 * rule 1 rules out — only routes read `src/data/**`.
 *
 * PHASE 1 IS UI ONLY. Submission is stubbed at the boundary: nothing is sent,
 * stored or emailed, and the confirmation says so rather than implying
 * otherwise. The server action, validation, rate limiting and bot protection
 * are Phase 3 (architecture.md §3.5) and drop in behind this unchanged.
 */

/** Deliberately permissive. Real validation is Phase 3's job, not this one's. */
function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const FIELD =
  "w-full border-0 border-b border-hairline bg-transparent pb-3 text-body " +
  "outline-none transition-colors duration-[var(--dur-fast)] " +
  "placeholder:text-secondary focus:border-accent";

const LABEL = "block text-meta uppercase text-secondary";

export function ContactForm({
  topics,
  email,
}: {
  topics: EnquiryTopic[];
  /** Shown in the confirmation, so there is a real route out of a stub. */
  email: string;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);

  // The form is replaced by the confirmation, so focus has to be sent
  // somewhere real or it falls back to <body> and a screen reader user is left
  // with no idea the submission worked.
  //
  // In an effect, not a `requestAnimationFrame` inside the submit handler.
  // That was the first attempt and it silently did nothing: the frame callback
  // ran before React had committed the new subtree, so `doneRef.current` was
  // still null and focus stayed on <body> — measured, not assumed. An effect
  // is the only thing that is guaranteed to run after the commit that creates
  // the element it is reaching for.
  useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const address = String(data.get("email") ?? "").trim();

    const next: Record<string, string> = {};
    if (!name) next.name = "Please tell us your name.";
    if (!address) next.email = "Please add an email address.";
    else if (!isEmail(address))
      next.email = "That does not look like an email address.";

    setErrors(next);

    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      // Move to the first problem rather than leaving the reader to find it.
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="px-(--gutter) py-16 md:py-20 lg:pr-(--grid-gap)">
        <Eyebrow as="h3">Thank you</Eyebrow>
        <p
          ref={doneRef}
          tabIndex={-1}
          className="mt-5 max-w-[46ch] text-lead outline-none"
        >
          That is the end of the prototype. Nothing was sent, stored or
          emailed — the enquiry backend is a later phase of this project.
        </p>
        <p className="mt-6 max-w-[46ch] text-small text-secondary">
          To reach the studio for real in the meantime, write to{" "}
          <a
            href={`mailto:${email}`}
            className="underline decoration-1 underline-offset-4 transition-colors hover:text-accent"
          >
            {email}
          </a>
          .
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-10"
          onClick={() => {
            setSent(false);
            setErrors({});
          }}
        >
          Start again
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      // The browser's own bubbles are unstyled, disappear on blur and read in
      // a voice belonging to no design system. `required` stays on each field
      // for semantics and assistive technology; only the native UI is off.
      noValidate
      onSubmit={onSubmit}
      className="px-(--gutter) py-16 md:py-20 lg:pr-(--grid-gap)"
    >
      <Eyebrow as="h3">Send a message</Eyebrow>

      <div className="mt-10 grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 sm:grid-cols-2">
        <Field
          name="name"
          label="Your name"
          error={errors.name}
          autoComplete="name"
        />
        <Field
          name="email"
          label="Email"
          type="email"
          error={errors.email}
          autoComplete="email"
        />
      </div>

      {/* Area and size, the two things the old flow asked on screens of their
          own. Both optional and both on one row: someone who already knows
          their site fills them in without slowing down, and someone who has
          not bought it yet is not stopped by a question they cannot answer —
          which is why the old flow needed a "Not established yet" option for
          each of them. */}
      <div className="mt-10 grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 sm:grid-cols-2">
        <Field
          name="area"
          label="Area"
          optional
          placeholder="Neighbourhood, city or region"
        />
        <Field
          name="size"
          label="Approximate size (sq ft)"
          optional
          type="number"
          inputMode="numeric"
          placeholder="e.g. 2400"
        />
      </div>

      <div className="mt-10">
        <label htmlFor="topic" className={LABEL}>
          What is it about?
        </label>
        {/* A native select rather than a custom listbox: it is one tap on
            every platform, it is already accessible, and a rebuilt one would
            be slower for the visitor and more code here. */}
        <select
          id="topic"
          name="topic"
          defaultValue={topics[0]?.value}
          className={`${FIELD} mt-3 appearance-none rounded-none`}
        >
          {topics.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-10">
        <Field
          name="message"
          label="Message"
          optional
          multiline
          placeholder="As much or as little as you like"
        />
      </div>

      <Button type="submit" variant="primary" className="mt-12">
        Send enquiry
        <Arrow />
      </Button>

      <p className="mt-6 max-w-[52ch] text-caption text-secondary">
        Prototype only — nothing typed here is sent, stored or emailed.
      </p>
    </form>
  );
}

/**
 * One labelled field, with its error bound to it.
 *
 * `aria-describedby` and `aria-invalid` are the whole point of this existing:
 * an error message sitting visually under an input is not attached to it, and
 * a screen reader user tabbing into the field would hear the label and nothing
 * about what went wrong.
 */
function Field({
  name,
  label,
  error,
  type = "text",
  multiline = false,
  optional = false,
  autoComplete,
  inputMode,
  placeholder,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  multiline?: boolean;
  optional?: boolean;
  autoComplete?: string;
  inputMode?: "numeric";
  placeholder?: string;
}) {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    required: !optional,
    autoComplete,
    inputMode,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const;

  return (
    <div>
      <label htmlFor={name} className={LABEL}>
        {label}
        {/* Marked on the optional ones rather than the required ones: only two
            fields are required, so labelling those would put a mark on almost
            every line and tell the reader nothing. */}
        {optional && <span className="text-secondary"> — optional</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={5} className={`${FIELD} mt-3 resize-y`} />
      ) : (
        <input {...shared} type={type} className={`${FIELD} mt-3`} />
      )}
      {error && (
        <p id={errorId} className="mt-2 text-caption text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
