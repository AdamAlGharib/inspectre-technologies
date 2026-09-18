import { Box, Chip, Disk, Float, Gem, GroundArc, IsoScene, Plate, Wire, project, type P3 } from "../iso";

/** Observatory tower centre on the ground. */
const TX = -25;
const TY = -25;

const add = (a: P3, b: P3, k = 1): P3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const pts = (list: P3[]) => list.map((p) => project(p).join(",")).join(" ");

/** Unit vectors for a tube tilted up and out toward the viewer's upper right. */
const AXIS: P3 = [0.4851, -0.4851, 0.7276];
const SIDE: P3 = [0.7071, 0.7071, 0];
const UP: P3 = [-0.5145, 0.5145, 0.686];

/** A square tube segment running along AXIS from `from`, `len` long and `hw` half-wide. */
function Tube({ from, len, hw, tone }: { from: P3; len: number; hw: number; tone: "paper" | "lilacSoft" }) {
  const a = from;
  const b = add(a, AXIS, len);
  const c = (p: P3, su: number, sv: number) => add(add(p, SIDE, su * hw), UP, sv * hw);
  return (
    <g className={`iso-solid t-${tone}`}>
      <polygon className="iso-face iso-left" points={pts([c(a, 1, 1), c(b, 1, 1), c(b, 1, -1), c(a, 1, -1)])} />
      <polygon className="iso-face iso-top" points={pts([c(a, -1, 1), c(b, -1, 1), c(b, 1, 1), c(a, 1, 1)])} />
      <polygon className="iso-face iso-right" points={pts([c(b, -1, 1), c(b, 1, 1), c(b, 1, -1), c(b, -1, -1)])} />
    </g>
  );
}

/** Work happens in the rooms; evidence walks up to the observatory; only then does the one task unlock. */
export function HiveScene() {
  const pivot: P3 = [TX, TY, 124];
  return (
    <IsoScene title="An observatory tower joined by footpaths to a workshop, a library and a review room, with one terminal receiving a single task from review" viewBox="-270 -210 540 410">
      {/* observatory grounds */}
      <GroundArc at={[TX, TY, 0]} r={104} dashed />

      {/* footpaths on the ground */}
      <Wire points={[[TX, 151, 0], [TX, TY + 72, 0]]} flow packet dur={4.5} />
      <Wire points={[[15, 30, 0], [15, 95, 0], [91, 95, 0]]} />
      <Wire points={[[TX + 72, TY, 0], [151, TY, 0]]} flow />
      <Wire points={[[175, 4, 0], [175, 67, 0], [233, 67, 0]]} flow packet dur={4} delay={1.5} />

      {/* the observatory */}
      <Disk at={[TX, TY, 0]} r={72} h={10} tone="paper" />
      <Disk at={[TX, TY, 10]} r={60} h={10} tone="paper" />
      <Disk at={[TX, TY, 20]} r={44} h={58} tone="paper" bands={3} />
      <Disk at={[TX, TY, 78]} r={47} h={14} tone="lilacSoft" />
      <Disk at={[TX, TY, 92]} r={38} h={12} tone="paper" />
      <Disk at={[TX, TY, 104]} r={26} h={10} tone="acid" />
      <Disk at={[TX, TY, 114]} r={11} h={5} tone="paper" />
      <Tube from={add(pivot, AXIS, -5)} len={30} hw={4.5} tone="paper" />
      <Tube from={add(pivot, AXIS, 25)} len={9} hw={6.5} tone="paper" />

      {/* rooms */}
      <Box at={[151, TY - 24, 0]} size={[48, 48, 34]} tone="paper" />
      <Box at={[151, TY - 24, 34]} size={[48, 48, 6]} tone="acidSoft" />
      <Box at={[91, 71, 0]} size={[48, 48, 34]} tone="paper" />
      <Box at={[99, 79, 34]} size={[32, 32, 4]} tone="paper" />
      <Box at={[99, 79, 38]} size={[32, 32, 4]} tone="lilacSoft" />
      <Box at={[TX - 24, 151, 0]} size={[48, 48, 34]} tone="paper" />
      <Box at={[TX - 12, 163, 34]} size={[24, 24, 10]} tone="paper" />

      {/* the single terminal, set apart */}
      <Plate at={[223, 40, 0]} size={[54, 54]} dashed />
      <Box at={[233, 50, 0]} size={[34, 34, 26]} tone="ink" />

      {/* what the telescope is looking at */}
      <Float amp={4} dur={7}>
        <Gem at={[22, -58, 160]} s={14} />
      </Float>
      <Float amp={6} delay={1.6}>
        <Gem at={[-150, -30, 88]} s={9} tone="lilac" />
        <Gem at={[125, -150, 70]} s={9} tone="lilac" />
        <Gem at={[95, 245, 20]} s={9} tone="lilac" />
      </Float>

      {/* labels last */}
      <Chip at={[TX, TY, 108]} label="Accepted" tone="acid" align="end" dx={-56} dy={-8} />
      <Chip at={[TX, 175, 34]} label="Workshop" dy={-42} />
      <Chip at={[91, 119, 0]} label="Library" align="end" dx={-8} dy={14} />
      <Chip at={[175, TY, 40]} label="Review" dy={-40} />
      <Chip at={[223, 94, 0]} label="One task" align="end" dx={-10} dy={2} />
    </IsoScene>
  );
}
