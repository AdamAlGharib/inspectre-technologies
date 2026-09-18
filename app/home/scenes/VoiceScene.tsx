import { Box, Chip, Disk, Float, Gem, IsoScene, Plate, Wire } from "../iso";

/** Centre line of the call path, along the x axis. */
const LANE = -20;
const STEP_X0 = -180;
const STEP_W = 30;
const STEP_D = 44;
const STEP_RISE = 8;
const STEPS = [0, 1, 2, 3, 4] as const;
const STAIR_TOP = STEP_RISE * STEPS.length;
const STAIR_END = STEP_X0 + STEP_W * STEPS.length;

/** The receptionist walks a call up the steps and proposes; a person at the desk approves. */
export function VoiceScene() {
  return (
    <IsoScene
      title="A caller is walked up five steps to a pending booking that waits for a person at the staff desk to approve it, with a bypass line that hands the call straight to a person"
      viewBox="-270 -210 540 410"
    >
      <g transform="translate(-12 22)">
        {/* runway for the call, and the pad the desk stands on */}
        <Plate at={[-250, -80, 0]} size={[354, 108]} dashed />
        <Plate at={[28, 116, 0]} size={[84, 84]} dashed />

        {/* ground wires */}
        <Wire points={[[-222, LANE, 0], [STEP_X0, LANE, 0]]} />
        <Wire points={[[70, 8, 0], [70, 130, 0]]} flow packet packetTone="ink" dur={4} />

        {/* handoff plate, off the runway at the right */}
        <Box at={[125, -135, 0]} size={[40, 40, 6]} tone="ink" />

        {/* the caller */}
        <Disk at={[-222, LANE, 0]} r={18} h={10} tone="lilac" ring={0.55} />
        <Float amp={5} delay={0.8}>
          <Gem at={[-222, LANE, 28]} s={10} tone="lilac" />
        </Float>

        {/* the staircase: five abutting steps, each a little taller */}
        {STEPS.map((i) => (
          <Box key={i} at={[STEP_X0 + i * STEP_W, LANE - STEP_D / 2, 0]} size={[STEP_W, STEP_D, STEP_RISE * (i + 1)]} tone="paper" />
        ))}

        {/* pending tray with the proposed booking hovering on it */}
        <Box at={[42, -48, 0]} size={[56, 56, 8]} tone="paper" />
        <Float amp={4} delay={0.4}>
          <Box at={[54, -36, 13]} size={[32, 32, 3]} tone="acid" />
        </Float>
        <Wire points={[[STAIR_END - STEP_W / 2, LANE, STAIR_TOP], [70, LANE, STAIR_TOP], [70, LANE, 17]]} flow packet dur={3.5} />

        {/* staff desk, the hero */}
        <Box at={[42, 130, 0]} size={[56, 56, 48]} tone="paper" />
        <Box at={[48, 136, 48]} size={[44, 44, 5]} tone="acid" />
        <Float amp={5}>
          <Gem at={[70, 158, 90]} s={14} />
        </Float>

        {/* bypass to a person, above the staircase */}
        <Wire
          points={[[STEP_X0 + STEP_W / 2, LANE, STEP_RISE], [STEP_X0 + STEP_W / 2, LANE, 92], [145, LANE, 92], [145, -115, 92], [145, -115, 6]]}
          tone="lilac"
          packet
          packetTone="lilac"
          dur={7}
        />

        {/* labels last */}
        <Chip at={[STEP_X0 + STEP_W * 0.5, 28, 0]} label="Verify" />
        <Chip at={[STEP_X0 + STEP_W * 2.5, 28, 0]} label="Hold" />
        <Chip at={[STEP_X0 + STEP_W * 4.5, 28, 0]} label="Yes" />
        <Chip at={[14, 28, 0]} label="Pending" />
        <Chip at={[112, 116, 0]} label="Staff approves" tone="acid" align="start" dx={8} />
        <Chip at={[165, -95, 0]} label="Handoff" tone="ink" dy={14} />
      </g>
    </IsoScene>
  );
}
