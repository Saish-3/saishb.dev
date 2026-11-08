import { useEffect, useRef, useState } from "react";

interface MascotProps {
  ballEl: { current: SVGGElement | null };
  flying: boolean;
  goal: boolean;
  shootReady: boolean;
}

/* Layered claymation-style mascot. Eyes are separate layers driven by rAF + refs. */
export default function Mascot({ ballEl, flying, goal, shootReady }: MascotProps) {
  const rootRef = useRef<SVGGElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const eyeLRef = useRef<SVGGElement | null>(null);
  const eyeRRef = useRef<SVGGElement | null>(null);
  const pupilLRef = useRef<SVGGElement | null>(null);
  const pupilRRef = useRef<SVGGElement | null>(null);
  const browLRef = useRef<SVGPathElement | null>(null);
  const browRRef = useRef<SVGPathElement | null>(null);
  const smileRef = useRef<SVGPathElement | null>(null);
  const openRef = useRef<SVGGElement | null>(null);

  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const flagsRef = useRef({ flying, goal, shootReady });
  flagsRef.current = { flying, goal, shootReady };

  useEffect(() => {
    let raf = 0;
    const st = {
      offL: { x: 0, y: 0 },
      offR: { x: 0, y: 0 },
      rot: 0,
      hy: 0,
      brow: 0,
      blink: 1,
      nextBlink: 0,
      blinkT: 0,
      prevFlying: false,
      nodT: -9999,
      bounceT: -9999,
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const loop = (now: number) => {
      const fl = flagsRef.current;

      if (st.prevFlying && !fl.flying) st.nodT = now;
      if (fl.goal && st.bounceT < 0) st.bounceT = now;
      if (!fl.goal) st.bounceT = -9999;
      st.prevFlying = fl.flying;

      /* blink schedule */
      if (!st.nextBlink) st.nextBlink = now + 2800 + Math.random() * 2200;
      if (st.blinkT > 0) {
        const bt = (now - st.blinkT) / 240;
        st.blink = bt >= 1 ? 1 : 1 - Math.sin(Math.min(1, bt) * Math.PI);
        if (bt >= 1) {
          st.blinkT = 0;
          st.nextBlink = now + 3000 + Math.random() * 2200;
        }
      } else if (now > st.nextBlink) {
        st.blinkT = now;
      }

      /* eye tracking */
      const ball = ballEl.current?.getBoundingClientRect();
      const eyes: Array<{ eye: SVGGElement | null; pupil: SVGGElement | null; off: { x: number; y: number } }> = [
        { eye: eyeLRef.current, pupil: pupilLRef.current, off: st.offL },
        { eye: eyeRRef.current, pupil: pupilRRef.current, off: st.offR },
      ];
      let avgDx = 0;
      let avgDy = 0;
      let n = 0;
      for (const { eye, pupil, off } of eyes) {
        if (!eye || !pupil) continue;
        const r = eye.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let tx = 0;
        let ty = 0;
        if (ball && r.width > 0) {
          const dx = ball.left + ball.width / 2 - cx;
          const dy = ball.top + ball.height / 2 - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const maxOff = r.width * 0.175;
          const reach = Math.min(1, dist / 240);
          tx = (dx / dist) * maxOff * reach;
          ty = (dy / dist) * maxOff * reach;
          avgDx += dx;
          avgDy += dy;
          n += 1;
        }
        off.x = lerp(off.x, tx, 0.18);
        off.y = lerp(off.y, ty, 0.18);
        pupil.setAttribute("transform", `translate(${off.x.toFixed(2)} ${off.y.toFixed(2)})`);
      }
      avgDx /= Math.max(1, n);
      avgDy /= Math.max(1, n);

      /* head follows the ball slightly */
      st.rot = lerp(st.rot, clamp(avgDx * 0.012, 3), 0.12);
      st.hy = lerp(st.hy, clamp(avgDy * 0.008, 4), 0.12);

      /* brows: raised in flight, tense before the shot */
      const browTarget = fl.flying ? -5 : fl.shootReady ? 3.5 : 0;
      st.brow = lerp(st.brow, browTarget, 0.14);

      /* eye openness: wide in flight, narrowed before the shot, squeezed on goal */
      let open = 1;
      if (fl.goal) open = 0.22;
      else if (fl.shootReady) open = 0.55;
      else if (fl.flying) open = 1.14;
      let eyeScale = open * (st.blinkT > 0 ? Math.min(1, st.blink) : 1);

      /* mouth: grin on arrival, wide open on goal */
      const sinceNod = now - st.nodT;
      const nod = sinceNod < 420 ? Math.sin((sinceNod / 420) * Math.PI) : 0;
      const grin = nod > 0 && !fl.goal;

      /* breathing + goal bounce */
      const bob = reduced ? 0 : 2 * Math.sin(now / 620);
      let bounce = 0;
      if (!reduced && fl.goal) {
        const bt = now - st.bounceT;
        if (bt < 1300) bounce = Math.abs(Math.sin(bt / 95)) * 9 * (1 - bt / 1300);
      }

      if (headRef.current) {
        const nodY = nod * 4;
        headRef.current.style.transform = `translate(${clamp(avgDx * 0.004, 2).toFixed(2)}px, ${(st.hy + nodY).toFixed(2)}px) rotate(${st.rot.toFixed(2)}deg)`;
      }
      if (rootRef.current)
        rootRef.current.style.transform = `translateY(${(bob - bounce).toFixed(2)}px)`;
      if (browLRef.current)
        browLRef.current.style.transform = `translateY(${st.brow.toFixed(2)}px) rotate(${(-st.brow * 0.5).toFixed(2)}deg)`;
      if (browRRef.current)
        browRRef.current.style.transform = `translateY(${st.brow.toFixed(2)}px) rotate(${(st.brow * 0.5).toFixed(2)}deg)`;
      for (const eye of [eyeLRef.current, eyeRRef.current]) {
        if (eye) {
          eye.style.transform = `scaleY(${eyeScale.toFixed(3)})`;
          eye.style.transformOrigin = "center";
          eye.style.transformBox = "fill-box";
        }
      }
      if (smileRef.current) {
        smileRef.current.style.opacity = fl.goal ? "0" : "1";
        smileRef.current.style.transform = `scaleY(${(grin ? 1.35 : fl.shootReady ? 0.45 : 1).toFixed(2)})`;
        smileRef.current.style.transformBox = "fill-box";
        smileRef.current.style.transformOrigin = "center";
      }
      if (openRef.current) openRef.current.style.opacity = fl.goal ? "1" : "0";

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ballEl]);

  const confetti = Array.from({ length: 16 }, (_, i) => {
    const ang = (i / 16) * Math.PI * 2 + (i % 3) * 0.2;
    const dist = 70 + ((i * 37) % 80);
    return {
      tx: `${Math.round(Math.cos(ang) * dist)}px`,
      ty: `${Math.round(Math.sin(ang) * dist - 60)}px`,
      r: `${((i * 67) % 540) - 270}deg`,
      light: i % 3 === 0,
      delay: `${(i % 5) * 40}ms`,
    };
  });

  return (
    <div className="mascot" data-testid="mascot" aria-hidden="true">
      <div className="mascot-glow" />
      {goal && !reduced && (
        <div className="confetti" data-testid="confetti">
          {confetti.map((c, i) => (
            <span
              key={i}
              style={
                {
                  "--tx": c.tx,
                  "--ty": c.ty,
                  "--r": c.r,
                  animationDelay: c.delay,
                  background: c.light ? "#F2F2EA" : "#C5F36B",
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
      <svg className="mascot-svg" viewBox="0 0 200 212">
        <defs>
          <radialGradient id="mGlow" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(197,243,107,0.16)" />
            <stop offset="100%" stopColor="rgba(197,243,107,0)" />
          </radialGradient>
          <linearGradient id="mSkin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6D3AC" />
            <stop offset="100%" stopColor="#E0A87C" />
          </linearGradient>
          <linearGradient id="mJersey" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D3FA8E" />
            <stop offset="55%" stopColor="#C5F36B" />
            <stop offset="100%" stopColor="#9CCB44" />
          </linearGradient>
          <linearGradient id="mHair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A3626" />
            <stop offset="100%" stopColor="#2E2115" />
          </linearGradient>
          <radialGradient id="mCheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(232,110,90,0.5)" />
            <stop offset="100%" stopColor="rgba(232,110,90,0)" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="92" r="96" fill="url(#mGlow)" />

        <g ref={rootRef}>
          {/* jersey bust */}
          <path
            d="M38 212 L38 186 Q44 152 78 144 L122 144 Q156 152 162 186 L162 212 Z"
            fill="url(#mJersey)"
            stroke="rgba(11,30,20,0.35)"
            strokeWidth="2"
          />
          <path d="M78 144 Q100 158 122 144 L122 152 Q100 166 78 152 Z" fill="#0B1E14" opacity="0.85" />
          <rect x="62" y="150" width="9" height="62" fill="#0B1E14" opacity="0.14" transform="rotate(4 66 181)" />
          <rect x="128" y="150" width="9" height="62" fill="#0B1E14" opacity="0.14" transform="rotate(-4 132 181)" />
          <text
            x="100"
            y="200"
            textAnchor="middle"
            fontFamily="Anton, Impact, sans-serif"
            fontSize="34"
            fill="#0B1E14"
            opacity="0.9"
          >
            00
          </text>
          <path d="M40 178 Q46 154 74 146" stroke="rgba(242,242,234,0.65)" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* neck */}
          <path d="M88 122 L112 122 L112 148 Q100 156 88 148 Z" fill="#DBA276" />

          <g ref={headRef} className="mascot-head">
            {/* ears */}
            <ellipse cx="51" cy="88" rx="9" ry="12" fill="#E0A87C" />
            <ellipse cx="149" cy="88" rx="9" ry="12" fill="#E0A87C" />
            {/* head */}
            <path
              d="M52 84 Q52 24 100 24 Q148 24 148 84 Q148 134 100 136 Q52 134 52 84 Z"
              fill="url(#mSkin)"
            />
            {/* hair — messy textured */}
            <path
              d="M50 66 Q46 16 100 12 Q154 16 150 66 Q146 46 132 50 Q136 30 112 34 Q108 22 96 30 Q78 24 74 44 Q58 40 60 58 Q54 58 50 66 Z"
              fill="url(#mHair)"
            />
            <path d="M70 26 Q84 18 100 22" stroke="rgba(242,242,234,0.28)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M118 24 Q132 30 136 44" stroke="rgba(242,242,234,0.2)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* brows */}
            <path ref={browLRef} d="M62 66 Q72 59 86 64" stroke="#2E2115" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path ref={browRRef} d="M114 64 Q128 59 138 66" stroke="#2E2115" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* eyes */}
            <g ref={eyeLRef}>
              <ellipse cx="76" cy="86" rx="14" ry="15.5" fill="#FFFFFF" stroke="rgba(46,33,21,0.25)" strokeWidth="1.5" />
              <g ref={pupilLRef}>
                <circle cx="76" cy="86" r="7" fill="#7A4A21" />
                <circle cx="76" cy="86" r="3.4" fill="#1A120B" />
                <circle cx="73.6" cy="83" r="2.1" fill="#FFFFFF" />
              </g>
            </g>
            <g ref={eyeRRef}>
              <ellipse cx="124" cy="86" rx="14" ry="15.5" fill="#FFFFFF" stroke="rgba(46,33,21,0.25)" strokeWidth="1.5" />
              <g ref={pupilRRef}>
                <circle cx="124" cy="86" r="7" fill="#7A4A21" />
                <circle cx="124" cy="86" r="3.4" fill="#1A120B" />
                <circle cx="121.6" cy="83" r="2.1" fill="#FFFFFF" />
              </g>
            </g>
            {/* nose */}
            <path d="M98 96 Q102 100 98 103" stroke="#C68B5E" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* cheeks */}
            <ellipse cx="63" cy="104" rx="9" ry="6" fill="url(#mCheek)" />
            <ellipse cx="137" cy="104" rx="9" ry="6" fill="url(#mCheek)" />
            {/* mouth */}
            <path
              ref={smileRef}
              d="M84 110 Q100 124 116 110"
              stroke="#7A3B2E"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <g ref={openRef} style={{ opacity: 0 }}>
              <ellipse cx="100" cy="116" rx="12" ry="14" fill="#5C2E24" />
              <ellipse cx="100" cy="123" rx="7" ry="6" fill="#D96C5F" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
