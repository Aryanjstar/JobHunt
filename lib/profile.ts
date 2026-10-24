import type { Accomplishment, Project, Role } from "./types";

/**
 * Single source of truth for Desk.
 * Resume bullets for Exotel, AURA, and DevTinder follow the October 2026 LaTeX.
 * Myriox and The Wedding Home are written in that same pattern, from the public repos.
 * Anything marked off-resume is visible here and is never sent to a PDF.
 */

export const contact = {
  name: "Aryan Jaiswal",
  location: "Bengaluru, Karnataka",
  phone: "+91 9794771263",
  email: "aryanjstar3@gmail.com",
  siteLabel: "aryanjaiswal.in",
  site: "https://aryanjaiswal.in",
  linkedinLabel: "linkedin.com/in/aryanjstar",
  linkedin: "https://www.linkedin.com/in/aryanjstar/",
  githubLabel: "github.com/aryanjstar",
  github: "https://github.com/Aryanjstar",
};

export const education = {
  school: "Indian Institute of Information Technology, Dharwad",
  dates: "2022 -- 2026",
  degree: "B.Tech - Computer Science and Engineering",
  detail: "CGPA: 7.76/10",
  place: "Dharwad, Karnataka",
  plain: "B.Tech, Computer Science and Engineering, IIIT Dharwad, 2022–2026, CGPA 7.76/10.",
};

export const preferences = {
  roles: [
    "AI Engineer",
    "Software Development Engineer",
    "Backend Engineer",
    "Member of Technical Staff",
    "Forward Deployed Engineer",
  ],
  location: "Bengaluru, Karnataka",
  workMode:
    "Not locked. Remote, hybrid, and Bengaluru on-site all stay open.",
  employment: "Full-time",
  authorization:
    "Lives and works in India. Do not claim US work authorization.",
  notice: "Not stored. Answer notice period yourself on the form.",
  salary: "Not stored. Do not let a draft invent a number.",
};

