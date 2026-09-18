import { Box, Chip, Dot, Float, Gem, IsoScene, Plate, Wire } from "../iso";
import type { Tone } from "../iso";

type Cell = { key: string; cx: number; cy: number; s: number; h: number; tone: Tone; dashed: boolean };

const PITCH = 60;
const SHIFT = 23;

/**
 * [dx, dy, size, height, tone, dashed] per grid cell, row by row (j = y index, i = x index).
 * Size 0 leaves the cell empty: the hero's own cell, and the cell diagonally behind it,
 * whose footprint sits wholly behind the tall cube and would only poke out as clutter.
 */
const FIELD: readonly (readonly [number, number, number, number, Tone, boolean])[][] = [
  [[-3, 3, 24, 10, "ghost", false], [0, 0, 0, 0, "ghost", true], [2, 2, 22, 8, "ghost", true], [-3, -4, 22, 12, "ghost", true]],
  [[3, -3, 22, 12, "ghost", true], [-5, 4, 26, 8, "ghost", true], [0, 0, 0, 0, "acid", false], [4, 2, 24, 10, "ghost", false]],
  [[-2, 4, 26, 8, "ghost", true], [4, -4, 22, 14, "ghost", false], [-4, 3, 24, 10, "ghost", true], [2, -3, 22, 12, "ghost", true]],
  [[4, -2, 24, 12, "ghost", true], [-3, 3, 22, 8, "ghost", true], [4, -4, 26, 12, "ghost", false], [-4, 2, 22, 10, "ghost", true]],
];

const HERO = { i: 2, j: 1 };

const CELLS: Cell[] = FIELD.flatMap((row, j) =>
  row.map(([dx, dy, s, h, tone, dashed], i) => ({
    key: `${i}-${j}`,
    cx: (i - 1.5) * PITCH + SHIFT + dx,
    cy: (j - 1.5) * PITCH + SHIFT + dy,
    s,
    h,
    tone,
    dashed,
  })),
);

const HX = (HERO.i - 1.5) * PITCH + SHIFT;
const HY = (HERO.j - 1.5) * PITCH + SHIFT;
const HS = 30;
const HH = 64;

const depth = (c: Cell) => c.cx + c.cy;
const BEHIND = CELLS.filter((c) => c.s > 0 && depth(c) < HX + HY).sort((a, b) => depth(a) - depth(b));
const FRONT = CELLS.filter((c) => c.s > 0 && depth(c) >= HX + HY).sort((a, b) => depth(a) - depth(b));

const NOISE = CELLS.find((c) => c.key === "0-3") as Cell;

function Cube({ c }: { c: Cell }) {
  return <Box at={[c.cx - c.s / 2, c.cy - c.s / 2, 0]} size={[c.s, c.s, c.h]} tone={c.tone} dashed={c.dashed} />;
}

/** A field of faint noise cubes with one solid acid cube singled out as the wedge. */
export function WedgeScene() {
  return (
    <IsoScene title="A field of faint look-alike cubes with one solid, taller cube framed and wired up as the signal" viewBox="-220 -165 440 320">
      {/* ghost frame on the ground around the wedge */}
      <Plate at={[HX - 32, HY - 32, 0]} size={[64, 64]} dashed />

      {BEHIND.map((c) => (
        <Cube key={c.key} c={c} />
      ))}

      {/* the wedge */}
      <Box at={[HX - HS / 2, HY - HS / 2, 0]} size={[HS, HS, HH]} tone="acid" />
      <Wire points={[[HX, HY, HH], [HX, HY, 138]]} flow packet dur={3.5} />
      <Dot at={[HX, HY, HH]} r={2.5} tone="ink" />

      {FRONT.map((c) => (
        <Cube key={c.key} c={c} />
      ))}

      <Float amp={7}>
        <Gem at={[-88, 10, 72]} s={14} />
      </Float>
      <Float amp={5} delay={1.6} dur={7}>
        <Gem at={[164, -46, 80]} s={12} tone="lilac" />
      </Float>

      {/* labels last so nothing covers them */}
      <Chip at={[HX, HY, 146]} label="Signal" tone="acid" />
      <Chip at={[NOISE.cx, NOISE.cy, 0]} label="Noise" dx={-12} dy={32} />
    </IsoScene>
  );
}
