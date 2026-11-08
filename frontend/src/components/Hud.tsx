export default function Hud({ step, goal }: { step: number; goal: boolean }) {
  const passNo = String(Math.min(step + 1, 11)).padStart(2, "0");
  return (
    <div className="hud mono" data-testid="game-hud">
      <span className="hud-chip">4-3-3</span>
      <span className="hud-chip matchday">
        <i className="pulse-dot" />
        MATCHDAY
      </span>
      <span className="hud-chip" data-testid="pass-counter">
        {goal ? "FT 1–0" : `PASS ${passNo}/11`}
      </span>
      <div
        className="segments"
        data-testid="progress-segments"
        role="img"
        aria-label={`${step} of 11 passes played`}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <span key={i} className={i < step ? "seg filled" : "seg"} />
        ))}
      </div>
    </div>
  );
}
