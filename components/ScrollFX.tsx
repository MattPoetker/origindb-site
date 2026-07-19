"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Dependency-free page interactions ported from the original site:
//   * shrink the nav on scroll
//   * reveal-on-scroll for .reveal elements
// Re-runs on route change so a client-side navigation re-observes the new page.
export default function ScrollFX() {
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
