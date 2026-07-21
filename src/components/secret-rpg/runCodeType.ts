import { FIGHT_W, FIGHT_H, MiniGameConfig, MiniGameResult, getGameScale } from "./types";

// ─── Words ──────────────────────────────────────────────────────────

const WORDS = [
  "PYTHON", "ALGORITHM", "NEURAL", "TENSOR", "DEBUG",
  "ARRAY", "LOGIC", "PIXEL", "KERNEL", "MATRIX",
];

// ─── Code Typing Mini-Game ──────────────────────────────────────────
// A code word appears at the top. Type it and press Enter.
// 5 words correct = win. 45 second time limit = lose.

export function runCodeType(
  config: MiniGameConfig,
  _playerItems: string[],
): Promise<MiniGameResult> {
  const timeLimit = config.timeLimit || 45;
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

    // Pick 5 random words
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    const targetWords = shuffled.slice(0, 5);

    const state = {
      currentWordIndex: 0,
      typed: "",
      correct: 0,
      timeLeft: timeLimit,
      result: "none" as "win" | "lose" | "none",
    };

    let animId = 0;
    let timerId: ReturnType<typeof setInterval>;

    // ── Keyboard input ──
    const kd = (e: KeyboardEvent) => {
      if (state.result !== "none") return;

      if (e.key === "Enter") {
        if (state.typed.toUpperCase() === targetWords[state.currentWordIndex]) {
          state.correct++;
          state.currentWordIndex++;
          state.typed = "";
          if (state.correct >= 5) {
            state.result = "win";
          }
        } else {
          // Wrong — flash feedback by resetting typed
          state.typed = "";
        }
        e.preventDefault();
        return;
      }

      if (e.key === "Backspace") {
        state.typed = state.typed.slice(0, -1);
        e.preventDefault();
        return;
      }

      // Only allow letters
      if (/^[a-zA-Z]$/.test(e.key) && state.typed.length < 20) {
        state.typed += e.key.toUpperCase();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", kd);

    // Mobile keyboard input
    const isMobile = ("ontouchstart" in window && navigator.maxTouchPoints > 0) || window.innerWidth < 768;
    let mobileInput: HTMLInputElement | null = null;
    let mobileSubmitBtn: HTMLDivElement | null = null;
    if (isMobile) {
      mobileInput = document.createElement("input");
      mobileInput.type = "text";
      mobileInput.setAttribute("autocomplete", "off");
      mobileInput.setAttribute("autocorrect", "off");
      mobileInput.setAttribute("autocapitalize", "characters");
      mobileInput.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;z-index:10000;";
      overlay.appendChild(mobileInput);
      setTimeout(() => mobileInput?.focus(), 300);

      mobileInput.addEventListener("input", () => {
        if (state.result !== "none") return;
        state.typed = mobileInput!.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 20);
      });

      mobileSubmitBtn = document.createElement("div");
      mobileSubmitBtn.style.cssText =
        "position:fixed;bottom:20px;right:20px;z-index:10000;" +
        "background:rgba(0,255,100,0.3);border:2px solid rgba(0,255,100,0.5);" +
        "color:#fff;padding:14px 28px;border-radius:12px;" +
        "font-family:'Press Start 2P',monospace;font-size:12px;cursor:pointer;" +
        "touch-action:none;user-select:none;min-width:44px;min-height:44px;" +
        "display:flex;align-items:center;justify-content:center;";
      mobileSubmitBtn.textContent = "ENTER ▶";
      mobileSubmitBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (state.result !== "none") return;
        if (state.typed === targetWords[state.currentWordIndex]) {
          state.correct++;
          state.currentWordIndex++;
          state.typed = "";
          if (mobileInput) mobileInput.value = "";
          if (state.correct >= 5) state.result = "win";
        } else {
          state.typed = "";
          if (mobileInput) mobileInput.value = "";
        }
        setTimeout(() => mobileInput?.focus(), 50);
      });
      overlay.appendChild(mobileSubmitBtn);
    }

    // ── Timer ──
    timerId = setInterval(() => {
      state.timeLeft--;
      if (state.timeLeft <= 0 && state.result === "none") {
        state.result = "lose";
      }
    }, 1000);

    // ── Loop ──
    const loop = () => {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      const { scale, offsetX, offsetY } = getGameScale(W, H);

      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // Terminal frame
      ctx.strokeStyle = "rgba(0,255,100,0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, FIGHT_W - 40, FIGHT_H - 40);

      // Title
      ctx.fillStyle = "rgba(0,255,100,0.4)";
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = "left";
      ctx.fillText("> CODE.EXE", 40, 50);

      // Progress
      ctx.fillStyle = state.timeLeft > 15 ? "#4ade80" : state.timeLeft > 5 ? "#facc15" : "#ef4444";
      ctx.fillRect(40, 60, (FIGHT_W - 80) * (state.timeLeft / timeLimit), 4);

      // Word to type
      const current = targetWords[state.currentWordIndex] || "DONE";
      ctx.fillStyle = "#facc15";
      ctx.font = 'bold 24px "Courier New", monospace';
      ctx.textAlign = "center";
      ctx.fillText(current, FIGHT_W / 2, 120);

      // Typing indicator
      ctx.fillStyle = "#4ade80";
      ctx.font = 'bold 20px "Courier New", monospace';
      const display = state.typed + (Date.now() % 1000 < 500 ? "█" : " ");
      ctx.fillText(display, FIGHT_W / 2, 170);

      // Hint
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillText("TYPE THE WORD + ENTER", FIGHT_W / 2, 220);

      // Score
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = "right";
      ctx.fillText(`${state.correct}/5 · ${state.timeLeft}s`, FIGHT_W - 40, 50);

      // Laptop icon
      ctx.font = "48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("💻", FIGHT_W / 2, 300);

      ctx.restore();

      // Result (full-screen)
      if (state.result === "win") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fbbf24";
        ctx.font = `bold ${20 * scale}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("💻 HACKED! 💻", W / 2, H / 2 - 10 * scale);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${10 * scale}px "Press Start 2P", monospace`;
        ctx.fillText("Code compiled successfully!", W / 2, H / 2 + 25 * scale);
      }
      if (state.result === "lose") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ef4444";
        ctx.font = `bold ${18 * scale}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("⏰ TIME OUT", W / 2, H / 2 - 10 * scale);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${9 * scale}px "Press Start 2P", monospace`;
        ctx.fillText("Syntax error! Try again!", W / 2, H / 2 + 25 * scale);
      }

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    // Check result
    const checkInterval = setInterval(() => {
      if (state.result === "win" || state.result === "lose") {
        clearInterval(checkInterval);
        clearInterval(timerId);
        setTimeout(() => {
          cancelAnimationFrame(animId);
          clearInterval(timerId);
          window.removeEventListener("keydown", kd);
          window.removeEventListener("resize", onResize);
          if (mobileInput && mobileInput.parentNode) mobileInput.parentNode.removeChild(mobileInput);
          if (mobileSubmitBtn && mobileSubmitBtn.parentNode) mobileSubmitBtn.parentNode.removeChild(mobileSubmitBtn);
          document.body.removeChild(overlay);
          resolve({ won: state.result === "win" });
        }, 1500);
      }
    }, 200);
  });
}
