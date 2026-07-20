"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";
import EditorialImage from "@/components/EditorialImage";

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
        {/* First paragraph */}
        <p className="writing-reveal body-text mb-6">
          {personalInfo.about[0]}
        </p>

        {/* Editorial full-bleed image between paragraphs */}
        {personalInfo.images?.writingOne && (
          <div className="writing-reveal my-10">
            <EditorialImage
              src={personalInfo.images.writingOne}
              alt="A journal and pen in warm light - the writing process"
              variant="full-bleed"
              aspectRatio="wide"
            />
          </div>
        )}

        {/* Second paragraph */}
        <p className="writing-reveal body-text mb-10">
          {personalInfo.about[1]}
        </p>

        {/* Pull quote */}
        <div className="writing-reveal pull-quote">
          &ldquo;{personalInfo.pullQuote}&rdquo;
        </div>

        {/* Third paragraph */}
        <p className="writing-reveal body-text mt-8 mb-6">
          {personalInfo.about[2]}
        </p>

        {/* Journey image */}
        {personalInfo.images?.journey && (
          <div className="writing-reveal my-10">
            <EditorialImage
              src={personalInfo.images.journey}
              alt="A path through a sunlit forest - the journey of growth"
              variant="full-bleed"
              aspectRatio="wide"
            />
          </div>
        )}

        {/* Intro paragraph */}
        <p className="writing-reveal body-text mt-8">
          {personalInfo.writingIntro}
        </p>
      </div>
    </section>
  );
}
