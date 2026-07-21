import { FIGHT_W, FIGHT_H, MiniGameConfig, MiniGameResult } from "./types";

// ─── Visual Effects ────────────────────────────────────────────────

interface HitFlash {
  x: number;
  y: number;
  timer: number;
  maxTimer: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

function spawnCoffeeBurst(x: number, y: number, flashes: HitFlash[], particles: Particle[]) {
  flashes.push({ x, y, timer: 10, maxTimer: 10, color: "#fbbf24" });
  const colors = ["#fbbf24", "#f59e0b", "#d97706", "#fff8e1", "#ffedd5"];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
    const speed = 1 + Math.random() * 2.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 12 + Math.floor(Math.random() * 8),
      maxLife: 20,
      size: 2 + Math.floor(Math.random() * 3),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function spawnPencilHit(x: number, y: number, flashes: HitFlash[], particles: Particle[]) {
  flashes.push({ x, y, timer: 8, maxTimer: 8, color: "#ef4444" });
  const colors = ["#ef4444", "#dc2626", "#f87171", "#fff", "#fca5a5"];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.3;
    const speed = 1.5 + Math.random() * 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 10 + Math.floor(Math.random() * 8),
      maxLife: 18,
      size: 2 + Math.floor(Math.random() * 2),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

// ─── Falling Item ───────────────────────────────────────────────────

interface FallingItem {
  x: number;
  y: number;
  type: "coffee" | "pencil";
  speed: number;
  active: boolean;
}

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
    "min-width:44px;min-height:44px;padding:8px 14px;" +
    "background:rgba(255,255,255,0.15);border-radius:10px;" +
    "border:2px solid rgba(255,255,255,0.25);" +
    "color:#fff;font-size:16px;user-select:none;" +
    "touch-action:none;cursor:pointer;" +
    "font-family:'Press Start 2P',monospace;" +
    "transition:background 0.1s";
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
let _mobileControlsCoffee: HTMLElement[] = [];

function addMobileControls(container: HTMLElement, keys: Record<string, boolean>) {
  if (!isMobile()) return;

  // ── D-pad (Left / Right) ──
  const pad = document.createElement("div");
  pad.style.cssText =
    "position:absolute;bottom:10px;left:10px;" +
    "display:flex;gap:8px;align-items:center;z-index:1000";

  const btnL = makeBtn("◀", () => { keys["ArrowLeft"] = true; }, () => { keys["ArrowLeft"] = false; });
  const btnR = makeBtn("▶", () => { keys["ArrowRight"] = true; }, () => { keys["ArrowRight"] = false; });

  const spacer = document.createElement("div");
  spacer.style.cssText = "width:12px;height:1px";

  pad.appendChild(btnL);
  pad.appendChild(spacer);
  pad.appendChild(btnR);
  container.appendChild(pad);
  _mobileControlsCoffee.push(pad);

  // ── Dodge button ──
  const actions = document.createElement("div");
  actions.style.cssText =
    "position:absolute;bottom:10px;right:10px;" +
    "display:flex;gap:8px;z-index:1000";

  const btnDodge = makeBtn(
    "👊",
    () => { keys["Dodge"] = true; },
    () => { keys["Dodge"] = false; },
  );
  btnDodge.style.background = "rgba(250,204,21,0.25)";
  btnDodge.style.borderColor = "rgba(250,204,21,0.5)";
  actions.appendChild(btnDodge);
  container.appendChild(actions);
  _mobileControlsCoffee.push(actions);
}

// ─── Coffee Catch Mini-Game ─────────────────────────────────────────
// Player moves left/right at bottom, catches falling coffee cups (☕)
// and dodges falling pencils (✏️). Catch 5 coffees to win, 3 pencils = lose.

export function runCoffeeCatch(
  config: MiniGameConfig,
  _playerItems: string[],
): Promise<MiniGameResult> {
  const speedMult = config.speedMult || 1;
  const spawnRate = config.spawnRate || 1;
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

    // ── State ──
    const playerW = 60;
    const playerX = FIGHT_W / 2 - playerW / 2;
    let dodgeCooldown = 0;
    let dodgeDir = 1;
    const state = {
      playerX,
      caught: 0,
      hearts: 3,
      invincible: 0,
      dodgeFX: { x: 0, y: 0, timer: 0 },
      items: [] as FallingItem[],
      hitFlashes: [] as HitFlash[],
      particles: [] as Particle[],
      spawnTimer: 0,
      result: "none" as "win" | "lose" | "none",
    };

    const keys: Record<string, boolean> = {};
    let animId = 0;

    const kd = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    };
    const ku = (e: KeyboardEvent) => { keys[e.key] = false; };

    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    // Add mobile controls
    _mobileControlsCoffee = [];
    addMobileControls(overlay, keys);

    const loop = () => {
      state.invincible = Math.max(0, state.invincible - 1);
      dodgeCooldown = Math.max(0, dodgeCooldown - 1);
      if (state.dodgeFX.timer > 0) state.dodgeFX.timer--;

      // ── Player movement ──
      if (keys["ArrowLeft"]) state.playerX -= 4;
      if (keys["ArrowRight"]) state.playerX += 4;
      state.playerX = Math.max(0, Math.min(FIGHT_W - playerW, state.playerX));

      // ── Dodge action ──
      if (keys["Dodge"] && dodgeCooldown <= 0) {
        keys["Dodge"] = false;
        dodgeCooldown = 30;
        state.invincible = 20;
        // Quick shift in current movement direction (or default right)
        dodgeDir = keys["ArrowLeft"] ? -1 : 1;
        state.playerX += dodgeDir * 60;
        state.playerX = Math.max(0, Math.min(FIGHT_W - playerW, state.playerX));
        state.dodgeFX = { x: state.playerX + playerW / 2, y: FIGHT_H - 50, timer: 12 };
        // Dodge particles
        const colors = ["#facc15", "#fbbf24", "#fff8e1"];
        for (let i = 0; i < 6; i++) {
          state.particles.push({
            x: state.playerX + playerW / 2 + (Math.random() - 0.5) * 30,
            y: FIGHT_H - 50,
            vx: -dodgeDir * (2 + Math.random() * 3),
            vy: -2 + Math.random() * 2,
            life: 10 + Math.floor(Math.random() * 8),
            maxLife: 18,
            size: 3 + Math.floor(Math.random() * 3),
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }

      // ── Spawn items (scaled by difficulty) ──
      state.spawnTimer++;
      const spawnThreshold = (25 + Math.random() * 30) / spawnRate;
      if (state.spawnTimer > spawnThreshold) {
        state.spawnTimer = 0;
        // Harder = more pencils
        const coffeeChance = 0.55 - (speedMult - 1) * 0.15;
        const type = Math.random() < coffeeChance ? "coffee" : "pencil";
        state.items.push({
          x: Math.random() * (FIGHT_W - 30) + 15,
          y: -20,
          type,
          speed: (1.5 + Math.random() * 1.5) * speedMult,
          active: true,
        });
      }

      // ── Update items ──
      for (let i = state.items.length - 1; i >= 0; i--) {
        const item = state.items[i];
        if (!item.active) { state.items.splice(i, 1); continue; }
        item.y += item.speed;

        // Check if caught by player
        if (
          item.y > FIGHT_H - 70 &&
          item.y < FIGHT_H - 20 &&
          item.x > state.playerX &&
          item.x < state.playerX + playerW
        ) {
          item.active = false;
          if (item.type === "coffee") {
            spawnCoffeeBurst(item.x, FIGHT_H - 60, state.hitFlashes, state.particles);
            state.caught++;
            if (state.caught >= 5) { state.result = "win"; }
          } else {
            if (state.invincible <= 0) {
              spawnPencilHit(item.x, FIGHT_H - 60, state.hitFlashes, state.particles);
              state.hearts--;
              state.invincible = 30;
              if (state.hearts <= 0) { state.result = "lose"; }
            }
          }
        }

        // Remove off-screen
        if (item.y > FIGHT_H + 20) {
          state.items.splice(i, 1);
        }
      }

      // ── Update effects ──
      for (let fi = state.hitFlashes.length - 1; fi >= 0; fi--) {
        state.hitFlashes[fi].timer--;
        if (state.hitFlashes[fi].timer <= 0) state.hitFlashes.splice(fi, 1);
      }
      for (let pi = state.particles.length - 1; pi >= 0; pi--) {
        const pt = state.particles[pi];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.08;
        pt.life--;
        if (pt.life <= 0) state.particles.splice(pi, 1);
      }

      // ── Render ──
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      const sx = W / FIGHT_W;
      const sy = H / FIGHT_H;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.scale(sx, sy);

      // Falling items
      for (const item of state.items) {
        if (!item.active) continue;
        ctx.font = "28px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (item.type === "coffee") {
          ctx.shadowColor = "rgba(255,200,100,0.5)";
          ctx.shadowBlur = 10;
          ctx.fillText("☕", item.x, item.y);
        } else {
          ctx.shadowColor = "rgba(255,0,0,0.4)";
          ctx.shadowBlur = 8;
          ctx.fillText("✏️", item.x, item.y);
        }
        ctx.shadowBlur = 0;
      }

      // ── Hit flashes ──
      for (const f of state.hitFlashes) {
        const alpha = f.timer / f.maxTimer;
        ctx.save();
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = f.color;
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 20 + (1 - alpha) * 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── Particles ──
      for (const pt of state.particles) {
        const alpha = pt.life / pt.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
        ctx.restore();
      }

      // Player (draw character at bottom)
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 8;
      ctx.font = "38px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const blink = state.invincible > 0 && state.invincible % 6 < 3;
      if (!blink) ctx.fillText("🧑‍🎓", state.playerX + playerW / 2, FIGHT_H - 50);
      ctx.shadowBlur = 0;

      // ── Dodge flash ──
      if (state.dodgeFX.timer > 0) {
        const alpha = state.dodgeFX.timer / 12;
        ctx.save();
        ctx.globalAlpha = alpha * 0.4;
        ctx.fillStyle = "#facc15";
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(state.dodgeFX.x, state.dodgeFX.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Ground indicator
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0, FIGHT_H - 45, FIGHT_W, 2);

      // HUD — Coffee count
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(8, 8, 160, 26);
      ctx.fillStyle = "#fbbf24";
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.textAlign = "left";
      ctx.fillText("☕ ".repeat(state.caught) + "◎".repeat(5 - state.caught), 14, 26);

      // Hearts
      ctx.fillStyle = "#ef4444";
      ctx.fillText("♥".repeat(state.hearts) + "♡".repeat(3 - state.hearts), 14, 50);

      // Controls hint — DESKTOP ONLY
      if (!("ontouchstart" in window) && navigator.maxTouchPoints <= 0 && window.innerWidth >= 768) {
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = "right";
        ctx.fillText("← → CATCH ☕  DODGE ✏️", FIGHT_W - 10, 22);
      }

      ctx.restore();

      // Result (full-screen)
      if (state.result === "win") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fbbf24";
        ctx.font = `bold ${Math.min(20 * sx, 20 * sy)}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("☕ COFFEE GET! ☕", W / 2, H / 2 - 10 * sy);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${Math.min(10 * sx, 10 * sy)}px "Press Start 2P", monospace`;
        ctx.fillText("5 cups caught! Caffeine boost!", W / 2, H / 2 + 25 * sy);
      }
      if (state.result === "lose") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ef4444";
        ctx.font = `bold ${Math.min(18 * sx, 18 * sy)}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("💦 SOAKED!", W / 2, H / 2 - 10 * sy);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${Math.min(9 * sx, 9 * sy)}px "Press Start 2P", monospace`;
        ctx.fillText("Too many pencils hit you", W / 2, H / 2 + 25 * sy);
      }

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    // Check result
    const checkInterval = setInterval(() => {
      if (state.result === "win" || state.result === "lose") {
        clearInterval(checkInterval);
        setTimeout(() => {
          cancelAnimationFrame(animId);
          window.removeEventListener("keydown", kd);
          window.removeEventListener("keyup", ku);
          window.removeEventListener("resize", onResize);
          for (const el of _mobileControlsCoffee) {
            if (el.parentNode) el.parentNode.removeChild(el);
          }
          _mobileControlsCoffee = [];
          document.body.removeChild(overlay);
          resolve({ won: state.result === "win" });
        }, 1500);
      }
    }, 200);
  });
}
