"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Dependency-free page interactions:
//   * shrink the nav on scroll
//   * reveal-on-scroll for .reveal elements
//   * subtle scroll PARALLAX for [data-parallax] elements — each layer drifts at
//     its own rate as you scroll, giving the hero depth without a looping bob.
// Re-runs on route change so a client-side navigation re-observes the new page.
export default function ScrollFX() {
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.getElementById("nav");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // parallax targets: element + its speed factor (px moved per px scrolled)
    const layers = reduce
      ? []
      : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]")).map((el) => ({
          el,
          factor: parseFloat(el.dataset.parallax || "0"),
        }));

    let ticking = false;
    const apply = () => {
      ticking = false;
      const y = window.scrollY;
      nav?.classList.toggle("scrolled", y > 24);
      // only pay for transforms while the hero is roughly on-screen
      if (y < window.innerHeight * 1.3) {
        for (const { el, factor } of layers) {
          el.style.transform = `translate3d(0, ${(y * factor).toFixed(1)}px, 0)`;
        }
      }
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();

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
      layers.forEach(({ el }) => (el.style.transform = ""));
    };
  }, [pathname]);

  return null;
}
