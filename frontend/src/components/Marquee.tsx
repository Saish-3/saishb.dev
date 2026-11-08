import { MARQUEE_ITEMS } from "../content";

export default function Marquee() {
  return (
    <div
      className="marquee"
      data-testid="marquee"
      aria-label="Technologies I work with"
      role="region"
    >
      <div className="marquee-track">
        {Array.from({ length: 2 }).map((_, g) => (
          <div className="marquee-group" key={g} aria-hidden={g === 1}>
            {MARQUEE_ITEMS.map((t) => (
              <span key={t}>
                {t}
                <i aria-hidden="true">—</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
