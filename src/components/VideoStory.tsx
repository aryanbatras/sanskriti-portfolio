"use client";

import { useRef, useMemo } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Pinterest-style pinned image for the hero collage */
function PinnedImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute overflow-hidden bg-paper ${className ?? ""}`}
      style={style}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      {/* Red pin — top-right */}
      <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 md:w-6 md:h-6">
        <Image
          src="/red_pin.png"
          alt=""
          width={24}
          height={24}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
}

/**
 * VideoStory — Hero with Pinterest collage masked by SVG text.
 *
 * Approach:
 *   White bg section. A scattered cluster of pinned photos is masked by SVG text.
 *   Text = white (collage visible through text shapes), everything else = white bg.
 *   mask-size animates from 100% → 22000% so the text characters
 *   zoom in until individual letter strokes fill the viewport.
 */
export default function VideoStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const overlayTlRef = useRef<gsap.core.Timeline | null>(null);
  const nameRef = useRef<HTMLDivElement>(null);

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
      const maskEl = maskRef.current;
      if (!maskEl) return;

      const MAX_ZOOM = 22000;
      const scrollDistance = 2000;
      const OVERLAY_START = 0.35;

      maskEl.style.setProperty("-webkit-mask-image", svgMaskUrl);
      maskEl.style.setProperty("mask-image", svgMaskUrl);
      maskEl.style.setProperty("-webkit-mask-position", "center");
      maskEl.style.setProperty("mask-position", "center");
      maskEl.style.setProperty("-webkit-mask-repeat", "no-repeat");
      maskEl.style.setProperty("mask-repeat", "no-repeat");
      maskEl.style.setProperty("-webkit-mask-size", "100%");
      maskEl.style.setProperty("mask-size", "100%");

      gsap.set(nameRef.current, { autoAlpha: 0, y: 20 });

      const overlayTl = gsap.timeline({ paused: true });
      overlayTl.to(nameRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
      overlayTlRef.current = overlayTl;

      const expoEase = (t: number) => 0.5 * Math.pow(7 / 0.5, t);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: scrollDistance,
        pin: true,
        pinSpacing: true,
        scrub: 3.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          {
            const raw = expoEase(p);
            const normalized = (raw - 0.5) / (7 - 0.5);
            const scale = 100 + normalized * (MAX_ZOOM - 100);
            maskEl.style.setProperty("-webkit-mask-size", `${scale}%`);
            maskEl.style.setProperty("mask-size", `${scale}%`);
          }

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
      className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: "#FFF1F2" }}
    >
      {/* ── Pinterest collage masked by SVG text ──────────────── */}
      <div
        ref={maskRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: "mask-size, -webkit-mask-size" }}
      >
        {/* Collage — 8 images in a calculated 3-column grid, minimal overlap, minimal gaps */}
        {/*
          Image dimensions (px):
          home-45:  1202×1600 (0.75:1)   skills:    900×1600 (0.56:1)
          home-2:   1202×1600 (0.75:1)   contact:  1202×1600 (0.75:1)
          projects: 1600×900  (1.78:1)   home-3:   1202×1600 (0.75:1)
          skills-2: 1202×1600 (0.75:1)   contact-2:1600×1200 (1.33:1)

          Layout: 3 columns × 3 rows
          Col widths: 34vw, 33vw, 33vw
          Row heights: 34vh, 33vh, 33vh
          Each image scaled to fill its cell, slight overlap at edges.
        */}
        <div className="absolute inset-0">
          {/* Col 1 (left) — 3 portrait images stacked */}
          <PinnedImage
            src="/images/img-contact.jpeg"
            alt="Sanskriti — contact"
            className="w-[30vw] h-[22vh] md:w-[24vw] md:h-[45vh]"
            style={{ top: "33vh", left: "7vw", transform: "rotate(1.5deg)" }}
          />

          {/* Col 2 (center) — 3 portrait images stacked */}
          <PinnedImage
            src="/images/img-home-2.jpeg"
            alt="Sanskriti — home"
            className="w-[34vw] h-[36vh] md:w-[33vw] md:h-[35vh]"
            style={{ top: "33vh", left: "33vw", transform: "rotate(-1.5deg)" }}
          />

          {/* Col 3 (right) — 2 landscape images + 1 portrait */}
          <PinnedImage
            src="/images/img-projects.jpeg"
            alt="Sanskriti — projects"
            className="w-[35vw] h-[36vh] md:w-[34vw] md:h-[35vh]"
            style={{ top: 0, right: 0, transform: "rotate(-1.5deg)" }}
          />
          <PinnedImage
            src="/images/img-contact-2.jpeg"
            alt="Sanskriti — contact"
            className="w-[35vw] h-[56vh] md:w-[34vw] md:h-[75vh]"
            style={{ top: "43vh", right: 0, transform: "rotate(2deg)" }}
          />
        </div>
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
