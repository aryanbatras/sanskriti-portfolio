"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function splitChars(text: string) {
  return text.split("").map((char, i) => (
    <span
      key={i}
      className="char"
      style={{ display: "inline-block" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export default function VideoStory() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayTlRef = useRef<gsap.core.Timeline | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  const nameChars = useMemo(() => splitChars(personalInfo.name), []);
  const taglineChars = useMemo(
    () => splitChars("Research intern at IIT Jammu"),
    [],
  );

  useGSAP(
    () => {
      const video = videoRef.current;
      if (!video) return;

      const dur = video.duration || 2.833;
      const scrollDistance = dur * 1500;

      // Phase timings (fractions of total duration)
      const TAGS_AT = 0.6 / dur; // tagline appears ~0.6s in

      gsap.set(nameRef.current, { autoAlpha: 1 });
      gsap.set(taglineRef.current, { autoAlpha: 0 });

      gsap.set(nameRef.current?.querySelectorAll(".char") ?? [], {
        opacity: 0,
        y: 20,
      });
      gsap.set(taglineRef.current?.querySelectorAll(".char") ?? [], {
        opacity: 0,
        y: 12,
      });

      const overlayTl = gsap.timeline({ paused: true });

      // Phase 1 — Name fades in (0s → 0.6s)
      overlayTl
        .to(nameRef.current?.querySelectorAll(".char") ?? [], {
          opacity: 1,
          y: 0,
          duration: 0.05,
          stagger: 0.006,
          ease: "power2.out",
          overwrite: "auto",
        }, 0)
        // Phase 2 — Tagline appears after name is settled
        .to(taglineRef.current, {
          autoAlpha: 1,
          duration: 0.08,
          ease: "power2.out",
        }, TAGS_AT)
        .to(taglineRef.current?.querySelectorAll(".char") ?? [], {
          opacity: 1,
          y: 0,
          duration: 0.03,
          stagger: 0.004,
          ease: "power1.out",
          overwrite: "auto",
        }, TAGS_AT + 0.02);

      overlayTlRef.current = overlayTl;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => scrollDistance,
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (video.readyState >= 2) {
            video.currentTime = p * dur;
          }
          overlayTl.progress(p);
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${p})`;
          }
        },
      });

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    },
    { scope: containerRef },
  );

  return (
    <section
      id="video"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Video — fullscreen, no controls */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        preload="auto"
        muted
        playsInline
        src="/videos/video-story.mp4"
      />

      {/* Soft gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />

      {/* Phase 1 — Name (top-left, gentle entrance) */}
      <div
        ref={nameRef}
        className="absolute top-8 left-5 md:top-16 md:left-10 pointer-events-none max-w-4xl"
      >
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display leading-none tracking-tight">
          {nameChars}
        </h1>
      </div>

      {/* Phase 2 — Tagline (bottom-right, appears after name) */}
      <div
        ref={taglineRef}
        className="absolute bottom-8 right-5 md:bottom-16 md:right-10 max-w-md text-right pointer-events-none"
      >
        <p className="text-white/80 text-sm md:text-base lg:text-lg font-light tracking-wider uppercase">
          {taglineChars}
        </p>
      </div>

      {/* Progress bar — thin pink line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20 pointer-events-none">
        <div
          ref={progressRef}
          className="h-full w-full origin-left"
          style={{ backgroundColor: "#E0218A", transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
