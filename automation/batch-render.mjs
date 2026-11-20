import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

/**
 * SE Lab FILKOM UB - Local Batch Render Pipeline (Fase 2)
 * Membaca array JSON props (hasil export Google Sheets "SE Lab Engine -> 3. Export JSON Props"
 * atau format terstruktur seperti sample-queue.json), menyimpan props per episode,
 * dan merender video 3D Remotion secara otomatis.
 *
 * Penggunaan:
 *   node automation/batch-render.mjs automation/sample-queue.json
 *   node automation/batch-render.mjs automation/sample-queue.json --dry-run
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const studioDir = path.join(rootDir, 'video-studio');
const propsOutDir = path.join(studioDir, 'props');
const videoOutDir = path.join(studioDir, 'out', 'batch');

const args = process.argv.slice(2);
const queueArg = args.find((a) => !a.startsWith('--'));
const isDryRun = args.includes('--dry-run');

if (!queueArg) {
  console.error('Usage: node automation/batch-render.mjs <path-to-queue.json> [--dry-run]');
  process.exit(1);
}

const queuePath = path.isAbsolute(queueArg) ? queueArg : path.resolve(rootDir, queueArg);
if (!fs.existsSync(queuePath)) {
  console.error(`File queue tidak ditemukan: ${queuePath}`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const items = Array.isArray(raw) ? raw : [raw];

if (items.length === 0) {
  console.log('Queue kosong. Tidak ada video yang perlu dirender.');
  process.exit(0);
}

fs.mkdirSync(propsOutDir, {recursive: true});
fs.mkdirSync(videoOutDir, {recursive: true});

const toRemotionProps = (item) => {
  if (item.hookPrefix && Array.isArray(item.steps) && item.steps.length === 4) {
    return item;
  }

  // Konversi otomatis dari format export ringkas Google Sheets (Code.gs) ke skema ApaItuRplProps
  const id = String(item.id || 'RPL-000').trim();
  const title = String(item.title || 'Topik Software Engineering').trim();
  const hook = String(item.hook || title).trim();
  const words = hook.split(/\s+/);
  const highlight = words.length > 2 ? words[Math.min(2, words.length - 1)] : words[0] || 'RPL';
  const hookPrefix = words.slice(0, words.indexOf(highlight)).join(' ') || 'Kenalan Sama';
  const hookSuffix = words.slice(words.indexOf(highlight) + 1).join(' ');

  return {
    id,
    theme: item.theme === 'dark' ? 'dark' : 'light',
    hookPrefix,
    hookHighlight: highlight,
    hookSuffix,
    hookSubtitle: item.storyOutline || `Pembahasan singkat ${title} dari @se.lab.filkom.`,
    analogyTitle: title,
    analogySubtitle: 'Memahami konsep Software Engineering secara terstruktur agar sistem tahan lama.',
    steps: [
      {
        badge: '01 · ANALISIS KEBUTUHAN',
        title: 'Pahami Masalah Utama',
        subtitle: 'Mulai dari kebutuhan nyata pengguna sebelum menulis baris kode.',
      },
      {
        badge: '02 · ARSITEKTUR',
        title: 'Struktur Modular',
        subtitle: 'Susun komponen sistem agar rapi dan mudah dikelola tim.',
      },
      {
        badge: '03 · QUALITY & TESTING',
        title: 'Verifikasi Fitur',
        subtitle: 'Pastikan setiap alur diuji sebelum dirilis ke pengguna.',
      },
      {
        badge: '04 · DEPLOY & EVOLUSI',
        title: 'Rilis & Iterasi',
        subtitle: 'Pantau performa sistem dan lakukan perbaikan berkelanjutan.',
      },
    ],
    outroTagline: 'Beyond Coding: Building the Right Software.',
    outroCta: item.cta || 'Drop di komen! Mau kita bahas topik RPL apa lagi selanjutnya?',
  };
};

console.log(`Memproses ${items.length} item dari ${path.basename(queuePath)} (dryRun=${isDryRun})...`);

for (const rawItem of items) {
  const props = toRemotionProps(rawItem);
  const safeId = props.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const propsFile = path.join(propsOutDir, `${safeId}.json`);
  const outputMp4 = path.join(videoOutDir, `${safeId}.mp4`);

  fs.writeFileSync(propsFile, JSON.stringify(props, null, 2), 'utf8');
  console.log(`\n[${props.id}] Props tersimpan -> ${path.relative(rootDir, propsFile)} (theme=${props.theme})`);

  const remotionArgs = [
    'remotion',
    'render',
    'src/index.ts',
    'ApaItuRpl3D',
    outputMp4,
    `--props=${propsFile}`,
    '--gl=angle',
    '--concurrency=2',
  ];

  if (isDryRun) {
    console.log(`[DRY-RUN] npx ${remotionArgs.join(' ')}`);
    continue;
  }

  console.log(`[RENDER] Memulai render ke ${path.relative(rootDir, outputMp4)}...`);
  execFileSync('npx', remotionArgs, {
    cwd: studioDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

console.log('\nSelesai memproses seluruh queue!');
