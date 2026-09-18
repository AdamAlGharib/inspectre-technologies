import { Box, Chip, Disk, Float, Gem, GroundArc, IsoScene, Wire } from "../iso";
import type { P3, Tone } from "../iso";

/** Ring centre in world space; chosen so the whole composition sits centred in the viewBox. */
const C = 28;
const R_OUTER = 165;
const R_INNER = 100;
const CUBE = 30;

/** Where every source wire converges: the middle of the policy gate, just in front of the ring centre. */
const GATE: P3 = [C + 25, C + 40, 0];
const GATE_W = 52;
const GATE_D = 44;
/** The evidence stack stands on the outer ring, straight along +x from the gate. */
const STACK: readonly [number, number] = [C + 160, C + 40];
const STACK_R = 40;

type Source = { id: string; angle: number; h: number; tone: Tone };

const SOURCES: Source[] = [
  { id: "a", angle: 180, h: 24, tone: "paper" },
  { id: "b", angle: 210, h: 40, tone: "paper" },
  { id: "c", angle: 240, h: 52, tone: "lilacSoft" },
  { id: "d", angle: 270, h: 30, tone: "paper" },
  { id: "e", angle: 300, h: 20, tone: "paper" },
];
const DROPPED_SOURCE: Source = { id: "f", angle: 150, h: 34, tone: "paper" };

/** Rounds to an integer after clearing float noise, so 82.49999999999999 and 82.50000000000001 agree on every engine. */
const snap = (value: number) => Math.round(Math.round(value * 1e6) / 1e6);

const onRing = (angle: number, r = R_OUTER): P3 => {
  const a = (angle * Math.PI) / 180;
  return [snap(r * Math.cos(a)) + C, snap(r * Math.sin(a)) + C, 0];
};

/** The provenance trail: from the evidence stack back round the front of the ring to a source. */
const TRAIL: P3[] = Array.from({ length: 35 }, (_, i) => onRing(14 + i * 4));

const DROPPED_FROM = onRing(DROPPED_SOURCE.angle);
/** The dropped signal gives up half way to the gate. */
const DROPPED_AT: P3 = [Math.round((DROPPED_FROM[0] + GATE[0]) / 2), Math.round((DROPPED_FROM[1] + GATE[1]) / 2), 0];

/** Public signals are swept up, pass a policy gate, and leave as a stack of traceable evidence. */
export function RadarScene() {
  return (
    <IsoScene
      title="Six public sources on a radar floor send signals through a policy gate; one is dropped and the rest become a stack of traceable evidence"
      viewBox="-270 -210 540 410"
    >
      {/* radar floor */}
      <GroundArc at={[C, C, 0]} r={R_OUTER} from={150} to={374} dashed />
      <GroundArc at={[C, C, 0]} r={R_INNER} dashed />
      <GroundArc at={[C, C, 0]} r={R_OUTER} from={172} to={222} sector tone="acidSoft" />

      {/* signals converge on the gate */}
      {SOURCES.map((s, i) => (
        <Wire key={s.id} points={[onRing(s.angle), GATE]} flow={i === 1} packet={i === 1} dur={5} />
      ))}
      <Wire points={[DROPPED_FROM, DROPPED_AT]} />
      <Wire points={TRAIL} tone="lilac" flow packet packetTone="lilac" dur={9} />

      {/* sources around the back of the ring */}
      {[...SOURCES, DROPPED_SOURCE].map((s) => {
        const [x, y] = onRing(s.angle);
        return <Box key={s.id} at={[x - CUBE / 2, y - CUBE / 2, 0]} size={[CUBE, CUBE, s.h]} tone={s.tone} />;
      })}

      {/* blips over the floor */}
      <Float amp={6} delay={0.8}>
        <Gem at={[C - 96, C - 30, 24]} s={12} />
        <Gem at={[C + 34, C - 100, 30]} s={9} tone="lilac" />
      </Float>

      {/* the one that does not pass */}
      <Box at={[DROPPED_AT[0] - 11, DROPPED_AT[1] - 11, 0]} size={[22, 22, 22]} tone="ghost" dashed />

      {/* policy gate */}
      <Box at={[GATE[0] - GATE_W / 2, GATE[1] - GATE_D / 2, 0]} size={[GATE_W, GATE_D, 6]} tone="paper" />
      <Box at={[GATE[0] - 9, GATE[1] - 9, 6]} size={[18, 18, 10]} tone="ink" />

      {/* evidence out: the wire stops where it meets the rim of the base disk */}
      <Wire points={[[GATE[0] + GATE_W / 2, GATE[1], 0], [STACK[0] - STACK_R - 12, STACK[1], 0]]} tone="acid" flow packet dur={3} />
      <Disk at={[STACK[0], STACK[1], 0]} r={STACK_R} h={14} bands={1} />
      <Disk at={[STACK[0], STACK[1], 30]} r={STACK_R} h={14} bands={1} />
      <Disk at={[STACK[0], STACK[1], 60]} r={STACK_R} h={14} bands={1} />
      <Float amp={4} dur={7}>
        <Disk at={[STACK[0], STACK[1], 92]} r={STACK_R} h={16} tone="acid" ring={0.6} />
      </Float>

      {/* labels */}
      <Chip at={onRing(225)} label="Sources" dy={-76} />
      <Chip at={[GATE[0] + GATE_W / 2, GATE[1] + GATE_D / 2, 0]} label="Policy gate" tone="ink" dy={20} />
      <Chip at={[STACK[0], STACK[1], 100]} label="Evidence" tone="acid" align="start" dx={58} dy={4} />
      <Chip at={DROPPED_AT} label="Dropped" align="end" dx={-24} dy={14} />
      <Chip at={onRing(74)} label="Provenance" tone="lilac" dy={22} />
    </IsoScene>
  );
}
