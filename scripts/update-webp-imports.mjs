import { readFileSync, writeFileSync, globSync } from 'fs';

const files = globSync('src/**/*.{ts,tsx}');
let total = 0;

for (const f of files) {
  let content = readFileSync(f, 'utf-8');
  const orig = content;

  // Only replace .jpg/.jpeg/.png → .webp inside @/assets import paths
  content = content.replace(/(@\/assets\/[^"']+)\.(jpg|jpeg|png)(["'])/gi, '$1.webp$3');

  if (content !== orig) {
    writeFileSync(f, content);
    total++;
    console.log(`  ${f.split(/[/\\]/).pop()} updated`);
  }
}

console.log(`\n${total} files updated`);
