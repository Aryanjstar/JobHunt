export type Sample = {
  id: string;
  label: string;
  company: string;
  role: string;
  jd: string;
};

export const samples: Sample[] = [
  {
    id: "ai",
    label: "AI Engineer",
    company: "Northstar",
    role: "AI Engineer",
    jd: `Northstar is hiring an AI Engineer in Bengaluru, hybrid.
You will design retrieval-augmented agents on Azure, using Python, LangGraph or a similar orchestrator, and a vector store.
The team cares about tool calling, evaluation, latency, and systems that survive contact with real users.
Nice to have: MCP, FastAPI, Docker, and experience taking an LLM feature from a notebook into production.
This is a full-time role for someone who has already shipped, not a research-only seat.`,
  },
  {
    id: "fullstack",
    label: "Full-stack product",
    company: "Fieldnote",
    role: "Full Stack Engineer",
    jd: `Fieldnote builds software for small teams who live in the browser.
We want a Full Stack Engineer comfortable with Next.js, React, TypeScript, and MongoDB.
You will own a feature from the empty ticket to a person using it: forms, auth, background jobs, and a calm UI.
Product sense matters. You should be happy writing the page and the API behind it.
Hybrid in Bengaluru, or remote inside India.`,
  },
  {
    id: "voice",
    label: "Voice AI",
    company: "Harbor",
    role: "Voice AI Engineer",
    jd: `Harbor runs voice agents for support teams.
The Voice AI Engineer owns latency, tool use, and the observability around a live call.
We use Gemini and other LLMs, evaluate conversations before they ship, and debug production voicebots when a call goes wrong.
You should be comfortable with speech pipelines, transcripts, and a dashboard that tells the truth about a bad turn.
On-site in Bengaluru three days a week.`,
  },
  {
    id: "sde",
    label: "Backend SDE",
    company: "Ledger",
    role: "Software Development Engineer",
    jd: `Ledger is hiring a Software Development Engineer for backend systems.
The stack is Java, PostgreSQL, and HTTP APIs, with Kafka for the event path and Redis where it earns its place.
You will design services that stay correct under load, write tests, and review other people's designs.
Distributed systems and SQL are the day job. Kubernetes is how we ship.
Full-time, hybrid Bengaluru.`,
  },
  {
    id: "frontend",
    label: "Frontend",
    company: "Canvas",
    role: "Frontend Engineer",
    jd: `Canvas is hiring a Frontend Engineer.
You will build product UI in React, Next.js, and TypeScript, with serious attention to CSS, accessibility, and Lighthouse.
The design is already opinionated. We need someone who can implement it without inventing a second design system.
TypeScript is required. A portfolio we can click is useful.
Remote within India.`,
  },
  {
    id: "mts",
    label: "Member of Technical Staff",
    company: "Kindling",
    role: "Member of Technical Staff",
    jd: `Kindling is hiring a Member of Technical Staff to work on LLM product quality.
You will build evaluation harnesses, trace bad answers, and ship small model features in Python.
RAG, tool calling, and a habit of reading transcripts are the job.
We are a small team. The person who writes the eval also talks to the user who hit the bug.
Hybrid Bengaluru.`,
  },
  {
    id: "career",
    label: "Career product",
    company: "Campus",
    role: "AI Engineer",
    jd: `Campus helps students prepare for interviews.
We want an AI Engineer who has built career guidance or interview prep with Azure OpenAI, RAG, and a simple web app.
You will improve resume feedback, mock interviews, and the retrieval that sits under both.
The user is a student. Clarity matters more than a clever demo.
Remote, India.`,
  },
  {
    id: "mern",
    label: "MERN product",
    company: "Pairing",
    role: "Full Stack Engineer",
    jd: `Pairing is a MERN product with realtime chat for developers.
The Full Stack Engineer will work in React, Node.js, Express, and MongoDB, with Socket.IO, JWT, and Google OAuth.
Razorpay is how the product charges. Docker on Azure is how it ships.
This is product work with payments and chat, not a model team.`,
  },
  {
    id: "staff",
    label: "Staff, 10 years",
    company: "Ridge",
    role: "Staff Software Engineer",
    jd: `Ridge is hiring a Staff Software Engineer.
You have 10+ years of experience, have been a principal-level technical lead, and have run multi-team platform programs.
The stack includes Kafka, Rust, and Kubernetes. US citizenship or existing work authorization is required. No sponsorship.
On-site in Seattle.`,
  },
];
