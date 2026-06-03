const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const outDir = '.vercel/output';
fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync('dist/config.json', path.join(outDir, 'config.json'));
copyRecursive('dist/client', path.join(outDir, 'static'));
copyRecursive('dist/server', path.join(outDir, 'functions/__server.func'));
console.log('Vercel output prepared at .vercel/output/');
