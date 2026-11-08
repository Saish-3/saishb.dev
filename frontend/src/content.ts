/* ============================================================
   03 — SAISH BHUJBAL · single source of truth for all copy.
   Edit anything here; the site reads it from this file only.
   Placeholders are marked [EDIT: ...] — replace them with real,
   verifiable facts. Never invent achievements.
   ============================================================ */

export const IDENTITY = {
  name: "Saish Bhujbal",
  number: "03",
  github: "https://github.com/Saish-3",
  linkedin: "https://www.linkedin.com/in/saish-bhujbal-99a56b301/",
  x: "https://x.com/SaishBhujbal",
  email: "saishbhujbal03@gmail.com",
};

export const HERO = {
  headline: ["Every player has a position.", "Every position has a purpose.", "Here's mine."],
};

export interface Player {
  shirt: string;
  role: string;
  title: string;
  x: number;
  y: number;
  story: string;
  tags: string[];
}

/* 11 players, 4-3-3, listed in PASSING ORDER.
   Football roles are storytelling devices, not claims about my real position. */
export const PLAYERS: Player[] = [
  {
    shirt: "01",
    role: "GK",
    title: "The Foundation",
    x: 10,
    y: 50,
    story:
      "Curiosity got me started, and building things taught me how technology really works. ",
    tags: ["CURIOSITY", "ORIGINS"],
  },
  {
    shirt: "02",
    role: "LB",
    title: "The Discipline",
    x: 28,
    y: 14,
    story:
      "Football taught me that consistency beats talent, and I learn and build the same way.",
    tags: ["CONSISTENCY", "FOOTBALL"],
  },
  {
    shirt: "04",
    role: "CB",
    title: "The Engineer",
    x: 25,
    y: 38,
    story:
      "I work in Python, Java, JavaScript, SQL and FastAPI, always chasing sound engineering.",
    tags: ["PYTHON", "FASTAPI"],
  },
  {
    shirt: "05",
    role: "CB",
    title: "The Problem Solver",
    x: 25,
    y: 62,
    story:
      "I break problems down, practise DSA and debug patiently until things click.",
    tags: ["DSA", "DEBUGGING"],
  },
  {
    shirt: "03",
    role: "RB",
    title: "The Explorer",
    x: 28,
    y: 86,
    story:
      "I experiment with AI and new tools to see what's genuinely possible.",
    tags: ["AI", "EXPERIMENTS"],
  },
  {
    shirt: "06",
    role: "DM",
    title: "The Builder",
    x: 43,
    y: 50,
    story:
      "I learn best by building real projects, from idea to working product.",
    tags: ["PROJECTS", "SHIPPING"],
  },
  {
    shirt: "08",
    role: "CM",
    title: "The Collaborator",
    x: 56,
    y: 28,
    story:
      "Open source and teamwork taught me to learn fast from other developers.",
    tags: ["OPEN SOURCE", "TEAMWORK"],
  },
  {
    shirt: "10",
    role: "CM",
    title: "The Experimenter",
    x: 56,
    y: 72,
    story:
      "Hackathons and automation keep me testing ideas quickly and learning from what breaks.",
    tags: ["HACKATHONS", "AUTOMATION"],
  },
  {
    shirt: "11",
    role: "LW",
    title: "The Creator",
    x: 76,
    y: 16,
    story:
      "I like turning rough product ideas into things people might actually use.",
    tags: ["PRODUCT THINKING", "IDEAS"],
  },
  {
    shirt: "07",
    role: "RW",
    title: "The Next Move",
    x: 76,
    y: 84,
    story:
      "I want to join ambitious startups and build products that solve meaningful problems.",
    tags: ["AMBITION", "STARTUPS"],
  },
  {
    shirt: "09",
    role: "ST",
    title: "The Finisher",
    x: 84,
    y: 50,
    story:
      "Ideas matter less than shipping, so I focus on delivering things that work.",
    tags: ["EXECUTION", "DELIVERY"],
  },
];

