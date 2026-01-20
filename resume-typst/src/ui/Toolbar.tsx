import { ResumeData } from '../model/types';

interface ToolbarProps {
  pdfUrl: string | null;
  resumeData: ResumeData;
  onReset: () => void;
  onImport: (data: ResumeData) => void;
}

export function Toolbar({ pdfUrl, resumeData, onReset, onImport }: ToolbarProps) {
  const handleDownload = () => {
    if (!pdfUrl) return;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${resumeData.header.name || 'resume'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <span className="subtitle">Jake's Style • Typst + WASM</span>
      </div>
      
      <div className="toolbar-actions">
        <button
          onClick={handleDownload}
          disabled={!pdfUrl}
          className="btn btn-primary"
          title="Download PDF"
        >
          📄 Download PDF
        </button>
        
        <button
          onClick={handleCopyJson}
          className="btn"
          title="Copy JSON to clipboard"
        >
          📋 Copy JSON
        </button>
        
        <button
          onClick={handleImportJson}
          className="btn"
          title="Import from JSON"
        >
          📥 Import JSON
        </button>
        
        <button
          onClick={handleReset}
          className="btn btn-secondary"
          title="Reset to sample data"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
