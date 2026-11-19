import { readFile, writeFile } from "node:fs/promises";
import { loadEnv } from "vite";
import { render, pages, missingPage } from "../.build/server/entry-server.js";

const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
const origin = env.SITE_URL?.trim() || "";
if (
  origin &&
  (!/^https:\/\//.test(origin) || new URL(origin).origin !== origin)
)
  throw new Error(
    "SITE_URL must be the final HTTPS origin with no trailing slash.",
  );
if (
  origin &&
  (!env.VITE_TURNSTILE_SITE_KEY ||
    /^[123]x0{12,}/.test(env.VITE_TURNSTILE_SITE_KEY))
)
  throw new Error(
    "Set the real public Turnstile site key for a release build.",
  );
const esc = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const template = await readFile("dist/index.html", "utf8");
for (const [path, meta] of Object.entries({ ...pages, "/404": missingPage })) {
  const indexable = Boolean(origin) && path !== "/404";
  const tags = [
    "<title>" + esc(meta.title) + "</title>",
    '<meta name="description" content="' + esc(meta.description) + '">',
    '<meta name="robots" content="' +
      (indexable ? "index, follow" : "noindex, nofollow") +
      '">',
    '<meta property="og:type" content="website"><meta property="og:site_name" content="Berveuda AI">',
    '<meta property="og:title" content="' +
      esc(meta.title) +
      '"><meta property="og:description" content="' +
      esc(meta.description) +
      '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta property="og:image" content="' +
      esc(origin) +
      '/images/social.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="Berveuda AI industrial workflow automation and a blue boiler in a plant room.">',
  ];
  if (indexable)
    tags.push(
      '<link rel="canonical" href="' +
        esc(origin + path) +
        '"><meta property="og:url" content="' +
        esc(origin + path) +
        '">',
    );
  if (path === "/")
    tags.push(
      '<script type="application/ld+json">' +
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Berveuda AI",
          parentOrganization: { "@type": "Organization", name: "Berveuda" },
          description: meta.description,
          ...(origin
            ? { url: origin + "/", logo: origin + "/symbol.svg" }
            : {}),
        }).replaceAll("<", "\\u003c") +
        "</script>",
    );
  const html = template
    .replace(/<title>.*?<\/title>/, () => tags.join("\n"))
    .replace(
      '<div id="root"></div>',
      () => '<div id="root">' + render(path) + "</div>",
    );
  await writeFile(
    "dist/" + (path === "/" ? "index" : path.slice(1)) + ".html",
    html,
  );
}
const urls = origin
  ? Object.keys(pages)
      .map((p) => "<url><loc>" + esc(origin + p) + "</loc></url>")
      .join("\n")
  : "";
await writeFile(
  "dist/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls +
    "</urlset>\n",
);
await writeFile(
  "dist/robots.txt",
  origin
    ? "User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: " +
        origin +
        "/sitemap.xml\n"
    : "User-agent: *\nDisallow: /\n",
);
console.log(
  "Prerendered eight marketing pages and 404. " +
    (origin
      ? "Canonical origin: " + origin
      : "Local/preview build, indexing disabled."),
);
