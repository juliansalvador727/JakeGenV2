import { Education, createEmptyEducation } from '../../model/types';
import { ValidationError, getFieldError } from '../../model/validate';

interface EducationSectionProps {
  data: Education[];
  onChange: (data: Education[]) => void;
  errors: ValidationError[];
}

export function EducationSection({ data, onChange, errors }: EducationSectionProps) {
  const handleAdd = () => {
    onChange([...data, createEmptyEducation()]);
  };

  const handleRemove = (id: string) => {
    if (data.length > 1) {
      onChange(data.filter((item) => item.id !== id));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.length) return;
    
    const newData = [...data];
    [newData[index], newData[newIndex]] = [newData[newIndex], newData[index]];
    onChange(newData);
  };

  const handleChange = (id: string, field: keyof Education, value: string) => {
    onChange(
      data.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const sectionError = getFieldError(errors, 'education');

  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">Education</h3>
        <button type="button" onClick={handleAdd} className="btn-add">
          + Add
        </button>
      </div>
      
      {sectionError && <span className="error-text">{sectionError}</span>}

      {data.map((edu, index) => {
        const schoolError = getFieldError(errors, `education[${index}].school`);
        const degreeError = getFieldError(errors, `education[${index}].degree`);

        return (
          <div key={edu.id} className="entry">
            <div className="entry-header">
              <span className="entry-number">#{index + 1}</span>
              <div className="entry-actions">
                <button
                  type="button"
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="btn-icon"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === data.length - 1}
                  className="btn-icon"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(edu.id)}
                  disabled={data.length <= 1}
                  className="btn-icon btn-remove"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>School *</label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => handleChange(edu.id, 'school', e.target.value)}
                  placeholder="University Name"
                  className={schoolError ? 'error' : ''}
                />
                {schoolError && <span className="error-text">{schoolError}</span>}
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => handleChange(edu.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Degree *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                placeholder="Bachelor of Science in Computer Science"
                className={degreeError ? 'error' : ''}
              />
              {degreeError && <span className="error-text">{degreeError}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Dates</label>
                <input
                  type="text"
                  value={edu.dates}
                  onChange={(e) => handleChange(edu.id, 'dates', e.target.value)}
                  placeholder="Aug. 2018 -- May 2022"
                />
              </div>

              <div className="form-group">
                <label>Extra Info</label>
                <input
                  type="text"
                  value={edu.extra || ''}
                  onChange={(e) => handleChange(edu.id, 'extra', e.target.value)}
                  placeholder="GPA, honors, etc."
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
