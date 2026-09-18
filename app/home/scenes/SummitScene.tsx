import { Box, Chip, Dot, Float, Gem, IsoScene, Panel, Plate, Wire } from "../iso";

/* the stack of pre-recorded rounds */
const SX = -129;
const SY = -41;
const PLATE = 84;
const PITCH = 14;
const THICK = 5;
const PICK = 4;
const SLIDE = 50;
const PICK_Z = PICK * PITCH + THICK / 2;
const FRONT_Y = SY + PLATE;
const rounds = [0, 1, 2, 3, 4, 5, 6, 7];

/* the bet, lined up with the slot the round leaves behind */
const BET_X = SX + SLIDE / 2;
const BET_Y = FRONT_Y + 92;
const BET = 20;

/* payout leaves the exposed end of the chosen round */
const PAY_X = SX + PLATE + SLIDE / 2;
const PAY_Y = SY - 72;

/* the low grid of cells */
const GX = 21;
const GY = 69;
const CELL = 26;
const STEP = 32;
const cols = [0, 1, 2, 3];
const rows = [0, 1, 2];
const A_H = 14;
const B_H = 28;
const raised: Record<string, number> = { "3-2": A_H, "3-0": B_H };
const COL_X = GX + 3 * STEP + CELL / 2;
const A_Y = GY + 2 * STEP + CELL / 2;
const B_Y = GY + CELL / 2;
const JOIN_Z = 54;

/* the written review, straight behind the raised column */
const REVIEW_Y = -101;
const REVIEW_W = 56;
const REVIEW_H = 72;

/** One bet pulls one pre-recorded round out of the stack; two raised multipliers are checked against each other and written up. */
export function SummitScene() {
  return (
    <IsoScene
      title="One input slides a single pre-recorded round out of a tall stack to set the result, while two raised cells in a rule grid are joined by a wire that leads to a written review"
      viewBox="-270 -210 540 410"
    >
      <Plate at={[SX - 20, SY - 20, 0]} size={[PLATE + 40, PLATE + 40]} dashed />
      <Plate at={[GX - 16, GY - 16, 0]} size={[3 * STEP + CELL + 32, 2 * STEP + CELL + 32]} dashed />

      {/* the written review */}
      <Panel at={[COL_X - REVIEW_W / 2, REVIEW_Y, 0]} size={[REVIEW_W, REVIEW_H]} along="x" tone="paper" lines={5} />

      {/* the stack: one round slid out along +x */}
      {rounds.map((i) =>
        i === PICK ? (
          <Box key={i} at={[SX + SLIDE, SY, i * PITCH]} size={[PLATE, PLATE, THICK]} tone="acid" />
        ) : (
          <Box key={i} at={[SX, SY, i * PITCH]} size={[PLATE, PLATE, THICK]} tone="paper" />
        ),
      )}

      {/* payout leaves the chosen round */}
      <Wire points={[[PAY_X, SY, PICK_Z + THICK / 2], [PAY_X, PAY_Y, PICK_Z + THICK / 2]]} flow />
      <Dot at={[PAY_X, SY, PICK_Z + THICK / 2]} r={2.5} tone="acid" />

      {/* the bet enters the slot the round leaves */}
      <Box at={[BET_X - BET / 2, BET_Y - BET / 2, 0]} size={[BET, BET, BET]} tone="ink" />
      <Wire
        points={[[BET_X, BET_Y, BET], [BET_X, BET_Y, PICK_Z], [BET_X, FRONT_Y - 9, PICK_Z]]}
        tone="ink"
        flow
        packet
        packetTone="ink"
        dur={4}
      />
      <Dot at={[BET_X, FRONT_Y - 9, PICK_Z]} r={2.5} tone="ink" />

      {/* the grid */}
      {rows.map((r) =>
        cols.map((c) => {
          const h = raised[`${c}-${r}`];
          return (
            <Box
              key={`${c}-${r}`}
              at={[GX + c * STEP, GY + r * STEP, 0]}
              size={[CELL, CELL, h ?? 5]}
              tone={h ? "lilac" : "paper"}
            />
          );
        }),
      )}

      {/* two multipliers, one question, one written answer */}
      <Wire points={[[COL_X, B_Y, B_H], [COL_X, B_Y, JOIN_Z]]} />
      <Wire points={[[COL_X, A_Y, A_H], [COL_X, A_Y, JOIN_Z], [COL_X, REVIEW_Y, JOIN_Z]]} flow packet packetTone="lilac" dur={5} />
      <Dot at={[COL_X, REVIEW_Y, JOIN_Z]} r={2.5} tone="lilac" />

      <Float amp={6} delay={0.5}>
        <Gem at={[62, 236, 16]} s={13} />
        <Gem at={[96, 232, 34]} s={9} tone="lilac" />
      </Float>
      <Float amp={5} delay={2}>
        <Gem at={[-176, 20, 40]} s={11} tone="lilac" />
      </Float>
      <Float amp={5} delay={3.2}>
        <Gem at={[246, 30, 20]} s={10} tone="lilac" />
      </Float>

      {/* labels last so nothing covers them */}
      <Chip at={[BET_X + BET / 2, BET_Y + BET / 2, 0]} label="One input" tone="ink" dy={16} />
      <Chip at={[SX + SLIDE + PLATE, SY, PICK_Z]} label="One round" tone="acid" align="start" dx={8} />
      <Chip at={[PAY_X, PAY_Y, PICK_Z + THICK / 2]} label="Result" align="start" dx={5} />
      <Chip at={[COL_X, REVIEW_Y, REVIEW_H]} label="File:line" dy={-14} />
      <Chip at={[COL_X + CELL / 2, A_Y + CELL / 2, 0]} label="Rule A" dy={14} />
      <Chip at={[COL_X + CELL / 2, B_Y - CELL / 2, B_H]} label="Rule B" align="start" dx={8} />
      <Chip at={[COL_X, -10, JOIN_Z]} label="Two readings?" tone="acid" />
    </IsoScene>
  );
}
