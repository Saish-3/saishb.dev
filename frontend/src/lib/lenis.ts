import Lenis from "lenis";

let lenis: Lenis | null = null;
let rafId = 0;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
  return lenis;
}

export function destroyLenis() {
  cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function scrollToTarget(target: string | HTMLElement, immediate = false) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { duration: immediate ? 0 : 1.8 });
  } else {
    (el as HTMLElement).scrollIntoView({
      behavior: immediate ? "auto" : "smooth",
      block: "start",
    });
  }
}
