/**
 * Client-side LaTeX renderer
 * 
 * This is a copy of the render logic for use in the browser.
 * We duplicate this to avoid importing Node-specific modules.
 */

import type { ResumeData, Education, Experience, Project, SkillCategory } from '../types/resume';

// ============================================================================
// LaTeX Escape Utilities
// ============================================================================

const LATEX_SPECIAL_CHARS: Record<string, string> = {
  '\\': '\\textbackslash{}',
  '{': '\\{',
  '}': '\\}',
  '$': '\\$',
  '&': '\\&',
  '#': '\\#',
  '%': '\\%',
  '_': '\\_',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
};

function escapeLatex(text: string | undefined | null): string {
  if (!text) return '';
  
  let result = '';
  for (const char of text) {
    if (char in LATEX_SPECIAL_CHARS) {
      result += LATEX_SPECIAL_CHARS[char];
    } else {
      result += char;
    }
  }
  
  return result;
}

function escapeLatexUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  let result = '';
  for (const char of url) {
    if (char === '%') {
      result += '\\%';
    } else if (char === '#') {
      result += '\\#';
    } else if (char === '~') {
      result += '\\~{}';
    } else {
      result += char;
    }
  }
  
  return result;
}

function escapeLatexLinkText(text: string | undefined | null): string {
  return escapeLatex(text);
}

