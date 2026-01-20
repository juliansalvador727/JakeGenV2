import { useState, useEffect, useRef, useCallback } from 'react';
import type { ResumeData, ValidationError } from './types/resume';
import { validateResumeData } from './types/resume';
import { defaultResume } from './data/defaultResume';
import { renderLatex } from './latex/render-client';
import { initLatexEngine, compileLatex } from './lib/latex-compiler';
import { Form } from './ui/Form';
import { Preview } from './ui/Preview';
import { Toolbar } from './ui/Toolbar';
import './styles.css';

// Debounce delay in ms (longer since we make network calls)
const DEBOUNCE_DELAY = 800;

// Local storage key
const STORAGE_KEY = 'resume-latex-data';

function loadFromStorage(): ResumeData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate stored data
      const result = validateResumeData(parsed);
      if (result.isValid && result.data) {
        return result.data;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveToStorage(data: ResumeData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    return loadFromStorage() || defaultResume;
  });
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [engineReady, setEngineReady] = useState(false);
  const [latexSource, setLatexSource] = useState<string>('');
  const [showLatex, setShowLatex] = useState(false);

  const debounceTimerRef = useRef<number | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  // Initialize LaTeX WASM engine on mount
  useEffect(() => {
    initLatexEngine()
      .then(() => {
        setEngineReady(true);
      })
      .catch((e) => {
        console.error('Failed to load LaTeX engine:', e);
        setError(`Failed to load LaTeX engine: ${e.message}. Try refreshing the page.`);
        setIsLoading(false);
      });
  }, []);

  // Render PDF function
  const doRender = useCallback(async (data: ResumeData) => {
    if (!engineReady) return;

    setIsLoading(true);
    setError(null);

    try {
      // Generate LaTeX source (for display/download)
      const latex = renderLatex(data);
      setLatexSource(latex);

      // Compile to PDF via API
      const pdf = await compileLatex(latex, data);
      
      // Create Blob URL - copy to regular ArrayBuffer to satisfy TypeScript
      const pdfArray = new Uint8Array(pdf);
      const blob = new Blob([pdfArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Revoke previous URL
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      previousUrlRef.current = url;

      setPdfUrl(url);
      setPdfBytes(pdf);
    } catch (e) {
      console.error('Render error:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [engineReady]);

  // Debounced render on data change
  useEffect(() => {
    if (!engineReady) return;

    // Validate
    const result = validateResumeData(resumeData);
    setValidationErrors(result.errors);

    // Save to localStorage
    saveToStorage(resumeData);

    // Debounce the render
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      doRender(resumeData);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [resumeData, engineReady, doRender]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const handleReset = () => {
    setResumeData(defaultResume);
  };

  const handleImport = (data: ResumeData) => {
    const result = validateResumeData(data);
    if (result.isValid && result.data) {
      setResumeData(result.data);
    } else {
      setError('Invalid resume data format');
    }
  };

  const handleDownload = () => {
    if (!pdfBytes) return;
    
    const pdfArray = new Uint8Array(pdfBytes);
    const blob = new Blob([pdfArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.header.name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleDownloadLatex = () => {
    if (!latexSource) return;
    
    const blob = new Blob([latexSource], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.header.name.replace(/\s+/g, '_')}_Resume.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="app">
      <Toolbar
        resumeData={resumeData}
        onReset={handleReset}
        onImport={handleImport}
        onDownload={handleDownload}
        onDownloadLatex={handleDownloadLatex}
        showLatex={showLatex}
        onToggleLatex={() => setShowLatex(!showLatex)}
        canDownload={!!pdfBytes}
      />

      <div className="main-content">
        <div className="form-panel">
          <Form
            data={resumeData}
            onChange={setResumeData}
            errors={validationErrors}
          />
        </div>

        <div className="preview-panel">
          {showLatex ? (
            <div className="latex-preview">
              <h3>LaTeX Source</h3>
              <pre>{latexSource}</pre>
            </div>
          ) : (
            <Preview
              pdfUrl={pdfUrl}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}
