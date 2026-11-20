import {continueRender, delayRender, staticFile} from 'remotion';
import tokens from '../../design-tokens/se-lab-tokens.json';

let fontsLoaded = false;

const loadLocalBrandFonts = () => {
  if (fontsLoaded || typeof document === 'undefined' || typeof FontFace === 'undefined') {
    return;
  }
  fontsLoaded = true;
  const handle = delayRender('Loading local SE Lab fonts');

  Promise.all([
    new FontFace('Days One', `url(${staticFile('fonts/DaysOne-Regular.woff2')})`, {
      style: 'normal',
      weight: '400',
    }).load(),
    new FontFace('Plus Jakarta Sans', `url(${staticFile('fonts/PlusJakartaSans-Variable.woff2')})`, {
      style: 'normal',
      weight: '200 800',
    }).load(),
  ])
    .then((loadedFaces) => {
      loadedFaces.forEach((face) => document.fonts.add(face));
      continueRender(handle);
    })
    .catch((err) => {
      console.error('Failed to load local fonts:', err);
      continueRender(handle);
    });
};

loadLocalBrandFonts();

export const FONTS = {
  display: '"Days One", sans-serif',
  body: '"Plus Jakarta Sans", sans-serif',
};

export const BRAND_TOKENS = tokens;

export type VideoThemeMode = 'light' | 'dark';

export interface StagePalette {
  mode: VideoThemeMode;
  bgGradient: string;
  canvasBg: string;
  gridPrimary: string;
  gridSecondary: string;
  headlineColor: string;
  subtitleColor: string;
  cardBg: string;
  cardBorder: string;
  pillBg: string;
  pillText: string;
  bluePrimary: string;
  blueDark: string;
  blueLight: string;
  orangeAccent: string;
  purpleGlow: string;
  navyBar: string;
}

export const getStagePalette = (mode: VideoThemeMode): StagePalette => {
  const {blue, orange, purple, brandExtras} = tokens.colors;

  if (mode === 'dark') {
    return {
      mode: 'dark',
      bgGradient: `radial-gradient(circle at 50% 25%, ${purple.dark} 0%, ${blue.darker} 55%, #020817 100%)`,
      canvasBg: blue.darker,
      gridPrimary: blue.normal,
      gridSecondary: purple.normal,
      headlineColor: '#ffffff',
      subtitleColor: blue.light,
      cardBg: 'rgba(3, 37, 74, 0.72)',
      cardBorder: 'rgba(178, 209, 242, 0.28)',
      pillBg: orange.normal,
      pillText: '#03254a',
      bluePrimary: blue.normal,
      blueDark: blue.dark,
      blueLight: blue.light,
      orangeAccent: orange.normal,
      purpleGlow: purple.normal,
      navyBar: brandExtras.deepNavyBar,
    };
  }

  return {
    mode: 'light',
    bgGradient: `linear-gradient(180deg, ${blue.light} 0%, #f5f9ff 48%, #ffffff 100%)`,
    canvasBg: blue.light,
    gridPrimary: '#b2d1f2',
    gridSecondary: '#d8defa',
    headlineColor: '#0f172a',
    subtitleColor: '#1e293b',
    cardBg: 'rgba(255, 255, 255, 0.84)',
    cardBorder: 'rgba(8, 106, 212, 0.22)',
    pillBg: brandExtras.deepNavyBar,
    pillText: '#ffffff',
    bluePrimary: blue.normal,
    blueDark: blue.dark,
    blueLight: blue.light,
    orangeAccent: orange.normal,
    purpleGlow: purple.normal,
    navyBar: brandExtras.deepNavyBar,
  };
};
