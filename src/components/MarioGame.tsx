"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

// ─── Constants ──────────────────────────────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 500;
const TILE = 32;
const LEVEL_COLS = 200;
const LEVEL_ROWS = Math.ceil(CANVAS_H / TILE);

// ─── Tile behavior flags (reference: Mario.Tile) ────────────────────
const B = {
  BlockUpper:  1 << 0,
  BlockAll:    1 << 1,
  BlockLower:  1 << 2,
  Special:     1 << 3,
  Bumpable:    1 << 4,
  Breakable:   1 << 5,
  PickUpable:  1 << 6,
  Animated:    1 << 7,
};

const TILE_BEHAVIOR: number[] = (() => {
  const b: number[] = [];
  for (let i = 0; i < 256; i++) b[i] = 0;
  // 0 = air, 1 = ground, 2 = brick, 3 = mystery, 4 = hard/used, 5/6 = pipe
  b[1] = B.BlockAll | B.BlockUpper;
  b[2] = B.Bumpable | B.Breakable | B.BlockLower;
  b[3] = B.Bumpable | B.Special | B.BlockLower;
  b[4] = B.BlockAll;
  b[5] = B.BlockAll;
  b[6] = B.BlockAll;
  b[7] = B.PickUpable | B.BlockUpper; // coin brick (solid from above, gives coin on side/below)
  return b;
})();

function isBlocking(blockType: number, xa: number, ya: number): boolean {
  const bh = TILE_BEHAVIOR[blockType & 0xff];
  if (bh & B.BlockAll)  return true;
  if (ya > 0 && (bh & B.BlockUpper)) return true;
  if (ya < 0 && (bh & B.BlockLower)) return true;
  return false;
}
function isPickUpable(blockType: number): boolean {
  return (TILE_BEHAVIOR[blockType & 0xff] & B.PickUpable) > 0;
}
function isBumpable(blockType: number): boolean {
  return (TILE_BEHAVIOR[blockType & 0xff] & B.Bumpable) > 0;
}
function isBreakable(blockType: number): boolean {
  return (TILE_BEHAVIOR[blockType & 0xff] & B.Breakable) > 0;
}
function isSpecial(blockType: number): boolean {
  return (TILE_BEHAVIOR[blockType & 0xff] & B.Special) > 0;
}

// ─── Sounds ─────────────────────────────────────────────────────────
const SOUNDS: Record<string, string> = {
  jump: "/mario/mario_sounds/jump.wav",
  coin: "/mario/mario_sounds/coin.wav",
  stomp: "/mario/mario_sounds/stomp.wav",
  kick: "/mario/mario_sounds/kick.wav",
  breakBlock: "/mario/mario_sounds/breakblock.wav",
  bump: "/mario/mario_sounds/bump.wav",
  powerup: "/mario/mario_sounds/powerup.wav",
  sprout: "/mario/mario_sounds/sprout.wav",
  die: "/mario/mario_sounds/death.wav",
  fireball: "/mario/mario_sounds/fireball.wav",
  exit: "/mario/mario_sounds/exit.wav",
  oneUp: "/mario/mario_sounds/1-up.wav",
};

const SPRITES: Record<string, string> = {
  mSmallIdle:  "/mario/Mario_Small_Idle.png",
  mSmallRun1:  "/mario/Mario_Small_Run1.png",
  mSmallRun2:  "/mario/Mario_Small_Run2.png",
  mSmallRun3:  "/mario/Mario_Small_Run3.png",
  mSmallJump:  "/mario/Mario_Small_Jump.png",
  mSmallSlide: "/mario/Mario_Small_Slide.png",
  mSmallDeath: "/mario/Mario_Small_Death.png",
  mBigIdle:    "/mario/Mario_Big_Idle.png",
  mBigRun1:    "/mario/Mario_Big_Run1.png",
  mBigRun2:    "/mario/Mario_Big_Run2.png",
  mBigRun3:    "/mario/Mario_Big_Run3.png",
  mBigJump:    "/mario/Mario_Big_Jump.png",
  mBigSlide:   "/mario/Mario_Big_Slide.png",
  goomba1:     "/mario/Goomba_Walk1.png",
  goomba2:     "/mario/Goomba_Walk2.png",
  goombaFlat:  "/mario/Goomba_Flat.png",
  koopa1:      "/mario/Koopa_Walk1.png",
  koopa2:      "/mario/Koopa_Walk2.png",
  koopaShell:  "/mario/Koopa_Shell.png",
  ground:      "/mario/GroundBlock.png",
  brick:       "/mario/Brick.png",
  hardBlock:   "/mario/HardBlock.png",
  mystery:     "/mario/MysteryBlock.png",
  pipeTop:     "/mario/PipeTop.png",
  pipeBottom:  "/mario/PipeBottom.png",
  coin:        "/mario/Coin.png",
  mushroom:    "/mario/MagicMushroom.png",
  fireFlower:  "/mario/FireFlower.png",
  flag:        "/mario/Flag.png",
  flagPole:    "/mario/FlagPole.png",
  castle:      "/mario/Castle.png",
  cloud1: "/mario/Cloud1.png", cloud2: "/mario/Cloud2.png", cloud3: "/mario/Cloud3.png",
  hill1:  "/mario/Hill1.png",  hill2:  "/mario/Hill2.png",
  bush1:  "/mario/Bush1.png",  bush2:  "/mario/Bush2.png",  bush3:  "/mario/Bush3.png",
};

type GS = "idle" | "playing" | "paused" | "won" | "gameover";

// ─── Entity (reference: Y = BOTTOM of collision box) ────────────────
// Collision box: (X - W, Y - H) → (X + W, Y)
interface Entity {
  X: number; Y: number; Xa: number; Ya: number;
  W: number; H: number;                // half-width, full height
  facing: number;
  alive: boolean;
  deadTime: number;
  flyDeath: boolean;
  yFlip: boolean;
  frame: number;
  onGround: boolean;
  life: number;                         // mushroom rise / general lifetime
  collected: boolean;
  // Shell
  isShell: boolean;
  shellMoving: boolean;
  shellCarried: boolean;
  // Fireball
  isFireball: boolean;
  anim: number;
  // Enemy
  avoidCliffs: boolean;
  noFireballDeath: boolean;
  winged: boolean;
  wingTime: number;
  // Mario
  hearts: number;                       // 3 = full health, 0 = dead
  runTime: number;
  jumpTime: number;
  xJumpSpeed: number;
  yJumpSpeed: number;
  mayJump: boolean;
  sliding: boolean;
  ducking: boolean;
  wasOnGround: boolean;
  big: boolean;
  fire: boolean;
  invincible: number;
  powerUpTime: number;
  deathTime: number;
  winTime: number;
  canShoot: boolean;
  carried: Entity | null;
  type: string;
}

function createEntity(X: number, Y: number, W: number, H: number): Entity {
  return {
    X, Y, Xa: 0, Ya: 0, W, H,
    facing: 1, alive: true, deadTime: 0, flyDeath: false, yFlip: false,
    frame: 0, onGround: false, life: 0, collected: false,
    isShell: false, shellMoving: false, shellCarried: false,
    isFireball: false, anim: 0,
    avoidCliffs: false, noFireballDeath: false, winged: false, wingTime: 0,
    hearts: 3,
    runTime: 0, jumpTime: 0, xJumpSpeed: 0, yJumpSpeed: 0,
    mayJump: false, sliding: false, ducking: false, wasOnGround: false,
    big: false, fire: false, invincible: 0, powerUpTime: 0,
    deathTime: 0, winTime: 0, canShoot: false,
    carried: null, type: "",
  };
}

function createSounds(muted: boolean) {
  const cache: Record<string, HTMLAudioElement> = {};
  for (const [name, src] of Object.entries(SOUNDS)) {
    const a = new Audio(); a.src = src; a.preload = "auto"; a.volume = 0.4;
    a.muted = muted;
    cache[src] = a;
  }
  return {
    play: (name: string) => {
      const a = cache[SOUNDS[name]];
      if (a) { a.currentTime = 0; a.play().catch(() => {}); }
    },
    setMuted: (m: boolean) => {
      for (const a of Object.values(cache)) a.muted = m;
    },
  };
}

function loadImages(): Promise<Record<string, HTMLImageElement>> {
  const imgs: Record<string, HTMLImageElement> = {};
  return Promise.all(
    Object.entries(SPRITES).map(([k, s]) => new Promise<void>((ok) => {
      const i = new window.Image();
      i.onload = () => { imgs[k] = i; ok(); };
      i.onerror = () => ok();
      i.src = s;
    }))
  ).then(() => imgs);
}

