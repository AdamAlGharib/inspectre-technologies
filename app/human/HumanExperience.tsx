"use client";

import { useMemo, useState, type PointerEvent } from "react";
import { Brand, DirectionLinks } from "../components/Brand";

const needs = [
  { key: "clarify", label: "find the wedge", line: "turn a broad idea into a sharp, evidence-backed product direction" },
  { key: "design", label: "design the system", line: "make the brand, interface, and underlying rules cohere" },
  { key: "build", label: "build the first real version", line: "move from working theory to software people can actually use" },
  { key: "harden", label: "make it trustworthy", line: "pressure-test the risky edges: evaluation, provenance, security, and operations" },
] as const;

const tensions = [
  { key: "unknown", label: "still unknown" },
  { key: "complex", label: "technically tangled" },
  { key: "sensitive", label: "high-stakes" },
  { key: "stuck", label: "stuck between teams" },
] as const;

const conversations = [
  {
    label: "The air is data. Could it become coordination?",
    name: "PBX",
    copy: "A client's PM2.5 market platform on Solana. We rebuilt its trader cockpit and reviewed the engine, read-only.",
    note: "Protocol · Product · Environmental data",
  },
  {
    label: "AI can build the page. Who decides if it is ready?",
    name: "Provision OS",
    copy: "A deterministic visual release gate that captures the result, explains measurable failures, bounds the repair, and verifies the change.",
    note: "Private alpha · AI infrastructure · Design QA",
  },
  {
    label: "What would research look like if every claim kept its history?",
    name: "Idea Radar",
    copy: "A provenance-first evidence layer for public signals, built to preserve sources, updates, rights, and deletions.",
    note: "Data systems · Research infrastructure",
  },
  {
    label: "What happens when enterprise AI leaves the sales deck?",
    name: "Human In The Loop",
    copy: "A Toronto community and media venture for candid operator rooms, careful editorial judgment, and what the room actually learns.",
    note: "Community · Brand · Editorial systems",
  },
] as const;

