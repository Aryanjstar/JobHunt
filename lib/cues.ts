import type { JdAnalysis, Selection } from "./types";

/** Questions a recruiter can ask, answered only with lines already on the resume. */
export function interviewCues(analysis: JdAnalysis, selection: Selection): string[] {
  const cues: string[] = [];
  if (analysis.focus) {
    cues.push(
      `The posting leads with ${analysis.focus}. Those words are on the resume only where the profile already supports them.`,
    );
  }
  cues.push(`A story you can tell from the profile: ${selection.experienceLetter.plain}`);
  for (const gap of analysis.gaps.slice(0, 2)) {
    cues.push(`${gap} is in the posting and not in the profile. Do not claim it.`);
  }
  const project = selection.projects[1] ?? selection.projects[0];
  const bullet = project ? selection.projectBullets[project.id]?.[0] : undefined;
  if (project && bullet) {
    const name = project.name.split("–")[0]?.trim() || project.name;
    cues.push(`If they ask about a project, start from ${name}: ${bullet.plain}`);
  }
  return cues.slice(0, 4);
}
