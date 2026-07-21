import {
  FightEnemy,
  MiniGameConfig,
  FIGHT_W,
  FIGHT_H,
  PLAYER_SPEED,
  ENEMY_SPEED,
  ATTACK_COOLDOWN,
  ASSETS,
} from "./types";
import { fightSfx } from "./sounds";

// ─── Visual Effects ────────────────────────────────────────────────

interface Projectile {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  emoji: string;
  hit: boolean;
}

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

interface GroundPickup {
  x: number;
  y: number;
  type: "phone" | "laptop" | "coffee" | "heart";
  pulse: number;
}

function spawnPlayerHitEffects(
  x: number,
  y: number,
  flashes: HitFlash[],
  particles: Particle[],
) {
  flashes.push({ x, y, timer: 10, maxTimer: 10, color: "#ef4444" });
  const colors = ["#ef4444", "#f87171", "#fca5a5", "#fff", "#fef2f2"];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
    const speed = 1 + Math.random() * 2.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 12 + Math.floor(Math.random() * 10),
      maxLife: 22,
      size: 2 + Math.floor(Math.random() * 3),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function spawnHitEffects(
  x: number,
  y: number,
  flashes: HitFlash[],
  particles: Particle[],
) {
  flashes.push({ x, y, timer: 8, maxTimer: 8, color: "#ffffff" });
  const colors = ["#ff4444", "#facc15", "#ff6b6b", "#ffdd00", "#ffffff"];
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
    const speed = 1.5 + Math.random() * 3;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 15 + Math.floor(Math.random() * 10),
      maxLife: 25,
      size: 2 + Math.floor(Math.random() * 3),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function spawnPickupFlash(x: number, y: number, flashes: HitFlash[], particles: Particle[]) {
  flashes.push({ x, y, timer: 6, maxTimer: 6, color: "#4ade80" });
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.4;
    const speed = 1 + Math.random() * 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 8 + Math.floor(Math.random() * 6),
      maxLife: 14,
      size: 2,
      color: colorsGreen[Math.floor(Math.random() * colorsGreen.length)],
    });
  }
}
const colorsGreen = ["#4ade80", "#22c55e", "#86efac", "#fbbf24", "#fff"];

// ─── Detect mobile ─────────────────────────────────────────────────
let _isMobileCached: boolean | null = null;
function isMobile(): boolean {
  if (_isMobileCached !== null) return _isMobileCached;
  _isMobileCached = typeof window !== "undefined" && (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth < 768
  );
  return _isMobileCached;
}

// ─── Street Fight Engine ────────────────────────────────────────────

