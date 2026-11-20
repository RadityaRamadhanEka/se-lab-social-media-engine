import voManifest from './vo-manifest.json';

export type ChapterKey = 'babak1' | 'babak2' | 'step1' | 'step2' | 'step3' | 'step4' | 'outro';

export interface VoClipEntry {
  file: string;
  chapterStartFrame: number;
  chapterEndFrame: number;
  audioStartFrame: number;
  durationSeconds: number;
  durationFrames: number;
  text: string;
}

export const TIMELINE = {
  fps: voManifest.fps,
  totalFrames: voManifest.totalFrames,
  voiceName: voManifest.voiceName,
  clips: voManifest.clips as Record<ChapterKey, VoClipEntry>,
};

export const CHAPTER_KEYS: ChapterKey[] = [
  'babak1',
  'babak2',
  'step1',
  'step2',
  'step3',
  'step4',
  'outro',
];

export const getActiveChapter = (frame: number): ChapterKey => {
  for (const key of CHAPTER_KEYS) {
    const c = TIMELINE.clips[key];
    if (frame >= c.chapterStartFrame && frame < c.chapterEndFrame) {
      return key;
    }
  }
  return 'outro';
};

export const isNarratorSpeaking = (frame: number): boolean => {
  for (const key of CHAPTER_KEYS) {
    const c = TIMELINE.clips[key];
    if (frame >= c.audioStartFrame && frame <= c.audioStartFrame + c.durationFrames) {
      return true;
    }
  }
  return false;
};
