import { PLAYERS } from "../content";

type XY = { x: number; y: number };

export const M = 35;
const L = 1050;
const W = 680;

export function playerPos(i: number, vertical: boolean): XY {
  const p = PLAYERS[i];
  const u = (p.x / 100) * L;
  const v = (p.y / 100) * W;
  return vertical ? { x: M + v, y: M + (L - u) } : { x: M + u, y: M + v };
}

export function goalPoint(vertical: boolean): XY {
  return vertical ? { x: M + W / 2, y: M - 14 } : { x: M + L + 14, y: M + W / 2 };
}

const f = (n: number) => n.toFixed(1);
const pt = (p: XY) => `${f(p.x)} ${f(p.y)}`;

export interface PitchRefs {
  markLineRefs: { current: (SVGElement | null)[] };
  spotsRef: { current: SVGGElement | null };
  passLineRefs: { current: (SVGLineElement | null)[] };
  markerRefs: { current: (SVGGElement | null)[] };
  markerInnerRefs: { current: (SVGGElement | null)[] };
  ballRef: { current: SVGGElement | null };
  ballPatternRef: { current: SVGGElement | null };
  shadowRef: { current: SVGEllipseElement | null };
  trailRefs: { current: (SVGCircleElement | null)[] };
  netRef: { current: SVGGElement | null };
}

interface Props extends PitchRefs {
  vertical: boolean;
  activeIndex: number;
  started: boolean;
  goal: boolean;
}

