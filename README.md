# Resume Generator - LaTeX Edition

A web-based resume generator that produces pixel-perfect PDFs using the popular Jake's Resume template (sb2nov). Built with React, TypeScript, and LaTeX compilation.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

## Features

- **Pixel-perfect Jake's Resume styling** - Uses the official sb2nov LaTeX template
- **Live PDF preview** - See changes as you type
- **No LaTeX installation needed** - Uses latex.online API for compilation
- **ATS-friendly output** - `\pdfgentounicode=1` ensures machine readability
- **Export options** - Download PDF or LaTeX source
- **Local storage** - Your resume is saved automatically
- **JSON import/export** - Backup and restore your data
- **Input validation** - Zod schemas ensure data integrity

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

**Quick Deploy:**

```bash
npm i -g vercel
vercel --prod
```

Or import from GitHub at [vercel.com/new](https://vercel.com/new)

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

**What gets deployed:**
- Frontend: Static React SPA served from Vercel CDN
- API: `/api/render` as a serverless function
- No environment variables needed!

## Project Structure

```
JakeGenV2/
├── api/                    # Vercel serverless functions
│   ├── render.ts          # PDF generation endpoint
│   ├── latex/
│   │   ├── escape.ts      # LaTeX character escaping
│   │   └── render.ts      # JSON → LaTeX conversion
│   └── types/
│       └── resume.ts      # Shared types & validation
├── src/
│   ├── App.tsx            # Main application
│   ├── data/
│   │   └── defaultResume.ts
│   ├── latex/
│   │   └── render-client.ts  # Client-side LaTeX renderer
│   ├── lib/
│   │   ├── api.ts         # API client
│   │   └── latex-compiler.ts # latex.online API client
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

## How It Works

1. **Form Input** - Edit your resume data in the React form interface
2. **LaTeX Generation** - Data is converted to LaTeX source using the Jake's Resume template
3. **PDF Compilation** - LaTeX is sent to latex.online API which compiles it to PDF
4. **Preview** - PDF is displayed in-browser for immediate feedback

All compilation happens via the latex.online service - no local LaTeX installation needed!

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
- LaTeX compilation: [latex.online](https://latexonline.cc)
