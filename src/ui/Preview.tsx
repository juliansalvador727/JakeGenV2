interface PreviewProps {
  pdfUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function Preview({ pdfUrl, isLoading, error }: PreviewProps) {
  return (
    <div className="preview-container">
      {isLoading && (
        <div className="preview-loading">
          <div className="spinner"></div>
          <p>Compiling LaTeX...</p>
        </div>
      )}
      
      {error && (
        <div className="preview-error">
          <p>Error generating PDF:</p>
          <pre>{error}</pre>
        </div>
      )}
      
      {!isLoading && !error && pdfUrl && (
        <object
          data={pdfUrl}
          type="application/pdf"
          className="pdf-viewer"
          title="Resume Preview"
        >
          <p>
            Unable to display PDF. 
            <a href={pdfUrl} download="resume.pdf">Download instead</a>
          </p>
        </object>
      )}
      
      {!isLoading && !error && !pdfUrl && (
        <div className="preview-placeholder">
          <p>PDF preview will appear here</p>
        </div>
      )}
    </div>
  );
}
