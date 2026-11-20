import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {interpolate, spring} from 'remotion';
import {StagePalette} from '../../theme';

interface AnimatedProp {
  frame: number;
  fps: number;
  palette: StagePalette;
}

/**
 * Helper membuat geometri roda gigi 3D high-poly (ExtrudeGeometry + bevel)
 */
const createGearGeometry = (teeth = 10, innerR = 0.22, outerR = 0.44, depth = 0.14) => {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.45;
    const a3 = a0 + step * 0.72;
    const rBase = outerR * 0.76;
    if (i === 0) shape.moveTo(Math.cos(a0) * rBase, Math.sin(a0) * rBase);
    else shape.lineTo(Math.cos(a0) * rBase, Math.sin(a0) * rBase);
    shape.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    shape.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
    shape.lineTo(Math.cos(a3) * rBase, Math.sin(a3) * rBase);
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 4,
    curveSegments: 24,
  });
  geo.center();
  return geo;
};

/**
 * Babak 1 & 2 (Kiri): Tumpukan modul kode berantakan (High-Poly Beveled Slabs + UI Strips)
 */
export const ChaoticCodeStack: React.FC<
  AnimatedProp & {position: [number, number, number]; collapseProgress: number}
> = ({frame, palette, position, collapseProgress}) => {
  const geos = useMemo(
    () => ({
      plinth: new THREE.CylinderGeometry(1.36, 1.48, 0.16, 64),
      rim: new THREE.TorusGeometry(1.38, 0.035, 20, 64),
      b0: new RoundedBoxGeometry(1.36, 0.54, 1.12, 6, 0.1),
      b1: new RoundedBoxGeometry(1.22, 0.5, 1.0, 6, 0.1),
      b2: new RoundedBoxGeometry(1.1, 0.48, 1.05, 6, 0.1),
      b3: new RoundedBoxGeometry(0.95, 0.44, 0.92, 6, 0.1),
      strip: new RoundedBoxGeometry(0.75, 0.08, 0.06, 4, 0.02),
    }),
    []
  );

  const blocks = [
    {y: 0.42, rotZ: 0.07, xOff: -0.05, geo: geos.b0, zStrip: 0.56, color: palette.bluePrimary},
    {y: 0.96, rotZ: -0.15, xOff: 0.14, geo: geos.b1, zStrip: 0.5, color: palette.blueDark},
    {y: 1.48, rotZ: 0.2, xOff: -0.16, geo: geos.b2, zStrip: 0.525, color: palette.purpleGlow},
    {y: 1.98, rotZ: -0.25, xOff: 0.2, geo: geos.b3, zStrip: 0.46, color: palette.orangeAccent},
  ];

  const wobble = Math.sin(frame * 0.2) * 0.045;

  return (
    <group position={position}>
      <mesh geometry={geos.plinth} position={[0, 0.08, 0]} receiveShadow>
        <meshPhysicalMaterial color={palette.mode === 'light' ? '#cbd5e1' : '#1e293b'} roughness={0.45} clearcoat={0.25} />
      </mesh>
      <mesh geometry={geos.rim} position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={palette.orangeAccent} emissive={palette.orangeAccent} emissiveIntensity={0.25} />
      </mesh>

      {blocks.map((b, idx) => {
        const dropOffset = collapseProgress * idx * 0.34;
        const slideOut = collapseProgress * (idx % 2 === 0 ? -0.58 : 0.62);
        const tilt = b.rotZ + wobble * (idx + 1) * 0.35 + collapseProgress * (idx % 2 === 0 ? -0.45 : 0.48);
        return (
          <group
            key={idx}
            position={[
              b.xOff + slideOut,
              Math.max(0.38, b.y - dropOffset),
              (idx % 2 === 0 ? 1 : -1) * collapseProgress * 0.22,
            ]}
            rotation={[collapseProgress * 0.22, idx * 0.18, tilt]}
          >
            <mesh geometry={b.geo} castShadow receiveShadow>
              <meshPhysicalMaterial color={b.color} roughness={0.28} metalness={0.14} clearcoat={0.45} />
            </mesh>
            {/* Baris kode glowing di depan blok */}
            <mesh geometry={geos.strip} position={[-0.1, 0.06, b.zStrip]}>
              <meshStandardMaterial color="#e0f2fe" emissive="#bae6fd" emissiveIntensity={0.4} />
            </mesh>
            <mesh geometry={geos.strip} position={[0.05, -0.08, b.zStrip]} scale={[0.65, 1, 1]}>
              <meshStandardMaterial color={palette.orangeAccent} emissive={palette.orangeAccent} emissiveIntensity={0.35} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/**
 * Babak 2 (Kanan): Menara Arsitektur RPL High-Poly (Beveled Tiers + Glass Windows + Sculpted Crest)
 */
export const EngineeredTower: React.FC<
  AnimatedProp & {position: [number, number, number]; startFrame: number}
> = ({frame, fps, palette, position, startFrame}) => {
  const localFrame = Math.max(0, frame - startFrame);

  const geos = useMemo(
    () => ({
      base: new RoundedBoxGeometry(2.3, 0.18, 2.3, 6, 0.06),
      t0: new RoundedBoxGeometry(1.78, 0.52, 1.78, 6, 0.1),
      t1: new RoundedBoxGeometry(1.52, 0.54, 1.52, 6, 0.1),
      t2: new RoundedBoxGeometry(1.28, 0.52, 1.28, 6, 0.1),
      t3: new RoundedBoxGeometry(1.04, 0.46, 1.04, 6, 0.09),
      diamond: new RoundedBoxGeometry(0.56, 0.56, 0.56, 6, 0.1),
    }),
    []
  );

  const layers = [
    {y: 0.42, w: 1.78, h: 0.52, geo: geos.t0, color: palette.blueDark, delay: 0},
    {y: 1.0, w: 1.52, h: 0.54, geo: geos.t1, color: palette.bluePrimary, delay: 8},
    {y: 1.58, w: 1.28, h: 0.52, geo: geos.t2, color: palette.purpleGlow, delay: 16},
    {y: 2.12, w: 1.04, h: 0.46, geo: geos.t3, color: palette.bluePrimary, delay: 24},
  ];

  const capProgress = spring({frame: Math.max(0, localFrame - 34), fps, config: {damping: 12}});

  return (
    <group position={position}>
      <mesh geometry={geos.base} position={[0, 0.09, 0]} receiveShadow>
        <meshPhysicalMaterial color={palette.navyBar} roughness={0.3} metalness={0.35} clearcoat={0.5} />
      </mesh>

      {layers.map((layer, idx) => {
        const p = spring({frame: Math.max(0, localFrame - layer.delay), fps, config: {damping: 14}});
        return (
          <group key={idx} position={[0, layer.y + (1 - p) * 1.3, 0]} scale={[p, p, p]}>
            <mesh geometry={layer.geo} castShadow receiveShadow>
              <meshPhysicalMaterial color={layer.color} roughness={0.22} metalness={0.2} clearcoat={0.55} />
            </mesh>
            {/* Sabuk kaca jendela horizontal */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[layer.w + 0.03, 0.1, layer.w + 0.03]} />
              <meshPhysicalMaterial
                color="#e0f2fe"
                emissive="#7dd3fc"
                emissiveIntensity={0.25}
                roughness={0.1}
                clearcoat={0.9}
              />
            </mesh>
            {/* 4 Pilar halus high-poly */}
            {[-1, 1].map((sx) =>
              [-1, 1].map((sz) => (
                <mesh
                  key={`${sx}-${sz}`}
                  position={[sx * (layer.w / 2 - 0.08), 0, sz * (layer.w / 2 - 0.08)]}
                  castShadow
                >
                  <cylinderGeometry args={[0.072, 0.072, layer.h + 0.06, 28]} />
                  <meshPhysicalMaterial color={palette.blueLight} roughness={0.2} metalness={0.35} clearcoat={0.6} />
                </mesh>
              ))
            )}
          </group>
        );
      })}

      {/* Mahkota Kubus Diamond Beveled SE Lab */}
      <mesh
        geometry={geos.diamond}
        position={[0, 2.75 + Math.sin(frame * 0.08) * 0.08, 0]}
        rotation={[Math.PI / 4, frame * 0.03, Math.PI / 4]}
        scale={[capProgress, capProgress, capProgress]}
        castShadow
      >
        <meshPhysicalMaterial
          color={palette.orangeAccent}
          emissive={palette.orangeAccent}
          emissiveIntensity={0.35}
          roughness={0.18}
          metalness={0.3}
          clearcoat={0.8}
        />
      </mesh>
    </group>
  );
};

const StationPlinth: React.FC<{palette: StagePalette; active: boolean}> = ({palette, active}) => {
  const plinth = useMemo(() => new THREE.CylinderGeometry(1.38, 1.5, 0.2, 64), []);
  const ring = useMemo(() => new THREE.TorusGeometry(1.42, 0.04, 24, 96), []);

  return (
    <group>
      <mesh geometry={plinth} position={[0, 0.1, 0]} receiveShadow>
        <meshPhysicalMaterial color={palette.blueDark} roughness={0.3} metalness={0.25} clearcoat={0.5} />
      </mesh>
      <mesh geometry={ring} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color={active ? palette.orangeAccent : palette.blueLight}
          emissive={active ? palette.orangeAccent : palette.bluePrimary}
          emissiveIntensity={active ? 0.75 : 0.2}
        />
      </mesh>
    </group>
  );
};

/**
 * Stasiun 1: Blueprint & Requirements (Tablet Holografik Beveled + Chart 3D)
 */
export const BlueprintStation: React.FC<
  AnimatedProp & {position: [number, number, number]; active: boolean}
> = ({frame, palette, position, active}) => {
  const hover = Math.sin(frame * 0.07) * 0.09;
  const rot = active ? frame * 0.03 : 0.35;

  const geos = useMemo(
    () => ({
      tablet: new RoundedBoxGeometry(1.75, 1.2, 0.14, 6, 0.08),
      screen: new RoundedBoxGeometry(1.52, 0.96, 0.06, 4, 0.04),
      cardA: new RoundedBoxGeometry(0.54, 0.36, 0.1, 5, 0.04),
      cardB: new RoundedBoxGeometry(0.54, 0.36, 0.1, 5, 0.04),
      gem: new RoundedBoxGeometry(0.36, 0.36, 0.36, 6, 0.08),
    }),
    []
  );

  return (
    <group position={position}>
      <StationPlinth palette={palette} active={active} />
      <group position={[0, 1.22 + hover, 0]} rotation={[-0.18, Math.sin(frame * 0.04) * 0.22, 0]}>
        <mesh geometry={geos.tablet} castShadow>
          <meshPhysicalMaterial color={palette.navyBar} roughness={0.25} metalness={0.3} clearcoat={0.6} />
        </mesh>
        <mesh geometry={geos.screen} position={[0, 0, 0.06]}>
          <meshPhysicalMaterial color={palette.bluePrimary} roughness={0.15} clearcoat={0.8} />
        </mesh>
        <mesh geometry={geos.cardA} position={[-0.35, 0.18, 0.13]}>
          <meshPhysicalMaterial
            color={palette.orangeAccent}
            emissive={palette.orangeAccent}
            emissiveIntensity={active ? 0.35 : 0.1}
            clearcoat={0.6}
          />
        </mesh>
        <mesh geometry={geos.cardB} position={[0.35, -0.16, 0.13]}>
          <meshPhysicalMaterial color={palette.purpleGlow} clearcoat={0.6} />
        </mesh>
      </group>
      <mesh geometry={geos.gem} position={[1.0, 1.8 + hover, 0.35]} rotation={[rot, rot * 1.3, 0]} castShadow>
        <meshPhysicalMaterial color={palette.orangeAccent} roughness={0.18} metalness={0.25} clearcoat={0.8} />
      </mesh>
    </group>
  );
};

/**
 * Stasiun 2: Arsitektur & Kode Modular (Kubus Beveled + Roda Gigi 3D Extruded)
 */
export const ModularCubeStation: React.FC<
  AnimatedProp & {position: [number, number, number]; active: boolean}
> = ({frame, palette, position, active}) => {
  const pulse = active ? Math.sin(frame * 0.12) * 0.06 : 0;
  const cubeGeo = useMemo(() => new RoundedBoxGeometry(0.66, 0.66, 0.66, 6, 0.1), []);
  const gearGeo = useMemo(() => createGearGeometry(10, 0.26, 0.64, 0.14), []);

  const offsets: Array<[number, number, number, string]> = [
    [-0.4, 0.72, -0.38, palette.bluePrimary],
    [0.4, 0.72, -0.38, palette.blueDark],
    [-0.4, 0.72, 0.38, palette.purpleGlow],
    [0.4, 0.72, 0.38, palette.bluePrimary],
    [-0.4, 1.46, 0, palette.blueLight],
    [0.4, 1.46, 0, palette.orangeAccent],
  ];

  return (
    <group position={position}>
      <StationPlinth palette={palette} active={active} />
      {/* Roda gigi rekayasa berputar di belakang */}
      <mesh geometry={gearGeo} position={[0, 1.55, -0.78]} rotation={[0, 0, frame * 0.03]} castShadow>
        <meshPhysicalMaterial color={palette.blueLight} metalness={0.5} roughness={0.22} clearcoat={0.6} />
      </mesh>
      <group rotation={[0, active ? frame * 0.02 : 0.4, 0]}>
        {offsets.map(([x, y, z, color], i) => (
          <mesh
            key={i}
            geometry={cubeGeo}
            position={[x * (1 + pulse), y + Math.sin(frame * 0.08 + i) * 0.04, z * (1 + pulse)]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial color={color} roughness={0.22} metalness={0.2} clearcoat={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * Stasiun 3: Quality & Testing (Glass Dome + Dual Gimbal Scanner High-Poly)
 */
export const QaShieldStation: React.FC<
  AnimatedProp & {position: [number, number, number]; active: boolean}
> = ({frame, palette, position, active}) => {
  const scanY = 1.2 + Math.sin(frame * 0.12) * 0.48;
  const geos = useMemo(
    () => ({
      core: new RoundedBoxGeometry(0.84, 0.84, 0.84, 6, 0.14),
      ringOuter: new THREE.TorusGeometry(0.95, 0.065, 28, 96),
      ringInner: new THREE.TorusGeometry(0.68, 0.045, 24, 96),
    }),
    []
  );

  return (
    <group position={position}>
      <StationPlinth palette={palette} active={active} />
      <mesh geometry={geos.core} position={[0, 1.2, 0]} rotation={[0.15, frame * 0.025, 0]} castShadow>
        <meshPhysicalMaterial color={palette.bluePrimary} roughness={0.2} metalness={0.25} clearcoat={0.7} />
      </mesh>
      {/* Kubah Kaca Pelindung QA */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.1, 48, 32]} />
        <meshPhysicalMaterial
          color={palette.blueLight}
          transparent
          opacity={0.22}
          roughness={0.05}
          clearcoat={1}
        />
      </mesh>
      <mesh geometry={geos.ringOuter} position={[0, scanY, 0]} rotation={[Math.PI / 2, 0, frame * 0.03]}>
        <meshStandardMaterial
          color={palette.orangeAccent}
          emissive={palette.orangeAccent}
          emissiveIntensity={active ? 0.65 : 0.2}
        />
      </mesh>
      <mesh geometry={geos.ringInner} position={[0, 1.2, 0]} rotation={[frame * 0.03, frame * 0.02, 0]}>
        <meshPhysicalMaterial color={palette.purpleGlow} roughness={0.2} clearcoat={0.6} />
      </mesh>
    </group>
  );
};

/**
 * Stasiun 4: Deploy & Evolusi (High-Poly Core Hub + Orbit Track + Client Nodes)
 */
export const DeployNodeStation: React.FC<
  AnimatedProp & {position: [number, number, number]; active: boolean}
> = ({frame, palette, position, active}) => {
  const orbitAngle = frame * 0.035;
  const clientGeo = useMemo(() => new RoundedBoxGeometry(0.32, 0.32, 0.32, 5, 0.08), []);
  const trackGeo = useMemo(() => new THREE.TorusGeometry(1.18, 0.028, 20, 96), []);

  return (
    <group position={position}>
      <StationPlinth palette={palette} active={active} />
      <mesh position={[0, 1.3 + Math.sin(frame * 0.08) * 0.08, 0]} rotation={[0.2, frame * 0.02, 0]} castShadow>
        <icosahedronGeometry args={[0.62, 2]} />
        <meshPhysicalMaterial
          color={palette.purpleGlow}
          emissive={palette.purpleGlow}
          emissiveIntensity={active ? 0.35 : 0.1}
          roughness={0.18}
          metalness={0.3}
          clearcoat={0.75}
        />
      </mesh>
      <mesh geometry={trackGeo} position={[0, 1.32, 0]} rotation={[Math.PI / 2.2, 0.15, 0]}>
        <meshStandardMaterial color={palette.blueLight} />
      </mesh>
      {[0, 1, 2].map((idx) => {
        const a = orbitAngle + (idx * Math.PI * 2) / 3;
        return (
          <mesh
            key={idx}
            geometry={clientGeo}
            position={[Math.cos(a) * 1.18, 1.35 + Math.sin(a * 2) * 0.16, Math.sin(a) * 1.18]}
            rotation={[a, a, 0]}
            castShadow
          >
            <meshPhysicalMaterial
              color={idx === 0 ? palette.orangeAccent : palette.bluePrimary}
              roughness={0.2}
              clearcoat={0.65}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Hero Kubus Isometrik High-Poly SE Lab (Beveled Body + Relief 3D "S" & "E" + Diamond Oranye)
 */
export const SeLabCube3D: React.FC<
  AnimatedProp & {position: [number, number, number]; scale?: number}
> = ({frame, palette, position, scale = 1}) => {
  const floatY = Math.sin(frame * 0.07) * 0.09;
  const rotY = -Math.PI / 4 + Math.sin(frame * 0.03) * 0.2;

  const geos = useMemo(
    () => ({
      body: new RoundedBoxGeometry(1.56, 1.56, 1.56, 8, 0.14),
      diamond: new RoundedBoxGeometry(0.86, 0.14, 0.86, 6, 0.05),
      barH: new RoundedBoxGeometry(0.88, 0.18, 0.12, 4, 0.04),
      barV: new RoundedBoxGeometry(0.18, 0.44, 0.12, 4, 0.04),
      pedestal: new THREE.CylinderGeometry(1.55, 1.7, 0.18, 64),
    }),
    []
  );

  return (
    <group position={position}>
      <mesh geometry={geos.pedestal} position={[0, -1.5, 0]} receiveShadow>
        <meshPhysicalMaterial color={palette.navyBar} roughness={0.35} clearcoat={0.4} />
      </mesh>

      <group position={[0, floatY, 0]} rotation={[0.14, rotY, 0]} scale={[scale, scale, scale]}>
        <mesh geometry={geos.body} castShadow receiveShadow>
          <meshPhysicalMaterial color={palette.blueDark} roughness={0.22} metalness={0.28} clearcoat={0.65} />
        </mesh>

        {/* Relief 3D huruf "S" di sisi kiri/depan kubus */}
        <group position={[0, 0, 0.78]}>
          <mesh geometry={geos.barH} position={[0, 0.36, 0]}>
            <meshPhysicalMaterial color={palette.blueLight} clearcoat={0.5} />
          </mesh>
          <mesh geometry={geos.barH} position={[0, 0, 0]}>
            <meshPhysicalMaterial color={palette.blueLight} clearcoat={0.5} />
          </mesh>
          <mesh geometry={geos.barH} position={[0, -0.36, 0]}>
            <meshPhysicalMaterial color={palette.blueLight} clearcoat={0.5} />
          </mesh>
          <mesh geometry={geos.barV} position={[-0.35, 0.18, 0]}>
            <meshPhysicalMaterial color={palette.blueLight} clearcoat={0.5} />
          </mesh>
          <mesh geometry={geos.barV} position={[0.35, -0.18, 0]}>
            <meshPhysicalMaterial color={palette.blueLight} clearcoat={0.5} />
          </mesh>
        </group>

        {/* Relief 3D huruf "E" di sisi kanan kubus */}
        <group position={[0.78, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh geometry={geos.barH} position={[0, 0.36, 0]}>
            <meshPhysicalMaterial color={palette.blueLight} clearcoat={0.5} />
          </mesh>
          <mesh geometry={geos.barH} position={[0, 0, 0]}>
            <meshPhysicalMaterial color={palette.blueLight} clearcoat={0.5} />
          </mesh>
          <mesh geometry={geos.barH} position={[0, -0.36, 0]}>
            <meshPhysicalMaterial color={palette.blueLight} clearcoat={0.5} />
          </mesh>
          <mesh geometry={geos.barV} position={[-0.35, 0, 0]} scale={[1, 2.0, 1]}>
            <meshPhysicalMaterial color={palette.blueLight} clearcoat={0.5} />
          </mesh>
        </group>

        {/* Diamond Oranye signature di puncak kubus */}
        <mesh geometry={geos.diamond} position={[0, 0.8, 0]}>
          <meshPhysicalMaterial
            color={palette.orangeAccent}
            emissive={palette.orangeAccent}
            emissiveIntensity={0.35}
            roughness={0.18}
            clearcoat={0.8}
          />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Jalur Kabel Lengkung 3D High-Poly (TubeGeometry + CatmullRomCurve3) & Paket Data Oranye
 */
export const PipelineConnectorStream: React.FC<{
  frame: number;
  palette: StagePalette;
  positions: Array<[number, number, number]>;
}> = ({frame, palette, positions}) => {
  const segments = useMemo(() => {
    return positions.slice(0, -1).map((start, idx) => {
      const end = positions[idx + 1];
      const midX = (start[0] + end[0]) / 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(start[0], 0.22, start[2]),
        new THREE.Vector3(midX, 0.55, start[2] + 0.35),
        new THREE.Vector3(end[0], 0.22, end[2]),
      ]);
      const tube = new THREE.TubeGeometry(curve, 48, 0.065, 16, false);
      return {curve, tube};
    });
  }, [positions]);

  return (
    <group>
      {segments.map((seg, idx) => {
        const t = (frame * 0.024 + idx * 0.33) % 1;
        const p = seg.curve.getPointAt(interpolate(t, [0, 1], [0, 1]));
        return (
          <group key={idx}>
            <mesh geometry={seg.tube}>
              <meshPhysicalMaterial color={palette.blueLight} roughness={0.25} clearcoat={0.6} />
            </mesh>
            <mesh position={[p.x, p.y, p.z]}>
              <sphereGeometry args={[0.14, 24, 24]} />
              <meshStandardMaterial
                color={palette.orangeAccent}
                emissive={palette.orangeAccent}
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
