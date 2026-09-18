"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Brand, DirectionLinks } from "../components/Brand";

const projects = [
  {
    name: "PBX",
    kind: "MARKET / PROTOCOL",
    headline: "City air-quality markets, read through one cockpit.",
    copy: "A client's PM2.5 market platform on Solana. We rebuilt its custody dashboard as a single-page trader cockpit and reviewed the trading engine read-only.",
    proof: "Client platform · shipped",
    href: null,
    position: "one",
  },
  {
    name: "Provision OS",
    kind: "AI / RELEASE QUALITY",
    headline: "A release gate that can actually see.",
    copy: "A deterministic visual QA system for AI-built software: capture the rendered result, explain measurable failures, create bounded repair instructions, then verify the delta.",
    proof: "Private alpha",
    href: null,
    position: "two",
  },
  {
    name: "Idea Radar",
    kind: "EVIDENCE / DATA",
    headline: "Public signals in. Traceable evidence out.",
    copy: "A provenance-first evidence layer that preserves source history, rights, updates, and deletions across fragmented public information.",
    proof: "23 implemented source adapters",
    href: null,
    position: "three",
  },
  {
    name: "Human In The Loop",
    kind: "COMMUNITY / MEDIA",
    headline: "Make the private AI conversation matter.",
    copy: "A Toronto enterprise-AI community and media venture built around candid operator rooms, useful editorial judgment, and what the room actually learns.",
    proof: "Venture in development",
    href: null,
    position: "four",
  },
] as const;

const phases = [
  ["01", "Observe", "Collect the evidence, map the constraints, and find the part that changes the decision."],
  ["02", "Frame", "Turn a broad possibility into a clear product wedge and a system people can reason about."],
  ["03", "Build", "Design and engineer the decisive slice, close to real data, real users, and the difficult edges."],
  ["04", "Prove", "Test what matters: behavior, quality, trust, operations, and whether the thing earns its place."],
] as const;

