# Resume Generator - Jake's Style

A browser-based resume generator that replicates the classic Jake Gutierrez LaTeX resume template using **Typst + WASM** instead of LaTeX. No server required - everything runs in the browser.

## Features

- **Jake's Resume Style**: Exact visual replication of the popular LaTeX template
- **Real-time Preview**: See PDF updates as you type (debounced)
- **In-Browser Compilation**: Typst compiles to PDF via WebAssembly - no server needed
- **ATS-Friendly**: Generated PDFs have selectable, searchable text
- **One-Click Export**: Download your resume as a PDF
- **Data Persistence**: Your resume is saved in localStorage
- **Import/Export JSON**: Easily backup and restore your resume data

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Typesetting**: Typst (compiled to WASM)
- **PDF Generation**: typst-pdf (embedded in WASM)

## Local Development

### Prerequisites

- Node.js 18+ and npm
- (Optional) Rust toolchain + wasm-pack (only needed to rebuild WASM)

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run preview` | Preview production build |
| `npm run build:wasm` | Rebuild WASM from Rust source (requires Rust) |
| `npm run check:wasm` | Verify WASM files exist |

## Rebuilding WASM (Optional)

The WASM module is pre-built and committed to `wasm/typst_engine_pkg/`. You only need to rebuild it if you modify the Rust code.

### Requirements

1. Install Rust: https://rustup.rs/
2. Add WASM target:
   ```bash
   rustup target add wasm32-unknown-unknown
   ```
3. Install wasm-pack:
   ```bash
   cargo install wasm-pack
   ```

### Rebuild

```bash
npm run build:wasm
```

This will:
1. Compile the Rust crate at `crates/typst_engine`
2. Output WASM to `wasm/typst_engine_pkg/`

**Important**: After rebuilding, commit the changes to `wasm/typst_engine_pkg/`.

## Deployment on Vercel

This project is designed to deploy on Vercel without any Rust toolchain.

### Steps

1. Push to GitHub
2. Import project in Vercel
3. Use default settings (Vercel auto-detects Vite)

**That's it!** Vercel will run `npm run build` which only needs Node.js.

### Why No Rust on Vercel?

The WASM files in `wasm/typst_engine_pkg/` are pre-built and committed:
- `typst_engine.js` - JavaScript wrapper
- `typst_engine_bg.wasm` - Compiled WASM binary (~23MB with fonts)
- `typst_engine.d.ts` - TypeScript definitions

Vercel's build only runs:
```bash
npm ci
npm run build  # → tsc && vite build
```

No Rust compilation happens during deployment.

## Project Structure

```
resume-typst/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main app with state management
│   ├── styles.css            # Global styles
│   ├── model/
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── defaultResume.ts  # Sample resume data
│   │   └── validate.ts       # Validation logic
│   ├── ui/
│   │   ├── Form.tsx          # Main form container
│   │   ├── Preview.tsx       # PDF preview panel
│   │   ├── Toolbar.tsx       # Download/Import/Export buttons
│   │   └── sections/         # Form sections
│   └── typst/
│       ├── template.typ      # Typst template (Jake's style)
│       └── render.ts         # WASM interface
├── crates/
│   └── typst_engine/         # Rust WASM crate
│       ├── Cargo.toml
│       └── src/lib.rs
├── wasm/
│   └── typst_engine_pkg/     # Pre-built WASM (COMMITTED)
│       ├── typst_engine.js
│       ├── typst_engine_bg.wasm
│       └── typst_engine.d.ts
├── package.json
├── vite.config.ts
├── vercel.json
└── README.md
```

## Resume Data Format

The resume data is a JSON object with this structure:

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
  education: Array<{
    school: string;
    location: string;
    degree: string;
    dates: string;
    extra?: string;
  }>;
  experience: Array<{
    organization: string;
    location: string;
    role: string;
    dates: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    techStack: string;
    dates: string;
    bullets: string[];
  }>;
  skills: Array<{
    name: string;
    items: string[];
  }>;
}
```

## License

MIT
