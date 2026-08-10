"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const videos = [
  {
    src: "/videos/sanskriti-reel-1.mp4",
    alt: "Sanskriti Gupta — reel 1",
    rotate: "-2",
  },
  {
    src: "/videos/sanskriti-reel-2.mp4",
    alt: "Sanskriti Gupta — reel 2",
    rotate: "3",
  },
];

export default function VideoGallery() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".video-card",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
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
    <section
      ref={containerRef}
      className="editorial-section bg-corkboard overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="relative inline-block mb-14">
          <h2
            className="section-heading"
            style={{ transform: "rotate(0.3deg)" }}
          >
            A Few <span className="text-pink">Moments</span>
          </h2>
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

        {/* Videos — asymmetric collage layout */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12">
          {/* Video 1 — larger, tilted */}
          <div
            className="video-card relative flex-1 mb-8 md:mb-0"
            style={{ transform: `rotate(${videos[0].rotate}deg)` }}
          >
            <div className="relative overflow-hidden bg-paper pinned-item pinned-tl">
              <video
                className="w-full h-auto object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                onMouseLeave={(e) => {
                  const v = e.target as HTMLVideoElement;
                  v.pause();
                  v.currentTime = 0;
                }}
                src={videos[0].src}
              />
              {/* Red pin — top-left */}
              <div className="absolute top-2 left-2 z-10 w-6 h-6 md:w-7 md:h-7">
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

          {/* Video 2 — smaller, opposite tilt */}
          <div
            className="video-card relative w-full md:w-[40%] lg:w-[35%]"
            style={{ transform: `rotate(${videos[1].rotate}deg)` }}
          >
            <div className="relative overflow-hidden bg-paper pinned-item pinned-tr">
              <video
                className="w-full h-auto object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                onMouseLeave={(e) => {
                  const v = e.target as HTMLVideoElement;
                  v.pause();
                  v.currentTime = 0;
                }}
                src={videos[1].src}
              />
              {/* Red pin — top-right */}
              <div className="absolute top-2 right-2 z-10 w-6 h-6 md:w-7 md:h-7">
                <Image
                  src="/red_pin.png"
                  alt=""
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Sticky note beneath video 2 */}
            <div
              className="sticky-note mt-4 max-w-[220px]"
              style={{ transform: "rotate(-2deg)" }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-5 h-5">
                <Image
                  src="/red_pin.png"
                  alt=""
                  width={20}
                  height={20}
                  className="object-contain w-full h-full"
                  loading="lazy"
                />
              </div>
              <p className="handwritten text-sm md:text-base text-ink/80 leading-snug">
                Moments from my world ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
