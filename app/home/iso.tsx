import type { CSSProperties, ReactNode } from "react";

/**
 * Isometric line-art kit for the home page illustrations.
 *
 * World space: x runs right-down, y runs left-down, z runs up.
 * Draw order is painter's order — emit shapes back to front
 * (smaller x + y first, then lower z first).
 *
 * All colour lives in home.css (`.iso …` rules) so scenes follow the theme.
 */

export type P3 = readonly [number, number, number];
export type Tone = "paper" | "acid" | "acidSoft" | "lilac" | "lilacSoft" | "ink" | "ghost";
export type WireTone = "line" | "acid" | "lilac" | "ink";

const COS = 0.8660254;
const SIN = 0.5;
const round = (n: number) => Math.round(n * 100) / 100;

export function project([x, y, z]: P3): [number, number] {
  return [round((x - y) * COS), round((x + y) * SIN - z)];
}

const toPoints = (list: P3[]) => list.map((p) => project(p).join(",")).join(" ");
const toPath = (list: readonly P3[]) => list.map((p, i) => `${i === 0 ? "M" : "L"}${project(p).join(",")}`).join(" ");
const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

type SceneProps = {
  title: string;
  viewBox?: string;
  className?: string;
  children: ReactNode;
};

export function IsoScene({ title, viewBox = "-320 -260 640 520", className, children }: SceneProps) {
  return (
    <svg className={cx("iso", className)} viewBox={viewBox} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

type BoxProps = {
  /** back-top corner on the ground: [x, y, z] */
  at: P3;
  /** [width along x, depth along y, height along z] */
  size: P3;
  tone?: Tone;
  dashed?: boolean;
};

export function Box({ at, size, tone = "paper", dashed = false }: BoxProps) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  const top: P3[] = [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]];
  const left: P3[] = [[x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z]];
  const right: P3[] = [[x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x + w, y, z]];
  return (
    <g className={cx("iso-solid", `t-${tone}`, dashed && "is-dashed")}>
      <polygon className="iso-face iso-left" points={toPoints(left)} />
      <polygon className="iso-face iso-right" points={toPoints(right)} />
      <polygon className="iso-face iso-top" points={toPoints(top)} />
    </g>
  );
}

type PlateProps = { at: P3; size: readonly [number, number]; tone?: Tone; dashed?: boolean };

/** A flat rhombus lying on the ground plane at height z. */
export function Plate({ at, size, tone = "ghost", dashed = false }: PlateProps) {
  const [x, y, z] = at;
  const [w, d] = size;
  return (
    <g className={cx("iso-solid", `t-${tone}`, dashed && "is-dashed")}>
      <polygon className="iso-face iso-top" points={toPoints([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]])} />
    </g>
  );
}

type DiskProps = {
  /** centre of the base: [x, y, z] */
  at: P3;
  r: number;
  h: number;
  tone?: Tone;
  dashed?: boolean;
  /** evenly spaced ring lines drawn around the side wall */
  bands?: number;
  /** concentric ring drawn on the top face, as a fraction of r (0–1) */
  ring?: number;
};

const RX = 1.2247449;
const RY = 0.7071068;

export function Disk({ at, r, h, tone = "paper", dashed = false, bands = 0, ring }: DiskProps) {
  const [x, y, z] = at;
  const [sx, top] = project([x, y, z + h]);
  const [, bottom] = project([x, y, z]);
  const rx = round(r * RX);
  const ry = round(r * RY);
  const side = `M${sx - rx},${top} L${sx - rx},${bottom} A${rx},${ry} 0 0 0 ${sx + rx},${bottom} L${sx + rx},${top} Z`;
  const bandLines = Array.from({ length: bands }, (_, i) => round(top + ((bottom - top) * (i + 1)) / (bands + 1)));
  return (
    <g className={cx("iso-solid", `t-${tone}`, dashed && "is-dashed")}>
      <path className="iso-face iso-left" d={side} />
      {bandLines.map((cy) => (
        <path key={cy} className="iso-band" d={`M${sx - rx},${cy} A${rx},${ry} 0 0 0 ${sx + rx},${cy}`} />
      ))}
      <ellipse className="iso-face iso-top" cx={sx} cy={top} rx={rx} ry={ry} />
      {ring ? <ellipse className="iso-band" cx={sx} cy={top} rx={round(rx * ring)} ry={round(ry * ring)} /> : null}
    </g>
  );
}

