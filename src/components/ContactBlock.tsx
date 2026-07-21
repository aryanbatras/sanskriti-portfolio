"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";
import SecretRpg from "./secret-rpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Triple Treat SFX sound system ────────────────────────────────────
const SFX = "/Triple Treat SFX";
function useSoundEffects() {
  const cacheRef = useRef<Record<string, HTMLAudioElement>>({});

  const play = useCallback((name: string, volume = 0.3) => {
    const a = cacheRef.current[name];
    if (a) {
      a.currentTime = 0;
      a.volume = volume;
      a.play().catch(() => {});
    }
  }, []);

  // Preload sounds on first interaction
  const preload = useCallback(() => {
    if (Object.keys(cacheRef.current).length > 0) return;
    const sounds: Record<string, string> = {
      hover:  `${SFX}/Percussion SFX/Pluck FX-RCM.wav`,
      click:  `${SFX}/Success:Power-Up SFX/Power Up FX 2-RCM.wav`,
      pop:    `${SFX}/Pop:Bubble SFX/Pop FX 1-RCM.wav`,
      sparkle:`${SFX}/Transition SFX/Slide Up FX-RCM.wav`,
      secret: `${SFX}/Mysterious SFX/Mysterious FX 1-RCM.wav`,
    };
    for (const [key, src] of Object.entries(sounds)) {
      const a = new Audio();
      a.src = src;
      a.preload = "auto";
      cacheRef.current[key] = a;
    }
  }, []);

  return { play, preload };
}

export default function ContactBlock() {
  const containerRef = useRef<HTMLElement>(null);
  const { play, preload } = useSoundEffects();
  const [showRpg, setShowRpg] = useState(false);
  const secretSectionRef = useRef<HTMLDivElement | null>(null);

  // Auto-play sparkle on first scroll reveal
  useEffect(() => {
    const el = secretSectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setTimeout(() => { play("sparkle", 0.2); }, 600);
          obs.disconnect();
          break;
        }
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [play]);

  const handleStartGame = useCallback(() => {
    preload();
    play("click", 0.4);
    setShowRpg(true);
  }, [play, preload]);

  const handleCloseRpg = useCallback(() => {
    setShowRpg(false);
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".contact-reveal",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section id="contact" ref={containerRef} className="editorial-section bg-paper">
      <div className="max-w-6xl mx-auto">
        <div className="relative inline-block mb-6">
          <h2
            className="section-heading"
            style={{ transform: "rotate(-0.2deg)" }}
          >
            Get in touch
          </h2>
          <div className="absolute -top-2 -right-4 w-5 h-5 md:w-6 md:h-6 opacity-60">
            <Image
              src="/red_pin.png"
              alt=""
              width={24}
              height={24}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
        <p className="contact-reveal body-text text-charcoal mb-12 max-w-lg">
          Whether it&rsquo;s a research collaboration, a writing project, or
          just a conversation about something curious — I&rsquo;d love to hear
          from you.
        </p>

        <div className="flex flex-col md:flex-row md:gap-12 md:items-start">
          {/* Left: Contact details */}
          <div className="flex-1 space-y-10">
            {/* Email */}
            <div className="contact-reveal">
              <p className="mono-text text-pink mb-2 text-[11px] tracking-[0.15em]">
                Email
              </p>
              <p className="body-text text-xl md:text-2xl">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-ink hover:text-pink-dark transition-colors duration-300"
                >
                  {personalInfo.email}
                </a>
              </p>
            </div>

            {/* Socials */}
            <div className="contact-reveal">
              <p className="mono-text text-pink mb-4 text-[11px] tracking-[0.15em]">
                Elsewhere
              </p>
              <div className="flex flex-wrap gap-4">
                {Object.entries(personalInfo.socials).map(([key, url]) => {
                  if (!url) return null;
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 px-5 py-3 bg-pink-light hover:bg-pink transition-all duration-300"
                    >
                      <span className="mono-text text-sm text-ink group-hover:text-white transition-colors duration-300">
                        {label}
                      </span>
                      <span className="text-pink group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5">
                        &rarr;
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div className="contact-reveal pt-4">
              <div className="flex items-center gap-2 text-charcoal text-sm font-mono tracking-wide">
                <span>&mdash;</span>
                <span>{personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Portrait with red pin — top-right, pinned hover */}
          <div className="contact-reveal shrink-0 mt-10 md:mt-0 flex justify-center items-start">
            <div className="relative w-48 md:w-56 h-auto overflow-hidden bg-pink-light pinned-item pinned-tr">
              <Image
                src="/images/Woman_waving_hi_holding_coffee_202607201927.jpeg"
                alt="Sanskriti Gupta — say hi!"
                width={768}
                height={1376}
                className="object-cover w-full h-auto"
                sizes="(max-width: 768px) 192px, 224px"
                loading="lazy"
              />
              <div className="absolute top-1 right-1 z-10 w-6 h-6 md:w-7 md:h-7">
                <Image
                  src="/red_pin.png"
                  alt=""
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECRET SECTION: Pinned Image + Press Start ═══ */}
        <div ref={secretSectionRef} className="contact-reveal mt-16">
          {!showRpg ? (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 justify-center">
              {/* LEFT: Always wondering pinned image */}
              <div className="relative w-40 md:w-48 h-auto overflow-hidden pinned-item pinned-tr shrink-0">
                <Image
                  src="/images/wondering-sitting-on-coach.jpeg"
                  alt="Always wondering"
                  width={768}
                  height={1376}
                  className="object-cover w-full h-auto"
                  sizes="160px"
                  loading="lazy"
                />
                <div className="absolute top-1 right-1 z-10 w-6 h-6 md:w-7 md:h-7">
                  <Image
                    src="/red_pin.png"
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>

              {/* RIGHT: "You found a secret!" + Press Start button */}
              <div className="flex flex-col items-center md:items-start justify-center gap-4 py-4">
                <style>{`
                  @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 15px rgba(236,72,153,0.3); }
                    50% { box-shadow: 0 0 30px rgba(236,72,153,0.6), 0 0 60px rgba(168,85,247,0.2); }
                  }
                  @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                  }
                `}</style>

                <p
                  className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-pink-200 text-xs md:text-sm leading-relaxed text-center md:text-left"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  🎯 You found<br />a secret!
                </p>

                <button
                  onClick={handleStartGame}
                  onMouseEnter={() => { preload(); play("hover", 0.2); }}
                  className="relative group cursor-pointer"
                  style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
                >
                  {/* 3D pixel bevel */}
                  <div className="absolute inset-0 bg-gradient-to-b from-pink-700 to-purple-900 rounded-lg translate-y-[4px]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-200" />
                  {/* Button inner face */}
                  <div className="relative px-8 py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg overflow-hidden active:translate-y-[2px] active:transition-all duration-75"
                    style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                    <span
                      className="text-white text-[10px] md:text-xs tracking-widest relative z-10"
                      style={{ fontFamily: '"Press Start 2P", monospace', textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                    >
                      ▶  PRESS START
                    </span>
                  </div>
                </button>

                <p
                  className="text-white/20 text-[8px]"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  <span style={{ animation: "blink 1s step-end infinite" }}>▌</span> ENTER the story
                </p>
              </div>
            </div>
          ) : (
            /* RPG Story Game */
            <SecretRpg onClose={handleCloseRpg} />
          )}
        </div>
      </div>
    </section>
  );
}
