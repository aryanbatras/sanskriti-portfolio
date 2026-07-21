"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Choice, FALLBACK_MAP } from "./types";
import { STORY } from "./story";
import { MINI_GAMES, runMiniGame } from "./minigames";
import { preloadRpgSounds } from "./sounds";


// ═════════════════════════════════════════════════════════════════════
//  PROPS
// ═════════════════════════════════════════════════════════════════════

interface SecretRpgProps {
  onClose: () => void;
}

// ═════════════════════════════════════════════════════════════════════
//  COMPONENT
// ═════════════════════════════════════════════════════════════════════

export default function SecretRpg({ onClose }: SecretRpgProps) {
  const [sceneId, setSceneId] = useState("start");
  const [typedText, setTypedText] = useState("");
  const [textDone, setTextDone] = useState(false);
  const [show, setShow] = useState(true);
  const [inMinigame, setInMinigame] = useState(false);
  const [minigameWon, setMinigameWon] = useState<Record<string, boolean>>({});
  const [playerItems, setPlayerItems] = useState<string[]>([]);
  const playRef = useRef<((n: string, v?: number) => void) | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize sounds once
  useEffect(() => {
    playRef.current = preloadRpgSounds();
  }, []);

  const playSfx = (name: string, vol = 0.3) => {
    if (playRef.current) playRef.current(name, vol);
  };

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

  // Auto-trigger mini-game when entering a game scene directly
  useEffect(() => {
    if (MINI_GAMES[sceneId] && !minigameWon[sceneId] && !inMinigame) {
      const config = MINI_GAMES[sceneId];
      setInMinigame(true);
      (async () => {
        const result = await runMiniGame(config, playerItems);
        setPlayerItems(result.items || playerItems);
        if (result.won) {
          setMinigameWon((prev) => ({ ...prev, [sceneId]: true }));
          playSfx("win", 0.4);
          if (config.grantItem) {
            setPlayerItems((prev) => [...prev, config.grantItem!]);
          }
        }
        setInMinigame(false);
      })();
    }
  }, [sceneId, playerItems, minigameWon, inMinigame]);

  const handleChoice = useCallback(
    async (choice: Choice) => {
      if (playRef.current) playRef.current(choice.sound || "select", 0.3);

      if (choice.next === "start") {
        setMinigameWon({});
        setPlayerItems([]);
        setSceneId("start");
        return;
      }

      const nextConfig = MINI_GAMES[choice.next];
      if (nextConfig) {
        // CRITICAL: Set inMinigame BEFORE running the mini-game so the story
        // keyboard shortcut handler (1/2/3 = choices) gets deactivated.
        // Otherwise pressing "1" to throw an item also triggers handleChoice!
        setInMinigame(true);
        await new Promise((r) => setTimeout(r, 0)); // Yield to React
        const result = await runMiniGame(nextConfig, playerItems);
        setPlayerItems(result.items || playerItems);
        if (result.won) {
          setMinigameWon((prev) => ({ ...prev, [choice.next]: true }));
          playSfx("win", 0.4);
          if (nextConfig.grantItem) {
            setPlayerItems((prev) => [...prev, nextConfig.grantItem!]);
          }
        } else {
          playSfx("fail", 0.4);
          setSceneId(FALLBACK_MAP[choice.next] || "start");
          setInMinigame(false);
          return;
        }
        setInMinigame(false);
      }
      setSceneId(choice.next);
    },
    [playerItems],
  );

  // Keyboard shortcuts for choices: 1, 2, 3
  useEffect(() => {
    if (inMinigame || !textDone) return;
    if (scene.choices.length === 0) return;

    const handler = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= scene.choices.length) {
        e.preventDefault();
        handleChoice(scene.choices[num - 1]);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [inMinigame, textDone, scene, handleChoice]);

  if (!show) return null;

  const mg = MINI_GAMES[sceneId];
  const minigameLabel =
    mg?.type === "coffeeCatch" ? "☕ COFFEE CATCH! ☕" :
    mg?.type === "codeType"    ? "💻 CODE TYPE! 💻" :
    mg?.type === "logicPuzzle" ? "🧠 LOGIC PUZZLE! 🧠" :
    mg?.type === "streetFight" ? "⚔️ STREET FIGHT! ⚔️" :
    mg?.type === "quoteType"  ? "💪 QUOTE TYPE! 💪" : null;

  // ── Difficulty indicator ──
  const diffStars = mg?.difficulty
    ? mg.difficulty === 1
      ? { stars: "★☆☆", label: "Easy", color: "#4ade80" }     // green
      : mg.difficulty === 2
        ? { stars: "★★☆", label: "Medium", color: "#facc15" }  // yellow
        : { stars: "💀💀💀", label: "Hard", color: "#ef4444" }  // red skulls
    : null;

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
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-b border-pink-500/20">
        <div className="flex items-center gap-2">
          <span
            className="text-pink-300 text-xs"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            🎮 SECRET STORY
          </span>
          {playerItems.length > 0 && (
            <span
              className="text-[8px] text-yellow-300/60"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {playerItems
                .map((it) =>
                  it === "coffee" ? "☕" :
                  it === "phone"  ? "📱" :
                  it === "laptop" ? "💻" : "🧠",
                )
                .join(" ")}
            </span>
          )}
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
        {/* Mini-game indicator */}
        {inMinigame && minigameLabel && (
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="animate-pulse text-pink-300 text-sm"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {minigameLabel}
            </div>

            {/* Difficulty indicator */}
            {diffStars && (
              <div className="flex items-center gap-1.5 mt-3">
                <span
                  className="text-[10px]"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  DIFFICULTY:
                </span>
                <span
                  className="text-sm tracking-wider"
                  style={{
                    color: diffStars.color,
                    textShadow: `0 0 8px ${diffStars.color}40`,
                    fontFamily: '"Press Start 2P", monospace',
                  }}
                >
                  {diffStars.stars}
                </span>
                <span
                  className="text-[9px]"
                  style={{ color: diffStars.color, fontFamily: '"Press Start 2P", monospace' }}
                >
                  {diffStars.label}
                </span>
              </div>
            )}

            <p
              className="text-white/30 text-[8px] mt-3"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {mg?.type === "coffeeCatch" ? "← → CATCH ☕  DODGE ✏️" :
               mg?.type === "codeType"    ? "TYPE THE WORD + ENTER" :
               mg?.type === "logicPuzzle" ? "PRESS 1 · 2 · 3" :
               "←→↑↓ MOVE · 1-3 THROW"}
            </p>
          </div>
        )}

        {/* Character image */}
        {!inMinigame && scene.img && (
          <div
            className="flex justify-center mb-2"
            style={{ animation: "fade-in 0.4s ease-out" }}
          >
            <img
              src={scene.img}
              alt=""
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        )}

        {/* Story text */}
        {!inMinigame && (
          <div className="flex-1">
            <div
              className="bg-black/40 border border-white/10 rounded-lg p-4 min-h-[100px]"
              style={{ animation: "fade-in 0.3s ease-out" }}
            >
              <p
                className="text-white/90 text-xs md:text-sm leading-relaxed whitespace-pre-line"
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  lineHeight: "1.8",
                }}
              >
                {typedText}
                {!textDone && (
                  <span
                    style={{
                      animation: "blink-cursor 0.8s step-end infinite",
                    }}
                  >
                    ▌
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Choices */}
        {!inMinigame && textDone && (
          <div
            className="space-y-2"
            style={{ animation: "fade-in 0.3s ease-out" }}
          >
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
                  <span className="text-pink-400/50 mr-1.5 text-[8px]">{i + 1}:</span>
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