export function runStreetFight(
  config: MiniGameConfig,
  playerItems: string[],
): Promise<{ won: boolean; items: string[] }> {
  const enemies = config.enemies || [];
  const speedMult = config.speedMult || 1;
  const hpMult = config.hpMult || 1;
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

    // ── Load images ──
    const imgs: Record<string, HTMLImageElement> = {};
    const needed = ["player", ...enemies.map((e) => e.type)];
    const neededUnique = [...new Set(needed)];
    const totalNeeded = neededUnique.length;
    let loaded = 0;
    for (const key of neededUnique) {
      const src = ASSETS[key];
      if (!src) {
        if (++loaded >= totalNeeded) start();
        continue;
      }
      const i = new Image();
      i.onload = () => { imgs[key] = i; if (++loaded >= totalNeeded) start(); };
      i.onerror = () => { if (++loaded >= totalNeeded) start(); };
      i.src = src;
    }
    if (totalNeeded === 0) start();

    // ── State ──
    // Player starts BOTTOM-LEFT, enemy starts TOP-RIGHT (opposite sides!)
    const pSpawnX = 100;
    const pSpawnY = FIGHT_H - 70;
    const eSpawnX = FIGHT_W - 100;
    const eSpawnY = 80;

    const state = {
      playerX: pSpawnX,
      playerY: pSpawnY,
      facingX: 1,
      facingY: 1,
      hearts: 3,
      invincible: 0,
      punchCooldown: 0,
      enemies: enemies.map(
        (e, i) =>
          ({
            x: eSpawnX + (i - (enemies.length - 1) / 2) * 80,
            y: eSpawnY,
            hp: Math.round(e.hp * hpMult),
            maxHp: Math.round(e.hp * hpMult),
            type: e.type,
            cooldown: 0,
          }) as FightEnemy,
      ),
      enemyTrails: [] as { x: number; y: number; alpha: number }[],
      items: playerItems.length > 0 ? [...playerItems] : ["phone", "laptop"],
      projectiles: [] as Projectile[],
      hitFlashes: [] as HitFlash[],
      particles: [] as Particle[],
      pickups: [] as GroundPickup[],
      pickupTimer: 0,
      shakeTimer: 0,
      result: "none" as "win" | "lose" | "none",
    };

    const keys: Record<string, boolean> = {};
    let animId = 0;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    function spawnPickup() {
      const types: GroundPickup["type"][] = ["phone", "laptop", "coffee", "heart", "phone", "laptop", "heart"];
      const type = types[Math.floor(Math.random() * types.length)];
      state.pickups.push({
        x: 50 + Math.random() * (FIGHT_W - 100),
        y: 50 + Math.random() * (FIGHT_H - 100),
        type,
        pulse: Math.random() * 100,
      });
    }

    function makeBtn(text: string, onDown: () => void, onUp: () => void): HTMLButtonElement {
      const b = document.createElement("button");
      b.textContent = text;
      b.style.cssText =
        "background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);" +
        "color:#fff;font-size:16px;border-radius:10px;padding:10px 12px;" +
        "touch-action:none;cursor:pointer;user-select:none;-webkit-user-select:none;" +
        "font-family:'Press Start 2P',monospace;min-width:44px;min-height:44px;" +
        "display:flex;align-items:center;justify-content:center;box-shadow:0 0 8px rgba(0,0,0,0.5);";
      b.addEventListener("touchstart", (e) => { e.preventDefault(); onDown(); });
      b.addEventListener("touchend", (e) => { e.preventDefault(); onUp(); });
      b.addEventListener("touchcancel", (e) => { e.preventDefault(); onUp(); });
      b.addEventListener("mousedown", () => onDown());
      b.addEventListener("mouseup", () => onUp());
      b.addEventListener("mouseleave", () => onUp());
      return b;
    }

    function addMobileControls(container: HTMLElement) {
      const pad = document.createElement("div");
      pad.style.cssText =
        "position:fixed;bottom:10px;left:5px;display:grid;grid-template-columns:48px 48px 48px;" +
        "grid-template-rows:48px 48px;gap:4px;z-index:1000;pointer-events:auto;";

      // Empty top-left, Up, empty top-right
      const empty1 = document.createElement("div"); empty1.style.width = "48px";
      const upBtn = makeBtn("▲", () => { keys["ArrowUp"] = true; }, () => { keys["ArrowUp"] = false; });
      const empty2 = document.createElement("div"); empty2.style.width = "48px";

      // Left, Down, Right
      const leftBtn = makeBtn("◀", () => { keys["ArrowLeft"] = true; state.facingX = -1; }, () => { keys["ArrowLeft"] = false; });
      const downBtn = makeBtn("▼", () => { keys["ArrowDown"] = true; }, () => { keys["ArrowDown"] = false; });
      const rightBtn = makeBtn("▶", () => { keys["ArrowRight"] = true; state.facingX = 1; }, () => { keys["ArrowRight"] = false; });

      pad.appendChild(empty1); pad.appendChild(upBtn); pad.appendChild(empty2);
      pad.appendChild(leftBtn); pad.appendChild(downBtn); pad.appendChild(rightBtn);
      container.appendChild(pad);

      // Action buttons (right side)
      const actions = document.createElement("div");
      actions.style.cssText =
        "position:fixed;bottom:10px;right:5px;display:flex;gap:6px;z-index:1000;pointer-events:auto;";

      const punchBtn = makeBtn("👊",
        () => { keys["a"] = true; },
        () => { keys["a"] = false; keys["A"] = false; },
      );
      punchBtn.style.background = "rgba(239,68,68,0.35)";
      punchBtn.style.borderColor = "rgba(239,68,68,0.6)";
      punchBtn.style.fontSize = "18px";
      punchBtn.style.padding = "10px 18px";
      punchBtn.title = "PUNCH";

      const throwBtn = makeBtn("📱",
        () => { if (state.items.length >= 1 && state.result === "none") { keys[" "] = true; } },
        () => { keys[" "] = false; },
      );
      throwBtn.style.background = "rgba(250,204,21,0.35)";
      throwBtn.style.borderColor = "rgba(250,204,21,0.6)";
      throwBtn.style.fontSize = "18px";
      throwBtn.style.padding = "10px 18px";
      throwBtn.title = "THROW";

      actions.appendChild(punchBtn);
      actions.appendChild(throwBtn);
      container.appendChild(actions);

      return [pad, actions];
    }

    function start() {
      // Spawn initial pickups
      for (let i = 0; i < 8; i++) spawnPickup();

      // Mobile controls container
      let mobileControls: HTMLElement[] = [];
      if (isMobile()) {
        mobileControls = addMobileControls(overlay);
      }

      const kd = (e: KeyboardEvent) => {
        keys[e.key] = true;
        if (e.key === " ") keys[" "] = true;
        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
           "1", "2", "3", "4", "5", " ", "a", "A"].includes(e.key)
        ) e.preventDefault();
      };
      const ku = (e: KeyboardEvent) => {
        keys[e.key] = false;
        if (e.key === " ") keys[" "] = false;
      };
      window.addEventListener("keydown", kd);
      window.addEventListener("keyup", ku);

      // Define throw function at start() scope (function decl is hoisted, so both loop and mobile controls can use it)
      function throwFirstItem(slot: number) {
        if (state.result !== "none") return;
        const thrownItem = state.items.splice(slot - 1, 1)[0];
        let nearest: FightEnemy | null = null;
        let nearDist = Infinity;
        for (const e of state.enemies) {
          if (e.hp <= 0) continue;
          const d = Math.hypot(e.x - state.playerX, e.y - state.playerY);
          if (d < nearDist) { nearDist = d; nearest = e; }
        }
        const targetX = nearest ? nearest.x : state.playerX + state.facingX * 100;
        const targetY = nearest ? nearest.y : state.playerY;
        const emoji =
          thrownItem === "phone"  ? "📱" :
          thrownItem === "coffee" ? "☕" :
          thrownItem === "laptop" ? "💻" :
          thrownItem === "brain"  ? "🧠" : "📦";
        state.projectiles.push({
          x: state.playerX, y: state.playerY, targetX, targetY,
          progress: 0, speed: 0.06, emoji, hit: false,
        });
        fightSfx("swipe");
        keys[String(slot)] = false;
      }

      const loop = () => {
        state.invincible = Math.max(0, state.invincible - 1);
        if (state.punchCooldown > 0) state.punchCooldown--;

        // ── Movement ──
        let vx = 0, vy = 0;
        if (keys["ArrowLeft"])  { vx = -PLAYER_SPEED; state.facingX = -1; }
        if (keys["ArrowRight"]) { vx = PLAYER_SPEED;  state.facingX = 1; }
        if (keys["ArrowUp"])    { vy = -PLAYER_SPEED; state.facingY = -1; }
        if (keys["ArrowDown"])  { vy = PLAYER_SPEED;  state.facingY = 1; }
        state.playerX += vx;
        state.playerY += vy;
        if (state.playerX < -30) state.playerX = FIGHT_W + 30;
        if (state.playerX > FIGHT_W + 30) state.playerX = -30;
        if (state.playerY < -30) state.playerY = FIGHT_H + 30;
        if (state.playerY > FIGHT_H + 30) state.playerY = -30;

        // ── Pickup collision ──
        for (let pi = state.pickups.length - 1; pi >= 0; pi--) {
          const pu = state.pickups[pi];
          const dist = Math.hypot(pu.x - state.playerX, pu.y - state.playerY);
          if (dist < 30) {
            if (pu.type === "heart") {
              state.hearts = Math.min(3, state.hearts + 1);
              fightSfx("power");
            } else {
              state.items.push(pu.type);
              fightSfx("coin");
            }
            spawnPickupFlash(pu.x, pu.y, state.hitFlashes, state.particles);
            state.pickups.splice(pi, 1);
          }
        }

        // ── Spawn more pickups periodically ──
        state.pickupTimer++;
        if (state.pickupTimer > 120 + Math.random() * 100 && state.pickups.length < 12) {
          state.pickupTimer = 0;
          spawnPickup();
        }

        // ── Projectiles ──
        for (let pi = state.projectiles.length - 1; pi >= 0; pi--) {
          const p = state.projectiles[pi];
          if (p.hit) { state.projectiles.splice(pi, 1); continue; }
          p.progress += p.speed;
          if (p.progress >= 1) {
            p.hit = true;
            let nearest: FightEnemy | null = null;
            let nearDist = Infinity;
            for (const e of state.enemies) {
              if (e.hp <= 0) continue;
              const d = Math.hypot(e.x - p.targetX, e.y - p.targetY);
              if (d < nearDist) { nearDist = d; nearest = e; }
            }
            if (nearest) {
              nearest.hp -= 1;
              fightSfx("hit");
              state.shakeTimer = 8;
              spawnHitEffects(p.targetX, p.targetY, state.hitFlashes, state.particles);
              if (nearest.hp <= 0) fightSfx("win");
            }
          }
        }

        // ── Throw items ──
        for (let n = 1; n <= 5; n++) {
          if (keys[String(n)] && state.items.length >= n && state.result === "none") {
            throwFirstItem(n); break;
          }
        }
        if (keys[" "] && state.items.length >= 1 && state.result === "none") {
          throwFirstItem(1); keys[" "] = false;
        }

        // ── Punch ──
        if ((keys["a"] || keys["A"]) && state.punchCooldown <= 0 && state.result === "none") {
          state.punchCooldown = 15;
          let hitEnemy = false;
          for (const e of state.enemies) {
            if (e.hp <= 0) continue;
            if (Math.hypot(e.x - state.playerX, e.y - state.playerY) < 50) {
              e.hp -= 1; hitEnemy = true;
              fightSfx("hit"); state.shakeTimer = 6;
              spawnHitEffects(e.x, e.y, state.hitFlashes, state.particles);
              if (e.hp <= 0) fightSfx("win");
            }
          }
          if (hitEnemy) {
            state.hitFlashes.push({
              x: state.playerX + state.facingX * 20, y: state.playerY,
              timer: 6, maxTimer: 6, color: "#ffffff",
            });
          }
          keys["a"] = false; keys["A"] = false;
        }

        // ── Update shake / flashes / particles / trails ──
        if (state.shakeTimer > 0) state.shakeTimer--;
        for (let fi = state.hitFlashes.length - 1; fi >= 0; fi--) {
          state.hitFlashes[fi].timer--;
          if (state.hitFlashes[fi].timer <= 0) state.hitFlashes.splice(fi, 1);
        }
        for (let pi = state.particles.length - 1; pi >= 0; pi--) {
          const pt = state.particles[pi];
          pt.x += pt.vx; pt.y += pt.vy;
          pt.vx *= 0.94; pt.vy *= 0.94;
          pt.life--;
          if (pt.life <= 0) state.particles.splice(pi, 1);
        }
        if (speedMult > 1) {
          for (const e of state.enemies) {
            if (e.hp <= 0) continue;
            for (let t = 0; t < Math.ceil(speedMult); t++) {
              state.enemyTrails.push({
                x: e.x + (Math.random() - 0.5) * 4,
                y: e.y + (Math.random() - 0.5) * 4,
                alpha: 0.5,
              });
            }
          }
        }
        for (let ti = state.enemyTrails.length - 1; ti >= 0; ti--) {
          state.enemyTrails[ti].alpha -= 0.04 * speedMult;
          if (state.enemyTrails[ti].alpha <= 0) state.enemyTrails.splice(ti, 1);
        }
        if (state.enemyTrails.length > 200) state.enemyTrails.splice(0, state.enemyTrails.length - 200);

        // ── Enemy AI ──
        for (const e of state.enemies) {
          if (e.hp <= 0) continue;
          const dx = state.playerX - e.x;
          const dy = state.playerY - e.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 20) {
            e.x += (dx / dist) * ENEMY_SPEED * speedMult;
            e.y += (dy / dist) * ENEMY_SPEED * speedMult;
          }
          if (e.x < -30) e.x = FIGHT_W + 30;
          if (e.x > FIGHT_W + 30) e.x = -30;
          if (e.y < -30) e.y = FIGHT_H + 30;
          if (e.y > FIGHT_H + 30) e.y = -30;
          if (e.cooldown <= 0 && dist < 35 && state.invincible <= 0 && state.result === "none") {
            state.hearts--;
            state.invincible = 30;
            fightSfx("hit");
            spawnPlayerHitEffects(state.playerX, state.playerY, state.hitFlashes, state.particles);
            if (state.hearts <= 0) { state.result = "lose"; fightSfx("fail"); }
            e.cooldown = ATTACK_COOLDOWN;
          }
          if (e.cooldown > 0) e.cooldown--;
        }

        // ── Check win ──
        if (state.result === "none" && state.enemies.every((e) => e.hp <= 0)) {
          state.result = "win"; fightSfx("win");
        }

        // ── Render ──
        render(ctx, imgs, state);

        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);

      const checkInterval = setInterval(() => {
        if (state.result === "win" || state.result === "lose") {
          clearInterval(checkInterval);
          setTimeout(() => {
            cancelAnimationFrame(animId);
            window.removeEventListener("keydown", kd);
            window.removeEventListener("keyup", ku);
            window.removeEventListener("resize", onResize);
            for (const el of mobileControls) { if (el.parentNode) el.parentNode.removeChild(el); }
            document.body.removeChild(overlay);
            resolve({ won: state.result === "win", items: state.items });
          }, 1200);
        }
      }, 200);
    }
  });
}