export function HumanExperience() {
  const [need, setNeed] = useState(0);
  const [tension, setTension] = useState(0);
  const [activeConversation, setActiveConversation] = useState(0);
  const [copied, setCopied] = useState(false);

  const opening = useMemo(
    () => `We need to ${needs[need].line}. The hard part is ${tensions[tension].label}.`,
    [need, tension],
  );

  function moveGlow(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--human-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--human-y", `${event.clientY - rect.top}px`);
  }

  async function copyOpening() {
    try {
      await navigator.clipboard.writeText(opening);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="human-page" onPointerMove={moveGlow}>
      <header className="human-nav">
        <Brand />
        <p>Technology, with people left in it.</p>
        <DirectionLinks current="human" />
      </header>

      <section className="human-hero" aria-labelledby="human-title">
        <div className="human-orbit human-orbit--one" aria-hidden="true"><i /></div>
        <div className="human-orbit human-orbit--two" aria-hidden="true"><i /></div>
        <p className="human-eyebrow">INSPECTRE TECHNOLOGIES / SMALL STUDIO, SERIOUS SYSTEMS</p>
        <h1 id="human-title">
          Technology is
          <span>never just</span>
          <em>technical.</em>
        </h1>
        <div className="human-intro">
          <p>
            The interesting work starts where strategy, taste, engineering,
            incentives, and human judgment become impossible to separate.
          </p>
          <a href="#conversation">Tell us what is tangled <span aria-hidden="true">↓</span></a>
        </div>
        <div className="human-side-note" aria-hidden="true">DESIGN TRUST IN</div>
      </section>

      <section className="human-belief" aria-labelledby="belief-title">
        <p className="human-section-tag">01 / A BELIEF</p>
        <h2 id="belief-title">
          Software makes decisions.
          <br />
          <span>Good software knows</span>
          <br />
          <em>when to ask.</em>
        </h2>
        <div className="human-belief-copy">
          <p>
            Across provenance, visual quality, market infrastructure, and
            enterprise AI, our work returns to the same question: how do we make
            the system capable without pretending the human disappeared?
          </p>
          <div className="human-principles">
            <span>Make evidence traceable</span>
            <span>Make judgment explicit</span>
            <span>Make constraints structural</span>
            <span>Make the hand-off humane</span>
          </div>
        </div>
      </section>

      <section className="human-conversations" aria-labelledby="conversations-title">
        <div className="human-conversation-head">
          <p className="human-section-tag">02 / SELECTED CONVERSATIONS</p>
          <h2 id="conversations-title">Four questions<br />we could not leave alone.</h2>
        </div>
        <div className="human-conversation-body">
          <div className="human-question-list" aria-label="Selected work">
            {conversations.map((item, index) => (
              <button
                key={item.name}
                aria-pressed={activeConversation === index}
                onClick={() => setActiveConversation(index)}
              >
                <span>0{index + 1}</span>
                {item.label}
                <i aria-hidden="true">{activeConversation === index ? "—" : "+"}</i>
              </button>
            ))}
          </div>
          <article
            className="human-answer"
            id="human-project-panel"
            aria-live="polite"
          >
            <span>THE WORK THAT FOLLOWED</span>
            <h3>{conversations[activeConversation].name}</h3>
            <p>{conversations[activeConversation].copy}</p>
            <small>{conversations[activeConversation].note}</small>
          </article>
        </div>
      </section>

      <section className="human-shape" aria-labelledby="shape-title">
        <p className="human-section-tag">03 / THE SHAPE OF US</p>
        <h2 id="shape-title">Two at the core.<br /><em>Never far from the work.</em></h2>
        <div className="human-founders">
          <div>
            <span>01</span>
            <strong>Adam<br />Al Gharib</strong>
          </div>
          <p>
            Inspectre is intentionally small. Adam Al Gharib and Sushant Desai
            stay close to the thinking and the making, then bring in the right
            specialists when the work asks for them.
          </p>
          <div>
            <span>02</span>
            <strong>Sushant<br />Desai</strong>
          </div>
        </div>
        <div className="human-capability-loop" aria-label="Capabilities">
          <span>Research</span><i>↗</i><span>Strategy</span><i>↘</i><span>Identity</span><i>↙</i>
          <span>Product</span><i>↖</i><span>Engineering</span><i>↗</i><span>Evaluation</span>
        </div>
      </section>

      <section className="human-brief" id="conversation" aria-labelledby="brief-title">
        <p className="human-section-tag">04 / AN OPENING LINE</p>
        <h2 id="brief-title">Let&apos;s start before<br />the brief is polished.</h2>
        <div className="human-brief-builder">
          <div className="human-choice-group">
            <p>We need to…</p>
            <div>
              {needs.map((item, index) => (
                <button key={item.key} className={need === index ? "is-selected" : ""} onClick={() => setNeed(index)}>{item.label}</button>
              ))}
            </div>
          </div>
          <div className="human-choice-group">
            <p>The hard part is…</p>
            <div>
              {tensions.map((item, index) => (
                <button key={item.key} className={tension === index ? "is-selected" : ""} onClick={() => setTension(index)}>{item.label}</button>
              ))}
            </div>
          </div>
          <div className="human-opening" aria-live="polite">
            <span>YOUR OPENING LINE</span>
            <p>“{opening}”</p>
            <button onClick={copyOpening}>{copied ? "Copied ✓" : "Copy this line"}</button>
          </div>
        </div>
        <div className="human-contact-row">
          <p>Now send it while it still feels unfinished.</p>
          <a href="https://www.linkedin.com/in/adam-al-gharib/" target="_blank" rel="noreferrer">Talk to Adam on LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <footer className="human-footer">
        <Brand />
        <p>We build systems that know when to act—and when to ask.</p>
        <a href="#human-title">Up ↑</a>
      </footer>
    </main>
  );
}
