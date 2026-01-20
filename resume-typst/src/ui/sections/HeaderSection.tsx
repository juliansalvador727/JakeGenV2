import { ContactInfo } from '../../model/types';
import { ValidationError, getFieldError } from '../../model/validate';

interface HeaderSectionProps {
  data: ContactInfo;
  onChange: (data: ContactInfo) => void;
  errors: ValidationError[];
}

export function HeaderSection({ data, onChange, errors }: HeaderSectionProps) {
  const handleChange = (field: keyof ContactInfo, value: string) => {
    onChange({
      ...data,
      [field]: value || undefined,
    });
  };

  const nameError = getFieldError(errors, 'header.name');

  return (
    <div className="section">
      <h3 className="section-title">Contact Information</h3>
      
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Jake Ryan"
          className={nameError ? 'error' : ''}
        />
        {nameError && <span className="error-text">{nameError}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="123-456-7890"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="jake@email.com"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn</label>
          <input
            id="linkedin"
            type="text"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/jake"
          />
        </div>

        <div className="form-group">
          <label htmlFor="github">GitHub</label>
          <input
            id="github"
            type="text"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="github.com/jake"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="website">Website (optional)</label>
        <input
          id="website"
          type="text"
          value={data.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="yourwebsite.com"
        />
      </div>
    </div>
  );
}
