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
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
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
    <section id="work" ref={containerRef} className="editorial-section">
      <div className="max-w-4xl mx-auto">
        <div>
          <h2 className="section-heading mb-14 font-display-alt">
            Work <span className="text-pink">&amp;</span> Research
          </h2>
        </div>

        {/* Work entries — pageless flow */}
        <div>
          {personalInfo.work.map((job, i) => (
            <div
              key={i}
              className="work-entry entry group"
            >              <div className="flex items-start gap-4">
                {job.logo && (
                  <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden bg-pink-light flex items-center justify-center group-hover:bg-pink-light transition-colors duration-300">
                    <Image
                      src={job.logo}
                      alt={job.organization}
                      fill
                      className="object-contain p-2"
                      sizes="40px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="entry-title">{job.role}</div>
                  <div className="entry-meta flex items-center gap-2 flex-wrap normal-case">
                    <span>{job.organization}</span>
                    <span className="text-stone">&middot;</span>
                    <span className="text-charcoal">{job.year}</span>
                  </div>
                  {job.description.map((desc, j) => (
                    <p key={j} className="entry-desc mb-3 last:mb-0">
                      {desc}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Education — pageless flow */}
        <div className="mt-24 md:mt-32">
          <h3 className="section-heading text-2xl md:text-3xl mb-10 font-display-alt">
            Education
          </h3>

          <div>
            {personalInfo.education.map((edu, i) => (
              <div
                key={i}
              className="work-entry entry group relative"
            >
              <div className="flex items-start gap-4">
                  {edu.logo && (
                    <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden bg-pink-light flex items-center justify-center">
                      <Image
                        src={edu.logo}
                        alt={edu.school}
                        fill
                        className="object-contain p-2"
                        sizes="36px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="entry-title text-xl">{edu.degree}</div>
                    <div className="entry-meta text-charcoal flex items-center gap-2 flex-wrap normal-case">
                      <span>{edu.school}</span>
                      <span className="text-stone">&middot;</span>
                      <span className="text-charcoal">{edu.year}</span>
                    </div>
                    <p className="entry-desc mt-1">{edu.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
