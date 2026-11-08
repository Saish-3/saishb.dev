import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PitchSVG, { goalPoint, playerPos } from "./PitchSVG";
import Mascot from "./Mascot";
import SpeechPanel from "./SpeechPanel";
import BallButton from "./BallButton";
import { useTypewriter } from "../hooks/useTypewriter";
import { HERO, PLAYERS } from "../content";
import { gameState, replayBus } from "../lib/game";
import { getLenis, scrollToTarget } from "../lib/lenis";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const quad = (a: XY, c: XY, b: XY, t: number): XY => ({
  x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
  y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
});
type XY = { x: number; y: number };
const d = (v: string) => ({ "--d": v }) as React.CSSProperties;
const pad2 = (n: number) => String(n).padStart(2, "0");

interface Tween {
  active: boolean;
  from: XY;
  to: XY;
  ctrl: XY;
  t0: number;
  dur: number;
  shoot: boolean;
}

export default function Descent() {
  const [ready, setReady] = useState(false);
  const [flying, setFlying] = useState(false);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [matchOver, setMatchOver] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const washRef = useRef<HTMLDivElement | null>(null);
  const washOverlayRef = useRef<HTMLDivElement | null>(null);
  const svgWrapRef = useRef<HTMLDivElement | null>(null);
  const vigRef = useRef<HTMLDivElement | null>(null);
  const streakARef = useRef<HTMLDivElement | null>(null);
  const streakBRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLImageElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const gameLayerRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const netRef = useRef<SVGGElement | null>(null);
  const ballRef = useRef<SVGGElement | null>(null);
  const ballPatternRef = useRef<SVGGElement | null>(null);
  const shadowRef = useRef<SVGEllipseElement | null>(null);

  const markLineRefs = useRef<(SVGElement | null)[]>([]);
  const spotsRef = useRef<SVGGElement | null>(null);
  const passLineRefs = useRef<(SVGLineElement | null)[]>([]);
  const markerRefs = useRef<(SVGGElement | null)[]>([]);
  const markerInnerRefs = useRef<(SVGGElement | null)[]>([]);
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);

  const readyRef = useRef(false);
  const flyingRef = useRef(false);
  const stepRef = useRef(0);
  const verticalRef = useRef(false);
  const reducedRef = useRef(false);
  const spRef = useRef(0);
  const tweenRef = useRef<Tween>({
    active: false,
    from: { x: 0, y: 0 },
    to: { x: 0, y: 0 },
    ctrl: { x: 0, y: 0 },
    t0: 0,
    dur: 0,
    shoot: false,
  });
  const trailHistRef = useRef<XY[]>([]);
  const degRef = useRef(0);
  const dimsRef = useRef({ top: 0, height: 0, max: 1, lockY: 0 });

  const placeBall = useCallback((i: number) => {
    const p = playerPos(i, verticalRef.current);
    ballRef.current?.setAttribute("transform", `translate(${p.x + 13} ${p.y + 9})`);
    shadowRef.current?.setAttribute("transform", `translate(${p.x + 13} ${p.y + 18})`);
  }, []);

  const startTween = useCallback(
    (from: XY, to: XY, shoot: boolean, lineIndex: number) => {
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy) || 1;
      const side = lineIndex % 2 === 0 ? -1 : 1;
      const off = dist * 0.14 * side;
      const ctrl = { x: mx + (-dy / dist) * off, y: my + (dx / dist) * off };
      const dur = reducedRef.current
        ? 1
        : Math.max(700, Math.min(900, 700 + dist * 0.12));
      tweenRef.current = {
        active: true,
        from,
        to,
        ctrl,
        t0: performance.now(),
        dur,
        shoot,
      };
      flyingRef.current = true;
      setFlying(true);
      trailHistRef.current = [];
      degRef.current = 0;
      const line = passLineRefs.current[lineIndex];
      if (line) {
        line.style.stroke = "#C5F36B";
        line.style.strokeWidth = "2.5";
        line.style.strokeDasharray = "1";
        line.style.strokeDashoffset = "1";
        line.style.opacity = "0.9";
      }
    },
    [],
  );

  const goalSequence = useCallback(() => {
    setGoal(true);
    setMatchOver(true);
    gameState.finished = true;
    if (!reducedRef.current) {
      const net = netRef.current;
      if (net) {
        net.classList.add("rip");
        window.setTimeout(() => net.classList.remove("rip"), 1100);
      }
      const fl = flashRef.current;
      if (fl) {
        fl.classList.remove("on");
        void fl.offsetWidth;
        fl.classList.add("on");
      }
    }
    window.setTimeout(() => scrollToTarget("#match-film"), 2600);
  }, []);

  const skip = useCallback(() => {
    setMatchOver(true);
    gameState.finished = true;
    scrollToTarget("#match-film");
  }, []);

  const pass = useCallback(() => {
    if (!readyRef.current || flyingRef.current || stepRef.current >= 11) return;
    if (!typewriterRef.current.done) typewriterRef.current.complete();
    if (stepRef.current === 10) {
      startTween(
        playerPos(10, verticalRef.current),
        goalPoint(verticalRef.current),
        true,
        10,
      );
      return;
    }
    const i = stepRef.current;
    startTween(
      playerPos(i, verticalRef.current),
      playerPos(i + 1, verticalRef.current),
      false,
      i,
    );
  }, [startTween]);

  const playAgain = useCallback(() => {
    const wash = washOverlayRef.current;
    const doReset = () => {
      tweenRef.current.active = false;
      flyingRef.current = false;
      stepRef.current = 0;
      readyRef.current = true;
      degRef.current = 0;
      trailHistRef.current = [];
      spRef.current = 0;
      gameState.finished = false;
      setStep(0);
      setGoal(false);
      setFlying(false);
      setReady(true);
      setMatchOver(false);
      for (const l of passLineRefs.current) {
        if (l) {
          l.style.opacity = "0";
          l.style.stroke = "#C5F36B";
          l.style.strokeWidth = "2.5";
          l.style.strokeDasharray = "1";
          l.style.strokeDashoffset = "1";
        }
      }
      netRef.current?.classList.remove("rip");
      flashRef.current?.classList.remove("on");
      const l = getLenis();
      if (l) l.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };
    if (reducedRef.current || !wash) {
      doReset();
      return;
    }
    wash.style.opacity = "1";
    window.setTimeout(() => {
      doReset();
      window.setTimeout(() => {
        wash.style.opacity = "0";
      }, 140);
    }, 320);
  }, []);

  useEffect(() => {
    replayBus.fn = playAgain;
    return () => {
      replayBus.fn = null;
    };
  }, [playAgain]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const dr = dimsRef.current;
      const rect = section.getBoundingClientRect();
      dr.top = rect.top + window.scrollY;
      dr.height = section.offsetHeight;
      dr.max = Math.max(1, dr.height - window.innerHeight);
      dr.lockY = dr.top + dr.max;
      const v = window.innerWidth < 768;
      if (v !== verticalRef.current) {
        verticalRef.current = v;
        setVertical(v);
      }
    };
    measure();

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);

    const finalizeLine = (li: number) => {
      const line = passLineRefs.current[li];
      if (!line) return;
      line.style.stroke = "#F2F2EA";
      line.style.strokeWidth = "1.5";
      line.style.strokeDasharray = "5 9";
      line.style.strokeDashoffset = "0";
      line.style.opacity = "0.3";
    };

    spRef.current = clamp01((window.scrollY - dimsRef.current.top) / dimsRef.current.max);
    let lastP = spRef.current;
    let lastTime = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      const dr = dimsRef.current;
      const y = window.scrollY;
      const p = clamp01((y - dr.top) / dr.max);

      /* hold scroll on the stage until the goal is scored */
      if (!gameState.finished && y > dr.lockY + 1) {
        const l = getLenis();
        if (l) l.scrollTo(dr.lockY, { immediate: true, force: true });
        else window.scrollTo(0, dr.lockY);
      }

      const dt = Math.min(0.1, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const lerpAlpha = reducedRef.current ? 1 : 1 - Math.pow(0.92, dt * 60);
      spRef.current += (p - spRef.current) * lerpAlpha;
      if (Math.abs(p - spRef.current) < 0.0004) spRef.current = p;
      const sp = spRef.current;

      const inRange =
        y > dr.top - window.innerHeight * 1.2 && y < dr.top + dr.height + window.innerHeight;
      if (inRange) {
        const e = easeInOutCubic;
        const camT = e(clamp01(sp / 0.85));
        const s = reducedRef.current ? 1 : 1 + 2.4 * camT;
        const rx = reducedRef.current ? 0 : 18 * (1 - e(clamp01(sp / 0.8)));
        /* handheld drift: rises then settles back to exactly 0 by p = 0.8 */
        const driftT = clamp01(sp / 0.8);
        const rz = reducedRef.current ? 0 : 2 * Math.sin(driftT * Math.PI);
        const ty = reducedRef.current ? 0 : (1 - camT) * 0.05 * window.innerHeight;

        if (tiltRef.current)
          tiltRef.current.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
        if (worldRef.current) {
          worldRef.current.style.transform = `translateY(${ty.toFixed(1)}px) scale(${s.toFixed(4)})`;
          const blur = reducedRef.current ? 0 : Math.min(2, Math.abs(p - lastP) * 140);
          worldRef.current.style.filter = blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : "none";
        }

        const hT = clamp01(sp / 0.12);
        if (heroRef.current) {
          heroRef.current.style.opacity = String(1 - hT);
          heroRef.current.style.transform = `translateY(${(-60 * hT).toFixed(1)}px)`;
          heroRef.current.style.visibility = hT >= 1 ? "hidden" : "visible";
        }
        if (photoRef.current)
          photoRef.current.style.opacity = String(1 - e(clamp01((sp - 0.5) / 0.3)));

        /* flat pitch layer: opacity crossfade + gentle 1.15 -> 1.0 settle, no camera transforms */
        const svE = e(clamp01((sp - 0.45) / 0.3));
        if (svgWrapRef.current) {
          svgWrapRef.current.style.opacity = String(svE);
          svgWrapRef.current.style.transform = `scale(${(1.15 - 0.15 * svE).toFixed(4)})`;
        }
        if (washRef.current)
          washRef.current.style.opacity = String(
            Math.max(0, 1 - Math.abs(sp - 0.585) / 0.075) * 0.95,
          );

        const lnT = clamp01((sp - 0.6) / 0.2);
        for (const el of markLineRefs.current) if (el) el.style.strokeDashoffset = String(1 - lnT);
        if (spotsRef.current) spotsRef.current.style.opacity = String(lnT);

        for (let i = 0; i < 11; i++) {
          const inner = markerInnerRefs.current[i];
          if (!inner) continue;
          const t = clamp01((sp - (0.78 + i * 0.0145)) / 0.05);
          inner.style.opacity = String(t);
          inner.style.transform = `scale(${(0.4 + 0.6 * easeOutCubic(t)).toFixed(3)})`;
        }

        if (streakARef.current)
          streakARef.current.style.opacity = String(0.55 * (1 - clamp01(sp / 0.6)));
        if (streakBRef.current)
          streakBRef.current.style.opacity = String(0.4 * (1 - clamp01(sp / 0.6)));
        if (vigRef.current) vigRef.current.style.opacity = String(0.25 + 0.45 * e(sp));
        if (gameLayerRef.current)
          gameLayerRef.current.style.opacity = String(clamp01((sp - 0.94) / 0.05));

        const ballO = clamp01((sp - 0.93) / 0.06);
        if (!tweenRef.current.active) {
          if (ballRef.current) ballRef.current.style.opacity = String(ballO);
          if (shadowRef.current) shadowRef.current.style.opacity = String(ballO);
        }

        if (sp > 0.965 && !readyRef.current) {
          readyRef.current = true;
          setReady(true);
        }
      }
      lastP = p;

      /* ball tween */
      const tw = tweenRef.current;
      if (tw.active) {
        const t = tw.dur <= 1 ? 1 : clamp01((now - tw.t0) / tw.dur);
        const tt = tw.shoot ? easeOutCubic(t) : easeInOutQuad(t);
        const pos = quad(tw.from, tw.ctrl, tw.to, tt);
        const next = quad(tw.from, tw.ctrl, tw.to, Math.min(1, tt + 0.02));
        degRef.current += Math.hypot(next.x - pos.x, next.y - pos.y) * 1.6;

        ballRef.current?.setAttribute(
          "transform",
          `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})`,
        );
        ballPatternRef.current?.setAttribute(
          "transform",
          `rotate(${(degRef.current % 360).toFixed(1)})`,
        );
        shadowRef.current?.setAttribute(
          "transform",
          `translate(${pos.x.toFixed(1)} ${(pos.y + 9).toFixed(1)})`,
        );
        if (ballRef.current) ballRef.current.style.opacity = "1";
        if (shadowRef.current) shadowRef.current.style.opacity = "1";

        const hist = trailHistRef.current;
        hist.unshift({ x: pos.x, y: pos.y });
        if (hist.length > 40) hist.length = 40;
        for (let k = 0; k < 6; k++) {
          const el = trailRefs.current[k];
          if (!el) continue;
          const h = hist[k * 3];
          if (h) {
            el.setAttribute("cx", String(h.x));
            el.setAttribute("cy", String(h.y));
            el.style.opacity = String(0.3 * (1 - k / 6));
          } else {
            el.style.opacity = "0";
          }
        }

        const li = tw.shoot ? 10 : stepRef.current;
        const line = passLineRefs.current[li];
        if (line) line.style.strokeDashoffset = String(1 - tt);

        if (t >= 1) {
          tw.active = false;
          flyingRef.current = false;
          setFlying(false);
          finalizeLine(li);
          for (const el of trailRefs.current) if (el) el.style.opacity = "0";
          if (tw.shoot) {
            goalSequence();
          } else {
            stepRef.current += 1;
            setStep(stepRef.current);
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onWheel = (ev: WheelEvent) => {
      if (!gameState.finished && spRef.current > 0.99 && ev.deltaY > 0) ev.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    let touchY = 0;
    const onTouchStart = (ev: TouchEvent) => {
      touchY = ev.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (ev: TouchEvent) => {
      const cy = ev.touches[0]?.clientY ?? 0;
      if (!gameState.finished && spRef.current > 0.99 && cy < touchY) ev.preventDefault();
      touchY = cy;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    const onKey = (ev: KeyboardEvent) => {
      if (ev.target !== document.body) return;
      if (
        (ev.key === "Enter" || ev.key === " ") &&
        readyRef.current &&
        !flyingRef.current &&
        stepRef.current < 11
      ) {
        ev.preventDefault();
        pass();
      } else if (
        !gameState.finished &&
        spRef.current > 0.99 &&
        ["ArrowDown", "PageDown", "End"].includes(ev.key)
      ) {
        ev.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [pass, goalSequence]);

  /* keep the ball glued to its player across re-renders / orientation flips */
  useEffect(() => {
    if (!tweenRef.current.active) placeBall(Math.min(step, 10));
  }, [step, vertical, placeBall]);

  const story = PLAYERS[Math.min(step, 10)];
  const storyText = ready ? story.story : "";
  const tw = useTypewriter(storyText, 28, 150);
  const typewriterRef = useRef(tw);
  typewriterRef.current = tw;
  const displayed = reduced ? storyText : tw.displayed;
  const typeDone = reduced ? true : tw.done;

  const chapterLabel = `${pad2(Math.min(step + 1, 11))}/11 · SHIRT ${story.shirt} · ${story.title.toUpperCase()}`;
  const prevLabel =
    step === 0
      ? "MATCHDAY — KICK-OFF · 4-3-3"
      : `${pad2(step)}/11 · SHIRT ${PLAYERS[step - 1].shirt} · ${PLAYERS[step - 1].title.toUpperCase()}`;

  return (
    <section
      id="the-game"
      ref={sectionRef}
      className="descent"
      aria-label="Stadium descent and interactive passing game"
    >
      <div className="stage">
        <div className="tilt" ref={tiltRef}>
          <div className="world" ref={worldRef}>
            <img
              className="world-photo"
              ref={photoRef}
              src="/stadium.jpg"
              alt="Aerial night view of a floodlit football stadium"
              fetchPriority="high"
            />
            <div className="world-tint" />
            <div className="streak streak-a" ref={streakARef} />
            <div className="streak streak-b" ref={streakBRef} />
            <div className="wash" ref={washRef} />
          </div>
        </div>

        {/* flat game layer: pitch, players, ball and lines share one SVG coordinate system */}
        <div className="svg-wrap" ref={svgWrapRef}>
          <PitchSVG
            vertical={vertical}
            activeIndex={Math.min(step, 10)}
            started={ready}
            goal={goal}
            markLineRefs={markLineRefs}
            spotsRef={spotsRef}
            passLineRefs={passLineRefs}
            markerRefs={markerRefs}
            markerInnerRefs={markerInnerRefs}
            ballRef={ballRef}
            ballPatternRef={ballPatternRef}
            shadowRef={shadowRef}
            trailRefs={trailRefs}
            netRef={netRef}
          />
        </div>

        <div className="vignette" ref={vigRef} />

        <div className="hero-wrap" ref={heroRef}>
          <div className="hero-content">
            <h1 className="hero-name" aria-label="Saish Bhujbal">
              <span>SAISH</span>
              <span className="hero-name-last">BHUJBAL</span>
            </h1>
            <p className="hero-tagline">
              {HERO.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
          <div className="scroll-cue mono" aria-hidden="true">
            <span>SCROLL TO ENTER</span>
            <i />
          </div>
        </div>

        <div
          className="game-layer"
          ref={gameLayerRef}
          style={{ pointerEvents: ready ? "auto" : "none" }}
        >
          <div className="top-band">
            <span className="prev-chapter mono" aria-hidden="true">
              {prevLabel}
            </span>
            <Mascot
              ballEl={ballRef}
              flying={flying}
              goal={goal}
              shootReady={step === 10 && !goal}
            />
            <SpeechPanel
              label={chapterLabel}
              prevLabel={prevLabel}
              displayed={displayed}
              done={typeDone}
              tags={story.tags}
              showCursor={!reduced}
            />
          </div>

          {matchOver && (
            <div className="ft-overlay" data-testid="fulltime-strip">
              <p className="ft-score display">FT 1–0</p>
              <p className="ft-meta mono">11 PASSES · 1 GOAL</p>
            </div>
          )}

          {!matchOver && (
            <button
              type="button"
              className="skip-game mono"
              data-testid="skip-game-link"
              onClick={skip}
            >
              SKIP THE GAME →
            </button>
          )}

          {matchOver ? (
            <button
              type="button"
              className="pass-btn"
              data-testid="play-again-btn"
              onClick={playAgain}
              aria-label="Play again"
            >
              <svg
                className="replay-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
              PLAY AGAIN
            </button>
          ) : (
            <BallButton
              step={step}
              ready={ready}
              flying={flying}
              goal={goal}
              onPass={pass}
            />
          )}

          <AnimatePresence>
            {goal && (
              <motion.div
                className="goal-banner"
                data-testid="goal-banner"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="gb-score mono">SAISH BHUJBAL 1 — 0 SELF-DOUBT</p>
                <h2 className="gb-title display">GOAL!</h2>
                <p className="gb-sub mono">AN 11-PASS MOVE, FINISHED</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="goal-flash" ref={flashRef} />
        <div className="wash-overlay" ref={washOverlayRef} />

        <div className="sr-only" aria-live="polite" data-testid="aria-live-story">
          {ready
            ? step === 0
              ? `Kick-off. Chapter 01 of 11: ${PLAYERS[0].title}. ${PLAYERS[0].story}`
              : step <= 10
                ? `Pass ${step} of 11 complete. Chapter ${pad2(step + 1)}: ${PLAYERS[step].title}. ${PLAYERS[step].story}`
                : "Goal! The move is complete."
            : ""}
        </div>
      </div>
    </section>
  );
}
