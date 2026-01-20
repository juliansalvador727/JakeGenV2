/**
 * Vercel Serverless Function: /api/render
 * 
 * Accepts POST JSON with ResumeData, validates it, and returns:
 * - If X-Return-Latex header is set: returns LaTeX source as text/plain
 * - Otherwise: returns compiled PDF as application/pdf
 * 
 * For PDF compilation, this uses the latex.online service since running
 * full LaTeX WASM in a serverless function is challenging due to size limits.
 * 
 * For fully private compilation, use client-side WASM instead.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ResumeDataSchema, validateResumeData } from '../src/types/resume';
import { renderLatex } from './latex/render';

// YtoTech LaTeX-on-HTTP API endpoint
const LATEX_API = 'https://latex.ytotech.com/builds/sync';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb',
    },
  },
};

/**
 * Compile LaTeX to PDF using YtoTech LaTeX-on-HTTP API
 */
async function compileLatexRemote(latexSource: string): Promise<Buffer> {
  const response = await fetch(LATEX_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      compiler: 'pdflatex',
      resources: [
        {
          main: true,
          content: latexSource,
        }
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Compilation failed: ${text.slice(0, 500)}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/pdf')) {
    const text = await response.text();
    throw new Error(`Unexpected response: ${text.slice(0, 500)}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const validationResult = validateResumeData(req.body);
    
    if (!validationResult.isValid || !validationResult.data) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.errors,
      });
    }

    const resumeData = validationResult.data;

    // Generate LaTeX source
    const latexSource = renderLatex(resumeData);

    // Check if client just wants LaTeX source (for debugging or client-side compilation)
    const returnLatex = req.headers['x-return-latex'] === 'true';
    if (returnLatex) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(latexSource);
    }

    // Compile to PDF using remote service
    try {
      const pdfBuffer = await compileLatexRemote(latexSource);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
      return res.status(200).send(pdfBuffer);
    } catch (compileError) {
      // Return error with LaTeX source for debugging
      return res.status(500).json({
        error: 'PDF compilation failed',
        message: compileError instanceof Error ? compileError.message : 'Unknown error',
        latexSource: latexSource.slice(0, 2000), // First 2000 chars for debugging
      });
    }

  } catch (error) {
    console.error('Error in /api/render:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
