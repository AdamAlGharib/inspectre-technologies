"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, FormEvent, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import {
  capabilities,
  contactEmail,
  engagements,
  linkedIn,
  needs,
  practice,
  projects,
  publicName,
  timelines,
  type Project,
  type ProjectId,
} from "./content";
import { HeroScene, practiceScenes, projectScenes } from "./scenes";

/* --------------------------------------------------------------------------
   Small stores: theme and the Toronto clock live outside React state so the
   server render stays deterministic and hydration never mismatches.
   -------------------------------------------------------------------------- */

type Theme = "light" | "dark";
type Motion = "on" | "off";

/**
 * A visitor preference held on <html data-*> (set before first paint by the boot script in app/page.tsx),
 * mirrored to localStorage, and optionally forced by a query parameter.
 */
function createPreference<T extends string>(key: string, values: readonly T[], fallback: T, param?: string) {
  const event = `${key}-change`;
  const dataKey = key.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase());
  const valid = (value: unknown): value is T => values.includes(value as T);

  return {
    read(): T {
      const live = document.documentElement.dataset[dataKey];
      if (valid(live)) return live;
      if (param) {
        const asked = new URLSearchParams(window.location.search).get(param);
        if (valid(asked)) return asked;
      }
      try {
        const stored = window.localStorage.getItem(key);
        return valid(stored) ? stored : fallback;
      } catch {
        return fallback;
      }
    },
    readOnServer: () => fallback,
    subscribe(notify: () => void) {
      // another tab changed the preference: adopt it here too, since read() trusts the html attribute first
      const onStorage = (storage: StorageEvent) => {
        if (storage.key !== key || !valid(storage.newValue)) return;
        document.documentElement.dataset[dataKey] = storage.newValue;
        notify();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(event, notify);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(event, notify);
      };
    },
    write(next: T) {
      document.documentElement.dataset[dataKey] = next;
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // private mode: the choice still holds for this page view
      }
      window.dispatchEvent(new Event(event));
    },
  };
}

const themePreference = createPreference<Theme>("inspectre-theme", ["light", "dark"], "light", "theme");
const motionPreference = createPreference<Motion>("inspectre-motion", ["on", "off"], "on");

const torontoTime = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function subscribeClock(notify: () => void) {
  let interval = 0;
  const untilNextMinute = 60_000 - (Date.now() % 60_000) + 50;
  const timeout = window.setTimeout(() => {
    notify();
    interval = window.setInterval(notify, 60_000);
  }, untilNextMinute);
  return () => {
    window.clearTimeout(timeout);
    window.clearInterval(interval);
  };
}

const readClock = () => torontoTime.format(new Date());
const readClockOnServer = () => "--:--";

/** Studio local time. Its own component so a tick re-renders two characters, not the page. */
function TorontoClock() {
  const clock = useSyncExternalStore(subscribeClock, readClock, readClockOnServer);
  return <time>{clock}</time>;
}

/* --------------------------------------------------------------------------
   Atoms
   -------------------------------------------------------------------------- */

function Mark() {
  return (
    <span className="hm-mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <b>I</b>
    </span>
  );
}

