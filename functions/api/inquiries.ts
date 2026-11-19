import {
  consentVersion,
  validate,
  type Inquiry,
} from "../../shared/inquiry.ts";

interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_HOSTNAME: string;
}
const respond = (
  status: number,
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      ...headers,
    },
  });
const maxBytes = 24576;
async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return respond(400, { message: "The form was empty." });
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return respond(413, { message: "The inquiry is too large." });
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    const obj = JSON.parse(new TextDecoder().decode(bytes));
    if (!obj || typeof obj !== "object" || Array.isArray(obj))
      throw new Error();
    return obj as Record<string, unknown>;
  } catch {
    return respond(400, { message: "The form data could not be read." });
  }
}
function values(d: Inquiry) {
  return [
    d.fullName,
    d.businessName,
    d.email,
    d.phone || null,
    d.industry,
    d.website || null,
    d.challenge,
    d.details,
    consentVersion,
  ];
}
export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== "POST")
    return respond(
      405,
      { message: "Use the assessment form to submit an inquiry." },
      { Allow: "POST" },
    );
  const url = new URL(request.url);
  if (request.headers.get("Origin") !== url.origin)
    return respond(403, {
      message: "Open the assessment form on this website.",
    });
  if (
    request.headers.get("Content-Type")?.split(";")[0].trim() !==
    "application/json"
  )
    return respond(415, { message: "Send the form as JSON." });
  if (Number(request.headers.get("Content-Length")) > maxBytes)
    return respond(413, { message: "The inquiry is too large." });
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const secret = env.TURNSTILE_SECRET_KEY;
  const host = env.TURNSTILE_HOSTNAME?.toLowerCase();
  const isDummy = /^[123]x0{20,}(AA|AB|BB|FF)$/.test(secret || "");
  if (
    !env.DB ||
    !secret ||
    !host ||
    host !== url.hostname ||
    (isDummy && !local)
  )
    return respond(503, {
      message: "The inquiry service is unavailable. Please try again later.",
    });
  try {
    const obj = await readBody(request);
    if (obj instanceof Response) return obj;
    if (obj.companyFax)
      return respond(400, { message: "The inquiry could not be accepted." });
    const { data, errors } = validate(obj);
    if (Object.keys(errors).length)
      return respond(422, {
        message: "Please check the highlighted fields.",
        errors,
      });
    if (
      typeof obj.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        obj.id,
      )
    )
      return respond(400, { message: "Reload the form and try again." });
    if (typeof obj.token !== "string" || !obj.token || obj.token.length > 2048)
      return respond(422, {
        message: "Complete the verification and try again.",
      });
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret, response: obj.token }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!verification.ok)
      return respond(503, {
        message: "Verification is unavailable. Please try again.",
      });
    const result = (await verification.json()) as {
      success: boolean;
      hostname: string;
      action: string;
    };
    if (
      !result.success ||
      (!(local && isDummy) &&
        (result.hostname !== host || result.action !== "assessment"))
    )
      return respond(422, {
        message: "Verification was unsuccessful. Please verify again.",
      });
    const fields = values(data);
    const insert = await env.DB.prepare(
      "INSERT INTO inquiries(id,full_name,business_name,email,phone,industry,website,challenge,details,consent_version) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
    )
      .bind(obj.id, ...fields)
      .run();
    if (!insert.success) throw new Error("write");
    if (insert.meta.changes === 0) {
      // An acknowledged replay must refer to the very same saved inquiry.
      const existing = await env.DB.prepare(
        "SELECT id FROM inquiries WHERE id=? AND full_name=? AND business_name=? AND email=? AND phone IS ? AND industry=? AND website IS ? AND challenge=? AND details=? AND consent_version=?",
      )
        .bind(obj.id, ...fields)
        .first();
      if (!existing)
        return respond(409, {
          message:
            "This reference has already been used. Submit again for a new reference.",
        });
    }
    return respond(insert.meta.changes === 0 ? 200 : 201, {
      saved: true,
      reference: obj.id,
    });
  } catch {
    return respond(503, {
      message:
        "We could not confirm that your inquiry was saved. Please retry with the same form.",
    });
  }
};
