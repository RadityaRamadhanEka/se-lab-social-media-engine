import React, {useEffect} from 'react';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {getActiveChapter, isNarratorSpeaking, TIMELINE} from '../../audio/timeline';
import {StagePalette} from '../../theme';
import {
  BlueprintStation,
  ChaoticCodeStack,
  DeployNodeStation,
  EngineeredTower,
  ModularCubeStation,
  PipelineConnectorStream,
  QaShieldStation,
  SeLabCube3D,
} from './LabProps3D';
import {NarratorCharacter3D, NarratorPose} from './NarratorCharacter3D';

interface StoryStage3DProps {
  palette: StagePalette;
}

const CHAOTIC_POS: [number, number, number] = [-19.8, 0, 0];
const TOWER_POS: [number, number, number] = [-15.8, 0, 0];

const STATION_POSITIONS: Array<[number, number, number]> = [
  [0, 0, 0],
  [6, 0, 0],
  [12, 0, 0],
  [18, 0, 0],
];

const HERO_CUBE_POS: [number, number, number] = [36, 1.65, 0];

/**
 * Kamera deterministik tersinkronisasi langsung dengan chapter boundaries di vo-manifest.json
 */
const getCameraRig = (frame: number): {pos: [number, number, number]; lookAt: [number, number, number]} => {
  const ease = Easing.inOut(Easing.cubic);
  const {babak1, babak2, step1, step2, step3, step4, outro} = TIMELINE.clips;

  const keyframes: Array<{
    f: number;
    pos: [number, number, number];
    look: [number, number, number];
  }> = [
    // Babak 1: Hook — tumpukan kode berantakan + Narator di kanan
    {f: babak1.chapterStartFrame, pos: [-19.2, 2.75, 8.2], look: [-19.0, 1.35, 0]},
    {f: babak1.chapterEndFrame - 12, pos: [-18.8, 2.65, 7.8], look: [-19.0, 1.35, 0]},
    // Babak 2: Analogi — narator di tengah, kiri roboh vs kanan gedung RPL
    {f: babak2.chapterStartFrame + 24, pos: [-17.8, 3.65, 12.6], look: [-17.8, 1.45, 0]},
    {f: babak2.chapterEndFrame - 14, pos: [-17.5, 3.45, 12.0], look: [-17.8, 1.5, 0]},
    // Babak 3: 4 Stasiun Siklus RPL + Narator di sebelah tiap stasiun
    {f: step1.chapterStartFrame + 24, pos: [-0.8, 2.85, 8.6], look: [-0.7, 1.25, 0]},
    {f: step1.chapterEndFrame - 12, pos: [-0.3, 2.75, 8.2], look: [-0.7, 1.25, 0]},
    {f: step2.chapterStartFrame + 24, pos: [5.2, 2.85, 8.6], look: [5.3, 1.25, 0]},
    {f: step2.chapterEndFrame - 12, pos: [5.7, 2.75, 8.2], look: [5.3, 1.25, 0]},
    {f: step3.chapterStartFrame + 24, pos: [11.2, 2.85, 8.6], look: [11.3, 1.25, 0]},
    {f: step3.chapterEndFrame - 12, pos: [11.7, 2.75, 8.2], look: [11.3, 1.25, 0]},
    {f: step4.chapterStartFrame + 24, pos: [17.2, 2.85, 8.6], look: [17.3, 1.25, 0]},
    {f: step4.chapterEndFrame - 12, pos: [17.7, 2.75, 8.2], look: [17.3, 1.25, 0]},
    // Babak 4: Outro — Hero Kubus SE Lab + Narator melambai
    {f: outro.chapterStartFrame + 28, pos: [35.3, 3.0, 8.8], look: [35.3, 1.35, 0]},
    {f: TIMELINE.totalFrames, pos: [35.3, 2.85, 8.4], look: [35.3, 1.35, 0]},
  ];

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], {easing: ease});
      return {
        pos: [
          interpolate(t, [0, 1], [a.pos[0], b.pos[0]]),
          interpolate(t, [0, 1], [a.pos[1], b.pos[1]]),
          interpolate(t, [0, 1], [a.pos[2], b.pos[2]]),
        ],
        lookAt: [
          interpolate(t, [0, 1], [a.look[0], b.look[0]]),
          interpolate(t, [0, 1], [a.look[1], b.look[1]]),
          interpolate(t, [0, 1], [a.look[2], b.look[2]]),
        ],
      };
    }
  }

  const last = keyframes[keyframes.length - 1];
  return {pos: last.pos, lookAt: last.look};
};

/**
 * Menghitung posisi & pose karakter narator mengikuti alur cerita antar zona
 */
