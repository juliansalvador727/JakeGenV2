/**
 * API Client for Resume Rendering
 * 
 * Handles communication with the backend API for PDF generation.
 */

import type { ResumeData } from '../types/resume';

const API_BASE = '/api';

export interface RenderResult {
  success: boolean;
  pdfBytes?: Uint8Array;
  latexSource?: string;
  error?: string;
  log?: string;
}

/**
 * Call the server API to render a PDF
 * @param data - Resume data to render
 * @returns PDF bytes on success
 */
export async function renderResumePdf(data: ResumeData): Promise<RenderResult> {
  try {
    const response = await fetch(`${API_BASE}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Try to get error details from response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `Server error: ${response.status}`,
          log: errorData.log,
        };
      }
      return {
        success: false,
        error: `Server error: ${response.status} ${response.statusText}`,
      };
    }

    const pdfBytes = new Uint8Array(await response.arrayBuffer());
    return {
      success: true,
      pdfBytes,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Call the server API to get just the LaTeX source (for debugging)
 * @param data - Resume data to convert
 * @returns LaTeX source string
 */
export async function getLatexSource(data: ResumeData): Promise<RenderResult> {
  try {
    const response = await fetch(`${API_BASE}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Return-Latex': 'true', // Request LaTeX source instead of PDF
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `Server error: ${response.status}`,
        };
      }
      return {
        success: false,
        error: `Server error: ${response.status} ${response.statusText}`,
      };
    }

    const latexSource = await response.text();
    return {
      success: true,
      latexSource,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Create a blob URL from PDF bytes
 * @param pdfBytes - PDF as Uint8Array
 * @returns Blob URL for the PDF
 */
export function createPdfBlobUrl(pdfBytes: Uint8Array): string {
  const pdfArray = new Uint8Array(pdfBytes);
  const blob = new Blob([pdfArray], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

/**
 * Download PDF from bytes
 * @param pdfBytes - PDF as Uint8Array
 * @param filename - Download filename
 */
export function downloadPdf(pdfBytes: Uint8Array, filename: string = 'resume.pdf'): void {
  const pdfArray = new Uint8Array(pdfBytes);
  const blob = new Blob([pdfArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up the URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
