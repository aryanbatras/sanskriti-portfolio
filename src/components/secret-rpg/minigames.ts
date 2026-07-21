import { MiniGameConfig, MiniGameResult } from "./types";
import { runStreetFight } from "./runStreetFight";
import { runCoffeeCatch } from "./runCoffeeCatch";
import { runCodeType } from "./runCodeType";
import { runLogicPuzzle } from "./runLogicPuzzle";
import { runPatternMatch } from "./runPatternMatch";
import { runQuoteType } from "./runQuoteType";

// ─── Mini-game configs ─────────────────────────────────────────────
// Street fight appears only ONCE (bugFight). Everything else uses
// unique mini-games for variety.

export const MINI_GAMES: Record<string, MiniGameConfig> = {
  // Cafeteria — catch falling coffee cups (EASY)
  coffeeFight: {
    type: "coffeeCatch",
    grantItem: "coffee",
    difficulty: 1,
  },

  // Library — pattern matching with the pencil (MEDIUM)
  patternFight: {
    type: "patternMatch",
    difficulty: 2,
  },

  // Library (caffeinated) — code typing challenge (MEDIUM)
  codeType: {
    type: "codeType",
    timeLimit: 40,
    difficulty: 2,
  },

  // Bug encounter — ONLY street fight in the game (HARD)
  // Hard fights = enemies with more HP!
  bugFight: {
    type: "streetFight",
    enemies: [{ type: "bug", hp: 2 }],
    speedMult: 1.4,
    hpMult: 2,
    difficulty: 3,
  },

  // Bug encounter — logic puzzle alternative (MEDIUM)
  logicPuzzle: {
    type: "logicPuzzle",
    difficulty: 2,
  },

  // Victory approach — motivational quote typing (EASY)
  quoteFight: {
    type: "quoteType",
    difficulty: 1,
  },
};

// ─── Runner: dispatches to the right mini-game function ─────────────

export async function runMiniGame(
  config: MiniGameConfig,
  playerItems: string[],
): Promise<MiniGameResult> {
  switch (config.type) {
    case "streetFight":
      return runStreetFight(config, playerItems);
    case "coffeeCatch":
      return runCoffeeCatch(config, playerItems);
    case "codeType":
      return runCodeType(config, playerItems);
    case "logicPuzzle":
      return runLogicPuzzle(config, playerItems);
    case "patternMatch":
      return runPatternMatch(config, playerItems);
    case "quoteType":
      return runQuoteType(config, playerItems);
    default:
      return { won: false };
  }
}
