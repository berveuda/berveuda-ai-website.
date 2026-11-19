import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync } from "node:child_process";

const routes = [
  "/",
  "/solutions",
  "/industries",
  "/how-it-works",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/missing-local-test-page",
];
const origin = "http://127.0.0.1:8788";
function query(sql: string) {
  const out = execFileSync(
    process.execPath,
    [
      "node_modules/wrangler/bin/wrangler.js",
      "d1",
      "execute",
      "berveuda-inquiries",
      "--local",
      "--config",
      "wrangler.local.jsonc",
      "--json",
      "--command",
      sql,
    ],
    { encoding: "utf8" },
  );
  return JSON.parse(out)[0].results;
}
async function fillForm(page: import("@playwright/test").Page) {
  await page.getByLabel("Full name").fill("Local QA Coordinator");
  await page.getByLabel("Business name").fill("Fictional browser QA");
  await page.getByLabel("Business email").fill("browser-qa@example.invalid");
  await page.getByLabel("Industry", { exact: true }).selectOption("Other");
  await page
    .getByLabel("Primary operational challenge")
    .selectOption("Outstanding quotes");
  await page
    .getByLabel("Additional details")
    .fill("Local automated test. Follow up on open proposals.");
  await page.getByRole("checkbox").check();
  await expect
    .poll(() => page.locator('[name="cf-turnstile-response"]').inputValue())
    .toBeTruthy();
}

test("all routes serve actual HTML, correct statuses, metadata, working internal links and anchors", async ({
  request,
}) => {
  const titles = new Set(),
    descriptions = new Set(),
    htmlByPath = new Map<string, string>();
  for (const path of routes) {
    const res = await request.get(path);
    expect(res.status()).toBe(path === routes.at(-1) ? 404 : 200);
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
    const html = await res.text();
    expect(html).toMatch(/<h1[ >]/);
    expect(html).toContain('property="og:image"');
    expect(html).toContain("noindex");
    titles.add(html.match(/<title>(.*?)<\/title>/)?.[1]);
    descriptions.add(
      html.match(/<meta name="description" content="([^"]+)"/)?.[1],
    );
    htmlByPath.set(path, html);
  }
  expect(titles.size).toBe(routes.length);
  expect(descriptions.size).toBe(routes.length);
  for (const [path, html] of htmlByPath)
    for (const match of html.matchAll(/<a[^>]* href="([^"]+)"/g)) {
      const target = new URL(match[1], origin + path);
      expect(target.origin).toBe(origin);
      const linked = htmlByPath.get(target.pathname);
      expect(linked, match[1]).toBeDefined();
      if (target.hash)
        expect(linked).toContain('id="' + target.hash.slice(1) + '"');
    }
  expect((await request.get("/images/social.jpg")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});
test("desktop workflow controls, FAQ, keyboard skip link and CTA", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(page.getByText("Give a person the final say.")).toBeVisible();
  await page.locator("summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page
    .getByRole("link", {
      name: "Request an Automation Assessment",
      exact: true,
    })
    .first()
    .click();
  await expect(page).toHaveURL(/contact$/);
  expect(errors).toEqual([]);
});
for (const width of [320, 390, 768, 1440]) {
  test("responsive pages at " + width + "px", async ({ page }) => {
    await page.setViewportSize({ width, height: 880 });
    for (const path of routes) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBeTruthy();
    }
    if (width < 901) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toBeFocused();
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page
        .getByRole("navigation", { name: "Main", exact: true })
        .getByText("Solutions")
        .click();
      await expect(page).toHaveURL(/solutions$/);
    }
  });
}
test("automated accessibility scan on marketing pages and form", async ({
  page,
}) => {
  for (const path of routes) {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations.map((v) => [v.id, v.nodes.map((n) => n.target)]),
      path,
    ).toEqual([]);
  }
});
test("a real local widget and D1 save survive a lost response and a verified retry", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Submit assessment request" }).click();
  await expect(page.getByLabel("Full name")).toBeFocused();
  await expect(
    page.getByText("Please check the highlighted fields."),
  ).toBeVisible();
  await fillForm(page);
  let savedId = "";
  await page.route(
    "**/api/inquiries",
    async (route) => {
      const saved = await route.fetch();
      expect(saved.status()).toBe(201);
      savedId = (await saved.json()).reference;
      // Simulate loss of the reply after the real Pages Function committed the row.
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.abort("failed");
    },
    { times: 1 },
  );
  await page.getByRole("button", { name: "Submit assessment request" }).click();
  await expect(
    page.getByRole("button", { name: "Submitting inquiry…" }),
  ).toBeDisabled();
  await expect(page.getByRole("alert")).toContainText("could not be confirmed");
  await expect(page.getByLabel("Business email")).toHaveValue(
    "browser-qa@example.invalid",
  );
  await expect
    .poll(() => page.locator('[name="cf-turnstile-response"]').inputValue())
    .toBeTruthy();
  const replay = page.waitForResponse(
    (r) =>
      r.url().endsWith("/api/inquiries") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Submit assessment request" }).click();
  expect((await replay).status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Your inquiry was received." }),
  ).toBeFocused();
  expect(savedId).toMatch(/^[a-f0-9-]{36}$/);
  await expect(page.locator(".reference")).toContainText(savedId);
  expect(
    query(
      "SELECT email,consent_version FROM inquiries WHERE id='" + savedId + "'",
    ),
  ).toEqual([
    {
      email: "browser-qa@example.invalid",
      consent_version: "inquiry-contact-v1",
    },
  ]);
  query(
    "DELETE FROM inquiries WHERE id='" +
      savedId +
      "' AND email='browser-qa@example.invalid'",
  );
});
test("a first-time submission shows its genuine receipt and D1 rejects a conflicting retry", async ({
  page,
  request,
}) => {
  await page.goto("/contact");
  await fillForm(page);
  const pending = page.waitForResponse(
    (r) =>
      r.url().endsWith("/api/inquiries") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Submit assessment request" }).click();
  const response = await pending;
  expect(response.status()).toBe(201);
  const { reference } = await response.json();
  expect(reference).toMatch(/^[a-f0-9-]{36}$/);
  await expect(page.locator(".reference")).toContainText(reference);
  const body = response.request().postDataJSON();
  const changed = await request.post("/api/inquiries", {
    headers: { Origin: origin },
    data: { ...body, details: "Changed after first receipt." },
  });
  expect(changed.status()).toBe(409);
  const rejected = await request.post("/api/inquiries", {
    headers: { Origin: origin },
    data: { ...body, id: crypto.randomUUID(), consent: false },
  });
  expect(rejected.status()).toBe(422);
  expect(
    query(
      "SELECT full_name,details,consent_version FROM inquiries WHERE id='" +
        reference +
        "'",
    ),
  ).toEqual([
    {
      full_name: "Local QA Coordinator",
      details: body.details,
      consent_version: "inquiry-contact-v1",
    },
  ]);
  query(
    "DELETE FROM inquiries WHERE id='" +
      reference +
      "' AND email='browser-qa@example.invalid'",
  );
});
test("widget network error allows a retry and preserves fields", async ({
  page,
}) => {
  await page.route("**/turnstile/v0/api.js*", (r) => r.abort(), { times: 1 });
  await page.goto("/contact");
  await page.getByLabel("Full name").fill("Local Tester");
  await page.getByRole("button", { name: "Retry verification" }).click();
  await expect
    .poll(() => page.locator('[name="cf-turnstile-response"]').inputValue())
    .toBeTruthy();
  await expect(page.getByLabel("Full name")).toHaveValue("Local Tester");
});
