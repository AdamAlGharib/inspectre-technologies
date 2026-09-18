/**
 * Renders one home-page illustration to a PNG so it can be checked by eye.
 *
 *   npx tsx scripts/preview-scene.tsx HeroScene
 *   npx tsx scripts/preview-scene.tsx PbxScene --dark --out /tmp/pbx.png
 *
 * The scene is server-rendered to static SVG, wrapped in a bare HTML page that
 * links app/home/home.css, and captured with headless Chrome.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chrome = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const args = process.argv.slice(2);
const name = args.find((arg) => !arg.startsWith("--"));
const dark = args.includes("--dark");
const outFlag = args.indexOf("--out");
if (!name) {
  console.error("usage: npx tsx scripts/preview-scene.tsx <SceneName> [--dark] [--out file.png]");
  process.exit(1);
}

const out = path.resolve(outFlag >= 0 ? args[outFlag + 1] : path.join(root, ".preview", `${name}${dark ? "-dark" : ""}.png`));
mkdirSync(path.dirname(out), { recursive: true });

const moduleUrl = pathToFileURL(path.join(root, "app/home/scenes", `${name}.tsx`)).href;
const exported = (await import(moduleUrl)) as Record<string, ComponentType>;
const Scene = exported[name] ?? Object.values(exported).find((value) => typeof value === "function");
if (!Scene) throw new Error(`No component exported from app/home/scenes/${name}.tsx`);

const svg = renderToStaticMarkup(createElement(Scene));
const href = (file: string) => pathToFileURL(path.join(root, file)).href;
const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="stylesheet" href="${href("node_modules/@fontsource-variable/geist-mono/index.css")}" />
<link rel="stylesheet" href="${href("app/home/home.css")}" />
<style>
  html, body { margin: 0; }
  body { background: var(--bg); }
  .stage { width: 960px; padding: 40px; box-sizing: border-box; background: var(--bg); }
</style></head>
<body class="home"${dark ? ' data-theme="dark"' : ""}><div class="stage">${svg}</div></body></html>`;

const work = mkdtempSync(path.join(tmpdir(), "inspectre-scene-"));
const page = path.join(work, "scene.html");
writeFileSync(page, html);

rmSync(out, { force: true });

// Chrome writes the screenshot quickly but can linger on exit, so poll for the file and then stop it.
const browser = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--disable-background-networking",
  "--disable-component-update",
  "--force-device-scale-factor=1",
  "--virtual-time-budget=1500",
  `--user-data-dir=${path.join(work, "profile")}`,
  "--window-size=960,860",
  `--screenshot=${out}`,
  pathToFileURL(page).href,
], { stdio: "ignore" });

const deadline = Date.now() + 45_000;
let lastSize = -1;
while (Date.now() < deadline) {
  await new Promise((resolve) => setTimeout(resolve, 250));
  if (!existsSync(out)) continue;
  const { size } = statSync(out);
  if (size > 0 && size === lastSize) break;
  lastSize = size;
}
browser.kill("SIGKILL");
rmSync(work, { recursive: true, force: true });

if (!existsSync(out)) {
  console.error("Chrome did not produce a screenshot");
  process.exit(1);
}
console.log(out);
