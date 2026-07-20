"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function WritingBlock() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".writing-reveal",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
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
    <section ref={containerRef} className="editorial-section">
      <div className="max-w-4xl">
        <p className="writing-reveal body-text mb-6">{personalInfo.about[0]}</p>
        <p className="writing-reveal body-text mb-10">{personalInfo.about[1]}</p>

        <div className="writing-reveal pull-quote">
          &ldquo;{personalInfo.pullQuote}&rdquo;
        </div>

        <p className="writing-reveal body-text mt-8 mb-6">{personalInfo.about[2]}</p>
        <p className="writing-reveal body-text mt-8">{personalInfo.writingIntro}</p>
      </div>
    </section>
  );
}
