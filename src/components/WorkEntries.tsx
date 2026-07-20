"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function WorkEntries() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".work-entry",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
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
    <section id="work" ref={containerRef} className="editorial-section">
      <div className="max-w-4xl">
        <h2 className="section-heading mb-14">Work</h2>

        <div>
          {personalInfo.work.map((job, i) => (
            <div key={i} className="work-entry entry">
              <div className="entry-title">{job.role}</div>
              <div className="entry-meta flex items-center gap-2 flex-wrap normal-case">
                {job.logo && (
                  <div className="relative w-6 h-6 shrink-0 opacity-60 grayscale">
                    <Image src={job.logo} alt={job.organization} fill className="object-contain" sizes="24px" />
                  </div>
                )}
                <span className="font-mono text-xs tracking-widest uppercase">
                  {job.organization} &middot; {job.year}
                </span>
              </div>
              {job.description.map((desc, j) => (
                <p key={j} className="entry-desc mb-2 last:mb-0">{desc}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="section-heading text-2xl mb-8">Education</h3>
          {personalInfo.education.map((edu, i) => (
            <div key={i} className="work-entry entry">
              <div className="entry-title text-xl">{edu.degree}</div>
              <div className="entry-meta text-charcoal flex items-center gap-2 flex-wrap normal-case">
                {edu.logo && (
                  <div className="relative w-6 h-6 shrink-0 opacity-60 grayscale">
                    <Image src={edu.logo} alt={edu.school} fill className="object-contain" sizes="24px" />
                  </div>
                )}
                <span className="font-mono text-xs tracking-widest uppercase">
                  {edu.school} &middot; {edu.year}
                </span>
              </div>
              <p className="entry-desc">{edu.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