type PanelProps = {
  /** bottom corner nearest the back: [x, y, z] */
  at: P3;
  /** [length along the ground, height] */
  size: readonly [number, number];
  /** "x": the panel runs along the x axis (faces the viewer's left). "y": runs along y (faces right). */
  along?: "x" | "y";
  tone?: Tone;
  dashed?: boolean;
  /** horizontal rules drawn across the panel, like lines of UI or text */
  lines?: number;
};

/** A thin vertical sheet — a screen, a document, a card. */
export function Panel({ at, size, along = "x", tone = "paper", dashed = false, lines = 0 }: PanelProps) {
  const [x, y, z] = at;
  const [len, h] = size;
  const end: P3 = along === "x" ? [x + len, y, z] : [x, y + len, z];
  const face: P3[] = [[x, y, z + h], [end[0], end[1], z + h], [end[0], end[1], z], [x, y, z]];
  const inset = len * 0.14;
  const rules = Array.from({ length: lines }, (_, i) => {
    const lz = z + h - ((i + 1) * h) / (lines + 1);
    const short = i % 3 === 2 ? len * 0.35 : 0;
    const a: P3 = along === "x" ? [x + inset, y, lz] : [x, y + inset, lz];
    const b: P3 = along === "x" ? [x + len - inset - short, y, lz] : [x, y + len - inset - short, lz];
    return toPath([a, b]);
  });
  return (
    <g className={cx("iso-solid", `t-${tone}`, dashed && "is-dashed")}>
      <polygon className={cx("iso-face", along === "x" ? "iso-left" : "iso-right")} points={toPoints(face)} />
      {rules.map((d) => (
        <path key={d} className="iso-band" d={d} />
      ))}
    </g>
  );
}

type WireProps = {
  points: readonly P3[];
  dashed?: boolean;
  /** animate the dashes so the wire reads as carrying traffic */
  flow?: boolean;
  tone?: WireTone;
  /** send a small diamond along the wire */
  packet?: boolean;
  packetTone?: "acid" | "lilac" | "ink";
  /** seconds for one packet trip */
  dur?: number;
  /** phase offset in seconds, so packets on different wires do not move in lockstep */
  delay?: number;
};

export function Wire({ points, dashed = true, flow = false, tone = "line", packet = false, packetTone = "acid", dur = 5, delay = 0 }: WireProps) {
  const d = toPath(points);
  return (
    <g className="iso-wire-group">
      <path className={cx("iso-wire", `w-${tone}`, dashed && "is-dashed", flow && "is-flow")} d={d} />
      {packet ? (
        <polygon className={cx("iso-packet", `p-${packetTone}`)} points="0,-3.5 6,0 0,3.5 -6,0">
          {/* a negative begin offsets the phase without parking the packet at the origin until it starts */}
          <animateMotion dur={`${dur}s`} begin={`${-Math.abs(delay)}s`} repeatCount="indefinite" path={d} />
        </polygon>
      ) : null}
    </g>
  );
}

type ArcProps = {
  at: P3;
  r: number;
  /** degrees, measured on the ground plane from the +x axis toward +y */
  from?: number;
  to?: number;
  /** close the arc to the centre and fill it, like a radar sweep */
  sector?: boolean;
  dashed?: boolean;
  tone?: Tone;
};

