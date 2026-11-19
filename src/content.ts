export const pages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Industrial Service Automation & Quote Follow-Up | Berveuda AI",
    description:
      "Explore practical quote recovery, renewal reminders and office workflows for commercial boiler and industrial service contractors in the United States.",
  },
  "/solutions": {
    title: "Automation Solutions for Service Contractors | Berveuda AI",
    description:
      "Explore four practical systems for outstanding quotes, office routing, contract renewals and staff-reviewed customer communication.",
  },
  "/industries": {
    title: "Boiler, Loading Dock & Door Service Industries | Berveuda AI",
    description:
      "See where automation fits in commercial boiler service, loading dock maintenance and industrial door contractor offices.",
  },
  "/how-it-works": {
    title: "From Workflow Assessment to Launch | Berveuda AI",
    description:
      "Follow the seven steps from an initial conversation to an approved, tested and monitored industrial service workflow.",
  },
  "/about": {
    title: "About Berveuda AI | Practical Industrial Automation",
    description:
      "Meet Berveuda AI, an independent technology business focused on the day-to-day work of industrial service teams.",
  },
  "/contact": {
    title: "Request an Automation Assessment | Berveuda AI",
    description:
      "Tell Berveuda AI about your service business and the quote, renewal or administrative workflow you want to improve.",
  },
  "/privacy": {
    title: "Privacy Policy | Berveuda AI",
    description:
      "Learn how Berveuda AI collects, stores and handles website inquiries and how to request access or deletion.",
  },
  "/terms": {
    title: "Terms of Use | Berveuda AI",
    description:
      "Read the terms for using the Berveuda AI marketing website and requesting an initial assessment.",
  },
};
export const missingPage = {
  title: "Page not found | Berveuda AI",
  description:
    "Return to the Berveuda AI homepage or explore industrial service automation solutions.",
};

export const solutions = [
  {
    id: "quote-recovery",
    title: "AI quote recovery",
    short: "Quote recovery",
    intro: "Give every open quote a clear next step.",
    description:
      "An estimator sends a proposal, then turns to the next job. Bring eligible outstanding quotes into one review queue with an owner, a status and a follow-up date.",
    steps: [
      "Read approved quote records and identify proposals due for review.",
      "Prepare a reminder using the original quote facts for staff approval.",
      "Log the decision and stop follow-up when a customer replies, declines or opts out.",
    ],
    input: "Issued quotes and follow-up rules",
    output: "A prioritized queue of open proposals",
  },
  {
    id: "office-workflows",
    title: "Administrative workflow automation",
    short: "Office workflows",
    intro: "Keep information moving between the field and the office.",
    description:
      "A service inquiry can pass through an inbox, a spreadsheet and a dispatcher before anyone owns it. Connect approved tools around a defined handoff.",
    steps: [
      "Capture the agreed fields once from an approved source.",
      "Route the record to the right office role and notify its owner.",
      "Flag missing information for a person to resolve before the workflow continues.",
    ],
    input: "An intake source and routing rules",
    output: "Assigned tasks with clear ownership",
  },
  {
    id: "renewal-support",
    title: "Maintenance contract renewal support",
    short: "Renewal tracking",
    intro: "Put contract decisions in view before the due date.",
    description:
      "Use the dates already recorded in your service agreements to prepare a renewal queue. Your team sets the timing and reviews the terms.",
    steps: [
      "Identify approaching renewal dates on current agreements.",
      "Create internal reminders with the account owner and service history.",
      "Track the next action and escalate exceptions when the record needs a decision.",
    ],
    input: "Agreement dates and assigned owners",
    output: "A reviewable renewal calendar",
  },
  {
    id: "customer-communication",
    title: "AI-assisted customer communication",
    short: "Customer communication",
    intro: "Turn incoming messages into reviewable next actions.",
    description:
      "Help office staff organize routine requests and prepare consistent replies. A designated person handles sensitive decisions, service commitments and exceptions.",
    steps: [
      "Classify incoming requests against agreed categories.",
      "Suggest a response using approved business information.",
      "Route the draft for review and coordinate the approved follow-up.",
    ],
    input: "Approved inquiries and response guidance",
    output: "Organized requests and reviewed drafts",
  },
];
export const process = [
  [
    "Request an assessment",
    "Describe one recurring office task, who handles it and where the handoff slows down.",
  ],
  [
    "Map the opportunity",
    "Trace the current steps, source records, exceptions and decisions that need a person.",
  ],
  [
    "Review the proposal",
    "See the suggested workflow, supported tools, approval points and conditions for success.",
  ],
  [
    "Approve scope and pricing",
    "Agree in writing on deliverables, responsibilities, costs and timing before implementation.",
  ],
  [
    "Configure and test",
    "Walk through normal records, missing information, duplicates and stop conditions with your team.",
  ],
  [
    "Launch the approved workflow",
    "Choose who can approve actions and agree on a start date, a fallback and a point of contact.",
  ],
  [
    "Monitor and improve",
    "Review activity, exceptions and staff feedback. Agree on changes before expanding the workflow.",
  ],
];
export const industries = [
  {
    name: "Commercial & industrial boiler service",
    tag: "Primary focus",
    text: "Keep inspection findings, repair proposals and seasonal maintenance agreements connected as work moves from technician to estimator to office staff.",
    friction:
      "A repair quote is sent after a site visit. The estimator moves to another job, and the office has no shared follow-up date.",
    approach:
      "Assign a quote owner, bring due items into a review queue and record the customer’s decision.",
  },
  {
    name: "Loading dock & industrial door service",
    tag: "Expansion market",
    text: "Organize equipment-specific repair quotes, multi-site service requests and planned maintenance renewals across busy customer facilities.",
    friction:
      "A facility sends several door repair requests in one email. Each unit needs its own site identifier and responsible contact.",
    approach:
      "Organize the requests by site and asset, route missing details to a coordinator and schedule approved follow-up.",
  },
];
export const faqs = [
  [
    "What happens after I request an assessment?",
    "Berveuda AI reviews your inquiry and uses the contact information you provide to discuss the workflow. If there is a fit, you receive a proposed scope to review before any work begins.",
  ],
  [
    "Will messages go out without our approval?",
    "Your team defines the rules and authorized reviewers. In the quote recovery example, a staff member checks the recipient, timing and message before sending. Replies and exceptions pause the sequence.",
  ],
  [
    "Can you work with our existing tools?",
    "During assessment we review your CRM, spreadsheets, inboxes and access permissions. The proposal identifies supported connections, trade-offs and any manual steps.",
  ],
  [
    "How are timing and pricing decided?",
    "Scope, integrations, record quality and testing needs determine the proposal. You review timing and pricing before authorizing implementation.",
  ],
];
