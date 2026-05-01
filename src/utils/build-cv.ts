// Compiles the CV from src/pages/cv/_cv.typ via the bundled typst-ts-node-compiler.
// Returns the HTML output and writes the PDF to public/cv.pdf.
//
// Called from src/pages/cv/index.astro's frontmatter (similar to how Head.astro
// calls generateOgImage). Avoids needing a system-wide Typst install.
//
// Also runnable directly: `node src/utils/build-cv.ts`. The `build` npm script
// invokes it once before `astro build` so public/cv.pdf exists before Astro
// snapshots public/ → dist/ (writes from frontmatter happen too late for that copy).

import {
	NodeCompiler,
	NodeHtmlOutputExecResult,
	type NodeTypstCompileResult,
} from "@myriaddreamin/typst-ts-node-compiler";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const MAIN = resolve(ROOT, "src/pages/cv/cv.typ");
const PDF_OUT = resolve(ROOT, "public/cv.pdf");
const PDF_PARENT = dirname(PDF_OUT);
const DIST_PDF_OUT = resolve(ROOT, "dist/cv.pdf");
const DIST_PDF_PARENT = dirname(DIST_PDF_OUT);

// Reuse a single compiler across calls — its global cache makes repeat compiles fast
// (matters in dev where frontmatter reruns on every request to /cv).
let compiler: NodeCompiler | undefined;
function getCompiler(): NodeCompiler {
	if (!compiler) compiler = NodeCompiler.create({ workspace: ROOT });
	return compiler;
}

function reportDiagnostics(
	result: NodeTypstCompileResult | NodeHtmlOutputExecResult,
	label: string,
): void {
	if (result.hasError()) {
		console.error(`[cv] ${label} failed:`);
		result.printErrors();
		throw new Error(`typst ${label} failed`);
	}
	result.printDiagnostics();
}

export async function buildCv(): Promise<string> {
	const compiler = getCompiler();

	// Drop stale cache entries so source edits are picked up.
	compiler.evictCache(10);

	// Compile the PDF first since it's the primary output and we want to fail fast if it doesn't work.
	const pdfDoc = compiler.compile({ mainFilePath: MAIN });
	reportDiagnostics(pdfDoc, "PDF compile");

	// Write the PDF output to public/cv.pdf so the dev server serves it.
	const pdfBuf = compiler.pdf(pdfDoc.result!);
	const pdfBytes = new Uint8Array(pdfBuf);
	mkdirSync(PDF_PARENT, { recursive: true });
	writeFileSync(PDF_OUT, pdfBytes);

	// During `astro build` the public/→dist/ copy has already finished by the
	// time frontmatter runs, so writes to public/ don't end up in dist/. Mirror
	// the PDF straight into dist/ so the build artifact (and the Cloudflare
	// deploy) contains it. Skip in dev (no dist/ to populate).
	if (process.env.NODE_ENV === "production") {
		mkdirSync(DIST_PDF_PARENT, { recursive: true });
		writeFileSync(DIST_PDF_OUT, pdfBytes);
	}

	// Compile the HTML output for use in the /cv page.
	const htmlRes = compiler.tryHtml({
		mainFilePath: MAIN,
		inputs: { target: "html" },
	});
	reportDiagnostics(htmlRes, "HTML compile");

	// Extract the HTML string from the result. It should always be present since tryHtml doesn't error on HTML generation failure, but check just in case.
	const html = htmlRes.result?.html();
	if (!html) throw new Error("typst HTML compile produced no output");
	return html;
}