export default function PitchSVG(props: Props) {
  const { vertical, activeIndex, started, goal } = props;
  const P = (u: number, v: number): XY =>
    vertical ? { x: M + v, y: M + (L - u) } : { x: M + u, y: M + v };

  const vb = vertical ? "0 0 750 1120" : "0 0 1120 750";
  const cy = W / 2;

  /* --- markings --- */
  const marking: string[] = [];
  marking.push(
    `M ${pt(P(0, 0))} L ${pt(P(L, 0))} L ${pt(P(L, W))} L ${pt(P(0, W))} Z`,
  );
  marking.push(
    vertical
      ? `M ${pt(P(L / 2, 0))} L ${pt(P(L / 2, W))}`
      : `M ${pt(P(L / 2, 0))} L ${pt(P(L / 2, W))}`,
  );
  for (const side of [0, 1]) {
    const a0 = side === 0 ? 0 : L - 165;
    const a1 = side === 0 ? 165 : L;
    marking.push(
      `M ${pt(P(a0, cy - 201.5))} L ${pt(P(a1, cy - 201.5))} L ${pt(P(a1, cy + 201.5))} L ${pt(P(a0, cy + 201.5))}`,
    );
    const g0 = side === 0 ? 0 : L - 55;
    const g1 = side === 0 ? 55 : L;
    marking.push(
      `M ${pt(P(g0, cy - 91.5))} L ${pt(P(g1, cy - 91.5))} L ${pt(P(g1, cy + 91.5))} L ${pt(P(g0, cy + 91.5))}`,
    );
  }
  marking.push(`M ${pt(P(165, cy - 73.2))} A 91.5 91.5 0 0 1 ${pt(P(165, cy + 73.2))}`);
  marking.push(`M ${pt(P(L - 165, cy - 73.2))} A 91.5 91.5 0 0 0 ${pt(P(L - 165, cy + 73.2))}`);
  marking.push(`M ${pt(P(0, 12))} A 12 12 0 0 0 ${pt(P(12, 0))}`);
  marking.push(`M ${pt(P(L - 12, 0))} A 12 12 0 0 0 ${pt(P(L, 12))}`);
  marking.push(`M ${pt(P(L, W - 12))} A 12 12 0 0 0 ${pt(P(L - 12, W))}`);
  marking.push(`M ${pt(P(12, W))} A 12 12 0 0 0 ${pt(P(0, W - 12))}`);

  const centre = P(L / 2, cy);
  const spotL = P(110, cy);
  const spotR = P(L - 110, cy);

  /* --- grass stripes --- */
  const stripes = Array.from({ length: 15 }, (_, i) => {
    const u0 = i * 70;
    const u1 = u0 + 70;
    return {
      d: `M ${pt(P(u0, 0))} L ${pt(P(u1, 0))} L ${pt(P(u1, W))} L ${pt(P(u0, W))} Z`,
      dark: i % 2 === 1,
    };
  });

  /* --- net --- */
  const gd = 28;
  const gw = 36.6;
  const netU = Array.from({ length: 5 }, (_, k) => L + ((k + 1) * gd) / 5);
  const netV = Array.from({ length: 7 }, (_, k) => cy - gw + ((k + 1) * (gw * 2)) / 7);

  /* --- pass lines --- */
  const passLines = Array.from({ length: 10 }, (_, i) => ({
    a: playerPos(i, vertical),
    b: playerPos(i + 1, vertical),
  }));

  let markIdx = 0;

  return (
    <svg
      className="pitch-svg"
      viewBox={vb}
      role="img"
      aria-label="Tactical football pitch with eleven player positions, attacking towards the goal"
      data-testid="pitch-svg"
    >
      <defs>
        <radialGradient id="pitchlight" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
        </radialGradient>
      </defs>

      <rect
        x={M}
        y={M}
        width={L}
        height={W}
        className="pitch-grass"
      />
      {stripes.map((s, i) => (
        <path key={i} d={s.d} fill={s.dark ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.045)"} />
      ))}
      <rect x={M} y={M} width={L} height={W} fill="url(#pitchlight)" />

      {marking.map((d, i) => (
        <path
          key={i}
          d={d}
          className="pitch-line"
          pathLength={1}
          ref={(el) => {
            props.markLineRefs.current[markIdx + i] = el;
          }}
        />
      ))}
      <circle
        cx={centre.x}
        cy={centre.y}
        r={91.5}
        className="pitch-line"
        pathLength={1}
        ref={(el) => {
          props.markLineRefs.current[marking.length] = el;
        }}
      />
      <g ref={props.spotsRef} style={{ opacity: 0 }}>
        <circle cx={centre.x} cy={centre.y} r={4} fill="rgba(242,242,234,0.9)" />
        <circle cx={spotL.x} cy={spotL.y} r={4} fill="rgba(242,242,234,0.9)" />
        <circle cx={spotR.x} cy={spotR.y} r={4} fill="rgba(242,242,234,0.9)" />
      </g>

      {/* goal + net at the attacking end */}
      <g ref={props.netRef} className={`net ${vertical ? "net-v" : "net-h"}`}>
        <path
          d={`M ${pt(P(L, cy - gw))} L ${pt(P(L + gd, cy - gw))} L ${pt(P(L + gd, cy + gw))} L ${pt(P(L, cy + gw))} Z`}
          fill="rgba(7,27,19,0.55)"
        />
        {netU.map((u, i) => (
          <line
            key={`nu${i}`}
            x1={P(u, cy - gw).x}
            y1={P(u, cy - gw).y}
            x2={P(u, cy + gw).x}
            y2={P(u, cy + gw).y}
            className="net-mesh"
          />
        ))}
        {netV.map((v, i) => (
          <line
            key={`nv${i}`}
            x1={P(L, v).x}
            y1={P(L, v).y}
            x2={P(L + gd, v).x}
            y2={P(L + gd, v).y}
            className="net-mesh"
          />
        ))}
        <line
          x1={P(L, cy - gw).x}
          y1={P(L, cy - gw).y}
          x2={P(L, cy + gw).x}
          y2={P(L, cy + gw).y}
          stroke="rgba(242,242,234,0.95)"
          strokeWidth={3}
        />
      </g>

      {/* tactical pass lines */}
      {passLines.map((pl, i) => (
        <line
          key={`pl${i}`}
          x1={pl.a.x}
          y1={pl.a.y}
          x2={pl.b.x}
          y2={pl.b.y}
          className="pass-line"
          pathLength={1}
          ref={(el) => {
            props.passLineRefs.current[i] = el;
          }}
        />
      ))}

      {/* players */}
      {PLAYERS.map((pl, i) => {
        const pos = playerPos(i, vertical);
        const active = i === activeIndex;
        const dim = started && !active && !goal;
        return (
          <g
            key={pl.shirt}
            data-testid={`player-marker-${i + 1}`}
            ref={(el) => {
              props.markerRefs.current[i] = el;
            }}
            transform={`translate(${pos.x} ${pos.y})`}
          >
            <g
              ref={(el) => {
                props.markerInnerRefs.current[i] = el;
              }}
              className={`marker-inner${active ? " has-ball" : ""}${dim ? " dimmed" : ""}`}
              style={{ opacity: 0, transform: "scale(0)" }}
            >
              <circle className="pulse-ring" r={30} />
              <circle className="badge-halo" r={33} opacity={active ? 1 : 0} />
              <circle className="badge" r={26} />
              <text className="badge-num" y={1}>
                {pl.shirt}
              </text>
              <text className="badge-role" y={47}>
                {pl.role}
              </text>
            </g>
          </g>
        );
      })}

      {/* ball trail */}
      {Array.from({ length: 6 }).map((_, k) => (
        <circle
          key={`t${k}`}
          className="ball-trail"
          r={4.5 - k * 0.5}
          cx={-100}
          cy={-100}
          style={{ opacity: 0 }}
          ref={(el) => {
            props.trailRefs.current[k] = el;
          }}
        />
      ))}

      {/* ball + shadow */}
      <ellipse
        ref={props.shadowRef}
        className="ball-shadow"
        rx={10}
        ry={3.5}
        cx={0}
        cy={0}
        style={{ opacity: 0 }}
        transform="translate(-100 -100)"
      />
      <g ref={props.ballRef} style={{ opacity: 0 }} transform="translate(-100 -100)">
        <g ref={props.ballPatternRef}>
          <circle className="ball-body" r={9} />
          <circle className="ball-dot" r={3} cx={-3} cy={-2} />
          <circle className="ball-dot" r={3} cx={4} cy={1.5} />
          <circle className="ball-dot" r={2.4} cx={0} cy={4.5} />
          <circle className="ball-dot" r={2.2} cx={1} cy={-4.5} />
        </g>
      </g>
    </svg>
  );
}
