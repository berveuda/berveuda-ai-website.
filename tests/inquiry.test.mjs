import assert from "node:assert/strict";
import test from "node:test";
import { validate, limits } from "../shared/inquiry.ts";
import { onRequest } from "../functions/api/inquiries.ts";

const input = {
  fullName: "Test Coordinator",
  businessName: "QA office",
  email: " OFFICE@EXAMPLE.INVALID ",
  phone: "",
  website: "example.invalid",
  industry: "Other",
  challenge: "Outstanding quotes",
  details: "A fictional local workflow.",
  consent: true,
};
const origin = "https://assessment.example.invalid";
const valid = {
  ...input,
  token: "unit-token",
  id: "dd44cf5c-2881-4b8d-ade4-2f34924ef564",
};
function endpoint(options = {}) {
  const host = options.origin || origin;
  const request = new Request(host + "/api/inquiries", {
    method: options.method || "POST",
    headers: {
      Origin: options.from || host,
      "Content-Type": options.type || "application/json",
    },
    ...(options.method === "GET"
      ? {}
      : { body: options.raw ?? JSON.stringify(options.body || valid) }),
  });
  return onRequest({
    request,
    env: {
      DB: options.db || {
        prepare() {
          throw new Error("Unexpected database operation");
        },
      },
      TURNSTILE_SECRET_KEY: options.secret || "unit-credential",
      TURNSTILE_HOSTNAME: options.hostname || new URL(host).hostname,
    },
  });
}
test("normalizes email, website and whitespace and accepts optional blank fields", () => {
  assert.deepEqual(validate(input).errors, {});
  assert.equal(validate(input).data.email, "office@example.invalid");
  assert.equal(validate(input).data.website, "https://example.invalid/");
  assert.deepEqual(validate({ ...input, website: "" }).errors, {});
});
test("validates required, optional, type, length and consent fields", () => {
  for (const k of [
    "fullName",
    "businessName",
    "email",
    "industry",
    "challenge",
    "details",
    "consent",
  ])
    assert.ok(validate({ ...input, [k]: "" }).errors[k]);
  for (const k of Object.keys(limits))
    assert.ok(validate({ ...input, [k]: "x".repeat(limits[k] + 1) }).errors[k]);
  for (const [k, v] of [
    ["website", "file:///local"],
    ["phone", "hello"],
    ["consent", "true"],
    ["industry", false],
    ["challenge", "Unlisted"],
    ["email", "someone@"],
  ])
    assert.ok(validate({ ...input, [k]: v }).errors[k]);
});
test("rejects unsupported requests and malformed or oversized bodies before verification", async () => {
  for (const [options, code] of [
    [{ method: "GET" }, 405],
    [{ from: "https://other.example.invalid" }, 403],
    [{ type: "text/plain" }, 415],
    [{ raw: "null" }, 400],
    [{ raw: "{" }, 400],
    [{ raw: " ".repeat(25000) }, 413],
    [{ body: { ...valid, companyFax: "filled" } }, 400],
    [{ body: { ...valid, consent: false } }, 422],
    [{ body: { ...valid, token: "" } }, 422],
    [{ body: { ...valid, id: "invalid" } }, 400],
  ])
    assert.equal((await endpoint(options)).status, code);
});
test("requires an exact configured host and excludes public test credentials from hosted use", async () => {
  assert.equal(
    (await endpoint({ hostname: "unconfigured.example.invalid" })).status,
    503,
  );
  assert.equal(
    (await endpoint({ secret: "1x0000000000000000000000000000000AA" })).status,
    503,
  );
});
test("verification refusals, mismatched action/host and upstream outages all fail closed", async (t) => {
  let reply;
  t.mock.method(globalThis, "fetch", async () => reply);
  for (const result of [
    { success: false },
    { success: true, action: "other", hostname: "assessment.example.invalid" },
    { success: true, action: "assessment", hostname: "other.example.invalid" },
  ]) {
    reply = Response.json(result);
    assert.equal((await endpoint()).status, 422);
  }
  reply = new Response(null, { status: 503 });
  assert.equal((await endpoint()).status, 503);
});
test("database failure never produces a receipt", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      success: true,
      hostname: "assessment.example.invalid",
      action: "assessment",
    }),
  );
  const response = await endpoint();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).saved, undefined);
});
