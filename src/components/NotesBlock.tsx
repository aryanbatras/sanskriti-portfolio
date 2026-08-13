"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function NotesBlock() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".notes-reveal",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section id="notes" ref={containerRef} className="editorial-section bg-paper">
      <div className="max-w-6xl mx-auto">
        <div className="relative inline-block mb-14">
          <h2
            className="section-heading"
            style={{ transform: "rotate(0.2deg)" }}
          >
            Skills <span className="text-pink">&amp;</span> Recognition
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

        <div className="flex flex-col md:flex-row md:gap-12">
          {/* Left side: Skills + Certifications + Achievements */}
          <div className="flex-1">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              {/* Skills */}
              <div>
                {personalInfo.skills.map((group, i) => (
                  <div key={i} className="notes-reveal mb-10 last:mb-0">
                    <h3 className="mono-text text-pink mb-4 tracking-wider">
                      {group.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item, j) => (
                        <span
                          key={j}
                          className="inline-block text-xs px-3 py-1.5 bg-pink-light text-charcoal font-mono tracking-wide transition-all duration-200 hover:text-pink-dark"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Certs + Achievements */}
              <div>
                <div className="notes-reveal mb-10">
                  <h3 className="mono-text text-pink mb-4 tracking-wider">
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {personalInfo.certifications.map((cert, i) => (
                      <div
                        key={i}
                        className="p-4 bg-paper"
                      >
                        <p className="entry-desc text-sm leading-relaxed">
                          {cert}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="notes-reveal">
                  <h3 className="mono-text text-pink mb-4 tracking-wider">
                    Achievements
                  </h3>
                  <div className="space-y-2">
                    {personalInfo.achievements.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 hover:bg-pink-light transition-colors duration-200"
                      >
                        <span className="text-pink mt-0.5 shrink-0 text-sm">
                          &rarr;
                        </span>
                        <p className="entry-desc text-sm leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills image */}
          <div className="notes-reveal shrink-0 mt-10 md:mt-0 flex justify-center md:justify-end items-start">
            <div className="relative w-64 md:w-80 lg:w-96 h-auto">
              <div className="relative w-full overflow-hidden bg-pink-light pinned-item pinned-tr">
                <Image
                  src="/animated/Sanskriti_looking_at_camera_202607210812.jpeg"
                  alt="Sanskriti Gupta — illustration looking at the camera, skills & achievements"
                  width={768}
                  height={1376}
                  className="object-cover w-full h-auto"
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                  loading="lazy"
                />
                <div className="absolute top-1 right-1 z-10 w-6 h-6 md:w-7 md:h-7">
                  <Image src="/red_pin.png" alt="" width={28} height={28} className="object-contain w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── LeetCode Stats ── */}
        <div className="mt-20 md:mt-28 pb-24 md:pb-32">
          <div className="relative inline-block mb-10">
            <h3
              className="section-heading text-2xl md:text-3xl font-display-alt"
              style={{ transform: "rotate(-0.3deg)" }}
            >
              LeetCode <span className="text-pink">Stats</span>
            </h3>
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

          <div className="notes-reveal">
            <div className="relative max-w-4xl mx-auto overflow-hidden pinned-item pinned-tl">
              <Image
                src="/my-leetcode.png"
                alt="Sanskriti Gupta LeetCode profile — 1,652 contest rating, 457 problems solved, top 17.88%"
                width={1040}
                height={720}
                className="object-cover w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 896px"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 z-10 w-6 h-6 md:w-7 md:h-7">
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
      </div>
    </section>
  );
}
