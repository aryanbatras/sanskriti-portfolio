"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * VideoStory — Hero with text-mask zoom (no fade).
 *
 * Approach:
 *   White bg section. Video is masked by SVG text.
 *   Text = white (video shows through), everything else = transparent (white bg).
 *
 *   mask-size animates from 100% → 5000% so the text characters
 *   zoom in until individual letter strokes fill the viewport.
 *   You go INSIDE the letters, no fading anywhere.
 */
export default function VideoStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const overlayTlRef = useRef<gsap.core.Timeline | null>(null);

  const nameRef = useRef<HTMLDivElement>(null);

  // ── SVG text mask  ──────────────────────────────────────────
  //   rect fill="black"  → everything hidden (white bg shows)
  //   text  fill="white"  → video visible through text shapes
  const svgMaskUrl = useMemo(() => {
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">`,
      `<defs><mask id="t">`,
      `<rect width="100%" height="100%" fill="black" />`,
      `<text x="50%" y="52%" font-size="6vw" font-weight="400"`,
      `      text-anchor="middle" dominant-baseline="middle"`,
      `      font-family="'Fraunces',Georgia,serif"`,
      `      fill="white">Hi, I'm Sanskriti Gupta</text>`,
      `</mask></defs>`,
      `<rect width="100%" height="100%" fill="white" mask="url(#t)" />`,
      `</svg>`,
    ].join("");
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, []);

  useGSAP(
    () => {
      const video = videoRef.current;
      const maskEl = maskRef.current;
      if (!video || !maskEl) return;

      const dur = video.duration || 2.833;
      const MAX_ZOOM = 18000;
      const scrollDistance = 7500;

      // ── Phases (zoom takes full scroll — pin releases when zoom ends) ──
      const VIDEO_START = 0.30;
      const OVERLAY_START = 0.35;

      // ── Init mask ──────────────────────────────────────────
      maskEl.style.setProperty("-webkit-mask-image", svgMaskUrl);
      maskEl.style.setProperty("mask-image", svgMaskUrl);
      maskEl.style.setProperty("-webkit-mask-position", "center");
      maskEl.style.setProperty("mask-position", "center");
      maskEl.style.setProperty("-webkit-mask-repeat", "no-repeat");
      maskEl.style.setProperty("mask-repeat", "no-repeat");
      maskEl.style.setProperty("-webkit-mask-size", "100%");
      maskEl.style.setProperty("mask-size", "100%");

      // ── Init text overlay (hidden) ────────────────────────
      gsap.set(nameRef.current, { autoAlpha: 0, y: 20 });

      // ── Simple fade-in-up for the name ─────────────────────
      const overlayTl = gsap.timeline({ paused: true });
      overlayTl.to(nameRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
      overlayTlRef.current = overlayTl;

      // ── Exponential scale ease (manual — same curve as GSAP's expoScale(0.5, 7, "none")) ─
      //     value = start * (end/start)^progress
      const expoEase = (t: number) => 0.5 * Math.pow(7 / 0.5, t); // 0.5 → 7

      // ── ScrollTrigger ──────────────────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: scrollDistance,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          // ── Zoom: mask-size 100% → 18000% (takes full scroll) ─
          {
            const raw = expoEase(p);                 // 0.5 → 7
            const normalized = (raw - 0.5) / (7 - 0.5); // 0 → 1
            const scale = 100 + normalized * (MAX_ZOOM - 100);
            maskEl.style.setProperty("-webkit-mask-size", `${scale}%`);
            maskEl.style.setProperty("mask-size", `${scale}%`);
          }

          // ── Video: scroll-driven seeking ────────────────────
          if (p > VIDEO_START) {
            const videoP = (p - VIDEO_START) / (1 - VIDEO_START);
            if (video.readyState >= 2) {
              video.currentTime = Math.min(videoP * dur, dur);
            }
          } else {
            video.currentTime = 0;
          }

          // ── Text overlays (after zoom is complete) ──────────
          if (p > OVERLAY_START) {
            const overlayP = (p - OVERLAY_START) / (1 - OVERLAY_START);
            overlayTl.progress(overlayP);
          } else {
            overlayTl.progress(0);
          }


        },
      });

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="video"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-paper"
    >
      {/* ── Video masked by SVG text ───────────────────────────
          text shapes = video visible, everywhere else = white bg ── */}
      <div
        ref={maskRef}
        className="absolute inset-0 w-full h-full"
        style={{
          willChange: "mask-size, -webkit-mask-size",
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          preload="auto"
          muted
          playsInline
          src="/videos/video-story.mp4"
        />
        <span className="sr-only">Hi, I&apos;m Sanskriti Gupta</span>
      </div>

      {/* ── Text overlays (appear after zoom completes) ──────── */}
      <div
        ref={nameRef}
        className="absolute top-8 left-5 md:top-16 md:left-10 pointer-events-none max-w-4xl z-20"
      >
        <h1 className="text-[var(--color-ink)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display-alt leading-none tracking-tight">
          {personalInfo.name}
        </h1>
      </div>

    </section>
  );
}
