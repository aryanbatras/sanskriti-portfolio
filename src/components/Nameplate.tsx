"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(useGSAP);

export default function Nameplate() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      tl.fromTo(".nameplate-name", { opacity: 0, y: 24 }, { opacity: 1, y: 0 })
        .fromTo(".nameplate-role", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.4")
        .fromTo(".nameplate-tagline", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(".nameplate-photo", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8 }, "-=0.2")
        .fromTo(".nameplate-desc", { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.2");

      tl.call(() => {
        containerRef.current?.querySelector(".ink-underline")?.classList.add("animate");
      }, [], "+=0.4");
    },
    { scope: containerRef }
  );

  return (
    <header ref={containerRef} className="editorial-section bg-abstract-warm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between max-w-5xl">
        <div className="max-w-4xl">
          <h1 className="nameplate-name display-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none mb-5">
            <span className="ink-underline">{personalInfo.name}</span>
          </h1>

          <p className="nameplate-role mono-text text-pink mb-2">{personalInfo.title}</p>
          <p className="nameplate-tagline body-text text-sm text-charcoal italic mb-8">{personalInfo.tagline}</p>
          <p className="nameplate-desc body-text-large max-w-prose">{personalInfo.introduction}</p>
        </div>

        {personalInfo.photo && (
          <div className="nameplate-photo shrink-0 mt-8 md:mt-4 md:ml-12">
            <div className="relative w-28 h-28 md:w-40 md:h-40 overflow-hidden">
              <Image
                src={personalInfo.photo}
                alt="Sanskriti Gupta"
                fill
                className="object-cover grayscale opacity-85 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                sizes="(max-width: 768px) 112px, 160px"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
