"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pinCorners = [
  "top-2 right-2",
  "top-2 left-2",
];

const stickyColors = [
  "sticky-note",
  "sticky-note-pink",
  "sticky-note-blue",
  "sticky-note-green",
];

const chapters = [
  {
    id: "chapter-beginning",
    title: "The Girl Who Kept Asking Why",
    image: "/animated/Woman_examining_clock_gears_202607210832.jpeg",
    imageAlt: "Sanskriti holding a small gear between her fingers, examining it closely, a disassembled clock on the desk before her",
    text: "I took things apart to see how they worked. Clocks, remote controls, sentences that meant two things. The question \"why?\" became the thread through everything — from poetry to Python, from competitive programming to deep learning.",
    quote: {
      text: "Curiosity is not a trait — it is a way of seeing the world",
      source: "on what drives everything I do",
    },
    imgRot: "-3",
    imgZ: 10,
    noteContent: "curiosity > everything",
    noteRot: "4",
    noteColor: stickyColors[0],
  },
  {
    id: "chapter-childhood",
    title: "The Little Topper",
    image: "/animated/Student_smiling_at_textbook_202607210801.jpeg",
    imageAlt: "A younger Sanskriti sitting at a school desk, smiling softly at an open textbook, a gold medal ribbon draped over the corner",
    text: "95.8% in ICSE, top 3 in the district. 91.6% in CBSE. My mother raised me with warmth and resilience. Those years taught me discipline — and that the pressure of being \"the best\" doesn't go away, it just changes shape.",
    quote: {
      text: "Excellence is not a destination — it is the discipline of showing up every day",
      source: "on what school taught me",
    },
    imgRot: "2",
    imgZ: 8,
    noteContent: "95.8% ICSE. Top 3 in district.",
    noteRot: "-3",
    noteColor: stickyColors[1],
  },
  {
    id: "chapter-college",
    title: "The College Years",
    image: "/animated/Girl_sitting_with_laptop_college.jpeg",
    imageAlt: "Sanskriti at a college desk, staring at a laptop screen with focused determination",
    text: "B.Tech in Computer Science and Design at MITS Gwalior. Seven subjects a semester, a Reinforcement Learning course that pushed every limit, and a DSA study group that changed my trajectory.",
    quote: {
      text: "Teaching is the best way to truly understand something",
      source: "on why I lead study groups",
    },
    imgRot: "-1",
    imgZ: 6,
    noteContent: "B.Tech CS + Design. SGPA 8.55",
    noteRot: "3",
    noteColor: stickyColors[2],
  },
  {
    id: "chapter-scientist",
    title: "The Curious Scientist",
    image: "/animated/Girl_sitting_at_desk_202607210810.jpeg",
    imageAlt: "Sanskriti sitting at a desk, focused on her work, surrounded by notes and ideas",
    text: "Research intern at IIT Jammu — speech intelligibility prediction using deep learning. Whisper embeddings, Spectro-Temporal Modulation features, PyTorch. Before this: fraud detection, image captioning, A* pathfinding.",
    quote: {
      text: "Every project is a new problem — and I enjoy the process of solving it",
      source: "on what motivates my work",
    },
    imgRot: "2",
    imgZ: 5,
    noteContent: "research × writing × code",
    noteRot: "-3",
    noteColor: stickyColors[3],
  },
  {
    id: "chapter-writer",
    title: "The Writer",
    image: "/animated/Writer_thinking_with_pen_202607210810.jpeg",
    imageAlt: "Sanskriti leaning back in her chair, pen touching her chin, eyes looking upward — mid-thought",
    text: "Writing came before research. Poems, short stories, technical articles — the thread connecting them is making the complicated accessible. At FrameFlicks I write humor and poetry. At Codeveda I wrote about LLMs.",
    quote: {
      text: "Good writing is honest, precise, and says more than it appears to",
      source: "on what makes words effective",
    },
    imgRot: "-1",
    imgZ: 8,
    noteContent: "words are my first love",
    noteRot: "3",
    noteColor: stickyColors[0],
  },
  {
    id: "chapter-relationships",
    title: "The One Who Understands",
    image: "/animated/Woman_listening_with_understanding_202607210811.jpeg",
    imageAlt: "Sanskriti sitting on a wooden bench, soft gentle expression, listening with understanding",
    text: "I listen well. When someone opens up, I pay attention — not to respond, but to understand. The best friendships are built on mutual respect, not on being useful to each other.",
    quote: {
      text: "People are not defined by a single moment — they are defined by how they keep going",
      source: "on growth and resilience",
    },
    imgRot: "-3",
    imgZ: 9,
    noteContent: "a friend who actually listens",
    noteRot: "-2",
    noteColor: stickyColors[1],
  },
  {
    id: "chapter-dreamer",
    title: "The Dreamer",
    image: "/animated/Dreamer_looking_at_distance_202607210812.jpeg",
    imageAlt: "Sanskriti standing beside a desk, holding a book open but looking into the distance — dreaming",
    text: "I want to build things that matter — a startup that makes education accessible, research that advances how machines understand language, writing that resonates. The specifics will change. The drive will not.",
    quote: {
      text: "Always up for a meaningful challenge and a cup of coffee",
      source: "me, always",
    },
    imgRot: "1",
    imgZ: 9,
    noteContent: "startup dreams + poetry soul",
    noteRot: "-2",
    noteColor: stickyColors[2],
  },
  {
    id: "chapter-pixar",
    title: "A Soul Made of Stories",
    image: "/animated/Sanskriti_looking_at_camera_202607210812.jpeg",
    imageAlt: "Sanskriti looking directly at the camera with a warm, confident smile",
    text: "A curious kid who collected questions, built a career around answering them, and discovered that the most important thing you can do with a mind is to keep wondering. This is just the beginning.",
    quote: {
      text: "The most important thing you can do with a mind is to keep wondering",
      source: "on what I believe",
    },
    imgRot: "2",
    imgZ: 11,
    noteContent: "Always a writer. ♥️ Curious kid.",
    noteRot: "4",
    noteColor: stickyColors[3],
  },
];

