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
    <section id="contact" ref={containerRef} className="editorial-section bg-paper bg-dot-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="relative inline-block mb-6">
          <h2
            className="section-heading"
            style={{ transform: "rotate(-0.2deg)" }}
          >
            Get in touch
          </h2>
          {/* Tiny red pin — top-right of heading */}
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

        <div className="flex flex-col md:flex-row md:gap-12">
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

          {/* Portrait with red pin — bottom-left */}
          <div className="contact-reveal shrink-0 mt-10 md:mt-0 flex justify-center items-start">
            <div className="relative w-48 md:w-56 h-auto rounded-2xl overflow-hidden bg-pink-light">
              <Image
                src="/images/Woman_waving_hi_holding_coffee_202607201927.jpeg"
                alt="Sanskriti Gupta — say hi!"
                width={768}
                height={1376}
                className="object-cover w-full h-auto"
                sizes="(max-width: 768px) 192px, 224px"
                loading="lazy"
              />
              {/* Red pin — bottom-left corner */}
              <div className="absolute bottom-1 left-1 z-10 w-6 h-6 md:w-7 md:h-7">
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

        {/* Footer portrait with red pin — top-right */}
        <div className="contact-reveal mt-16 flex justify-center">
          <div className="relative w-40 md:w-48 h-auto rounded-2xl overflow-hidden">
            <Image
              src="/images/wondering-sitting-on-coach.jpeg"
              alt="Always wondering"
              width={768}
              height={1376}
              className="object-cover w-full h-auto"
              sizes="160px"
              loading="lazy"
            />
            {/* Red pin — top-right corner */}
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
    </section>
  );
}
