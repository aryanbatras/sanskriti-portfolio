"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ── Triple Treat SFX ──
const SFX = "/Triple Treat SFX";
function preloadRpgSounds() {
  const cache: Record<string, HTMLAudioElement> = {};
  const sounds: Record<string, string> = {
    select: `${SFX}/Pop:Bubble SFX/Pop FX 1-RCM.wav`,
    confirm: `${SFX}/Success:Power-Up SFX/Power Up FX 2-RCM.wav`,
    hit: `${SFX}/Percussion SFX/Percussion FX 3-RCM.wav`,
    power: `${SFX}/Success:Power-Up SFX/Power Up FX 1-RCM.wav`,
    win: `${SFX}/Success:Power-Up SFX/Simple Celebration FX1-RCM.wav`,
    fail: `${SFX}/Fail SFX/Fail FX 2-RCM.wav`,
    mystery: `${SFX}/Mysterious SFX/Mysterious FX 1-RCM.wav`,
    swipe: `${SFX}/Transition SFX/Swipe FX 1-RCM.wav`,
  };
  for (const [key, src] of Object.entries(sounds)) {
    const a = new Audio(); a.src = src; a.preload = "auto";
    cache[key] = a;
  }
  return (name: string, vol = 0.3) => {
    const a = cache[name];
    if (a) { a.currentTime = 0; a.volume = vol; a.play().catch(() => {}); }
  };
}

// ── Story scenes ──
interface Choice {
  text: string;
  next: string;
  sound?: string;
}

interface Scene {
  id: string;
  text: string;
  img?: string;
  choices: Choice[];
  effects?: string;
}

