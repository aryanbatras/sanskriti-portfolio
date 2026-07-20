"use client";

import { useState, useEffect } from "react";
import Nameplate from "@/components/Nameplate";
import EditorialTOC from "@/components/EditorialTOC";
import WritingBlock from "@/components/WritingBlock";
import WorkEntries from "@/components/WorkEntries";
import ProjectEntries from "@/components/ProjectEntries";
import NotesBlock from "@/components/NotesBlock";
import TextGames from "@/components/TextGames";
import ContactBlock from "@/components/ContactBlock";
import SmoothScroll from "@/components/SmoothScroll";

const sections = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "notes", label: "Notes" },
  { id: "games", label: "Games" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const reversed = [...sections].reverse();
      for (const s of reversed) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.3) {
            setActiveSection(s.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SmoothScroll>
      <EditorialTOC />

      {/* Mobile navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-paper">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="mono-text text-xs text-ink">
            Sanskriti Gupta
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-nav-btn"
            aria-label="Navigate sections"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
        {mobileOpen && (
          <nav className="px-4 pb-3 bg-paper">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`toc-item text-xs ${
                      activeSection === s.id ? "active" : ""
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div className="lg:pl-48 lg:pr-12 pt-14 lg:pt-0">
        <Nameplate />
        <WritingBlock />
        <div className="section-spacer-wrapper">
          <div className="section-spacer" />
        </div>
        <WorkEntries />
        <div className="section-spacer-wrapper">
          <div className="section-spacer" />
        </div>
        <ProjectEntries />
        <div className="section-spacer-wrapper">
          <div className="section-spacer" />
        </div>
        <NotesBlock />
        <div className="section-spacer-wrapper">
          <div className="section-spacer" />
        </div>
        <TextGames />
        <div className="section-spacer-wrapper">
          <div className="section-spacer" />
        </div>
        <ContactBlock />
      </div>
    </SmoothScroll>
  );
}
