import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {MsEdgeTTS, OUTPUT_FORMAT} from 'msedge-tts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioDir = path.resolve(__dirname, '..');
const audioDir = path.join(studioDir, 'public', 'audio');
const manifestPath = path.join(studioDir, 'src', 'audio', 'vo-manifest.json');

fs.mkdirSync(audioDir, {recursive: true});
fs.mkdirSync(path.dirname(manifestPath), {recursive: true});

// Bersihkan file .wav lama agar folder audio rapi
for (const f of fs.readdirSync(audioDir)) {
  if (f.endsWith('.wav') || f.endsWith('.mp3')) {
    fs.unlinkSync(path.join(audioDir, f));
  }
}

const VOICE_NAME = 'id-ID-ArdiNeural';
const FPS = 30;
const GAP_FRAMES = 12;

const CLIPS = [
  {
    key: 'babak1',
    file: 'vo-babak1.mp3',
    text: 'RPL itu sama dengan cuma ngoding doang? Banyak yang mengira Software Engineering itu cuma soal nulis baris kode.',
  },
  {
    key: 'babak2',
    file: 'vo-babak2.mp3',
    text: 'Padahal, nulis kode tanpa rancangan seperti menumpuk bata tanpa cetak biru. Cepat tinggi, tapi rawan roboh.',
  },
  {
    key: 'step1',
    file: 'vo-step1.mp3',
    text: 'Pertama, Analisis Kebutuhan. Pahami dulu masalah dan kebutuhan pengguna sebelum menyentuh editor kode.',
  },
  {
    key: 'step2',
    file: 'vo-step2.mp3',
    text: 'Kedua, Arsitektur. Susun kode secara modular agar tim mudah berkolaborasi dan berkembang.',
  },
  {
    key: 'step3',
    file: 'vo-step3.mp3',
    text: 'Ketiga, Quality dan Testing. Pindai dan uji setiap fitur sebelum rilis agar aman dari bug.',
  },
  {
    key: 'step4',
    file: 'vo-step4.mp3',
    text: 'Keempat, Deploy dan Evolusi. Rilis ke pengguna, pantau performanya, dan iterasi terus menerus.',
  },
  {
    key: 'outro',
    file: 'vo-outro.mp3',
    text: 'Beyond Coding, Building the Right Software. Penasaran sama topik RPL lainnya? Yuk drop di kolom komentar, kalian mau kita bahas materi apa lagi selanjutnya!',
  },
];

const findFfprobe = () => {
  const candidates = [
    path.join(studioDir, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffprobe.exe'),
    path.join(studioDir, 'node_modules', '@remotion', 'compositor-win32-x64', 'ffprobe.exe'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
};

const getMp3DurationSeconds = (filePath, ffprobePath) => {
  if (ffprobePath) {
    try {
      const out = execFileSync(
        ffprobePath,
        ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', filePath],
        {encoding: 'utf8'}
      ).trim();
      const parsed = Number.parseFloat(out);
      if (Number.isFinite(parsed) && parsed > 0) {
        return Number(parsed.toFixed(3));
      }
    } catch {
      // fallback ke kalkulasi bitrate di bawah
    }
  }
  const bytes = fs.statSync(filePath).size;
  return Number(((bytes * 8) / 96000).toFixed(3));
};

const main = async () => {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE_NAME, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

  const ffprobePath = findFfprobe();
  console.log(`Generating Indonesian Neural VO with ${VOICE_NAME} (ffprobe: ${ffprobePath ? 'yes' : 'fallback'})...`);

  const manifest = {
    voiceName: VOICE_NAME,
    culture: 'id-ID',
    gender: 'Male',
    engine: 'Microsoft Edge Neural TTS',
    fps: FPS,
    totalFrames: 0,
    clips: {},
  };

  let cursorFrame = 0;

  for (const clip of CLIPS) {
    const tempDir = fs.mkdtempSync(path.join(audioDir, 'tmp-'));
    try {
      const {audioFilePath} = await tts.toFile(tempDir, clip.text, {rate: '+8%'});
      const finalPath = path.join(audioDir, clip.file);
      fs.renameSync(audioFilePath, finalPath);
      fs.rmSync(tempDir, {recursive: true, force: true});

      const durationSeconds = getMp3DurationSeconds(finalPath, ffprobePath);
      const durationFrames = Math.ceil(durationSeconds * FPS);
      const chapterStartFrame = cursorFrame;
      const audioStartFrame = chapterStartFrame + 6;
      const chapterEndFrame = audioStartFrame + durationFrames + GAP_FRAMES;

      manifest.clips[clip.key] = {
        file: `audio/${clip.file}`,
        chapterStartFrame,
        chapterEndFrame,
        audioStartFrame,
        durationSeconds,
        durationFrames,
        text: clip.text,
      };

      console.log(`${clip.key}: frames ${chapterStartFrame}..${chapterEndFrame} (audio @${audioStartFrame}, ${durationSeconds}s)`);
      cursorFrame = chapterEndFrame;
    } catch (err) {
      fs.rmSync(tempDir, {recursive: true, force: true});
      throw err;
    }
  }

  manifest.totalFrames = cursorFrame + 18;
  tts.close();

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Saved VO manifest -> ${manifestPath} (Total: ${manifest.totalFrames} frames / ${(manifest.totalFrames / FPS).toFixed(2)}s)`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
