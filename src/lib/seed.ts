import type { Behaviour, Reward } from "../types";
import { makeId } from "./id";

interface SeedBehaviour {
  label: string;
  value: number;
  category: Behaviour["category"];
  note?: string;
}

const SEED_BEHAVIOURS: SeedBehaviour[] = [
  // Positive
  { label: "Ready and prepared for the day", value: 5, category: "positive", note: "per day" },
  { label: "Assignment completed on time", value: 10, category: "positive", note: "per day" },
  { label: "Homework completed on time", value: 10, category: "positive", note: "per day" },
  { label: "Project completed on time", value: 25, category: "positive", note: "per project" },
  { label: "Participating in a school event", value: 25, category: "positive", note: "per event" },
  { label: "Helping Mr. A", value: 10, category: "positive", note: "per day" },
  { label: "Winning or receiving a school award", value: 100, category: "positive", note: "per award" },
  { label: "Weekly cleaner, job completed", value: 25, category: "positive", note: "per week" },
  // Leader (weekly roles)
  { label: "President", value: 50, category: "leader", note: "per week" },
  { label: "Vice President", value: 40, category: "leader", note: "per week" },
  { label: "Secretary", value: 30, category: "leader", note: "per week" },
  { label: "Botanist / Plant Manager", value: 30, category: "leader", note: "per week" },
  { label: "Head Cleaner", value: 30, category: "leader", note: "per week" },
  { label: "Messenger", value: 25, category: "leader", note: "per week" },
  { label: "Calendar Manager", value: 25, category: "leader", note: "per week" },
  { label: "Music Manager", value: 25, category: "leader", note: "per week" },
  // Negative
  { label: "Not working during assigned work time", value: -10, category: "negative" },
  { label: "Not using work time responsibly after reminders", value: -10, category: "negative" },
  { label: "Choosing not to complete assigned work", value: -10, category: "negative" },
  { label: "Did not complete classroom job", value: -10, category: "negative" },
  { label: "Disrespectful or rude behaviour", value: -25, category: "negative" },
  { label: "Repeated or serious disrespect", value: -50, category: "negative" },
];

interface SeedReward {
  label: string;
  cost: number;
  scope: Reward["scope"];
}

const SEED_REWARDS: SeedReward[] = [
  // Individual
  { label: "Milk candy", cost: 50, scope: "individual" },
  { label: "Fruit candy", cost: 60, scope: "individual" },
  { label: "Snacks", cost: 300, scope: "individual" },
  { label: "10 minutes of free time", cost: 600, scope: "individual" },
  { label: "10 minutes on a Chromebook", cost: 700, scope: "individual" },
  { label: "A small random toy", cost: 1000, scope: "individual" },
  { label: "Printing anything", cost: 5000, scope: "individual" },
  { label: "A 3D print of your favourite anime", cost: 10000, scope: "individual" },
  // Class
  { label: "Movie hour", cost: 50000, scope: "class" },
  { label: "Game day", cost: 100000, scope: "class" },
];

export function createSeedBehaviours(): Behaviour[] {
  return SEED_BEHAVIOURS.map((b) => ({ id: makeId(), active: true, ...b }));
}

export function createSeedRewards(): Reward[] {
  return SEED_REWARDS.map((r) => ({ id: makeId(), active: true, ...r }));
}