const getNarratorPlacement = (
  frame: number
): {position: [number, number, number]; rotationY: number; pose: NarratorPose} => {
  const ease = Easing.inOut(Easing.cubic);
  const {babak1, babak2, step1, step2, step3, step4, outro} = TIMELINE.clips;

  if (frame < babak2.chapterStartFrame) {
    return {position: [-17.9, 0, 0.7], rotationY: -0.35, pose: 'hook'};
  }

  if (frame < step1.chapterStartFrame) {
    const t = interpolate(frame, [babak2.chapterStartFrame, babak2.chapterStartFrame + 24], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: ease,
    });
    return {
      position: [interpolate(t, [0, 1], [-17.9, -17.8]), 0, interpolate(t, [0, 1], [0.7, 0.55])],
      rotationY: interpolate(t, [0, 1], [-0.35, 0.0]),
      pose: 'compare',
    };
  }

  if (frame < outro.chapterStartFrame) {
    const targets: Array<{f: number; x: number}> = [
      {f: step1.chapterStartFrame, x: -1.65},
      {f: step2.chapterStartFrame, x: 4.35},
      {f: step3.chapterStartFrame, x: 10.35},
      {f: step4.chapterStartFrame, x: 16.35},
    ];
    let x = targets[targets.length - 1].x;
    for (let i = 0; i < targets.length; i++) {
      const curr = targets[i];
      const next = targets[i + 1];
      if (!next || frame < next.f) {
        if (i > 0 && frame < curr.f + 24) {
          const prev = targets[i - 1];
          const t = interpolate(frame, [curr.f, curr.f + 24], [0, 1], {easing: ease});
          x = interpolate(t, [0, 1], [prev.x, curr.x]);
        } else {
          x = curr.x;
        }
        break;
      }
    }
    return {position: [x, 0, 0.65], rotationY: 0.42, pose: 'explain'};
  }

  return {position: [34.15, 0, 0.9], rotationY: 0.35, pose: 'outro'};
};

const CameraController: React.FC<{rig: {pos: [number, number, number]; lookAt: [number, number, number]}}> = ({
  rig,
}) => {
  const camera = useThree((state) => state.camera);

  camera.position.set(rig.pos[0], rig.pos[1], rig.pos[2]);
  camera.lookAt(rig.lookAt[0], rig.lookAt[1], rig.lookAt[2]);
  camera.updateProjectionMatrix();

  useEffect(() => {
    camera.position.set(rig.pos[0], rig.pos[1], rig.pos[2]);
    camera.lookAt(rig.lookAt[0], rig.lookAt[1], rig.lookAt[2]);
    camera.updateProjectionMatrix();
  }, [camera, rig.pos, rig.lookAt]);

  return null;
};

export const StoryStage3D: React.FC<StoryStage3DProps> = ({palette}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  const {babak2} = TIMELINE.clips;
  const activeChapter = getActiveChapter(frame);
  const speaking = isNarratorSpeaking(frame);

  const collapseProgress = interpolate(
    frame,
    [babak2.chapterStartFrame + 36, babak2.chapterStartFrame + 110],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)}
  );

  const activeStation =
    activeChapter === 'step1'
      ? 0
      : activeChapter === 'step2'
        ? 1
        : activeChapter === 'step3'
          ? 2
          : activeChapter === 'step4'
            ? 3
            : -1;

  const rig = getCameraRig(frame);
  const narrator = getNarratorPlacement(frame);

  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      camera={{fov: 40, position: rig.pos, near: 0.1, far: 120}}
      style={{position: 'absolute', inset: 0}}
    >
      <CameraController rig={rig} />

      {/* Pencahayaan Studio High-Spec (Key + Fill + Rim Lights) */}
      <ambientLight intensity={palette.mode === 'light' ? 1.05 : 0.62} />
      <directionalLight
        position={[10, 18, 14]}
        intensity={palette.mode === 'light' ? 1.55 : 1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-12, 10, -8]} intensity={0.45} color={palette.blueLight} />
      <pointLight position={[-18, 6, 8]} intensity={palette.mode === 'dark' ? 2.2 : 0.65} color={palette.bluePrimary} />
      <pointLight position={[9, 6, 8]} intensity={palette.mode === 'dark' ? 2.2 : 0.65} color={palette.purpleGlow} />
      <pointLight position={[36, 6, 8]} intensity={palette.mode === 'dark' ? 2.4 : 0.8} color={palette.orangeAccent} />

      {/* Lantai Grid Arsitektur 3D */}
      <gridHelper args={[110, 88, palette.gridPrimary, palette.gridSecondary]} position={[8, 0, 0]} />

      {/* Zona 1: Asal Ngoding vs Gedung Rekayasa RPL */}
      <ChaoticCodeStack
        frame={frame}
        fps={fps}
        palette={palette}
        position={CHAOTIC_POS}
        collapseProgress={collapseProgress}
      />
      <EngineeredTower
        frame={frame}
        fps={fps}
        palette={palette}
        position={TOWER_POS}
        startFrame={babak2.chapterStartFrame + 38}
      />

      {/* Zona 2: 4 Stasiun Siklus Software Engineering */}
      <BlueprintStation frame={frame} fps={fps} palette={palette} position={STATION_POSITIONS[0]} active={activeStation === 0} />
      <ModularCubeStation frame={frame} fps={fps} palette={palette} position={STATION_POSITIONS[1]} active={activeStation === 1} />
      <QaShieldStation frame={frame} fps={fps} palette={palette} position={STATION_POSITIONS[2]} active={activeStation === 2} />
      <DeployNodeStation frame={frame} fps={fps} palette={palette} position={STATION_POSITIONS[3]} active={activeStation === 3} />
      <PipelineConnectorStream frame={frame} palette={palette} positions={STATION_POSITIONS} />

      {/* Zona 3: Kubus Isometrik SE Lab di Panggung Outro */}
      <SeLabCube3D frame={frame} fps={fps} palette={palette} position={HERO_CUBE_POS} scale={1.12} />

      {/* Aset Karakter Narator 3D SE Lab */}
      <NarratorCharacter3D
        frame={frame}
        palette={palette}
        position={narrator.position}
        rotationY={narrator.rotationY}
        pose={narrator.pose}
        speaking={speaking}
        scale={0.95}
      />
    </ThreeCanvas>
  );
};
