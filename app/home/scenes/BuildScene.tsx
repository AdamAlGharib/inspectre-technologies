import { Box, Chip, Dot, Float, Gem, IsoScene, Plate, TopMark, Wire } from "../iso";

/** Cube edge. */
const S = 48;
/** Ground height: lowers the whole scene so the tall stack sits centred in the view box. */
const G = -76;
/** Second storey, the hovering cube, and the top of the line it hangs from. */
const Z1 = G + S;
const Z2 = G + S * 2;
const HOVER = Z2 + 30;
const HOVER_TOP = HOVER + S;
const LINE_TOP = HOVER_TOP + 40;

/** Data flows into a structure of cubes while the final piece is lowered into place and an API flows out. */
export function BuildScene() {
  return (
    <IsoScene
      title="A structure built from cubes with the last cube being lowered into its gap, data flowing in from the left and an API flowing out to the right"
      viewBox="-220 -165 440 320"
    >
      {/* footprint, then ground wires */}
      <Plate at={[-S - 12, -S - 12, G]} size={[S * 2 + 24, S * 2 + 24]} dashed />
      <Wire points={[[-118, 88, G], [-S / 2, 88, G], [-S / 2, S, G]]} flow packet dur={4.5} />
      <Wire points={[[S, -S / 2, G], [88, -S / 2, G], [88, -118, G]]} flow packet packetTone="lilac" dur={4.5} delay={-1.5} />

      {/* endpoints */}
      <Box at={[-130, 76, G]} size={[24, 24, 8]} tone="paper" />
      <Box at={[-130, 76, G + 11]} size={[24, 24, 8]} tone="paper" />
      <Box at={[76, -130, G]} size={[24, 24, 20]} tone="lilac" />

      {/* base, 2 x 2 */}
      <Box at={[-S, -S, G]} size={[S, S, S]} />
      <Box at={[0, -S, G]} size={[S, S, S]} />
      <Box at={[-S, 0, G]} size={[S, S, S]} />
      <Box at={[0, 0, G]} size={[S, S, S]} />

      {/* ports where the wires meet the base */}
      <Dot at={[-S / 2, S, G]} r={2.5} tone="ink" />
      <Dot at={[S, -S / 2, G]} r={2.5} tone="ink" />

      {/* second storey */}
      <Box at={[-S, -S, Z1]} size={[S, S, S]} />
      <Box at={[-S, 0, Z1]} size={[S, S, S]} tone="acidSoft" />

      {/* the gap the last piece is heading for */}
      <Wire points={[[0, 0, Z2], [S, 0, Z2], [S, -S, Z2], [0, -S, Z2]]} tone="ink" />
      <Wire points={[[S, 0, Z2], [S, 0, Z1]]} tone="ink" />
      <Wire points={[[S, -S, Z2], [S, -S, Z1]]} tone="ink" />

      {/* the last piece, on its line */}
      <Float amp={5} dur={7}>
        {/* the line starts level with the cube's back corner, so it never crosses the mark */}
        <Wire points={[[S / 2, -S / 2, HOVER_TOP + S / 2], [S / 2, -S / 2, LINE_TOP]]} tone="ink" />
        <Box at={[0, -S, HOVER]} size={[S, S, S]} tone="acid" />
        <TopMark at={[S / 2, -S / 2, HOVER_TOP]} s={24} />
        <Dot at={[S / 2, -S / 2, LINE_TOP]} r={2.5} tone="ink" />
      </Float>

      <Float amp={7} delay={1.2}>
        <Gem at={[-100, 40, 50]} s={13} tone="lilac" />
      </Float>
      <Float amp={6} delay={2.4} dur={7}>
        <Gem at={[159, -49, -60]} s={11} />
      </Float>

      {/* labels last so nothing covers them */}
      <Chip at={[-118, 88, G + 19]} label="Data" dy={-24} />
      <Chip at={[88, -118, G + 20]} label="API" tone="lilac" dy={-24} />
      <Chip at={[S, -S, HOVER + S / 2]} label="UI" tone="acid" align="start" dx={10} />
    </IsoScene>
  );
}
