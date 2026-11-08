export default function SpeechPanel({
  label,
  prevLabel,
  displayed,
  done,
  tags,
  showCursor,
}: {
  label: string;
  prevLabel: string;
  displayed: string;
  done: boolean;
  tags: string[];
  showCursor: boolean;
}) {
  return (
    <div className="speech-area" aria-live="off">
      <span className="prev-chapter mono" aria-hidden="true">
        {prevLabel}
      </span>
      <div className="speech-block" data-testid="speech-block" key={label}>
        <span className="speech-label mono">{label}</span>
        <p className="speech-text">
          {displayed}
          {showCursor && !done && <span className="type-cursor" aria-hidden="true" />}
        </p>
        <div className={`speech-tags${done ? " show" : ""}`}>
          {done && tags.slice(0, 2).map((t) => (
            <span className="pill mono" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
