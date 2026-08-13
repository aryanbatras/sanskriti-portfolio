"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const techColors: Record<string, string> = {
  Python: "bg-pink-light text-pink-dark",
  PyTorch: "bg-pink-light text-pink-dark",
  Whisper: "bg-pink-light text-pink-dark",
  MLP: "bg-pink-light text-pink-dark",
  FastAPI: "bg-stone text-ink",
  "Hugging Face": "bg-stone text-ink",
  BLIP: "bg-stone text-ink",
  OpenCV: "bg-stone text-ink",
  "Scikit-learn": "bg-pink-light text-pink-dark",
  NLP: "bg-pink-light text-pink-dark",
  CNN: "bg-pink-light text-pink-dark",
  Java: "bg-stone text-ink",
  PHP: "bg-stone text-ink",
  CSS: "bg-stone text-ink",
  HTML: "bg-stone text-ink",
  Jupyter: "bg-pink-light text-pink-dark",
  Pygame: "bg-stone text-ink",
  "Web Technologies": "bg-stone text-ink",
  ML: "bg-pink-light text-pink-dark",
  JavaScript: "bg-stone text-ink",
};

function getTechColor(tech: string): string {
  for (const [key, val] of Object.entries(techColors)) {
    if (tech.startsWith(key)) return val;
  }
  return "bg-stone text-ink";
}

export default function ProjectEntries() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".project-entry",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.04,
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
    <section id="projects" ref={containerRef} className="editorial-section bg-corkboard">
      <div className="max-w-6xl mx-auto">
        <div className="project-entry relative inline-block mb-14">
          <h2
            className="section-heading"
            style={{ transform: "rotate(-0.3deg)" }}
          >
            Projects
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

        {/* First 2 projects + portrait */}
        <div className="flex flex-col md:flex-row md:gap-10 mb-10">
          <div className="flex-1">
            <div className="grid gap-8 md:grid-cols-2">
              {personalInfo.projects.slice(0, 2).map((project, i) => (
                <div
                  key={i}
                  className="project-entry group bg-paper p-8 md:p-10 transition-all duration-300 "
                >

                  <div className="entry-title text-xl md:text-2xl mb-1">
                    {project.title}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tech.split(", ").map((tech, j) => (
                      <span
                        key={j}
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-full tracking-wide uppercase font-mono ${getTechColor(tech)}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="entry-desc text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link-arrow inline-flex items-center gap-1 group/link"
                    >
                      <span>Source code</span>
                      <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                        &rarr;
                      </span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Projects image — my workspace */}
          <div className="project-entry shrink-0 mt-8 md:mt-0 flex justify-center md:justify-end items-start">
            <div className="relative w-64 md:w-80 lg:w-96">
              <div className="relative w-full overflow-hidden bg-paper pinned-item pinned-tr">
                <Image
                  src="/images/workspace.jpeg"
                  alt="Sanskriti Gupta — my workspace, my setup & comfort space"
                  width={1280}
                  height={960}
                  className="object-cover w-full h-auto"
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
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
              <p
                className="text-pink mt-3 text-center tracking-wide font-mono text-sm"
                style={{ textTransform: "none" }}
              >
                My Workspace &mdash; My Setup or Comfort Space
              </p>
            </div>
          </div>
        </div>

        {/* Remaining projects */}
        <div className="grid gap-8 md:grid-cols-2">
          {personalInfo.projects.slice(2).map((project, i) => (
            <div
              key={i}
              className="project-entry group relative bg-paper p-8 md:p-10 transition-all duration-300"
            >
              <div className="entry-title text-xl md:text-2xl mb-1">
                {project.title}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tech.split(", ").map((tech, j) => (
                  <span
                    key={j}
                    className={`inline-block text-[10px] px-2 py-0.5 rounded-full tracking-wide uppercase font-mono ${getTechColor(tech)}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <p className="entry-desc text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link-arrow inline-flex items-center gap-1 group/link"
                >
                  <span>Source code</span>
                  <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                    &rarr;
                  </span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
