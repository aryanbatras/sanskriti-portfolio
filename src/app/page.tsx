"use client";

import VideoStory from "@/components/VideoStory";
import SmoothScroll from "@/components/SmoothScroll";
import WritingBlock from "@/components/WritingBlock";
import WorkEntries from "@/components/WorkEntries";

export default function Home() {
  return (
    <SmoothScroll>
      <VideoStory />
      <div>
        <WritingBlock />
        <WorkEntries />
      </div>
    </SmoothScroll>
  );
}
