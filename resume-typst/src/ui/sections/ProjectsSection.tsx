import type { Project, ValidationError } from '../../types/resume';
import { createEmptyProject, getFieldError } from '../../types/resume';

interface ProjectsSectionProps {
  data: Project[];
  onChange: (data: Project[]) => void;
  errors: ValidationError[];
}

export function ProjectsSection({ data, onChange, errors }: ProjectsSectionProps) {
  const handleAdd = () => {
    onChange([...data, createEmptyProject()]);
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

  const handleChange = (id: string, field: keyof Project, value: string | string[]) => {
    onChange(
      data.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleBulletChange = (id: string, bulletIndex: number, value: string) => {
    const proj = data.find((p) => p.id === id);
    if (!proj) return;
    
    const newBullets = [...proj.bullets];
    newBullets[bulletIndex] = value;
    handleChange(id, 'bullets', newBullets);
  };

  const handleAddBullet = (id: string) => {
    const proj = data.find((p) => p.id === id);
    if (!proj) return;
    handleChange(id, 'bullets', [...proj.bullets, '']);
  };

  const handleRemoveBullet = (id: string, bulletIndex: number) => {
    const proj = data.find((p) => p.id === id);
    if (!proj || proj.bullets.length <= 1) return;
    
    const newBullets = proj.bullets.filter((_, i) => i !== bulletIndex);
    handleChange(id, 'bullets', newBullets);
  };

  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">Projects</h3>
        <button type="button" onClick={handleAdd} className="btn-add">
          + Add
        </button>
      </div>

      {data.map((proj, index) => {
        const nameError = getFieldError(errors, `projects[${index}].name`);

        return (
          <div key={proj.id} className="entry">
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
                  onClick={() => handleRemove(proj.id)}
                  className="btn-icon btn-remove"
                  title="Remove"
                >
                  &#215;
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => handleChange(proj.id, 'name', e.target.value)}
                  placeholder="My Awesome Project"
                  className={nameError ? 'error' : ''}
                />
                {nameError && <span className="error-text">{nameError}</span>}
              </div>

              <div className="form-group">
                <label>Dates</label>
                <input
                  type="text"
                  value={proj.dates}
                  onChange={(e) => handleChange(proj.id, 'dates', e.target.value)}
                  placeholder="Jan 2021 -- Present"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tech Stack</label>
              <input
                type="text"
                value={proj.techStack}
                onChange={(e) => handleChange(proj.id, 'techStack', e.target.value)}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>

            <div className="form-group">
              <div className="bullets-header">
                <label>Bullet Points</label>
                <button
                  type="button"
                  onClick={() => handleAddBullet(proj.id)}
                  className="btn-small"
                >
                  + Bullet
                </button>
              </div>
              {proj.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="bullet-row">
                  <span className="bullet-marker">&#8226;</span>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(proj.id, bulletIndex, e.target.value)}
                    placeholder="Describe your project..."
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(proj.id, bulletIndex)}
                    disabled={proj.bullets.length <= 1}
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
        <p className="empty-text">No projects. Click "+ Add" to add one.</p>
      )}
    </div>
  );
}
