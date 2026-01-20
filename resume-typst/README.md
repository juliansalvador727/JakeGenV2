# Resume Generator - LaTeX Edition

A web-based resume generator that produces pixel-perfect PDFs using the popular Jake's Resume template (sb2nov). Built with React, TypeScript, and WebAssembly-based LaTeX compilation.

## Features

- **Pixel-perfect Jake's Resume styling** - Uses the official sb2nov LaTeX template
- **Live PDF preview** - See changes as you type
- **Client-side compilation** - No server required for PDF generation
- **ATS-friendly output** - `\pdfgentounicode=1` ensures machine readability
- **Export options** - Download PDF or LaTeX source
- **Local storage** - Your resume is saved automatically
- **JSON import/export** - Backup and restore your data

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React Form    │ --> │  LaTeX Renderer  │ --> │  latex.online   │
│   (Editor)      │     │  (JSON → .tex)   │     │  (Compilation)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          v
                                                   ┌─────────────┐
                                                   │  PDF Viewer │
                                                   │  (Preview)  │
                                                   └─────────────┘
```

### Key Components

- **Frontend** (`/src/`) - React/Vite/TypeScript UI
- **LaTeX Renderer** (`/src/latex/render-client.ts`) - Converts JSON to LaTeX
- **LaTeX Compiler** (`/src/lib/latex-compiler.ts`) - Uses latex.online API for PDF compilation
- **API Route** (`/api/render.ts`) - Server-side compilation endpoint (also uses latex.online)

### Compilation Approach

This app uses [latex.online](https://latexonline.cc) for LaTeX → PDF compilation:
- **Free and open** - No API key required
- **Privacy-respecting** - No data retention
- **Reliable** - Full TeX Live distribution
- **Fast** - Sub-second compilation for typical resumes

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Deploying to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy!

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

The app works entirely client-side by default. The `/api/render` endpoint is optional and uses the latex.online service for server-side compilation.

## Project Structure

```
resume-typst/
├── api/                    # Vercel serverless functions
│   ├── render.ts          # PDF generation endpoint
│   └── latex/
│       ├── escape.ts      # LaTeX character escaping
│       ├── render.ts      # JSON → LaTeX conversion
│       └── template.tex   # Jake's resume template
├── src/
│   ├── App.tsx            # Main application
│   ├── data/
│   │   └── defaultResume.ts
│   ├── latex/
│   │   └── render-client.ts  # Client-side LaTeX renderer
│   ├── lib/
│   │   ├── api.ts         # API client
│   │   └── latex-compiler.ts # WASM compiler wrapper
│   ├── types/
│   │   └── resume.ts      # Zod schemas & types
│   └── ui/                # React components
├── package.json
├── vite.config.ts
└── vercel.json
```

## Data Model

```typescript
interface ResumeData {
  header: {
    name: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
}
```

See `/src/types/resume.ts` for full schema with Zod validation.

## LaTeX Template

The template uses Jake's Resume commands:

- `\resumeSubheading{Title}{Date}{Subtitle}{Location}`
- `\resumeProjectHeading{Title | Tech}{Date}`
- `\resumeItem{Bullet point text}`

Template settings:
- Paper: `letterpaper`, 11pt
- Margins: 0.5in all sides
- Font: Computer Modern (LaTeX default)
- ATS-compatible: `\pdfgentounicode=1`

## Migration from Typst

If you were using the previous Typst-based version:

### Files to Delete

```
/src/typst/              # Old Typst renderer
/src/model/              # Old types (replaced by /src/types/)
/crates/                 # Rust WASM crate
/wasm/                   # Typst WASM output
```

### Data Compatibility

The new data model is compatible with the old one, except:
- `formatting` field is removed (Jake's template has fixed formatting)
- Data is validated with Zod schemas

Your saved resume JSON should still work. If you have a `formatting` field, it will be ignored.

### Key Differences

| Feature | Old (Typst) | New (LaTeX) |
|---------|-------------|-------------|
| Template | Custom Typst | sb2nov Jake's |
| Compiler | Rust WASM | SwiftLaTeX WASM |
| Formatting | Adjustable | Fixed |
| Output | Similar to Jake | Identical to Jake |

## Validation Limits

- Name: 100 chars
- Field length: 200 chars  
- Bullet length: 500 chars
- Max bullets per section: 10
- Max education entries: 5
- Max experience entries: 10
- Max project entries: 10
- Max skill categories: 10
- Total data size: 50KB

## License

MIT License - Based on [sb2nov/resume](https://github.com/sb2nov/resume)

## Credits

- Original LaTeX template: [Sourabh Bajaj](https://github.com/sb2nov)
- Jake's modifications: [Jake Gutierrez](https://github.com/jakegut)
- SwiftLaTeX: [SwiftLaTeX Team](https://github.com/SwiftLaTeX/SwiftLaTeX)
