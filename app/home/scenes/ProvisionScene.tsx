import { Box, Chip, Dot, Float, Gem, IsoScene, Panel, TopMark, Wire } from "../iso";
import type { P3 } from "../iso";

/** Shifts the whole composition so it sits centred in the viewBox. */
const OX = 4;
const OY = 40;
const p = (x: number, y: number, z = 0): P3 => [x + OX, y + OY, z];

const PAGES = [-140, -92, -44];

/** A screenshot is captured, pages ride a conveyor through a gate that can see, and leave as ship, patch or block. */
export function ProvisionScene() {
  return (
    <IsoScene
      title="Captured screenshots ride a conveyor through a release gate, which routes each page to ship, patch or block"
      viewBox="-270 -210 540 410"
    >
      {/* ground wires: out of the gate, then the three-way split */}
      <Wire points={[p(100, 0), p(150, 0)]} />
      <Wire points={[p(100, 0), p(100, 124)]} packet packetTone="ink" dur={6.5} />
      <Wire points={[p(72, 0), p(100, 0), p(100, -124)]} flow tone="acid" packet dur={4} />
      <Dot at={p(100, 0)} r={2.5} />

      {/* the screenshot slab with boxed findings */}
      <Panel at={p(-184, -46)} size={[92, 80]} along="y" tone="paper" lines={5} />
      <Float amp={4} dur={7}>
        <Panel at={p(-174, -28, 44)} size={[36, 22]} along="y" tone="lilacSoft" dashed />
        <Panel at={p(-174, 8, 14)} size={[26, 18]} along="y" tone="ghost" dashed />
      </Float>

      {/* outcome: ship (furthest back) */}
      <Box at={p(74, -176)} size={[52, 52, 10]} tone="acid" />
      <TopMark at={p(100, -150, 10)} s={26} />

      {/* the gate's far pillar stands behind the conveyor */}
      <Box at={p(38, -36)} size={[8, 8, 72]} tone="paper" />

      {/* conveyor and the pages riding it */}
      <Box at={p(-152, -18)} size={[224, 36, 8]} tone="paper" />
      {PAGES.map((x) => (
        <Box key={x} at={p(x, -11, 8)} size={[24, 22, 3]} tone="paper" />
      ))}

      {/* near pillar and lintel */}
      <Box at={p(38, 28)} size={[8, 8, 72]} tone="paper" />
      <Box at={p(35, -39, 72)} size={[14, 78, 10]} tone="acid" />

      {/* the gate looks back at the screenshot: a sight line from its eye to the boxed finding */}
      <Wire points={[p(-174, -10, 55), p(42, -10, 82)]} tone="lilac" flow />
      <Dot at={p(42, -10, 82)} r={3} tone="lilac" />

      {/* outcomes: patch, block */}
      <Box at={p(150, -22)} size={[44, 44, 8]} tone="paper" />
      <Box at={p(78, 124)} size={[44, 44, 8]} tone="ink" />

      <Float amp={5} delay={0.8}>
        <Gem at={p(100, -150, 54)} s={14} />
      </Float>

      {/* labels last so nothing covers them */}
      <Chip at={p(-184, -46, 80)} label="Capture" align="start" dx={10} dy={-2} />
      <Chip at={p(42, -39, 82)} label="Gate" dy={-18} />
      <Chip at={p(100, -150, 54)} label="Ship" tone="acid" dy={-24} />
      <Chip at={p(194, -22, 4)} label="Patch" align="start" dx={10} />
      <Chip at={p(78, 168, 4)} label="Block" tone="ink" align="end" dx={-10} />
    </IsoScene>
  );
}
