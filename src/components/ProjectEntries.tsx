"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectEntries() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".project-entry",
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
    <section id="projects" ref={containerRef} className="editorial-section relative overflow-hidden">
      {/* Abstract ML background */}
      {personalInfo.images?.projectsBg && (
        <div className="absolute top-0 right-0 w-1/2 h-full z-0" aria-hidden="true">
          <Image
            src={personalInfo.images.projectsBg}
            alt=""
            fill
            className="object-cover opacity-[0.04] grayscale"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-paper" />
        </div>
      )}

      <div className="relative z-10 max-w-4xl">
        <h2 className="section-heading mb-14">Projects</h2>

        <div>
          {personalInfo.projects.map((project, i) => (
            <div key={i} className="project-entry entry">
              <div className="entry-title">{project.title}</div>
              <div className="entry-meta">{project.tech}</div>
              <p className="entry-desc mb-3">{project.description}</p>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link-arrow"
                >
                  Source code
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
