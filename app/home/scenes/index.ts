import type { ComponentType } from "react";
import type { ProjectId } from "../content";
import { BuildScene } from "./BuildScene";
import { HardPartScene } from "./HardPartScene";
import { HitlScene } from "./HitlScene";
import { HiveScene } from "./HiveScene";
import { PbxScene } from "./PbxScene";
import { ProvisionScene } from "./ProvisionScene";
import { RadarScene } from "./RadarScene";
import { SummitScene } from "./SummitScene";
import { SystemScene } from "./SystemScene";
import { VoiceScene } from "./VoiceScene";
import { WedgeScene } from "./WedgeScene";

export { HeroScene } from "./HeroScene";

export const projectScenes: Record<ProjectId, ComponentType> = {
  provision: ProvisionScene,
  pbx: PbxScene,
  radar: RadarScene,
  hitl: HitlScene,
  voice: VoiceScene,
  hive: HiveScene,
  summit: SummitScene,
};

export const practiceScenes: Record<"wedge" | "system" | "build" | "hard", ComponentType> = {
  wedge: WedgeScene,
  system: SystemScene,
  build: BuildScene,
  hard: HardPartScene,
};
