/**
 * LaTeX Compiler
 * 
 * Compiles LaTeX to PDF using our own API endpoint which proxies to latex.online.
 * This avoids CORS issues since the request goes server-to-server.
 */

import type { ResumeData } from '../types/resume';

// Compilation state
let isReady = true;

/**
 * Initialize the LaTeX compiler (no-op for API-based compilation)
 */
export async function initLatexEngine(): Promise<void> {
  isReady = true;
  return Promise.resolve();
}

/**
 * Check if the compiler is ready
 */
export function isLatexEngineReady(): boolean {
  return isReady;
}

/**
 * Compile resume data to PDF bytes via our API endpoint
 * @param latexSource - The LaTeX source (unused, we send JSON instead)
 * @param resumeData - The resume data to compile
 * @returns PDF bytes as Uint8Array
 * @throws Error if compilation fails
 */
export async function compileLatex(latexSource: string, resumeData?: ResumeData): Promise<Uint8Array> {
  // If we have resumeData, use the API endpoint (preferred)
  // Otherwise fall back to sending raw LaTeX
  
  if (resumeData) {
    return compileViaApi(resumeData);
  }
  
  // Fallback: compile raw LaTeX via API with special header
  return compileRawLatex(latexSource);
}

/**
 * Compile via our API endpoint with JSON data
 */
async function compileViaApi(resumeData: ResumeData): Promise<Uint8Array> {
  try {
    const response = await fetch('/api/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach server. Make sure the dev server is running.');
    }
    throw error;
  }
}

/**
 * Compile raw LaTeX source via API
 */
async function compileRawLatex(latexSource: string): Promise<Uint8Array> {
  try {
    const response = await fetch('/api/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'X-Raw-Latex': 'true',
      },
      body: latexSource,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Compilation failed: ${errorText.slice(0, 500)}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach server.');
    }
    throw error;
  }
}

/**
 * Clear any cached data (no-op)
 */
export function clearLatexCache(): void {
  // No cache to clear
}

/**
 * Close the compiler (no-op)
 */
export function closeLatexEngine(): void {
  // Nothing to close
}
