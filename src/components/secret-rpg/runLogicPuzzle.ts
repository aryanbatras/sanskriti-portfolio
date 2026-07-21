import { FIGHT_W, FIGHT_H, MiniGameConfig, MiniGameResult } from "./types";

// ─── Questions ──────────────────────────────────────────────────────

interface Question {
  q: string;
  choices: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    q: "What does 'ML' stand for in AI?",
    choices: ["Machine Learning", "Memory Load", "Markup Language"],
    correct: 0,
  },
  {
    q: "Which of these is a programming language?",
    choices: ["HTML", "Python", "Markdown"],
    correct: 1,
  },
  {
    q: "What is a 'neural network' inspired by?",
    choices: ["The internet", "The human brain", "Phone networks"],
    correct: 1,
  },
  {
    q: "What does 'UI' stand for?",
    choices: ["Unified Input", "User Interface", "Universal Icon"],
    correct: 1,
  },
  {
    q: "What is 'debugging'?",
    choices: ["Adding new features", "Fixing errors in code", "Writing documentation"],
    correct: 1,
  },
  {
    q: "What does 'API' stand for?",
    choices: ["Application Programming Interface", "Automatic Program Input", "Advanced Protocol Integration"],
    correct: 0,
  },
  {
    q: "Which language is commonly used for AI/ML?",
    choices: ["Java", "Python", "JavaScript"],
    correct: 1,
  },
];

// ─── Logic Puzzle Mini-Game ─────────────────────────────────────────
// Answer 3 random questions by pressing 1, 2, or 3. 2/3 correct = win.

export function runLogicPuzzle(
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

    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    const state = {
      questionIndex: 0,
      correct: 0,
      answered: false,
      selectedAnswer: -1 as number,
      result: "none" as "win" | "lose" | "none",
    };

    let animId = 0;

    const selectAnswer = (num: number) => {
      if (state.result !== "none" || state.answered) return;
      if (num < 1 || num > 3) return;
      const q = selected[state.questionIndex];
      state.answered = true;
      state.selectedAnswer = num - 1;
      if (num - 1 === q.correct) state.correct++;

      setTimeout(() => {
        if (state.questionIndex >= 2) {
          state.result = state.correct >= 2 ? "win" : "lose";
        } else {
          state.questionIndex++;
          state.answered = false;
          state.selectedAnswer = -1;
        }
      }, 1500);
    };

    const kd = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 3) {
        selectAnswer(num);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", kd);

    // ── Mouse click support ──
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);
      // Scale to game coordinates
      const sx = canvas.width / FIGHT_W;
      const sy = canvas.height / FIGHT_H;
      const gx = mx / sx;
      const gy = my / sy;

      if (state.questionIndex < selected.length) {
        const q = selected[state.questionIndex];
        for (let i = 0; i < q.choices.length; i++) {
          const y = 220 + i * 50;
          // Choice rect: (80, y-14) to (FIGHT_W-80, y+22)
          if (
            gx >= 80 && gx <= FIGHT_W - 80 &&
            gy >= y - 14 && gy <= y + 22
          ) {
            selectAnswer(i + 1);
            break;
          }
        }
      }
    };
    canvas.addEventListener("click", onClick);

    const loop = () => {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      const sx = W / FIGHT_W;
      const sy = H / FIGHT_H;

      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.scale(sx, sy);

      // Brain glow
      ctx.shadowColor = "rgba(236,72,153,0.15)";
      ctx.shadowBlur = 30;
      ctx.font = "64px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🧠", FIGHT_W / 2, 100);
      ctx.shadowBlur = 0;

      // Progress
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.textAlign = "left";
      ctx.fillText(
        `Q${state.questionIndex + 1}/3 · ${state.correct} correct`,
        40, 140,
      );

      // Question
      if (state.questionIndex < selected.length) {
        const q = selected[state.questionIndex];
        ctx.fillStyle = "#e2e8f0";
        ctx.font = 'bold 13px "Press Start 2P", monospace';
        ctx.textAlign = "center";
        ctx.fillText(q.q, FIGHT_W / 2, 185);

        for (let i = 0; i < q.choices.length; i++) {
          const y = 220 + i * 50;
          const isCorrect = state.answered && i === q.correct;
          const isSelected = state.answered && i === state.selectedAnswer;

          let bg = "rgba(255,255,255,0.05)";
          let textColor = "rgba(255,255,255,0.7)";
          let borderColor = "rgba(255,255,255,0.1)";

          if (state.answered) {
            if (isCorrect) {
              bg = "rgba(74,222,128,0.2)";
              textColor = "#4ade80";
              borderColor = "#4ade80";
            } else if (isSelected && !isCorrect) {
              bg = "rgba(239,68,68,0.2)";
              textColor = "#ef4444";
              borderColor = "#ef4444";
            }
          }

          ctx.fillStyle = bg;
          ctx.fillRect(80, y - 14, FIGHT_W - 160, 36);
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(80, y - 14, FIGHT_W - 160, 36);

          ctx.fillStyle = textColor;
          ctx.font = '10px "Press Start 2P", monospace';
          ctx.textAlign = "left";
          ctx.fillText(`${i + 1}: ${q.choices[i]}`, 100, y + 5);
        }
      }

      // Controls hint — DESKTOP ONLY
      const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
      if (!isMobile) {
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = "right";
        ctx.fillText("PRESS 1 · 2 · 3 · OR CLICK", FIGHT_W - 10, 22);
      }

      ctx.restore();

      // Result overlay (full-screen)
      if (state.result === "win") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fbbf24";
        ctx.font = `bold ${Math.min(20 * sx, 20 * sy)}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("🧠 BRILLIANT! 🧠", W / 2, H / 2 - 10 * sy);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${Math.min(10 * sx, 10 * sy)}px "Press Start 2P", monospace`;
        ctx.fillText("IQ +999! Bug defeated!", W / 2, H / 2 + 25 * sy);
      }
      if (state.result === "lose") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ef4444";
        ctx.font = `bold ${Math.min(18 * sx, 18 * sy)}px "Press Start 2P", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("🤔 NOT QUITE", W / 2, H / 2 - 10 * sy);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${Math.min(9 * sx, 9 * sy)}px "Press Start 2P", monospace`;
        ctx.fillText("Need 2/3 correct! Try again!", W / 2, H / 2 + 25 * sy);
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
          canvas.removeEventListener("click", onClick);
          document.body.removeChild(overlay);
          resolve({ won: state.result === "win" });
        }, 1800);
      }
    }, 200);
  });
}
