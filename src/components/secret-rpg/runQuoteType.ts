import { FIGHT_W, FIGHT_H, MiniGameConfig, MiniGameResult } from "./types";

// ─── Motivational Quotes ───────────────────────────────────────────

const QUOTES = [
  "CODE IS POETRY IN MOTION",
  "SHE BELIEVED SHE COULD SO SHE DID",
  "EVERY EXPERT WAS ONCE A BEGINNER",
  "YOUR ONLY LIMIT IS YOUR CODE",
  "DEBUG THE PROBLEM NOT YOURSELF",
  "MAKE IT WORK MAKE IT RIGHT MAKE IT FAST",
  "THE BEST TIME TO START WAS YESTERDAY",
  "DONE IS BETTER THAN PERFECT",
  "SMALL STEPS LEAD TO BIG BREAKTHROUGHS",
  "FIX IT UNTIL IT WORKS THEN REFACTOR",
  "STAY CURIOUS KEEP LEARNING",
  "HER CODE CHANGED THE WORLD ONCE TOO",
  "BUILD SOMETHING THAT MATTERS",
  "FAILURE IS JUST ANOTHER DATA POINT",
  "YOU BELONG IN EVERY ROOM YOU ENTER",
  "YOUR VOICE YOUR CODE YOUR IMPACT",
  "PROGRESS NOT PERFECTION",
  "CODE LIKE A GIRL BREAK THE RULES",
  "RISE AND REVISION CONTROL",
  "COMMIT TO YOUR DREAMS EVERY DAY",
  "TECH NEEDS MORE WOMEN LIKE YOU",
  "THE FUTURE IS FEMALE AND CODED",
  "BE THE ENGINEER YOU WANT TO SEE",
  "YOUR POTENTIAL IS INFINITE LOOP",
  "FIRST SOLVE THE PROBLEM THEN WRITE CODE",
];

// ─── Quote Type Mini-Game ──────────────────────────────────────────
// A motivational quote appears word by word on screen.
// Type each word correctly and press Space to advance.
// 5 correct words = win, 3 mistakes = lose.

