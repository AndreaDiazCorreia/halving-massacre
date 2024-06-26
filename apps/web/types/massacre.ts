export type MassacreStatus = 'SETUP' | 'INITIAL' | 'NORMAL' | 'FREEZE' | 'FINAL';

export interface MassacreStatusEventContent {
  currentBlock: number;
  top100Players: { [walias: string]: number };
  currentPool: number;
  playerCount: number;
  nextFreeze: number;
  nextMassacre: number;
  status: MassacreStatus;
  roundLength: number;
  freezeDuration: number;
}