// ─── Render ─────────────────────────────────────────────────────────

function render(
  ctx: CanvasRenderingContext2D,
  imgs: Record<string, HTMLImageElement>,
  state: {
    playerX: number; playerY: number; facingX: number;
    hearts: number; invincible: number; enemies: FightEnemy[];
    items: string[]; projectiles: Projectile[];
    hitFlashes: HitFlash[]; particles: Particle[];
    enemyTrails: { x: number; y: number; alpha: number }[];
    pickups: GroundPickup[]; pickupTimer: number;
    shakeTimer: number; punchCooldown: number; result: string;
  },
) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const sx = W / FIGHT_W;
  const sy = H / FIGHT_H;

  ctx.save();
  ctx.scale(sx, sy);

  if (state.shakeTimer > 0) {
    const intensity = state.shakeTimer * 0.6;
    ctx.translate(
      (Math.random() - 0.5) * intensity * 2,
      (Math.random() - 0.5) * intensity * 2,
    );
  }

  // Black background
  ctx.fillStyle = "#000";
  ctx.fillRect(-10, -10, FIGHT_W + 20, FIGHT_H + 20);

  // ── Ground pickups ──
  for (const pu of state.pickups) {
    const pulse = Math.sin(pu.pulse++ * 0.08) * 0.3 + 0.7;
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.shadowBlur = 12;
    ctx.shadowColor = pu.type === "heart" ? "rgba(74,222,128,0.6)" : "rgba(250,204,21,0.6)";
    ctx.font = "22px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const icon = pu.type === "phone"  ? "📱" :
                 pu.type === "laptop" ? "💻" :
                 pu.type === "coffee" ? "☕" : "❤️";
    ctx.fillText(icon, pu.x, pu.y);
    ctx.restore();
  }

  // ── Speed trail afterimages ──
  for (const t of state.enemyTrails) {
    ctx.save();
    ctx.globalAlpha = t.alpha * 0.35;
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "rgba(239,68,68,0.5)";
    ctx.shadowBlur = 8;
    ctx.fillRect(t.x - 10, t.y - 14, 20, 28);
    ctx.restore();
  }

  // ── Hit flashes ──
  for (const f of state.hitFlashes) {
    const alpha = f.timer / f.maxTimer;
    ctx.save();
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillStyle = f.color;
    ctx.shadowColor = "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 24 + (1 - alpha) * 10, 0, Math.PI * 2);
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
    ctx.shadowBlur = 6;
    ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
    ctx.restore();
  }

  // ── Projectiles ──
  for (const p of state.projectiles) {
    if (p.hit) continue;
    const cx = p.x + (p.targetX - p.x) * p.progress;
    const cy = p.y + (p.targetY - p.y) * p.progress;
    ctx.shadowColor = "rgba(255,255,255,0.4)";
    ctx.shadowBlur = 12;
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.emoji, cx, cy);
    ctx.shadowBlur = 0;
  }

  // ── Player ──
  if (state.result === "none" || state.invincible % 6 < 3) {
    const pImg = imgs.player;
    if (pImg) {
      ctx.save();
      ctx.translate(state.playerX, state.playerY);
      if (state.facingX < 0) ctx.scale(-1, 1);
      ctx.drawImage(pImg, -24, -32, 48, 48);
      ctx.restore();
    } else {
      ctx.fillStyle = "#60a5fa";
      ctx.fillRect(state.playerX - 12, state.playerY - 16, 24, 32);
    }
  }

  // ── Punch flash indicator ──
  if (state.punchCooldown > 12) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(state.playerX + state.facingX * 30, state.playerY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Enemies ──
  for (const e of state.enemies) {
    if (e.hp <= 0) continue;
    const eImg = imgs[e.type];
    if (eImg) {
      const dxToPlayer = state.playerX - e.x;
      const faceEnemy = dxToPlayer > 0 ? 1 : -1;
      ctx.save();
      ctx.translate(e.x, e.y);
      if (faceEnemy < 0) ctx.scale(-1, 1);
      ctx.drawImage(eImg, -24, -32, 48, 48);
      ctx.restore();
    } else {
      ctx.fillStyle = e.type === "pencil" ? "#ffdd00" : e.type === "bug" ? "#ff4444" : "#8B4513";
      ctx.fillRect(e.x - 12, e.y - 16, 24, 32);
    }
    const hpPct = e.hp / e.maxHp;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(e.x - 20, e.y + 20, 40, 5);
    ctx.fillStyle = hpPct > 0.5 ? "#4ade80" : hpPct > 0.25 ? "#facc15" : "#ef4444";
    ctx.fillRect(e.x - 20, e.y + 20, 40 * hpPct, 5);
  }

  // ── HUD ──
  // Hearts (top-left)
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(8, 8, 130, 26);
  ctx.fillStyle = "#ef4444";
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.textAlign = "left";
  ctx.fillText("♥".repeat(state.hearts) + "♡".repeat(3 - state.hearts), 14, 27);

  // Items (below hearts)
  if (state.items.length > 0) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(8, 36, 260, 20);
    ctx.fillStyle = "#facc15";
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.textAlign = "left";
    const itemNames = state.items
      .map((it, i) =>
        `${i + 1}:${it === "phone" ? "📱" : it === "coffee" ? "☕" : it === "laptop" ? "💻" : it === "brain" ? "🧠" : it}`
      )
      .join("  ");
    ctx.fillText(itemNames, 14, 50);
  }

  // ── Controls guide — DESKTOP ONLY (more visible) ──
  if (!isMobile()) {
    // Semi-transparent background for readability
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(FIGHT_W - 340, 4, 336, 54);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(FIGHT_W - 340, 4, 336, 54);

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.textAlign = "left";
    ctx.fillText("⬆⬇⬅➡  MOVE", FIGHT_W - 332, 18);
    ctx.fillText("SPACE   THROW ITEM", FIGHT_W - 332, 30);
    ctx.fillText("A           PUNCH (MELEE)", FIGHT_W - 332, 42);
    ctx.fillText("1-5        SELECT ITEM", FIGHT_W - 332, 54);
  }

  ctx.restore();

  // ── Result overlay ──
  if (state.result === "win") {
    ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fbbf24";
    ctx.font = `bold ${Math.min(22 * sx, 22 * sy)}px "Press Start 2P", monospace`;
    ctx.textAlign = "center";
    ctx.fillText("🎉 VICTORY! 🎉", W / 2, H / 2 - 10 * sy);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `${Math.min(11 * sx, 11 * sy)}px "Press Start 2P", monospace`;
    ctx.fillText("Enemy defeated!", W / 2, H / 2 + 25 * sy);
  }
  if (state.result === "lose") {
    ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#ef4444";
    ctx.font = `bold ${Math.min(20 * sx, 20 * sy)}px "Press Start 2P", monospace`;
    ctx.textAlign = "center";
    ctx.fillText("💥 DEFEATED", W / 2, H / 2 - 10 * sy);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `${Math.min(10 * sx, 10 * sy)}px "Press Start 2P", monospace`;
    ctx.fillText("Try a different approach", W / 2, H / 2 + 25 * sy);
  }
}
