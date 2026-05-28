import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const EARTH_TILT = (23.5 * Math.PI) / 180;
const STAR_COUNT = 8000;
const CELESTIAL_RADIUS = 500;
const GOLDEN_ANGLE = Math.PI * (3 - Math.SQRT2);

interface StarData {
  x: number;
  y: number;
  z: number;
  mag: number;
  temp: number;
  isNamed: boolean;
  name: string | null;
  connections: string[] | null;
}

const constellations = [
  { name: "Andromeda", abbr: "And", ra: 10.68, dec: 41.27, stars: ["Alpheratz", "Mirach", "Almach"] },
  { name: "Antlia", abbr: "Ant", ra: 10.27, dec: -32.51, stars: [] },
  { name: "Apus", abbr: "Aps", ra: 16.14, dec: -75.30, stars: [] },
  { name: "Aquarius", abbr: "Aqr", ra: 22.29, dec: -10.80, stars: ["Sadalsuud", "Sadalmelik", "Skat"] },
  { name: "Aquila", abbr: "Aql", ra: 19.54, dec: 4.91, stars: ["Altair", "Tarazed", "Alshain"] },
  { name: "Ara", abbr: "Ara", ra: 17.23, dec: -56.59, stars: [] },
  { name: "Aries", abbr: "Ari", ra: 43.27, dec: 18.87, stars: ["Hamal", "Sheratan", "Mesarthim"] },
  { name: "Auriga", abbr: "Aur", ra: 84.05, dec: 42.03, stars: ["Capella", "Menkalinan", "Almaaz"] },
  { name: "Boötes", abbr: "Boo", ra: 208.67, dec: 31.48, stars: ["Arcturus", "Izar", "Muphrid"] },
  { name: "Caelum", abbr: "Cae", ra: 67.39, dec: -37.10, stars: [] },
  { name: "Camelopardalis", abbr: "Cam", ra: 70.18, dec: 66.45, stars: [] },
  { name: "Cancer", abbr: "Cnc", ra: 130.10, dec: 19.47, stars: ["Tarf", "Asellus Australis", "Asellus Borealis"] },
  { name: "Canes Venatici", abbr: "CVn", ra: 202.10, dec: 40.56, stars: ["Cor Caroli"] },
  { name: "Canis Major", abbr: "CMa", ra: 107.10, dec: -23.17, stars: ["Sirius", "Adhara", "Wezen"] },
  { name: "Canis Minor", abbr: "CMi", ra: 113.65, dec: 2.91, stars: ["Procyon", "Gomeisa"] },
  { name: "Capricornus", abbr: "Cap", ra: 304.40, dec: -19.00, stars: ["Deneb Algedi", "Dabih"] },
  { name: "Carina", abbr: "Car", ra: 120.20, dec: -62.17, stars: ["Canopus", "Miaplacidus"] },
  { name: "Cassiopeia", abbr: "Cas", ra: 30.09, dec: 62.20, stars: ["Schedar", "Caph", "Gamma Cas"] },
  { name: "Centaurus", abbr: "Cen", ra: 201.30, dec: -47.37, stars: ["Rigil Kentaurus", "Hadar", "Menkent"] },
  { name: "Cepheus", abbr: "Cep", ra: 347.20, dec: 66.00, stars: ["Alderamin", "Alfirk"] },
  { name: "Cetus", abbr: "Cet", ra: 27.87, dec: -7.27, stars: ["Diphda", "Menkar"] },
  { name: "Chamaeleon", abbr: "Cha", ra: 132.20, dec: -79.17, stars: [] },
  { name: "Circinus", abbr: "Cir", ra: 226.30, dec: -64.03, stars: [] },
  { name: "Columba", abbr: "Col", ra: 89.30, dec: -37.37, stars: ["Phact", "Wazn"] },
  { name: "Coma Berenices", abbr: "Com", ra: 186.80, dec: 21.78, stars: ["Diadem"] },
  { name: "Corona Australis", abbr: "CrA", ra: 285.80, dec: -38.07, stars: [] },
  { name: "Corona Borealis", abbr: "CrB", ra: 235.75, dec: 32.62, stars: ["Alphecca", "Nusakan"] },
  { name: "Corvus", abbr: "Crv", ra: 188.30, dec: -16.20, stars: ["Gienah", "Minkar", "Algorab", "Kraz"] },
  { name: "Crater", abbr: "Crt", ra: 172.90, dec: -16.30, stars: [] },
  { name: "Crux", abbr: "Cru", ra: 186.20, dec: -60.17, stars: ["Acrux", "Mimosa", "Gacrux", "Imai"] },
  { name: "Cygnus", abbr: "Cyg", ra: 305.60, dec: 40.25, stars: ["Deneb", "Albireo", "Sadr", "Gienah"] },
  { name: "Delphinus", abbr: "Del", ra: 308.50, dec: 12.28, stars: ["Sualocin", "Rotanev"] },
  { name: "Dorado", abbr: "Dor", ra: 85.94, dec: -59.83, stars: [] },
  { name: "Draco", abbr: "Dra", ra: 262.60, dec: 67.17, stars: ["Thuban", "Rastaban", "Eltanin", "Aldhibain"] },
  { name: "Equuleus", abbr: "Equ", ra: 318.90, dec: 7.24, stars: ["Kitalpha"] },
  { name: "Eridanus", abbr: "Eri", ra: 58.97, dec: -24.00, stars: ["Achernar", "Cursa", "Rana", "Zaurak"] },
  { name: "Fornax", abbr: "For", ra: 45.00, dec: -33.17, stars: [] },
  { name: "Gemini", abbr: "Gem", ra: 116.33, dec: 22.36, stars: ["Pollux", "Castor", "Alhena", "Mebsuta"] },
  { name: "Grus", abbr: "Gru", ra: 340.67, dec: -46.45, stars: ["Alnair", "Tiaki"] },
  { name: "Hercules", abbr: "Her", ra: 255.20, dec: 27.32, stars: ["Kornephoros", "Rasalgethi", "Sarin"] },
  { name: "Horologium", abbr: "Hor", ra: 42.53, dec: -59.85, stars: [] },
  { name: "Hydra", abbr: "Hya", ra: 163.00, dec: -8.42, stars: ["Alphard"] },
  { name: "Hydrus", abbr: "Hyi", ra: 33.38, dec: -72.92, stars: [] },
  { name: "Indus", abbr: "Ind", ra: 319.60, dec: -59.38, stars: [] },
  { name: "Lacerta", abbr: "Lac", ra: 344.40, dec: 48.48, stars: [] },
  { name: "Leo", abbr: "Leo", ra: 152.10, dec: 23.29, stars: ["Regulus", "Algieba", "Denebola", "Zosma"] },
  { name: "Leo Minor", abbr: "LMi", ra: 148.50, dec: 32.96, stars: [] },
  { name: "Lepus", abbr: "Lep", ra: 95.90, dec: -19.92, stars: ["Arneb", "Nihal"] },
  { name: "Libra", abbr: "Lib", ra: 223.30, dec: -16.14, stars: ["Zubenelgenubi", "Zubeneschamali"] },
  { name: "Lupus", abbr: "Lup", ra: 233.88, dec: -43.13, stars: [] },
  { name: "Lynx", abbr: "Lyn", ra: 130.10, dec: 45.00, stars: [] },
  { name: "Lyra", abbr: "Lyr", ra: 279.23, dec: 36.60, stars: ["Vega", "Sheliak", "Sulafat"] },
  { name: "Mensa", abbr: "Men", ra: 81.20, dec: -77.50, stars: [] },
  { name: "Microscopium", abbr: "Mic", ra: 311.20, dec: -36.29, stars: [] },
  { name: "Monoceros", abbr: "Mon", ra: 110.20, dec: 0.27, stars: [] },
  { name: "Musca", abbr: "Mus", ra: 192.90, dec: -70.50, stars: [] },
  { name: "Norma", abbr: "Nor", ra: 245.30, dec: -47.53, stars: [] },
  { name: "Octans", abbr: "Oct", ra: 22.50, dec: -83.82, stars: [] },
  { name: "Ophiuchus", abbr: "Oph", ra: 258.90, dec: -8.57, stars: ["Rasalhague", "Cebalrai", "Sabik"] },
  { name: "Orion", abbr: "Ori", ra: 88.79, dec: 5.61, stars: ["Betelgeuse", "Rigel", "Bellatrix", "Mintaka", "Alnilam", "Alnitak", "Saiph"] },
  { name: "Pavo", abbr: "Pav", ra: 306.40, dec: -56.73, stars: ["Peacock"] },
  { name: "Pegasus", abbr: "Peg", ra: 338.70, dec: 16.31, stars: ["Enif", "Markab", "Scheat", "Algenib"] },
  { name: "Perseus", abbr: "Per", ra: 76.50, dec: 49.86, stars: ["Mirfak", "Algol", "Menkib"] },
  { name: "Phoenix", abbr: "Phe", ra: 25.50, dec: -44.57, stars: ["Ankaa"] },
  { name: "Pictor", abbr: "Pic", ra: 88.15, dec: -56.38, stars: [] },
  { name: "Pisces", abbr: "Psc", ra: 27.40, dec: 8.76, stars: ["Alpherg", "Alrescha"] },
  { name: "Piscis Austrinus", abbr: "PsA", ra: 330.20, dec: -28.38, stars: ["Fomalhaut"] },
  { name: "Puppis", abbr: "Pup", ra: 121.20, dec: -41.00, stars: ["Naos", "Tureis"] },
  { name: "Pyxis", abbr: "Pyx", ra: 132.70, dec: -27.00, stars: [] },
  { name: "Reticulum", abbr: "Ret", ra: 57.00, dec: -59.25, stars: [] },
  { name: "Sagitta", abbr: "Sge", ra: 296.00, dec: 18.95, stars: [] },
  { name: "Sagittarius", abbr: "Sgr", ra: 286.10, dec: -27.67, stars: ["Kaus Australis", "Nunki", "Ascella"] },
  { name: "Scorpius", abbr: "Sco", ra: 265.20, dec: -29.50, stars: ["Antares", "Graffias", "Dschubba", "Sargas", "Shaula"] },
  { name: "Sculptor", abbr: "Scl", ra: 15.50, dec: -31.17, stars: [] },
  { name: "Scutum", abbr: "Sct", ra: 278.70, dec: -9.37, stars: [] },
  { name: "Serpens", abbr: "Ser", ra: 233.20, dec: 4.37, stars: ["Unukalhai", "Gudja"] },
  { name: "Sextans", abbr: "Sex", ra: 152.30, dec: -1.00, stars: [] },
  { name: "Taurus", abbr: "Tau", ra: 68.88, dec: 19.20, stars: ["Aldebaran", "Elnath", "Alcyone", "Electra", "Taygeta"] },
  { name: "Telescopium", abbr: "Tel", ra: 286.20, dec: -52.03, stars: [] },
  { name: "Triangulum", abbr: "Tri", ra: 32.38, dec: 30.65, stars: ["Mothallah"] },
  { name: "Triangulum Australe", abbr: "TrA", ra: 253.20, dec: -65.38, stars: ["Atria"] },
  { name: "Tucana", abbr: "Tuc", ra: 340.00, dec: -65.00, stars: [] },
  { name: "Ursa Major", abbr: "UMa", ra: 165.50, dec: 52.00, stars: ["Dubhe", "Merak", "Phecda", "Megrez", "Alioth", "Mizar", "Alkaid"] },
  { name: "Ursa Minor", abbr: "UMi", ra: 226.00, dec: 82.50, stars: ["Polaris", "Kochab", "Pherkad", "Yildun"] },
  { name: "Vela", abbr: "Vel", ra: 147.50, dec: -47.50, stars: ["Suhail", "Markeb"] },
  { name: "Virgo", abbr: "Vir", ra: 194.20, dec: -2.83, stars: ["Spica", "Porrima", "Vindemiatrix"] },
  { name: "Volans", abbr: "Vol", ra: 120.20, dec: -70.17, stars: [] },
  { name: "Vulpecula", abbr: "Vul", ra: 302.00, dec: 24.38, stars: [] },
];