const STORY: Record<string, Scene> = {
  start: {
    id: "start",
    text: "The alarm buzzes. 7:00 AM. First day of college. Sanskriti grabs her backpack, throws on her navy blazer, and steps out into the crisp morning air. The campus looms ahead — towers of brick and ivy, alive with possibility.",
    img: "/new_game_assets/Sanskriti_Idle.png",
    choices: [
      { text: "▶  Head to the library first", next: "library" },
      { text: "▶  Grab coffee from the cafeteria", next: "cafeteria" },
    ],
    effects: "swipe",
  },

  cafeteria: {
    id: "cafeteria",
    text: "The cafeteria buzzes with energy. Students huddle over laptops, notebooks scattered everywhere. You spot an empty table near the window... but something's blocking the way.",
    img: "/new_game_assets/CoffeeMug_Enemy.png",
    choices: [
      { text: "▶  Push past the obstacle", next: "coffeeFight" },
      { text: "▶  Take a different route", next: "library" },
    ],
    effects: "swipe",
  },

  coffeeFight: {
    id: "coffeeFight",
    text: "A rogue coffee mug blocks your path! Steam rises angrily from its ceramic body. It's one of those overly caffeinated project mugs — and it's not happy about being empty.",
    img: "/new_game_assets/CoffeeMug_Enemy.png",
    choices: [
      { text: "⚔  Dodge and grab the coffee pot", next: "coffeeWin" },
      { text: "🏃  Run past it to the library", next: "library" },
    ],
    effects: "hit",
  },

  coffeeWin: {
    id: "coffeeWin",
    text: "You slide past the angry mug and grab the fresh coffee pot! The rich aroma fills the air. ☕ POWER-UP ACQUIRED: Caffeine Boost! Your confidence surges as you head to class.",
    img: "/new_game_assets/Coffee_1Up.png",
    choices: [
      { text: "▶  Head to the library (energized!)", next: "libraryB" },
    ],
    effects: "power",
  },

  library: {
    id: "library",
    text: "The library's massive oak doors loom before you. Knowledge awaits inside! But a Pencil Enemy stands guard — a sharpened yellow fiend with an attitude, tapping its eraser head impatiently.",
    img: "/new_game_assets/Pencil_Enemy.png",
    choices: [
      { text: "⚔  Confront the pencil!", next: "pencilFight" },
      { text: "📱  Throw your phone to distract it", next: "phoneDistract" },
    ],
    effects: "mystery",
  },

  libraryB: {
    id: "libraryB",
    text: "You arrive at the library buzzing with caffeine. A Pencil Enemy stands guard — but you're ready. It doesn't stand a chance.",
    img: "/new_game_assets/Pencil_Enemy.png",
    choices: [
      { text: "⚔  Strike first!", next: "pencilFightWin" },
      { text: "💻  Open your laptop and blind it", next: "laptopWin" },
    ],
    effects: "hit",
  },

  phoneDistract: {
    id: "phoneDistract",
    text: "You whip out your phone and toss it across the hall. The Pencil Enemy's eyes follow the arc — SCRATCH! It runs after the shiny distraction. The path is clear! But you lost your phone... 📱💔",
    img: "/new_game_assets/Phone_Coin.png",
    choices: [
      { text: "▶  Sneak into the library", next: "bugEntrance" },
    ],
    effects: "swipe",
  },

  pencilFight: {
    id: "pencilFight",
    text: "The Pencil Enemy lunges! You sidestep and grab a nearby notebook — SMACK! The pencil snaps in half, scattering graphite everywhere. First victory! 🖊️💥",
    img: "/new_game_assets/Pencil_Enemy.png",
    choices: [
      { text: "▶  Enter the library", next: "bugEntrance" },
    ],
    effects: "hit",
  },

  pencilFightWin: {
    id: "pencilFightWin",
    text: "Fueled by coffee, you execute a perfect dodge-roll and counter! The Pencil Enemy shatters into splinters. The caffeine sings in your veins! +50 BRAVERY!",
    img: "/new_game_assets/Pencil_Enemy.png",
    choices: [
      { text: "▶  Storm into the library!", next: "bugEntrance" },
    ],
    effects: "hit",
  },

  laptopWin: {
    id: "laptopWin",
    text: "You flip open your laptop and aim the screen at the Pencil Enemy. The bright white light blinds it! It staggers backward, eraser-first, into a trash can. 💻✨ VICTORY!",
    img: "/new_game_assets/Laptop_PowerUp.png",
    choices: [
      { text: "▶  Walk confidently into the library", next: "bugEntrance" },
    ],
    effects: "power",
  },

  bugEntrance: {
    id: "bugEntrance",
    text: "Inside the library, silence. Rows of books stretch into the distance. You can almost feel the knowledge... until a Bug Enemy drops from the ceiling! 🐛 A nasty code bug with angry red eyes.",
    img: "/new_game_assets/Bug_Enemy.png",
    choices: [
      { text: "⚔  Smash it with a textbook!", next: "bugFight" },
      { text: "🧠  Outsmart it with logic", next: "brainWin" },
    ],
    effects: "mystery",
  },

  bugFight: {
    id: "bugFight",
    text: "You grab 'Introduction to Algorithms' (800 pages of pure pain) and bring it down on the bug. It squeaks and scatters! The bookshelf behind you glows warm gold. 🏆",
    img: "/new_game_assets/Bug_Enemy.png",
    choices: [
      { text: "▶  Investigate the glowing shelf", next: "victory" },
    ],
    effects: "hit",
  },

  brainWin: {
    id: "brainWin",
    text: "You stare into the Bug Enemy's eyes and recite your favorite algorithm backwards. Its tiny bug brain overheats! 💥 It explodes into confetti of ones and zeroes. +999 IQ!",
    img: "/new_game_assets/Brain_PowerUp.png",
    choices: [
      { text: "▶  Claim your study spot", next: "victory" },
    ],
    effects: "power",
  },

  victory: {
    id: "victory",
    text: "The glowing shelf reveals a quiet corner by the window — the perfect study spot. Sunlight spills across an empty desk. A notebook lies open with a single line:\n\n\"The journey of a thousand lines of code begins with a single 'Hello, World.'\"\n\n📖✨ You made it. Day 1: Complete. The semester awaits...",
    img: "/new_game_assets/Sanskriti_Idle.png",
    choices: [
      { text: "🎉  Finish (Play Again?)", next: "start", sound: "win" },
    ],
    effects: "win",
  },
};

