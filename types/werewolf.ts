export type WerewolfPhase = "night" | "police" | "speech" | "vote";

export type SetupTemplate = "预女猎白" | "预女猎守" | "狼王守卫" | "纯白夜影";

export type RoleOption = "平民" | "狼人" | "预言家" | "女巫" | "猎人" | "白痴";

export type PlayerNightAction = "" | "倒牌" | "出局" | "盲狙" | "救" | "毒";

export type PlayerIdentity =
  | "未知"
  | "狼人"
  | "预言家"
  | "女巫"
  | "猎人"
  | "白痴"
  | "平民";

export type PlayerStance = "摇摆" | `${number}`;

export interface Player {
  id: number;
  isAlive: boolean;
  role: string;
  side: string | null;
  voteFor: number | null;
  notes: string;
  nightAction?: PlayerNightAction;
  isSeerClaim: boolean;
  deadDay: number | null;
}

export interface GameConfig {
  totalPlayers: number;
  setup: string;
  mySeat: number;
  myRole: string;
}

export type LogEventType = "police" | "vote" | "death";

export type LogEvent = {
  type: LogEventType;
  detail: string;
};

export type DayLog = {
  day: number;
  events: LogEvent[];
};

export interface GameState {
  currentDay: number;
  phase: WerewolfPhase;
  logs: DayLog[];
}

