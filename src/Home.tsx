import { useState } from "react";
import {
  FileText,
  ListFilter,
  UserRoundCheck,
  Send,
  Check,
  ListTree,
  Plus,
} from "lucide-react";
import { CapabilityStrip, Cta, Eyebrow, Plant, icons } from "./layout";
import { faqs, industries, solutions } from "./content";

const stages = [
  {
    label: "Capture",
    title: "Bring open quotes into view.",
    text: "Start with issued proposals from an approved quote list. Carry forward the customer, estimate reference, date and assigned owner.",
    fields: ["Quote reference", "Customer record", "Assigned estimator"],
    icon: FileText,
  },
  {
    label: "Qualify",
    title: "Find quotes ready for follow-up.",
    text: "Check status, timing and contact permissions. Set aside closed quotes, opt-outs and records with missing details.",
    fields: ["Open status", "Follow-up date", "Permission check"],
    icon: ListFilter,
  },
  {
    label: "Review",
    title: "Give a person the final say.",
    text: "An authorized staff member checks the recipient and suggested message against the original quote. They can edit, approve or hold it.",
    fields: ["Recipient check", "Draft reminder", "Staff decision"],
    icon: UserRoundCheck,
  },
  {
    label: "Follow up",
    title: "Record what happens next.",
    text: "Send the approved reminder through the agreed channel. Log the action and pause future reminders when the customer responds.",
    fields: ["Approved reminder", "Activity record", "Reply handling"],
    icon: Send,
  },
];
function Workflow() {
  const [step, setStep] = useState(0);
  const current = stages[step],
    Icon = current.icon;
  return (
    <section className="section workflow" aria-labelledby="workflow-heading">
      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow>Workflow spotlight</Eyebrow>
            <h2 id="workflow-heading">Inside a quote recovery workflow.</h2>
          </div>
          <a className="text-link" href="/solutions#quote-recovery">
            Explore quote recovery
          </a>
        </div>
        <div className="workflow-frame">
          <div className="workflow-control">
            <div className="workflow-label">
              <ListTree size={18} /> Example workflow
            </div>
            <div className="step-options" aria-label="Explore workflow stages">
              {stages.map((s, i) => {
                const I = s.icon;
                return (
                  <button
                    key={s.label}
                    type="button"
                    aria-pressed={step === i}
                    onClick={() => setStep(i)}
                  >
                    <I size={19} />
                    <span>{s.label}</span>
                    <span className="step-indicator" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="workflow-content" aria-live="polite">
            <div className="node-heading">
              <span className="node-icon">
                <Icon />
              </span>
              <span className="mono">Stage {step + 1} of 4</span>
            </div>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
            <ul className="data-tags">
              {current.fields.map((f) => (
                <li key={f}>
                  <Check size={14} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
function Opportunities() {
  return (
    <section className="section">
      <div className="container split-intro">
        <div>
          <Eyebrow>Automation solutions</Eyebrow>
          <h2>Choose the work worth automating.</h2>
          <p>
            Look for a recurring task with a clear trigger and an outcome you
            can check. Start with an open quote, an unassigned request or an
            approaching renewal.
          </p>
        </div>
        <ul className="opportunity-list">
          {solutions.map((s, i) => {
            const Icon = icons[i];
            return (
              <li key={s.id}>
                <a href={"/solutions#" + s.id}>
                  <span className="tile-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{s.title}</strong>
                    <span>{s.intro}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-image">
          <Plant hero />
        </div>
        <div className="hero-shade" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <Eyebrow>Industrial workflow automation</Eyebrow>
            <h1>
              Recover missed
              <br />
              revenue.
              <br />
              <em>Eliminate busywork.</em>
            </h1>
            <p>
              Berveuda AI builds practical automation for industrial service
              contractors. Stay on top of open quotes, customer follow-ups and
              recurring office work.
            </p>
            <div className="actions">
              <a className="btn primary" href="/contact">
                Request an Automation Assessment
              </a>
              <a className="btn secondary" href="/solutions">
                Explore Our Solutions
              </a>
            </div>
          </div>
          <div className="plant-caption" aria-hidden="true">
            <span className="viewfinder" />
            Boiler service operations
          </div>
        </div>
      </section>
      <CapabilityStrip />
      <Workflow />
      <section className="section audiences">
        <div className="container">
          <Eyebrow>Who we help</Eyebrow>
          <h2>Built around the service office.</h2>
          <div className="two-col">
            {industries.map((i) => (
              <article className="industry-card" key={i.name}>
                <span className="mono">{i.tag}</span>
                <h3>{i.name}</h3>
                <p>{i.friction}</p>
                <a href="/industries" className="text-link">
                  Explore industry workflows
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split-intro">
          <div>
            <Eyebrow>Implementation</Eyebrow>
            <h2>One workflow at a time.</h2>
            <p>
              Start where repetitive work costs your office attention. Your team
              sets the rules and approves the scope.
            </p>
            <a className="text-link" href="/how-it-works">
              See how it works
            </a>
          </div>
          <ol className="short-process">
            {[
              [
                "Map the handoff",
                "Identify the source, owner and decision behind the task.",
              ],
              [
                "Test the exceptions",
                "Check what happens when a record is missing, late or already closed.",
              ],
              [
                "Review the outcome",
                "Track follow-up activity and identify work that still needs a person.",
              ],
            ].map(([n, t], i) => (
              <li key={n}>
                <span className="count">0{i + 1}</span>
                <div>
                  <h3>{n}</h3>
                  <p>{t}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Opportunities />
      <section className="section faq">
        <div className="container split-intro">
          <div>
            <Eyebrow>Frequently asked questions</Eyebrow>
            <h2>Before you begin.</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus aria-hidden="true" size={19} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
