"use client";

import VideoStory from "@/components/VideoStory";
import SmoothScroll from "@/components/SmoothScroll";
import WritingBlock from "@/components/WritingBlock";
import MemoriesStory from "@/components/MemoriesStory";
import WorkEntries from "@/components/WorkEntries";
import ProjectEntries from "@/components/ProjectEntries";
import NotesBlock from "@/components/NotesBlock";
import ContactBlock from "@/components/ContactBlock";
import MarioGame from "@/components/MarioGame";

export default function Home() {
  return (
    <SmoothScroll>
      {/* ── Video section: pinned with long scroll, GSAP text overlays ── */}
      <VideoStory />

      {/* ── Content sections: flow vertically below the pinned video ── */}
      <div>
        <WritingBlock />
        <WorkEntries />
        <MemoriesStory />
        <ProjectEntries />
        <NotesBlock />
        <ContactBlock />
        <MarioGame />
      </div>
    </SmoothScroll>
  );
}
