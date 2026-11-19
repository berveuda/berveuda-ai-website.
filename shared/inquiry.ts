export const industryOptions = [
  "Commercial & industrial boiler service",
  "Loading dock & industrial door service",
  "Other industrial service",
  "Other",
];
export const challengeOptions = [
  "Outstanding quotes",
  "Administrative workflows",
  "Maintenance contract renewals",
  "Customer communication",
  "Privacy request",
  "Another workflow",
];
export const limits = {
  fullName: 100,
  businessName: 160,
  email: 254,
  phone: 40,
  website: 300,
  industry: 100,
  challenge: 100,
  details: 2500,
};
export type Inquiry = Record<keyof typeof limits, string> & {
  consent: boolean;
};
export type Errors = Partial<Record<keyof Inquiry, string>>;
export const consentVersion = "inquiry-contact-v1";
export const consentLabel =
  "I agree that Berveuda AI may contact me about this inquiry.";
export function validate(input: Record<string, unknown>): {
  data: Inquiry;
  errors: Errors;
} {
  const data = { consent: input.consent === true } as Inquiry;
  const errors: Errors = {};
  for (const key of Object.keys(limits) as (keyof typeof limits)[]) {
    const raw = input[key];
    const value = typeof raw === "string" ? raw.trim() : "";
    data[key] = value;
    if (raw !== undefined && typeof raw !== "string")
      errors[key] = "Enter a text value.";
    else if (value.length > limits[key])
      errors[key] = "Use " + limits[key] + " characters or fewer.";
    else if (!value && key !== "phone" && key !== "website")
      errors[key] = "Complete this field.";
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address.";
  data.email = data.email.toLowerCase();
  if (
    data.phone &&
    (!/^[0-9+().\s\-xext]+$/i.test(data.phone) ||
      data.phone.replace(/\D/g, "").length < 7)
  )
    errors.phone = "Enter a phone number with an area code.";
  if (data.website) {
    try {
      const url = new URL(
        /^[a-z][a-z\d+.-]*:/i.test(data.website)
          ? data.website
          : "https://" + data.website,
      );
      if (
        !["http:", "https:"].includes(url.protocol) ||
        !url.hostname.includes(".") ||
        url.username ||
        url.password ||
        /\s/.test(data.website)
      )
        throw new Error();
      data.website = url.href;
      if (data.website.length > limits.website)
        errors.website = "Enter a shorter website address.";
    } catch {
      errors.website = "Enter a valid business website, such as example.com.";
    }
  }
  if (!industryOptions.includes(data.industry))
    errors.industry = "Select an industry.";
  if (!challengeOptions.includes(data.challenge))
    errors.challenge = "Select a challenge.";
  if (!data.consent)
    errors.consent = "Consent is required to submit this inquiry.";
  return { data, errors };
}
