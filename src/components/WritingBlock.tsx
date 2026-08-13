"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function WritingBlock() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".writing-reveal",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.15 },
      ).call(
        () => {
          containerRef.current
            ?.querySelectorAll(".ink-underline")
            .forEach((el) => el.classList.add("animate"));
        },
        [],
        "+=0.2",
      );
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} id="writing" className="editorial-section">
      <div className="max-w-6xl mx-auto">
        {/* Intro + Journey paragraphs side by side with image on desktop */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-10">
          <div className="flex-1 space-y-6">
            <p className="writing-reveal body-text-large">
              Hi, I&rsquo;m{" "}
              <span className="ink-underline">
                Sanskriti &mdash; a computer science student who enjoys building
                things, solving problems
              </span>
              , and understanding how they work under the hood.
            </p>

            <p className="writing-reveal body-text">
              My work sits at the intersection of{" "}
              <span className="italic text-pink-dark">
                software engineering and AI
              </span>
              . I work with{" "}
              <span className="italic text-pink-dark">
                machine learning, deep learning, and data structures &amp; algorithms
              </span>
              , and I enjoy taking an idea from a problem statement to something
              that actually works. I&rsquo;ve also been exploring research through
              hands-on work in deep learning, where I&rsquo;ve worked with real-world
              data, model architectures, feature extraction, and experimentation.
            </p>

            <p className="writing-reveal body-text">
              I&rsquo;m particularly interested in opportunities where I can combine{" "}
              <span className="italic text-pink-dark">
                strong problem-solving with engineering and research
              </span>{" "}
              &mdash; whether that means building reliable software, working on
              intelligent systems, or digging into a problem that doesn&rsquo;t have
              an obvious solution.
            </p>

            <p className="writing-reveal body-text">
              I like learning things deeply, I&rsquo;m comfortable figuring things out
              on my own, and I&rsquo;m always looking for problems that are a little
              harder than what I already know.
            </p>
          </div>

          {/* Home images — 3-image collage, dynamic on desktop */}
          <div className="writing-reveal shrink-0 mt-6 md:mt-0 md:order-last flex justify-center md:justify-end">
            <div className="relative w-64 h-80 md:w-80 md:h-112 lg:w-96 lg:h-136">
              {/* Main image — 45-degree tilt (top-right corner up) */}
              <div
                className="absolute inset-0 overflow-hidden bg-pink-light"
                style={{ transform: "rotate(-30deg)" }}
              >
                <Image
                  src="/images/img-home-45deg-tilt.jpeg"
                  alt="Sanskriti Gupta — CS student & researcher"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                />
                <div className="absolute top-1 right-1 z-10 w-6 h-6 md:w-7 md:h-7" style={{ transform: "rotate(30deg)" }}>
                  <Image src="/red_pin.png" alt="" width={28} height={28} className="object-contain w-full h-full" />
                </div>
              </div>

              {/* Supporting image 2 — overlapping from bottom-left */}
              <div
                className="absolute -bottom-4 -left-6 md:-bottom-6 md:-left-8 w-32 h-40 md:w-40 md:h-52 overflow-hidden bg-paper"
                style={{ transform: "rotate(5deg)", zIndex: 11 }}
              >
                <Image
                  src="/images/img-home-2.jpeg"
                  alt="Sanskriti Gupta — home"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 128px, 160px"
                  loading="lazy"
                />
                <div className="absolute top-1 right-1 z-10 w-5 h-5 md:w-6 md:h-6" style={{ transform: "rotate(-5deg)" }}>
                  <Image src="/red_pin.png" alt="" width={24} height={24} className="object-contain w-full h-full" />
                </div>
              </div>

              {/* Supporting image 3 — overlapping from top-right */}
              <div
                className="absolute -top-3 -right-4 md:-top-5 md:-right-6 w-28 h-36 md:w-36 md:h-44 overflow-hidden bg-paper"
                style={{ transform: "rotate(-4deg)", zIndex: 9 }}
              >
                <Image
                  src="/images/img-home-3.jpeg"
                  alt="Sanskriti Gupta — home"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 144px"
                  loading="lazy"
                />
                <div className="absolute top-1 right-1 z-10 w-5 h-5 md:w-6 md:h-6" style={{ transform: "rotate(4deg)" }}>
                  <Image src="/red_pin.png" alt="" width={24} height={24} className="object-contain w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pull quote */}
        <div className="writing-reveal pull-quote">
          &ldquo;{personalInfo.pullQuote}&rdquo;
        </div>

        {/* Outside work paragraph */}
        <p className="writing-reveal body-text mt-8 mb-6">
          Outside of AI research, I write poetry and short stories, solve data
          structures and algorithms problems, and I am always looking for the
          next meaningful challenge.
        </p>

        {/* Closing */}
        <p className="writing-reveal body-text mt-10">
          <span className="text-pink-dark italic">
            &ldquo;{personalInfo.writingIntro}&rdquo;
          </span>
        </p>
      </div>
    </section>
  );
}
