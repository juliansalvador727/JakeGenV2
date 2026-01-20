import { FormattingSettings } from '../../model/types';

interface FormattingSectionProps {
  data: FormattingSettings;
  onChange: (data: FormattingSettings) => void;
}

export function FormattingSection({ data, onChange }: FormattingSectionProps) {
  const handleChange = (field: keyof FormattingSettings, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onChange({
      ...data,
      [field]: numValue,
    });
  };

  const renderSlider = (
    field: keyof FormattingSettings,
    label: string,
    min: number,
    max: number,
    step: number,
    defaultVal: number,
    unit: string
  ) => {
    const value = data[field] ?? defaultVal;
    return (
      <div className="form-group">
        <label htmlFor={field}>
          {label}
          <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '8px' }}>
            {value}{unit}
          </span>
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            id={field}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            style={{ width: '70px' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="section">
      <h3 className="section-title">Formatting Controls</h3>
      
      <details style={{ marginBottom: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
          Page Margins
        </summary>
        <div style={{ paddingLeft: '15px' }}>
          {renderSlider('marginLeft', 'Left Margin', 0.1, 1.5, 0.05, 0.5, 'in')}
          {renderSlider('marginRight', 'Right Margin', 0.1, 1.5, 0.05, 0.5, 'in')}
          {renderSlider('marginTop', 'Top Margin', 0.1, 1.5, 0.05, 0.5, 'in')}
          {renderSlider('marginBottom', 'Bottom Margin', 0.1, 1.5, 0.05, 0.5, 'in')}
        </div>
      </details>

      <details style={{ marginBottom: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
          Typography
        </summary>
        <div style={{ paddingLeft: '15px' }}>
          {renderSlider('baseFontSize', 'Base Font Size', 8, 14, 0.5, 11, 'pt')}
          {renderSlider('parLeading', 'Paragraph Leading', 0.3, 1.2, 0.05, 0.65, 'em')}
        </div>
      </details>

      <details style={{ marginBottom: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
          Header (Name & Contact)
        </summary>
        <div style={{ paddingLeft: '15px' }}>
          {renderSlider('nameFontSize', 'Name Font Size', 16, 36, 1, 26, 'pt')}
          {renderSlider('nameSpacing', 'Name Spacing', 0, 10, 0.5, 1, 'pt')}
          {renderSlider('contactFontSize', 'Contact Font Size', 8, 14, 0.5, 10, 'pt')}
          {renderSlider('contactSpacing', 'Contact Spacing', 0, 1, 0.05, 0.3, 'em')}
        </div>
      </details>

      <details style={{ marginBottom: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
          Section Headers
        </summary>
        <div style={{ paddingLeft: '15px' }}>
          {renderSlider('sectionFontSize', 'Section Font Size', 10, 16, 0.5, 12, 'pt')}
          {renderSlider('sectionSpaceBefore', 'Space Before', -10, 5, 0.5, -4, 'pt')}
          {renderSlider('sectionSpaceAfter1', 'Space After (1)', -10, 5, 0.5, -5, 'pt')}
          {renderSlider('sectionSpaceAfter2', 'Space After (2)', -10, 5, 0.5, -5, 'pt')}
        </div>
      </details>

      <details style={{ marginBottom: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
          Subheadings (Experience/Education/Projects)
        </summary>
        <div style={{ paddingLeft: '15px' }}>
          {renderSlider('subheadingSpaceBefore', 'Space Before', -10, 5, 0.5, -2, 'pt')}
          {renderSlider('subheadingSpaceAfter', 'Space After', -10, 5, 0.5, -7, 'pt')}
        </div>
      </details>

      <details style={{ marginBottom: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
          Items & Bullets
        </summary>
        <div style={{ paddingLeft: '15px' }}>
          {renderSlider('itemFontSize', 'Item Font Size', 8, 14, 0.5, 10, 'pt')}
          {renderSlider('itemSpacing', 'Item Spacing', -10, 5, 0.5, -2, 'pt')}
          {renderSlider('blockSpaceAfter', 'Block Space After', -10, 5, 0.5, -5, 'pt')}
        </div>
      </details>

      <details style={{ marginBottom: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
          Layout
        </summary>
        <div style={{ paddingLeft: '15px' }}>
          {renderSlider('listIndent', 'List Indent', 0, 0.5, 0.05, 0.15, 'in')}
          {renderSlider('gridWidth', 'Grid Width', 85, 100, 1, 97, '%')}
        </div>
      </details>

      <button
        onClick={() => onChange({})}
        style={{
          marginTop: '15px',
          padding: '8px 16px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Reset All to Defaults
      </button>
    </div>
  );
}
