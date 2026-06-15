import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Append explicit .js extensions to extensionless relative ESM specifiers so the
// compiled output runs under Node's strict ESM resolver.
//
// Idempotent: a specifier that already ends in an extension (e.g. ".js" / ".json")
// is left untouched. The previous version appended ".js" unconditionally, which
// turned already-correct "./routes/routes.js" into "./routes/routes.js.js" and
// crashed the server on startup.
function needsJs(spec) {
  const isRelative = spec.startsWith('./') || spec.startsWith('../');
  if (!isRelative) return false;
  // Already has an extension on the final path segment? Leave it alone.
  const lastSegment = spec.split('/').pop();
  return !/\.[a-zA-Z0-9]+$/.test(lastSegment);
}

function fixSpecifiers(content) {
  // `import ... from '...'` and `export ... from '...'`
  content = content.replace(
    /((?:import|export)\b[^'"]*?\bfrom\s*)(['"])(\.\.?\/[^'"]+)\2/g,
    (match, pre, quote, spec) => (needsJs(spec) ? `${pre}${quote}${spec}.js${quote}` : match)
  );
  // Bare side-effect imports: `import '...'`
  content = content.replace(
    /(\bimport\s*)(['"])(\.\.?\/[^'"]+)\2/g,
    (match, pre, quote, spec) => (needsJs(spec) ? `${pre}${quote}${spec}.js${quote}` : match)
  );
  // Dynamic `import('...')` and `require('...')`
  content = content.replace(
    /((?:import|require)\s*\(\s*)(['"])(\.\.?\/[^'"]+)\2(\s*\))/g,
    (match, pre, quote, spec, post) => (needsJs(spec) ? `${pre}${quote}${spec}.js${quote}${post}` : match)
  );
  return content;
}

// Recurse the dist directory and rewrite import paths in every .js file.
function updateImportPaths(dir) {
  readdirSync(dir).forEach((file) => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      updateImportPaths(filePath);
    } else if (filePath.endsWith('.js')) {
      const content = readFileSync(filePath, 'utf8');
      const updatedContent = fixSpecifiers(content);
      if (content !== updatedContent) {
        writeFileSync(filePath, updatedContent, 'utf8');
      }
    }
  });
}

// Run the function on the 'dist' directory
const distDir = 'dist'; // Adjust if your output directory is named differently
updateImportPaths(distDir);
