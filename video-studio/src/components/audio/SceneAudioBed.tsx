import React from 'react';
import {Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {AUDIO_KIT, getBgmForTheme} from '../../audio/audioKit';
import {VideoThemeMode} from '../../theme';

interface SceneAudioBedProps {
  theme: VideoThemeMode;
  isSpeaking: (frame: number) => boolean;
  popFrames?: number[];
  whooshFrames?: number[];
  chimeFrames?: number[];
  collapseFrames?: number[];
  outroStingFrame?: number;
}

/**
 * Komponen Audio Bed Reusable untuk seluruh video 3D SE Lab:
 * - BGM adaptif tema (light / dark) looping seamless
 * - Auto-ducking volume BGM ketika narator VO berbicara
 * - Slot SFX reusable (pop, whoosh, chime, collapse, outro sting)
 */
export const SceneAudioBed: React.FC<SceneAudioBedProps> = ({
  theme,
  isSpeaking,
  popFrames = [],
  whooshFrames = [],
  chimeFrames = [],
  collapseFrames = [],
  outroStingFrame,
}) => {
  const {durationInFrames} = useVideoConfig();

  const bgmVolume = (frame: number): number => {
    const fadeIn = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const fadeOut = interpolate(frame, [durationInFrames - 35, durationInFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    // Smooth 8-frame lookaround ducking agar transisi volume BGM halus saat VO mulai/berhenti
    let speakingRatio = 0;
    const windowRadius = 4;
    for (let offset = -windowRadius; offset <= windowRadius; offset++) {
      if (isSpeaking(Math.max(0, frame + offset))) {
        speakingRatio += 1;
      }
    }
    speakingRatio /= windowRadius * 2 + 1;

    const baseLevel = interpolate(speakingRatio, [0, 1], [0.3, 0.12]);
    return baseLevel * fadeIn * fadeOut;
  };

  return (
    <>
      <Audio src={staticFile(getBgmForTheme(theme))} loop volume={bgmVolume} />

      {whooshFrames.map((f, idx) => (
        <Sequence key={`whoosh-${idx}`} from={Math.max(0, f)} durationInFrames={20}>
          <Audio src={staticFile(AUDIO_KIT.sfx.whoosh)} volume={0.36} />
        </Sequence>
      ))}

      {popFrames.map((f, idx) => (
        <Sequence key={`pop-${idx}`} from={Math.max(0, f)} durationInFrames={12}>
          <Audio src={staticFile(AUDIO_KIT.sfx.pop)} volume={0.35} />
        </Sequence>
      ))}

      {chimeFrames.map((f, idx) => (
        <Sequence key={`chime-${idx}`} from={Math.max(0, f)} durationInFrames={25}>
          <Audio src={staticFile(AUDIO_KIT.sfx.chime)} volume={0.32} />
        </Sequence>
      ))}

      {collapseFrames.map((f, idx) => (
        <Sequence key={`collapse-${idx}`} from={Math.max(0, f)} durationInFrames={22}>
          <Audio src={staticFile(AUDIO_KIT.sfx.collapse)} volume={0.42} />
        </Sequence>
      ))}

      {typeof outroStingFrame === 'number' && (
        <Sequence from={Math.max(0, outroStingFrame)} durationInFrames={45}>
          <Audio src={staticFile(AUDIO_KIT.sfx.outroSting)} volume={0.38} />
        </Sequence>
      )}
    </>
  );
};
