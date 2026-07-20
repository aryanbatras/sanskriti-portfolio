"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ContactBlock() {
  const containerRef = useRef<HTMLElement>(null);

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
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section id="contact" ref={containerRef} className="editorial-section relative overflow-hidden">
      {/* Subtle warm background */}
      {personalInfo.images?.warmBg && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src={personalInfo.images.warmBg}
            alt=""
            fill
            className="object-cover opacity-[0.03]"
            sizes="100vw"
          />
        </div>
      )}

      <div className="relative z-10 max-w-4xl">
        <h2 className="section-heading mb-10">Contact</h2>

        <div className="space-y-8">
          <div className="contact-reveal">
            <p className="body-text text-lg">
              <a href={`mailto:${personalInfo.email}`} className="text-link">
                {personalInfo.email}
              </a>
            </p>
            <p className="body-text text-sm text-charcoal mt-1">The best way to reach me.</p>
          </div>

          <div className="contact-reveal flex flex-wrap gap-6">
            {personalInfo.socials.linkedin && (
              <a href={personalInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-link-arrow">LinkedIn</a>
            )}
            {personalInfo.socials.github && (
              <a href={personalInfo.socials.github} target="_blank" rel="noopener noreferrer" className="text-link-arrow">GitHub</a>
            )}
            {personalInfo.socials.leetcode && (
              <a href={personalInfo.socials.leetcode} target="_blank" rel="noopener noreferrer" className="text-link-arrow">LeetCode</a>
            )}
          </div>

          <div className="contact-reveal pt-6">
            <p className="body-text text-xs text-charcoal">{personalInfo.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
