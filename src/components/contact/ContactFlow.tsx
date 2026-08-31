"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Arrow } from "@/components/ui/Button";
import { Eyebrow } from "@/components/typography";
import { contactSteps, nonProjectIntents, projectOnlySteps } from "@/data/contact";
import type { ContactStep } from "@/types/content";

type Answers = Record<string, string>;

interface Details {
  name: string;
  email: string;
  organisation: string;
  phone: string;
}

const EMPTY_DETAILS: Details = { name: "", email: "", organisation: "", phone: "" };

/** Deliberately permissive. Server-side validation is Phase 3's job, not this one's. */
function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * The enquiry flow.
 *
 * One question per screen, because an architecture enquiry is a conversation
 * and a fourteen-field form is an interrogation. Answers are kept when stepping
 * backwards, irrelevant questions are skipped, and there is a direct route for
 * someone who only wants to send a message.
 *
 * PHASE 1 IS UI ONLY. Submission is stubbed at the boundary: nothing is sent,
 * stored or emailed, and the interface says so rather than implying otherwise.
 * The server action, validation, rate limiting and bot protection are Phase 3
 * (architecture.md §3.5) and drop in behind this component unchanged.
 *
 * Accessibility: each step is a fieldset with a real legend, focus moves to the
 * new step heading on change, progress is announced through a polite live
 * region, and errors are bound to their field with `aria-describedby`.
 */
export function ContactFlow({ email }: { email: string }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  // Questions that do not apply to this enquiry are removed from the flow, not
  // shown and disabled — asking a journalist for a floor area is noise.
  const steps = useMemo(() => {
    const intent = answers.intent;
    const skipProject =
      intent && (nonProjectIntents as readonly string[]).includes(intent);
    return contactSteps.filter(
      (step) => !(skipProject && (projectOnlySteps as readonly string[]).includes(step.id)),
    );
  }, [answers.intent]);

  const step = steps[Math.min(index, steps.length - 1)];
  const isLast = index === steps.length - 1;

  // Move focus to the new question so a keyboard or screen-reader user lands on
  // it, but not on first paint — that would steal focus from the page.
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [index, submitted]);

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  }

  function validate(current: ContactStep): boolean {
    const next: Record<string, string> = {};

    if (current.kind === "details") {
      if (!details.name.trim()) next.name = "Please tell us your name.";
      if (!details.email.trim()) next.email = "Please add an email address.";
      else if (!isEmail(details.email))
        next.email = "That does not look like an email address.";
    } else if (!current.optional && current.kind !== "review") {
      if (!answers[current.id]?.trim()) {
        next[current.id] =
          current.kind === "choice" ? "Please choose an option." : "Please fill this in.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validate(step)) return;
    if (isLast) {
      setSubmitted(true);
      return;
    }
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setIndex((i) => Math.max(i - 1, 0));
  }

  /** Direct route for someone who only wants to write a message. */
  function skipToMessage() {
    setAnswers((prev) => ({ ...prev, intent: prev.intent || "other" }));
    setErrors({});
    const target = steps.findIndex((s) => s.id === "detail");
    setIndex(target > -1 ? target : 0);
  }

  if (submitted) {
    return (
      <Container width="narrow" className="mx-auto py-24 md:py-32">
        <div className="border-t border-accent pt-8">
          <Eyebrow className="text-accent">Not sent</Eyebrow>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 text-h2 outline-none"
          >
            This is a design prototype
          </h2>
          <p className="mt-6 text-body text-secondary">
            Your answers were not transmitted, stored or emailed — the enquiry
            backend is a later phase of this project, and pretending otherwise
            would lose a real enquiry.
          </p>
          <p className="mt-4 text-body text-secondary">
            To reach the studio now, write to{" "}
            <a
              href={`mailto:${email}`}
              className="text-accent underline decoration-1 underline-offset-4"
            >
              {email}
            </a>
            .
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                setSubmitted(false);
                setIndex(0);
                setAnswers({});
                setDetails(EMPTY_DETAILS);
              }}
            >
              Start again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container width="narrow" className="mx-auto py-16 md:py-24">
      {/* Progress. The rule is the indicator — no bar, no percentage badge. */}
      <div className="flex items-baseline justify-between gap-6 pb-4">
        <Eyebrow>
          Step <span data-numeric>{String(index + 1).padStart(2, "0")}</span> of{" "}
          <span data-numeric>{String(steps.length).padStart(2, "0")}</span>
        </Eyebrow>
        <button
          type="button"
          onClick={skipToMessage}
          className="-my-2 py-2 text-meta uppercase text-secondary underline decoration-1 underline-offset-4 transition-colors hover:text-accent"
        >
          Just send a message
        </button>
      </div>

      <div className="h-px w-full bg-hairline">
        {/* scaleX rather than width: animating width relays out the whole row
            on every frame, and this is the one element moving during a step
            change. */}
        <div
          className="h-px w-full origin-left bg-accent transition-transform duration-[var(--dur-slow)] ease-out-soft motion-reduce:transition-none"
          style={{ transform: `scaleX(${(index + 1) / steps.length})` }}
        />
      </div>

      <p aria-live="polite" className="sr-only">
        {`Step ${index + 1} of ${steps.length}. ${step.question}`}
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          goNext();
        }}
        noValidate
        className="pt-10"
      >
        <fieldset>
          <legend className="sr-only">{step.question}</legend>

          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-h2 text-balance outline-none"
          >
            {step.question}
          </h2>

          {step.helper && (
            <p className="mt-4 text-small text-secondary">{step.helper}</p>
          )}

          <div className="mt-10">
            {step.kind === "choice" && (
              <ChoiceStep
                step={step}
                value={answers[step.id]}
                error={errors[step.id]}
                onChange={(value) => setAnswer(step.id, value)}
              />
            )}

            {(step.kind === "text" || step.kind === "longtext") && (
              <TextStep
                step={step}
                value={answers[step.id] ?? ""}
                error={errors[step.id]}
                onChange={(value) => setAnswer(step.id, value)}
              />
            )}

            {step.kind === "details" && (
              <DetailsStep
                details={details}
                errors={errors}
                onChange={(patch) => {
                  setDetails((prev) => ({ ...prev, ...patch }));
                  setErrors((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(patch).map((k) => [k, ""])) }));
                }}
              />
            )}

            {step.kind === "review" && (
              <ReviewStep
                steps={steps}
                answers={answers}
                details={details}
                onEdit={(stepIndex) => setIndex(stepIndex)}
              />
            )}
          </div>
        </fieldset>

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-hairline pt-8">
          {index > 0 && (
            <Button variant="secondary" onClick={goBack}>
              <Arrow className="rotate-180" />
              Back
            </Button>
          )}

          <Button type="submit" variant="primary">
            {isLast ? "Send enquiry" : "Continue"}
            {!isLast && <Arrow />}
          </Button>

          {step.optional && (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
              className="-my-2 py-2 text-meta uppercase text-secondary underline decoration-1 underline-offset-4 transition-colors hover:text-accent"
            >
              Skip
            </button>
          )}
        </div>

        {isLast && (
          <p className="mt-6 text-caption text-secondary">
            This prototype does not send anything. Nothing you type here leaves
            your browser.
          </p>
        )}
      </form>
    </Container>
  );
}