// ── Component ──
interface SecretRpgProps {
  onClose: () => void;
}

export default function SecretRpg({ onClose }: SecretRpgProps) {
  const [sceneId, setSceneId] = useState("start");
  const [typedText, setTypedText] = useState("");
  const [textDone, setTextDone] = useState(false);
  const [show, setShow] = useState(true);
  const playRef = useRef<((n: string, v?: number) => void) | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize sounds
  useEffect(() => {
    playRef.current = preloadRpgSounds();
  }, []);

  const scene = STORY[sceneId] || STORY.start;

  // Typewriter effect
  useEffect(() => {
    setTextDone(false);
    setTypedText("");
    let idx = 0;
    const fullText = scene.text;
    typeTimerRef.current = setInterval(() => {
      idx++;
      setTypedText(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        if (typeTimerRef.current) clearInterval(typeTimerRef.current);
        setTextDone(true);
      }
    }, 18);
    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    };
  }, [sceneId, scene.text]);

  // Play scene effect sound
  useEffect(() => {
    if (scene.effects && playRef.current) {
      setTimeout(() => {
        if (playRef.current) playRef.current(scene.effects!, 0.25);
      }, 300);
    }
  }, [sceneId, scene.effects]);

  const handleChoice = useCallback((choice: Choice) => {
    if (playRef.current) {
      playRef.current(choice.sound || "select", 0.3);
    }
    if (choice.next === "start") {
      // Restart
      setSceneId("start");
    } else {
      setSceneId(choice.next);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1a1a2e] border-2 border-pink-500/30 rounded-xl overflow-hidden shadow-2xl shadow-pink-500/20 my-8">
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow-border {
          0%, 100% { border-color: rgba(236,72,153,0.2); }
          50% { border-color: rgba(236,72,153,0.5); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-b border-pink-500/20">
        <div className="flex items-center gap-2">
          <span className="text-pink-300 text-xs" style={{ fontFamily: '"Press Start 2P", monospace' }}>
            🎮 SECRET STORY
          </span>
        </div>
        <button
          onClick={() => { setShow(false); onClose(); }}
          className="text-white/40 hover:text-white/80 text-xs transition-colors"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          ✕ CLOSE
        </button>
      </div>

      {/* Game area */}
      <div className="p-4 md:p-6 min-h-[320px] flex flex-col gap-4">
        {/* Character image */}
        {scene.img && (
          <div className="flex justify-center mb-2" style={{ animation: "fade-in 0.4s ease-out" }}>
            <div className="relative">
              <img
                src={scene.img}
                alt=""
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
        )}

        {/* Story text */}
        <div className="flex-1">
          <div
            className="bg-black/40 border border-white/10 rounded-lg p-4 min-h-[100px]"
            style={{ animation: "fade-in 0.3s ease-out" }}
          >
            <p
              className="text-white/90 text-xs md:text-sm leading-relaxed whitespace-pre-line"
              style={{ fontFamily: '"Press Start 2P", monospace', lineHeight: "1.8" }}
            >
              {typedText}
              {!textDone && (
                <span style={{ animation: "blink-cursor 0.8s step-end infinite" }}>▌</span>
              )}
            </p>
          </div>
        </div>

        {/* Choices */}
        {textDone && (
          <div className="space-y-2" style={{ animation: "fade-in 0.3s ease-out" }}>
            {scene.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                className="w-full text-left px-4 py-2.5 bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-500/40 rounded-lg transition-all duration-200 active:scale-[0.98] group"
              >
                <span
                  className="text-white/70 group-hover:text-pink-200 text-[10px] md:text-xs"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {choice.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
