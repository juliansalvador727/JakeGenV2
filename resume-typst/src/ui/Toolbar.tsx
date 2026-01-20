import type { ResumeData } from '../types/resume';

interface ToolbarProps {
  resumeData: ResumeData;
  onReset: () => void;
  onImport: (data: ResumeData) => void;
  onDownload: () => void;
  onDownloadLatex: () => void;
  showLatex: boolean;
  onToggleLatex: () => void;
  canDownload: boolean;
}

export function Toolbar({ 
  resumeData, 
  onReset, 
  onImport, 
  onDownload, 
  onDownloadLatex,
  showLatex,
  onToggleLatex,
  canDownload 
}: ToolbarProps) {
  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(resumeData, null, 2));
      alert('JSON copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(resumeData, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('JSON copied to clipboard!');
    }
  };

  const handleImportJson = () => {
    const input = prompt('Paste your resume JSON:');
    if (!input) return;
    
    try {
      const parsed = JSON.parse(input);
      // Basic validation
      if (!parsed.header || !parsed.education) {
        throw new Error('Invalid resume format');
      }
      onImport(parsed);
      alert('Resume imported successfully!');
    } catch (e) {
      alert(`Failed to import JSON: ${e instanceof Error ? e.message : 'Invalid format'}`);
    }
  };

  const handleReset = () => {
    if (confirm('Reset to sample resume? All changes will be lost.')) {
      onReset();
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-title">
        <h1>Resume Generator</h1>
        <span className="subtitle">Jake's Style (sb2nov) - LaTeX + WASM</span>
      </div>
      
      <div className="toolbar-actions">
        <button
          onClick={onDownload}
          disabled={!canDownload}
          className="btn btn-primary"
          title="Download PDF"
        >
          Download PDF
        </button>
        
        <button
          onClick={onDownloadLatex}
          disabled={!canDownload}
          className="btn"
          title="Download LaTeX source"
        >
          Download .tex
        </button>
        
        <button
          onClick={onToggleLatex}
          className={`btn ${showLatex ? 'btn-active' : ''}`}
          title="Toggle LaTeX preview"
        >
          {showLatex ? 'Show PDF' : 'Show LaTeX'}
        </button>
        
        <button
          onClick={handleCopyJson}
          className="btn"
          title="Copy JSON to clipboard"
        >
          Copy JSON
        </button>
        
        <button
          onClick={handleImportJson}
          className="btn"
          title="Import from JSON"
        >
          Import JSON
        </button>
        
        <button
          onClick={handleReset}
          className="btn btn-secondary"
          title="Reset to sample data"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
