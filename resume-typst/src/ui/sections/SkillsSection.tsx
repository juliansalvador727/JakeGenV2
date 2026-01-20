import { SkillCategory, createEmptySkillCategory } from '../../model/types';

interface SkillsSectionProps {
  data: SkillCategory[];
  onChange: (data: SkillCategory[]) => void;
}

export function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const handleAdd = () => {
    onChange([...data, createEmptySkillCategory()]);
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

  const handleNameChange = (id: string, value: string) => {
    onChange(
      data.map((item) =>
        item.id === id ? { ...item, name: value } : item
      )
    );
  };

  const handleItemsChange = (id: string, value: string) => {
    // Split by comma and trim
    const items = value.split(',').map((s) => s.trim()).filter((s) => s !== '');
    onChange(
      data.map((item) =>
        item.id === id ? { ...item, items } : item
      )
    );
  };

  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">Technical Skills</h3>
        <button type="button" onClick={handleAdd} className="btn-add">
          + Add Category
        </button>
      </div>

      {data.map((skill, index) => (
        <div key={skill.id} className="entry skill-entry">
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
                onClick={() => handleRemove(skill.id)}
                className="btn-icon btn-remove"
                title="Remove"
              >
                ×
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: '0 0 150px' }}>
              <label>Category Name</label>
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleNameChange(skill.id, e.target.value)}
                placeholder="Languages"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Items (comma-separated)</label>
              <input
                type="text"
                value={skill.items.join(', ')}
                onChange={(e) => handleItemsChange(skill.id, e.target.value)}
                placeholder="Python, JavaScript, TypeScript, Go"
              />
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <p className="empty-text">No skill categories. Click "+ Add Category" to add one.</p>
      )}
    </div>
  );
}
