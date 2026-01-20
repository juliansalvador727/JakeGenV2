import { useState, useEffect, useRef, useCallback } from 'react';
import { ResumeData } from './model/types';
import { defaultResume } from './model/defaultResume';
import { validateResume, ValidationError } from './model/validate';
import { renderPdf, initWasm } from './typst/render';
import { Form } from './ui/Form';
import { Preview } from './ui/Preview';
import { Toolbar } from './ui/Toolbar';
import './styles.css';

// Debounce delay in ms
const DEBOUNCE_DELAY = 200;

// Local storage key
const STORAGE_KEY = 'resume-typst-data';

function loadFromStorage(): ResumeData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [wasmReady, setWasmReady] = useState(false);

  const debounceTimerRef = useRef<number | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  // Initialize WASM on mount
  useEffect(() => {
    initWasm()
      .then(() => {
        setWasmReady(true);
      })
      .catch((e) => {
        setError(`Failed to load WASM: ${e.message}`);
        setIsLoading(false);
      });
  }, []);

  // Render PDF function
  const doRender = useCallback(async (data: ResumeData) => {
    if (!wasmReady) return;

    setIsLoading(true);
    setError(null);

    try {
      const pdfBytes = await renderPdf(data);
      // Create Blob from PDF bytes
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Revoke previous URL
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      previousUrlRef.current = url;

      setPdfUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [wasmReady]);

  // Debounced render on data change
  useEffect(() => {
    if (!wasmReady) return;

    // Validate
    const result = validateResume(resumeData);
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
  }, [resumeData, wasmReady, doRender]);

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
    setResumeData(data);
  };

  return (
    <div className="app">
      <Toolbar
        pdfUrl={pdfUrl}
        resumeData={resumeData}
        onReset={handleReset}
        onImport={handleImport}
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
          <Preview
            pdfUrl={pdfUrl}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
