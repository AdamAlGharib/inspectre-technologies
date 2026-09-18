import { Box, Chip, Disk, Float, Gem, IsoScene, Panel, Plate, TopMark, Wire } from "../iso";

/** Signals come in at the back, pass the core and a human gate, and leave as working systems. */
export function HeroScene() {
  return (
    <IsoScene title="Signals flow into the Inspectre core, pass a human gate, and leave as working systems" viewBox="-340 -240 680 470">
      <Plate at={[-190, -190, 0]} size={[380, 380]} dashed />

      {/* incoming signals */}
      <Wire points={[[-170, -60, 0], [-60, -60, 0], [-60, 0, 0]]} flow packet dur={4.5} />
      <Wire points={[[-60, -170, 0], [-60, -60, 0]]} flow packet packetTone="lilac" dur={5.5} delay={1.2} />
      <Float amp={5}>
        <Box at={[-196, -86, 0]} size={[52, 52, 34]} tone="paper" />
        <Chip at={[-170, -60, 62]} label="Public sources" dx={-22} dy={6} />
      </Float>
      <Float amp={5} delay={1.4}>
        <Box at={[-82, -196, 0]} size={[44, 44, 44]} tone="lilacSoft" />
        <Chip at={[-60, -174, 74]} label="Sensors" tone="lilac" dx={20} />
      </Float>
      <Float amp={8} delay={0.6}>
        <Gem at={[-150, -150, 70]} s={16} />
        <Gem at={[-118, -180, 40]} s={10} tone="lilac" />
      </Float>

      {/* the core */}
      <Disk at={[0, 0, 0]} r={80} h={30} tone="paper" bands={2} />
      <Float amp={4} dur={7}>
        <Disk at={[0, 0, 44]} r={80} h={16} tone="acid" ring={0.62} />
      </Float>
      <Float amp={6} dur={7} delay={0.4}>
        <Disk at={[0, 0, 78]} r={54} h={20} tone="paper" bands={1} />
        <Box at={[-24, -24, 98]} size={[48, 48, 40]} tone="acid" />
        <TopMark at={[0, 0, 138]} s={30} />
      </Float>

      {/* human gate */}
      <Wire points={[[0, 80, 0], [0, 150, 0], [90, 150, 0]]} flow packet packetTone="ink" dur={5} delay={0.8} />
      <Panel at={[-34, 150, 0]} size={[68, 78]} along="x" tone="paper" lines={4} />

      {/* outputs */}
      <Wire points={[[80, 0, 0], [170, 0, 0]]} flow packet dur={3.5} />
      <Wire points={[[130, 0, 0], [130, -110, 0]]} />
      <Box at={[108, -150, 0]} size={[44, 44, 30]} tone="lilac" />
      <Chip at={[130, -128, 58]} label="Agent" />
      <Box at={[170, -26, 0]} size={[52, 52, 52]} tone="acidSoft" />
      <Chip at={[196, 0, 84]} label="Product" />
      <Box at={[90, 126, 0]} size={[48, 48, 24]} tone="paper" />
      <Box at={[98, 134, 24]} size={[32, 32, 18]} tone="ink" />
      <Chip at={[114, 150, 66]} label="Ship" tone="acid" />

      <Float amp={7} delay={2}>
        <Gem at={[220, 110, 40]} s={12} tone="lilac" />
        <Gem at={[60, 230, 30]} s={14} />
      </Float>

      {/* labels last so nothing covers them */}
      <Chip at={[0, 0, 196]} label="Inspectre core" tone="ink" />
      <Chip at={[80, 0, 52]} label="Signal" align="start" dx={14} />
      <Chip at={[-80, 0, 14]} label="Evidence" align="end" dx={-22} />
      <Chip at={[-34, 150, 92]} label="Human gate" tone="acid" align="end" dx={10} />
    </IsoScene>
  );
}