const constellationConnections: [number, number][] = [
  [0, 5], [5, 79], [79, 4], [4, 0], [14, 13], [13, 11], [11, 6], [6, 14], [19, 18], [18, 16],
  [16, 12], [12, 15], [15, 20], [20, 19], [22, 21], [21, 26], [26, 23], [23, 24], [24, 25], [25, 27],
  [27, 22], [29, 28], [28, 30], [30, 29], [31, 32], [32, 33], [33, 31], [34, 35], [35, 36], [36, 37],
  [37, 34], [38, 39], [39, 40], [40, 41], [41, 38], [42, 43], [43, 44], [44, 45], [45, 42], [46, 47],
  [47, 48], [48, 49], [49, 50], [50, 51], [51, 46], [52, 53], [53, 54], [54, 55], [55, 52], [56, 57],
  [57, 58], [58, 59], [59, 60], [60, 61], [61, 62], [62, 56], [63, 64], [64, 65], [65, 66], [66, 63],
  [67, 68], [68, 69], [69, 70], [70, 71], [71, 72], [72, 73], [73, 67], [74, 75], [75, 76], [76, 77],
  [77, 78], [78, 79], [79, 74], [80, 81], [81, 82], [82, 83], [83, 84], [84, 85], [85, 86], [86, 80],
];

