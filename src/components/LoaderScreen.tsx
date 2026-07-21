"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import CountUp from "./CountUp";

interface LoaderScreenProps {
  onFinish: () => void;
}

export default function LoaderScreen({ onFinish }: LoaderScreenProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [countDone, setCountDone] = useState(false);

  const handleCountEnd = () => {
    setCountDone(true);
  };

  useEffect(() => {
    if (!countDone || !loaderRef.current) return;

    gsap.to(loaderRef.current, {
      y: "-100%",
      duration: 0.9,
      ease: "power3.inOut",
      onComplete: onFinish,
    });
  }, [countDone, onFinish]);

  useEffect(() => {
    const el = loaderRef.current;
    return () => {
      if (el) gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#000000" }}
    >
      {/* ── Subtle pink glow in center ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(224,33,138,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── CountUp number ── */}
      <div
        className="relative z-10 font-display-alt text-white tabular-nums"
        style={{ fontSize: "clamp(5rem, 15vw, 12rem)" }}
      >
        <CountUp
          from={0}
          to={100}
          duration={2.5}
          startWhen={true}
          onEnd={handleCountEnd}
        />
      </div>
    </div>
  );
}
