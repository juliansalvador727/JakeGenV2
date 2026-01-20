import type { Experience, ValidationError } from '../../types/resume';
import { createEmptyExperience, getFieldError } from '../../types/resume';

interface ExperienceSectionProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
  errors: ValidationError[];
}

export function ExperienceSection({ data, onChange, errors }: ExperienceSectionProps) {
  const handleAdd = () => {
    onChange([...data, createEmptyExperience()]);
  };

  const handleRemove = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.length) return;
    
    const newData = [...data];
    [newData[index], newData[newIndex]] = [newData[newIndex], newData[index]];
    onChange(newData);
  };

  const handleChange = (id: string, field: keyof Experience, value: string | string[]) => {
    onChange(
      data.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleBulletChange = (id: string, bulletIndex: number, value: string) => {
    const exp = data.find((e) => e.id === id);
    if (!exp) return;
    
    const newBullets = [...exp.bullets];
    newBullets[bulletIndex] = value;
    handleChange(id, 'bullets', newBullets);
  };

  const handleAddBullet = (id: string) => {
    const exp = data.find((e) => e.id === id);
    if (!exp) return;
    handleChange(id, 'bullets', [...exp.bullets, '']);
  };

  const handleRemoveBullet = (id: string, bulletIndex: number) => {
    const exp = data.find((e) => e.id === id);
    if (!exp || exp.bullets.length <= 1) return;
    
    const newBullets = exp.bullets.filter((_, i) => i !== bulletIndex);
    handleChange(id, 'bullets', newBullets);
  };

  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">Experience</h3>
        <button type="button" onClick={handleAdd} className="btn-add">
          + Add
        </button>
      </div>

      {data.map((exp, index) => {
        const orgError = getFieldError(errors, `experience[${index}].organization`);
        const roleError = getFieldError(errors, `experience[${index}].role`);

        return (
          <div key={exp.id} className="entry">
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
                  &#8593;
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === data.length - 1}
                  className="btn-icon"
                  title="Move down"
                >
                  &#8595;
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(exp.id)}
                  className="btn-icon btn-remove"
                  title="Remove"
                >
                  &#215;
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Title/Role *</label>
                <input
                  type="text"
                  value={exp.organization}
                  onChange={(e) => handleChange(exp.id, 'organization', e.target.value)}
                  placeholder="Software Engineer"
                  className={orgError ? 'error' : ''}
                />
                {orgError && <span className="error-text">{orgError}</span>}
              </div>

              <div className="form-group">
                <label>Dates</label>
                <input
                  type="text"
                  value={exp.dates}
                  onChange={(e) => handleChange(exp.id, 'dates', e.target.value)}
                  placeholder="June 2020 -- Present"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company/Organization *</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleChange(exp.id, 'role', e.target.value)}
                  placeholder="Tech Company Inc."
                  className={roleError ? 'error' : ''}
                />
                {roleError && <span className="error-text">{roleError}</span>}
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleChange(exp.id, 'location', e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="bullets-header">
                <label>Bullet Points</label>
                <button
                  type="button"
                  onClick={() => handleAddBullet(exp.id)}
                  className="btn-small"
                >
                  + Bullet
                </button>
              </div>
              {exp.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="bullet-row">
                  <span className="bullet-marker">&#8226;</span>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(exp.id, bulletIndex, e.target.value)}
                    placeholder="Describe your achievement..."
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(exp.id, bulletIndex)}
                    disabled={exp.bullets.length <= 1}
                    className="btn-icon btn-remove"
                    title="Remove bullet"
                  >
                    &#215;
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {data.length === 0 && (
        <p className="empty-text">No experience entries. Click "+ Add" to add one.</p>
      )}
    </div>
  );
}
