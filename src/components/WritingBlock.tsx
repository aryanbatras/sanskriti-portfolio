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
          <div className="flex-1">
            <p className="writing-reveal body-text-large mb-6">
              <span className="ink-underline">I am a computer science and design
              student</span> at Madhav Institute of Technology and Science, Gwalior.
              My research focuses on speech intelligibility prediction, deep
              learning, and the space where language meets code. I think of myself
              as a{" "}
              <span className="italic text-pink-dark">
                curious kid who never stopped asking why
              </span>
              .
            </p>

            {/* Journey paragraph — moved inside flex-1 to eliminate gap */}
            <p className="writing-reveal body-text">
              Before my research at IIT Jammu, I developed a machine learning
              pipeline to detect fraudulent job postings at 3Skill, and built a
              real-time image captioning application called VisionSense. I have also
              written technical content for Codeveda and creative pieces for
              FrameFlicks.
            </p>
          </div>

          {/* Portrait with red pin — top-right */}
          <div className="writing-reveal shrink-0 mt-6 md:mt-0 md:order-last">
            <div className="relative w-48 md:w-56 h-auto overflow-hidden bg-pink-light pinned-item pinned-tr">
              <Image
                src="/images/Sanskriti_Gupta_looking_at_camera_202607201936.jpeg"
                alt="Sanskriti Gupta"
                width={768}
                height={1376}
                className="object-cover w-full h-auto"
                sizes="(max-width: 768px) 192px, 224px"
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
