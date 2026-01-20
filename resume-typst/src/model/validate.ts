import { ResumeData } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateResume(data: ResumeData): ValidationResult {
  const errors: ValidationError[] = [];

  // Required: Name
  if (!data.header.name || data.header.name.trim() === '') {
    errors.push({
      field: 'header.name',
      message: 'Name is required',
    });
  }

  // Required: At least one education entry
  if (!data.education || data.education.length === 0) {
    errors.push({
      field: 'education',
      message: 'At least one education entry is required',
    });
  } else {
    // Validate each education entry has required fields
    data.education.forEach((edu, index) => {
      if (!edu.school || edu.school.trim() === '') {
        errors.push({
          field: `education[${index}].school`,
          message: `Education ${index + 1}: School name is required`,
        });
      }
      if (!edu.degree || edu.degree.trim() === '') {
        errors.push({
          field: `education[${index}].degree`,
          message: `Education ${index + 1}: Degree is required`,
        });
      }
    });
  }

  // Validate experience entries if present
  data.experience.forEach((exp, index) => {
    if (!exp.organization || exp.organization.trim() === '') {
      errors.push({
        field: `experience[${index}].organization`,
        message: `Experience ${index + 1}: Organization is required`,
      });
    }
    if (!exp.role || exp.role.trim() === '') {
      errors.push({
        field: `experience[${index}].role`,
        message: `Experience ${index + 1}: Role is required`,
      });
    }
  });

  // Validate project entries if present
  data.projects.forEach((proj, index) => {
    if (!proj.name || proj.name.trim() === '') {
      errors.push({
        field: `projects[${index}].name`,
        message: `Project ${index + 1}: Name is required`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  const error = errors.find((e) => e.field === field);
  return error?.message;
}
