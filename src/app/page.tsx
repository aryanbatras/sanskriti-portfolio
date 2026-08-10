"use client";

import VideoStory from "@/components/VideoStory";
import SmoothScroll from "@/components/SmoothScroll";
import WritingBlock from "@/components/WritingBlock";
import VideoGallery from "@/components/VideoGallery";
import WorkEntries from "@/components/WorkEntries";

export default function Home() {
  return (
    <SmoothScroll>
      <VideoStory />
      <div>
        <WritingBlock />
        <VideoGallery />
        <WorkEntries />
      </div>
    </SmoothScroll>
  );
}
