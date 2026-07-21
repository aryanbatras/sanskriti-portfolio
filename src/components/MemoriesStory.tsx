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
  "bottom-2 right-2",
  "bottom-2 left-2",
];

const stickyColors = [
  "sticky-note",
  "sticky-note-pink",
  "sticky-note-blue",
  "sticky-note-green",
];

const chapters = [
  /* ══════════════════════════════════════════════════
   * CHAPTER 01 — THE BEGINNING
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-beginning",
    title: "The Girl Who Kept Asking Why",
    image: "/animated/Woman_examining_clock_gears_202607210832.jpeg",
    imageAlt: "Sanskriti holding a small gear between her fingers, examining it closely, a disassembled clock on the desk before her",
    text: [
      `I was the kind of child who took things apart just to see how they worked. Not out of destruction — out of wonder. The inside of a clock, the logic of a remote control, the way a sentence could mean two different things — I had to know how everything fit together.`,
      `I kept asking why. And that question became the thread running through everything I ever did. From poetry to Python. From LeetCode to speech models. It was never about proving something to the world. It was about satisfying a quiet, relentless hunger — the kind that wakes you up at 2 AM with a new idea and won't let you sleep until you've explored it.`,
      `I don't see the world as it is. I see it as a series of questions waiting to be answered. And the more I learn, the more I realize how much I don't know. That's not discouraging to me. That's the best part.`,
    ],
    quote: {
      text: "I think of myself as a curious kid who never stopped asking why",
      source: "me, always",
    },
    imgRot: "-3",
    imgZ: 10,
    noteContent: "curiosity > everything",
    noteRot: "4",
    noteColor: stickyColors[0],
  },
  /* ══════════════════════════════════════════════════
   * CHAPTER 02 — CHILDHOOD
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-childhood",
    title: "The Little Topper",
    image: "/animated/Student_smiling_at_textbook_202607210801.jpeg",
    imageAlt: "A younger Sanskriti sitting at a school desk, smiling softly at an open textbook, a gold medal ribbon draped over the corner",
    text: [
      `Before the research papers and the LeetCode ratings, there was a little girl who topped her class without even trying. 95.8% in ICSE — top 3 in the entire district. 91.6% in CBSE. I was good at everything in school. That's not arrogance. That's just how it was. My mother raised me with warmth and resilience, and I wanted to make her proud.`,
      `I grew up taking things apart — toys, gadgets, the logic of how the world worked. My school years were a parade of gold medals and quiet accomplishments. I was the star student, the teacher's pet, the one everyone expected great things from. And I wore that crown lightly, because I genuinely loved learning.`,
      `But being the best at everything came with a hidden cost. When you start at the top, there's only one direction that feels like failure. I didn't know it then, but the expectations I carried would one day become the heaviest weight I'd ever bear.`,
    ],
    quote: {
      text: "I was good at everything in school and now I'm average at all of them",
      source: "me, learning humility",
    },
    imgRot: "2",
    imgZ: 8,
    noteContent: "95.8% ICSE. Top 3 in district.",
    noteRot: "-3",
    noteColor: stickyColors[1],
  },
  /* ══════════════════════════════════════════════════
   * CHAPTER 03 — COLLEGE LIFE
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-college",
    title: "The College Years",
    image: "/animated/Girl_sitting_with_laptop_college.jpeg",
    imageAlt: "Sanskriti at a messy college desk, elbows on the surface, staring at a laptop screen with tired determination",
    text: [
      `At Madhav Institute of Technology and Science, Gwalior, I chose Computer Science and Design — a degree that perfectly matched my dual nature. Logic and creativity. Code and art. Architecture and expression. My branch is computer science and design, which means we study subjects in design — some about architecture, some on low level like design patterns. It's the best of both worlds.`,
      `College hit me harder than I expected. Seven subjects a semester — operating systems, graphics, cyber security, data science, compiler design, economics. A mandatory Reinforcement Learning course that was — and I quote myself — "Bahutttttt hard course hai." NPTEL exams. Endless practicals. I was very distracted those first few weeks, especially because of college exams and practicals. But I kept going.`,
      `I discovered the DSA group — a community of competitive programmers who met daily to solve problems. I loved teaching, loved explaining concepts, loved the thrill of a difficult question. Presenting a question was really scary at first. But I did it anyway. Because that's who I am. Someone who shows up even when it's terrifying.`,
    ],
    quote: {
      text: "I too love teaching and DSA — would love to work together some day",
      source: "me, to a friend with a dream",
    },
    imgRot: "-1",
    imgZ: 6,
    noteContent: "B.Tech CS + Design. SGPA 8.55",
    noteRot: "3",
    noteColor: stickyColors[2],
  },
  /* ══════════════════════════════════════════════════
   * CHAPTER 04 — THE SCIENTIST
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-scientist",
    title: "The Curious Scientist",
    image: "/abstract/abstract-1.jpg",
    imageAlt: "Abstract warm fluid — waiting for the scientist portrait",
    text: [
      `At IIT Jammu, I work on non-intrusive speech intelligibility prediction — teaching machines to understand how well speech is understood. It's deep learning at the intersection of language, signal processing, and human perception. I use Whisper embeddings and Spectro-Temporal Modulation features to build models that listen the way humans do.`,
      `But I didn't start there. I built a fraud detection pipeline at 3Skill, an image captioning app called VisionSense using BLIP transformers, and a zombie survival game using A* algorithm — all because each one was a new puzzle I couldn't resist solving.`,
      `A friend once said that everything I like is basically one giant puzzle. LeetCode. Research. Reinforcement learning. Speech models. Sliding puzzles. Fraud detection. Whisper embeddings. Writing poems. They're right. All of it begins with the same question: "How does this work?" And I need to find out.`,
    ],
    quote: {
      text: "Contest excite me because if you are consistent the ratings go up",
      source: "me, on why I love competing",
    },
    imgRot: "2",
    imgZ: 5,
    noteContent: "research × writing × code",
    noteRot: "-3",
    noteColor: stickyColors[3],
  },
  /* ══════════════════════════════════════════════════
   * CHAPTER 05 — THE WRITER
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-writer",
    title: "The Writer",
    image: "/animated/Writer_thinking_with_pen_202607210810.jpeg",
    imageAlt: "Sanskriti leaning back in her chair, pen touching her chin, eyes looking upward with a soft amused smile — mid-thought",
    text: [
      `Before I was a researcher, I was a writer. Poems. Short stories. Comic pieces. Words that danced between Hindi and English, between heart and logic. Writing was my first language. I only write when I'm sad, I once said — but that's not entirely true. I write because I feel deeply, observe closely, and think honestly.`,
      `At FrameFlicks, I write humor and poetry. At Codeveda, I wrote technical content about LLMs and AI. Both use the same muscle — the ability to take something complex and make it feel human. Whether it's a poem about mirrors or an article about retrieval-augmented generation, the goal is the same: connect.`,
      `Someone once told me that my lines are small, honest, and hit harder than they should. I think that's the best compliment a writer can receive.`,
    ],
    quote: {
      text: "I used to talk the way you do when I was 16. That is not an insult actually.",
      source: "me, to a younger friend",
    },
    imgRot: "-1",
    imgZ: 8,
    noteContent: "words are my first love",
    noteRot: "3",
    noteColor: stickyColors[0],
  },
  /* ══════════════════════════════════════════════════
   * CHAPTER 06 — THE PUZZLE SOLVER
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-contester",
    title: "The Puzzle Solver",
    image: "/abstract/abstract-3.jpg",
    imageAlt: "Abstract warm tones — waiting for the competitive programmer portrait",
    text: [
      `I have a LeetCode rating of 1652 and 540+ problems solved. I don't just code — I compete. Codeforces. CodeChef. LeetCode contests. Each one is a playground for my mind. Contest excite me because if you are consistent, the ratings go up. It's that simple and that hard at the same time.`,
      `Having friends to compete with makes it better. It disappoints me when they do better than me, which is quite often. But that disappointment is fuel. It forces me to learn more for the next time. The feeling of waiting for the new rating till every Thursday is ajeeb — but I love it.`,
      `I have spent 2+ years mastering C++ through competitive programming and OOP. I ranked 742 in a LeetCode contest once. I track ratings, celebrate small wins, and keep coming back. Not for the badge. For the puzzle.`,
    ],
    quote: {
      text: "The feeling of waiting for the new rating till every Thursday is ajeeb 🤧",
      source: "me, every Thursday",
    },
    imgRot: "3",
    imgZ: 12,
    noteContent: "540+ problems. 1652 rating.",
    noteRot: "-4",
    noteColor: stickyColors[1],
  },
  /* ══════════════════════════════════════════════════
   * CHAPTER 07 — STRUGGLES
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-struggle",
    title: "The Girl Behind the Screen",
    image: "/abstract/abstract-5.jpg",
    imageAlt: "Abstract warm emotions — waiting for the struggles portrait",
    text: [
      `I have sat in the IIT Jammu library, overwhelmed by research papers. I have felt the loneliness of being away from home. I have questioned whether I belong here. I have fought with procrastination, decision fatigue, and the weight of my own expectations. I feel like I'm failing in literally everything. All of my confidence is gone.`,
      `I was good at everything in school and now I'm average at all of them. That sentence terrifies me more than any exam ever could. There are days when I wonder if I peaked at sixteen.`,
      `But here's the thing: I always get back up. I make plans. I break down my project into smaller parts. I write a timetable. I order chocolate cold coffee and try again. I don't stay down. I can't — there are too many questions left to answer.`,
    ],
    quote: {
      text: "Sab kuch kyun karna hai yr. Kch to hmare liye chhor do.",
      source: "me, feeling the pressure",
    },
    imgRot: "-2",
    imgZ: 7,
    noteContent: "it is okay to fall. get back up.",
    noteRot: "5",
    noteColor: stickyColors[2],
  },
  /* ══════════════════════════════════════════════════
   * CHAPTER 08 — RELATIONSHIPS
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-relationships",
    title: "The One Who Understands",
    image: "/animated/Woman_listening_with_understanding_202607210811.jpeg",
    imageAlt: "Sanskriti sitting on a wooden bench, turned slightly to her right, soft gentle expression, hands resting loosely — listening with understanding",
    text: [
      `I have a gift for understanding people. When a friend opens up about their deepest insecurities, I don't judge. I listen. And then I say exactly what they need to hear. I told a friend in his lowest moment: "You're a gift of God. I'm a more expensive one though." Because I know that humor heals better than sympathy ever could.`,
      `I believe that you should never try to be useful to your friends. Yes, be a good friend — but it is bad if you have to feel needed. I see through people's defenses. I notice when someone is being too hard on themselves. I call them out — gently. Kisi ko bhi label nahi karna chahiye. Ki ye aisa hai aur ye aise se badal nahi sakta. Don't label people. They can change.`,
      `I crave connection but guard my vulnerability. I once joked that I have a habit of using people — but the truth is the opposite. I give more than I take. I remember the small things. I show up. And when someone told me I was "sweet" — in the most genuine sense of the word — I think that was the first time I believed a compliment about who I am, not what I do.`,
    ],
    quote: {
      text: "Don't try to find people like you. Learn to live with others. They will like you.",
      source: "me, to a friend learning to belong",
    },
    imgRot: "-3",
    imgZ: 9,
    noteContent: "a friend who actually listens",
    noteRot: "-2",
    noteColor: stickyColors[3],
  },
  /* ══════════════════════════════════════════════════
   * CHAPTER 09 — THE DREAMER
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-dreamer",
    title: "The Dreamer",
    image: "/animated/Dreamer_looking_at_distance_202607210812.jpeg",
    imageAlt: "Sanskriti standing beside a desk, holding a book open but looking into the distance, one hand resting on a small globe — dreaming",
    text: [
      `I want to build a startup someday. I have ideas — a chatbot that becomes the personality of any book, a platform for teaching, a social app that actually connects people. I talk about them with a spark in my eyes and a joke on my lips, because dreams feel less fragile when you can laugh about them.`,
      `I want to be highly paid. I also want to write. I want to be a teacher. I also want to disappear into research. I want to travel to Spain. I also want to sit in the library at 2 AM with a good paper and a cup of coffee. I want all of it. And I refuse to believe I have to choose.`,
      `I am a collection of contradictions — lazy and ambitious, confident and doubtful, loud and quiet, silly and profound. And that's exactly what makes me who I am. A girl who is always up for a meaningful challenge and a cup of code.`,
    ],
    quote: {
      text: "Always up for a meaningful challenge and a cup of coffee",
      source: "me, always",
    },
    imgRot: "1",
    imgZ: 9,
    noteContent: "startup dreams + poetry soul",
    noteRot: "-2",
    noteColor: stickyColors[0],
  },
  /* ══════════════════════════════════════════════════
   * CHAPTER 10 — ANIMATED MOVIES  (FINALE)
   * ══════════════════════════════════════════════════ */
  {
    id: "chapter-pixar",
    title: "A Soul Made of Stories",
    image: "/animated/Sanskriti_looking_at_camera_202607210812.jpeg",
    imageAlt: "Sanskriti looking directly at the camera with a warm knowing smile, one eyebrow slightly raised, pen in hand — confident and warm",
    text: [
      `When someone asked me what vibe I wanted for my portfolio, I didn't say "professional" or "minimalist." I said: "Can you keep the vibe of animated movies? Disney, Pixar, DreamWorks, Universal Pictures." Because that request reveals more about me than any resume bullet point ever could.`,
      `I see myself in Riley from Inside Out — the quiet observer who feels everything deeply. In Hiro Hamada from Big Hero 6 — the young engineer at a small desk with big ideas. In Violet Parr from The Incredibles — reserved, thoughtful, stronger than I look. In Hiccup from How to Train Your Dragon — someone who doesn't win by fighting harder, but by understanding better.`,
      `If Pixar made a film about me, it would be called "The Girl Who Asked Why." And it would be about a curious kid who collected questions like treasures, who built a world around her thirst for understanding, who discovered that the most beautiful thing you can do with a mind is to keep wondering. That's me. That's always been me.`,
    ],
    quote: {
      text: "I am a girl collecting questions. Every unanswered question becomes a glowing little puzzle piece. As I explore, those pieces connect into constellations above my desk.",
      source: "me, if Pixar wrote my story",
    },
    imgRot: "2",
    imgZ: 11,
    noteContent: "Pixar called. I am the main character.",
    noteRot: "4",
    noteColor: stickyColors[1],
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
  return (
    <div
      className={`memory-quote ${colorClass} sticky-note inline-block px-5 py-4 md:px-6 md:py-5`}
      style={{ transform: `rotate(${rotVal}deg)` }}
    >
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
  const imgPin = pinCorners[idx % 4];
  const notePin = pinCorners[(idx + 2) % 4];
  const clusterRot = `${(idx % 2 === 0 ? "-" : "")}${1 + (idx % 3)}`;

  return (
    <div
      className="memory-chapter relative"
      style={{ transform: `rotate(${clusterRot}deg)` }}
    >
      {/* Inner cluster — images alternate left/right based on chapter */}
      <div className={`relative flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} md:items-start md:gap-8 lg:gap-12`}>
        {/* ── Left / Image cluster ── */}
        <div className="relative shrink-0 w-full md:w-72 lg:w-80 mb-8 md:mb-0 z-10">
          {/* Chapter image — tilted, pinned, full image visible */}
          <div
            className="cluster-item relative w-full aspect-[9/16] overflow-hidden bg-paper"
            style={{ transform: `rotate(${chapter.imgRot}deg)`, zIndex: chapter.imgZ }}
          >
            <Image
              src={chapter.image}
              alt={chapter.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />
            {/* Red pin */}
            <div className={`absolute ${imgPin} z-20 w-7 h-7 md:w-8 md:h-8`}>
              <Image
                src="/red_pin.png"
                alt=""
                width={32}
                height={32}
                className="object-contain w-full h-full"
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
            className={`hidden md:block absolute -bottom-4 -right-4 z-20 ${chapter.noteColor} sticky-note max-w-[180px]`}
            style={{ transform: `rotate(${chapter.noteRot}deg)` }}
          >
            <div className={`absolute ${notePin} z-10 w-5 h-5`}>
              <Image
                src="/red_pin.png"
                alt=""
                width={20}
                height={20}
                className="object-contain w-full h-full"
              />
            </div>
            <p className="handwritten text-sm md:text-base text-ink/80 leading-snug">
              {chapter.noteContent}
            </p>
          </div>
        </div>

        {/* ── Right / Text cluster ── */}
        <div className="relative flex-1 min-w-0 z-10">
          {/* Title — handwritten style */}
          <h3
            className="handwritten text-3xl md:text-4xl lg:text-5xl text-ink leading-tight mb-6"
            style={{ transform: `rotate(${-parseFloat(clusterRot)}deg)` }}
          >
            {chapter.title}
          </h3>

          {/* Torn paper text blocks */}
          <div className="space-y-5">
            {chapter.text.map((paragraph, j) => (
              <div
                key={j}
                className="torn-edge bg-paper p-4 md:p-5 rounded-sm"
                style={{
                  transform: `rotate(${(j % 2 === 0 ? "" : "-")}0.5deg)`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <p className="body-text text-base md:text-lg leading-relaxed text-charcoal">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>

          {/* Pull quote as a sticky note */}
          <div className="mt-8 md:mt-10">
            <QuoteSticky
              quote={chapter.quote}
              rotVal={`${(idx % 2 === 0 ? "-" : "")}${1.5 + (idx % 3)}`}
              colorClass={[stickyColors[0], stickyColors[1], stickyColors[2], stickyColors[3]][(idx + 1) % 4]}
            />
          </div>
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
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.3,
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
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.2,
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
              className="handwritten text-5xl md:text-7xl lg:text-8xl text-ink leading-none mb-4"
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
              />
            </div>
          </div>

          {/* Decorative string thread */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 string-thread opacity-20" />
        </div>

        {/* ── Chapters as Pinterest clusters ── */}
        <div className="space-y-28 md:space-y-40">
          {chapters.map((chapter, i) => (
            <ChapterCluster key={chapter.id} chapter={chapter} idx={i} />
          ))}
        </div>

        {/* ── Closing section ── */}
        <div className="mt-28 md:mt-40 text-center relative">
          {/* Decorative string */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 string-thread opacity-20" />

          <div className="max-w-2xl mx-auto relative">
            {/* Closing sticky note */}
            <div
              className="sticky-note inline-block px-8 py-6 md:px-12 md:py-8"
              style={{ transform: "rotate(0.5deg)" }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 z-10">
                <Image
                  src="/red_pin.png"
                  alt=""
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
