// ─── Story Types ────────────────────────────────────────────────────

export interface Choice {
  text: string;
  next: string;
  sound?: string;
}

export interface Scene {
  id: string;
  text: string;
  img?: string;
  choices: Choice[];
  effects?: string;
}

// ─── Fight Types ────────────────────────────────────────────────────

export type FightResult = "win" | "lose";

export interface FightEnemyConfig {
  type: string;
  hp: number;
}

export interface FightEnemy extends FightEnemyConfig {
  x: number;
  y: number;
  maxHp: number;
  cooldown: number;
}

export interface FightChoiceMap {
  [sceneId: string]: {
    enemies: FightEnemyConfig[];
  };
}

// ─── Unified Mini-Game Types ────────────────────────────────────────

export type MiniGameType = "streetFight" | "coffeeCatch" | "codeType" | "logicPuzzle" | "patternMatch" | "quoteType";

export interface MiniGameConfig {
  type: MiniGameType;
  enemies?: FightEnemyConfig[];
  items?: string[];
  grantItem?: string;
  speedMult?: number;      // Enemy speed multiplier (default 1, max ~2)
  hpMult?: number;         // Enemy health multiplier (default 1, harder = more HP)
  spawnRate?: number;      // Coffee catch spawn rate multiplier (default 1)
  timeLimit?: number;      // Code type time limit in seconds (default 45)
  difficulty?: 1 | 2 | 3;  // 1=easy stars, 2=medium stars, 3=hard skulls
}

export interface MiniGameResult {
  won: boolean;
  items?: string[];
}

export type MiniGameRunner = (
  config: MiniGameConfig,
  playerItems: string[],
) => Promise<MiniGameResult>;

// ─── Save Data ──────────────────────────────────────────────────────

export interface SaveData {
  sceneId: string;
  minigameWon: Record<string, boolean>;
  playerItems: string[];
  savedAt: number;
}

export const SAVE_KEY = "secret-rpg-save";

// ─── Constants ──────────────────────────────────────────────────────

export const FIGHT_W = 600;
export const FIGHT_H = 380;
export const PLAYER_SPEED = 3;
export const ENEMY_SPEED = 0.7;
export const ATTACK_COOLDOWN = 40;

export const ASSETS: Record<string, string> = {
  player:   "/new_game_assets/Sanskriti_Idle.png",
  pencil:   "/new_game_assets/Pencil_Enemy.png",
  bug:      "/new_game_assets/Bug_Enemy.png",
  coffeeMug: "/new_game_assets/CoffeeMug_Enemy.png",
};

export const SFX_PATH = "/Triple Treat SFX";

export const FALLBACK_MAP: Record<string, string> = {
  coffeeFight: "cafeteria",
  patternFight: "library",
  bugFight: "bugEntrance",
  codeType: "libraryB",
  logicPuzzle: "bugEntrance",
  quoteFight: "bugEntrance",
};