function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = true;
    let running = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000 };
    const points = Array.from({ length: 58 }, (_, index) => ({
      x: ((index * 83) % 997) / 997,
      y: ((index * 197) % 991) / 991,
      speed: 0.00003 + (index % 7) * 0.000008,
      offset: index * 0.81,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const mapped = points.map((point) => ({
        x: point.x * width + Math.sin(time * point.speed + point.offset) * 9,
        y: point.y * height + Math.cos(time * point.speed * 0.72 + point.offset) * 7,
      }));

      context.lineWidth = 0.7;
      for (let a = 0; a < mapped.length; a += 1) {
        const point = mapped[a];
        const pointerDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
        for (let b = a + 1; b < mapped.length; b += 1) {
          const other = mapped[b];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 105) {
            context.strokeStyle = `rgba(223,255,0,${0.12 * (1 - distance / 105)})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
        context.fillStyle = pointerDistance < 165 ? "rgba(223,255,0,.9)" : "rgba(241,239,231,.28)";
        context.beginPath();
        context.arc(point.x, point.y, pointerDistance < 165 ? 2.2 : 1.1, 0, Math.PI * 2);
        context.fill();
      }

      const gradient = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 170);
      gradient.addColorStop(0, "rgba(223,255,0,.08)");
      gradient.addColorStop(1, "rgba(223,255,0,0)");
      context.fillStyle = gradient;
      context.fillRect(pointer.x - 170, pointer.y - 170, 340, 340);

      if (running && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const pointerMove = (event: globalThis.PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const pointerLeave = () => { pointer.x = -1000; pointer.y = -1000; };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    });
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChange = () => {
      running = !motion.matches;
      cancelAnimationFrame(frame);
      draw();
    };

    resize();
    observer.observe(canvas);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerleave", pointerLeave);
    window.addEventListener("resize", resize);
    motion.addEventListener("change", motionChange);
    draw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", motionChange);
    };
  }, []);

  return <canvas className="signal-canvas" ref={canvasRef} aria-hidden="true" />;
}

export function SignalExperience() {
  const [active, setActive] = useState(0);

  function moveLens(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--signal-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--signal-y", `${event.clientY - rect.top}px`);
  }

  return (
    <main className="signal-page" onPointerMove={moveLens}>
      <header className="signal-nav">
        <Brand />
        <span>Signal Field / Direction 01</span>
        <DirectionLinks current="signal" />
      </header>

      <section className="signal-hero" aria-labelledby="signal-title">
        <SignalCanvas />
        <div className="signal-coordinate signal-coordinate--x" aria-hidden="true">X / 0043.711</div>
        <div className="signal-coordinate signal-coordinate--y" aria-hidden="true">Y / 0079.383</div>
        <p className="signal-kicker">INDEPENDENT PRODUCT STUDIO / TRUST DESIGNED IN</p>
        <h1 id="signal-title">
          Find what
          <span>matters.</span>
          <br />
          Build what <em>lasts.</em>
        </h1>
        <div className="signal-hero-foot">
          <p>
            Inspectre turns ambiguous ideas into clear product systems—strategy,
            identity, interface, infrastructure, and the working software beneath it.
          </p>
          <a href="#field">Enter the field <i aria-hidden="true">↓</i></a>
        </div>
        <div className="signal-scan" aria-hidden="true" />
      </section>

      <section className="signal-thesis" aria-labelledby="signal-thesis-title">
        <p>THE OPERATING THESIS</p>
        <h2 id="signal-thesis-title">
          Most teams do not need
          <br />
          <span>more ideas.</span> They need the
          <br />
          consequential one made real.
        </h2>
        <div className="signal-thesis-note">
          <span>01—04</span>
          <p>
            We move between research, design, and engineering because the
            difficult decisions rarely respect those boundaries.
          </p>
        </div>
      </section>

      <section className="signal-field" id="field" aria-labelledby="field-title">
        <div className="signal-field-heading">
          <p>SELECTED SYSTEMS / CLICK A SIGNAL</p>
          <h2 id="field-title">A portfolio<br />as a live field.</h2>
        </div>
        <div className="signal-map">
          <SignalCanvas />
          <div className="signal-reticle" aria-hidden="true"><i /><i /></div>
          {projects.map((project, index) => (
            <button
              className={`signal-node signal-node--${project.position} ${active === index ? "is-active" : ""}`}
              key={project.name}
              onClick={() => setActive(index)}
              aria-pressed={active === index}
            >
              <i aria-hidden="true" />
              <span>0{index + 1}</span>
              <strong>{project.name}</strong>
              <small>{project.kind}</small>
            </button>
          ))}
          <article className="signal-dossier" aria-live="polite">
            <header>
              <span>ACTIVE SIGNAL / 0{active + 1}</span>
              <i aria-hidden="true">● LIVE</i>
            </header>
            <h3>{projects[active].headline}</h3>
            <p>{projects[active].copy}</p>
            <footer>
              <span>{projects[active].proof}</span>
              {projects[active].href && (
                <a href={projects[active].href} target="_blank" rel="noreferrer">Open public evidence ↗</a>
              )}
            </footer>
          </article>
        </div>
      </section>

      <section className="signal-process" aria-labelledby="process-title">
        <div className="signal-process-title">
          <p>HOW THE SIGNAL BECOMES A SYSTEM</p>
          <h2 id="process-title">Four moves.<br /><em>One close team.</em></h2>
        </div>
        <div className="signal-phases">
          {phases.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <i aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="signal-trust" aria-labelledby="trust-title">
        <div className="signal-trust-grid" aria-hidden="true">
          {Array.from({ length: 35 }, (_, index) => <i key={index} />)}
        </div>
        <p>THE THREAD THROUGH THE WORK</p>
        <h2 id="trust-title">Systems that know<br />when to act—<br /><em>and when to ask.</em></h2>
        <div className="signal-trust-copy">
          <p>
            Provenance instead of vague authority. Human gates instead of hidden
            automation. Verifiable constraints instead of promises. Quality that
            can be shown, not merely claimed.
          </p>
          <span>Evidence / Judgment / Constraint / Proof</span>
        </div>
      </section>

      <section className="signal-contact" id="contact">
        <p>HAVE A SIGNAL WORTH FOLLOWING?</p>
        <h2>Show us the<br /><span>strange part.</span></h2>
        <a href="https://www.linkedin.com/in/adam-al-gharib/" target="_blank" rel="noreferrer">
          <span>Start a conversation</span>
          <i aria-hidden="true">↗</i>
        </a>
        <footer>
          <Brand />
          <span>Adam Al Gharib × Sushant Desai</span>
          <a href="#signal-title">Back to signal ↑</a>
        </footer>
      </section>
    </main>
  );
}
