import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {CHAPTER_KEYS, isNarratorSpeaking, TIMELINE} from '../audio/timeline';
import {getStagePalette} from '../theme';
import {ApaItuRplProps} from '../types/story';
import {SceneAudioBed} from '../components/audio/SceneAudioBed';
import {StoryStage3D} from '../components/3d/StoryStage3D';
import {StoryOverlay} from '../components/ui/StoryOverlay';

export const ApaItuRpl3D: React.FC<ApaItuRplProps> = (props) => {
  const palette = getStagePalette(props.theme);
  const {babak1, babak2, step1, step2, step3, step4, outro} = TIMELINE.clips;

  return (
    <AbsoluteFill style={{background: palette.bgGradient}}>
      {/* BGM Adaptif Tema (auto-ducking saat VO) + Pustaka SFX Reusable */}
      <SceneAudioBed
        theme={props.theme}
        isSpeaking={isNarratorSpeaking}
        popFrames={[
          babak1.chapterStartFrame + 2,
          babak2.chapterStartFrame + 2,
          step1.chapterStartFrame + 2,
          step2.chapterStartFrame + 2,
          step3.chapterStartFrame + 2,
          step4.chapterStartFrame + 2,
        ]}
        whooshFrames={[
          babak2.chapterStartFrame - 4,
          step1.chapterStartFrame - 4,
          step2.chapterStartFrame - 4,
          step3.chapterStartFrame - 4,
          step4.chapterStartFrame - 4,
          outro.chapterStartFrame - 4,
        ]}
        collapseFrames={[babak2.chapterStartFrame + 36]}
        chimeFrames={[
          babak2.chapterStartFrame + 60,
          step1.chapterStartFrame + 16,
          step2.chapterStartFrame + 16,
          step3.chapterStartFrame + 16,
          step4.chapterStartFrame + 16,
        ]}
        outroStingFrame={outro.chapterStartFrame}
      />

      {/* Voiceover Bahasa Indonesia Natural (id-ID-ArdiNeural) */}
      {CHAPTER_KEYS.map((key) => {
        const clip = TIMELINE.clips[key];
        return (
          <Sequence key={key} from={clip.audioStartFrame} durationInFrames={clip.durationFrames + 4}>
            <Audio src={staticFile(clip.file)} volume={1} />
          </Sequence>
        );
      })}

      <StoryStage3D palette={palette} />
      <StoryOverlay props={props} palette={palette} />
    </AbsoluteFill>
  );
};