function Chevron() {
  return (
    <svg className="hm-chev" viewBox="0 0 8 12" width="8" height="12" aria-hidden="true">
      <path d="M1.5 1.5 6 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

type ButtonProps = { href: string; children: ReactNode; variant?: "solid" | "line" | "acid"; onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void };

function ButtonLink({ href, children, variant = "line", onClick }: ButtonProps) {
  return (
    <a className={`hm-btn hm-btn--${variant}`} href={href} onClick={onClick}>
      <span>{children}</span>
      <Chevron />
    </a>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
      <span className="hm-sr"> (opens in a new tab)</span>
    </a>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="hm-tag">{children}</span>;
}

function Odometer({ value, label }: { value: number; label: string }) {
  const digits = String(value).padStart(2, "0").split("");
  return (
    <p className="hm-odo">
      <span className="hm-odo-digits" aria-hidden="true">
        {digits.map((digit, place) => (
          <span className="hm-odo-col" key={place} style={{ "--d": digit, "--i": place } as CSSProperties}>
            <span>
              {Array.from({ length: 10 }, (_, n) => (
                <b key={n}>{n}</b>
              ))}
            </span>
          </span>
        ))}
      </span>
      <span className="hm-sr">{value} </span>
      <span className="hm-odo-label">{label}</span>
    </p>
  );
}

const glyphs: Record<ProjectId, ReactNode> = {
  provision: <path d="M2 6V2h4M14 2h4v4M18 14v4h-4M6 18H2v-4M7 7h6v6H7z" />,
  pbx: <path d="M3 18V10M10 18V3M17 18v-6M1 18h18" />,
  radar: <path d="M10 10 17 5M10 2a8 8 0 1 0 8 8M10 6a4 4 0 1 0 4 4" />,
  hitl: <path d="M10 2a8 8 0 1 1-7.4 5M10 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM1 3l2 4 4-1" />,
  voice: <path d="M2 9v2M6 6v8M10 2v16M14 6v8M18 9v2" />,
  hive: <path d="M10 1.5 17.5 5.75v8.5L10 18.5 2.5 14.25v-8.5zM10 7l2.6 1.5v3L10 13l-2.6-1.5v-3z" />,
  summit: <path d="M1 18 8 5l4 7 2-3 5 9zM8 5V1" />,
};

function Glyph({ id }: { id: ProjectId }) {
  return (
    <svg className="hm-glyph" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {glyphs[id]}
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Page
   -------------------------------------------------------------------------- */

export function HomeExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const pressedBackdrop = useRef(false);
  const theme = useSyncExternalStore(themePreference.subscribe, themePreference.read, themePreference.readOnServer);
  const motion = useSyncExternalStore(motionPreference.subscribe, motionPreference.read, motionPreference.readOnServer);
  const [dossier, setDossier] = useState<Project>(projects[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  // The mobile menu behaves like a disclosure: focus moves in, Escape closes it and hands focus back.
  useEffect(() => {
    if (!menuOpen) return;
    document.getElementById("hm-nav")?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      burgerRef.current?.focus();
    };
    const onResize = () => {
      if (window.innerWidth > 980) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  // Reveal-on-scroll and the header's scrolled state. Elements already in view are
  // marked before the root is armed, so nothing above the fold flickers.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
    } else {
      targets.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("is-in");
      });
    }
    root.classList.add("is-armed");

    const observer = reduce || !("IntersectionObserver" in window)
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-in");
              observer?.unobserve(entry.target);
            });
          },
          // the huge top margin makes anything already scrolled past count as seen, so an End-key
          // or anchor jump never leaves a skipped section invisible
          { rootMargin: "100000px 0px -8% 0px", threshold: 0 },
        );
    targets.forEach((el) => observer?.observe(el));

    // Illustrations only animate while they are on screen.
    const scenes = Array.from(root.querySelectorAll<SVGSVGElement>("svg.iso"));
    const stage = "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const scene = entry.target as SVGSVGElement;
              scene.classList.toggle("is-live", entry.isIntersecting);
              if (entry.isIntersecting) scene.unpauseAnimations?.();
              else scene.pauseAnimations?.();
            });
          },
          { rootMargin: "120px 0px" },
        )
      : null;
    scenes.forEach((scene) => (stage ? stage.observe(scene) : scene.classList.add("is-live")));

    return () => {
      observer?.disconnect();
      stage?.disconnect();
    };
  }, []);

  const openDossier = (project: Project) => {
    setDossier(project);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };

  const closeDossier = () => dialogRef.current?.close();

  return (
    <div className="home" data-theme={theme} data-motion={motion} ref={rootRef}>
      <a className="hm-skip" href="#main">Skip to content</a>

      <aside aria-label="Announcement">
        <a className="hm-announce" href="#contact">
          <span>Engagements are by introduction or application.</span>
          <b>
            Enquire <Chevron />
          </b>
        </a>
      </aside>

      <header
        className="hm-header"
        onBlur={(event) => {
          if (menuOpen && !event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
        }}
      >
        <div className="hm-header-inner">
          <a className="hm-brand" href="/" aria-label="Inspectre Technologies home">
            <Mark />
            <span>inspectre</span>
          </a>
          <nav className={`hm-nav${menuOpen ? " is-open" : ""}`} id="hm-nav" aria-label="Primary">
            <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
            <a href="#practice" onClick={() => setMenuOpen(false)}>Practice</a>
            <a href="#capabilities" onClick={() => setMenuOpen(false)}>Capabilities</a>
            <a href="#engage" onClick={() => setMenuOpen(false)}>Engagements</a>
            <a href="#rules" onClick={() => setMenuOpen(false)}>Rules</a>
          </nav>
          <div className="hm-header-side">
            <span className="hm-clock" title="Local time at the studio">
              TOR <TorontoClock />
            </span>
            <button
              className="hm-theme"
              type="button"
              onClick={() => themePreference.write(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              <span aria-hidden="true" />
            </button>
            <button
              className="hm-motion"
              type="button"
              aria-pressed={motion === "off"}
              aria-label="Pause motion"
              onClick={() => motionPreference.write(motion === "off" ? "on" : "off")}
            >
              <span aria-hidden="true" />
            </button>
            <ButtonLink href="#contact" variant="solid">Enquire</ButtonLink>
            <button
              className="hm-burger"
              type="button"
              ref={burgerRef}
              aria-expanded={menuOpen}
              aria-controls="hm-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------- hero */}
        <section className="hm-hero" aria-labelledby="hm-title">
          <div className="hm-frame hm-hero-grid">
            <div className="hm-hero-copy">
              <p className="hm-hero-eyebrow hm-row">
                <Tag>Inspectre Technologies</Tag>
                <span>Independent studio · Toronto</span>
              </p>
              <h1 className="hm-row" id="hm-title">
                <span className="hm-line"><span>We find the signal.</span></span>
                <span className="hm-line"><span>Then we <em>build it.</em></span></span>
              </h1>
              <p className="hm-lede hm-row">
                A small, senior studio for AI systems, data infrastructure and the products around them.
                We build software that knows when to act, and when to ask.
              </p>
              <div className="hm-actions hm-row">
                <ButtonLink href="#contact" variant="solid">Request an engagement</ButtonLink>
                <ButtonLink href="#work">See the work</ButtonLink>
              </div>
            </div>
            <div className="hm-hero-art">
              <HeroScene />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- index wall */}
        <section className="hm-wall" aria-label="Project index">
          <div className="hm-frame">
            <ul className="hm-wall-grid">
              {projects.map((project) => (
                <li key={project.id}>
                  <a href={`#${project.id}`}>
                    <small>N° {project.index}</small>
                    <span className="hm-wordmark">
                      <Glyph id={project.id} />
                      {publicName(project)}
                    </span>
                    <Chevron />
                  </a>
                </li>
              ))}
              <li className="hm-wall-next">
                <a href="#contact">
                  <small>N° 08</small>
                  <span className="hm-wordmark">Yours?</span>
                  <Chevron />
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------------------- work */}
        <section className="hm-section" id="work" aria-labelledby="hm-work-title">
          <div className="hm-frame">
            <header className="hm-head hm-head--center" data-reveal>
              <Tag>Work</Tag>
              <h2 id="hm-work-title">
                Seven pieces of work.{" "}
                <br />
                Each says what is ours.
              </h2>
              <p>
                Some are ours. Some belong to clients and partners, and we say which part we built.
                Every figure below was counted from the repository, not the pitch.
              </p>
            </header>

            <div className="hm-work">
              {projects.map((project, position) => {
                const Scene = projectScenes[project.id];
                const featured = position === 0;
                return (
                  <article
                    className={`hm-card${featured ? " hm-card--feature" : ""}`}
                    id={project.id}
                    key={project.id}
                    data-reveal
                    style={{ "--stagger": featured ? 0 : (position - 1) % 3 } as CSSProperties}
                  >
                    <div className="hm-card-copy">
                      <p className="hm-card-meta">
                        <span>N° {project.index}</span>
                        <span className="hm-status">{project.status}</span>
                        {project.statusNote ? <span>{project.statusNote}</span> : null}
                      </p>
                      <h3>{publicName(project)}</h3>
                      <p className="hm-card-line"><span>{project.line}</span></p>
                      <p className="hm-card-summary">{featured ? project.summary : project.short}</p>
                      {featured ? (
                        <dl className="hm-facts">
                          {project.facts.map((fact) => (
                            <div key={fact.label}>
                              <dt>{fact.value}</dt>
                              <dd>{fact.label}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                      <dl className="hm-card-rel">
                        <div>
                          <dt>{project.relationship}</dt>
                          <dd>{project.disciplines.join(" · ")}</dd>
                        </div>
                        <div>
                          <dt>Our part</dt>
                          <dd>{project.role}</dd>
                        </div>
                      </dl>
                      <button className="hm-btn hm-btn--line" type="button" aria-haspopup="dialog" onClick={() => openDossier(project)}>
                        <span>
                          Open dossier<span className="hm-sr">: {publicName(project)}</span>
                        </span>
                        <Chevron />
                      </button>
                    </div>
                    {/* the card copy already says what the picture shows */}
                    <div className="hm-card-art" aria-hidden="true">
                      <Scene />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- practice */}
        <section className="hm-section" id="practice" aria-labelledby="hm-practice-title">
          <div className="hm-frame">
            <header className="hm-head hm-head--cols" data-reveal>
              <div>
                <Tag>Practice</Tag>
                <h2 id="hm-practice-title">
                  The signal takes{" "}
                  <br />
                  more than code.
                </h2>
              </div>
              <p>Research, design and engineering run as one practice, by the same people, from the first question to the release gate.</p>
            </header>

            <div className="hm-practice">
              {practice.map((step, position) => {
                const Scene = practiceScenes[step.scene];
                const from = projects.find((project) => project.id === step.source);
                return (
                  <article className="hm-step" key={step.index} data-reveal style={{ "--stagger": position } as CSSProperties}>
                    <div className="hm-step-art" aria-hidden="true">
                      <Scene />
                    </div>
                    <h3>
                      <small>{step.index}</small> {step.title}
                    </h3>
                    <p>{step.copy}</p>
                    <Odometer value={step.count} label={step.countLabel} />
                    {from ? (
                      <a className="hm-odo-src" href={`#${from.id}`}>
                        <span>From</span> {publicName(from)}
                      </a>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- capabilities */}
        <section className="hm-section hm-section--tint" id="capabilities" aria-labelledby="hm-cap-title">
          <div className="hm-frame">
            <header className="hm-head hm-head--center" data-reveal>
              <Tag>Capabilities</Tag>
              <h2 id="hm-cap-title">
                The hard parts,{" "}
                <br />
                done before.
              </h2>
              <p>The same few problems keep turning up under different names. These are the ones we have already built, or worked inside.</p>
            </header>

            <ul className="hm-caps" data-reveal>
              {capabilities.map((capability) => (
                <li key={capability.title}>
                  <h3>{capability.title}</h3>
                  <p>{capability.copy}</p>
                </li>
              ))}
              <li className="hm-caps-wide">
                <div>
                  <h3>Something that fits none of these</h3>
                  <p>Good. Most of the work above did not fit a category when it arrived either.</p>
                </div>
                <ButtonLink href="#contact">Enquire</ButtonLink>
              </li>
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------------------- engagements */}
        <section className="hm-section" id="engage" aria-labelledby="hm-engage-title">
          <div className="hm-frame">
            <header className="hm-head hm-head--split" data-reveal>
              <div>
                <Tag>Engagements</Tag>
                <h2 id="hm-engage-title">
                  Three ways in.{" "}
                  <br />
                  One small team.
                </h2>
                <p>We take a few engagements at a time so the people you meet are the people who build.</p>
              </div>
              <ButtonLink href="#contact" variant="solid">Request an engagement</ButtonLink>
            </header>

            <div className="hm-engage">
              {engagements.map((engagement, position) => (
                <article key={engagement.title} data-reveal style={{ "--stagger": position } as CSSProperties}>
                  <Tag>{engagement.tag}</Tag>
                  <h3><span>{engagement.title}</span></h3>
                  <p>{engagement.copy}</p>
                  <small>
                    {engagement.examples
                      .map(({ id, suffix = "" }) => {
                        const example = projects.find((project) => project.id === id);
                        return example ? `${publicName(example)}${suffix}` : "";
                      })
                      .filter(Boolean)
                      .join(" · ")}
                  </small>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- rules */}
        <section className="hm-section" id="rules" aria-labelledby="hm-rules-title">
          <div className="hm-frame">
            <header className="hm-head hm-head--split" data-reveal>
              <div>
                <Tag>Rules</Tag>
                <h2 id="hm-rules-title">Rules we ship by.</h2>
                <p>No testimonials here. These are the constraints we build to, and each one comes from the system named beneath it.</p>
              </div>
            </header>

            <ol className="hm-rules">
              {projects.map((project, position) => (
                <li key={project.id} data-reveal style={{ "--stagger": position % 4 } as CSSProperties}>
                  <blockquote>{project.rule}</blockquote>
                  <p>
                    <span>From</span>
                    <a href={`#${project.id}`}>{publicName(project)}</a>
                  </p>
                </li>
              ))}
              <li className="hm-rules-last" data-reveal style={{ "--stagger": 3 } as CSSProperties}>
                <blockquote>Know when to act. Know when to ask.</blockquote>
                <p>
                  <span>Applies to</span>
                  <a href="#contact">Everything we take on</a>
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ---------------------------------------------------------------- contact */}
        <section className="hm-contact" id="contact" aria-labelledby="hm-contact-title">
          <div className="hm-frame hm-contact-grid">
            <div className="hm-contact-copy" data-reveal>
              <Tag>Contact</Tag>
              <h2 id="hm-contact-title">
                Bring us the{" "}
                <br />
                <em>unclear part.</em>
              </h2>
              <p>
                We work with a small number of teams at a time. Tell us what you are building and where it is stuck.
                Every note is read by a founder, and you will get a straight answer about whether we are the right people.
              </p>
              <p className="hm-live">
                <i aria-hidden="true" />
                Reviewing new engagements
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------ footer */}
      <footer className="hm-footer">
        <div className="hm-frame">
          <div className="hm-footer-grid">
            <div className="hm-footer-brand">
              <a className="hm-brand" href="/" aria-label="Inspectre Technologies home">
                <Mark />
                <span>inspectre</span>
              </a>
              <p>We find the signal. Then we build it.</p>
            </div>
            <nav className="hm-footer-nav" aria-label="Footer">
              <div>
                <p className="hm-footer-title">Work</p>
                {projects.map((project) => (
                  <a href={`#${project.id}`} key={project.id}>{publicName(project)}</a>
                ))}
              </div>
              <div>
                <p className="hm-footer-title">Studio</p>
                <a href="#practice">Practice</a>
                <a href="#capabilities">Capabilities</a>
                <a href="#engage">Engagements</a>
                <a href="#rules">Rules</a>
                <a href="#contact">Contact</a>
              </div>
              <div>
                <p className="hm-footer-title">Elsewhere</p>
                <ExternalLink href={linkedIn}>LinkedIn</ExternalLink>
                <a href={`mailto:${contactEmail}`}>Email</a>
              </div>
            </nav>
          </div>

          <div className="hm-footer-base">
            <p>
              Toronto <TorontoClock />
            </p>
            <p>43.6532° N · 79.3832° W</p>
            <p>© 2026 Inspectre Technologies Inc.</p>
          </div>
        </div>
        <p className="hm-footer-word" aria-hidden="true">inspectre</p>
      </footer>

      {/* ------------------------------------------------------------------ dossier */}
      {/* Esc and the close button are the keyboard paths; the click handler only adds click-outside. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        className="hm-dossier"
        ref={dialogRef}
        aria-labelledby="hm-dossier-title"
        onMouseDown={(event) => {
          pressedBackdrop.current = event.target === dialogRef.current;
        }}
        onClick={(event) => {
          // a text selection that starts in the sheet and ends on the backdrop is not a dismissal
          if (pressedBackdrop.current && event.target === dialogRef.current) closeDossier();
        }}
      >
        <div className="hm-dossier-sheet">
          <header>
            <p className="hm-card-meta">
              <span>Dossier N° {dossier.index}</span>
              <span className="hm-status">{dossier.status}</span>
            </p>
            <button className="hm-close" type="button" onClick={closeDossier} aria-label="Close dossier">
              <span aria-hidden="true" />
            </button>
          </header>
          <h2 id="hm-dossier-title">{publicName(dossier)}</h2>
          <p className="hm-dossier-line">{dossier.line}</p>
          <p className="hm-dossier-summary">{dossier.summary}</p>

          <dl className="hm-facts">
            {dossier.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>

          <h3>How it behaves</h3>
          <ul className="hm-dossier-list">
            {dossier.behaviours.map((behaviour) => (
              <li key={behaviour}>{behaviour}</li>
            ))}
          </ul>

          <dl className="hm-dossier-table">
            <div>
              <dt>Relationship</dt>
              <dd>{dossier.relationship}</dd>
            </div>
            <div>
              <dt>Our part</dt>
              <dd>{dossier.role}</dd>
            </div>
            <div>
              <dt>Disciplines</dt>
              <dd>{dossier.disciplines.join(" · ")}</dd>
            </div>
            {dossier.stack ? (
              <div>
                <dt>Built with</dt>
                <dd>{dossier.stack.join(" · ")}</dd>
              </div>
            ) : null}
            <div>
              <dt>House rule</dt>
              <dd>{dossier.rule}</dd>
            </div>
          </dl>

          <ButtonLink href="#contact" variant="acid" onClick={closeDossier}>Ask about work like this</ButtonLink>
        </div>
      </dialog>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Contact form: composes a structured brief and hands it to the visitor's own
   mail client. Nothing is sent to a server.
   -------------------------------------------------------------------------- */

function ContactForm() {
  const formId = useId();
  const [need, setNeed] = useState<string>(needs[0]);
  const [timeline, setTimeline] = useState<string>(timelines[0]);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const [brief, setBrief] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const lines = [
      `Name: ${field("name")}`,
      `Email: ${field("email")}`,
      field("company") ? `Company: ${field("company")}` : null,
      `Looking for: ${need}`,
      `Timing: ${timeline}`,
      "",
      "The brief:",
      field("message"),
    ].filter((line): line is string => line !== null);
    const body = lines.join("\r\n");
    const subject = `Engagement request: ${field("company") || field("name")}`;
    const compose = (text: string) => `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    setBrief(body);
    setCopyState("idle");

    // Mail clients drop or truncate very long mailto links, so a long brief travels by clipboard instead.
    let url = compose(body);
    if (url.length > 1800) {
      const head = lines.slice(0, lines.indexOf("")).join("\r\n");
      url = compose(`${head}\r\n\r\n[Paste the brief here. It is on your clipboard, and shown on the page you came from.]`);
      navigator.clipboard?.writeText(body).then(() => setCopyState("copied"), () => setCopyState("failed"));
    }
    window.location.href = url;
  };

  const copyBrief = async () => {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState("copied");
    } catch {
      // no clipboard permission: select the text so it can be copied by hand
      briefRef.current?.select();
      setCopyState("failed");
    }
  };

  return (
    <form className="hm-form" onSubmit={onSubmit} data-reveal>
      <p className="hm-form-head">
        <span>Engagement request</span>
        <span>Read by a founder</span>
      </p>

      <div className="hm-field-row">
        <label className="hm-field" htmlFor={`${formId}-name`}>
          <span>Name</span>
          <input id={`${formId}-name`} name="name" type="text" autoComplete="name" required />
        </label>
        <label className="hm-field" htmlFor={`${formId}-email`}>
          <span>Work email</span>
          <input id={`${formId}-email`} name="email" type="email" autoComplete="email" required />
        </label>
      </div>

      <label className="hm-field" htmlFor={`${formId}-company`}>
        <span>Company or project <i>optional</i></span>
        <input id={`${formId}-company`} name="company" type="text" autoComplete="organization" />
      </label>

      <fieldset className="hm-chips">
        <legend>What are you looking for?</legend>
        <div>
          {needs.map((option) => (
            <label key={option}>
              <input type="radio" name="need" value={option} checked={need === option} onChange={() => setNeed(option)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="hm-chips">
        <legend>When?</legend>
        <div>
          {timelines.map((option) => (
            <label key={option}>
              <input type="radio" name="timeline" value={option} checked={timeline === option} onChange={() => setTimeline(option)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="hm-field" htmlFor={`${formId}-message`}>
        <span>The brief</span>
        <textarea id={`${formId}-message`} name="message" rows={5} required placeholder="What are you building, and where is it stuck?" />
      </label>

      <div className="hm-form-foot">
        <button className="hm-btn hm-btn--acid" type="submit">
          <span>Compose request</span>
          <Chevron />
        </button>
        <p>Opens your own mail app with the brief filled in. Nothing is stored here.</p>
      </div>

      <div className="hm-form-done">
        {brief ? (
          <>
            <p role="status">
              Your mail app should now be open with the request. If nothing happened, copy the brief below and send it to {contactEmail}.
            </p>
            <label className="hm-sr" htmlFor={`${formId}-brief`}>Your brief</label>
            <textarea id={`${formId}-brief`} ref={briefRef} readOnly rows={7} value={brief} />
            <button className="hm-btn hm-btn--ghost" type="button" onClick={copyBrief}>
              <span>Copy the brief</span>
              <Chevron />
            </button>
            <span className="hm-form-note" role="status">
              {copyState === "copied" ? "Copied." : copyState === "failed" ? "Copy was blocked. The text is selected: copy it by hand." : ""}
            </span>
          </>
        ) : null}
      </div>
    </form>
  );
}
