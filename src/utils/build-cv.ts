// Compiles src/data/cv.typ to public/cv.pdf via typst-ts-node-compiler.
// Called from src/pages/cv/index.astro's frontmatter (similar to how Head.astro
// calls generateOgImage). Avoids needing a system-wide Typst install.

import { NodeCompiler, type NodeTypstCompileResult } from "@myriaddreamin/typst-ts-node-compiler";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const MAIN = resolve(ROOT, "src/data/cv.typ");
const PDF_OUT = resolve(ROOT, "public/cv.pdf");
const DIST_PDF_OUT = resolve(ROOT, "dist/cv.pdf");

// Reuse a single compiler across calls -- its global cache makes repeat compiles fast
// (matters in dev where frontmatter reruns on every request to /cv).
let compiler: NodeCompiler | undefined;
function getCompiler(): NodeCompiler {
	if (!compiler) compiler = NodeCompiler.create({ workspace: ROOT });
	return compiler;
}

function reportDiagnostics(result: NodeTypstCompileResult, label: string): void {
	if (result.hasError()) {
		console.error(`[cv] ${label} failed:`);
		result.printErrors();
		throw new Error(`typst ${label} failed`);
	}
	result.printDiagnostics();
}

export function buildCv(): void {
	const compiler = getCompiler();

	// Drop stale cache entries so source edits are picked up.
	compiler.evictCache(10);

	const doc = compiler.compile({ mainFilePath: MAIN });
	reportDiagnostics(doc, "PDF compile");

	const pdfBytes = new Uint8Array(compiler.pdf(doc.result!));
	mkdirSync(dirname(PDF_OUT), { recursive: true });
	writeFileSync(PDF_OUT, pdfBytes);

	// During `astro build` the public/->dist/ copy has already finished by the
	// time frontmatter runs, so writes to public/ don't end up in dist/. Mirror
	// the PDF straight into dist/ so the build artifact contains it. Skip in
	// dev (no dist/ to populate).
	if (process.env.NODE_ENV === "production") {
		mkdirSync(dirname(DIST_PDF_OUT), { recursive: true });
		writeFileSync(DIST_PDF_OUT, pdfBytes);
	}
}
