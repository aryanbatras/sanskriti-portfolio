"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { HomeIcon } from "@/components/ui/icons/home";
import { HeartIcon } from "@/components/ui/icons/heart";
import { FolderGit2Icon } from "@/components/ui/icons/folder-git-2";
import { BriefcaseBusinessIcon } from "@/components/ui/icons/briefcase-business";
import { AtSignIcon } from "@/components/ui/icons/at-sign";

const dockItems = [
  { path: "/", label: "Home", Icon: HomeIcon },
  { path: "/memories", label: "Memories", Icon: HeartIcon },
  { path: "/projects", label: "Projects", Icon: FolderGit2Icon },
  { path: "/skills", label: "Skills", Icon: BriefcaseBusinessIcon },
  { path: "/contact", label: "Contact", Icon: AtSignIcon },
] as const;

export default function NavigationDock() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const prevPathRef = useRef(pathname);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [scrolledPastVideo, setScrolledPastVideo] = useState(false);
  const videoSectionEndRef = useRef<number>(2000);

  // Visibility: always true on non-home, scroll-based on home
  const visible = isHome ? scrolledPastVideo : true;

  // Measure where the pinned video section ends (home only)
  useEffect(() => {
    if (!isHome) return;
    const measure = () => {
      const videoSection = document.getElementById("video");
      if (!videoSection) return;
      const rect = videoSection.getBoundingClientRect();
      videoSectionEndRef.current = rect.top + window.scrollY + 2000;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isHome]);

  // Scroll listener for home page
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const wh = window.innerHeight;
      setScrolledPastVideo(scrollY > videoSectionEndRef.current - wh * 0.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Reset scroll state when navigating away from home
  useEffect(() => {
    if (prevPathRef.current === "/" && !isHome) {
      setScrolledPastVideo(false);
    }
    prevPathRef.current = pathname;
  }, [isHome, pathname]);

  const navigate = useCallback(
    (path: string) => {
      if (path === pathname) return;
      if (path === "/contact") {
        window.location.href = path;
        return;
      }
      router.push(path);
    },
    [pathname, router]
  );

  const activeIdx = useMemo(
    () => dockItems.findIndex((item) => item.path === pathname),
    [pathname]
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="dock"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 sm:bottom-6 md:bottom-8"
        >
          <Dock iconSize={52} iconMagnification={72} iconDistance={120}>
            {dockItems.map(({ path, label, Icon }, idx) => {
              const isActive = idx === activeIdx;
              const isHovered = hoveredIdx === idx;

              return (
                <DockIcon
                  key={path}
                  onClick={() => navigate(path)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative"
                >
                  <motion.div
                    animate={
                      isActive
                        ? { color: "#E11D48" }
                        : isHovered
                          ? { color: "#1A1A1A" }
                          : { color: "#888888" }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={26} />
                  </motion.div>

                  {/* White tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                      >
                        <div className="relative bg-white px-3 py-1.5 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-black/[0.06]">
                          <span className="text-ink text-xs font-mono tracking-wider uppercase font-medium">
                            {label}
                          </span>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-black/[0.06] rotate-45" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </DockIcon>
              );
            })}
          </Dock>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
