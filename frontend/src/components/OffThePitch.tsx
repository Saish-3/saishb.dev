import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOBBIES } from "../content";

export default function OffThePitch() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      const list = listRef.current;
      const counter = counterRef.current;
      if (!section || !list || !counter) return;

      const items = Array.from(list.children) as HTMLLIElement[];
      const lastIndex = items.length - 1;
      let previousActive = -1;

      const update = (progress: number) => {
        const position = progress * lastIndex;
        const activeIndex = Math.round(position);

        items.forEach((item, index) => {
          const distance = Math.abs(index - position);
          const emphasis = 1 - Math.min(distance, 1) * 0.8;
          item.style.opacity = String(Math.max(0.15, emphasis));
          item.style.filter = index === activeIndex ? "brightness(1.2)" : "brightness(1)";
          item.style.transform = `scale(${index === activeIndex ? 1.03 : 1})`;
        });

        if (activeIndex !== previousActive) {
          counter.textContent = `${String(activeIndex + 1).padStart(2, "0")}/${String(items.length).padStart(2, "0")}`;
          previousActive = activeIndex;
        }
      };

      update(0);
      let tween: gsap.core.Tween | undefined;
      tween = gsap.to(list, {
        y: () => -lastIndex * items[0].getBoundingClientRect().height,
        ease: "none",
        onUpdate: () => update(tween?.progress() ?? 0),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          invalidateOnRefresh: true,
          onToggle: (trigger) => {
            counter.style.visibility = trigger.isActive ? "visible" : "hidden";
          },
        },
      });

      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="off-the-pitch" className="offpitch-section">
      <div className="offpitch-stage">
        <div className="offpitch-center">
          <span className="display offpitch-love">i love</span>
          <div className="offpitch-reel-column">
            <span className="display offpitch-reel-sizer" aria-hidden="true">
              {HOBBIES.reduce(
                (widest, hobby) => (hobby.name.length > widest.length ? hobby.name : widest),
                HOBBIES[0].name,
              )}
            </span>
            <ul ref={listRef} className="offpitch-list" aria-label="Hobbies">
              {HOBBIES.map((hobby, index) => (
                <li
                  className="offpitch-item display"
                  key={hobby.name}
                  style={{
                    color: `oklch(0.78 0.2 ${130 + (100 * index) / (HOBBIES.length - 1)})`,
                  }}
                >
                  <span>{hobby.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <span ref={counterRef} className="mono offpitch-counter" aria-live="polite" aria-atomic="true">
          01/07
        </span>
      </div>
    </section>
  );
}
