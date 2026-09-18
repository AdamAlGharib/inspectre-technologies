import { Box, Chip, Dot, Float, Gem, IsoScene, Panel, Wire } from "../iso";

const CITIES = [
  { key: "nyc", x: -195, y: -25, mast: 28 },
  { key: "chi", x: -110, y: -110, mast: 44 },
  { key: "tor", x: -25, y: -195, mast: 36 },
] as const;

const CARDS = [
  { key: "a", x: 54, tone: "ink" },
  { key: "b", x: 96, tone: "paper" },
  { key: "c", x: 138, tone: "paper" },
] as const;

/** City sensor readings settle into one median, which feeds a single market cockpit. */
export function PbxScene() {
  return (
    <IsoScene
      title="Air-quality sensors in each of three cities settle into a per-city median reading, which feeds a single market cockpit with a chart and three market cards"
      viewBox="-270 -210 540 410"
    >
      {/* city feeds running into the median */}
      <Wire points={[[-175, -25, 0], [-70, -25, 0]]} flow packet packetTone="lilac" dur={4} />
      <Wire points={[[-90, -90, 0], [-70, -70, 0]]} />
      <Wire points={[[-25, -175, 0], [-25, -70, 0]]} flow packet packetTone="lilac" dur={5.2} />

      {/* city plinths with sensor masts */}
      {CITIES.map((c) => (
        <g key={c.key}>
          <Box at={[c.x - 20, c.y - 20, 0]} size={[40, 40, 16]} tone="paper" />
          <Box at={[c.x - 2, c.y - 2, 16]} size={[4, 4, c.mast]} tone="paper" />
        </g>
      ))}
      <Float amp={4}>
        {CITIES.map((c) => (
          <Gem key={c.key} at={[c.x, c.y, c.mast + 26]} s={14} tone="lilac" />
        ))}
      </Float>

      {/* the median plate */}
      <Box at={[-70, -70, 0]} size={[60, 60, 5]} tone="lilac" />

      {/* median to cockpit */}
      <Wire points={[[-40, -10, 0], [-40, 112, 0], [22, 112, 0]]} flow packet dur={4.5} />

      {/* the cockpit */}
      <Box at={[22, 60, 0]} size={[180, 104, 8]} tone="paper" />
      <Box at={[28, 66, 8]} size={[168, 92, 6]} tone="acid" />
      <Panel at={[54, 82, 14]} size={[116, 56]} along="x" tone="paper" lines={4} />
      <Wire points={[[66, 82, 21], [84, 82, 38], [98, 82, 30], [120, 82, 51], [134, 82, 43], [158, 82, 64]]} dashed={false} tone="lilac" />
      <Dot at={[158, 82, 64]} r={2.5} tone="acid" />
      {CARDS.map((card) => (
        <Box key={card.key} at={[card.x, 112, 14]} size={[32, 34, 3]} tone={card.tone} />
      ))}

      {/* labels last so nothing covers them */}
      <Chip at={[-215, -5, 8]} label="NYC" align="end" dx={-8} />
      <Chip at={[-110, -110, 46]} label="CHI" align="start" dx={12} />
      <Chip at={[-5, -215, 8]} label="TOR" align="start" dx={8} />
      <Chip at={[-10, -70, 0]} label="Median" tone="lilac" align="start" dx={10} dy={10} />
      <Chip at={[202, 60, 7]} label="Cockpit" tone="acid" align="start" dx={10} />
      <Chip at={[22, 164, 7]} label="Provable" tone="ink" align="end" dx={-10} />
    </IsoScene>
  );
}
