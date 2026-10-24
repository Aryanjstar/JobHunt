import { contact, education, roles } from "./profile";
import type { Letter, Selection } from "./types";

export function texEscape(value: string): string {
  return value
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function texUrl(url: string): string {
  return url.replace(/%/g, "\\%").replace(/#/g, "\\#").replace(/&/g, "\\&").replace(/_/g, "\\_");
}

function projectHeading(name: string, links: { label: string; url: string }[], stack: string): string {
  const bits = [`\\textbf{${texEscape(name)}}`];
  for (const link of links) {
    bits.push(`\\href{${texUrl(link.url)}}{\\color{blue}${texEscape(link.label)}}`);
  }
  bits.push(`\\emph{${texEscape(stack)}}`);
  return bits.join(" $|$ ");
}

function roleHeading(company: string, title: string, dates: string, url: string): string {
  return `\\textbf{\\href{${texUrl(url)}}{${texEscape(company)}}} -- \\textit{${texEscape(title)}} \\hfill \\textbf{${texEscape(dates)}}`;
}

function initialCap(word: string): string {
  const chars = Array.from(word);
  const first = chars[0] ?? "";
  const rest = chars.slice(1).join("");
  return `\\initialcap{16pt}{${texEscape(first)}}\\initialcap{14pt}{${texEscape(rest)}}`;
}

function roleBlock(lines: string[]): string {
  return lines
    .map((line) => {
      const words = line.split(/\s+/).map(initialCap).join(" ");
      return `    {\\textcolor{nameblue}{\\textbf{${words}}}} \\\\`;
    })
    .join("\n");
}

const COMMANDS = String.raw`
\newcommand{\resumeItem}[1]{\item \small{#1}}
\newcommand{\resumeSubheading}[4]{%
  \item
  \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
    \textbf{#1} & \textbf{#2} \\
    \textit{\small #3} & \textit{\small #4} \\
  \end{tabular*}
  \vspace{-5pt}
}
\newcommand{\resumeProjectHeading}[2]{%
  \item
  \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
    \small \textbf{#1} & \textit{\small #2} \\
  \end{tabular*}
  \vspace{-5pt}
}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}[leftmargin=0.1in]}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}
`;

export function resumeTex(selection: Selection): string {
  const fde = roles[0];
  const intern = roles[1];
  const skillBlock = selection.skills
    .map((line) => `    \\textbf{${texEscape(line.label)}}: ${line.tokens.map(texEscape).join(", ")} \\\\[1pt]`)
    .join("\n");
  const accomplishmentBlock = selection.accomplishments
    .map((item) => `    ${item.latex} \\\\[2pt]`)
    .join("\n");
  const projectBlock = selection.projects
    .map((project) => {
      const bullets = (selection.projectBullets[project.id] ?? [])
        .map((bullet) => `    \\resumeItem{${bullet.latex}}`)
        .join("\n");
      return `\\resumeProjectHeading
  {${projectHeading(project.name, project.links, project.stack)}}
  {}
\\vspace{-1pt}
\\resumeItemListStart
${bullets}
\\resumeItemListEnd`;
    })
    .join("\n\n");

  const job = (role: typeof fde, bullets: { latex: string }[]) => `\\item
${roleHeading(role.company, role.title, role.dates, role.url)}
\\vspace{-6pt}
\\resumeItemListStart
${bullets.map((bullet) => `\\resumeItem{${bullet.latex}}`).join("\n")}
\\resumeItemListEnd`;

  return String.raw`\documentclass[letterpaper,10.5pt]{article}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}
\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}
\titleformat{\section}{\vspace{-6pt}\scshape\raggedright\large}{}{0em}{}[\color{black}\titlerule\vspace{-6pt}]
${COMMANDS}
\begin{document}
\begin{center}
    {\Huge \scshape ${texEscape(contact.name)}} \\ \vspace{2pt}
    ${texEscape(contact.location)} \\ \vspace{2pt}
    \normalsize
    ${texEscape(contact.phone)} $|$
    \href{mailto:${texUrl(contact.email)}}{${texEscape(contact.email)}} $|$
    \href{${texUrl(contact.site)}}{${texEscape(contact.siteLabel)}} $|$
    \href{${texUrl(contact.linkedin)}}{${texEscape(contact.linkedinLabel)}} $|$
    \href{${texUrl(contact.github)}}{${texEscape(contact.githubLabel)}}
    \vspace{-3.5pt}
\end{center}

\vspace{-12pt}
\section{\textbf{EDUCATION}}
  \resumeSubHeadingListStart
    \resumeSubheading
      {${texEscape(education.school)}}{${education.dates}}
      {${texEscape(education.degree)} \textbar\ \textnormal{${texEscape(education.detail)}}}{${texEscape(education.place)}}
  \resumeSubHeadingListEnd

\vspace{-4pt}
\section{\textbf{WORK EXPERIENCE}}
\resumeSubHeadingListStart
${job(fde, selection.fde)}
${job(intern, selection.intern)}
\resumeSubHeadingListEnd

\vspace{-7pt}
\section{\textbf{PROJECTS}}
\resumeSubHeadingListStart
${projectBlock}
\resumeSubHeadingListEnd

\vspace{-7pt}
\section{\textbf{TECHNICAL SKILLS}}
\begin{itemize}[leftmargin=0.15in, label={}]
  \small{\item{
${skillBlock}
  }}
\end{itemize}

\vspace{-10pt}
\section{\textbf{ACCOMPLISHMENTS \& LEADERSHIP}}
\begin{itemize}[leftmargin=0.15in, label={}]
\small{\item{
${accomplishmentBlock}
}}
\end{itemize}
\end{document}
`;
}

export function coverTex(letter: Letter): string {
  const paragraphs = letter.paragraphs
    .map((paragraph) => `${texEscape(paragraph)}\n\n\\vspace{0.7em}\n`)
    .join("\n");
  return String.raw`\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.75in]{geometry}
\usepackage{xcolor}
\usepackage{hyperref}
\usepackage{helvet}
\renewcommand{\familydefault}{\sfdefault}
\definecolor{nameblue}{RGB}{0, 82, 204}
\definecolor{datecolor}{RGB}{100, 100, 100}
\pagenumbering{gobble}
\newcommand{\initialcap}[2]{{\fontsize{#1}{#1}\selectfont #2}}
\begin{document}
\noindent
\begin{minipage}[t]{0.32\textwidth}
    \vspace{0pt}
    {\Huge \textbf{\initialcap{30pt}{A}\initialcap{28pt}{RYAN}}}
\end{minipage}
\hfill
\begin{minipage}[t]{0.63\textwidth}
    \vspace{0pt}
    \rule{\linewidth}{1.2pt} \\[1em]
    {\textcolor{datecolor}{${texEscape(letter.date)}}}
\end{minipage}
\vspace{0.5em}
\noindent
\begin{minipage}[t]{0.32\textwidth}
${roleBlock(letter.roleLines)}
    \vspace{0.5em}
    \rule{1cm}{0.5pt} \\
    \vspace{0.8em}
    ${texEscape(contact.name)} \\
    Bengaluru, Karnataka \\
    India \\
    {\textcolor{nameblue}{${texEscape(contact.phone)}}} \\
    {\textcolor{nameblue}{\href{mailto:${texUrl(contact.email)}}{${texEscape(contact.email)}}}}
\end{minipage}
\hfill
\begin{minipage}[t]{0.63\textwidth}
    \textbf{${texEscape(letter.teamLine)}} \\
    ${texEscape(letter.companyLine)} \\
    \vspace{1.4em}
    ${texEscape(letter.salutation)} \\
    \vspace{0.7em}
    ${paragraphs}
    Thank you for your consideration. \\
    \vspace{0.7em}
    Sincerely, \\
    \vspace{2.2em}
    {\textcolor{nameblue}{${texEscape(contact.name)}}}
\end{minipage}
\end{document}
`;
}

export function resumePlain(selection: Selection): string {
  const lines = [
    contact.name,
    contact.location,
    `${contact.phone} | ${contact.email} | ${contact.siteLabel}`,
    "",
    "EDUCATION",
    `${education.school} (${education.dates})`,
    `${education.degree} | ${education.detail}`,
    "",
    "WORK EXPERIENCE",
    ...selection.fde.map((bullet) => bullet.plain),
    ...selection.intern.map((bullet) => bullet.plain),
    "",
    "PROJECTS",
  ];
  for (const project of selection.projects) {
    lines.push(project.name);
    for (const bullet of selection.projectBullets[project.id] ?? []) lines.push(bullet.plain);
  }
  lines.push("", "TECHNICAL SKILLS");
  for (const line of selection.skills) lines.push(`${line.label}: ${line.tokens.join(", ")}`);
  lines.push("", "ACCOMPLISHMENTS");
  for (const item of selection.accomplishments) lines.push(item.plain);
  return lines.join("\n");
}
