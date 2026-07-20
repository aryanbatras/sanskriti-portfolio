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
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section id="notes" ref={containerRef} className="editorial-section relative">
      {/* Paper texture background */}
      {personalInfo.images?.paperBg && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src={personalInfo.images.paperBg}
            alt=""
            fill
            className="object-cover opacity-[0.03]"
            sizes="100vw"
          />
        </div>
      )}

      <div className="relative z-10 max-w-4xl">
        <h2 className="section-heading mb-14">Notes</h2>

        <div className="editorial-grid">
          <div>
            {personalInfo.skills.map((group, i) => (
              <div key={i} className="notes-reveal mb-8 last:mb-0">
                <h3 className="mono-text text-pink mb-3">
                  {group.category}
                </h3>
                <p className="body-text leading-relaxed text-charcoal">
                  {group.items.join("  \u00B7  ")}
                </p>
              </div>
            ))}
          </div>

          <div>
            <div className="notes-reveal mb-8">
              <h3 className="mono-text text-pink mb-3">
                Certifications
              </h3>
              {personalInfo.certifications.map((cert, i) => (
                <p key={i} className="entry-desc mb-2 last:mb-0">
                  {cert}
                </p>
              ))}
            </div>

            <div className="notes-reveal">
              <h3 className="mono-text text-pink mb-3">
                Achievements
              </h3>
              {personalInfo.achievements.map((a, i) => (
                <p key={i} className="entry-desc mb-2 last:mb-0">
                  {a}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
