import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Reveal from "./Reveal";
import { PROJECTS, Project } from "../content";

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const [open, setOpen] = useState(false);
  const [certificateAvailable, setCertificateAvailable] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);
  const certificateButtonRef = useRef<HTMLButtonElement>(null);
  const certificateDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!p.certificateUrl) return;

    let active = true;
    fetch(p.certificateUrl, { method: "HEAD" })
      .then((response) => {
        const contentType = response.headers.get("content-type") ?? "";
        if (active) {
          setCertificateAvailable(response.ok && !contentType.includes("text/html"));
        }
      })
      .catch(() => {
        if (active) setCertificateAvailable(false);
      });

    return () => {
      active = false;
    };
  }, [p.certificateUrl]);

  useEffect(() => {
    if (!certificateOpen || !p.certificateUrl) return;

    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const certificateButton = certificateButtonRef.current;
    const closeButton = certificateDialogRef.current?.querySelector<HTMLButtonElement>(
      ".certificate-close",
    );
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButton?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCertificateOpen(false);
        return;
      }

      if (event.key !== "Tab" || !certificateDialogRef.current) return;
      const focusable = Array.from(
        certificateDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), object, iframe, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (focusable.length === 0) {
        event.preventDefault();
        certificateDialogRef.current.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      } else if (!certificateDialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      certificateButton?.focus();
    };
  }, [certificateOpen, p.certificateUrl]);

  const reportRows = p.reportDetails ? (
    p.reportDetails.map((detail) => (
      <div className="report-row" key={detail.label}>
        <span className="report-label mono">{detail.label}</span>
        <p className="report-value">{detail.value}</p>
      </div>
    ))
  ) : (
    <>
      <div className="report-row">
        <span className="report-label mono">PROBLEM STATEMENT</span>
        <p className="report-value">{p.problem}</p>
      </div>
      <div className="report-row">
        <span className="report-label mono">TECHNOLOGIES</span>
        <div className="stack-chips mono">
          {p.stack.map((stack) => (
            <span key={stack}>{stack}</span>
          ))}
        </div>
      </div>
      <div className="report-row">
        <span className="report-label mono">MY CONTRIBUTION</span>
        <p className="report-value">{p.contribution}</p>
      </div>
      <div className="report-row">
        <span className="report-label mono">IMPLEMENTATION</span>
        <p className="report-value">{p.implementation}</p>
      </div>
      <div className="report-row">
        <span className="report-label mono">CHALLENGES</span>
        <p className="report-value">{p.challenges}</p>
      </div>
      <div className="report-row">
        <span className="report-label mono">RESULTS</span>
        <p className="report-value">{p.results}</p>
      </div>
    </>
  );

  return (
    <>
      <article className="project-card" data-testid={`project-card-${i + 1}`}>
        <div className="scoreboard mono">
          <span className="ft-badge">FT</span>
          <span>{p.matchNo}</span>
          <span className="fixture-line">{p.fixture}</span>
          <span className="score-line">{p.score}</span>
        </div>
        <div className="project-body">
          <h3 className="project-name display">{p.name}</h3>
          <p className="project-tagline">{p.tagline}</p>
          <button
            type="button"
            className="report-toggle mono"
            data-testid={`project-toggle-${i + 1}`}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? "CLOSE REPORT" : "OPEN MATCH REPORT"}
          </button>
          <div
            className={`expander${open ? " expanded" : ""}`}
            data-testid={`project-panel-${i + 1}`}
          >
            <div className="expander-inner">
              <div className="report-grid">
                {reportRows}
                <div className="shot-slot">
                  {p.image ? (
                    <img src={p.image} alt={`${p.name} screenshot`} loading="lazy" />
                  ) : (
                    <span className="mono">SCREENSHOT SLOT — PITCH-LINE PATTERN</span>
                  )}
                </div>
                {(p.github || p.demo || (p.certificateUrl && certificateAvailable)) && (
                  <div className="project-links">
                    {p.github && (
                      <a
                        className="project-link mono"
                        data-testid={`project-link-github-${i + 1}`}
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GITHUB ↗
                      </a>
                    )}
                    {p.demo && (
                      <a
                        className="project-link mono"
                        data-testid={`project-link-demo-${i + 1}`}
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LIVE DEMO ↗
                      </a>
                    )}
                    {p.certificateUrl && certificateAvailable && (
                      <button
                        ref={certificateButtonRef}
                        type="button"
                        className="project-link certificate-button mono"
                        data-testid="project-link-certificate-3"
                        onClick={() => setCertificateOpen(true)}
                      >
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M4 1.5h5l3 3v10H4zM9 1.5v3h3M6 8h4M6 10.5h4" />
                        </svg>
                        VIEW CERTIFICATE
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
      {certificateOpen &&
        p.certificateUrl &&
        createPortal(
          <div
            className="certificate-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setCertificateOpen(false);
            }}
          >
            <div
              ref={certificateDialogRef}
              className="certificate-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="certificate-title"
              tabIndex={-1}
            >
              <div className="certificate-dialog-header">
                <h2 id="certificate-title" className="mono">
                  CERTIFICATE OF SERVICE
                </h2>
                <button
                  type="button"
                  className="certificate-close mono"
                  aria-label="Close certificate"
                  onClick={() => setCertificateOpen(false)}
                >
                  CLOSE ×
                </button>
              </div>
              <object
                className="certificate-preview"
                data={p.certificateUrl}
                type="application/pdf"
                aria-label="Chinmaya Vibhooti service certificate PDF"
              >
                <p>
                  PDF preview unavailable.{" "}
                  <a href={p.certificateUrl} target="_blank" rel="noopener noreferrer">
                    Open the certificate
                  </a>
                  .
                </p>
              </object>
              <div className="certificate-actions">
                <a href={p.certificateUrl} target="_blank" rel="noopener noreferrer">
                  OPEN IN NEW TAB ↗
                </a>
                <a href={p.certificateUrl} download>
                  DOWNLOAD ↓
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function MatchFilm() {
  return (
    <section id="match-film" className="section-shell" aria-labelledby="match-film-title">
      <Reveal>
        <p className="section-kicker mono">FULL-TIME — AFTER THE GOAL</p>
        <h2 id="match-film-title" className="section-title display">
          MATCH FILM
        </h2>
        <p style={{ color: "var(--fog)", maxWidth: "58ch", margin: 0, fontSize: 14.5, lineHeight: 1.7 }}>
          Every project is a fixture: a problem to be beaten over ninety minutes. Open a match
          report to read the tape.
        </p>
      </Reveal>
      <div className="project-grid">
        {PROJECTS.map((project, index) => (
          <Reveal key={project.matchNo} delay={index * 0.08}>
            <ProjectCard p={project} i={index} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
