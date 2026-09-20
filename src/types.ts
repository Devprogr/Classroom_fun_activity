export type BehaviourCategory = "positive" | "negative" | "leader";
export type RewardScope = "individual" | "class";
export type EntryType = "award" | "redeem" | "manual";

export interface ClassInfo {
  name: string;
  createdAt: number;
}

export interface Student {
  id: string;
  firstName: string;
  emoji: string;
  colour: string;
  points: number;
}

export interface Behaviour {
  id: string;
  label: string;
  value: number;
  category: BehaviourCategory;
  note?: string;
  active: boolean;
}

export interface Reward {
  id: string;
  label: string;
  cost: number;
  scope: RewardScope;
  active: boolean;
}

export interface Entry {
  id: string;
  timestamp: number;
  studentIds: string[];
  behaviourId?: string;
  rewardId?: string;
  label: string;
  value: number;
  type: EntryType;
  /** Class-level entries (class reward redemptions) don't change any student's points. */
  classLevel?: boolean;
}

export interface AppState {
  setupComplete: boolean;
  pin: string | null;
  classInfo: ClassInfo;
  students: Student[];
  behaviours: Behaviour[];
  rewards: Reward[];
  log: Entry[];
}
