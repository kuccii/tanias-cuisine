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

if (fs.existsSync('dist/config.json')) {
  fs.copyFileSync('dist/config.json', path.join(outDir, 'config.json'));
} else {
  fs.writeFileSync(path.join(outDir, 'config.json'), JSON.stringify({
    version: 3,
    framework: { name: 'nitro', version: '3.0.260429-beta' },
    overrides: {},
    routes: [
      { headers: { 'cache-control': 'public, max-age=31536000, immutable' }, src: '/assets/(.*)' },
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/__server' },
    ],
  }, null, 2));
}
copyRecursive('dist/client', path.join(outDir, 'static'));
copyRecursive('dist/server', path.join(outDir, 'functions/__server.func'));
console.log('Vercel output prepared at .vercel/output/');
