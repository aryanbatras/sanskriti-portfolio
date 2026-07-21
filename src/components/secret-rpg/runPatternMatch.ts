import { FIGHT_W, FIGHT_H, MiniGameConfig, MiniGameResult } from "./types";

// ─── Mobile detection ───────────────────────────────────────────────
let _isMobileCached: boolean | null = null;
function isMobile(): boolean {
  if (_isMobileCached !== null) return _isMobileCached;
  _isMobileCached = ("ontouchstart" in window && navigator.maxTouchPoints > 0) || window.innerWidth < 768;
  return _isMobileCached;
}

// ─── Button maker ───────────────────────────────────────────────────
function makeBtn(
  text: string,
  onDown: () => void,
  onUp: () => void,
): HTMLElement {
  const btn = document.createElement("div");
  btn.style.cssText =
    "display:flex;align-items:center;justify-content:center;" +
    "min-width:44px;min-height:44px;width:48px;height:48px;" +
    "background:rgba(255,255,255,0.15);border-radius:10px;" +
    "border:2px solid rgba(255,255,255,0.25);" +
    "color:#fff;font-size:18px;user-select:none;" +
    "touch-action:none;cursor:pointer;" +
    "font-family:'Press Start 2P',monospace;" +
    "transition:background 0.08s";
  btn.textContent = text;
  btn.addEventListener("touchstart", (e) => { e.preventDefault(); onDown(); }, { passive: false });
  btn.addEventListener("touchend", (e) => { e.preventDefault(); onUp(); }, { passive: false });
  btn.addEventListener("touchcancel", (e) => { e.preventDefault(); onUp(); }, { passive: false });
  btn.addEventListener("mousedown", () => onDown());
  btn.addEventListener("mouseup", () => onUp());
  btn.addEventListener("mouseleave", () => onUp());
  return btn;
}

// ─── Mobile controls ────────────────────────────────────────────────
let _mobileControlsPattern: HTMLElement[] = [];

function addMobileControls(
  container: HTMLElement,
  onDirection: (dir: string) => void,
) {
  if (!isMobile()) return;

  const pad = document.createElement("div");
  pad.style.cssText =
    "position:absolute;bottom:20px;left:50%;transform:translateX(-50%);" +
    "display:grid;grid-template-columns:48px 48px 48px;grid-template-rows:48px 48px 48px;" +
    "gap:4px;justify-items:center;align-items:center;z-index:1000";

  // Grid positions: [row][col]
  // [empty]  [↑]  [empty]
  // [←]      [·]  [→]
  // [empty]  [↓]  [empty]

  const blank = () => {
    const d = document.createElement("div");
    d.style.cssText = "width:48px;height:48px";
    return d;
  };

  const btnUp = makeBtn("↑", () => onDirection("ArrowUp"), () => {});
  btnUp.style.background = "rgba(74,222,128,0.2)";
  btnUp.style.borderColor = "rgba(74,222,128,0.4)";
  const btnLeft = makeBtn("←", () => onDirection("ArrowLeft"), () => {});
  const btnRight = makeBtn("→", () => onDirection("ArrowRight"), () => {});
  const btnDown = makeBtn("↓", () => onDirection("ArrowDown"), () => {});
  btnDown.style.background = "rgba(74,222,128,0.2)";
  btnDown.style.borderColor = "rgba(74,222,128,0.4)";

  // Center dot
  const dot = document.createElement("div");
  dot.style.cssText =
    "width:48px;height:48px;display:flex;align-items:center;justify-content:center;" +
    "color:rgba(255,255,255,0.2);font-size:14px;" +
    "font-family:'Press Start 2P',monospace";
  dot.textContent = "·";

  pad.appendChild(blank());
  pad.appendChild(btnUp);
  pad.appendChild(blank());
  pad.appendChild(btnLeft);
  pad.appendChild(dot);
  pad.appendChild(btnRight);
  pad.appendChild(blank());
  pad.appendChild(btnDown);
  pad.appendChild(blank());

  container.appendChild(pad);
  _mobileControlsPattern.push(pad);
}

// ─── Pattern Match Mini-Game ────────────────────────────────────────
// A sequence of arrow directions plays. Repeat it with arrow keys.
// 3 rounds to win (seq length 2 → 3 → 4 → victory).

const ARROWS = ["←", "↑", "→", "↓"];
const KEY_MAP: Record<string, string> = {
  ArrowLeft: "←", ArrowUp: "↑", ArrowRight: "→", ArrowDown: "↓",
};