// ─── Level generation ───────────────────────────────────────────────
function genLevel(): number[][] {
  const m: number[][] = [];
  for (let r = 0; r < LEVEL_ROWS; r++) m.push(new Array(LEVEL_COLS).fill(0));
  for (let c = 0; c < LEVEL_COLS; c++) {
    m[LEVEL_ROWS - 1][c] = 1;
    m[LEVEL_ROWS - 2][c] = 1;
  }
  for (const g of [{ s: 69, l: 3 }, { s: 86, l: 3 }, { s: 153, l: 2 }])
    for (let c = g.s; c < g.s + g.l; c++) {
      m[LEVEL_ROWS - 1][c] = 0;
      m[LEVEL_ROWS - 2][c] = 0;
    }
  const R = LEVEL_ROWS;
  const S: [number, number, number][] = [
    [16,R-5,3],[20,R-5,2],[21,R-5,3],[22,R-5,2],[23,R-5,3],[22,R-9,3],
    [28,R-3,5],[29,R-3,5],[38,R-4,5],[39,R-4,5],[46,R-5,5],[47,R-5,5],
    [57,R-4,5],[58,R-4,5],[77,R-5,3],[78,R-5,2],[79,R-5,3],
    [80,R-9,2],[81,R-9,2],[82,R-9,2],[83,R-9,2],
    [91,R-5,3],[94,R-9,2],[95,R-9,3],[96,R-9,2],
    [100,R-5,2],[101,R-5,3],[102,R-5,2],
    [106,R-5,2],[109,R-5,3],[110,R-9,2],[111,R-9,2],
    [118,R-5,2],[119,R-5,3],[120,R-5,2],
    [125,R-3,5],[126,R-3,5],
    // ── Coin bricks (tile 7: PickUpable, gives coin & score on any contact) ──
    [3,R-3,7],[4,R-3,7],                  // Near start
    [35,R-3,7],[36,R-3,7],                // After first pipe
    [43,R-3,7],[44,R-3,7],[45,R-3,7],      // Mid level
    [53,R-4,7],[54,R-4,7],[55,R-4,7],      // Elevated coin bricks
    [62,R-3,7],[63,R-3,7],                // Pre-gap
    [70,R-3,7],[71,R-3,7],[72,R-3,7],      // Post-gap cluster
    [88,R-3,7],[89,R-4,7],                 // Near mystery blocks
    [107,R-3,7],[108,R-3,7],              // After second gap
    [116,R-3,7],[117,R-3,7],              // Zigzag area
    [128,R-3,7],[129,R-3,7],              // Late level
    [134,R-3,4],[135,R-3,4],[135,R-4,4],[136,R-3,4],[136,R-4,4],[136,R-5,4],
    [137,R-3,4],[137,R-4,4],[137,R-5,4],[137,R-6,4],
  ];
  for (const [c, r, t] of S) {
    if (t === 5) {
      m[r][c] = 5;
      for (let rr = r + 1; rr < R - 2; rr++) m[rr][c] = 6;
    } else m[r][c] = t;
  }
  return m;
}

// ─── Consumable coin positions (col, row) ───────────────────────────
function genCoinPositions(): { x: number; y: number; collected: boolean }[] {
  const R = LEVEL_ROWS;
  // Coins placed at R-3 (1 tile above ground, reachable by standing jump)
  // and R-4 (2 tiles above ground, reachable by full jump)
  const positions = [
    [17,R-3],[18,R-3],[19,R-3],          // Over first gap
    [24,R-3],[25,R-3],                    // After mystery block area
    [30,R-4],[31,R-4],[32,R-4],[33,R-4],  // Above pipe area
    [44,R-3],[45,R-3],                    // Mid level
    [49,R-3],[50,R-3],[51,R-3],[52,R-3], // Near pipes area
    [59,R-4],[60,R-4],[61,R-4],           // High coins (still reachable)
    [65,R-3],[66,R-3],                    // Pre-gap coins
    [73,R-3],[74,R-3],[75,R-3],          // Post-gap
    [85,R-3],[86,R-3],                    // Near brick section
    [89,R-4],[90,R-4],                    // Higher up (reachable with full jump)
    [93,R-3],[94,R-3],                    // Near mystery block
    [98,R-4],[99,R-4],                    // Mid platform area
    [104,R-3],[105,R-3],                  // After brick run
    [108,R-3],[109,R-3],                  // Near blocks
    [113,R-3],[114,R-3],[115,R-3],        // Zigzag area
    [122,R-3],[123,R-3],                  // Late level
    [131,R-3],[132,R-3],[133,R-3],        // Castle approach
  ];
  return positions.map(([c, r]) => ({
    x: c * TILE + TILE / 2,
    y: r * TILE,
    collected: false,
  }));
}

// ─── Physics ────────────────────────────────────────────────────────
const GROUND_INERTIA = 0.89;
const AIR_INERTIA = 0.89;
const ENEMY_SPEED = 0.6;
const SHELL_SPEED = 11;
const FIREBALL_SPEED = 8;
const MUSHROOM_SPEED = 1.75;
const MUSHROOM_RISE = 9;

type BumpHandler = (tileX: number, tileY: number, tileType: number) => void;
type PickUpHandler = (tileX: number, tileY: number, tileType: number) => void;

function subMove(
  e: Entity, xa: number, ya: number, map: number[][],
  onBump?: BumpHandler, onPickUp?: PickUpHandler,
): boolean {
  let collide = false;
  while (xa > 8)  { if (!subMove(e, 8, 0, map, onBump, onPickUp))  return false; xa -= 8; }
  while (xa < -8) { if (!subMove(e, -8, 0, map, onBump, onPickUp)) return false; xa += 8; }
  while (ya > 8)  { if (!subMove(e, 0, 8, map, onBump, onPickUp))  return false; ya -= 8; }
  while (ya < -8) { if (!subMove(e, 0, -8, map, onBump, onPickUp)) return false; ya += 8; }

  if (ya > 0) {
    if (isBlockingTile(e.X + xa - e.W, e.Y + ya, xa, ya, map, onBump, onPickUp)) collide = true;
    else if (isBlockingTile(e.X + xa + e.W, e.Y + ya, xa, ya, map, onBump, onPickUp)) collide = true;
    else if (isBlockingTile(e.X + xa - e.W, e.Y + ya + 1, xa, ya, map, onBump, onPickUp)) collide = true;
    else if (isBlockingTile(e.X + xa + e.W, e.Y + ya + 1, xa, ya, map, onBump, onPickUp)) collide = true;
  }
  if (ya < 0) {
    if (isBlockingTile(e.X + xa, e.Y + ya - e.H, xa, ya, map, onBump, onPickUp)) collide = true;
    else if (!collide && isBlockingTile(e.X + xa - e.W, e.Y + ya - e.H, xa, ya, map, onBump, onPickUp)) collide = true;
    else if (!collide && isBlockingTile(e.X + xa + e.W, e.Y + ya - e.H, xa, ya, map, onBump, onPickUp)) collide = true;
  }
  if (xa > 0) {
    if (isBlockingTile(e.X + xa + e.W, e.Y + ya - e.H, xa, ya, map, onBump, onPickUp)) collide = true;
    if (isBlockingTile(e.X + xa + e.W, e.Y + ya - ((e.H / 2) | 0), xa, ya, map, onBump, onPickUp)) collide = true;
    if (isBlockingTile(e.X + xa + e.W, e.Y + ya, xa, ya, map, onBump, onPickUp)) collide = true;
  }
  if (xa < 0) {
    if (isBlockingTile(e.X + xa - e.W, e.Y + ya - e.H, xa, ya, map, onBump, onPickUp)) collide = true;
    if (isBlockingTile(e.X + xa - e.W, e.Y + ya - ((e.H / 2) | 0), xa, ya, map, onBump, onPickUp)) collide = true;
    if (isBlockingTile(e.X + xa - e.W, e.Y + ya, xa, ya, map, onBump, onPickUp)) collide = true;
  }

  if (collide) {
    if (xa < 0) { e.X = (((e.X - e.W) / TILE) | 0) * TILE + e.W; e.Xa = 0; }
    if (xa > 0) { e.X = (((e.X + e.W) / TILE + 1) | 0) * TILE - e.W - 1; e.Xa = 0; }
    if (ya < 0) { e.Y = (((e.Y - e.H) / TILE) | 0) * TILE + e.H; e.Ya = 0; e.jumpTime = 0; }
    if (ya > 0) { e.Y = (((e.Y - 1) / TILE + 1) | 0) * TILE - 1; e.onGround = true; }
    return false;
  }
  e.X += xa;
  e.Y += ya;
  return true;
}

