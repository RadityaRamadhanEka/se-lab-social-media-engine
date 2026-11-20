import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

/**
 * Generator Pustaka Audio Reusable (100% Original, Bebas Copyright IG Reels)
 * Menghasilkan:
 * - public/audio/sfx/*.wav  (pop, whoosh, chime, collapse, outro-sting)
 * - public/audio/bgm/*.wav  (bgm-tech-light.wav, bgm-tech-dark.wav - seamless loop)
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioDir = path.resolve(__dirname, '..');
const sfxDir = path.join(studioDir, 'public', 'audio', 'sfx');
const bgmDir = path.join(studioDir, 'public', 'audio', 'bgm');

fs.mkdirSync(sfxDir, {recursive: true});
fs.mkdirSync(bgmDir, {recursive: true});

const SAMPLE_RATE = 44100;

const writeWavMono = (filePath, samples) => {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
};

const normalize = (samples, targetPeak = 0.85) => {
  let max = 0;
  for (let i = 0; i < samples.length; i++) {
    const a = Math.abs(samples[i]);
    if (a > max) max = a;
  }
  if (max < 1e-6) return samples;
  const scale = targetPeak / max;
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    out[i] = samples[i] * scale;
  }
  return out;
};

const lowPass = (samples, alpha) => {
  const out = new Float32Array(samples.length);
  let prev = 0;
  for (let i = 0; i < samples.length; i++) {
    prev = prev + alpha * (samples[i] - prev);
    out[i] = prev;
  }
  return out;
};

const addSimpleReverb = (samples, delayMs = 65, decay = 0.32) => {
  const delaySamples = Math.floor((delayMs / 1000) * SAMPLE_RATE);
  const delay2 = Math.floor((delayMs * 1.618 / 1000) * SAMPLE_RATE);
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    let s = samples[i];
    if (i >= delaySamples) s += out[i - delaySamples] * decay;
    if (i >= delay2) s += out[i - delay2] * (decay * 0.55);
    out[i] = s;
  }
  return out;
};

const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// Warm Electric-Piano / Rhodes tone
const rhodesSample = (t, freq) => {
  return (
    Math.sin(2 * Math.PI * freq * t) * 0.65 +
    Math.sin(2 * Math.PI * freq * 2 * t) * 0.22 * Math.exp(-t * 5) +
    Math.sin(2 * Math.PI * freq * 3 * t) * 0.08 * Math.exp(-t * 9)
  );
};

// 1. SFX: UI Pop (0.18s)
const generatePop = () => {
  const dur = 0.18;
  const len = Math.floor(dur * SAMPLE_RATE);
  const buf = new Float32Array(len);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 520 * Math.exp(-t * 22) + 190;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.min(1, t / 0.006) * Math.exp(-t * 24);
    buf[i] = Math.sin(phase) * env;
  }
  return normalize(buf, 0.72);
};

// 2. SFX: Camera Whoosh (0.48s)
const generateWhoosh = () => {
  const dur = 0.48;
  const len = Math.floor(dur * SAMPLE_RATE);
  const raw = new Float32Array(len);
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed / 2147483647) * 2 - 1;
  };
  for (let i = 0; i < len; i++) {
    const u = i / len;
    const bell = Math.sin(Math.PI * u);
    const sweepTone = Math.sin(2 * Math.PI * (140 + 260 * Math.sin(Math.PI * u)) * (i / SAMPLE_RATE)) * 0.18;
    raw[i] = (rand() * 0.65 + sweepTone) * Math.pow(bell, 1.4);
  }
  return normalize(lowPass(raw, 0.11), 0.55);
};

// 3. SFX: Chime (0.65s)
const generateChime = () => {
  const dur = 0.65;
  const len = Math.floor(dur * SAMPLE_RATE);
  const buf = new Float32Array(len);
  const notes = [67, 71, 74, 79]; // G4, B4, D5, G5
  for (let n = 0; n < notes.length; n++) {
    const startIdx = Math.floor(n * 0.035 * SAMPLE_RATE);
    const freq = midiToFreq(notes[n]);
    for (let i = startIdx; i < len; i++) {
      const t = (i - startIdx) / SAMPLE_RATE;
      const env = Math.min(1, t / 0.008) * Math.exp(-t * 5.2);
      buf[i] += rhodesSample(t, freq) * env * 0.35;
    }
  }
  return normalize(addSimpleReverb(buf, 55, 0.28), 0.7);
};

// 4. SFX: Collapse / Error Thud (0.55s)
const generateCollapse = () => {
  const dur = 0.55;
  const len = Math.floor(dur * SAMPLE_RATE);
  const buf = new Float32Array(len);
  const hits = [0, 0.1, 0.21];
  for (let h = 0; h < hits.length; h++) {
    const start = Math.floor(hits[h] * SAMPLE_RATE);
    const baseFreq = 160 - h * 30;
    let phase = 0;
    for (let i = start; i < len; i++) {
      const t = (i - start) / SAMPLE_RATE;
      if (t > 0.22) break;
      const freq = baseFreq * Math.exp(-t * 14) + 48;
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;
      const env = Math.min(1, t / 0.005) * Math.exp(-t * 16);
      buf[i] += Math.sin(phase) * env * (1 - h * 0.15);
    }
  }
  return normalize(buf, 0.75);
};

// 5. SFX: SE Lab Signature Outro Sting (1.25s)
const generateOutroSting = () => {
  const dur = 1.25;
  const len = Math.floor(dur * SAMPLE_RATE);
  const buf = new Float32Array(len);
  const arp = [60, 64, 67, 71, 76]; // C4, E4, G4, B4, E5
  for (let n = 0; n < arp.length; n++) {
    const start = Math.floor(n * 0.065 * SAMPLE_RATE);
    const freq = midiToFreq(arp[n]);
    for (let i = start; i < len; i++) {
      const t = (i - start) / SAMPLE_RATE;
      const env = Math.min(1, t / 0.01) * Math.exp(-t * 3.1);
      buf[i] += rhodesSample(t, freq) * env * 0.34;
    }
  }
  return normalize(addSimpleReverb(buf, 75, 0.35), 0.78);
};

// 6. BGM Loop Generator (8 bars seamless tech-lo-fi corporate groove, 108 BPM)
const generateBgmLoop = (mode) => {
  const bpm = mode === 'light' ? 108 : 102;
  const beatDur = 60 / bpm;
  const barDur = beatDur * 4;
  const numBars = 4;
  const totalDur = barDur * numBars;
  const len = Math.floor(totalDur * SAMPLE_RATE);
  const buf = new Float32Array(len);

  const chords =
    mode === 'light'
      ? [
          [60, 64, 67, 71], // Cmaj7
          [57, 60, 64, 67], // Am7
          [53, 57, 60, 64], // Fmaj7
          [55, 59, 62, 67], // G6
        ]
      : [
          [57, 60, 64, 67], // Am7
          [53, 57, 60, 64], // Fmaj7
          [50, 53, 57, 60], // Dm7
          [52, 55, 59, 62], // Em7
        ];

  const bassRoots = mode === 'light' ? [36, 33, 29, 31] : [33, 29, 26, 28];

  // Warm Chords & Arpeggio pulse
  for (let bar = 0; bar < numBars; bar++) {
    const chord = chords[bar];
    const bassFreq = midiToFreq(bassRoots[bar]);
    const barStart = Math.floor(bar * barDur * SAMPLE_RATE);
    const barSamples = Math.floor(barDur * SAMPLE_RATE);

    // Pad / Chord on beat 1 & 3
    for (const hitBeat of [0, 2]) {
      const hitStart = barStart + Math.floor(hitBeat * beatDur * SAMPLE_RATE);
      for (let i = 0; i < Math.floor(beatDur * 2 * SAMPLE_RATE); i++) {
        const idx = (hitStart + i) % len;
        const t = i / SAMPLE_RATE;
        const env = Math.min(1, t / 0.03) * Math.exp(-t * 1.45);
        let sum = 0;
        for (const note of chord) {
          sum += rhodesSample(t, midiToFreq(note)) * 0.13;
        }
        buf[idx] += sum * env;
      }
    }

    // Soft rhythmic pluck on 8th notes
    for (let eighth = 0; eighth < 8; eighth++) {
      const noteMidi = chord[eighth % chord.length] + 12;
      const freq = midiToFreq(noteMidi);
      const stepStart = barStart + Math.floor(eighth * (beatDur / 2) * SAMPLE_RATE);
      const stepLen = Math.floor((beatDur / 2) * SAMPLE_RATE);
      for (let i = 0; i < stepLen; i++) {
        const idx = (stepStart + i) % len;
        const t = i / SAMPLE_RATE;
        const env = Math.min(1, t / 0.008) * Math.exp(-t * 8.5);
        buf[idx] += Math.sin(2 * Math.PI * freq * t) * env * 0.085;
      }
    }

    // Warm sub bass + soft kick pulse on beats 1 & 3
    for (let i = 0; i < barSamples; i++) {
      const idx = (barStart + i) % len;
      const t = i / SAMPLE_RATE;
      const beatPhase = (t % beatDur) / beatDur;
      const pulse = 0.65 + 0.35 * Math.sin(Math.PI * (1 - beatPhase));
      buf[idx] += Math.sin(2 * Math.PI * bassFreq * t) * 0.22 * pulse;
    }

    for (let beat = 0; beat < 4; beat++) {
      const kickStart = barStart + Math.floor(beat * beatDur * SAMPLE_RATE);
      // Soft kick on 0 and 2
      if (beat === 0 || beat === 2) {
        let phase = 0;
        for (let i = 0; i < Math.floor(0.14 * SAMPLE_RATE); i++) {
          const idx = (kickStart + i) % len;
          const t = i / SAMPLE_RATE;
          const f = 110 * Math.exp(-t * 28) + 46;
          phase += (2 * Math.PI * f) / SAMPLE_RATE;
          const env = Math.min(1, t / 0.004) * Math.exp(-t * 20);
          buf[idx] += Math.sin(phase) * env * 0.28;
        }
      }
      // Subtle hi-hat tick on off-beats
      const hatStart = kickStart + Math.floor((beatDur / 2) * SAMPLE_RATE);
      let s = 42 + beat;
      for (let i = 0; i < Math.floor(0.035 * SAMPLE_RATE); i++) {
        const idx = (hatStart + i) % len;
        s = (s * 16807) % 2147483647;
        const noise = (s / 2147483647) * 2 - 1;
        const t = i / SAMPLE_RATE;
        buf[idx] += noise * Math.exp(-t * 95) * 0.035;
      }
    }
  }

  return normalize(addSimpleReverb(buf, 48, 0.2), 0.55);
};

writeWavMono(path.join(sfxDir, 'sfx-pop.wav'), generatePop());
writeWavMono(path.join(sfxDir, 'sfx-whoosh.wav'), generateWhoosh());
writeWavMono(path.join(sfxDir, 'sfx-chime.wav'), generateChime());
writeWavMono(path.join(sfxDir, 'sfx-collapse.wav'), generateCollapse());
writeWavMono(path.join(sfxDir, 'sfx-outro-sting.wav'), generateOutroSting());

writeWavMono(path.join(bgmDir, 'bgm-tech-light.wav'), generateBgmLoop('light'));
writeWavMono(path.join(bgmDir, 'bgm-tech-dark.wav'), generateBgmLoop('dark'));

console.log('Generated reusable SE Lab Audio Kit:');
for (const dir of [sfxDir, bgmDir]) {
  for (const f of fs.readdirSync(dir)) {
    const size = fs.statSync(path.join(dir, f)).size;
    console.log(` - ${path.relative(studioDir, path.join(dir, f))} (${size} bytes)`);
  }
}