export function runPatternMatch(
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

    let animId = 0;

    const state = {
      sequence: [] as string[],
      playerIndex: 0,
      showing: true,
      showStep: 0,
      showTimer: 0,
      round: 1,
      flash: "",
      flashTimer: 0,
      result: "none" as "win" | "lose" | "none",
    };

    // Generate first sequence
    const genSeq = (len: number) => {
      state.sequence = [];
      for (let i = 0; i < len; i++) {
        state.sequence.push(ARROWS[Math.floor(Math.random() * 4)]);
      }
    };
    genSeq(2);

    // Shared direction handler: used by both keyboard and mobile buttons
    const processDirection = (dir: string) => {
      if (state.result !== "none") return;
      if (state.showing) return;

      // Flash the pressed arrow
      state.flash = dir;
      state.flashTimer = 10;

      if (dir === state.sequence[state.playerIndex]) {
        state.playerIndex++;
        if (state.playerIndex >= state.sequence.length) {
          // Round complete!
          if (state.round >= 3) {
            state.result = "win";
          } else {
            state.round++;
            genSeq(state.round + 1);
            state.showing = true;
            state.showStep = 0;
            state.showTimer = 0;
            state.playerIndex = 0;
          }
        }
      } else {
        state.result = "lose";
      }
    };

    const kd = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key];
      if (!dir) return;
      e.preventDefault();
      processDirection(dir);
    };

    window.addEventListener("keydown", kd);

    // Add mobile D-pad controls
    _mobileControlsPattern = [];
    addMobileControls(overlay, processDirection);

    const loop = () => {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      const sx = W / FIGHT_W;
      const sy = H / FIGHT_H;

      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.scale(sx, sy);

      // Border glow
      ctx.strokeStyle = "rgba(99,102,241,0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, FIGHT_W - 40, FIGHT_H - 40);

      // Title
      ctx.fillStyle = "rgba(99,102,241,0.5)";
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = "left";
      ctx.fillText("> PATTERN.EXE", 40, 50);

      // Round counter
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = "right";
      ctx.fillText(`Round ${state.round}/3`, FIGHT_W - 40, 50);

      // ── Show sequence ──
      if (state.showing && state.result === "none") {
        state.showTimer++;
        if (state.showTimer > 40) {
          state.showTimer = 0;
          state.showStep++;
          if (state.showStep >= state.sequence.length) {
            state.showing = false;
            state.showStep = 0;
          }
        }
      }

      // Display current sequence arrow (large)
      const displayArrow = state.showing && state.showStep < state.sequence.length
        ? state.sequence[state.showStep]
        : !state.showing && state.playerIndex < state.sequence.length
          ? "?"
          : "✓";

      ctx.fillStyle = state.showing ? "#facc15" : state.flashTimer > 0 ? "#4ade80" : "#e2e8f0";
      ctx.font = 'bold 72px sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = state.showing ? "rgba(250,204,21,0.4)" : state.flashTimer > 0 ? "rgba(74,222,128,0.4)" : "transparent";
      ctx.shadowBlur = 20;
      ctx.fillText(displayArrow, FIGHT_W / 2, FIGHT_H / 2 - 20);
      ctx.shadowBlur = 0;

      // Progress dots
      for (let i = 0; i < state.sequence.length; i++) {
        const dotX = FIGHT_W / 2 - (state.sequence.length - 1) * 15 + i * 30;
        ctx.fillStyle = i < state.playerIndex ? "#4ade80" : "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(dotX, FIGHT_H / 2 + 50, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hint
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      const hint = state.showing
        ? "WATCH THE PATTERN..."
        : isMobile() ? "TAP THE ARROWS" : "REPEAT WITH ← ↑ → ↓";
      ctx.fillText(hint, FIGHT_W / 2, FIGHT_H - 40);

      // Mini pencil icon
      ctx.font = "32px sans-serif";
      ctx.fillText("✏️", FIGHT_W / 2, FIGHT_H - 100);

      // Flash timer decay
      if (state.flashTimer > 0) state.flashTimer--;

      ctx.restore();

      // Result (full-screen)
      if (state.result === "win") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fbbf24";
        ctx.font = `bold ${Math.min(20 * sx, 20 * sy)}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("🎯 PATTERN PERFECT! 🎯", W / 2, H / 2 - 10 * sy);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${Math.min(10 * sx, 10 * sy)}px "Press Start 2P", monospace`;
        ctx.fillText("Pencil confused by your reflexes!", W / 2, H / 2 + 25 * sy);
      }
      if (state.result === "lose") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ef4444";
        ctx.font = `bold ${Math.min(18 * sx, 18 * sy)}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("💫 PATTERN BROKEN", W / 2, H / 2 - 10 * sy);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${Math.min(9 * sx, 9 * sy)}px "Press Start 2P", monospace`;
        ctx.fillText("Pencil outsmarted you! Try again.", W / 2, H / 2 + 25 * sy);
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
          for (const el of _mobileControlsPattern) {
            if (el.parentNode) el.parentNode.removeChild(el);
          }
          _mobileControlsPattern = [];
          document.body.removeChild(overlay);
          resolve({ won: state.result === "win" });
        }, 1800);
      }
    }, 200);
  });
}
