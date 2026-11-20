import React from 'react';
import {Composition} from 'remotion';
import {TIMELINE} from './audio/timeline';
import {ApaItuRpl3D} from './compositions/ApaItuRpl3D';
import {ApaItuRplPropsSchema, DEFAULT_APA_ITU_RPL_PROPS} from './types/story';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ApaItuRpl3D"
      component={ApaItuRpl3D}
      durationInFrames={TIMELINE.totalFrames}
      fps={TIMELINE.fps}
      width={1080}
      height={1920}
      schema={ApaItuRplPropsSchema}
      defaultProps={DEFAULT_APA_ITU_RPL_PROPS}
    />
  );
};
