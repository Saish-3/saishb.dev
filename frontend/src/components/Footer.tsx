import { IDENTITY } from "../content";

export default function Footer() {
  return (
    <footer className="footer" data-testid="footer">
      <p className="mono">03 — SAISH BHUJBAL · BUILT ON THE PITCH</p>
      <div className="social-row">
        <a href={IDENTITY.github} target="_blank" rel="noopener noreferrer">
          GITHUB
        </a>
        <a href={IDENTITY.linkedin} target="_blank" rel="noopener noreferrer">
          LINKEDIN
        </a>
        <a
          href={IDENTITY.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Saish on X"
          data-testid="footer-x-link"
        >
          X
        </a>
      </div>
    </footer>
  );
}
