import { useState } from 'react';
import type { ResumeData, ValidationError } from '../types/resume';
import { HeaderSection } from './sections/HeaderSection';
import { EducationSection } from './sections/EducationSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';

interface FormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  errors: ValidationError[];
}

type SectionKey = 'header' | 'education' | 'experience' | 'projects' | 'skills';

export function Form({ data, onChange, errors }: FormProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<SectionKey>>(new Set());

  const toggleSection = (section: SectionKey) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const isCollapsed = (section: SectionKey) => collapsedSections.has(section);

  return (
    <form className="resume-form" onSubmit={(e) => e.preventDefault()}>
      <div className="collapsible-section">
        <button
          type="button"
          className="collapse-toggle"
          onClick={() => toggleSection('header')}
        >
          <span className={`arrow ${isCollapsed('header') ? 'collapsed' : ''}`}>&#9660;</span>
          Contact Information
        </button>
        {!isCollapsed('header') && (
          <HeaderSection
            data={data.header}
            onChange={(header) => onChange({ ...data, header })}
            errors={errors}
          />
        )}
      </div>

      <div className="collapsible-section">
        <button
          type="button"
          className="collapse-toggle"
          onClick={() => toggleSection('education')}
        >
          <span className={`arrow ${isCollapsed('education') ? 'collapsed' : ''}`}>&#9660;</span>
          Education ({data.education.length})
        </button>
        {!isCollapsed('education') && (
          <EducationSection
            data={data.education}
            onChange={(education) => onChange({ ...data, education })}
            errors={errors}
          />
        )}
      </div>

      <div className="collapsible-section">
        <button
          type="button"
          className="collapse-toggle"
          onClick={() => toggleSection('experience')}
        >
          <span className={`arrow ${isCollapsed('experience') ? 'collapsed' : ''}`}>&#9660;</span>
          Experience ({data.experience.length})
        </button>
        {!isCollapsed('experience') && (
          <ExperienceSection
            data={data.experience}
            onChange={(experience) => onChange({ ...data, experience })}
            errors={errors}
          />
        )}
      </div>

      <div className="collapsible-section">
        <button
          type="button"
          className="collapse-toggle"
          onClick={() => toggleSection('projects')}
        >
          <span className={`arrow ${isCollapsed('projects') ? 'collapsed' : ''}`}>&#9660;</span>
          Projects ({data.projects.length})
        </button>
        {!isCollapsed('projects') && (
          <ProjectsSection
            data={data.projects}
            onChange={(projects) => onChange({ ...data, projects })}
            errors={errors}
          />
        )}
      </div>

      <div className="collapsible-section">
        <button
          type="button"
          className="collapse-toggle"
          onClick={() => toggleSection('skills')}
        >
          <span className={`arrow ${isCollapsed('skills') ? 'collapsed' : ''}`}>&#9660;</span>
          Technical Skills ({data.skills.length})
        </button>
        {!isCollapsed('skills') && (
          <SkillsSection
            data={data.skills}
            onChange={(skills) => onChange({ ...data, skills })}
          />
        )}
      </div>
    </form>
  );
}
