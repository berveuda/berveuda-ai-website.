import { useEffect, useRef, useState, type FormEvent } from "react";
import { ClipboardList, CheckCircle2 } from "lucide-react";
import {
  challengeOptions,
  consentLabel,
  industryOptions,
  limits,
  validate,
  type Errors,
} from "../shared/inquiry";
import { Verification } from "./Verification";
import { Eyebrow } from "./layout";

type Field = keyof typeof limits;
type Entry = {
  key: Field;
  label: string;
  type?: string;
  autocomplete?: string;
  options?: string[];
  placeholder?: string;
  optional?: boolean;
};
const entries: Entry[] = [
  { key: "fullName", label: "Full name", autocomplete: "name" },
  { key: "businessName", label: "Business name", autocomplete: "organization" },
  {
    key: "email",
    label: "Business email",
    type: "email",
    autocomplete: "email",
  },
  {
    key: "phone",
    label: "Phone number",
    type: "tel",
    autocomplete: "tel",
    optional: true,
  },
  { key: "industry", label: "Industry", options: industryOptions },
  {
    key: "website",
    label: "Business website",
    autocomplete: "url",
    optional: true,
    placeholder: "example.com",
  },
  {
    key: "challenge",
    label: "Primary operational challenge",
    options: challengeOptions,
  },
  {
    key: "details",
    label: "Additional details",
    placeholder: "Describe the task, who handles it and where it slows down.",
  },
];
export function Contact() {
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const id = useRef(""),
    sending = useRef(false);
  const confirmation = useRef<HTMLHeadingElement>(null);
  const alert = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reference) confirmation.current?.focus();
  }, [reference]);
  function showError(msg: string) {
    setMessage(msg);
    requestAnimationFrame(() => alert.current?.focus());
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    const { data, errors: problems } = validate({
      ...raw,
      consent: raw.consent === "on",
    });
    setErrors(problems);
    setMessage("");
    if (Object.keys(problems).length) {
      setMessage("Please check the highlighted fields.");
      form
        .querySelector<HTMLElement>('[name="' + Object.keys(problems)[0] + '"]')
        ?.focus();
      return;
    }
    if (!token) {
      showError("Complete the verification before submitting.");
      return;
    }
    sending.current = true;
    setBusy(true);
    if (!id.current) id.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          token,
          id: id.current,
          companyFax: raw.companyFax,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const body = await response.json();
      if (
        !response.ok ||
        body.saved !== true ||
        body.reference !== id.current
      ) {
        if (response.status === 409) id.current = "";
        if (body.errors) setErrors(body.errors);
        throw new Error(
          typeof body.message === "string"
            ? body.message
            : "Your submission could not be confirmed. Please retry.",
        );
      }
      setReference(body.reference);

    } catch (e) {
      showError(
        e instanceof Error && e.name === "Error"
          ? e.message
          : "Your submission could not be confirmed. Check your connection and retry.",
      );
      setToken("");
      setAttempt((i) => i + 1);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  return (
    <section className="contact-section">
      <div className="container contact-layout">
        <aside className="contact-intro">
          <Eyebrow>Workflow assessment</Eyebrow>
          <h1>Tell us where work slows down.</h1>
          <p>
            Describe one office workflow you want to improve. We’ll review your
            inquiry and contact you about the next step.
          </p>
          <div className="contact-tip">
            <ClipboardList aria-hidden="true" />
            <div>
              <h2>What to include</h2>
              <p>
                Which tools do you use? Who owns the task? Where does the next
                action get missed?
              </p>
            </div>
          </div>
        </aside>
        <div className="form-panel">
          {reference ? (
            <div className="success">
              <CheckCircle2 size={40} />
              <h2 ref={confirmation} tabIndex={-1}>
                Your inquiry was received.
              </h2>
              <p>
                Berveuda AI has saved your inquiry and can follow up using the
                details you provided.
              </p>
              <p className="reference">
                Inquiry reference
                <br />
                <strong>{reference}</strong>
              </p>
              <a className="text-link" href="/">
                Return home
              </a>
            </div>
          ) : (
            <form
              method="post"
              action="/api/inquiries"
              onSubmit={submit}
              noValidate
              aria-label="Automation assessment"
            >
              <h2>Request an Automation Assessment</h2>
              <p className="form-hint">
                Fields are required unless marked optional.
              </p>
              <noscript>
                <p>
                  Please enable JavaScript to complete the verification and
                  submit this form.
                </p>
              </noscript>
              <fieldset disabled={busy}>
                <legend className="sr-only">Inquiry information</legend>
                <div className="field-grid">
                  {entries.map((f) => {
                    const props = {
                      id: f.key,
                      name: f.key,
                      required: !f.optional,
                      "aria-invalid": !!errors[f.key],
                      "aria-describedby": errors[f.key]
                        ? f.key + "-error"
                        : undefined,
                    };
                    return (
                      <div
                        className={
                          "field " +
                          (["challenge", "details"].includes(f.key)
                            ? "wide"
                            : "")
                        }
                        key={f.key}
                      >
                        <label htmlFor={f.key}>
                          {f.label} {f.optional && <small>(optional)</small>}
                        </label>
                        {f.options ? (
                          <select {...props} defaultValue="">
                            <option value="">
                              Select{" "}
                              {f.key === "industry"
                                ? "an industry"
                                : "a challenge"}
                            </option>
                            {f.options.map((o) => (
                              <option key={o}>{o}</option>
                            ))}
                          </select>
                        ) : f.key === "details" ? (
                          <textarea
                            {...props}
                            maxLength={limits.details}
                            rows={4}
                            placeholder={f.placeholder}
                          />
                        ) : (
                          <input
                            {...props}
                            type={f.type || "text"}
                            autoComplete={f.autocomplete}
                            maxLength={limits[f.key]}
                            placeholder={f.placeholder}
                          />
                        )}
                        {errors[f.key] && (
                          <span className="field-error" id={f.key + "-error"}>
                            {errors[f.key]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="trap" aria-hidden="true">
                  <label htmlFor="companyFax">Leave this field empty</label>
                  <input
                    id="companyFax"
                    name="companyFax"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <label className="consent">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    aria-invalid={!!errors.consent}
                    aria-describedby={
                      errors.consent ? "consent-error" : undefined
                    }
                  />
                  <span>{consentLabel}</span>
                </label>
                {errors.consent && (
                  <p id="consent-error" className="field-error">
                    {errors.consent}
                  </p>
                )}
                <p className="form-hint">
                  Please leave out passwords and sensitive customer details.
                  Read our <a href="/privacy">privacy policy</a>.
                </p>
              </fieldset>
              <Verification attempt={attempt} onToken={setToken} />
              {message && (
                <div
                  className="form-error"
                  ref={alert}
                  role="alert"
                  tabIndex={-1}
                >
                  {message}
                </div>
              )}
              <button
                type="submit"
                className="btn primary submit"
                disabled={busy}
              >
                {busy ? "Submitting inquiry…" : "Submit assessment request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
