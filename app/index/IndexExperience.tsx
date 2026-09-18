"use client";

import { useState } from "react";
import { Brand, DirectionLinks } from "../components/Brand";

const projects = [
  {
    id: "PBX",
    number: "A—01",
    title: "City air-quality markets, read through one cockpit.",
    summary:
      "A client's PM2.5 market platform on Solana. We rebuilt its custody dashboard as a single-page trader cockpit and reviewed the trading engine read-only.",
    discipline: "Interface engineering · Systems review · Client platform",
    detail: "Toronto · New York · Chicago",
    visual: "air",
  },
  {
    id: "Provision OS",
    number: "A—02",
    title: "A release gate that can actually see.",
    summary:
      "A deterministic visual QA system for AI-built software: capture the rendered result, explain measurable failures, bound the repair, then verify the delta.",
    discipline: "AI infrastructure · Design QA · Developer tools",
    detail: "Private alpha",
    visual: "provision",
  },
  {
    id: "Idea Radar",
    number: "A—03",
    title: "Public signals in. Traceable evidence out.",
    summary:
      "A provenance-first collection layer that preserves source history, rights, updates, and deletions across fragmented public information.",
    discipline: "Data systems · Research infrastructure · AI",
    detail: "23 implemented adapters",
    visual: "radar",
  },
  {
    id: "Human In The Loop",
    number: "A—04",
    title: "Make the private AI conversation matter.",
    summary:
      "A Toronto community and media venture built around candid operator rooms, useful editorial judgment, and what the room actually learns.",
    discipline: "Venture design · Brand · Editorial systems",
    detail: "Toronto",
    visual: "human",
  },
] as const;

const practices = [
  ["01", "Find the wedge", "Research, product strategy, positioning, and the evidence that makes a direction worth taking."],
  ["02", "Design the system", "Brand, interface, interaction, architecture, and the rules that make the whole thing cohere."],
  ["03", "Build the real thing", "Full-stack software, AI and data infrastructure, blockchain systems, prototypes, and production releases."],
  ["04", "Stay for the hard part", "Evaluation, security, custody, release quality, operational tooling, and the unglamorous edges."],
] as const;

export function IndexExperience() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <main className="index-page">
      <header className="index-nav">
        <Brand />
        <p>Independent technology practice</p>
        <DirectionLinks current="index" />
      </header>

      <section className="index-hero" aria-labelledby="index-title">
        <div className="index-issue">
          <span>INDEX / 2026</span>
          <span>SMALL CORE ↔ WIDE APERTURE</span>
        </div>
        <h1 id="index-title">
          <span>Ideas are</span>
          <span>easy.</span>
          <span className="index-blue">Clarity</span>
          <span>is the work.</span>
        </h1>
        <div className="index-hero-note">
          <i aria-hidden="true">*</i>
          <p>
            Inspectre is the two-person core of a flexible studio. We turn
            uncertain product ideas into identities, interfaces, infrastructure,
            and working software.
          </p>
        </div>
        <a className="index-scroll" href="#work">Open the index ↓</a>
      </section>

      <div className="index-ticker" aria-hidden="true">
        <div>
          RESEARCH × DESIGN × ENGINEERING × AI SYSTEMS × BLOCKCHAIN × VENTURE BUILDING ×
          RESEARCH × DESIGN × ENGINEERING × AI SYSTEMS × BLOCKCHAIN × VENTURE BUILDING ×
        </div>
      </div>

      <section className="index-work" id="work" aria-labelledby="work-title">
        <div className="index-section-label">
          <span>01 / SELECTED SYSTEMS</span>
          <h2 id="work-title">The work,<br />not the theatre.</h2>
        </div>

        <div className="index-ledger">
          <div className={`index-specimen index-specimen--${project.visual}`} aria-live="polite">
            <div className="specimen-grid" aria-hidden="true">
              {Array.from({ length: 24 }, (_, i) => <i key={i} />)}
            </div>
            <span className="specimen-code">{project.number}</span>
            <strong>{project.id}</strong>
            <p>{project.title}</p>
            <span className="specimen-detail">{project.detail}</span>
          </div>

          <div className="index-project-list">
            {projects.map((item, index) => (
              <button
                className={index === active ? "is-active" : ""}
                key={item.id}
                onClick={() => setActive(index)}
                onPointerEnter={() => setActive(index)}
                aria-pressed={index === active}
              >
                <span>{item.number}</span>
                <strong>{item.id}</strong>
                <small>{item.discipline}</small>
                <b aria-hidden="true">↗</b>
              </button>
            ))}
          </div>

          <article className="index-project-copy">
            <span>{project.number} / CURRENT FILE</span>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <small>{project.discipline}</small>
          </article>
        </div>
      </section>

      <section className="index-practice" aria-labelledby="practice-title">
        <div className="index-section-label index-section-label--dark">
          <span>02 / PRACTICE</span>
          <h2 id="practice-title">Small core.<br />Wide aperture.</h2>
        </div>
        <div className="practice-list">
          {practices.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="index-method" aria-labelledby="method-title">
        <p>HOW WE WORK</p>
        <h2 id="method-title">
          No black box.
          <br />
          <em>No hand-off cliff.</em>
        </h2>
        <div>
          <p>
            You work directly with the people doing the thinking and building.
            We make decisions visible, prototype the risky parts early, and leave
            behind a system your team can operate.
          </p>
          <ol>
            <li><span>01</span> Frame the real question</li>
            <li><span>02</span> Make the unknowns testable</li>
            <li><span>03</span> Build in decisive slices</li>
            <li><span>04</span> Prove it in the real environment</li>
          </ol>
        </div>
      </section>

      <footer className="index-footer" id="contact">
        <div className="index-footer-stamp" aria-hidden="true">I*</div>
        <p>Have a difficult thing worth making?</p>
        <h2>Bring us the<br /><em>unclear part.</em></h2>
        <div className="index-footer-bottom">
          <span>Inspectre Technologies Inc.</span>
          <a href="https://www.linkedin.com/in/adam-al-gharib/" target="_blank" rel="noreferrer">Start a conversation ↗</a>
          <a href="#index-title">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
