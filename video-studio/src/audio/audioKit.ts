import {VideoThemeMode} from '../theme';

export const AUDIO_KIT = {
  bgm: {
    light: 'audio/bgm/bgm-tech-light.wav',
    dark: 'audio/bgm/bgm-tech-dark.wav',
  },
  sfx: {
    pop: 'audio/sfx/sfx-pop.wav',
    whoosh: 'audio/sfx/sfx-whoosh.wav',
    chime: 'audio/sfx/sfx-chime.wav',
    collapse: 'audio/sfx/sfx-collapse.wav',
    outroSting: 'audio/sfx/sfx-outro-sting.wav',
  },
} as const;

export const getBgmForTheme = (theme: VideoThemeMode): string => {
  return theme === 'dark' ? AUDIO_KIT.bgm.dark : AUDIO_KIT.bgm.light;
};
