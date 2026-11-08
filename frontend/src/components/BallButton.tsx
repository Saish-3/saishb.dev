import { useState } from "react";

interface Props {
  step: number;
  ready: boolean;
  flying: boolean;
  goal: boolean;
  onPass: () => void;
}

const R = 56;
const C = 120;

function segPath(i: number) {
  const a0 = ((-90 + (360 / 11) * i + 2.6) * Math.PI) / 180;
  const a1 = ((-90 + (360 / 11) * (i + 1) - 2.6) * Math.PI) / 180;
  return `M ${C / 2 + R * Math.cos(a0)} ${C / 2 + R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${
    C / 2 + R * Math.cos(a1)
  } ${C / 2 + R * Math.sin(a1)}`;
}

function pent(cx: number, cy: number, r: number, rot = -90) {
  return Array.from({ length: 5 }, (_, k) => {
    const a = ((rot + k * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

export default function BallButton({ step, ready, flying, goal, onPass }: Props) {
  const [kicking, setKicking] = useState(false);
  const shoot = step >= 10;
  const disabled = !ready || flying || goal;

  const click = () => {
    if (disabled) return;
    setKicking(true);
    onPass();
    window.setTimeout(() => setKicking(false), 400);
  };

  return (
    <button
      type="button"
      className={`ball-btn${kicking ? " kicking" : ""}${shoot && !goal ? " shoot" : ""}`}
      data-testid="pass-button"
      onClick={click}
      disabled={disabled}
      aria-label={shoot ? "Shoot, 11 of 11" : `Pass the ball, ${step + 1} of 11`}
    >
      <span className="ball-float">
        <span className="ball-pulse" aria-hidden="true" />
        <svg className="ball-ui" viewBox="0 0 120 134" role="img" aria-hidden="true">
          <defs>
            <radialGradient id="fbShade" cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="62%" stopColor="#EFEFE6" />
              <stop offset="100%" stopColor="#C9C9BC" />
            </radialGradient>
            <clipPath id="fbClip">
              <circle cx="60" cy="58" r="40" />
            </clipPath>
          </defs>

          <ellipse cx="60" cy="126" rx="27" ry="5.5" fill="rgba(0,0,0,0.45)" />

          <circle cx="60" cy={C / 2} r={R} fill="none" stroke="rgba(242,242,234,0.16)" strokeWidth="2.5" />
          {Array.from({ length: 11 }).map((_, i) => (
            <path
              key={i}
              d={segPath(i)}
              fill="none"
              stroke="#C5F36B"
              strokeWidth="3"
              strokeLinecap="round"
              className={i < step ? "ring-seg filled" : "ring-seg"}
            />
          ))}

          <g className="ball-ui-ball">
            <circle cx="60" cy="58" r="40" fill="url(#fbShade)" stroke="#1A1A16" strokeWidth="1.5" />
            <g clipPath="url(#fbClip)" fill="#1A1A16">
              <polygon points={pent(60, 58, 13)} />
              <polygon points={pent(60, 16, 12)} />
              <polygon points={pent(60, 100, 12)} />
              <polygon points={pent(18, 58, 12)} />
              <polygon points={pent(102, 58, 12)} />
              <polygon points={pent(32, 24, 11)} />
              <polygon points={pent(88, 24, 11)} />
              <polygon points={pent(32, 92, 11)} />
              <polygon points={pent(88, 92, 11)} />
            </g>
            <g clipPath="url(#fbClip)" stroke="rgba(26,26,22,0.5)" strokeWidth="1.2" fill="none">
              <line x1="60" y1="45" x2="60" y2="28" />
              <line x1="60" y1="71" x2="60" y2="88" />
              <line x1="49" y1="52" x2="33" y2="46" />
              <line x1="71" y1="52" x2="87" y2="46" />
              <line x1="52" y1="66" x2="41" y2="78" />
              <line x1="68" y1="66" x2="79" y2="78" />
            </g>
            <ellipse cx="45" cy="40" rx="14" ry="9" fill="rgba(255,255,255,0.55)" transform="rotate(-24 45 40)" />
          </g>
        </svg>
      </span>
      <span className="ball-label">
        <span className="ball-action display">{shoot ? "SHOOT" : "PASS"}</span>
        <span className="ball-count mono" data-testid="pass-counter">
          {String(Math.min(step + 1, 11)).padStart(2, "0")}/11
        </span>
      </span>
    </button>
  );
}
