import { Box, Chip, Dot, Float, IsoScene, TopMark, Wire } from "../iso";
import type { P3 } from "../iso";

/** Plate geometry: three equal square plates stacked on one footprint. */
const X0 = -46;
const Y0 = 26;
const S = 120;
const T = 6;
const Z_ARCH = 0;
const Z_UI = 66;
const Z_BRAND = 132;

/** The plumb line pierces every plate at the same ground point. */
const P = 98;
const PX = X0 + P;
const PY = Y0 + P;

const local = (u: number, v: number, z: number): P3 => [X0 + u, Y0 + v, z];

/** Faint exploded-view guides between the outer corners of two plates. They run up behind the upper plate's edge so a bobbing plate never opens a gap. */
function Guides({ from, to }: { from: number; to: number }) {
  const corners: [number, number][] = [[0, S], [S, 0]];
  return (
    <>
      {corners.map(([u, v]) => (
        <Wire key={`${u}-${v}`} points={[local(u, v, from), local(u, v, to)]} />
      ))}
    </>
  );
}

/** Design the system: architecture, interface and brand as three aligned layers on one plumb line. */
export function SystemScene() {
  return (
    <IsoScene title="Three floating plates for architecture, interface and brand, stacked and held in line by one vertical plumb wire" viewBox="-220 -165 440 320">
      {/* plumb bob hanging under the stack */}
      <Box at={[PX - 4, PY - 4, -46]} size={[8, 8, 8]} tone="ink" />
      <Wire points={[[PX, PY, -38], [PX, PY, Z_ARCH]]} tone="ink" />

      {/* architecture */}
      <Box at={[X0, Y0, Z_ARCH]} size={[S, S, T]} tone="paper" />
      <Wire points={[local(54, P, Z_ARCH + T), local(P, P, Z_ARCH + T), local(P, 50, Z_ARCH + T)]} packet dur={4} />
      <Box at={local(78, 12, Z_ARCH + T)} size={[28, 38, 7]} tone="paper" />
      <Box at={local(12, 78, Z_ARCH + T)} size={[42, 28, 7]} tone="paper" />
      <Wire points={[[PX, PY, Z_ARCH + T], [PX, PY, Z_UI]]} tone="ink" flow />
      <Dot at={[PX, PY, Z_ARCH + T]} tone="acid" />
      <Guides from={Z_ARCH + T} to={Z_UI + T} />

      {/* interface */}
      <Float amp={4} dur={7}>
        <Box at={[X0, Y0, Z_UI]} size={[S, S, T]} tone="lilacSoft" />
        <Box at={local(84, 14, Z_UI + T)} size={[22, 32, 4]} tone="lilac" />
        <Box at={local(14, 84, Z_UI + T)} size={[38, 22, 4]} tone="paper" />
        <Wire points={[[PX, PY, Z_UI + T], [PX, PY, Z_BRAND]]} tone="ink" flow />
        <Dot at={[PX, PY, Z_UI + T]} tone="acid" />
      </Float>
      <Guides from={Z_UI + T} to={Z_BRAND + T} />

      {/* brand */}
      <Float amp={5} dur={7} delay={0.8}>
        <Box at={[X0, Y0, Z_BRAND]} size={[S, S, T]} tone="acid" />
        <TopMark at={local(38, 38, Z_BRAND + T)} s={34} />
        <Box at={local(14, 88, Z_BRAND + T)} size={[30, 16, 4]} tone="paper" />
        <Wire points={[[PX, PY, Z_BRAND + T], [PX, PY, Z_BRAND + T + 28]]} />
        <Dot at={[PX, PY, Z_BRAND + T]} r={3.5} tone="lilac" />
        <Dot at={[PX, PY, Z_BRAND + T + 28]} r={2.5} tone="paper" />
      </Float>

      {/* leaders and labels, in one column to the right of the stack */}
      {[Z_ARCH, Z_UI, Z_BRAND].map((z) => (
        <Wire key={z} points={[[X0 + S + 5, Y0 - 5, z + 3], [X0 + S + 22, Y0 - 22, z + 3]]} />
      ))}
      <Chip at={[X0 + S + 22, Y0 - 22, Z_BRAND + 3]} label="Brand" tone="acid" align="start" dx={3} />
      <Chip at={[X0 + S + 22, Y0 - 22, Z_UI + 3]} label="Interface" align="start" dx={3} />
      <Chip at={[X0 + S + 22, Y0 - 22, Z_ARCH + 3]} label="Architecture" align="start" dx={3} />
    </IsoScene>
  );
}
