#!/usr/bin/env node
/**
 * PADELANALYZER — MIGRATION IMAGES
 * 
 * Ce script télécharge les 211 images de padelful.com
 * et met à jour rackets-db.json avec des URLs locales.
 * 
 * Les images seront servies directement par Vercel CDN.
 * 
 * USAGE :
 *   1. Mettre ce script + rackets-db.json dans un même dossier
 *   2. node migrate-images.js
 *   3. Les images sont dans ./public/images/rackets/
 *   4. Le fichier rackets-db-migrated.json contient les nouvelles URLs
 *   5. Copier le dossier public/images dans ton projet Vercel
 *   6. Remplacer rackets-db.json par rackets-db-migrated.json
 *   7. Rebuild et deploy
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'rackets-db.json';
const OUTPUT_FILE = 'rackets-db-migrated.json';
const IMAGE_DIR = path.join('public', 'images', 'rackets');
const BASE_URL = '/images/rackets'; // URL relative servie par Vercel

// Create output directory
fs.mkdirSync(IMAGE_DIR, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; PadelAnalyzer/1.0)',
        'Referer': 'https://padelanalyzer.fr'
      },
      timeout: 30000 
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    
    request.on('error', (err) => {
      file.close();
      try { fs.unlinkSync(dest); } catch {}
      reject(err);
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('🏓 PadelAnalyzer — Migration des images\n');
  
  // Load database
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Fichier ${INPUT_FILE} introuvable. Place-le dans le même dossier.`);
    process.exit(1);
  }
  
  const db = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  console.log(`📦 ${db.length} raquettes dans la base`);
  
  const toDownload = db.filter(r => r.imageUrl && r.imageUrl.startsWith('http'));
  const noImage = db.filter(r => !r.imageUrl);
  console.log(`🖼️  ${toDownload.length} images à télécharger`);
  console.log(`⚠️  ${noImage.length} raquettes sans image\n`);
  
  let success = 0;
  let failed = 0;
  const errors = [];
  
  for (let i = 0; i < toDownload.length; i++) {
    const racket = toDownload[i];
    const url = racket.imageUrl;
    
    // Extract filename from URL or generate from ID
    const urlFilename = url.split('/').pop().split('?')[0];
    const ext = path.extname(urlFilename) || '.png';
    const filename = racket.id + ext;
    const dest = path.join(IMAGE_DIR, filename);
    
    // Skip if already downloaded
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      racket.imageUrl = `${BASE_URL}/${filename}`;
      success++;
      process.stdout.write(`\r✅ ${success + failed}/${toDownload.length} — ${racket.shortName || racket.name} (cache)`);
      continue;
    }
    
    try {
      await downloadFile(url, dest);
      racket.imageUrl = `${BASE_URL}/${filename}`;
      success++;
      process.stdout.write(`\r✅ ${success + failed}/${toDownload.length} — ${racket.shortName || racket.name}        `);
      
      // Polite delay to avoid rate-limiting
      await sleep(200);
    } catch (err) {
      failed++;
      errors.push({ name: racket.name, url, error: err.message });
      process.stdout.write(`\r❌ ${success + failed}/${toDownload.length} — ${racket.shortName || racket.name} FAILED  `);
      // Keep original URL on failure
    }
  }
  
  console.log('\n');
  console.log(`✅ Succès: ${success}/${toDownload.length}`);
  if (failed > 0) {
    console.log(`❌ Échecs: ${failed}`);
    errors.forEach(e => console.log(`   - ${e.name}: ${e.error}`));
  }
  
  // Calculate total size
  let totalSize = 0;
  const files = fs.readdirSync(IMAGE_DIR);
  files.forEach(f => { totalSize += fs.statSync(path.join(IMAGE_DIR, f)).size; });
  console.log(`\n📁 ${files.length} fichiers dans ${IMAGE_DIR} (${(totalSize / 1024 / 1024).toFixed(1)} MB)`);
  
  // Save updated database
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`💾 ${OUTPUT_FILE} sauvegardé avec les nouvelles URLs\n`);
  
  console.log('PROCHAINES ÉTAPES :');
  console.log(`  1. Copie le dossier ${IMAGE_DIR} dans ton projet Vercel`);
  console.log(`  2. Renomme ${OUTPUT_FILE} → rackets-db.json`);
  console.log('  3. Rebuild : npx esbuild entry.jsx --bundle --minify --outfile=bundle.js --loader:.jsx=jsx --define:process.env.NODE_ENV="\'production\'"');
  console.log('  4. Deploy sur Vercel');
  console.log('  5. Vérifie que les images chargent sur padelanalyzer.fr');
}

main().catch(err => {
  console.error('💥 Erreur fatale:', err.message);
  process.exit(1);
});