function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tempToRGB(kelvin: number): { r: number; g: number; b: number } {
  let temp = kelvin / 100;
  let r: number, g: number, b: number;

  if (temp <= 66) {
    r = 255;
    g = temp <= 19 ? 99.4708025861 * Math.log(temp) - 161.1195681661 : temp - 10;
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
  }

  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  }

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g || 0));
  b = Math.max(0, Math.min(255, b || 0));

  return { r: r / 255, g: g / 255, b: b / 255 };
}

function StarPoints({ stars }: { stars: StarData[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, colors, sizes, twinkleOffsets } = useMemo(() => {
    const pos = new Float32Array(stars.length * 3);
    const col = new Float32Array(stars.length * 3);
    const siz = new Float32Array(stars.length);
    const twinkle = new Float32Array(stars.length);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      pos[i * 3] = s.x;
      pos[i * 3 + 1] = s.y;
      pos[i * 3 + 2] = s.z;

      const rgb = tempToRGB(s.temp);
      col[i * 3] = rgb.r;
      col[i * 3 + 1] = rgb.g;
      col[i * 3 + 2] = rgb.b;

      const brightness = Math.max(0.3, 1.0 - (s.mag - 1) / 6);
      siz[i] = (0.5 + brightness * 1.5) * (s.isNamed ? 2.0 : 1.0);
      twinkle[i] = s.isNamed ? 0 : Math.random() * Math.PI * 2;
    }

    return { positions: pos, colors: col, sizes: siz, twinkleOffsets: twinkle };
  }, [stars]);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < stars.length; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [stars, positions, dummy]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTwinkleSpeed: { value: 1.5 },
        uBaseOpacity: { value: 0.85 },
      },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        attribute float aTwinklePhase;
        varying vec3 vColor;
        varying float vTwinkle;
        uniform float uTime;
        uniform float uTwinkleSpeed;

        void main() {
          vColor = aColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float twinkle = sin(uTime * uTwinkleSpeed + aTwinklePhase) * 0.3 + 0.7;
          float size = aSize * twinkle;
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vTwinkle = twinkle;
        }
      `,
      fragmentShader: `
        uniform float uBaseOpacity;
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = (1.0 - dist * 2.0) * uBaseOpacity * vTwinkle;
          alpha = smoothstep(0.0, 0.1, alpha);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, stars.length]}>
      <instancedBufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <instancedBufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <instancedBufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <instancedBufferAttribute attach="attributes-aTwinklePhase" args={[twinkleOffsets, 1]} />
      </instancedBufferGeometry>
      <primitive object={shaderMaterial} attach="material" />
    </instancedMesh>
  );
}

