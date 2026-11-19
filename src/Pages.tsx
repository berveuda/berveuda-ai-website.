import { Check, ClipboardList, Waypoints, ShieldCheck } from "lucide-react";
import { Cta, Eyebrow, icons, PageIntro, Plant } from "./layout";
import { industries, process, solutions } from "./content";

export function Solutions() {
  return (
    <>
      <PageIntro
        label="Solutions"
        title="Practical systems for daily service work."
        description="Start with the recurring task your office already knows well. Each system has an agreed source, a responsible person and a clear next action."
      />
      <div className="container solutions-layout">
        <nav className="section-nav" aria-label="On this page">
          <span className="mono">On this page</span>
          {solutions.map((s) => (
            <a key={s.id} href={"#" + s.id}>
              {s.short}
            </a>
          ))}
        </nav>
        <div>
          {solutions.map((s, i) => {
            const Icon = icons[i];
            return (
              <section className="solution-detail" key={s.id} id={s.id}>
                <span className="tile-icon">
                  <Icon />
                </span>
                <h2>{s.title}</h2>
                <h3>{s.intro}</h3>
                <p>{s.description}</p>
                <ul className="check-list">
                  {s.steps.map((v) => (
                    <li key={v}>
                      <Check aria-hidden="true" />
                      {v}
                    </li>
                  ))}
                </ul>
                <dl className="io-row">
                  <div>
                    <dt>Starting point</dt>
                    <dd>{s.input}</dd>
                  </div>
                  <div>
                    <dt>Working output</dt>
                    <dd>{s.output}</dd>
                  </div>
                </dl>
                <a href="/contact" className="text-link">
                  Discuss your workflow
                </a>
              </section>
            );
          })}
        </div>
      </div>
      <Cta />
    </>
  );
}
export function Industries() {
  return (
    <>
      <PageIntro
        label="Industries"
        title="Automation for industrial service contractors."
        description="Berveuda AI focuses on the office handoffs that follow a site visit, a repair recommendation or a maintenance agreement."
      />
      <div className="container">
        <div className="industries-main">
          <div className="industry-image">
            <Plant />
          </div>
          <div>
            <Eyebrow>{industries[0].tag}</Eyebrow>
            <h2>{industries[0].name}</h2>
            <p>{industries[0].text}</p>
            <h3>A common bottleneck</h3>
            <p>{industries[0].friction}</p>
            <h3>A practical workflow</h3>
            <p>{industries[0].approach}</p>
            <a className="text-link" href="/solutions#quote-recovery">
              Explore quote recovery
            </a>
          </div>
        </div>
        <div className="industry-secondary">
          <div>
            <Eyebrow>{industries[1].tag}</Eyebrow>
            <h2>{industries[1].name}</h2>
            <p>{industries[1].text}</p>
          </div>
          <div>
            <h3>A common bottleneck</h3>
            <p>{industries[1].friction}</p>
            <h3>A practical workflow</h3>
            <p>{industries[1].approach}</p>
          </div>
        </div>
      </div>
      <Cta />
    </>
  );
}
export function Process() {
  return (
    <>
      <PageIntro
        label="How it works"
        title="From first conversation to approved workflow."
        description="Scope, timing and integrations depend on the records, tools and people involved in your business."
      />
      <div className="container journey">
        <aside>
          <Eyebrow>Implementation process</Eyebrow>
          <h2>Your path to launch.</h2>
          <p>
            Each decision has an owner. Your approval comes before configuration
            and again before a workflow goes live.
          </p>
          <a className="text-link" href="/contact">
            Request an assessment
          </a>
        </aside>
        <ol className="timeline">
          {process.map(([a, b], i) => (
            <li key={a}>
              <span className="timeline-marker">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{a}</h3>
                <p>{b}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <Cta />
    </>
  );
}
export function About() {
  return (
    <>
      <PageIntro
        label="About Berveuda AI"
        title="Technology grounded in everyday service work."
        description="Berveuda AI is an independent technology business under the Berveuda brand. Our focus is practical automation for US industrial service contractors."
      />
      <div className="container section">
        <div className="two-col values">
          <article>
            <Eyebrow>Mission</Eyebrow>
            <h2>
              Help service businesses operate more efficiently and build
              stronger systems through practical automation.
            </h2>
          </article>
          <article>
            <Eyebrow>Vision</Eyebrow>
            <h2>
              Develop technology that connects business operations, intelligent
              software, and real-world industry.
            </h2>
          </article>
        </div>
        <div className="section">
          <Eyebrow>Our approach</Eyebrow>
          <h2>Stay close to the work.</h2>
          <div className="principles">
            {[
              [
                ClipboardList,
                "Start with the record",
                "Use real workflow requirements and agreed business information to define what a system should do.",
              ],
              [
                ShieldCheck,
                "Keep decisions accountable",
                "Put a person in charge of sensitive messages, pricing decisions and exceptions.",
              ],
              [
                Waypoints,
                "Expand with evidence",
                "Start with boiler service workflows. Apply what is learned to adjacent service markets as their needs become clear.",
              ],
            ].map(([Icon, title, body]) => {
              const I = Icon as typeof ClipboardList;
              return (
                <article key={String(title)}>
                  <I aria-hidden="true" />
                  <h3>{String(title)}</h3>
                  <p>{String(body)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
      <Cta />
    </>
  );
}

export function Legal({ privacy }: { privacy: boolean }) {
  const sections = privacy
    ? [
        [
          "Information you provide",
          "When you submit an inquiry, Berveuda AI receives your name, business name, email, industry, operational challenge, details and consent to contact you. You may also provide a phone number and website. Keep customer records, passwords and sensitive personal information out of this form.",
        ],
        [
          "How the information is used",
          "Berveuda AI uses inquiry information to assess your request, respond and coordinate follow-up about that request. Submitting this form does not enroll you in marketing emails.",
        ],
        [
          "Hosting and bot protection",
          "Cloudflare hosts these pages, runs the form endpoint and stores validated inquiries in D1. The contact page loads Cloudflare Turnstile to check for automated submissions. Cloudflare may process technical information, including network and browser information, to operate these services.",
        ],
        [
          "Storage and access",
          "The inquiry record includes a reference, submission time and consent version. The website has no public lead directory. The owner uses authenticated Cloudflare tools to read, export or delete inquiries. This site does not add advertising pixels or optional analytics scripts.",
        ],
        [
          "Retention and deletion",
          "The retention period for website inquiries is 90 days from receipt. The owner reviews and deletes expired records and related exports. Provider recovery copies may persist briefly after deletion. If you later sign a service agreement, the agreement may describe separate recordkeeping.",
        ],
        [
          "Your privacy questions",
          "Use the contact form, select “Privacy request” and describe whether you want to access, correct or delete an inquiry. Include its reference if available. The owner may verify your identity before acting.",
        ],
      ]
    : [
        [
          "Using the website",
          "Berveuda AI provides information about potential automation services for businesses. You may browse the website and submit a legitimate business inquiry.",
        ],
        [
          "Assessments and service agreements",
          "Browsing or requesting an assessment does not create a service agreement. Any implementation requires a separate agreement covering scope, price, responsibilities and delivery.",
        ],
        [
          "Examples and outcomes",
          "Workflow examples illustrate possible configurations. Actual capabilities depend on your tools, data quality, approvals and agreed scope. Business and financial outcomes vary.",
        ],
        [
          "Acceptable use",
          "Provide accurate information that you are authorized to share. Do not send spam, confidential customer records or material that interferes with the site or another visitor.",
        ],
        [
          "Site materials and changes",
          "Berveuda AI and its licensors retain their interests in original site materials. Services and site content may change. Any separately signed service agreement governs the work it covers.",
        ],
        [
          "Questions",
          "Use the inquiry form to ask about these terms, the website or a proposed service.",
        ],
      ];
  return (
    <>
      <PageIntro
        label="Website information"
        title={privacy ? "Privacy policy" : "Terms of use"}
        description={
          privacy
            ? "How Berveuda AI handles information submitted through this website."
            : "The conditions for browsing this website and contacting Berveuda AI."
        }
      />
      <article className="legal container">
        <p className="policy-date">Updated November 19, 2026</p>
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
        <a className="btn dark-button" href="/contact">
          {privacy ? "Submit a privacy request" : "Contact Berveuda AI"}
        </a>
      </article>
    </>
  );
}
export function NotFound() {
  return (
    <div className="notfound">
      <div className="container">
        <Eyebrow>Error 404</Eyebrow>
        <h1>Page not found.</h1>
        <p>This address doesn’t lead to a page on the Berveuda AI website.</p>
        <div className="actions">
          <a className="btn primary" href="/">
            Return home
          </a>
          <a className="btn secondary" href="/solutions">
            Explore solutions
          </a>
        </div>
      </div>
    </div>
  );
}