function isBlockingTile(
  x: number, y: number, xa: number, ya: number,
  map: number[][], onBump?: BumpHandler, onPickUp?: PickUpHandler,
): boolean {
  const tx = (x / TILE) | 0;
  const ty = (y / TILE) | 0;
  if (ty < 0 || ty >= LEVEL_ROWS || tx < 0 || tx >= LEVEL_COLS) return false;
  const tile = map[ty][tx];
  if (tile === 0) return false;

  // PickUpable coin bricks disappear and give coin (reference: in IsBlocking)
  // Only trigger on side/below contact — landing from above (ya > 0) should be solid
  if (isPickUpable(tile) && onPickUp && !(ya > 0)) {
    onPickUp(tx, ty, tile);
    map[ty][tx] = 0;
    return false;
  }

  const blocks = isBlocking(tile, xa, ya);
  if (blocks && ya < 0 && onBump) {
    onBump(tx, ty, tile);
  }
  return blocks;
}

function overlap(a: Entity, b: Entity): boolean {
  return (
    a.X - a.W < b.X + b.W && a.X + a.W > b.X - b.W &&
    a.Y - a.H < b.Y && a.Y > b.Y - b.H
  );
}

// ═════════════════════════════════════════════════════════════════════
//  REACT COMPONENT
// ═════════════════════════════════════════════════════════════════════
export default function MarioGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gs, setGs] = useState<GS>("idle");
  const [score, setScore] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showStart, setShowStart] = useState(true);
  const [isMuted, setIsMuted] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("mario-muted") === "true"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mario-high-score");
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const gRef = useRef<{
    mario: Entity; enemies: Entity[]; shells: Entity[]; items: Entity[];
    coins2: { x: number; y: number; collected: boolean }[];
    fireballs: Entity[]; map: number[][]; camX: number;
    keys: Record<string, boolean>; images: Record<string, HTMLImageElement>;
    play: (n: string) => void; setMuted: (m: boolean) => void; runFrame: number;
    bumpAnims: { tx: number; ty: number; t: number }[];
    particles: { x: number; y: number; xa: number; ya: number; life: number }[];
    coinAnims: { x: number; y: number; ya: number; life: number }[];
    // HUD values stored here to avoid stale React closures
    score: number;
    coinCount: number;
    timeLeft: number;
    lives: number;
  } | null>(null);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startCanvasRef = useRef<HTMLCanvasElement>(null);
  const startAnimRef = useRef<number>(0);

  const initGame = useCallback(async () => {
    const images = await loadImages();
    const map = genLevel();
    const { play, setMuted } = createSounds(localStorage.getItem("mario-muted") === "true");
    const groundY = (LEVEL_ROWS - 2) * TILE;

    // Mario: start small (H=12) (reference: Character.Height = 12 when small)
    const mario = createEntity(3 * TILE, groundY, 4, 12);
    mario.big = false;
    mario.fire = false;
    mario.invincible = 0;
    mario.type = "mario";

    // Enemies (reference: Goomba H=12, Koopa H=24)
    const enemies: Entity[] = [];
    for (const c of [22, 40, 51, 52, 80, 82, 97, 98, 107, 114, 128, 129]) {
      const e = createEntity(c * TILE, groundY, 4, 12); // Goomba H=12
      e.Xa = -ENEMY_SPEED;
      e.facing = -1;
      e.type = "goomba";
      enemies.push(e);
    }
    for (const c of [42, 70, 110, 130]) {
      const e = createEntity(c * TILE, groundY, 4, 24); // Koopa H=24
      e.Xa = -ENEMY_SPEED * 0.8;
      e.facing = -1;
      e.type = "koopa";
      e.avoidCliffs = true;
      enemies.push(e);
    }

    // Floating consumable coins (reference: placed in level, collision = GetCoin)
    const coins2 = genCoinPositions();

    gRef.current = {
      mario, enemies, shells: [], items: [], coins2, fireballs: [],
      map, camX: 0, keys: {}, images,      play, setMuted, runFrame: 0, bumpAnims: [], particles: [], coinAnims: [],
      score: 0, coinCount: 0, timeLeft: 300, lives: 3,
    };

    setScore(0); setCoinCount(0); setLives(3); setTimeLeft(300);
    setGs("playing");
  }, []);

  // ─── Game loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (gs !== "playing") return;
    const g = gRef.current;
    if (!g) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;
    if (!ctx) return;

    const countdown = setInterval(() => {
      setTimeLeft(t => { const nt = Math.max(0, t - 1); g.timeLeft = nt; return nt; });
    }, 1000);
    const kd = (e: KeyboardEvent) => {
      g.keys[e.key] = true;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
    };
    const ku = (e: KeyboardEvent) => { g.keys[e.key] = false; };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    const kLeft  = () => g.keys["ArrowLeft"];
    const kRight = () => g.keys["ArrowRight"];
    const kJump  = () => g.keys["ArrowUp"] || g.keys[" "];
    const kDown  = () => g.keys["ArrowDown"];
    const kRun   = () => g.keys["a"] || g.keys["A"];
    let ticks = 0;

    const { mario, enemies, shells, items, coins2, fireballs, map, images, play } = g;

    // ── Update ──────────────────────────────────────────────────
    const update = () => {
      // ── Death animation (reference: DeathTime) ──
      if (mario.deathTime > 0) {
        mario.deathTime++;
        if (mario.deathTime < 11) { mario.Xa = 0; mario.Ya = 0; }
        else if (mario.deathTime === 11) { mario.Ya = -15; }
        else { mario.Ya += 2; }
        mario.X += mario.Xa;
        mario.Y += mario.Ya;
        // Reference: t = DeathTime + Delta; if (t * t * 0.1 > 900) → lose life
        // No `var t2` — use DeathTime directly
        if (mario.deathTime * mario.deathTime * 0.1 > 900 && mario.alive) {
          mario.alive = false;
          // Decrement lives inside setLives, set gameover outside updater
          setLives(l => {
            const nl = l <= 1 ? 0 : l - 1;
            g.lives = nl;
            if (l <= 1) {
              setTimeout(() => play("die"), 500);
            }
            return nl;
          });
          // Use queueMicrotask to avoid React batching issues
          queueMicrotask(() => setGs("gameover"));
        }
        return;
      }

      // ── Win animation ──
      if (mario.winTime > 0) {
        mario.winTime++;
        mario.Xa = 0;
        mario.Ya = 0;
        return;
      }

      // ── Power-up animation skipped (reference has blink, but our blinkMario is
      //     broken — it toggles big/fire but can't restore them. Apply instantly.)
      if (mario.powerUpTime !== 0) {
        mario.powerUpTime = 0;
        mario.invincible = 30;
      }

      // ── Invulnerability ──
      if (mario.invincible > 0) mario.invincible--;

      mario.wasOnGround = mario.onGround;
      const speed = kRun() ? 1.2 : 0.6;

      // ── Ducking (reference: OnGround && Down && Large) ──
      mario.ducking = mario.onGround && kDown() && mario.big;

      // ── Facing (reference: Xa > 2 → Facing=1, Xa < -2 → Facing=-1) ──
      if (mario.Xa > 2) mario.facing = 1;
      if (mario.Xa < -2) mario.facing = -1;

      // ── Jump (reference: JUMP) ──
      const jumpHeld = kJump() || (mario.jumpTime < 0 && !mario.onGround && !mario.sliding);
      if (jumpHeld) {
        if (mario.jumpTime < 0) {
          mario.Xa = mario.xJumpSpeed;
          mario.Ya = -mario.jumpTime * mario.yJumpSpeed;
          mario.jumpTime++;
        } else if (mario.onGround && mario.mayJump) {
          play("jump");
          mario.xJumpSpeed = 0;
          mario.yJumpSpeed = -1.9;
          mario.jumpTime = 10;
          mario.Ya = mario.jumpTime * mario.yJumpSpeed;
          mario.onGround = false;
          mario.sliding = false;
        } else if (mario.sliding && mario.mayJump) {
          play("jump");
          mario.xJumpSpeed = -mario.facing * 6;
          mario.yJumpSpeed = -2;
          mario.jumpTime = -6;
          mario.Xa = mario.xJumpSpeed;
          mario.Ya = -mario.jumpTime * mario.yJumpSpeed;
          mario.onGround = false;
          mario.sliding = false;
          mario.facing = -mario.facing;
        } else if (mario.jumpTime > 0) {
          mario.Xa += mario.xJumpSpeed;
          mario.Ya = mario.jumpTime * mario.yJumpSpeed;
          mario.jumpTime--;
        }
      } else {
        mario.jumpTime = 0;
      }

      // ── Horizontal movement ──
      if (kLeft() && !mario.ducking) {
        if (mario.facing === 1) mario.sliding = false;
        mario.Xa -= speed;
        if (mario.jumpTime >= 0) mario.facing = -1;
      }
      if (kRight() && !mario.ducking) {
        if (mario.facing === -1) mario.sliding = false;
        mario.Xa += speed;
        if (mario.jumpTime >= 0) mario.facing = 1;
      }

      if ((!kLeft() && !kRight()) || mario.ducking || mario.Ya < 0 || mario.onGround) {
        mario.sliding = false;
      }

      // ── Fireball ──
      if (kRun() && mario.canShoot && mario.fire && fireballs.length < 2) {
        play("fireball");
        const fb = createEntity(mario.X + mario.facing * 6, mario.Y - 20, 4, 8);
        fb.Xa = mario.facing * FIREBALL_SPEED;
        fb.Ya = 4;
        fb.facing = mario.facing;
        fb.isFireball = true;
        fb.type = "fireball";
        fireballs.push(fb);
      }
      mario.canShoot = !kRun();

      // ── MayJump ──
      mario.mayJump = (mario.onGround || mario.sliding) && !kJump();

      // ── RunTime / animation frame ──
      mario.runTime += Math.abs(mario.Xa) + 5;
      if (Math.abs(mario.Xa) < 0.5) { mario.runTime = 0; mario.Xa = 0; }

      // ── Height (reference: CalcPic sets H=12 when small, 24 when big) ──
      if (mario.big) {
        mario.H = mario.ducking ? 12 : 24;
      } else {
        mario.H = 12; // Small Mario always H=12
      }

      // ── Bump/PickUp handlers ──
      const bumpHandler: BumpHandler = (tx, ty, tile) => {
        handleBlockBump(tx, ty, tile, mario.big, g, play, items, enemies, shells, mario);
      };
      const pickUpHandler: PickUpHandler = (tx, ty, _tile) => {
        play("coin");
      setCoinCount(c => { g.coinCount = c + 1; return c + 1; });
      setScore(s => { g.score = s + 200; return s + 200; });
        for (let xx = 0; xx < 2; xx++)
          for (let yy = 0; yy < 2; yy++)
            g.particles.push({
              x: tx * TILE + xx * 8 + ((Math.random() * 8) | 0),
              y: ty * TILE + yy * 8 + ((Math.random() * 8) | 0),
              xa: 0, ya: 0, life: 10,
            });
      };

      // ── Skid sparks ──
      if (mario.sliding && (mario.Xa > 3 || mario.Xa < -3)) {
        for (let i = 0; i < 3; i++) {
          g.particles.push({
            x: (mario.X + Math.random() * 8 - 4) | 0,
            y: (mario.Y + Math.random() * 4) | 0,
            xa: Math.random() * 2 - 1, ya: Math.random() * -1,
            life: 10 + ((Math.random() * 5) | 0),
          });
        }
      }
      if (mario.sliding) mario.Ya *= 0.5;

      // ── Physics ──
      mario.onGround = false;
      subMove(mario, mario.Xa, 0, map, bumpHandler, pickUpHandler);
      subMove(mario, 0, mario.Ya, map, bumpHandler, pickUpHandler);

      if (mario.Y > LEVEL_ROWS * TILE + 64) { die(); return; }
      if (mario.X < 0) { mario.X = 0; mario.Xa = 0; }

      if (mario.X > 180 * TILE && mario.winTime === 0) {
        mario.winTime = 1;
        play("exit");
        setGs("won");
        setScore(s => { g.score = s + g.timeLeft * 50; return s + g.timeLeft * 50; });
        return;
      }

      mario.Ya *= 0.85;
      if (mario.onGround) mario.Xa *= GROUND_INERTIA; else mario.Xa *= AIR_INERTIA;
      if (!mario.onGround) mario.Ya += 3;

      // ── Carried shell ──
      if (mario.carried !== null) {
        mario.carried.X = mario.X + mario.facing * 8;
        mario.carried.Y = mario.Y - 2;
        if (!kRun()) {
          mario.carried.shellCarried = false;
          mario.carried.facing = mario.facing;
          mario.carried.X += mario.facing * 8;
          mario.carried = null;
        }
      }

      g.camX = mario.X - CANVAS_W / 2;
      if (g.camX < 0) g.camX = 0;
      ticks++;
      if (ticks % 8 === 0) g.runFrame = (g.runFrame + 1) % 3;

      // ── Consumable coins (reference: CollideCheck for coins) ──
      for (const coin of coins2) {
        if (coin.collected) continue;
        // Proper AABB: coin occupies full tile (x - TILE/2, y - TILE) to (x + TILE/2, y)
        // Mario collision: (X-W, Y-H) to (X+W, Y)
        if (mario.X - mario.W < coin.x + TILE / 2 &&
            mario.X + mario.W > coin.x - TILE / 2 &&
            mario.Y - mario.H < coin.y &&
            mario.Y > coin.y - TILE) {
          coin.collected = true;
          play("coin");
          setCoinCount(c => { g.coinCount = c + 1; return c + 1; });
          setScore(s => { g.score = s + 200; return s + 200; });
        }
      }

      // ── Enemies ──
      for (const e of enemies) {
        if (!e.alive) {
          if (e.deadTime > 0) {
            e.deadTime--;
            if (e.flyDeath) {
              e.X += e.Xa; e.Y += e.Ya;
              e.Ya *= 0.95; e.Ya += 1;
            }
            if (e.deadTime === 0) { e.deadTime = 1; }
          }
          continue;
        }
        if (e.X - g.camX < -64 || e.X - g.camX > CANVAS_W + 64) continue;

        e.Xa = e.facing * ENEMY_SPEED;
        e.runTime += Math.abs(e.Xa) + 5;

        if (e.avoidCliffs && e.onGround) {
          const aheadX = ((e.X + e.facing * (e.W + 1)) / TILE) | 0;
          const belowY = ((e.Y / TILE) + 1) | 0;
          if (belowY < LEVEL_ROWS && !isTileSolid(map[belowY]?.[aheadX] ?? 0)) {
            e.facing = -e.facing;
          }
        }

        if (!subMove(e, e.Xa, 0, map)) e.facing = -e.facing;
        e.onGround = false;
        subMove(e, 0, e.Ya, map);

        e.Ya *= e.winged ? 0.95 : 0.85;
        if (e.onGround) e.Xa *= GROUND_INERTIA; else e.Xa *= AIR_INERTIA;
        if (!e.onGround) e.Ya += e.winged ? 0.6 : 2;
        else if (e.winged) e.Ya = -10;

        e.frame = ((e.runTime / 20) | 0) % 2;
        if (!e.onGround) e.frame = 1;
        if (e.winged) e.frame = ((e.wingTime / 4) | 0) % 2;
        e.wingTime++;

        // Enemy vs Mario
        if (mario.deathTime === 0 && mario.invincible <= 0 && overlap(mario, e)) {
          const yD = mario.Y - e.Y;
          if (mario.Ya > 0 && yD <= 0 && (!mario.onGround || !mario.wasOnGround)) {
            play("stomp");
            mario.xJumpSpeed = 0;
            mario.yJumpSpeed = -1.9;
            mario.jumpTime = 9;
            mario.Ya = mario.jumpTime * mario.yJumpSpeed;
            mario.onGround = false;
            mario.sliding = false;
            mario.invincible = 1;
            setScore(s => { g.score = s + 100; return s + 100; });

            if (e.type === "koopa") {
              const sh = createEntity(e.X, e.Y, 4, 12);
              sh.isShell = true;
              sh.Ya = -5;
              sh.type = "shell";
              shells.push(sh);
              e.deadTime = 10;
              e.alive = false;
            } else {
              e.deadTime = 10;
              e.alive = false;
              e.H = 8;
              e.Y += 8;
              e.flyDeath = false;
            }
          } else {
            getHurt();
          }
        }
      }

      // ── Shells ──
      for (let si = shells.length - 1; si >= 0; si--) {
        const s = shells[si];
        if (!s.alive) {
          if (s.deadTime > 0) {
            s.deadTime--;
            if (s.deadTime === 0) shells.splice(si, 1);
            else { s.X += s.Xa; s.Y += s.Ya; s.Ya *= 0.95; s.Ya += 1; }
          }
          continue;
        }
        if (s.shellCarried) continue;

        // Shell movement
        if (s.shellMoving) {
          s.anim++;
          s.Xa = s.facing * SHELL_SPEED;
          // Shell vs enemies (check inside movement for proper frame-by-frame collision)
          if (!subMove(s, s.Xa, 0, map)) {
            play("bump");
            s.facing = -s.facing;
          }
          s.onGround = false;
          subMove(s, 0, s.Ya, map);
          s.Ya *= 0.85;
          if (s.onGround) s.Xa *= GROUND_INERTIA; else s.Xa *= AIR_INERTIA;
          if (!s.onGround) s.Ya += 2;

          for (const e of enemies) {
            if (!e.alive) continue;
            if (Math.abs(s.X - e.X) < 16 && Math.abs(s.Y - e.Y) < e.H) {
              play("kick");
              e.Xa = s.facing * 2;
              e.Ya = -5;
              e.flyDeath = true;
              e.deadTime = 100;
              e.alive = false;
              setScore(sc => { g.score = sc + 200; return sc + 200; });
            }
          }
          for (const o of shells) {
            if (o === s || !o.alive || o.shellCarried) continue;
            if (Math.abs(s.X - o.X) < 16 && Math.abs(s.Y - o.Y) < 12) {
              play("kick");
              s.alive = false; o.alive = false;
              s.deadTime = 100; o.deadTime = 100;
              s.Xa = s.facing * 2; s.Ya = -5;
              o.Xa = -o.facing * 2; o.Ya = -5;
              setScore(sc => { g.score = sc + 500; return sc + 500; });
            }
          }
        }

        // Shell vs Mario
        if (mario.deathTime === 0 && mario.invincible <= 0) {
          const yD = mario.Y - s.Y;
          if (Math.abs(mario.X - s.X) < 16 && yD < 12 && yD > -mario.H) {
            if (mario.Ya > 0 && yD <= 0 && (!mario.onGround || !mario.wasOnGround)) {
              play("stomp");
              if (s.shellMoving) {
                s.shellMoving = false; s.facing = 0; s.Xa = 0;
              } else if (kRun()) {
                s.shellCarried = true;
                mario.carried = s;
              } else {
                s.shellMoving = true;
                s.facing = mario.facing;
              }
              mario.xJumpSpeed = 0;
              mario.yJumpSpeed = -1.9;
              mario.jumpTime = 9;
              mario.Ya = mario.jumpTime * mario.yJumpSpeed;
              mario.onGround = false;
              mario.sliding = false;
              mario.invincible = 1;
            } else if (s.shellMoving) {
              getHurt();
            } else {
              if (kRun()) {
                s.shellCarried = true;
                mario.carried = s;
              } else {
                s.shellMoving = true;
                s.facing = mario.facing;
                s.Xa = mario.facing * SHELL_SPEED;
                play("kick");
                mario.invincible = 1;
              }
            }
          }
        }
      }

      // ── Items (mushrooms + fire flowers) ──
      for (const item of items) {
        if (item.collected) continue;
        if (item.type === "mushroom" || item.type === "fireFlower") {
          if (item.type === "fireFlower") {
            // Fire flower: rise up like mushroom (reference: FireFlower.Move)
            if (item.life < MUSHROOM_RISE) {
              item.Y--;
              item.life++;
              continue;
            }
            // Static - just check collision
            if (overlap(mario, item)) {
              item.collected = true;
              if (!mario.fire) {
                mario.powerUpTime = 18;
                play("powerup");
                mario.big = true;
                mario.fire = true;
                mario.H = 24;
                if (mario.hearts < 3) mario.hearts++;
              } else {
                play("coin");
                setCoinCount(c => { g.coinCount = c + 1; return c + 1; });
                setScore(s => { g.score = s + 200; return s + 200; });
              }
            }
            continue;
          }

          // Mushroom — restore hearts and grow big
          if (item.life < MUSHROOM_RISE) {
            item.Y--;
            item.life++;
            continue;
          }
          item.Xa = item.facing * MUSHROOM_SPEED;
          if (!subMove(item, item.Xa, 0, map)) item.facing = -item.facing;
          item.onGround = false;
          subMove(item, 0, item.Ya, map);
          item.Ya *= 0.85;
          if (item.onGround) item.Xa *= GROUND_INERTIA; else item.Xa *= AIR_INERTIA;
          if (!item.onGround) item.Ya += 2;

          if (overlap(mario, item)) {
            item.collected = true;
            mario.powerUpTime = 18;
            play("powerup");
            mario.big = true;
            mario.fire = false;
            mario.H = 24;
            if (mario.hearts < 3) {
              mario.hearts++;
            } else {
              play("coin");
              setCoinCount(c => { g.coinCount = c + 1; return c + 1; });
              setScore(s => { g.score = s + 200; return s + 200; });
            }
          }
        }
      }

      // ── Fireballs (reference: fireball.js) ──
      for (let fi = fireballs.length - 1; fi >= 0; fi--) {
        const fb = fireballs[fi];
        if (!fb.alive) {
          if (fb.deadTime > 0) {
            fb.deadTime--;
            if (fb.deadTime === 0) { fireballs.splice(fi, 1); continue; }
            fb.X += fb.Xa; fb.Y += fb.Ya;
            fb.Ya *= 0.95; fb.Ya += 1;
          } else {
            fireballs.splice(fi, 1);
          }
          continue;
        }
        fb.anim++;
        fb.Xa = fb.facing * FIREBALL_SPEED;

        // Fireball vs enemies
        for (const e of enemies) {
          if (!e.alive) continue;
          if (Math.abs(fb.X - e.X) < 16 && Math.abs(fb.Y - e.Y) < e.H) {
            if (e.noFireballDeath) continue;
            play("kick");
            e.Xa = fb.facing * 2;
            e.Ya = -5;
            e.flyDeath = true;
            e.deadTime = 100;
            e.alive = false;
            fb.alive = false;
            fb.deadTime = 100;
            fb.Xa = -fb.facing * 2;
            fb.Ya = -5;
            setScore(sc => { g.score = sc + 200; return sc + 200; });
          }
        }
        if (!fb.alive) continue;

        // Fireball movement (reference: SubMove then bounce)
        if (!subMove(fb, fb.Xa, 0, map)) {
          fb.alive = false;
          fb.deadTime = 100;
          fb.Xa = -fb.facing * 2;
          fb.Ya = -5;
          continue;
        }
        fb.onGround = false;
        subMove(fb, 0, fb.Ya, map);
        if (fb.onGround) fb.Ya = -10;
        fb.Ya *= 0.95;
        if (fb.onGround) fb.Xa *= 0.89; else fb.Xa *= 0.89;
        if (!fb.onGround) fb.Ya += 1.5;
      }

      // ── Particles ──
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.xa; p.y += p.ya;
        p.ya *= 0.95; p.ya += 3;
        p.life--;
        if (p.life <= 0) g.particles.splice(i, 1);
      }

      // ── Coin anims ──
      for (let i = g.coinAnims.length - 1; i >= 0; i--) {
        const ca = g.coinAnims[i];
        ca.life--;
        if (ca.life < 0) { g.coinAnims.splice(i, 1); continue; }
        ca.y += ca.ya;
        ca.ya += 1;
      }

      // ── Bump anims ──
      for (const b of g.bumpAnims) b.t--;
      g.bumpAnims = g.bumpAnims.filter(b => b.t > 0);
    };

    // ── Helpers ──
    function handleBlockBump(
      tx: number, ty: number, tile: number, canBreak: boolean,
      g: NonNullable<typeof gRef.current>, play: (n: string) => void,
      items: Entity[], enemies: Entity[], shells: Entity[], mario: Entity,
    ) {
      if (isBumpable(tile)) {
        const aboveTile = g.map[ty - 1]?.[tx] ?? 0;
        if (isPickUpable(aboveTile)) {
          play("coin");
          setCoinCount(c => { g.coinCount = c + 1; return c + 1; });
          setScore(s => { g.score = s + 200; return s + 200; });
          g.map[ty - 1][tx] = 0;
        }
        g.map[ty][tx] = 4;
        g.bumpAnims.push({ tx, ty, t: 8 });

        if (isSpecial(tile)) {
          play("sprout");
          // Reference: if (!Large) → Mushroom; else → FireFlower
          if (!mario.big) {
            const item = createEntity(tx * TILE + 8, ty * TILE + 8, 4, 12);
            item.type = "mushroom";
            item.facing = 1;
            items.push(item);
          } else {
            const item = createEntity(tx * TILE + 8, ty * TILE + 8, 4, 12);
            item.type = "fireFlower";
            items.push(item);
          }
        } else {
          play("coin");
          setCoinCount(c => { g.coinCount = c + 1; return c + 1; });
          setScore(s => { g.score = s + 200; return s + 200; });
          g.coinAnims.push({ x: tx * TILE, y: ty * TILE - TILE, ya: -6, life: 10 });
        }
      }
      if (isBreakable(tile) && canBreak) {
        play("breakBlock");
        g.map[ty][tx] = 0;
        for (let xx = 0; xx < 2; xx++)
          for (let yy = 0; yy < 2; yy++)
            g.particles.push({
              x: tx * TILE + xx * 8 + 4,
              y: ty * TILE + yy * 8 + 4,
              xa: (xx * 2 - 1) * 4,
              ya: (yy * 2 - 1) * 4 - 8,
              life: 10,
            });
      }

      // BumpCheck for enemies AND shells on top of the bumped block
      // (reference: BumpInto calls BumpCheck on all sprites)
      for (const e of enemies) {
        if (!e.alive) continue;
        if (e.X + e.W > tx * TILE && e.X - e.W < tx * TILE + TILE &&
            ty === ((e.Y - 1) / TILE | 0)) {
          play("kick");
          e.Xa = -mario.facing * 2;
          e.Ya = -5;
          e.flyDeath = true;
          e.deadTime = 100;
          e.alive = false;
          setScore(s => { g.score = s + 200; return s + 200; });
        }
      }
      for (const s of shells) {
        if (!s.alive || s.shellCarried) continue;
        if (s.X + s.W > tx * TILE && s.X - s.W < tx * TILE + TILE &&
            ty === ((s.Y - 1) / TILE | 0)) {
          // Shell BumpCheck (reference: Shell.BumpCheck)
          s.facing = -mario.facing;
          s.Ya = -10;
        }
      }
    }

    function blinkMario(mario: Entity, showBig: boolean) {
      // No-op: power-up animation disabled
    }

    function die() {
      if (mario.deathTime > 0) return;
      play("die");
      mario.deathTime = 1;
    }

    function getHurt() {
      if (mario.deathTime > 0 || mario.invincible > 0) return;
      // Remove 1 heart (3 hearts total, like 3 hit points)
      mario.hearts--;
      if (mario.hearts <= 0) {
        die();
      } else {
        play("bump");
        // Shrink Mario for visual feedback when hearts drop to 1
        if (mario.hearts <= 1) {
          mario.big = false;
          mario.fire = false;
          mario.H = 12;
        }
        mario.invincible = 60;
      }
    }

    function isTileSolid(tile: number): boolean {
      return tile === 1 || tile === 2 || tile === 3 || tile === 4;
    }

    // ══════════════════════════════════════════════════════════════
    //  RENDER
    // ══════════════════════════════════════════════════════════════
    const render = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      const cam = g.camX;

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      sky.addColorStop(0, "#5c94fc"); sky.addColorStop(1, "#87ceeb");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Background parallax
      for (const hp of [0, 16, 48, 80, 120, 160]) {
        const hx = hp * TILE - cam * 0.5;
        if (hx > -200 && hx < CANVAS_W + 200) {
          const img = hp % 3 === 0 ? images.hill1 : images.hill2;
          if (img) ctx.drawImage(img, hx, CANVAS_H - 160, 200, 140);
        }
      }
      for (let i = 0; i < 8; i++) {
        const cx = [5,18,35,55,75,100,130,160][i] * TILE - cam * 0.3;
        if (cx > -100 && cx < CANVAS_W + 100) {
          const img = [images.cloud1, images.cloud2, images.cloud3][i % 3];
          if (img) ctx.drawImage(img, cx, 30 + (i % 3) * 40, 96, 48);
        }
      }
      for (let i = 0; i < 5; i++) {
        const bx = [10, 30, 60, 90, 140][i] * TILE - cam;
        if (bx > -200 && bx < CANVAS_W + 200) {
          const img = [images.bush1, images.bush2, images.bush3][i % 3];
          if (img) ctx.drawImage(img, bx, CANVAS_H - 80, 128, 48);
        }
      }

      // Tiles
      const sc = Math.max(0, (cam / TILE | 0) - 1);
      const ec = Math.min(LEVEL_COLS, ((cam + CANVAS_W) / TILE | 0) + 2);
      for (let r = 0; r < LEVEL_ROWS; r++) {
        for (let c = sc; c < ec; c++) {
          const t = map[r][c];
          if (t === 0) continue;
          const dx = c * TILE - cam;
          const dy = r * TILE;
          let bo = 0;
          for (const b of g.bumpAnims) {
            if (b.tx === c && b.ty === r && b.t > 0) bo = b.t > 4 ? -(8 - b.t) * 2 : -b.t * 2;
          }
          let img: HTMLImageElement | undefined;
          if (t === 1) img = images.ground;
          else if (t === 2) img = images.brick;
          else if (t === 3) img = images.mystery;
          else if (t === 4) img = images.hardBlock;
          else if (t === 5) img = images.pipeTop;
          else if (t === 6) img = images.pipeBottom;
          else if (t === 7) img = images.brick;
          if (img) ctx.drawImage(img, dx, dy + bo, TILE, TILE);
        }
      }

      // Castle & flag
      const fx = 180 * TILE - cam;
      if (fx > -100 && fx < CANVAS_W + 100) {
        if (images.flagPole) ctx.drawImage(images.flagPole, fx + 8, (LEVEL_ROWS - 10) * TILE, 16, TILE * 8);
        if (images.flag) ctx.drawImage(images.flag, fx - 8, (LEVEL_ROWS - 10) * TILE, 32, 32);
      }
      const cx2 = 185 * TILE - cam;
      if (cx2 > -200 && cx2 < CANVAS_W + 200 && images.castle) {
        ctx.drawImage(images.castle, cx2 - TILE, (LEVEL_ROWS - 5) * TILE, TILE * 3, TILE * 3);
      }

      // Consumable floating coins
      for (const coin of coins2) {
        if (coin.collected) continue;
        const dx = coin.x - cam;
        if (dx < -TILE || dx > CANVAS_W + TILE) continue;
        if (images.coin) {
          ctx.drawImage(images.coin, dx - TILE / 2, coin.y - TILE, TILE, TILE);
        }
      }

      // Items
      for (const item of items) {
        if (item.collected) continue;
        const dx = item.X - cam;
        if (dx < -TILE || dx > CANVAS_W + TILE) continue;
        if (item.type === "mushroom" && images.mushroom) {
          ctx.drawImage(images.mushroom, dx - TILE / 2, item.Y - TILE, TILE, TILE);
        } else if (item.type === "fireFlower" && images.fireFlower) {
          ctx.drawImage(images.fireFlower, dx - TILE / 2, item.Y - TILE, TILE, TILE);
        }
      }

      // Enemies
      for (const e of enemies) {
        if (!e.alive && e.deadTime > 0 && !e.flyDeath) {
          const dx = e.X - cam;
          if (dx > -TILE && dx < CANVAS_W + TILE) {
            ctx.drawImage(images.goombaFlat, dx - TILE / 2, e.Y - 8, TILE, 8);
          }
          continue;
        }
        if (!e.alive && e.flyDeath) {
          const dx = e.X - cam;
          if (dx > -TILE && dx < CANVAS_W + TILE && images.goomba1) {
            ctx.save();
            ctx.translate(dx, e.Y - TILE / 2);
            ctx.scale(1, -1);
            ctx.drawImage(images.goomba1, -TILE / 2, -TILE / 2, TILE, TILE);
            ctx.restore();
          }
          continue;
        }
        if (!e.alive) continue;
        const dx = e.X - cam;
        if (dx < -TILE || dx > CANVAS_W + TILE) continue;
        if (e.type === "goomba") {
          const img = e.frame === 0 ? images.goomba1 : images.goomba2;
          if (img) ctx.drawImage(img, dx - TILE / 2, e.Y - TILE, TILE, TILE);
        } else if (e.type === "koopa") {
          const img = e.frame === 0 ? images.koopa1 : images.koopa2;
          if (img) {
            ctx.save();
            if (e.facing === -1) { ctx.translate(dx + TILE / 2, e.Y - TILE); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0, TILE, TILE); }
            else ctx.drawImage(img, dx - TILE / 2, e.Y - TILE, TILE, TILE);
            ctx.restore();
          }
        }
      }

      // Shells
      for (const s of shells) {
        const dx = s.X - cam;
        if (dx > -TILE && dx < CANVAS_W + TILE && images.koopaShell) {
          ctx.drawImage(images.koopaShell, dx - TILE / 2, s.Y - TILE, TILE, TILE);
        }
      }

      // Fireballs
      for (const fb of fireballs) {
        if (!fb.alive && fb.deadTime === 0) continue;
        const dx = fb.X - cam;
        if (dx > -TILE && dx < CANVAS_W + TILE && images.coin) {
          ctx.drawImage(images.coin, dx - 8, fb.Y - 8, 16, 16);
        }
      }

      // Mario
      const mx = mario.X - cam;
      const my = mario.Y;
      if (mario.deathTime > 0) {
        if (images.mSmallDeath) ctx.drawImage(images.mSmallDeath, mx - 16, my - TILE, TILE, TILE);
      } else if (mario.invincible > 0 && ((mario.invincible / 3) | 0) % 2 === 0) {
        // Blink invisible
      } else {
        const big = mario.big;
        let img: HTMLImageElement | undefined;
        if (mario.ducking && big) {
          img = images.mBigSlide;
        } else if (!mario.onGround) {
          img = big ? images.mBigJump : images.mSmallJump;
        } else if (Math.abs(mario.Xa) > 0.5) {
          const f = big
            ? [images.mBigRun1, images.mBigRun2, images.mBigRun3]
            : [images.mSmallRun1, images.mSmallRun2, images.mSmallRun3];
          img = f[g.runFrame];
        } else {
          img = big ? images.mBigIdle : images.mSmallIdle;
        }
        if (mario.onGround && ((mario.facing === -1 && mario.Xa > 0) || (mario.facing === 1 && mario.Xa < 0))) {
          if (Math.abs(mario.Xa) > 1) img = big ? images.mBigSlide : images.mSmallSlide;
        }
        if (img) {
          const sh = TILE;
          const sw = big ? 48 : TILE;
          ctx.save();
          const drawY = my - sh;
          if (mario.facing === -1) {
            ctx.translate(mx + sw / 2, drawY + sh / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
          } else {
            ctx.drawImage(img, mx - sw / 2, drawY, sw, sh);
          }
          ctx.restore();
        }
      }

      // Particles
      for (const p of g.particles) {
        ctx.fillStyle = "#c84c0c";
        ctx.fillRect(p.x - cam, p.y, 6, 6);
      }

      // Coin animations
      for (const ca of g.coinAnims) {
        const dx = ca.x - cam;
        if (images.coin) ctx.drawImage(images.coin, dx, ca.y, 16, 16);
      }

      // ── HUD ──
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, CANVAS_W, 36);
      ctx.fillStyle = "#fff";
      ctx.font = 'bold 14px "Press Start 2P", monospace';
      ctx.textBaseline = "middle";
      ctx.fillText("MARIO", 20, 18);
      ctx.fillText(`×${String(g.score).padStart(6, "0")}`, 100, 18);
      ctx.fillText(`×${g.coinCount}`, 280, 18);
      ctx.fillText(`TIME ${Math.max(0, g.timeLeft)}`, CANVAS_W - 240, 18);
      // Hearts: filled ♥ / empty ♡
      const heartsStr = `♥`.repeat(mario.hearts) + `♡`.repeat(3 - mario.hearts);
      ctx.fillText(heartsStr, CANVAS_W - 130, 18);
      ctx.fillText(`♥×${g.lives}`, CANVAS_W - 50, 18);
    };

    let raf: number;
    const loop = () => { update(); render(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      clearInterval(countdown);
    };
  }, [gs]);

  // ── Auto-restart ──
  useEffect(() => {
    if (gs !== "gameover") {
      if (restartTimerRef.current) { clearTimeout(restartTimerRef.current); restartTimerRef.current = null; }
      return;
    }
    restartTimerRef.current = setTimeout(async () => {
      restartTimerRef.current = null;
      try { await initGame(); }
      catch (e) {
        console.error("Restart failed:", e);
        restartTimerRef.current = setTimeout(() => { restartTimerRef.current = null; initGame(); }, 2000);
      }
    }, 3000);
    return () => { if (restartTimerRef.current) clearTimeout(restartTimerRef.current); };
  }, [gs, initGame]);

  // ── Pause / Resume ──
  const togglePause = useCallback(() => {
    setGs(prev => prev === "paused" ? "playing" : "paused");
  }, []);

  // Keyboard: Escape or P to toggle pause during gameplay
  useEffect(() => {
    if (showStart || (gs !== "playing" && gs !== "paused")) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gs, showStart, togglePause]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem("mario-muted", String(next));
    if (gRef.current) gRef.current.setMuted(next);
  };

  // ── Track fullscreen state ──
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── Save high score when game ends ──
  useEffect(() => {
    if (gs !== "won" && gs !== "gameover") return;
    // Read final score from gRef (includes time bonus for win)
    const finalScore = gRef.current?.score ?? 0;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem("mario-high-score", String(finalScore));
    }
  }, [gs, highScore]);

  // ── Start screen animation ──
  useEffect(() => {
    if (!showStart) return;
    const cvs = startCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;
    if (!ctx) return;

    // Pre-load Mario sprites for the animation
    const marioIdle = new window.Image();
    marioIdle.src = SPRITES.mSmallIdle;
    const marioRun1 = new window.Image();
    marioRun1.src = SPRITES.mSmallRun1;
    const marioRun2 = new window.Image();
    marioRun2.src = SPRITES.mSmallRun2;
    const marioRun3 = new window.Image();
    marioRun3.src = SPRITES.mSmallRun3;
    const groundImg = new window.Image();
    groundImg.src = SPRITES.ground;
    const brickImg = new window.Image();
    brickImg.src = SPRITES.brick;
    const mysteryImg = new window.Image();
    mysteryImg.src = SPRITES.mystery;
    const coinImg = new window.Image();
    coinImg.src = SPRITES.coin;

    let animFrame = 0;
    let bobY = 0;
    let bobDir = 1;

    const animate = () => {
      if (!showStart) return;
      const w = cvs.width;
      const h = cvs.height;
      ctx.clearRect(0, 0, w, h);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#5c94fc");
      sky.addColorStop(1, "#87ceeb");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Ground tiles
      const groundY = h - 40;
      for (let gx = 0; gx < w; gx += 32) {
        if (groundImg.complete && groundImg.naturalWidth > 0) {
          ctx.drawImage(groundImg, gx, groundY, 32, 40);
        } else {
          ctx.fillStyle = "#c84c0c";
          ctx.fillRect(gx, groundY, 32, 40);
        }
      }

      // Decorations: a brick block and question mark on the ground
      const decorTile = (dx: number, img: HTMLImageElement | null, label: string) => {
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, dx, groundY - 32, 32, 32);
        } else {
          ctx.fillStyle = label === "?" ? "#e5a100" : "#c84c0c";
          ctx.fillRect(dx, groundY - 32, 32, 32);
          ctx.strokeStyle = "#333";
          ctx.strokeRect(dx, groundY - 32, 32, 32);
          if (label) {
            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px monospace";
            ctx.textAlign = "center";
            ctx.fillText(label, dx + 16, groundY - 14);
          }
        }
      };
      decorTile(60, brickImg, "");
      decorTile(92, mysteryImg, "?");
      decorTile(124, brickImg, "");
      decorTile(156, mysteryImg, "?");

      // Draw animated Mario
      bobY += 0.3 * bobDir;
      if (bobY > 3 || bobY < -3) bobDir *= -1;

      animFrame++;
      // Cycle through running frames for walking-in-place animation
      const frames = [marioRun1, marioRun2, marioRun3, marioRun2];
      const marioImg = frames[Math.floor(animFrame / 10) % 4];

      const marioX = w / 2 - 16;
      const marioY = groundY - 32 - bobY;

      if (marioImg && marioImg.complete && marioImg.naturalWidth > 0) {
        ctx.drawImage(marioImg, marioX, marioY, 32, 32);
      } else if (marioIdle && marioIdle.complete && marioIdle.naturalWidth > 0) {
        ctx.drawImage(marioIdle, marioX, marioY, 32, 32);
      } else {
        // Fallback: draw a red rectangle
        ctx.fillStyle = "#e52521";
        ctx.fillRect(marioX + 4, marioY, 24, 32);
        ctx.fillStyle = "#fff";
        ctx.fillRect(marioX + 8, marioY + 4, 6, 6);
        ctx.fillRect(marioX + 18, marioY + 4, 6, 6);
      }

      // Coin floating near Mario
      if (coinImg.complete && coinImg.naturalWidth > 0) {
        const coinBob = Math.sin(animFrame * 0.05) * 6;
        ctx.drawImage(coinImg, marioX + 40, marioY + coinBob, 16, 16);
      }

      startAnimRef.current = requestAnimationFrame(animate);
    };
    startAnimRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(startAnimRef.current);
    };
  }, [showStart]);

  // ── Start screen keyboard listener ──
  useEffect(() => {
    if (!showStart) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        cancelAnimationFrame(startAnimRef.current);
        setShowStart(false);
        initGame();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showStart, initGame]);

  const handleStart = async () => {
    cancelAnimationFrame(startAnimRef.current);
    setShowStart(false);
    await initGame();
  };

  // ── JSX ──
  return (
    <section className="relative w-full bg-[#5c94fc] overflow-hidden" id="mario-game">      {/* ── Pause button (visible during gameplay) ── */}
      {!showStart && (gs === "playing" || gs === "paused") && (
        <button
          onClick={togglePause}
          className="absolute top-3 left-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white text-lg transition-all duration-200 active:scale-90"
          aria-label={gs === "paused" ? "Resume" : "Pause"}
          title={gs === "paused" ? "Resume game" : "Pause game"}
        >
          {gs === "paused" ? "▶" : "⏸"}
        </button>
      )}

      {/* ── Mute button (always visible) ── */}
      <button
        onClick={toggleMute}
        className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white text-lg transition-all duration-200 active:scale-90"
        aria-label={isMuted ? "Unmute" : "Mute"}
        title={isMuted ? "Unmute sound" : "Mute sound"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {showStart && (
        <div className="relative w-full flex flex-col items-center justify-center py-6 md:py-10 bg-gradient-to-b from-[#5c94fc] to-[#87ceeb]">
          <style>{`
            @keyframes pulse-text {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.05); }
            }
          `}</style>
          <div className="relative mb-3">
            <div className="relative w-32 md:w-40 overflow-hidden">
              <Image src="/image/logo.png" alt="Sanskriti" width={200} height={80} className="object-contain" />
            </div>
          </div>
          <canvas
            ref={startCanvasRef}
            width={280}
            height={140}
            className="rounded-lg shadow-lg shadow-black/30 mb-4"
            style={{ imageRendering: "pixelated" }}
          />
          {highScore > 0 && (
            <p className="text-xs text-yellow-300/80 font-pixel mb-2" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              HIGH SCORE: {String(highScore).padStart(6, "0")}
            </p>
          )}
          <p
            className="text-white text-sm md:text-base font-pixel mb-4 cursor-pointer select-none"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              animation: "pulse-text 1.5s ease-in-out infinite",
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
            }}
            onClick={handleStart}
          >
            PRESS ENTER TO START
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-[#e52521] text-white text-sm md:text-base font-pixel rounded-lg hover:bg-[#c41e1a] active:scale-95 transition-all duration-150 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 border-b-4 border-[#8c0000] hover:border-[#6a0000] md:hidden"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            START GAME
          </button>
          <p className="mt-3 text-[10px] md:text-xs text-white/50 font-pixel text-center max-w-md" style={{ fontFamily: '"Press Start 2P", monospace' }}>
            Arrow keys to move · Up/Space to jump · A to run/shoot
          </p>
        </div>
      )}
      {!showStart && (
        <div className="flex flex-col items-center bg-[#5c94fc]">
          <div className="relative flex justify-center w-full">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="max-w-full h-auto"
            />
            {/* ── Fullscreen toggle (mobile only) ── */}
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="md:hidden absolute top-2 left-2 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-black/40 hover:bg-black/60 text-white text-base transition-all duration-200 active:scale-90"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>
          </div>
          {/* ── Mobile touch controls ── */}
          <div
            className="md:hidden flex items-center justify-between w-full max-w-[500px] px-4 py-3 gap-2 select-none"
            style={{ touchAction: "none" }}
          >
            {/* D-pad: Left + Right */}
            <div className="flex items-center gap-2">
              {/* Left */}
              <button
                onTouchStart={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowLeft"] = true; }}
                onTouchEnd={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowLeft"] = false; }}
                onTouchCancel={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowLeft"] = false; }}
                onMouseDown={() => { if (gRef.current) gRef.current.keys["ArrowLeft"] = true; }}
                onMouseUp={() => { if (gRef.current) gRef.current.keys["ArrowLeft"] = false; }}
                onMouseLeave={() => { if (gRef.current) gRef.current.keys["ArrowLeft"] = false; }}
                className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/20 active:bg-white/40 text-white text-2xl font-bold border-2 border-white/30 active:border-white/60 transition-colors duration-75"
                aria-label="Move left"
              >
                ◀
              </button>
              {/* Right */}
              <button
                onTouchStart={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowRight"] = true; }}
                onTouchEnd={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowRight"] = false; }}
                onTouchCancel={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowRight"] = false; }}
                onMouseDown={() => { if (gRef.current) gRef.current.keys["ArrowRight"] = true; }}
                onMouseUp={() => { if (gRef.current) gRef.current.keys["ArrowRight"] = false; }}
                onMouseLeave={() => { if (gRef.current) gRef.current.keys["ArrowRight"] = false; }}
                className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/20 active:bg-white/40 text-white text-2xl font-bold border-2 border-white/30 active:border-white/60 transition-colors duration-75"
                aria-label="Move right"
              >
                ▶
              </button>
            </div>

            {/* Action buttons: Jump + Duck + A */}
            <div className="flex flex-col items-center gap-2">
              {/* Jump */}
              <button
                onTouchStart={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowUp"] = true; }}
                onTouchEnd={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowUp"] = false; }}
                onTouchCancel={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowUp"] = false; }}
                onMouseDown={() => { if (gRef.current) gRef.current.keys["ArrowUp"] = true; }}
                onMouseUp={() => { if (gRef.current) gRef.current.keys["ArrowUp"] = false; }}
                onMouseLeave={() => { if (gRef.current) gRef.current.keys["ArrowUp"] = false; }}
                className="w-16 h-14 flex items-center justify-center rounded-xl bg-white/20 active:bg-yellow-300/50 text-white active:text-yellow-200 text-lg font-bold border-2 border-white/30 active:border-yellow-300/60 transition-colors duration-75"
                aria-label="Jump"
              >
                ▲<br/><span className="text-[10px]">JUMP</span>
              </button>
            </div>

            {/* Duck + A buttons stacked */}
            <div className="flex flex-col items-center gap-2">
              {/* Duck */}
              <button
                onTouchStart={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowDown"] = true; }}
                onTouchEnd={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowDown"] = false; }}
                onTouchCancel={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["ArrowDown"] = false; }}
                onMouseDown={() => { if (gRef.current) gRef.current.keys["ArrowDown"] = true; }}
                onMouseUp={() => { if (gRef.current) gRef.current.keys["ArrowDown"] = false; }}
                onMouseLeave={() => { if (gRef.current) gRef.current.keys["ArrowDown"] = false; }}
                className="w-14 h-12 flex items-center justify-center rounded-xl bg-white/20 active:bg-white/40 text-white text-sm font-bold border-2 border-white/30 active:border-white/60 transition-colors duration-75"
                aria-label="Duck"
              >
                ▼<br/><span className="text-[10px]">DUCK</span>
              </button>
              {/* A (run) */}
              <button
                onTouchStart={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["a"] = true; }}
                onTouchEnd={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["a"] = false; }}
                onTouchCancel={(e) => { e.preventDefault(); if (gRef.current) gRef.current.keys["a"] = false; }}
                onMouseDown={() => { if (gRef.current) gRef.current.keys["a"] = true; }}
                onMouseUp={() => { if (gRef.current) gRef.current.keys["a"] = false; }}
                onMouseLeave={() => { if (gRef.current) gRef.current.keys["a"] = false; }}
                className="w-14 h-12 flex items-center justify-center rounded-xl bg-red-500/30 active:bg-red-500/60 text-white text-sm font-bold border-2 border-red-400/40 active:border-red-400/70 transition-colors duration-75"
                aria-label="Run / Shoot"
              >
                A<br/><span className="text-[8px]">RUN</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Pause overlay ── */}
      {gs === "paused" && !showStart && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              PAUSED
            </h2>
            <button
              onClick={togglePause}
              className="px-8 py-3 bg-[#e52521] text-white text-sm rounded hover:bg-[#c41e1a] transition-colors active:scale-95"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              RESUME
            </button>
            <p className="text-xs text-white/40 mt-3" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              Press ESC or P to resume
            </p>
          </div>
        </div>
      )}

      {(gs === "won" || gs === "gameover") && !showStart && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              {gs === "won" ? "YOU WIN!" : "GAME OVER"}
            </h2>             <p className="text-sm text-white/70 mb-4" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              Score: {score} · Coins: {coinCount} · Lives: {lives}
            </p>
            <p className="text-xs text-yellow-300/80 mb-3" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              HIGH SCORE: {String(Math.max(highScore, score)).padStart(6, "0")}
            </p>
            {gs === "gameover" && (
              <p className="text-xs text-white/50" style={{ fontFamily: '"Press Start 2P", monospace' }}>Restarting in 3s...</p>
            )}
            {gs === "won" && (
              <button
                onClick={handleStart}
                className="px-6 py-2 bg-[#e52521] text-white text-sm rounded hover:bg-[#c41e1a] transition-colors"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                PLAY AGAIN
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