/* -------------------------------------------------------------------------- */

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-3 flex gap-2 text-small text-accent">
      <span aria-hidden="true">—</span>
      {message}
    </p>
  );
}

function ChoiceStep({
  step,
  value,
  error,
  onChange,
}: {
  step: ContactStep;
  value?: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const errorId = `${step.id}-error`;

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${step.id}-legend`}
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      <span id={`${step.id}-legend`} className="sr-only">
        {step.question}
      </span>

      <ul className="flex flex-col">
        {step.options?.map((option) => {
          const id = `${step.id}-${option.value}`;
          const selected = value === option.value;

          return (
            <li key={option.value} className="border-t border-hairline last:border-b">
              <label
                htmlFor={id}
                className="group flex cursor-pointer items-baseline gap-5 py-5 transition-colors duration-[var(--dur-fast)] has-[:checked]:text-accent"
              >
                <input
                  type="radio"
                  id={id}
                  name={step.id}
                  value={option.value}
                  checked={selected}
                  onChange={() => onChange(option.value)}
                  className="sr-only"
                />
                {/* The marker is a rule, not a dot — it matches the language
                    and it is a shape change, not only a colour change. */}
                <span
                  aria-hidden="true"
                  className={[
                    "mt-2 block h-px w-10 shrink-0 origin-left transition-[transform,background-color] duration-[var(--dur-base)] ease-out-soft motion-reduce:transition-none",
                    selected
                      ? "scale-x-100 bg-accent"
                      : "scale-x-50 bg-hairline group-hover:scale-x-75 group-hover:bg-current",
                  ].join(" ")}
                />
                <span>
                  <span className="block text-h3">{option.label}</span>
                  {option.description && (
                    <span className="mt-1.5 block text-small text-secondary">
                      {option.description}
                    </span>
                  )}
                </span>
                {selected && (
                  <span className="ml-auto shrink-0 text-meta uppercase">
                    Selected
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>

      <FieldError id={errorId} message={error} />
    </div>
  );
}

function TextStep({
  step,
  value,
  error,
  onChange,
}: {
  step: ContactStep;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const errorId = `${step.id}-error`;
  const shared =
    "w-full border-0 border-b border-hairline bg-transparent pb-3 text-body outline-none transition-colors duration-[var(--dur-fast)] placeholder:text-secondary focus:border-accent";

  return (
    <div>
      <label htmlFor={step.id} className="sr-only">
        {step.question}
      </label>
      {step.kind === "longtext" ? (
        <textarea
          id={step.id}
          rows={5}
          value={value}
          placeholder={step.placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={`${shared} resize-y`}
        />
      ) : (
        <input
          id={step.id}
          type="text"
          value={value}
          placeholder={step.placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={shared}
        />
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function DetailsStep({
  details,
  errors,
  onChange,
}: {
  details: Details;
  errors: Record<string, string>;
  onChange: (patch: Partial<Details>) => void;
}) {
  const fields: {
    key: keyof Details;
    label: string;
    type: string;
    required: boolean;
    autoComplete: string;
  }[] = [
    { key: "name", label: "Name", type: "text", required: true, autoComplete: "name" },
    { key: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { key: "organisation", label: "Organisation (optional)", type: "text", required: false, autoComplete: "organization" },
    { key: "phone", label: "Phone (optional)", type: "tel", required: false, autoComplete: "tel" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {fields.map((field) => {
        const errorId = `${field.key}-error`;
        const error = errors[field.key];
        return (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="block text-meta uppercase text-secondary"
            >
              {field.label}
            </label>
            <input
              id={field.key}
              name={field.key}
              type={field.type}
              required={field.required}
              autoComplete={field.autoComplete}
              value={details[field.key]}
              onChange={(event) => onChange({ [field.key]: event.target.value })}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={error ? true : undefined}
              className="mt-3 w-full rounded-field border-0 border-b border-hairline bg-transparent pb-3 text-body outline-none transition-colors duration-[var(--dur-fast)] focus:border-accent"
            />
            <FieldError id={errorId} message={error} />
          </div>
        );
      })}
    </div>
  );
}

function ReviewStep({
  steps,
  answers,
  details,
  onEdit,
}: {
  steps: ContactStep[];
  answers: Answers;
  details: Details;
  onEdit: (index: number) => void;
}) {
  const rows = steps
    .map((step, i) => ({ step, i }))
    .filter(({ step }) => step.kind !== "review" && step.kind !== "details")
    .map(({ step, i }) => {
      const raw = answers[step.id];
      const label =
        step.options?.find((option) => option.value === raw)?.label ?? raw;
      return { id: step.id, question: step.question, value: label, index: i };
    });

  const detailsIndex = steps.findIndex((s) => s.kind === "details");

  return (
    <dl className="flex flex-col">
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-baseline justify-between gap-6 border-t border-hairline py-4"
        >
          <div>
            <dt className="text-meta uppercase text-secondary">{row.question}</dt>
            <dd className="mt-1.5 text-body">
              {row.value || <span className="text-secondary">Not answered</span>}
            </dd>
          </div>
          <button
            type="button"
            onClick={() => onEdit(row.index)}
            className="-my-2 shrink-0 py-2 text-meta uppercase text-accent underline decoration-1 underline-offset-4"
          >
            Edit<span className="sr-only"> {row.question}</span>
          </button>
        </div>
      ))}

      <div className="flex items-baseline justify-between gap-6 border-t border-hairline py-4">
        <div>
          <dt className="text-meta uppercase text-secondary">Contact details</dt>
          <dd className="mt-1.5 text-body">
            {details.name}
            {details.email ? ` · ${details.email}` : ""}
            {details.organisation ? ` · ${details.organisation}` : ""}
            {details.phone ? ` · ${details.phone}` : ""}
          </dd>
        </div>
        <button
          type="button"
          onClick={() => onEdit(detailsIndex)}
          className="-my-2 shrink-0 py-2 text-meta uppercase text-accent underline decoration-1 underline-offset-4"
        >
          Edit<span className="sr-only"> contact details</span>
        </button>
      </div>
    </dl>
  );
}
