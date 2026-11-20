import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {StagePalette} from '../../theme';

export type NarratorPose = 'hook' | 'compare' | 'explain' | 'outro';

interface NarratorCharacter3DProps {
  frame: number;
  palette: StagePalette;
  position: [number, number, number];
  rotationY?: number;
  pose: NarratorPose;
  speaking: boolean;
  scale?: number;
}

/**
 * Karakter Narator 3D High-Poly (Maskot Engineer SE Lab FILKOM UB):
 * - Kepala & visor kaca rounded (RoundedBoxGeometry + MeshPhysicalMaterial)
 * - Mata berkedip periodik & mouth visualizer bergerak saat VO aktif
 * - Headset oranye + boom mic narator
 * - Hoodie biru SE Lab berkerah + lengan artikulasi yang menunjuk/menjelaskan props
 */
export const NarratorCharacter3D: React.FC<NarratorCharacter3DProps> = ({
  frame,
  palette,
  position,
  rotationY = 0,
  pose,
  speaking,
  scale = 1,
}) => {
  const geos = useMemo(() => {
    return {
      head: new RoundedBoxGeometry(0.74, 0.64, 0.66, 6, 0.16),
      visor: new RoundedBoxGeometry(0.62, 0.36, 0.12, 5, 0.06),
      torso: new RoundedBoxGeometry(0.76, 0.86, 0.5, 6, 0.16),
      collar: new RoundedBoxGeometry(0.56, 0.14, 0.48, 4, 0.05),
      arm: new RoundedBoxGeometry(0.2, 0.54, 0.2, 5, 0.08),
      badge: new RoundedBoxGeometry(0.18, 0.18, 0.06, 4, 0.03),
      headband: new THREE.TorusGeometry(0.42, 0.045, 20, 64, Math.PI),
      hoverPad: new THREE.CylinderGeometry(0.54, 0.44, 0.12, 48),
      hoverRing: new THREE.TorusGeometry(0.56, 0.032, 20, 64),
    };
  }, []);

  const floatY = Math.sin(frame * 0.09) * 0.08;
  const breath = 1 + Math.sin(frame * 0.07) * 0.015;

  // Kedipan mata periodik setiap ~95 frame
  const blinkCycle = frame % 95;
  const eyeScaleY = blinkCycle >= 88 && blinkCycle <= 92 ? 0.12 : 1;

  // Animasi mulut narator saat voiceover aktif
  const mouthHeight = speaking ? 0.035 + Math.abs(Math.sin(frame * 0.65)) * 0.075 : 0.024;
  const mouthWidth = speaking ? 0.14 + Math.abs(Math.cos(frame * 0.45)) * 0.06 : 0.14;

  // Koreografi lengan & kepala sesuai babak cerita
  const headNod = speaking ? Math.sin(frame * 0.18) * 0.06 : Math.sin(frame * 0.06) * 0.025;
  const headTurn =
    pose === 'compare'
      ? Math.sin(frame * 0.05) * 0.28
      : pose === 'explain'
        ? -0.18 + Math.sin(frame * 0.07) * 0.08
        : Math.sin(frame * 0.05) * 0.08;

  const rightArmRotZ =
    pose === 'hook'
      ? -0.45 + Math.sin(frame * 0.14) * 0.12
      : pose === 'explain'
        ? -1.15 + Math.sin(frame * 0.12) * 0.1
        : pose === 'outro'
          ? -2.35 + Math.sin(frame * 0.26) * 0.25
          : -0.65 + Math.sin(frame * 0.08) * 0.25;

  const leftArmRotZ =
    pose === 'compare'
      ? 0.95 + Math.sin(frame * 0.1) * 0.15
      : pose === 'hook'
        ? 0.35 + Math.sin(frame * 0.1) * 0.08
        : 0.28 + Math.sin(frame * 0.08) * 0.06;

  return (
    <group position={[position[0], position[1], position[2]]} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* Piringan Hover Pod + Cincin Cahaya */}
      <mesh geometry={geos.hoverPad} position={[0, 0.12, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={palette.navyBar} roughness={0.25} metalness={0.45} clearcoat={0.5} />
      </mesh>
      <mesh geometry={geos.hoverRing} position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color={palette.orangeAccent}
          emissive={palette.orangeAccent}
          emissiveIntensity={speaking ? 0.85 : 0.4}
          roughness={0.2}
        />
      </mesh>

      {/* Tubuh Melayang */}
      <group position={[0, 0.26 + floatY, 0]}>
        {/* Torso Hoodie SE Lab */}
        <group position={[0, 0.68, 0]} scale={[breath, 1, breath]}>
          <mesh geometry={geos.torso} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={palette.bluePrimary}
              roughness={0.35}
              metalness={0.12}
              clearcoat={0.35}
              clearcoatRoughness={0.25}
            />
          </mesh>
          {/* Kerah Hoodie */}
          <mesh geometry={geos.collar} position={[0, 0.42, 0]} castShadow>
            <meshPhysicalMaterial color={palette.blueDark} roughness={0.4} clearcoat={0.25} />
          </mesh>
          {/* Lencana Oranye SE di Dada */}
          <mesh geometry={geos.badge} position={[0.16, 0.14, 0.25]} rotation={[0, 0, Math.PI / 4]}>
            <meshStandardMaterial
              color={palette.orangeAccent}
              emissive={palette.orangeAccent}
              emissiveIntensity={0.35}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Lengan Kanan (Artikulasi dari bahu) */}
        <group position={[0.48, 0.98, 0]} rotation={[0.15, 0, rightArmRotZ]}>
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshPhysicalMaterial color={palette.blueDark} roughness={0.35} />
          </mesh>
          <mesh geometry={geos.arm} position={[0, -0.26, 0]} castShadow>
            <meshPhysicalMaterial color={palette.bluePrimary} roughness={0.35} clearcoat={0.3} />
          </mesh>
          <mesh position={[0, -0.56, 0]} castShadow>
            <sphereGeometry args={[0.115, 28, 28]} />
            <meshPhysicalMaterial color="#f8fafc" roughness={0.25} clearcoat={0.4} />
          </mesh>
        </group>

        {/* Lengan Kiri */}
        <group position={[-0.48, 0.98, 0]} rotation={[0.1, 0, leftArmRotZ]}>
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshPhysicalMaterial color={palette.blueDark} roughness={0.35} />
          </mesh>
          <mesh geometry={geos.arm} position={[0, -0.26, 0]} castShadow>
            <meshPhysicalMaterial color={palette.bluePrimary} roughness={0.35} clearcoat={0.3} />
          </mesh>
          <mesh position={[0, -0.56, 0]} castShadow>
            <sphereGeometry args={[0.115, 28, 28]} />
            <meshPhysicalMaterial color="#f8fafc" roughness={0.25} clearcoat={0.4} />
          </mesh>
        </group>

        {/* Kepala + Visor + Headset Narator */}
        <group position={[0, 1.52, 0]} rotation={[headNod, headTurn, 0]}>
          {/* Helm/Kepala Putih Smooth */}
          <mesh geometry={geos.head} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#f8fafc"
              roughness={0.18}
              metalness={0.08}
              clearcoat={0.7}
              clearcoatRoughness={0.12}
            />
          </mesh>

          {/* Visor Kaca Gelap Navy */}
          <mesh geometry={geos.visor} position={[0, 0.02, 0.3]}>
            <meshPhysicalMaterial
              color={palette.navyBar}
              roughness={0.08}
              metalness={0.2}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>

          {/* Sepasang Mata Ekspresif */}
          {[-0.14, 0.14].map((ex, i) => (
            <mesh key={i} position={[ex, 0.06, 0.365]} scale={[1, eyeScaleY, 1]}>
              <sphereGeometry args={[0.048, 24, 24]} />
              <meshStandardMaterial color="#e0f2fe" emissive="#38bdf8" emissiveIntensity={1.2} />
            </mesh>
          ))}

          {/* Mulut Audio Visualizer (horizontal) */}
          <mesh
            position={[0, -0.075, 0.365]}
            rotation={[0, 0, Math.PI / 2]}
            scale={[mouthHeight / 0.03, mouthWidth / 0.14, 1]}
          >
            <capsuleGeometry args={[0.016, 0.11, 8, 16]} />
            <meshStandardMaterial
              color={palette.orangeAccent}
              emissive={palette.orangeAccent}
              emissiveIntensity={speaking ? 1.5 : 0.45}
            />
          </mesh>

          {/* Headset Narator + Boom Mic */}
          <mesh geometry={geos.headband} position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
            <meshPhysicalMaterial color={palette.orangeAccent} roughness={0.22} clearcoat={0.6} />
          </mesh>
          {[-0.41, 0.41].map((earX, i) => (
            <mesh key={i} position={[earX, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.13, 0.13, 0.09, 32]} />
              <meshPhysicalMaterial color={palette.blueDark} roughness={0.25} clearcoat={0.5} />
            </mesh>
          ))}
          {/* Boom Mic menuju mulut */}
          <mesh position={[-0.3, -0.1, 0.25]} rotation={[0.4, 0.75, 0.25]}>
            <cylinderGeometry args={[0.014, 0.014, 0.34, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[-0.18, -0.14, 0.37]}>
            <sphereGeometry args={[0.032, 20, 20]} />
            <meshStandardMaterial color={palette.orangeAccent} emissive={palette.orangeAccent} emissiveIntensity={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