function StarFieldScene({ onConstellationHover }: { onConstellationHover: (name: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const stars = useMemo(() => {
    const result: StarData[] = [];
    const rng = mulberry32(42);

    for (let i = 0; i < STAR_COUNT; i++) {
      const isNamed = i < constellations.length;
      let raRad: number, decRad: number, dist: number, mag: number;

      if (isNamed) {
        const c = constellations[i];
        raRad = ((c.ra * 15) / 180) * Math.PI;
        decRad = (c.dec / 180) * Math.PI;
        dist = CELESTIAL_RADIUS;
        mag = 1.5;
      } else {
        const y = 1 - (i / (STAR_COUNT - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const t = GOLDEN_ANGLE * i;
        const x = Math.cos(t) * r;
        const z = Math.sin(t) * r;
        raRad = Math.atan2(z, x);
        decRad = Math.asin(Math.max(-1, Math.min(1, y)));
        dist = CELESTIAL_RADIUS * (0.85 + rng() * 0.3);
        mag = 2.0 + rng() * 4.0;
      }

      const px = dist * Math.cos(decRad) * Math.cos(raRad);
      const py = dist * Math.sin(decRad);
      const pz = dist * Math.cos(decRad) * Math.sin(raRad);

      const rx = px;
      const ry = py * Math.cos(EARTH_TILT) - pz * Math.sin(EARTH_TILT);
      const rz = py * Math.sin(EARTH_TILT) + pz * Math.cos(EARTH_TILT);

      const temp = isNamed ? 7000 + rng() * 3000 : 3000 + rng() * 7000;

      result.push({
        x: rx, y: ry, z: rz,
        mag, temp, isNamed,
        name: isNamed ? constellations[i].name : null,
        connections: isNamed ? constellations[i].stars : null,
      });
    }
    return result;
  }, []);

  const constellationLines = useMemo(() => {
    const lines: THREE.Line[] = [];
    for (let idx = 0; idx < constellationConnections.length; idx++) {
      const [i1, i2] = constellationConnections[idx];
      if (stars[i1] && stars[i2] && stars[i1].isNamed && stars[i2].isNamed) {
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(stars[i1].x, stars[i1].y, stars[i1].z),
          new THREE.Vector3(stars[i2].x, stars[i2].y, stars[i2].z),
        ]);
        const mat = new THREE.LineBasicMaterial({
          color: '#c9a84c',
          transparent: true,
          opacity: 0.15,
          linewidth: 1,
        });
        const line = new THREE.Line(geom, mat);
        line.userData = { lineIndex: idx, name1: stars[i1].name, name2: stars[i2].name };
        lines.push(line);
      }
    }
    return lines;
  }, [stars]);

  // Update line opacity on hover
  useEffect(() => {
    constellationLines.forEach((line, i) => {
      (line.material as THREE.LineBasicMaterial).opacity = hoveredIndex === i ? 0.8 : 0.15;
    });
  }, [hoveredIndex, constellationLines]);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerV2 = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useEffect(() => {
    if (hoveredIndex !== null && constellationLines[hoveredIndex]) {
      const line = constellationLines[hoveredIndex];
      onConstellationHover(line.userData.name1 || line.userData.name2);
    } else {
      onConstellationHover(null);
    }
  }, [hoveredIndex, constellationLines, onConstellationHover]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetX = mousePos.current.x * 0.3;
    const targetY = mousePos.current.y * 0.2;

    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += 0.0003;

    const t = state.clock.elapsedTime;
    const starMesh = groupRef.current.children[0] as THREE.InstancedMesh;
    if (starMesh?.material && (starMesh.material as THREE.ShaderMaterial).uniforms) {
      (starMesh.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }

    const camera = state.camera;
    pointerV2.copy(state.pointer);
    raycaster.setFromCamera(pointerV2, camera);

    const lineMeshes = groupRef.current.children.slice(1) as THREE.Line[];
    const intersects = raycaster.intersectObjects(lineMeshes);

    if (intersects.length > 0) {
      setHoveredIndex(intersects[0].object.userData.lineIndex);
    } else {
      setHoveredIndex(null);
    }
  });

  return (
    <>
      <pointLight color="#fff5e1" intensity={0.4} distance={0} decay={0} />
      <group ref={groupRef}>
        <StarPoints stars={stars} />
        {constellationLines.map((line, i) => (
          <primitive key={i} object={line} />
        ))}
      </group>
    </>
  );
}

export default function StarFieldCanvas() {
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHover = useCallback((name: string | null) => {
    setHoveredName(name);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: 500, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(201,168,76,0.3)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(26,26,26,0.3) 0%, rgba(10,10,10,0.8) 100%)',
          mixBlendMode: 'multiply',
          zIndex: 1,
        }}
      />
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 2000 }}
        gl={{ antialias: true, alpha: true }}
      >
        <StarFieldScene onConstellationHover={handleHover} />
      </Canvas>
      {hoveredName && (
        <div
          className="absolute pointer-events-none px-3 py-1.5 font-body font-medium text-[0.8125rem] text-[#c9a84c] bg-[#1a1a1a] border border-[rgba(201,168,76,0.3)]"
          style={{ zIndex: 2, bottom: 16, left: 16 }}
        >
          {hoveredName}
        </div>
      )}
    </div>
  );
}
