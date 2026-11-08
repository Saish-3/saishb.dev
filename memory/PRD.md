PRD — "03, SAISH BHUJBAL" · Cinematic Football-Themed Interactive Portfolio
Original Problem Statement
Build a production-quality, fully functional, responsive web app: a cinematic, football-themed interactive portfolio for Saish Bhujbal. The visitor enters a night stadium, descends onto the pitch in one continuous drone move, then PLAYS a passing move — 11 clicks, 11 stories — ending in a goal that auto-scrolls to the rest of the site (Match Film, Manager's Room, Touchline, Next Fixture). Must not look like a normal developer portfolio. No invented facts; editable copy in one content file; [EDIT: ...] placeholders where specifics are missing.

Architecture (as built)
React 19 + TypeScript (CRA/craco toolchain of the Emergent platform — Vite was requested but the platform's supervisor-managed dev server runs react-scripts; all source is TS with content.ts honoring the single-copy-file rule).
Tailwind CSS + one global stylesheet (src/index.css) for the stage/pitch/game custom CSS.
No backend needed — purely client-side. FastAPI/Mongo template untouched.
lenis for momentum scrolling; framer-motion for section reveals, story card and GOAL banner; everything on the descent stage driven by one requestAnimationFrame loop mutating refs only (no per-frame React state).
SVG pitch (105:68, horizontal desktop / vertical mobile <768px), players, ball, trail, pass lines, net — all programmatic from content.ts positions.
Key files
src/content.ts — ALL copy (identity, hero, 11 players/stories, 3 project slots, process steps, touchline entries, pull quotes, fixture, marquee, links, email).
src/components/Descent.tsx — 450vh sticky stage: camera (scale 1→3.4 easeInOutCubic, rotateX 18°→0° by p=0.8, 2° drift, velocity blur ≤2px, vignette), timeline (hero fade 0–0.12, crossfade 0.45–0.75 with green wash, line draw 0.60–0.80, player stagger 0.78–0.95, ready ≥0.965), scroll lock until goal/skip, 11-click passing game, shoot → net ripple + floodlight flash + GOAL banner → auto-scroll to Match Film.
src/components/PitchSVG.tsx — pitch geometry, markings (pathLength draw-in), 4-3-3 markers, ball/shadow/trail, pass lines, net.
src/components/{Nav,MatchFilm,Marquee,ManagerRoom,Touchline,NextFixture,Footer,Reveal,Hud,StoryCard}.tsx
public/index.html — Anton / Inter / JetBrains Mono, favicon.svg ("03" pitch mark), meta.
public/stadium.jpg — real 2600px-wide dusk aerial stadium photo (Unsplash).
User personas
Recruiter/founder skimming: can Skip the game and read Match Film + Fixture in seconds.
Curious visitor: plays the 11-pass move, reads each chapter, uses narration.
Core requirements status (all verified on preview)
Cinematic hero with masked line-by-line reveal, MATCHDAY pulse, SCROLL TO ENTER — done.
One continuous 450vh descent, smoothed via rAF (time-compensated lerp), reversible — done.
Passing game: ball starts at GK; 10 passes with curved ball flight, rolling rotation, trail, dashed pass lines that persist; story card per pass; SHOOT on 11th; net ripple, floodlight flash, GOAL banner "SAISH BHUJBAL 1 — 0 SELF-DOUBT"; auto-scroll ≈2.6s — done.
Match Film: 3 editable placeholder match-report cards, expandable, screenshot slots, empty links hidden — done.
Manager's Room: 5-step chalk tactics board with animated loop arrow — done.
Touchline: editorial entries, drop cap, pull quotes, mono stamps, Web Speech narration (play/pause/stop, chapter highlight, graceful fallback) — done.
Next Fixture: floodlight glows, 5 attribute badges, GitHub/LinkedIn (noopener), SEND A THROUGH-BALL animated ball → contact panel with mailto + COPY ("COPIED") — done.
Performance & a11y: reduced-motion fallbacks, aria-live story announcements, aria-labels, focus rings, data-testids, mobile nav — done.
Verified (preview, 2026-11-03)
Desktop 1440×900: hero, descent mid-frame, game-ready full pitch, all 11 stories in order, goal + banner, scroll lock + reverse scroll, sections, contact panel copy button.
Mobile 390×844: hero, vertical pitch with goal at top, game, goal, auto-scroll to Match Film, hamburger menu nav.
No console/page errors in final runs.
Backlog / next
P0: Remaining [EDIT: ...] placeholders — Payit contribution/implementation details, SGPA + Payit exact stacks, challenges and verifiable results; SGPA GitHub link 404s (repo likely private) — make it public or remove the link.
P1: Real project screenshots: DONE (project-sgpa.webp, project-payit.png embedded in Match Film).
P1: SEO/social pass (og image, sitemap) if the site is published.
P2: Sound design (crowd ambience, kick sound) behind a mute-by-default toggle.
P2: 768px-wide tablet polish pass.
Update 2026-11-04 (verified in preview)
Flat pitch layer: pitch/players/ball/lines moved outside the tilted camera into one SVG coordinate system; drift rotation returns to exactly 0 by p=0.8; identity transforms verified at 1366x768, 1440x900, 1920x1080 and 768px.
Replay system: FULL TIME overlay + PLAY AGAIN after goal/Skip; footer REPLAY THE MATCH link; reset clears lines/ball/stories/HUD, jumps to top via lenis immediate + green wash; unlimited replays; sessionStorage lock removed; free scroll after goal with finished pitch + trail shown.
Concise one-line stories (max 2 tags), smaller story card; X link added (contact panel + footer).
No console errors across all runs.
Update 2026-11-04 v2 (verified in preview)
Passing stage redesigned: top band (~26vh) holds the claymation mascot (layered SVG, eyes track the ball via rAF+refs with 0.18 lerp, head follows, blink 3-5s, expressions per game state, goal celebration with bounce + lime confetti) and the typewriter speech block (given useTypewriter hook, blinking cursor, early-click completes instantly, blurred previous-chapter label, white pill tags). Old HUD chips, story card and rectangular PASS button removed.
Football button: 104px SVG ball (pentagon pattern, shading, specular, ground shadow), 11-segment lime progress ring, PASS/SHOOT ribbon with mono counter, float/pulse/hover-spin/squash/kick, disabled slow-spin during flight, keyboard + 48px+ touch target.
Pitch sized by height (66vh) below the band; flat and level; mobile stacks mascot/speech above vertical pitch with ball button at the bottom; Skip top-right on all sizes.