/* ─── Sticky note for a handwritten quote ─── */
function QuoteSticky({
  quote,
  rotVal,
  colorClass,
}: {
  quote: { text: string; source: string };
  rotVal: string;
  colorClass: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotation: parseFloat(rotVal) + 3,
      duration: 0.4,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotation: parseFloat(rotVal),
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={ref}
      className={`memory-quote ${colorClass} sticky-note inline-block px-5 py-4 md:px-6 md:py-5 cursor-pointer`}
      style={{
        transformOrigin: "top center",
        transform: `rotate(${rotVal}deg)`,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Pin at top center */}
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
      <p className="handwritten text-lg md:text-xl leading-relaxed text-ink">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-charcoal/50 text-sm font-mono tracking-wide mt-2">
        — {quote.source}
      </p>
    </div>
  );
}

/* ─── Single Pinterest cluster per chapter ─── */
function ChapterCluster({
  chapter,
  idx,
}: {
  chapter: (typeof chapters)[0];
  idx: number;
}) {
  const imgPin = pinCorners[idx % 2];
  const clusterRot = `${(idx % 2 === 0 ? "-" : "")}${1 + (idx % 3)}`;

  return (
    <div
      className="memory-chapter relative"
      style={{ transform: `rotate(${clusterRot}deg)` }}
    >
      <div className={`relative flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} md:items-center md:gap-10 lg:gap-16`}>
        {/* ── Image cluster ── */}
        <div className="relative shrink-0 w-full md:w-80 lg:w-96 mb-8 md:mb-0 z-10">
          {/* Chapter image — tilted, pinned, rotates around the pin on hover */}
          <div
            className={`cluster-item ${imgPin.includes("right") ? "pinned-tr" : "pinned-tl"} relative w-full aspect-[3/4] overflow-hidden bg-paper`}
            style={{
              transform: `rotate(${chapter.imgRot}deg)`,
              zIndex: chapter.imgZ,
            }}
          >
            <Image
              src={chapter.image}
              alt={chapter.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
              loading="lazy"
            />
            {/* Red pin */}
            <div className={`absolute ${imgPin} z-20 w-7 h-7 md:w-8 md:h-8`}>
              <Image
                src="/red_pin.png"
                alt=""
                width={32}
                height={32}
                className="object-contain w-full h-full"
                loading="lazy"
              />
            </div>
            {/* Handwritten chapter label */}
            <div className="absolute bottom-3 left-3 z-20">
              <span
                className="handwritten text-white/90 text-sm md:text-base tracking-wide"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
              >
                ch. {String(idx + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Sticky note — overlapping from the image corner */}
          <div
            ref={(el) => {
              if (!el) return;
              const rot = parseFloat(chapter.noteRot);
              el.style.transformOrigin = "top center";
              el.style.transform = `rotate(${rot}deg)`;
              el.onmouseenter = () => {
                gsap.to(el, { rotation: rot + 3, duration: 0.4, ease: "back.out(1.7)", overwrite: "auto" });
              };
              el.onmouseleave = () => {
                gsap.to(el, { rotation: rot, duration: 0.3, ease: "power2.out", overwrite: "auto" });
              };
            }}
            className={`hidden md:block absolute -bottom-4 -right-4 z-20 ${chapter.noteColor} sticky-note max-w-[180px] cursor-pointer`}
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
              {chapter.noteContent}
            </p>
          </div>
        </div>

        {/* ── Right / Title + Text + Quote ── */}
        <div className="relative flex-1 min-w-0 z-10 flex flex-col justify-center">
          {/* Title */}
          <h3
            className="handwritten text-3xl md:text-4xl lg:text-5xl text-ink leading-tight mb-4"
            style={{ transform: `rotate(${-parseFloat(clusterRot)}deg)` }}
          >
            {chapter.title}
          </h3>

          {/* Handwritten text — no background, no border, pageless */}
          <p className="handwritten text-xl md:text-2xl lg:text-3xl text-charcoal/70 leading-relaxed mb-8 max-w-2xl">
            {chapter.text}
          </p>

          {/* Pull quote sticky */}
          <QuoteSticky
            quote={chapter.quote}
            rotVal={`${(idx % 2 === 0 ? "-" : "")}${1.5 + (idx % 3)}`}
            colorClass={[stickyColors[0], stickyColors[1], stickyColors[2], stickyColors[3]][(idx + 1) % 4]}
          />
        </div>
      </div>
    </div>
  );
}

export default function MemoriesStory() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".memory-chapter",
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".memory-quote",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power1.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      id="story"
      ref={containerRef}
      className="editorial-section pb-28 md:pb-40 bg-corkboard overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Section header ── */}
        <div className="mb-20 md:mb-28 text-center relative">
          <div className="inline-block relative">
            {/* Title — hand-drawn feel */}
            <h2
              className="font-display-alt text-5xl md:text-7xl lg:text-8xl text-ink leading-none mb-4"
              style={{ transform: "rotate(-0.5deg)" }}
            >
              A Clipboard of Memories
            </h2>
            <p
              className="body-text text-charcoal text-base md:text-lg max-w-xl mx-auto mt-6"
              style={{ transform: "rotate(0.3deg)" }}
            >
              The story of a girl who never stopped asking why — told through
              the moments, the questions, and the quiet victories.
            </p>
            {/* Big decorative pin */}
            <div className="absolute -top-4 -right-2 md:-top-5 md:-right-3 w-10 h-10 md:w-12 md:h-12 z-20">
              <Image
                src="/red_pin.png"
                alt=""
                width={48}
                height={48}
                className="object-contain w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* ── Chapters as Pinterest clusters ── */}
        <div className="space-y-28 md:space-y-40">
          {chapters.map((chapter, i) => (
            <ChapterCluster key={chapter.id} chapter={chapter} idx={i} />
          ))}
        </div>

        {/* ── Closing section ── */}
        <div className="mt-28 md:mt-40 text-center relative">
          <div className="max-w-2xl mx-auto relative">
            {/* Closing sticky note */}
            <div
              ref={(el) => {
                if (!el) return;
                el.style.transformOrigin = "top center";
                el.style.transform = "rotate(0.5deg)";
                el.onmouseenter = () => {
                  gsap.to(el, { rotation: 6, duration: 0.5, ease: "back.out(2.5)", overwrite: "auto" });
                };
                el.onmouseleave = () => {
                  gsap.to(el, { rotation: 0.5, duration: 0.4, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
                };
              }}
              className="sticky-note inline-block px-8 py-6 md:px-12 md:py-8 cursor-pointer"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 z-10">
                <Image
                  src="/red_pin.png"
                  alt=""
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
                  loading="lazy"
                />
              </div>
              <p
                className="handwritten text-3xl md:text-4xl lg:text-5xl text-ink leading-snug"
              >
                &ldquo;{personalInfo.pullQuote}&rdquo;
              </p>
            </div>

            <p
              className="body-text text-charcoal text-base md:text-lg mt-10 max-w-lg mx-auto"
              style={{ transform: "rotate(-0.3deg)" }}
            >
              A curious kid. A researcher. A writer. A friend. A dreamer.
            </p>
            <p
              className="text-pink text-xs font-mono tracking-widest mt-6 uppercase"
              style={{ transform: "rotate(0.2deg)" }}
            >
              Sanskriti Gupta &mdash; Class of 2027
            </p>

            {/* Tiny decorative pin at very bottom */}
            <div className="mt-8 flex justify-center">
              <div className="w-5 h-5 opacity-40">
                <Image
                  src="/red_pin.png"
                  alt=""
                  width={20}
                  height={20}
                  className="object-contain w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
