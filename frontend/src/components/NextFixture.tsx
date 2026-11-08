import { useRef, useState } from "react";
import Reveal from "./Reveal";
import { FIXTURE, IDENTITY } from "../content";

export default function NextFixture() {
  const [flying, setFlying] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  const throughBall = () => {
    setFlying(true);
    window.setTimeout(() => setPanelOpen(true), 700);
    window.setTimeout(() => setFlying(false), 950);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(IDENTITY.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = IDENTITY.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="fixture"
      className="section-shell fixture-section"
      aria-labelledby="fixture-title"
    >
      <div className="fixture-glow a" />
      <div className="fixture-glow b" />
      <Reveal>
        <div className="fixture-card" data-testid="next-fixture">
          <p className="section-kicker mono">{FIXTURE.kicker}</p>
          <h2 id="fixture-title" className="fixture-headline display">
            {FIXTURE.headline}
          </h2>
          <p className="fixture-para">{FIXTURE.paragraph}</p>
          <div className="attr-grid">
            {FIXTURE.attributes.map((a) => (
              <div className="attr-badge" key={a.label} data-testid={`attr-${a.label.toLowerCase()}`}>
                <span className="attr-label">{a.label}</span>
                <p className="attr-line">{a.line}</p>
              </div>
            ))}
          </div>
          <div className="through-wrap">
            {flying && <div className="through-ball" aria-hidden="true" />}
            <button
              type="button"
              className="through-btn"
              data-testid="through-ball-btn"
              onClick={throughBall}
              aria-expanded={panelOpen}
            >
              SEND A THROUGH-BALL
            </button>
          </div>
          <div className={`expander${panelOpen ? " expanded" : ""}`} data-testid="contact-panel">
            <div className="expander-inner">
              <div className="contact-inner">
                <span className="contact-label mono">THE ASSIST — DIRECT LINE</span>
                <div className="email-row">
                  <span className="email-text mono">{IDENTITY.email}</span>
                  <button
                    type="button"
                    className="copy-btn mono"
                    data-testid="copy-email-btn"
                    onClick={copyEmail}
                  >
                    {copied ? "COPIED" : "COPY"}
                  </button>
                  <a
                    className="mail-btn mono"
                    data-testid="mailto-btn"
                    href={`mailto:${IDENTITY.email}`}
                  >
                    OPEN MAIL APP
                  </a>
                </div>
                <div className="social-row">
                  <a
                    className="social-btn mono"
                    data-testid="x-link"
                    href={IDENTITY.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Saish on X"
                  >
                    X — @SaishBhujbal ↗
                  </a>
                  <a
                    className="social-btn mono"
                    data-testid="github-link"
                    href={IDENTITY.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GITHUB — SAISH-3 ↗
                  </a>
                  <a
                    className="social-btn mono"
                    data-testid="linkedin-link"
                    href={IDENTITY.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LINKEDIN — SAISH BHUJBAL ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
