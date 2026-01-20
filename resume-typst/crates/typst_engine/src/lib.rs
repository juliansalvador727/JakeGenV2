use wasm_bindgen::prelude::*;
use typst::foundations::{Bytes, Datetime, Smart};
use typst::text::{Font, FontBook};
use typst::Library;
use typst::World;
use typst::syntax::{FileId, Source, VirtualPath};
use typst::diag::FileResult;
use typst::eval::Tracer;
use comemo::Prehashed;
use std::collections::HashMap;
use std::sync::OnceLock;

mod utils;

// Embedded fonts - we'll use built-in fonts
static FONTS: OnceLock<(Prehashed<FontBook>, Vec<Font>)> = OnceLock::new();

fn fonts() -> &'static (Prehashed<FontBook>, Vec<Font>) {
    FONTS.get_or_init(|| {
        let fonts: Vec<Font> = typst_assets::fonts()
            .flat_map(|data| Font::iter(Bytes::from_static(data)))
            .collect();
        
        let book = FontBook::from_fonts(&fonts);
        (Prehashed::new(book), fonts)
    })
}

/// A minimal world for Typst compilation in WASM
struct WasmWorld {
    library: Prehashed<Library>,
    main_source: Source,
    files: HashMap<FileId, Bytes>,
}

impl WasmWorld {
    fn new(source_code: &str) -> Self {
        let main_id = FileId::new(None, VirtualPath::new("main.typ"));
        let main_source = Source::new(main_id, source_code.to_string());
        
        Self {
            library: Prehashed::new(Library::default()),
            main_source,
            files: HashMap::new(),
        }
    }
}

impl World for WasmWorld {
    fn library(&self) -> &Prehashed<Library> {
        &self.library
    }

    fn book(&self) -> &Prehashed<FontBook> {
        &fonts().0
    }

    fn main(&self) -> Source {
        self.main_source.clone()
    }

    fn source(&self, id: FileId) -> FileResult<Source> {
        if id == self.main_source.id() {
            Ok(self.main_source.clone())
        } else {
            Err(typst::diag::FileError::NotFound(id.vpath().as_rootless_path().into()))
        }
    }

    fn file(&self, id: FileId) -> FileResult<Bytes> {
        self.files.get(&id).cloned().ok_or_else(|| {
            typst::diag::FileError::NotFound(id.vpath().as_rootless_path().into())
        })
    }

    fn font(&self, index: usize) -> Option<Font> {
        fonts().1.get(index).cloned()
    }

    fn today(&self, _offset: Option<i64>) -> Option<Datetime> {
        Some(Datetime::from_ymd(2025, 1, 1).unwrap())
    }
}

fn compile_internal(source: &str) -> Result<Vec<u8>, String> {
    let world = WasmWorld::new(source);
    let mut tracer = Tracer::new();
    
    let document = typst::compile(&world, &mut tracer).map_err(|errors| {
        errors
            .iter()
            .map(|e| format!("{:?}", e))
            .collect::<Vec<_>>()
            .join("\n")
    })?;

    let pdf_bytes = typst_pdf::pdf(&document, Smart::Auto, None);
    Ok(pdf_bytes)
}

/// Compile Typst source to PDF bytes
#[wasm_bindgen]
pub fn compile_typst(template_source: &str, data_json: &str) -> Result<Vec<u8>, JsValue> {
    utils::set_panic_hook();
    
    // Replace the DATA placeholder with actual JSON data
    let source = template_source.replace("\"__RESUME_DATA__\"", data_json);
    
    compile_internal(&source)
        .map_err(|e| JsValue::from_str(&e))
}

/// Initialize the WASM module (pre-load fonts)
#[wasm_bindgen]
pub fn init_engine() {
    utils::set_panic_hook();
    // Pre-initialize fonts
    let _ = fonts();
}