export const roles: Role[] = [
  {
    id: "exotel-fde",
    company: "Exotel",
    title: "Forward Deployed Engineer",
    dates: "Jun 2026 – Present",
    url: "https://www.linkedin.com/company/exotel-techcom-private-limited",
    bullets: [
      {
        id: "fde-clients",
        latex:
          "Designed and shipped production voicebots for enterprise clients such as \\textbf{State Bank of India (SBI)}, \\textbf{ICICI Bank}, and \\textbf{Parul University}, owning end-to-end delivery from prompt architecture and tool-call design to KB authoring and go-live.",
        plain:
          "Designed and shipped production voicebots for enterprise clients such as State Bank of India (SBI), ICICI Bank, and Parul University, owning end-to-end delivery from prompt architecture and tool-call design to KB authoring and go-live.",
        letter:
          "At Exotel I design and ship production voicebots for State Bank of India, ICICI Bank, and Parul University, from the prompt and the tool calls through to go-live.",
        asset:
          "ownership of production voicebots for SBI, ICICI Bank, and Parul University",
        keywords: ["voice", "voicebot", "prompt", "tool", "production", "client"],
      },
      {
        id: "fde-autoloop",
        latex:
          "Built \\textbf{AutoLoop}, a self-healing \\textbf{7-stage} agentic prompt optimization pipeline with \\textbf{20+ Cursor agent skills} that orchestrates voicebot chat simulations and iterative prompt refinement across \\textbf{4} LLMs, reducing prompt tuning effort by \\textbf{75\\%}.",
        plain:
          "Built AutoLoop, a self-healing 7-stage agentic prompt optimization pipeline with 20+ Cursor agent skills that orchestrates voicebot chat simulations and iterative prompt refinement across 4 LLMs, reducing prompt tuning effort by 75%.",
        letter:
          "I built AutoLoop, a self-healing 7-stage prompt pipeline with 20+ Cursor agent skills across 4 LLMs, which cut prompt tuning effort by 75%.",
        asset: "a self-healing prompt pipeline I built for real voicebots",
        keywords: ["agent", "llm", "prompt", "eval", "pipeline", "cursor"],
      },
    ],
  },
  {
    id: "exotel-intern",
    company: "Exotel",
    title: "Tech Intern | GenAI",
    dates: "Oct 2025 – June 2026",
    url: "https://www.linkedin.com/company/exotel-techcom-private-limited",
    bullets: [
      {
        id: "intern-argus",
        latex:
          "Solo-built \\textbf{Argus}, a \\textbf{Gemini}-powered voicebot observability platform with a \\textbf{tool-calling} NL interface, \\textbf{VAD}-based latency analysis, \\textbf{HMAC}-signed recording proxy, and \\textbf{Splunk On-Call} automation that cut call debug time from \\textbf{30 min} to seconds.",
        plain:
          "Solo-built Argus, a Gemini-powered voicebot observability platform with a tool-calling NL interface, VAD-based latency analysis, HMAC-signed recording proxy, and Splunk On-Call automation that cut call debug time from 30 min to seconds.",
        letter:
          "I solo-built Argus, a Gemini voicebot observability platform that cut call debug time from 30 min to seconds.",
        asset: "observability tooling I solo-built for production voicebots",
        keywords: ["observability", "gemini", "latency", "voice", "debug", "splunk"],
      },
      {
        id: "intern-bench",
        latex:
          "Architected the \\textbf{Argus} benchmarking engine with \\textbf{Cekura} voice simulations, production transcript replay, automated quality evaluation, and \\textbf{LLM-based multi-dimensional scoring} across latency, tool usage, persona, conversation completion, and domain-specific quality metrics, enabling reliable pre-deployment voicebot validation.",
        plain:
          "Architected the Argus benchmarking engine with Cekura voice simulations, production transcript replay, automated quality evaluation, and LLM-based multi-dimensional scoring across latency, tool usage, persona, conversation completion, and domain-specific quality metrics, enabling reliable pre-deployment voicebot validation.",
        letter:
          "I architected Argus's benchmarking engine, with Cekura voice simulations, production transcript replay, and LLM scoring across latency, tool use, and conversation quality.",
        asset: "a benchmarking engine for voicebots, from simulation to a score",
        keywords: ["eval", "benchmark", "simulation", "quality", "cekura", "scoring"],
      },
      {
        id: "intern-pipeline",
        latex:
          "Hardened the \\textbf{LLM execution pipeline} with a \\textbf{7s} wall-clock cap, parallel tool call guards, \\textbf{TTS} markdown filter, and thinking-leakage guardrail validated on \\textbf{269} production rows; served as \\textbf{DRI} for \\textbf{150K+} monthly calls.",
        plain:
          "Hardened the LLM execution pipeline with a 7s wall-clock cap, parallel tool call guards, TTS markdown filter, and thinking-leakage guardrail validated on 269 production rows; served as DRI for 150K+ monthly calls.",
        letter:
          "I hardened the LLM execution pipeline, including a 7s cap and a thinking-leakage guardrail checked on 269 production rows, and I was DRI for 150K+ monthly calls.",
        asset: "hard guardrails on a live LLM pipeline",
        keywords: ["llm", "guardrail", "production", "reliability", "tts", "latency"],
      },
      {
        id: "intern-nginx",
        latex:
          "Scaled \\textbf{NGINX} WebSocket infra \\textbf{8$\\times$} to \\textbf{1,024} concurrent connections; built \\textbf{Prometheus/Grafana} monitoring with \\textbf{EC2} auto-discovery, \\textbf{5 Ansible} roles for zero-touch provisioning, and a cross-stack recording fix across \\textbf{Python}, \\textbf{Java}, and \\textbf{React}.",
        plain:
          "Scaled NGINX WebSocket infra 8× to 1,024 concurrent connections; built Prometheus/Grafana monitoring with EC2 auto-discovery, 5 Ansible roles for zero-touch provisioning, and a cross-stack recording fix across Python, Java, and React.",
        letter:
          "I scaled the NGINX WebSocket tier 8× to 1,024 concurrent connections, and added Prometheus and Grafana monitoring with 5 Ansible roles.",
        asset: "infrastructure work, from the socket tier to the dashboard",
        keywords: ["nginx", "websocket", "prometheus", "grafana", "ansible", "scale", "java"],
      },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "aura",
    name: "AURA – Agentic Finance AI",
    stack: "Azure OpenAI, Node.js, MongoDB, LangChain, Socket.IO",
    links: [
      { label: "Live", url: "https://aura-finance-ai-in.azurewebsites.net" },
      { label: "GitHub", url: "https://github.com/Aryanjstar/AURA---THE-FINANCE-AI" },
      { label: "Demo", url: "https://www.youtube.com/watch?v=3q4uTliRNr8" },
    ],
    onResume: true,
    lean: { ai: 2 },
    keywords: ["agent", "rag", "mcp", "finance", "azure", "langchain"],
    bullets: [
      {
        id: "aura-agents",
        latex:
          "Developed a \\textbf{multi-agent AI platform} with 5 agents using GPT-4.1 and \\textbf{RAG} (embeddings, cosine similarity), orchestrated via an \\textbf{A2A} shared-context protocol with parallel execution and MCP integration to Fi.Money's live financial API (6 tools).",
        plain:
          "Developed a multi-agent AI platform with 5 agents using GPT-4.1 and RAG (embeddings, cosine similarity), orchestrated via an A2A shared-context protocol with parallel execution and MCP integration to Fi.Money's live financial API (6 tools).",
        letter:
          "AURA is a 5-agent finance platform I built on GPT-4.1 and RAG, with an A2A protocol and MCP integration to Fi.Money's live API (6 tools).",
        asset: "a multi-agent finance platform running on Azure",
        keywords: ["agent", "rag", "mcp", "gpt", "langchain"],
      },
      {
        id: "aura-deploy",
        latex:
          "Deployed on \\textbf{Azure App Service} with \\textbf{MongoDB Atlas} persistence, \\textbf{LangSmith} tracing, and \\textbf{Socket.IO} streaming; dynamic scaling serves simple queries in \\textbf{2 agents} and complex planning in \\textbf{5 parallel}, achieving \\textbf{3--8s} latency at \\textbf{99.9\\%} uptime.",
        plain:
          "Deployed on Azure App Service with MongoDB Atlas persistence, LangSmith tracing, and Socket.IO streaming; dynamic scaling serves simple queries in 2 agents and complex planning in 5 parallel, achieving 3–8s latency at 99.9% uptime.",
        letter:
          "It runs on Azure App Service with MongoDB Atlas and LangSmith, at 3–8s latency and 99.9% uptime.",
        asset: "a system that is deployed, traced, and still up",
        keywords: ["azure", "mongodb", "latency", "tracing"],
      },
    ],
  },
  {
    id: "myriox",
    name: "Myriox",
    stack: "Next.js, FastAPI, LangGraph, Cosmos DB, Azure",
    links: [
      {
        label: "Live",
        url: "https://myriox-web.thankfulsmoke-88e827d4.eastus2.azurecontainerapps.io",
      },
      { label: "GitHub", url: "https://github.com/Aryanjstar/Myriox" },
    ],
    onResume: true,
    lean: { ai: 6, voice: 4, backend: 5, sde: 5, fullstack: 1, frontend: 0 },
    keywords: ["agent", "langgraph", "fastapi", "simulation", "mcp", "azure", "evaluation"],
    note: "Default second project for AI, agent, backend, and member-of-technical-staff roles.",
    bullets: [
      {
        id: "myriox-agents",
        latex:
          "Orchestrated a \\textbf{multi-agent site simulator} with \\textbf{5 persona agents} on \\textbf{LangGraph}, a \\textbf{Next.js} app, and \\textbf{3 FastAPI} services, streaming a live walk over \\textbf{WebSocket} and writing a compliance report that cites \\textbf{ADA} and \\textbf{IFC} clauses.",
        plain:
          "Orchestrated a multi-agent site simulator with 5 persona agents on LangGraph, a Next.js app, and 3 FastAPI services, streaming a live walk over WebSocket and writing a compliance report that cites ADA and IFC clauses.",
        letter:
          "Myriox is a site simulator I built with Next.js, 3 FastAPI services, and LangGraph agents for 5 personas, streaming a live walk and citing ADA and IFC clauses.",
        asset: "a multi-agent simulator that cites the clause, not a vague warning",
        keywords: ["agent", "langgraph", "fastapi", "websocket", "evaluation"],
      },
      {
        id: "myriox-deploy",
        latex:
          "Launched the auth, plan, and simulation services on \\textbf{Azure Container Apps} with \\textbf{Cosmos DB} and bcrypt-hashed \\textbf{JWTs}, and added an \\textbf{MCP} plan server so other tools can read a layout without opening the editor.",
        plain:
          "Launched the auth, plan, and simulation services on Azure Container Apps with Cosmos DB and bcrypt-hashed JWTs, and added an MCP plan server so other tools can read a layout without opening the editor.",
        letter:
          "The auth, plan, and simulation services run on Azure Container Apps with Cosmos DB, and an MCP plan server exposes the layout to other tools.",
        asset: "services deployed on Azure, with an MCP server beside them",
        keywords: ["azure", "mcp", "cosmos", "jwt"],
      },
    ],
  },
  {
    id: "wedding-home",
    name: "The Wedding Home",
    stack: "Next.js, MongoDB, TypeScript",
    links: [
      { label: "Live", url: "https://the-wedding-home.vercel.app" },
      { label: "GitHub", url: "https://github.com/Aryanjstar/the-wedding-home" },
    ],
    onResume: true,
    lean: { fullstack: 10, frontend: 7, sde: 3, backend: 2, ai: 0, voice: 0 },
    keywords: ["next.js", "mongodb", "product", "react", "typescript", "rsvp"],
    note: "Replaces Myriox when the description is product, frontend, or full-stack work.",
    bullets: [
      {
        id: "wedding-product",
        latex:
          "Shipped \\textbf{The Wedding Home}, a family workspace and a no-login guest website for Indian weddings, with per-function \\textbf{RSVP}, household \\textbf{WhatsApp} links, reminder jobs, a rupee spend log, and a shared photo gallery on \\textbf{Next.js} and \\textbf{MongoDB}.",
        plain:
          "Shipped The Wedding Home, a family workspace and a no-login guest website for Indian weddings, with per-function RSVP, household WhatsApp links, reminder jobs, a rupee spend log, and a shared photo gallery on Next.js and MongoDB.",
        letter:
          "The Wedding Home is a family workspace and a no-login guest site I built for Indian weddings, with per-function RSVP, reminders, and a shared gallery, on Next.js and MongoDB.",
        asset: "a whole product, family workspace and guest site, shipped",
        keywords: ["next.js", "mongodb", "product", "react"],
      },
      {
        id: "wedding-themes",
        latex:
          "Styled \\textbf{4} guest-site themes and \\textbf{22} original music pieces, \\textbf{OpenStreetMap} vendor search, and a gallery \\textbf{QR}, and placed the product on \\textbf{Vercel}.",
        plain:
          "Styled 4 guest-site themes and 22 original music pieces, OpenStreetMap vendor search, and a gallery QR, and placed the product on Vercel.",
        letter:
          "It ships with 4 guest-site themes and 22 original music pieces, OpenStreetMap vendor search, and a gallery QR, live on Vercel.",
        asset: "a guest experience with its own themes, music, and map",
        keywords: ["vercel", "product", "frontend"],
      },
    ],
  },
  {
    id: "devtinder",
    name: "DevTinder",
    stack: "JavaScript, React.js, Node.js, Express.js, MongoDB, Azure",
    links: [
      {
        label: "Live",
        url: "https://devtinder-frontend-msdn.politebay-70fefdfd.eastus.azurecontainerapps.io",
      },
      { label: "GitHub", url: "https://github.com/Aryanjstar/DevTinder" },
      { label: "Demo", url: "https://www.youtube.com/watch?v=t0ggxZnVgTQ" },
    ],
    onResume: true,
    lean: { fullstack: 4, backend: 3, frontend: 3, sde: 2, ai: 1 },
    keywords: ["mern", "socket.io", "oauth", "mongodb", "azure", "embeddings"],
    note: "Used when the description is MERN, realtime chat, or payments, ahead of the two flagship projects only if those score lower.",
    bullets: [
      {
        id: "devtinder-match",
        latex:
          "Engineered a scalable \\textbf{MERN}-based developer matching platform using vectorized skill embeddings with \\textbf{ANN} search, streamlined indexing and caching for low-latency retrieval, and built \\textbf{real-time chat} using \\textbf{Socket.IO} for seamless collaboration.",
        plain:
          "Engineered a scalable MERN-based developer matching platform using vectorized skill embeddings with ANN search, streamlined indexing and caching for low-latency retrieval, and built real-time chat using Socket.IO for seamless collaboration.",
        letter:
          "DevTinder is a MERN developer-matching platform I built with skill embeddings, ANN search, and Socket.IO chat.",
        asset: "a matching product with realtime chat",
        keywords: ["mern", "embeddings", "socket.io", "react", "node"],
      },
      {
        id: "devtinder-auth",
        latex:
          "Implemented secure \\textbf{JWT + Google OAuth} authentication, integrated \\textbf{Razorpay} webhooks, deployed backend on \\textbf{Azure} via \\textbf{CI/CD} using \\textbf{Docker}, and built a mobile-first, component-driven responsive UI with \\textbf{Tailwind CSS} for improved UX.",
        plain:
          "Implemented secure JWT + Google OAuth authentication, integrated Razorpay webhooks, deployed backend on Azure via CI/CD using Docker, and built a mobile-first, component-driven responsive UI with Tailwind CSS for improved UX.",
        letter:
          "It uses JWT and Google OAuth, Razorpay webhooks, and a Docker deploy to Azure, with a mobile-first Tailwind UI.",
        asset: "auth, payments, and a Docker deploy on Azure",
        keywords: ["oauth", "jwt", "razorpay", "docker", "azure", "tailwind"],
      },
    ],
  },
  {
    id: "navigator",
    name: "AI Career Navigator",
    stack: "Azure OpenAI, React.js, TypeScript, Flask, Azure AI Search",
    links: [
      { label: "Live", url: "https://ai-career-navigator-backend.azurewebsites.net" },
      { label: "GitHub", url: "https://github.com/Aryanjstar/AI-Career-Navigator" },
    ],
    onResume: true,
    lean: { ai: 3, sde: 2, fullstack: 2 },
    keywords: ["career", "interview", "azure", "rag", "students"],
    note: "Numbers below are from an earlier draft of the resume. They are used only when this project is selected.",
    bullets: [
      {
        id: "navigator-rag",
        latex:
          "Delivered a scalable AI career assistant using \\textbf{Azure OpenAI GPT-4.1} with \\textbf{RAG} (chunking, embeddings, vector store) and dynamic interview generators; validated by \\textbf{100+} users for resume feedback and gap analysis.",
        plain:
          "Delivered a scalable AI career assistant using Azure OpenAI GPT-4.1 with RAG (chunking, embeddings, vector store) and dynamic interview generators; validated by 100+ users for resume feedback and gap analysis.",
        letter:
          "AI Career Navigator is a career assistant I led on Azure OpenAI GPT-4.1 with RAG and interview practice, validated by 100+ users.",
        asset: "a career assistant that won a Microsoft build-a-thon",
        keywords: ["career", "rag", "interview", "azure", "gpt"],
      },
      {
        id: "navigator-scale",
        latex:
          "Reduced user prep time by \\textbf{60\\%} on \\textbf{Azure App Service} with queue workers and \\textbf{Azure AI Search}, holding \\textbf{99\\%} uptime across \\textbf{500+} requests.",
        plain:
          "Reduced user prep time by 60% on Azure App Service with queue workers and Azure AI Search, holding 99% uptime across 500+ requests.",
        letter:
          "The service ran on Azure App Service and Azure AI Search at 99% uptime across 500+ requests, and cut prep time by 60%.",
        asset: "a shipped Azure service with a measured drop in prep time",
        keywords: ["azure", "search", "scale"],
      },
    ],
  },
  {
    id: "portfolio",
    name: "Personal Portfolio",
    stack: "Next.js, TypeScript, Three.js, Tailwind CSS",
    links: [
      { label: "Live", url: "https://aryanjaiswal.in" },
      { label: "GitHub", url: "https://github.com/Aryanjstar/Aryan_Jaiswal_Portfolio_V2" },
    ],
    onResume: true,
    lean: { frontend: 9, fullstack: 3, sde: 1 },
    keywords: ["frontend", "next.js", "three.js", "lighthouse", "react"],
    bullets: [
      {
        id: "portfolio-lighthouse",
        latex:
          "Constructed a full-stack portfolio with \\textbf{Next.js} and \\textbf{Three.js}, scoring \\textbf{95+} on Google Lighthouse for performance and accessibility, and shipped it with \\textbf{GitHub} CI/CD on \\textbf{Netlify} and a custom domain.",
        plain:
          "Constructed a full-stack portfolio with Next.js and Three.js, scoring 95+ on Google Lighthouse for performance and accessibility, and shipped it with GitHub CI/CD on Netlify and a custom domain.",
        letter:
          "My portfolio is a Next.js and Three.js site with 95+ Lighthouse scores, shipped on Netlify with a custom domain.",
        asset: "a portfolio I designed, built, and shipped on my own domain",
        keywords: ["next.js", "lighthouse", "frontend", "three.js"],
      },
      {
        id: "portfolio-3d",
        latex:
          "Modeled the 3D scenes in \\textbf{Three.js} and kept the layout coherent across phone and desktop breakpoints.",
        plain:
          "Modeled the 3D scenes in Three.js and kept the layout coherent across phone and desktop breakpoints.",
        letter:
          "The 3D scenes are Three.js, and the layout holds together on phone and desktop.",
        asset: "interface work I shipped, including the 3D scenes",
        keywords: ["three.js", "frontend", "responsive"],
      },
    ],
  },
  {
    id: "null",
    name: "Null",
    stack: "Voice UI, HTML",
    links: [{ label: "GitHub", url: "https://github.com/Aryanjstar/Null" }],
    onResume: true,
    lean: { voice: 2, ai: 1, frontend: 1 },
    keywords: ["voice", "transaction", "plan"],
    note: "Hacker House Goa 2026. No accuracy figure exists, so none is claimed.",
    bullets: [
      {
        id: "null-plan",
        latex:
          "Translated a spoken send, swap, stake, or approve into a plan card that is allowed or refused, and refused an unlimited approval or an approval to a random address.",
        plain:
          "Translated a spoken send, swap, stake, or approve into a plan card that is allowed or refused, and refused an unlimited approval or an approval to a random address.",
        letter:
          "Null turns a spoken send, swap, stake, or approve into a plan card, and it refuses an unlimited approval.",
        asset: "a voice desk that refuses the dangerous action",
        keywords: ["voice", "transaction"],
      },
      {
        id: "null-local",
        latex:
          "Published the desk as one HTML page for Hacker House Goa 2026, with no server and no API key, and nothing is signed or sent.",
        plain:
          "Published the desk as one HTML page for Hacker House Goa 2026, with no server and no API key, and nothing is signed or sent.",
        letter:
          "It is one page, built for Hacker House Goa 2026, and it never signs or sends a transaction.",
        asset: "a demo that stops before anything is sent",
        keywords: ["voice"],
      },
    ],
  },
  {
    id: "raya",
    name: "Raya Pay",
    stack: "FastAPI, Next.js, PostgreSQL, Azure",
    links: [
      { label: "Live", url: "https://raya-web-da26.azurewebsites.net" },
      { label: "GitHub", url: "https://github.com/Aryanjstar/raya-pay" },
    ],
    onResume: true,
    lean: { fullstack: 4, backend: 4, sde: 3 },
    keywords: ["fastapi", "next.js", "postgresql", "azure", "payments"],
    note: "No user or volume figure is public, so none is claimed.",
    bullets: [
      {
        id: "raya-app",
        latex:
          "Assembled \\textbf{Raya Pay}, a \\textbf{FastAPI} and \\textbf{Next.js} app on \\textbf{PostgreSQL} for paying a credit-card bill, earning reward coins, and reading spending, and ran it on \\textbf{Azure}.",
        plain:
          "Assembled Raya Pay, a FastAPI and Next.js app on PostgreSQL for paying a credit-card bill, earning reward coins, and reading spending, and ran it on Azure.",
        letter:
          "Raya Pay is a FastAPI and Next.js app on PostgreSQL, deployed on Azure, for credit-card bills and a spending view.",
        asset: "a payments app with the bill, the coins, and the spending view split apart",
        keywords: ["fastapi", "next.js", "postgresql", "azure"],
      },
      {
        id: "raya-split",
        latex:
          "Separated bill payment, reward coins, and the spending view so each step has its own screen instead of one crowded form.",
        plain:
          "Separated bill payment, reward coins, and the spending view so each step has its own screen instead of one crowded form.",
        letter: "Bill payment, reward coins, and spending each have their own screen.",
        asset: "a payment flow split into steps a person can follow",
        keywords: ["payments", "next.js"],
      },
    ],
  },
  {
    id: "digit",
    name: "Digit motor FNOL",
    stack: "Bolna, voice agent, claims API",
    links: [{ label: "GitHub", url: "https://github.com/Aryanjstar/digit-motor-fnol-voice-agent" }],
    onResume: true,
    lean: { voice: 2, ai: 1 },
    keywords: ["voice", "claims", "confirmation"],
    note: "A demo. No call-volume figure, so none is claimed.",
    bullets: [
      {
        id: "digit-gate",
        latex:
          "Guarded a motor FNOL voice agent so a claim moves forward only after the caller confirms the details.",
        plain:
          "Guarded a motor FNOL voice agent so a claim moves forward only after the caller confirms the details.",
        letter:
          "The Digit-style FNOL agent files nothing until the caller confirms the claim details.",
        asset: "a voice claim flow that waits for a confirmation",
        keywords: ["voice", "claims"],
      },
      {
        id: "digit-api",
        latex:
          "Connected a \\textbf{Bolna} voice agent to a confirmation-gated claims API instead of writing the claim on the first utterance.",
        plain:
          "Connected a Bolna voice agent to a confirmation-gated claims API instead of writing the claim on the first utterance.",
        letter: "A Bolna voice agent sits on a claims API that stays closed until the confirmation.",
        asset: "a claims API that does not fire early",
        keywords: ["voice"],
      },
    ],
  },
  {
    id: "plant",
    name: "Plant disease classification",
    stack: "Python, CNN, Flask",
    links: [{ label: "GitHub", url: "https://github.com/Aryanjstar/Plant_Disease_Classification" }],
    onResume: true,
    lean: { ai: 3 },
    keywords: ["cnn", "python", "flask", "vision"],
    note: "90%+ is the public repo description. 60,000+ images is self-reported from the portfolio.",
    bullets: [
      {
        id: "plant-train",
        latex:
          "Trained a plant-leaf \\textbf{CNN} to \\textbf{90\\%+} accuracy and wrapped it in a \\textbf{Flask} app for a photo in and a disease label out.",
        plain:
          "Trained a plant-leaf CNN to 90%+ accuracy and wrapped it in a Flask app for a photo in and a disease label out.",
        letter:
          "I trained a plant-disease CNN to 90%+ accuracy and served it from Flask.",
        asset: "a vision model with a measured accuracy and a small web app around it",
        keywords: ["cnn", "flask", "python"],
      },
      {
        id: "plant-data",
        latex:
          "Classified disease on \\textbf{60,000+} leaf images during the Infosys Springboard internship, and kept the result as a label a farmer can read.",
        plain:
          "Classified disease on 60,000+ leaf images during the Infosys Springboard internship, and kept the result as a label a farmer can read.",
        letter: "The training set was 60,000+ leaf images from the Infosys Springboard internship.",
        asset: "a classifier trained on a large public leaf set",
        keywords: ["vision", "python"],
      },
    ],
  },
];

export const bank: { name: string; line: string; url?: string }[] = [
  {
    name: "Joveo",
    line: "AI/ML intern, supply automation. Self-reported: a RAG pipeline with n8n, Gemini embeddings, and pgvector.",
  },
  {
    name: "FreelanceGuard",
    line: "Bangalore AI Hack Day entry for freelancer contracts and collections.",
    url: "https://github.com/Aryanjstar/FreelanceGuard",
  },
  {
    name: "Pawse",
    line: "Dog-collar distress detection, with team Origami Treats.",
    url: "https://github.com/Aryanjstar/Pawse",
  },
  {
    name: "BuzzHive",
    line: "AI social-media analytics. An older resume draft claimed a hackathon final. Left off this resume.",
    url: "https://github.com/Aryanjstar/BuzzHive",
  },
  {
    name: "VaaniGram",
    line: "Indian-language translation with transformer models.",
    url: "https://github.com/Aryanjstar/VaaniGram",
  },
  {
    name: "Cognitive-OS",
    line: "A developer focus tracker. Not used on the one-page resume.",
    url: "https://github.com/Aryanjstar/Cognitive-OS",
  },
];

export const accomplishments: Accomplishment[] = [
  {
    id: "comsnets",
    base: 6,
    keywords: ["research", "paper", "optimization", "algorithm"],
    asset: "a paper I published and presented",
    plain:
      "Research paper author, COMSNETS 2026 (main conference): published and presented A Bid-Driven Optimization Framework for Real-Time Electric Vehicle Charging Scheduling, a 10-min talk in Bengaluru.",
    letter:
      "I published and presented a paper at COMSNETS 2026, A Bid-Driven Optimization Framework for Real-Time Electric Vehicle Charging Scheduling, as a 10-min talk in Bengaluru.",
    latex:
      "\\textbf{Research Paper Author -- \\href{https://www.comsnets.org/accepted_papers.html}{\\textcolor{blue}{COMSNETS 2026}}} (Main Conference): \\textbf{Published \\& Presented} \\textit{A Bid-Driven Optimization Framework for Real-Time Electric Vehicle Charging Scheduling}; presented as a 10-min talk in Bengaluru. \\href{https://drive.google.com/file/d/1BIn6lJDBAFv0X1xafRWhf47dfCS2loqz/view?usp=sharing}{\\textcolor{blue}{[paper]}}",
  },
  {
    id: "buildathon",
    base: 6,
    keywords: ["mentor", "microsoft", "community", "career", "azure"],
    asset: "a Troop Lead win at a Microsoft build-a-thon",
    plain:
      "Microsoft JS AI Build-a-thon: People's Choice and Overall Winner. As Troop Lead, mentored 80+ developers and led AI Career Navigator.",
    letter:
      "As Troop Lead for the Microsoft JS AI Build-a-thon I mentored 80+ developers, and AI Career Navigator won People's Choice and Overall Winner.",
    latex:
      "\\textbf{\\href{https://github.com/Azure-Samples/JS-AI-Build-a-thon/blob/main/README.md}{Microsoft JS AI Build-a-thon}}: \\textbf{People's Choice \\& Overall Winner}. As the \\href{https://www.credly.com/badges/78eec55a-554b-4706-8990-261e20b92fc9/linked_in_profile}{Troop Lead}, I mentored \\textbf{80+} developers and led \\href{https://ai-career-navigator-backend.azurewebsites.net/}{\\textcolor{blue}{AI Career Navigator}}. (\\href{https://techcommunity.microsoft.com/blog/educatordeveloperblog/ai-career-navigator-\\%E2\\%80\\%94-empowering-job-seekers-with-azure-openai/4459774}{\\textcolor{blue}{TechCommunity Blog}})",
  },
  {
    id: "google-hackathon",
    base: 5,
    keywords: ["hackathon", "agent", "mcp", "gemini"],
    asset: "a hackathon final with a product that is still live",
    plain:
      "Finalist, Google Cloud Agentic AI Day Hackathon: led the team to the top 3.5% (2,000/57,000+) with AURA, using Gemini, Node.js, Go, and Fi's MCP server.",
    letter:
      "I led a team to the top 3.5% (2,000 of 57,000+) at the Google Cloud Agentic AI Day hackathon, building AURA with Gemini, Node.js, Go, and Fi's MCP server.",
    latex:
      "\\textbf{\\href{https://drive.google.com/file/d/1pKSY7Rol-mGALg7XRb_uN9UDeuLEH3ZP/view?usp=sharing}{Finalist -- Google Cloud Agentic AI Day Hackathon}}: Led my team to the top \\textbf{3.5\\%} (2,000/57,000+) by building \\href{https://github.com/Aryanjstar/AURA---THE-FINANCE-AI}{\\textcolor{blue}{AURA}}, a multi-agent financial platform using Gemini, Node.js, Go, and \\textbf{Fi's Model Context Protocol (MCP) server}.",
  },
  {
    id: "lor",
    base: 6,
    keywords: ["microsoft", "mentor", "community", "certification"],
    asset: "a Microsoft letter of recommendation and the AI-900",
    plain:
      "Letter of recommendation from Pablo Veramendi, Global Director, Audience Evangelism at Microsoft, for event leadership, workshops, community building, and mentoring. AI-900 certified.",
    letter:
      "I have a letter of recommendation from Pablo Veramendi, Global Director, Audience Evangelism at Microsoft, and I hold the AI-900 certification.",
    latex:
      "\\textbf{LOR (Microsoft)}: Received it from \\href{https://www.linkedin.com/in/pveramendi}{\\textcolor{blue}{Pablo Veramendi}}, Global Director, Audience Evangelism at Microsoft; \\href{https://drive.google.com/file/d/1fPSHlkk8T89CJ55hPlJQ-sDO-dwutkxM/view?usp=sharing}{\\textcolor{blue}{LOR}} recognizes event leadership, workshops, community building and mentoring; \\href{https://learn.microsoft.com/en-in/users/aryanjstar/credentials/e4c4296f82bdf8ad}{\\textcolor{blue}{\\textbf{AI-900 Certified}}}.",
  },
  {
    id: "msa",
    base: 5,
    keywords: ["community", "founder", "mentor", "leadership", "microsoft"],
    asset: "founding and running a student community of real size",
    plain:
      "Founder and former President, MSA IIIT Dharwad: led a 60+ core team and grew MSA Nexus to 500+ members. Only Gold Startup Scout at Microsoft in India.",
    letter:
      "I founded the Microsoft Student Ambassadors chapter at IIIT Dharwad, ran a core team of 60+, and grew MSA Nexus to 500+ members. I am the only Gold Startup Scout at Microsoft in India.",
    latex:
      "\\textbf{Founder \\& Former President -- \\href{https://msa-iiitdwd.vercel.app}{MSA IIIT Dharwad}}: Led and scaled the official community, managed a \\textbf{60+} core team, and grew \\href{http://chat.whatsapp.com/HiE8qUaaIpYJNA5WPuCozD}{\\textcolor{blue}{MSA Nexus}} to \\textbf{500+} members. \\textbf{Only Gold Startup Scout at Microsoft in India.}",
  },
  {
    id: "copilot-days",
    base: 0,
    keywords: ["copilot", "community", "event", "developer advocate", "rag"],
    asset: "practice co-organizing a developer event, not only attending one",
    plain:
      "Co-organized GitHub Copilot Dev Days Bengaluru at the Microsoft Reactor with TechNexus Community. About 200 people in the room. Sessions included Copilot, AI evals, and RAG.",
    letter:
      "I co-organized GitHub Copilot Dev Days Bengaluru with TechNexus at the Microsoft Reactor, with about 200 people in the room and sessions on Copilot, evals, and RAG.",
    latex:
      "\\textbf{Co-organized GitHub Copilot Dev Days Bengaluru} at the Microsoft Reactor with TechNexus Community: about \\textbf{200} people in the room, with sessions on Copilot, AI evals, and RAG.",
  },
];

export const skillLines: {
  label: string;
  fixed: string[];
  flex: string[];
  extra: string[];
}[] = [
  {
    label: "CS Fundamentals & Languages",
    fixed: ["Data Structures", "Algorithms", "OOP", "Operating Systems"],
    flex: ["Java", "Python", "C++", "SQL"],
    extra: ["Go"],
  },
  {
    label: "Frontend",
    fixed: [],
    flex: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
    extra: ["Next.js"],
  },
  {
    label: "Backend & APIs",
    fixed: [],
    flex: [
      "Node.js",
      "Express",
      "FastAPI",
      "Flask",
      "RESTful APIs",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "System Design",
    ],
    extra: [],
  },
  {
    label: "Cloud & DevOps",
    fixed: [],
    flex: ["Azure", "AWS", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"],
    extra: ["Ansible", "NGINX"],
  },
  {
    label: "Testing & Tools",
    fixed: [],
    flex: [
      "Git",
      "GitHub",
      "Bitbucket",
      "Postman",
      "WebSockets",
      "OpenSearch",
      "Prometheus",
      "Grafana",
    ],
    extra: ["Playwright"],
  },
  {
    label: "AI/ML",
    fixed: [],
    flex: [
      "Agentic AI",
      "LLMs",
      "RAG",
      "MCP",
      "LangChain",
      "Prompt Engineering",
      "Vector Embeddings",
      "TensorFlow",
      "PyTorch",
    ],
    extra: ["LangGraph", "Gemini", "LangSmith"],
  },
];

/** Tools a polished letter must not suddenly claim. They are not on the resume. */
export const forbiddenClaims = [
  "kafka",
  "rust",
  "scala",
  "hadoop",
  "spark",
  "django",
  "spring",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "dotnet",
  "c#",
];

export const secondProjectCopy: Record<string, string> = {
  myriox:
    "Myriox stays as the second project. This description is closer to agents, backend, or applied AI than to a consumer product.",
  "wedding-home":
    "The Wedding Home replaces Myriox. This description is product and full-stack work, and that is the project that shows it.",
  devtinder:
    "DevTinder is the second project. The description leans on MERN, realtime, or payments more than on the flagship agent work.",
  navigator:
    "AI Career Navigator is the second project. The description is about careers, learning, or interview prep.",
  portfolio:
    "The portfolio is the second project. The description is interface work.",
};
