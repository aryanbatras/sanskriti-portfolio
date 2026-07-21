import { SFX_PATH } from "./types";

// ─── Sound effect mapping ───────────────────────────────────────────

const SOUND_MAP: Record<string, string> = {
  select:  `${SFX_PATH}/Pop:Bubble SFX/Pop FX 1-RCM.wav`,
  confirm: `${SFX_PATH}/Success:Power-Up SFX/Power Up FX 2-RCM.wav`,
  hit:     `${SFX_PATH}/Percussion SFX/Percussion FX 3-RCM.wav`,
  power:   `${SFX_PATH}/Success:Power-Up SFX/Power Up FX 1-RCM.wav`,
  win:     `${SFX_PATH}/Success:Power-Up SFX/Simple Celebration FX1-RCM.wav`,
  fail:    `${SFX_PATH}/Fail SFX/Fail FX 2-RCM.wav`,
  mystery: `${SFX_PATH}/Mysterious SFX/Mysterious FX 1-RCM.wav`,
  swipe:   `${SFX_PATH}/Transition SFX/Swipe FX 1-RCM.wav`,
};

// ─── Preload all RPG sounds ─────────────────────────────────────────

export function preloadRpgSounds(): (name: string, vol?: number) => void {
  const cache: Record<string, HTMLAudioElement> = {};
  for (const [key, src] of Object.entries(SOUND_MAP)) {
    const a = new Audio();
    a.src = src;
    a.preload = "auto";
    cache[key] = a;
  }
  return (name: string, vol = 0.3) => {
    const a = cache[name];
    if (a) {
      a.currentTime = 0;
      a.volume = vol;
      a.play().catch(() => {});
    }
  };
}

// ─── Simple one-shot sound for street fight ─────────────────────────

export function fightSfx(name: string, vol = 0.35) {
  const src =
    name === "hit"   ? `${SFX_PATH}/Percussion SFX/Percussion FX 3-RCM.wav` :
    name === "win"   ? `${SFX_PATH}/Success:Power-Up SFX/Simple Celebration FX1-RCM.wav` :
    name === "fail"  ? `${SFX_PATH}/Fail SFX/Fail FX 2-RCM.wav` :
    name === "swipe" ? `${SFX_PATH}/Transition SFX/Swipe FX 1-RCM.wav` :
                       `${SFX_PATH}/Pop:Bubble SFX/Pop FX 1-RCM.wav`;
  const a = new Audio(src);
  if (a) {
    a.volume = vol;
    a.play().catch(() => {});
  }
}
