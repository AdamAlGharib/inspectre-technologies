import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

const routes = [
  ["/", "We find the signal"],
  ["/signal", "Signal Field"],
  ["/index", "Ideas are"],
  ["/human", "Technology is"],
];

function metaTag(attribute, value, content) {
  const escaped = content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<meta(?=[^>]*${attribute}=["']${value}["'])(?=[^>]*content=["']${escaped}["'])[^>]*>`, "i");
}

for (const [pathname, phrase] of routes) {
  test(`server-renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, new RegExp(phrase, "i"));
    assert.match(html, /Inspectre/i);
    assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  });
}

test("home lists every project and a contact form", async () => {
  const response = await render("/");
  const html = await response.text();
  for (const name of ["Provision OS", "PBX", "Idea Radar", "Human In The Loop", "Voice Front Door", "The Hive", "Summit Rush"]) {
    assert.match(html, new RegExp(name));
  }
  assert.match(html, /id="contact"/);
  assert.match(html, /<form[^>]*class="hm-form"/);
  assert.match(html, /name="email"/);
});

test("root emits an absolute, site-specific social card", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, metaTag("property", "og:image", "http://localhost:3000/og.png"));
  assert.match(html, metaTag("name", "twitter:image", "http://localhost:3000/og.png"));
  assert.match(html, metaTag("property", "og:title", "Inspectre Technologies — We find the signal, then build it."));
});

const detailMetadata = [
  ["/signal", "Inspectre — Signal Field", "Inspectre Technologies finds the consequential signal, designs the system, and builds the working product."],
  ["/index", "Inspectre — Open Index", "Inspectre is an independent product studio turning ambiguous ideas into clear, working systems."],
  ["/human", "Inspectre — Human System", "Inspectre Technologies builds thoughtful software and decision systems with trust designed in."],
];

for (const [pathname, title, description] of detailMetadata) {
  test(`${pathname} overrides social metadata without inheriting the root image`, async () => {
    const response = await render(pathname);
    const html = await response.text();
    assert.match(html, new RegExp(`<title>${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/title>`, "i"));
    assert.match(html, metaTag("property", "og:title", title));
    assert.match(html, metaTag("property", "og:description", description));
    assert.match(html, metaTag("name", "twitter:title", title));
    assert.match(html, metaTag("name", "twitter:description", description));
    assert.doesNotMatch(html, /og\.png/i);
  });
}
