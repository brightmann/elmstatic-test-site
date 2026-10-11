import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const base = process.argv[2];
if (!base || !/^\/[A-Za-z0-9_.-]+\/$/.test(base)) throw new Error('Expected project base path, e.g. /elmstatic-test-site/');
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      const updated = html.replace(/\b(href|src|action)=(['"])\/(?!\/)/g, (_, attr, quote) => `${attr}=${quote}${base}`);
      await writeFile(path, updated);
    } else if (entry.name.endsWith('.css')) {
      const css = await readFile(path, 'utf8');
      await writeFile(path, css.replace(/url\((['"]?)\/(?!\/)/g, (_, quote) => `url(${quote}${base}`));
    }
  }
}
await walk('docs');
await writeFile('docs/.nojekyll', '');