export function runQuoteType(
  _config: MiniGameConfig,
  _playerItems: string[],
): Promise<MiniGameResult> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:999;overflow:hidden";
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;display:block;image-rendering:pixelated";
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);
    const ctx = canvas.getContext("2d")!;
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    // Pick one quote and split into words
    const shuffled = [...QUOTES].sort(() => Math.random() - 0.5);
    const quote = shuffled[0];
    const words = quote.split(" ");

    const state = {
      currentWordIndex: 0,
      typed: "",
      correctCount: 0,
      mistakes: 0,
      result: "none" as "win" | "lose" | "none",
      flashMessage: "",
      flashTimer: 0,
    };

    let animId = 0;

    const kd = (e: KeyboardEvent) => {
      if (state.result !== "none") return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const target = words[state.currentWordIndex];
        if (state.typed.toUpperCase() === target) {
          state.correctCount++;
          state.currentWordIndex++;
          state.typed = "";
          state.flashMessage = "✅";
          state.flashTimer = 15;
          if (state.correctCount >= 5) {
            state.result = "win";
          }
        } else {
          state.mistakes++;
          state.typed = "";
          state.flashMessage = "❌";
          state.flashTimer = 15;
          if (state.mistakes >= 3) {
            state.result = "lose";
          }
        }
        return;
      }

      if (e.key === "Backspace") {
        state.typed = state.typed.slice(0, -1);
        e.preventDefault();
        return;
      }

      // Only allow letters, numbers, apostrophes
      if (/^[a-zA-Z0-9']$/.test(e.key) && state.typed.length < 20) {
        state.typed += e.key.toUpperCase();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", kd);

    const loop = () => {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      const sx = W / FIGHT_W;
      const sy = H / FIGHT_H;

      // Warm gradient background
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.scale(sx, sy);

      // Pink glowing border
      ctx.strokeStyle = "rgba(236,72,153,0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, FIGHT_W - 40, FIGHT_H - 40);

      // Title
      ctx.fillStyle = "rgba(236,72,153,0.4)";
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.textAlign = "left";
      ctx.fillText("> QUOTE.EXE — MOTIVATION BOOST", 40, 50);

      // Progress
      const pct = Math.max(0, state.correctCount) / 5;
      ctx.fillStyle = "rgba(236,72,153,0.3)";
      ctx.fillRect(40, 60, FIGHT_W - 80, 6);
      ctx.fillStyle = "#ec4899";
      ctx.fillRect(40, 60, (FIGHT_W - 80) * pct, 6);

      // Heart icon
      ctx.font = "48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("💪", FIGHT_W / 2, 120);

      // Current target word (large, pink)
      if (state.currentWordIndex < words.length) {
        const target = words[state.currentWordIndex];
        ctx.fillStyle = "#f472b6";
        ctx.font = 'bold 28px "Courier New", monospace';
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(236,72,153,0.4)";
        ctx.shadowBlur = 15;
        ctx.fillText(target, FIGHT_W / 2, 185);
        ctx.shadowBlur = 0;
      }

      // Typing indicator
      ctx.fillStyle = "#e2e8f0";
      ctx.font = 'bold 22px "Courier New", monospace';
      const display = state.typed + (Date.now() % 1000 < 500 ? "█" : " ");
      ctx.fillText(display, FIGHT_W / 2, 225);

      // Flash indicator
      if (state.flashTimer > 0) {
        state.flashTimer--;
        ctx.fillStyle = state.flashMessage === "✅" ? "#4ade80" : "#ef4444";
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        ctx.textAlign = "center";
        ctx.fillText(state.flashMessage + (state.flashMessage === "✅" ? " CORRECT!" : " WRONG!"), FIGHT_W / 2, 265);
      }

      // Remaining words hint
      const remaining = words.slice(state.currentWordIndex, Math.min(state.currentWordIndex + 5, words.length));
      if (remaining.length > 1 && state.correctCount > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.font = '8px "Courier New", monospace';
        ctx.textAlign = "center";
        ctx.fillText("NEXT: " + remaining.slice(1).join("  "), FIGHT_W / 2, 300);
      }

      // Score + Mistakes
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.textAlign = "right";
      ctx.fillText(`${state.correctCount}/5 WORDS · ${state.mistakes}/3 MISS`, FIGHT_W - 40, 50);

      // Hint
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillText("TYPE THE WORD + SPACE/ENTER TO SUBMIT", FIGHT_W / 2, 340);

      // Desktop-only controls
      const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
      if (!isMobile) {
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = "right";
        ctx.fillText("TYPE & SPACE TO SUBMIT · 5 WORDS = WIN", FIGHT_W - 10, 22);
      }

      ctx.restore();

      // Result
      if (state.result === "win") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fbbf24";
        ctx.font = `bold ${Math.min(18 * sx, 18 * sy)}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("💪 MOTIVATION RESTORED! 💪", W / 2, H / 2 - 10 * sy);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${Math.min(10 * sx, 10 * sy)}px "Press Start 2P", monospace`;
        ctx.fillText("You've got this! Quote completed!", W / 2, H / 2 + 25 * sy);
      }
      if (state.result === "lose") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ef4444";
        ctx.font = `bold ${Math.min(16 * sx, 16 * sy)}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("😤 KEEP TRYING!", W / 2, H / 2 - 10 * sy);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${Math.min(9 * sx, 9 * sy)}px "Press Start 2P", monospace`;
        ctx.fillText("3 mistakes — need more practice!", W / 2, H / 2 + 25 * sy);
      }

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    const checkInterval = setInterval(() => {
      if (state.result === "win" || state.result === "lose") {
        clearInterval(checkInterval);
        setTimeout(() => {
          cancelAnimationFrame(animId);
          window.removeEventListener("keydown", kd);
          window.removeEventListener("resize", onResize);
          document.body.removeChild(overlay);
          resolve({ won: state.result === "win" });
        }, 1800);
      }
    }, 200);
  });
}
