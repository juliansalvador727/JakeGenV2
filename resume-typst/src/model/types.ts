export interface ContactInfo {
  name: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface FormattingSettings {
  // Page settings
  marginLeft?: number;      // in inches, default 0.5
  marginRight?: number;     // in inches, default 0.5
  marginTop?: number;       // in inches, default 0.5
  marginBottom?: number;    // in inches, default 0.5
  
  // Typography
  baseFontSize?: number;    // in pt, default 11
  parLeading?: number;      // in em, default 0.65
  
  // Header (name & contact)
  nameFontSize?: number;    // in pt, default 26
  nameSpacing?: number;     // spacing after name, in pt, default 1
  contactFontSize?: number; // in pt, default 10
  contactSpacing?: number;  // spacing after contact, in em, default 0.3
  
  // Section headers
  sectionFontSize?: number; // in pt, default 12
  sectionSpaceBefore?: number;  // in pt, default -4
  sectionSpaceAfter1?: number;  // in pt, default -5
  sectionSpaceAfter2?: number;  // in pt, default -5
  
  // Subheadings (experience/education)
  subheadingSpaceBefore?: number; // in pt, default -2
  subheadingSpaceAfter?: number;  // in pt, default -7
  
  // Items/bullets
  itemFontSize?: number;    // in pt, default 10
  itemSpacing?: number;     // in pt, default -2
  blockSpaceAfter?: number; // in pt, default -5
  
  // Layout
  listIndent?: number;      // in inches, default 0.15
  gridWidth?: number;       // percentage, default 97
}

export interface Education {
  id: string;
  school: string;
  location: string;
  degree: string;
  dates: string;
  extra?: string;
}

export interface Experience {
  id: string;
  organization: string;
  location: string;
  role: string;
  dates: string;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  techStack: string;
  dates: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  items: string[];
}

export interface ResumeData {
  header: ContactInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  formatting?: FormattingSettings;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function createEmptyEducation(): Education {
  return {
    id: generateId(),
    school: '',
    location: '',
    degree: '',
    dates: '',
    extra: '',
  };
}

export function createEmptyExperience(): Experience {
  return {
    id: generateId(),
    organization: '',
    location: '',
    role: '',
    dates: '',
    bullets: [''],
  };
}

export function createEmptyProject(): Project {
  return {
    id: generateId(),
    name: '',
    techStack: '',
    dates: '',
    bullets: [''],
  };
}

export function createEmptySkillCategory(): SkillCategory {
  return {
    id: generateId(),
    name: '',
    items: [],
  };
}
