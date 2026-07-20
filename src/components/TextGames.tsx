"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const mlTrivia = [
  {
    question: "In what year was the term 'artificial intelligence' coined?",
    options: ["1945", "1956", "1963", "1972"],
    answer: 1,
  },
  {
    question: "Which architecture was introduced in 'Attention is All You Need'?",
    options: ["LSTM", "Transformer", "ResNet", "GAN"],
    answer: 1,
  },
  {
    question: "What does NLP stand for in AI research?",
    options: [
      "Natural Language Processing",
      "Neural Logic Programming",
      "Non-Linear Prediction",
      "Network Layer Protocol",
    ],
    answer: 0,
  },
  {
    question: "Whisper is an automatic speech recognition system by which company?",
    options: ["Google", "Meta", "OpenAI", "DeepMind"],
    answer: 2,
  },
  {
    question: "What evaluation metric was used for the speech intelligibility framework?",
    options: ["Accuracy", "RMSE", "F1 Score", "BLEU"],
    answer: 1,
  },
];

const typingPhrases = [
  "The curious mind finds questions everywhere it looks.",
  "Speech intelligibility prediction using self-supervised models.",
  "Every line of code tells a story of choices made.",
  "Deep learning is pattern recognition at an extraordinary scale.",
  "Poetry and algorithms both require precise arrangement.",
];

const letterPool = ["A", "C", "E", "H", "K", "L", "N", "R", "S", "T"];

export default function TextGames() {
  const containerRef = useRef<HTMLElement>(null);
  const memTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [qScore, setQScore] = useState(0);
  const [qFinished, setQFinished] = useState(false);

  const [memCards, setMemCards] = useState<string[]>([]);
  const [memFlipped, setMemFlipped] = useState<number[]>([]);
  const [memMatched, setMemMatched] = useState<Set<number>>(new Set());
  const [memMoves, setMemMoves] = useState(0);
  const [memStarted, setMemStarted] = useState(false);

  const [typingIndex, setTypingIndex] = useState(0);
  const [typingInput, setTypingInput] = useState("");
  const [typingResult, setTypingResult] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setTypingIndex(Math.floor(Math.random() * typingPhrases.length));
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".game-reveal",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      return () => {
        if (memTimerRef.current) clearTimeout(memTimerRef.current);
      };
    },
    { scope: containerRef }
  );

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === mlTrivia[qIndex].answer) setQScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (qIndex < mlTrivia.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
    } else setQFinished(true);
  };

  const initMemory = () => {
    const doubled = [...letterPool, ...letterPool];
    const shuffled = doubled.sort(() => Math.random() - 0.5);
    setMemCards(shuffled);
    setMemFlipped([]);
    setMemMatched(new Set());
    setMemMoves(0);
    setMemStarted(true);
  };

  const flipMemCard = (index: number) => {
    if (memFlipped.length === 2 || memMatched.has(index) || memFlipped.includes(index))
      return;
    const newFlipped = [...memFlipped, index];
    setMemFlipped(newFlipped);
    setMemMoves((m) => m + 1);
    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (memCards[a] === memCards[b]) {
        setMemMatched((prev) => { const next = new Set(prev); next.add(a); next.add(b); return next; });
        setMemFlipped([]);
      } else {
        if (memTimerRef.current) clearTimeout(memTimerRef.current);
        memTimerRef.current = setTimeout(() => { setMemFlipped([]); memTimerRef.current = null; }, 700);
      }
    }
  };

  const memWon = memStarted && memMatched.size === memCards.length && memCards.length > 0;

  const checkTyping = () => {
    if (typingInput.trim().toLowerCase() === typingPhrases[typingIndex].toLowerCase()) {
      setTypingResult("Correct. Another one.");
      setTypingInput("");
      setTypingIndex(Math.floor(Math.random() * typingPhrases.length));
    } else setTypingResult("Not quite. Try again.");
  };

  return (
    <section id="games" ref={containerRef} className="editorial-section relative overflow-hidden">
      {/* Warm gradient background */}
      {personalInfo.images?.gamesBg && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src={personalInfo.images.gamesBg}
            alt=""
            fill
            className="object-cover opacity-[0.04]"
            sizes="100vw"
          />
        </div>
      )}

      <div className="relative z-10 max-w-4xl">
        <h2 className="section-heading mb-3">Games</h2>
        <p className="body-text text-charcoal mb-12 max-w-prose">A break from the serious. Three small games.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="game-reveal">
            <h3 className="game-title">ML Trivia</h3>
            {!qFinished ? (
              <>
                <p className="body-text text-sm mb-4 leading-relaxed">{mlTrivia[qIndex].question}</p>
                <div className="space-y-2 mb-4">
                  {mlTrivia[qIndex].options.map((opt, i) => {
                    let className = "game-card";
                    if (selected !== null) {
                      if (i === mlTrivia[qIndex].answer) className += " matched";
                      else if (i === selected) className += " bg-pink-light";
                    }
                    return <button key={i} onClick={() => handleAnswer(i)} className={className} disabled={selected !== null}>{opt}</button>;
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <span className="mono-text text-xs text-charcoal">{qIndex + 1} / {mlTrivia.length}</span>
                  {selected !== null && <button onClick={nextQuestion} className="game-btn text-xs">Next</button>}
                </div>
              </>
            ) : (
              <div>
                <p className="section-heading text-3xl mb-2">{qScore} / {mlTrivia.length}</p>
                <p className="body-text text-sm mb-4">{qScore === mlTrivia.length ? "A perfect score." : qScore >= 3 ? "A solid showing." : "Room for improvement."}</p>
                <button onClick={() => { setQIndex(0); setSelected(null); setQScore(0); setQFinished(false); }} className="game-btn text-xs">Play Again</button>
              </div>
            )}
          </div>

          <div className="game-reveal">
            <h3 className="game-title">Letter Memory</h3>
            <p className="body-text text-sm mb-3">{memStarted ? `Moves: ${memMoves}` : "Match the pairs."}{memWon && ` All matched in ${memMoves} moves.`}</p>
            {!memStarted ? (
              <button onClick={initMemory} className="game-btn text-xs">Start Game</button>
            ) : (
              <div>
                <div className="grid grid-cols-4 gap-1 mb-3">
                  {memCards.map((card, i) => {
                    const isFlipped = memFlipped.includes(i) || memMatched.has(i);
                    return (
                      <button key={i} onClick={() => flipMemCard(i)}
                        className={`game-card text-sm p-2 aspect-square flex items-center justify-center ${isFlipped ? "flipped" : ""} ${memMatched.has(i) ? "matched" : ""}`}
                        disabled={memMatched.has(i)}>
                        {isFlipped ? card : "?"}
                      </button>
                    );
                  })}
                </div>
                {(memWon || !memStarted) && <button onClick={initMemory} className="game-btn text-xs">{memWon ? "Play Again" : "Restart"}</button>}
              </div>
            )}
          </div>

          <div className="game-reveal md:col-span-2">
            <h3 className="game-title">Type It Out</h3>
            <p className="body-text text-lg italic mb-4 leading-relaxed max-w-prose">{mounted ? typingPhrases[typingIndex] : typingPhrases[0]}</p>
            <div className="flex gap-2">
              <input type="text" value={typingInput} onChange={(e) => setTypingInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkTyping()} className="game-input flex-1" placeholder="Type the phrase exactly" />
              <button onClick={checkTyping} className="game-btn text-xs">Check</button>
            </div>
            {typingResult && <p className="body-text text-sm mt-3">{typingResult}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