export interface Project {
  matchNo: string;
  fixture: string;
  score: string;
  name: string;
  tagline: string;
  problem: string;
  stack: string[];
  contribution: string;
  implementation: string;
  challenges: string;
  results: string;
  github: string;
  demo: string;
  image?: string;
  reportDetails?: { label: string; value: string }[];
  certificateUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    matchNo: "MATCH 01",
    fixture: "SAISH BHUJBAL vs UNIVERSITY FINALS",
    score: "1 – 0",
    name: "SGPA",
    tagline: "Smart academic score and study planning platform.",
    problem:
      "During university finals I wanted to know exactly how much I needed to score in my upcoming examinations — based on my internal assessment marks — to achieve my desired CGPA. Repeating those calculations by hand for every possibility was slow and error-prone.",
    stack: ["Web application", "[EDIT: add exact stack]"],
    contribution:
      "I built it myself: modelling credit-weighted SGPA targets, computing the marks required in each pending component, and turning that into a required-marks focus plan with sprints and focus topics.",
    implementation:
      "Enter subjects, credits, internal marks and a target SGPA — the app computes what you need from the still-pending exams, flags when a target can't be reached in a subject alone, and suggests a uniform target with a best-reachable SGPA.",
    challenges: "[EDIT: add the hardest part and how you got through it]",
    results: "[EDIT: add real, verifiable results only]",
    github: "https://github.com/Saish-3/SGPA",
    demo: "https://sgpa-sigma.vercel.app/",
    image: "/project-sgpa-webp.webp",
  },
  {
    matchNo: "MATCH 02",
    fixture: "SAISH BHUJBAL vs PAYMENT FRAUD",
    score: "2 – 1",
    name: "PAYIT",
    tagline: "Real-time UPI fraud detection and payment platform.",
    problem:
      "UPI payments move fast, and so do fraud attempts. Payit pairs a working payments experience with a machine-learning-powered fraud detection layer, so risky transactions get caught instead of trusted.",
    stack: ["Machine learning", "[EDIT: add exact stack]"],
    contribution: "[EDIT: add what you personally built and owned]",
    implementation: "[EDIT: add how it works, end to end]",
    challenges: "[EDIT: add the hardest part and how you got through it]",
    results: "[EDIT: add real, verifiable results only]",
    github: "https://github.com/BankimKamila185/payit-",
    demo: "https://payit-mu.vercel.app/",
    image: "/project-payit.png",
  },
  {
    matchNo: "MATCH 03",
    fixture: "SAISH BHUJBAL vs REAL-WORLD SERVICE",
    score: "3 – 0",
    name: "CHINMAYA VIBHOOTI: SERVICE & INTERNSHIP",
    tagline: "A week of hands-on technical service at Chinmaya Vibhooti Vision Centre.",
    problem: "",
    stack: [],
    contribution: "",
    implementation: "",
    challenges: "",
    results: "",
    github: "",
    demo: "",
    certificateUrl: "/certificates/chinmaya-vibhooti.pdf",
    reportDetails: [
      {
        label: "ORGANISATION",
        value:
          "Chinmaya Vibhooti Vision Centre (a branch of Central Chinmaya Mission Trust), Kolwan, Pune",
      },
      { label: "DURATION", value: "11 July 2026 to 17 July 2026" },
      {
        label: "WHAT I DID (1)",
        value: "Helped with back-end work related to the centre's Fire and Safety protocol.",
      },
      {
        label: "WHAT I DID (2)",
        value: "Created an app for inputting visitor counts at Chinmaya Jeevan Darshan.",
      },
      {
        label: "FEEDBACK RECEIVED",
        value:
          "The centre's letter says I understood my responsibilities in practice, carried out assigned duties sincerely and diligently, and remained open to learning.",
      },
      { label: "SIGNED BY", value: "Trishna Gulrajani, Chief Operating Officer" },
      { label: "TECHNOLOGIES", value: "[EDIT: add the stack you used]" },
      {
        label: "CHALLENGES",
        value: "[EDIT: add one real challenge and what you learned]",
      },
    ],
  },
];

export const MARQUEE_ITEMS = [
  "PYTHON",
  "JAVA",
  "SQL",
  "DOCKER",
  "LLM SYSTEMS",
  "NEXT.JS",
  "SPRING BOOT",
  "THREE.JS",
  "TYPESCRIPT",
  "SYSTEM DESIGN",
];

export const HOBBIES = [
  { name: "Coding" },
  { name: "Calisthenics" },
  { name: "Dance" },
  { name: "Running" },
  { name: "Baking" },
  { name: "Video Editing" },
  { name: "Spirituality" },
];

export const FIXTURE = {
  kicker: "NEXT FIXTURE — MATCHDAY+",
  headline: "THE NEXT GAME IS BIGGER.",
  paragraph:
    "I'm curious to a fault and I finish what I start. The next game is bigger: ambitious products, meaningful problems, teams that move. I'm ready to play.",
  attributes: [
    { label: "CURIOSITY", line: "Asks why before how." },
    { label: "EXECUTION", line: "Ships, then sharpens." },
    { label: "CREATIVITY", line: "Looks for the pass nobody sees." },
    { label: "EXPERIMENTATION", line: "Tests ideas at 2am." },
    { label: "AMBITION", line: "Plays for the bigger fixture." },
  ],
};
