export interface ContactInfo {
  name: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  website?: string;
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
