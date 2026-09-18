import { Box, Chip, Disk, Float, Gem, IsoScene, Plate, Wire, type P3 } from "../iso";

/* The circuit: a rounded rectangle on the ground. Each station sits on the midpoint of a corner arc. */
const X0 = -43;
const X1 = 110;
const Y0 = -86;
const Y1 = 91;
const R = 44;
const INSET = 12.9; // R * (1 - cos 45deg): how far an arc midpoint sits inside its corner
const STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/** Quarter-circle on the ground around `c`, sweeping 90 degrees from `from` (degrees, +x toward +y). */
const arc = (c: readonly [number, number], from: number): P3[] =>
  STEPS.map((i) => {
    const a = ((from + (90 * i) / 8) * Math.PI) / 180;
    return [Math.round((c[0] + R * Math.cos(a)) * 100) / 100, Math.round((c[1] + R * Math.sin(a)) * 100) / 100, 0];
  });

const FRONT = arc([X1 - R, Y1 - R], 0);
const LEFT = arc([X0 + R, Y1 - R], 90);
const BACK = arc([X0 + R, Y0 + R], 180);
const RIGHT = arc([X1 - R, Y0 + R], 270);

/* eval (front) -> gate (left) -> audit (back) */
const INBOUND: P3[] = [...FRONT.slice(4), ...LEFT, ...BACK.slice(0, 5)];
/* audit (back) -> release (right) -> eval (front) */
const OUTBOUND: P3[] = [...BACK.slice(4), ...RIGHT, ...FRONT.slice(0, 5)];

const EVAL: readonly [number, number] = [X1 - INSET, Y1 - INSET];
/* the gate stands on the straight just past the left corner, so the wire runs squarely through its opening */
const GATE: readonly [number, number] = [X0, Y1 - R - 16];
const AUDIT: readonly [number, number] = [X0 + INSET, Y0 + INSET];
const RELEASE: readonly [number, number] = [X1 - INSET, Y0 + INSET];
const KILL_X = GATE[0] - 90;

/** Work does not end at launch: evaluation, a gate, an audit trail and release run as a closed loop, with a kill switch wired to the gate. */
export function HardPartScene() {
  return (
    <IsoScene
      title="A closed loop of wire on the ground links an eval cube, an upright gate, a stack of audit disks and a release plate, while a small separate kill switch is wired to the gate"
      viewBox="-220 -165 440 320"
    >
      {/* gate threshold: a mat on the ground between the posts, so the opening reads as a doorway */}
      <Plate at={[GATE[0] - 16, GATE[1] - 6, 0]} size={[32, 12]} tone="acidSoft" />

      {/* the loop: two halves, so a packet is always on each side */}
      <Wire points={INBOUND} tone="ink" flow packet dur={7} />
      <Wire points={OUTBOUND} tone="ink" flow packet packetTone="lilac" dur={7} />

      {/* kill switch line, off the loop */}
      <Wire points={[[KILL_X, GATE[1], 0], [GATE[0] - 24, GATE[1], 0]]} />

      {/* kill switch: small, dark, and on its own */}
      <Box at={[KILL_X - 9, GATE[1] - 9, 0]} size={[18, 18, 18]} tone="ink" />

      {/* audit: a stack of disks at the back corner */}
      <Disk at={[AUDIT[0], AUDIT[1], 0]} r={26} h={13} tone="paper" bands={1} />
      <Disk at={[AUDIT[0], AUDIT[1], 18]} r={26} h={13} tone="lilac" bands={1} />
      <Disk at={[AUDIT[0], AUDIT[1], 36]} r={26} h={13} tone="paper" ring={0.55} />

      {/* release: a low plate at the right corner */}
      <Box at={[RELEASE[0] - 27, RELEASE[1] - 27, 0]} size={[54, 54, 7]} tone="paper" />
      <Float amp={5} dur={7}>
        <Gem at={[RELEASE[0], RELEASE[1], 13]} s={18} />
      </Float>

      {/* gate: an upright frame the wire passes through */}
      <Box at={[GATE[0] - 24, GATE[1] - 4, 0]} size={[8, 8, 50]} tone="paper" />
      <Box at={[GATE[0] + 16, GATE[1] - 4, 0]} size={[8, 8, 50]} tone="paper" />
      <Box at={[GATE[0] - 28, GATE[1] - 6, 50]} size={[56, 12, 11]} tone="acid" />

      {/* eval: a small cube at the front corner */}
      <Box at={[EVAL[0] - 16, EVAL[1] - 16, 0]} size={[32, 32, 32]} tone="paper" />
      <Float amp={6} delay={1.5}>
        <Gem at={[EVAL[0], EVAL[1], 48]} s={14} tone="lilac" />
      </Float>

      {/* labels last */}
      <Chip at={[AUDIT[0], AUDIT[1], 49]} label="Audit" dy={-31} />
      <Chip at={[RELEASE[0] - 27, RELEASE[1] - 27, 7]} label="Release" dy={-20} />
      <Chip at={[GATE[0], GATE[1], 61]} label="Gate" tone="acid" dx={12} dy={-30} />
      <Chip at={[EVAL[0] + 16, EVAL[1] + 16, 0]} label="Eval" dy={18} />
      <Chip at={[KILL_X, GATE[1], 18]} label="Kill switch" tone="ink" dx={-6} dy={-24} />
    </IsoScene>
  );
}
