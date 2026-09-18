import {
  Box,
  Chip,
  Disk,
  Dot,
  Float,
  Gem,
  GroundArc,
  IsoScene,
  project,
  Wire,
  type P3,
} from "../iso";

const LINE_Y = 30;

const SHEETS: { key: string; at: P3 }[] = [
  { key: "sheet-a", at: [-222, 6, 0] },
  { key: "sheet-b", at: [-219, 8, 8] },
  { key: "sheet-c", at: [-223, 5, 16] },
];

const CARDS: { key: string; x: number; tone: "paper" | "lilac" }[] = [
  { key: "card-a", x: -144, tone: "paper" },
  { key: "card-b", x: -116, tone: "lilac" },
  { key: "card-c", x: -88, tone: "paper" },
];

const LIVE = 5;
const ADAPTERS = [0, 1, 2, 3, 4, 5].map((i) => ({
  key: `adapter-${i}`,
  x: 34 + i * 28,
  live: i === LIVE,
}));
const LIVE_X = 34 + LIVE * 28 + 7;

const flap = (points: P3[]) =>
  points
    .map((p, i) => `${i === 0 ? "M" : "L"}${project(p).join(",")}`)
    .join(" ");

/** Evidence becomes stories on a desk, but nothing reaches the send tray until a person at the gate approves it. */
export function HitlScene() {
  return (
    <IsoScene
      title="Evidence sheets feed an editor desk, a person standing in an approval gate interrupts the line, and only then does an envelope tray send through the first of six adapters"
      viewBox="-270 -210 540 410"
    >
      {/* the checkpoint zone */}
      <GroundArc at={[31, LINE_Y, 0]} r={56} dashed />

      {/* the line: flowing up to the gate, broken at it, flowing again after */}
      <Wire
        points={[
          [-176, LINE_Y, 0],
          [-25, LINE_Y, 0],
        ]}
        flow
        packet
        dur={5}
      />
      <Wire
        points={[
          [87, LINE_Y, 0],
          [149, LINE_Y, 0],
        ]}
        flow
      />

      {/* tray to adapters: one live route, the rest pending */}
      <Wire
        points={[
          [41, -52, 0],
          [181, -52, 0],
        ]}
      />
      {ADAPTERS.filter((a) => !a.live).map((a) => (
        <Wire
          key={a.key}
          points={[
            [a.x + 7, -78, 0],
            [a.x + 7, -52, 0],
          ]}
        />
      ))}
      <Wire
        points={[
          [LIVE_X, -2, 0],
          [LIVE_X, -78, 0],
        ]}
        dashed={false}
        tone="ink"
        packet
        dur={3}
        delay={1.5}
      />

      {/* evidence sheets */}
      {SHEETS.map((s) => (
        <Box key={s.key} at={s.at} size={[46, 52, 3]} tone="paper" />
      ))}
      <Float amp={4} dur={7}>
        <Box at={[-220, 7, 29]} size={[46, 52, 3]} tone="paper" />
      </Float>

      {/* adapters */}
      {ADAPTERS.map((a) => (
        <Box
          key={a.key}
          at={[a.x, -92, 0]}
          size={[14, 14, 14]}
          tone={a.live ? "lilac" : "paper"}
          dashed={!a.live}
        />
      ))}
      <Float amp={6} delay={1.2}>
        <Gem at={[LIVE_X, -85, 34]} s={10} tone="lilac" />
      </Float>

      {/* editor desk with three story cards */}
      <Box at={[-150, -14, 0]} size={[88, 88, 12]} tone="paper" />
      {CARDS.map((c) => (
        <Box key={c.key} at={[c.x, 8, 12]} size={[20, 44, 3]} tone={c.tone} />
      ))}

      {/* the gate, with a person in it */}
      <Dot at={[-25, LINE_Y, 0]} r={2.5} tone="paper" />
      <Box at={[25, -8, 0]} size={[12, 12, 140]} tone="paper" />
      <Disk at={[31, LINE_Y, 0]} r={11} h={20} tone="ink" />
      <Disk at={[31, LINE_Y, 24]} r={7} h={11} tone="ink" />
      <Box at={[25, 56, 0]} size={[12, 12, 140]} tone="paper" />
      <Box at={[23, -11, 140]} size={[16, 82, 14]} tone="acid" />
      <Dot at={[87, LINE_Y, 0]} r={2.5} tone="paper" />

      {/* envelope tray */}
      <Box at={[149, -2, 0]} size={[64, 64, 12]} tone="paper" />
      <Box at={[158, 7, 12]} size={[46, 46, 3]} tone="acid" />
      <g className="iso-solid t-acid">
        <path
          className="iso-band"
          d={flap([
            [158, 7, 15],
            [184, 30, 15],
            [158, 53, 15],
          ])}
        />
      </g>

      {/* labels last */}
      <Chip at={[-220, 7, 32]} label="Evidence" dy={-20} />
      <Chip at={[-106, 74, 0]} label="Desk" dx={-8} dy={24} />
      <Chip
        at={[23, -11, 154]}
        label="Approve"
        tone="acid"
        align="start"
        dx={14}
      />
      <Chip at={[181, 62, 0]} label="Send" dx={-8} dy={28} />
      <Chip
        at={[41, -85, 14]}
        label="6 adapters"
        align="start"
        dx={-6}
        dy={-24}
      />
    </IsoScene>
  );
}
