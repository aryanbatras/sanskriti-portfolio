"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "writing", label: "Writing" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "notes", label: "Notes" },
  { id: "games", label: "Games" },
  { id: "contact", label: "Contact" },
];

export default function EditorialTOC() {
  const [active, setActive] = useState("writing");

  useEffect(() => {
    const handleScroll = () => {
      const reversed = [...sections].reverse();
      for (const section of reversed) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.3) {
            setActive(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside className="hidden lg:fixed lg:top-0 lg:left-0 lg:h-full lg:flex lg:flex-col lg:justify-center lg:pl-12 lg:z-40">
      <nav aria-label="Section navigation">
        <ul className="space-y-3">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`toc-item ${active === s.id ? "active" : ""}`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
