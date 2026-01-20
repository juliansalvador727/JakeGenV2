import { z } from 'zod';

// ============================================================================
// Zod Schemas with validation limits
// ============================================================================

// Limits for validation
export const LIMITS = {
  MAX_NAME_LENGTH: 100,
  MAX_FIELD_LENGTH: 200,
  MAX_BULLET_LENGTH: 500,
  MAX_BULLETS_PER_SECTION: 10,
  MAX_EDUCATION_ENTRIES: 5,
  MAX_EXPERIENCE_ENTRIES: 10,
  MAX_PROJECT_ENTRIES: 10,
  MAX_SKILL_CATEGORIES: 10,
  MAX_SKILLS_PER_CATEGORY: 20,
  MAX_TOTAL_SIZE_BYTES: 50000, // 50KB max for entire resume
} as const;

export const ContactInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(LIMITS.MAX_NAME_LENGTH),
  phone: z.string().max(LIMITS.MAX_FIELD_LENGTH).optional(),
  email: z.string().email().max(LIMITS.MAX_FIELD_LENGTH).optional().or(z.literal('')),
  linkedin: z.string().max(LIMITS.MAX_FIELD_LENGTH).optional(),
  github: z.string().max(LIMITS.MAX_FIELD_LENGTH).optional(),
  website: z.string().max(LIMITS.MAX_FIELD_LENGTH).optional(),
});

export const EducationSchema = z.object({
  id: z.string(),
  school: z.string().min(1, 'School is required').max(LIMITS.MAX_FIELD_LENGTH),
  location: z.string().max(LIMITS.MAX_FIELD_LENGTH),
  degree: z.string().min(1, 'Degree is required').max(LIMITS.MAX_FIELD_LENGTH),
  dates: z.string().max(LIMITS.MAX_FIELD_LENGTH),
  extra: z.string().max(LIMITS.MAX_FIELD_LENGTH).optional(),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  organization: z.string().min(1, 'Organization is required').max(LIMITS.MAX_FIELD_LENGTH),
  location: z.string().max(LIMITS.MAX_FIELD_LENGTH),
  role: z.string().min(1, 'Role is required').max(LIMITS.MAX_FIELD_LENGTH),
  dates: z.string().max(LIMITS.MAX_FIELD_LENGTH),
  bullets: z.array(z.string().max(LIMITS.MAX_BULLET_LENGTH)).max(LIMITS.MAX_BULLETS_PER_SECTION),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required').max(LIMITS.MAX_FIELD_LENGTH),
  techStack: z.string().max(LIMITS.MAX_FIELD_LENGTH),
  dates: z.string().max(LIMITS.MAX_FIELD_LENGTH),
  bullets: z.array(z.string().max(LIMITS.MAX_BULLET_LENGTH)).max(LIMITS.MAX_BULLETS_PER_SECTION),
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Category name is required').max(LIMITS.MAX_FIELD_LENGTH),
  items: z.array(z.string().max(LIMITS.MAX_FIELD_LENGTH)).max(LIMITS.MAX_SKILLS_PER_CATEGORY),
});

export const ResumeDataSchema = z.object({
  header: ContactInfoSchema,
  education: z.array(EducationSchema).min(1, 'At least one education entry is required').max(LIMITS.MAX_EDUCATION_ENTRIES),
  experience: z.array(ExperienceSchema).max(LIMITS.MAX_EXPERIENCE_ENTRIES),
  projects: z.array(ProjectSchema).max(LIMITS.MAX_PROJECT_ENTRIES),
  skills: z.array(SkillCategorySchema).max(LIMITS.MAX_SKILL_CATEGORIES),
});

// ============================================================================
// TypeScript Types (derived from Zod schemas)
// ============================================================================

export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type ResumeData = z.infer<typeof ResumeDataSchema>;

// ============================================================================
// Helper functions
// ============================================================================

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

// ============================================================================
// Validation helpers
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  data?: ResumeData;
}

export function validateResumeData(data: unknown): ValidationResult {
  const result = ResumeDataSchema.safeParse(data);
  
  if (result.success) {
    // Check total size
    const jsonSize = JSON.stringify(result.data).length;
    if (jsonSize > LIMITS.MAX_TOTAL_SIZE_BYTES) {
      return {
        isValid: false,
        errors: [{
          field: 'root',
          message: `Resume data exceeds maximum size (${Math.round(jsonSize / 1000)}KB > ${LIMITS.MAX_TOTAL_SIZE_BYTES / 1000}KB)`,
        }],
      };
    }
    
    return {
      isValid: true,
      errors: [],
      data: result.data,
    };
  }
  
  // Convert Zod errors to our format
  const errors: ValidationError[] = result.error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  
  return {
    isValid: false,
    errors,
  };
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  const error = errors.find((e) => e.field === field);
  return error?.message;
}