function cleanUrlForDisplay(url: string | undefined | null): string {
  if (!url) return '';
  
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

function formatUrlForHref(url: string | undefined | null): string {
  if (!url) return '';
  
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  
  return url;
}

function formatBullet(bullet: string | undefined | null): string {
  if (!bullet) return '';
  
  const trimmed = bullet.trim();
  if (!trimmed) return '';
  
  return escapeLatex(trimmed);
}

function filterEmptyBullets(bullets: string[]): string[] {
  return bullets.filter((b) => b && b.trim() !== '');
}

// ============================================================================
// Template
// ============================================================================

const TEMPLATE = `%-------------------------
% Resume in LaTeX
% Based on Jake's Resume template (sb2nov)
% License: MIT
%-------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

{{HEADER_SECTION}}

\\section{Education}
  \\resumeSubHeadingListStart
{{EDUCATION_SECTION}}
  \\resumeSubHeadingListEnd

{{EXPERIENCE_SECTION}}

{{PROJECTS_SECTION}}

{{SKILLS_SECTION}}

\\end{document}
`;

// ============================================================================
// Section Renderers
// ============================================================================

function renderHeader(header: ResumeData['header']): string {
  const name = escapeLatex(header.name);
  
  const contactItems: string[] = [];
  
  if (header.phone) {
    contactItems.push(`\\small ${escapeLatex(header.phone)}`);
  }
  
  if (header.email) {
    const emailUrl = `mailto:${header.email}`;
    contactItems.push(`\\href{${escapeLatexUrl(emailUrl)}}{\\underline{${escapeLatexLinkText(header.email)}}}`);
  }
  
  if (header.linkedin) {
    const linkedinUrl = formatUrlForHref(header.linkedin);
    const displayText = cleanUrlForDisplay(header.linkedin);
    contactItems.push(`\\href{${escapeLatexUrl(linkedinUrl)}}{\\underline{${escapeLatexLinkText(displayText)}}}`);
  }
  
  if (header.github) {
    const githubUrl = formatUrlForHref(header.github);
    const displayText = cleanUrlForDisplay(header.github);
    contactItems.push(`\\href{${escapeLatexUrl(githubUrl)}}{\\underline{${escapeLatexLinkText(displayText)}}}`);
  }
  
  if (header.website) {
    const websiteUrl = formatUrlForHref(header.website);
    const displayText = cleanUrlForDisplay(header.website);
    contactItems.push(`\\href{${escapeLatexUrl(websiteUrl)}}{\\underline{${escapeLatexLinkText(displayText)}}}`);
  }
  
  const lines = [
    `\\begin{center}`,
    `    \\textbf{\\Huge \\scshape ${name}} \\\\ \\vspace{1pt}`,
  ];
  
  if (contactItems.length > 0) {
    lines.push(`    ${contactItems.join(' $|$ ')}`);
  }
  
  lines.push(`\\end{center}`);
  
  return lines.join('\n');
}

function renderEducation(edu: Education): string {
  const school = escapeLatex(edu.school);
  const location = escapeLatex(edu.location);
  const degree = escapeLatex(edu.degree);
  const dates = escapeLatex(edu.dates);
  
  return `    \\resumeSubheading
      {${school}}{${location}}
      {${degree}}{${dates}}`;
}

function renderEducationSection(education: Education[]): string {
  return education.map(renderEducation).join('\n');
}

function renderBullets(bullets: string[]): string {
  const validBullets = filterEmptyBullets(bullets);
  
  if (validBullets.length === 0) {
    return '';
  }
  
  const lines = [
    `          \\resumeItemListStart`,
    ...validBullets.map((b) => `            \\resumeItem{${formatBullet(b)}}`),
    `          \\resumeItemListEnd`,
  ];
  
  return lines.join('\n');
}

function renderExperience(exp: Experience): string {
  const organization = escapeLatex(exp.organization);
  const location = escapeLatex(exp.location);
  const role = escapeLatex(exp.role);
  const dates = escapeLatex(exp.dates);
  
  const lines = [
    `    \\resumeSubheading`,
    `      {${organization}}{${dates}}`,
    `      {${role}}{${location}}`,
  ];
  
  const bulletsStr = renderBullets(exp.bullets);
  if (bulletsStr) {
    lines.push(bulletsStr);
  }
  
  return lines.join('\n');
}

function renderExperienceSection(experience: Experience[]): string {
  if (experience.length === 0) {
    return '';
  }
  
  const lines = [
    `\\section{Experience}`,
    `  \\resumeSubHeadingListStart`,
    ...experience.map(renderExperience),
    `  \\resumeSubHeadingListEnd`,
  ];
  
  return lines.join('\n');
}

function renderProject(proj: Project): string {
  const name = escapeLatex(proj.name);
  const techStack = escapeLatex(proj.techStack);
  const dates = escapeLatex(proj.dates);
  
  const titlePart = techStack 
    ? `\\textbf{${name}} $|$ \\emph{${techStack}}`
    : `\\textbf{${name}}`;
  
  const lines = [
    `    \\resumeProjectHeading`,
    `      {${titlePart}}{${dates}}`,
  ];
  
  const bulletsStr = renderBullets(proj.bullets);
  if (bulletsStr) {
    lines.push(bulletsStr);
  }
  
  return lines.join('\n');
}

function renderProjectsSection(projects: Project[]): string {
  if (projects.length === 0) {
    return '';
  }
  
  const lines = [
    `\\section{Projects}`,
    `    \\resumeSubHeadingListStart`,
    ...projects.map(renderProject),
    `    \\resumeSubHeadingListEnd`,
  ];
  
  return lines.join('\n');
}

function renderSkillCategory(skill: SkillCategory): string {
  const name = escapeLatex(skill.name);
  const items = skill.items
    .filter((i) => i && i.trim() !== '')
    .map(escapeLatex)
    .join(', ');
  
  return `\\textbf{${name}}{: ${items}} \\\\`;
}

function renderSkillsSection(skills: SkillCategory[]): string {
  if (skills.length === 0) {
    return '';
  }
  
  const skillLines = skills
    .filter((s) => s.items.length > 0)
    .map(renderSkillCategory);
  
  if (skillLines.length === 0) {
    return '';
  }
  
  const lines = [
    `\\section{Technical Skills}`,
    ` \\begin{itemize}[leftmargin=0.15in, label={}]`,
    `    \\small{\\item{`,
    ...skillLines.map((line) => `     ${line}`),
    `    }}`,
    ` \\end{itemize}`,
  ];
  
  return lines.join('\n');
}

// ============================================================================
// Main Export
// ============================================================================

/**
 * Convert ResumeData to LaTeX source string
 */
export function renderLatex(data: ResumeData): string {
  const headerSection = renderHeader(data.header);
  const educationSection = renderEducationSection(data.education);
  const experienceSection = renderExperienceSection(data.experience);
  const projectsSection = renderProjectsSection(data.projects);
  const skillsSection = renderSkillsSection(data.skills);
  
  let latex = TEMPLATE
    .replace('{{HEADER_SECTION}}', headerSection)
    .replace('{{EDUCATION_SECTION}}', educationSection)
    .replace('{{EXPERIENCE_SECTION}}', experienceSection)
    .replace('{{PROJECTS_SECTION}}', projectsSection)
    .replace('{{SKILLS_SECTION}}', skillsSection);
  
  return latex;
}
