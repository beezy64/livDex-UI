export class Pokemon {
  index?: number;
  nickname?: string;
  currentHp?: string;
  statusCondition?: string;
  typeOne?: string;
  typeTwo?: string;
  catchRate?: number;
  moveOneIndex?: number;
  moveTwoIndex?: number;
  moveThreeIndex?: number;
  moveFourIndex?: number;
  originalTrainerId?: string;
  xp?: number;
  hpEV?: number;
  attackEV?: number;
  defenseEV?: number;
  speedEV?: number;
  specialEV?: number;
  iv?: number;
  moveOnePP?: number;
  moveTwoPP?: number;
  moveThreePP?: number;
  moveFourPP?: number;

  constructor() {}

  public toString(): string {
    return `Pokemon index: ${this.index}\n` +
    `Nickname: ${this.nickname}\n` +
    `Current HP: ${this.currentHp}\n` +
    `Status Condition: ${this.statusCondition}\n` +
    `Type 1: ${this.typeOne}\n` +
    `Type 2: ${this.typeTwo}\n` +
    `Catch Rate: ${this.catchRate}\n` +
    `Original Trainer ID: ${this.originalTrainerId}`;
  }
}