/** A circle, arc or filled sector lying on the ground plane. */
export function GroundArc({ at, r, from = 0, to = 360, sector = false, dashed = false, tone = "ghost" }: ArcProps) {
  const [x, y, z] = at;
  const steps = Math.max(8, Math.ceil(Math.abs(to - from) / 6));
  const ringPoints: P3[] = Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / steps) * Math.PI) / 180;
    return [x + r * Math.cos(a), y + r * Math.sin(a), z];
  });
  const d = sector ? `${toPath([[x, y, z], ...ringPoints])} Z` : toPath(ringPoints);
  return (
    <g className={cx("iso-solid", `t-${tone}`, dashed && "is-dashed")}>
      <path className={cx("iso-face", sector ? "iso-top" : "iso-outline")} d={d} />
    </g>
  );
}

type GemProps = { at: P3; s?: number; tone?: Tone };

/** A small flat diamond — a data point, a packet at rest, a marker. */
export function Gem({ at, s = 12, tone = "acid" }: GemProps) {
  const [x, y, z] = at;
  return <Plate at={[x - s / 2, y - s / 2, z]} size={[s, s]} tone={tone} />;
}

type DotProps = { at: P3; r?: number; tone?: "acid" | "lilac" | "ink" | "paper" };

/** A screen-space node marker. */
export function Dot({ at, r = 3, tone = "ink" }: DotProps) {
  const [sx, sy] = project(at);
  return <circle className={cx("iso-dot", `d-${tone}`)} cx={sx} cy={sy} r={r} />;
}

type ChipProps = {
  at: P3;
  label: string;
  tone?: "paper" | "acid" | "lilac" | "ink";
  align?: "start" | "middle" | "end";
  /** screen-space nudge */
  dx?: number;
  dy?: number;
};

const CHIP_CHAR = 7.1;
const CHIP_PAD = 16;
const CHIP_H = 19;

/** A monospace label chip, drawn flat to the screen at a projected point. */
export function Chip({ at, label, tone = "paper", align = "middle", dx = 0, dy = 0 }: ChipProps) {
  const [sx, sy] = project(at);
  const w = round(label.length * CHIP_CHAR + CHIP_PAD);
  const x0 = align === "start" ? sx : align === "end" ? sx - w : sx - w / 2;
  return (
    <g className={cx("iso-chip", `c-${tone}`)} transform={`translate(${round(x0 + dx)} ${round(sy + dy - CHIP_H / 2)})`}>
      <rect width={w} height={CHIP_H} />
      {/* textLength keeps the label inside its box if the mono webfont has not loaded */}
      <text x={w / 2} y={13.3} textAnchor="middle" textLength={round(w - CHIP_PAD)} lengthAdjust="spacingAndGlyphs">{label}</text>
    </g>
  );
}

type TopMarkProps = { at: P3; s?: number };

/** The Inspectre aperture mark, laid flat on a top face. `at` is the mark's centre. */
export function TopMark({ at, s = 28 }: TopMarkProps) {
  const [x, y, z] = at;
  const h = s / 2;
  const c = s * 0.3;
  const corners: P3[][] = [
    [[x - h, y - h + c, z], [x - h, y - h, z], [x - h + c, y - h, z]],
    [[x + h - c, y - h, z], [x + h, y - h, z], [x + h, y - h + c, z]],
    [[x + h, y + h - c, z], [x + h, y + h, z], [x + h - c, y + h, z]],
    [[x - h + c, y + h, z], [x - h, y + h, z], [x - h, y + h - c, z]],
  ];
  return (
    <g className="iso-mark">
      {corners.map((corner) => (
        <path key={toPath(corner)} d={toPath(corner)} />
      ))}
      {/* the I runs along the world diagonal, which projects to a true vertical on screen */}
      <path className="iso-mark-i" d={toPath([[x - h * 0.42, y - h * 0.42, z], [x + h * 0.42, y + h * 0.42, z]])} />
    </g>
  );
}

type FloatProps = { children: ReactNode; delay?: number; amp?: number; dur?: number };

/** Gently bobs its children. Honours prefers-reduced-motion via CSS. */
export function Float({ children, delay = 0, amp = 6, dur = 6 }: FloatProps) {
  const style = { "--iso-amp": `${amp}px`, animationDelay: `${delay}s`, animationDuration: `${dur}s` } as CSSProperties;
  return (
    <g className="iso-float" style={style}>
      {children}
    </g>
  );
}
