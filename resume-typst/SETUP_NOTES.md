# Setup Notes

## Issues Fixed

### 1. Missing WASM Module ✅ FIXED

**Problem:**
```
Failed to resolve import "../../wasm/typst_engine_pkg/typst_engine.js"
```

**Solution:**
Built the WASM module from Rust source:
```bash
npm run build:wasm
```

This compiled the Rust crate at `crates/typst_engine` and generated:
- `wasm/typst_engine_pkg/typst_engine.js` - JavaScript bindings
- `wasm/typst_engine_pkg/typst_engine_bg.wasm` - WebAssembly binary (~27MB)
- `wasm/typst_engine_pkg/typst_engine.d.ts` - TypeScript definitions

**Note:** The WASM optimization step (`wasm-opt`) takes a very long time due to the large file size. For development, the unoptimized version works fine.

### 2. Development Server Status ✅ WORKING

The Vite development server is now running successfully at http://localhost:5174/

No TypeScript errors detected.

## Known Issues (Non-Critical)

### NPM Audit Vulnerabilities

**Status:** Not fixed (breaking changes required)

```
2 moderate severity vulnerabilities in esbuild/vite
```

**Details:**
- Affects: esbuild <=0.24.2 (development server only)
- Impact: Development server vulnerability (not production)
- Fix requires: Upgrading to Vite 7.3.1 + React 19 (breaking changes)

**Recommendation:** 
These vulnerabilities only affect the development server, not production builds. Consider upgrading when ready to handle breaking changes from React 18→19 and Vite 5→7.

## Next Steps

1. ✅ WASM module built
2. ✅ Development server running
3. ✅ No TypeScript errors
4. ⏭️  (Optional) Add project to git
5. ⏭️  (Optional) Upgrade dependencies when ready for breaking changes

## Quick Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Rebuild WASM (only if you modify Rust code)
npm run build:wasm

# Check for issues
npm run check:wasm
npx tsc --noEmit
```
