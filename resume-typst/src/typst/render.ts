import { ResumeData } from '../model/types';

// Import the WASM module
// @ts-ignore - wasm-bindgen generated file
import init, { compile_typst, init_engine } from '../../wasm/typst_engine_pkg/typst_engine.js';

// Track initialization state
let isInitialized = false;
let initPromise: Promise<void> | null = null;

// Template cache
let templateSource: string | null = null;

// Import template as raw text
import templateRaw from './template.typ?raw';

// Hash function for caching
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Cache for compiled PDFs
const pdfCache = new Map<string, Uint8Array>();
const MAX_CACHE_SIZE = 10;

/**
 * Initialize the WASM module - must be called before rendering
 */
export async function initWasm(): Promise<void> {
  if (isInitialized) return;
  
  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    try {
      await init();
      init_engine();
      isInitialized = true;
    } catch (error) {
      initPromise = null;
      throw error;
    }
  })();

  await initPromise;
}

/**
 * Load the Typst template
 */
function loadTemplate(): string {
  if (!templateSource) {
    templateSource = templateRaw;
  }
  return templateSource as string;
}

/**
 * Convert a JavaScript value to Typst syntax
 */
function toTypstValue(value: any): string {
  if (value === null || value === undefined) {
    return 'none';
  }
  if (typeof value === 'string') {
    // Escape backslashes and quotes
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}"`;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (typeof value === 'boolean') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    const items = value.map(v => toTypstValue(v)).join(', ');
    return `(${items},)`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, val]) => `${key}: ${toTypstValue(val)}`)
      .join(', ');
    return `(${entries})`;
  }
  return 'none';
}

/**
 * Convert ResumeData to Typst dictionary syntax
 */
function convertToTypstData(data: ResumeData): string {
  const typstData = {
    header: {
      name: data.header.name || '',
      phone: data.header.phone || null,
      email: data.header.email || null,
      linkedin: data.header.linkedin || null,
      github: data.header.github || null,
      website: data.header.website || null,
    },
    education: data.education.map(edu => ({
      school: edu.school || '',
      location: edu.location || '',
      degree: edu.degree || '',
      dates: edu.dates || '',
      extra: edu.extra || null,
    })),
    experience: data.experience.map(exp => ({
      organization: exp.organization || '',
      location: exp.location || '',
      role: exp.role || '',
      dates: exp.dates || '',
      bullets: exp.bullets.filter(b => b.trim() !== ''),
    })),
    projects: data.projects.map(proj => ({
      name: proj.name || '',
      techStack: proj.techStack || '',
      dates: proj.dates || '',
      bullets: proj.bullets.filter(b => b.trim() !== ''),
    })),
    skills: data.skills.map(skill => ({
      name: skill.name || '',
      items: skill.items.filter(i => i.trim() !== ''),
    })),
  };
  
  return toTypstValue(typstData);
}

/**
 * Render resume data to PDF bytes
 */
export async function renderPdf(resumeData: ResumeData): Promise<Uint8Array> {
  await initWasm();
  const template = loadTemplate();
  
  const typstDataString = convertToTypstData(resumeData);
  
  // Check cache
  const cacheKey = hashString(template + typstDataString);
  const cached = pdfCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    const pdfBytes = compile_typst(template, typstDataString);
    const result = new Uint8Array(pdfBytes);
    
    // Update cache (LRU-style)
    if (pdfCache.size >= MAX_CACHE_SIZE) {
      const firstKey = pdfCache.keys().next().value;
      if (firstKey) pdfCache.delete(firstKey);
    }
    pdfCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Typst compilation error:', error);
    throw new Error(`Failed to compile PDF: ${error}`);
  }
}

/**
 * Clear the PDF cache
 */
export function clearCache(): void {
  pdfCache.clear();
}
