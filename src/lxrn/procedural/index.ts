/**
 * LXRN Procedural Engine & System Effects Suite
 * @module procedural
 */

import { Object3D } from '../core/Object3D';
import { Mesh } from '../core/Mesh';
import { Points } from '../core/Mesh';
import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute, Float32BufferAttribute } from '../core/BufferAttribute';
import { StandardMaterial as MeshStandardMaterial, BasicMaterial as MeshBasicMaterial, PointsMaterial } from '../materials';
import { Color } from '../math/Color';
import { Vec3 } from '../math/Vec3';
import { SimplexNoise } from '../math/Noise';
import { BoxGeometry, SphereGeometry, CylinderGeometry, PlaneGeometry, ConeGeometry } from '../geometries';


// 1. Procedural Terrain
export class ProceduralTerrain extends Mesh {
  noise: SimplexNoise = new SimplexNoise();
  constructor(width: number = 80, depth: number = 80, segments: number = 128, octaves: number = 8, scale: number = 0.03) {
    const geo = new BufferGeometry();
    const grid = segments;
    const grid1 = grid + 1;
    const verts = new Float32Array(grid1 * grid1 * 3);
    const uvs = new Float32Array(grid1 * grid1 * 2);
    const indices: number[] = [];

    const halfW = width / 2;
    const halfD = depth / 2;

    const noise = new SimplexNoise();

    for (let j = 0; j <= grid; j++) {
      const z = (j / grid) * depth - halfD;
      for (let i = 0; i <= grid; i++) {
        const x = (i / grid) * width - halfW;
        
        // Multi-octave Perlin/Simplex noise
        let y = 0;
        let amp = 1.0;
        let freq = scale;
        for (let o = 0; o < octaves; o++) {
          y += noise.noise2D(x * freq, z * freq) * amp * 5;
          amp *= 0.5;
          freq *= 2.0;
        }

        const idx = (j * grid1 + i) * 3;
        verts[idx] = x;
        verts[idx + 1] = y;
        verts[idx + 2] = z;

        const uvIdx = (j * grid1 + i) * 2;
        uvs[uvIdx] = i / grid;
        uvs[uvIdx + 1] = j / grid;
      }
    }

    for (let j = 0; j < grid; j++) {
      for (let i = 0; i < grid; i++) {
        const a = j * grid1 + i;
        const b = (j + 1) * grid1 + i;
        const c = (j + 1) * grid1 + i + 1;
        const d = j * grid1 + i + 1;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geo.setIndex(indices);
    geo.setAttribute('position', new Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geo.computeVertexNormals();

    const mat = new MeshStandardMaterial({ color: 0x3d7a44, roughness: 0.8 });
    super(geo, mat);
    this.name = 'ProceduralTerrain';
  }
}

// 2. Ocean
export class Ocean extends Mesh {
  baseVertices: Float32Array;
  constructor(width: number = 150, depth: number = 150, segments: number = 100) {
    const geo = new PlaneGeometry(width, depth, segments, segments);
    const posAttr = geo.getAttribute('position')!;
    const baseVerts = new Float32Array(posAttr.array);

    const mat = new MeshStandardMaterial({ color: 0x004488, roughness: 0.1 });
    mat.uniforms = {
      color: { value: new Color(0x004488) }
    };

    super(geo, mat);
    this.name = 'Ocean';
    this.rotation.x = -Math.PI / 2;
    this.baseVertices = baseVerts;
  }

  update(time: number): void {
    const posAttr = this.geometry.getAttribute('position')!;
    const array = posAttr.array as Float32Array;
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      const bx = this.baseVertices[i * 3];
      const by = this.baseVertices[i * 3 + 1];
      const z = Math.sin(bx * 0.1 + time * 2) * 0.5 + Math.cos(by * 0.1 + time * 1.5) * 0.5;
      array[i * 3 + 2] = z;
    }
    posAttr.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }
}

// 3. City Generator
export interface CityOptions {
  width?: number;
  depth?: number;
  blockSize?: number;
  buildingHeightMin?: number;
  buildingHeightMax?: number;
  buildingWidthMin?: number;
  buildingWidthMax?: number;
}

export class CityGenerator extends Object3D {
  constructor(options: CityOptions = {}) {
    super();
    this.name = 'CityGenerator';

    const width = options.width || 100;
    const depth = options.depth || 100;
    const blockSize = options.blockSize || 8;
    const hMin = options.buildingHeightMin || 3;
    const hMax = options.buildingHeightMax || 40;
    const wMin = options.buildingWidthMin || 2;
    const wMax = options.buildingWidthMax || 6;

    const buildingMat = new MeshStandardMaterial({ color: 0x556677, roughness: 0.4 });
    const windowMat = new MeshBasicMaterial({ color: 0xffdd88 });

    const numBlocksX = Math.floor(width / blockSize);
    const numBlocksZ = Math.floor(depth / blockSize);

    for (let bx = -numBlocksX / 2; bx < numBlocksX / 2; bx++) {
      for (let bz = -numBlocksZ / 2; bz < numBlocksZ / 2; bz++) {
        if (Math.random() > 0.15) {
          const bw = wMin + Math.random() * (wMax - wMin);
          const bd = wMin + Math.random() * (wMax - wMin);
          const bh = hMin + Math.random() * (hMax - hMin);

          const posX = bx * blockSize + (blockSize - bw) / 2;
          const posZ = bz * blockSize + (blockSize - bd) / 2;

          const buildingGeo = new BoxGeometry(bw, bh, bd);
          const buildingMesh = new Mesh(buildingGeo, buildingMat);
          buildingMesh.position.set(posX, bh / 2, posZ);
          this.add(buildingMesh);
        }
      }
    }
  }
}

// 4. Galaxy Generator
export interface GalaxyOptions {
  count?: number;
  arms?: number;
  radius?: number;
  spin?: number;
  randomness?: number;
  colors?: Color[];
}

export class GalaxyGenerator extends Points {
  constructor(options: GalaxyOptions = {}) {
    const count = options.count || 15000;
    const arms = options.arms || 4;
    const radius = options.radius || 25;
    const spin = options.spin || 2.5;
    const randomness = options.randomness || 0.4;
    const colors = options.colors || [new Color(0x4488ff), new Color(0xaa88ff), new Color(0xffaa44)];

    const positions = new Float32Array(count * 3);
    const particleColors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius;
      const spinAngle = r * spin;
      const branchAngle = ((i % arms) / arms) * Math.PI * 2;

      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r);
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r);
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r);

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      const mixedColor = colors[i % colors.length];
      particleColors[i * 3] = mixedColor.r;
      particleColors[i * 3 + 1] = mixedColor.g;
      particleColors[i * 3 + 2] = mixedColor.b;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new Float32BufferAttribute(particleColors, 3));

    const mat = new PointsMaterial({ size: 0.1, sizeAttenuation: true });
    super(geo, mat);
    this.name = 'GalaxyGenerator';
  }
}

// 5. Explosion
export interface ExplosionOptions {
  count?: number;
  radius?: number;
  duration?: number;
  colors?: Color[];
}

export class Explosion extends Points {
  velocities: Float32Array;
  life: number = 0;
  duration: number;

  constructor(options: ExplosionOptions = {}) {
    const count = options.count || 800;
    const radius = options.radius || 8;
    const duration = options.duration || 2.5;

    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      const dir = new Vec3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar((Math.random() * 0.8 + 0.2) * (radius / duration));

      velocities[i * 3] = dir.x;
      velocities[i * 3 + 1] = dir.y;
      velocities[i * 3 + 2] = dir.z;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const mat = new PointsMaterial({ color: 0xff5500, size: 0.2, sizeAttenuation: true });
    super(geo, mat);
    this.velocities = velocities;
    this.duration = duration;
    this.name = 'Explosion';
  }

  update(dt: number): void {
    this.life += dt;
    if (this.life > this.duration) return;

    const posAttr = this.geometry.getAttribute('position')!;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < array.length / 3; i++) {
      array[i * 3] += this.velocities[i * 3] * dt;
      array[i * 3 + 1] += this.velocities[i * 3 + 1] * dt;
      array[i * 3 + 2] += this.velocities[i * 3 + 2] * dt;
    }
    posAttr.needsUpdate = true;
  }
}

// 6. Portal Effect
export class PortalEffect extends Points {
  baseRadius: number;

  constructor(radius: number = 2, segments: number = 48) {
    const count = segments * 10;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.3;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const mat = new PointsMaterial({ color: 0x00ffff, size: 0.1, sizeAttenuation: true });
    super(geo, mat);
    this.baseRadius = radius;
    this.name = 'PortalEffect';
  }

  update(time: number): void {
    this.rotation.z = time * 2;
  }
}

// 7. Fire System
export interface FireOptions {
  count?: number;
  spread?: number;
  height?: number;
  speed?: number;
  colors?: Color[];
}

export class FireSystem extends Points {
  velocities: Float32Array;
  speeds: Float32Array;

  constructor(options: FireOptions = {}) {
    const count = options.count || 300;
    const spread = options.spread || 1.5;
    const height = options.height || 3;

    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = Math.random() * 2 + 1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      speeds[i] = Math.random() * height;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const mat = new PointsMaterial({ color: 0xffaa00, size: 0.15, sizeAttenuation: true });
    super(geo, mat);
    this.velocities = velocities;
    this.speeds = speeds;
    this.name = 'FireSystem';
  }

  update(dt: number): void {
    const posAttr = this.geometry.getAttribute('position')!;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < array.length / 3; i++) {
      array[i * 3 + 1] += this.velocities[i * 3 + 1] * dt;
      if (array[i * 3 + 1] > 3) {
        array[i * 3 + 1] = 0;
        array[i * 3] = (Math.random() - 0.5) * 1.5;
        array[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      }
    }
    posAttr.needsUpdate = true;
  }
}

// 8. Waterfall
export interface WaterfallOptions {
  count?: number;
  width?: number;
  height?: number;
  speed?: number;
  spread?: number;
}

export class Waterfall extends Points {
  speed: number;
  height: number;

  constructor(options: WaterfallOptions = {}) {
    const count = options.count || 1500;
    const width = options.width || 1.5;
    const height = options.height || 5;
    const speed = options.speed || 1.2;

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * width;
      positions[i * 3 + 1] = Math.random() * height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const mat = new PointsMaterial({ color: 0x88ccff, size: 0.08, sizeAttenuation: true });
    super(geo, mat);
    this.speed = speed;
    this.height = height;
    this.name = 'Waterfall';
  }

  update(dt: number): void {
    const posAttr = this.geometry.getAttribute('position')!;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < array.length / 3; i++) {
      array[i * 3 + 1] -= this.speed * 4 * dt;
      if (array[i * 3 + 1] < 0) {
        array[i * 3 + 1] = this.height;
      }
    }
    posAttr.needsUpdate = true;
  }
}

// 9. Aurora Effect
export class Aurora extends Mesh {
  constructor(width: number = 150, height: number = 60, segments: number = 80) {
    const geo = new PlaneGeometry(width, height, segments, segments / 2);
    const mat = new MeshBasicMaterial({ color: 0x00ff88, wireframe: true });
    mat.uniforms = {
      color1: { value: new Color(0x00ff88) },
      color2: { value: new Color(0x00aaff) }
    };
    super(geo, mat);
    this.name = 'Aurora';
  }

  update(time: number): void {
    const posAttr = this.geometry.getAttribute('position')!;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < posAttr.count; i++) {
      const x = array[i * 3];
      array[i * 3 + 2] = Math.sin(x * 0.05 + time) * 5 + Math.cos(x * 0.1 + time * 1.5) * 2;
    }
    posAttr.needsUpdate = true;
  }
}

// 10. Forest Generator
export interface ForestOptions {
  width?: number;
  depth?: number;
  treeCount?: number;
  minHeight?: number;
  maxHeight?: number;
  trunkRadius?: number;
  leafRadius?: number;
}

export class ForestGenerator extends Object3D {
  castShadow: boolean = false;
  receiveShadow: boolean = false;

  constructor(options: ForestOptions = {}) {
    super();
    this.name = 'ForestGenerator';

    const width = options.width || 100;
    const depth = options.depth || 100;
    const treeCount = options.treeCount || 600;
    const minH = options.minHeight || 1;
    const maxH = options.maxHeight || 12;

    const trunkMat = new MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.9 });
    const leafMat = new MeshStandardMaterial({ color: 0x1e5631, roughness: 0.8 });

    for (let i = 0; i < treeCount; i++) {
      const x = (Math.random() - 0.5) * width;
      const z = (Math.random() - 0.5) * depth;
      const h = minH + Math.random() * (maxH - minH);

      const tree = new Object3D();

      const trunkGeo = new CylinderGeometry(0.15, 0.25, h * 0.4, 8);
      const trunk = new Mesh(trunkGeo, trunkMat);
      trunk.position.y = (h * 0.4) / 2;
      tree.add(trunk);

      const leafGeo = new ConeGeometry(0.8 + Math.random() * 0.4, h * 0.7, 8);
      const leaves = new Mesh(leafGeo, leafMat);
      leaves.position.y = h * 0.4 + (h * 0.7) / 2;
      tree.add(leaves);

      tree.position.set(x, 0, z);
      this.add(tree);
    }
  }
}

// 11. Solar System
export interface SolarOptions {
  planetCount?: number;
  scale?: number;
  sunRadius?: number;
  planetRadiusMin?: number;
  planetRadiusMax?: number;
  orbitRadiusMin?: number;
  orbitRadiusMax?: number;
}

export class SolarSystem extends Object3D {
  planets: { mesh: Mesh; orbitRadius: number; speed: number; angle: number }[] = [];

  constructor(options: SolarOptions = {}) {
    super();
    this.name = 'SolarSystem';

    const planetCount = options.planetCount || 8;
    const sunRadius = options.sunRadius || 2.5;

    // Sun
    const sunGeo = new SphereGeometry(sunRadius, 32, 32);
    const sunMat = new MeshBasicMaterial({ color: 0xffaa00 });
    const sun = new Mesh(sunGeo, sunMat);
    this.add(sun);

    const colors = [0x888888, 0xeeaa88, 0x2288ff, 0xff4422, 0xeecc88, 0xccaa77, 0x66ccff, 0x3366cc];

    for (let i = 0; i < planetCount; i++) {
      const r = 0.3 + Math.random() * 0.6;
      const orbitR = 5 + i * 2.2;
      const speed = (1 / Math.sqrt(orbitR)) * 0.8;

      const planetGeo = new SphereGeometry(r, 16, 16);
      const planetMat = new MeshStandardMaterial({ color: colors[i % colors.length] });
      const planetMesh = new Mesh(planetGeo, planetMat);

      this.add(planetMesh);
      this.planets.push({ mesh: planetMesh, orbitRadius: orbitR, speed, angle: Math.random() * Math.PI * 2 });
    }
  }

  update(time: number): void {
    for (const p of this.planets) {
      p.angle += p.speed * 0.05;
      p.mesh.position.x = Math.cos(p.angle) * p.orbitRadius;
      p.mesh.position.z = Math.sin(p.angle) * p.orbitRadius;
    }
  }
}

// 12. Lightning Storm
export interface LightningOptions {
  branches?: number;
  length?: number;
  jitter?: number;
  duration?: number;
  interval?: number;
}

export class LightningStorm extends Object3D {
  constructor(options: LightningOptions = {}) {
    super();
    this.name = 'LightningStorm';
    const geo = new BufferGeometry();
    const verts = [0, 12, 0, 0.5, 9, 0.2, -0.2, 6, -0.1, 0.8, 3, 0.1, 0, 0, 0];
    geo.setAttribute('position', new Float32BufferAttribute(verts, 3));
    const mat = new PointsMaterial({ color: 0xaabbff, size: 0.15 });
    const lineMesh = new Points(geo, mat);
    this.add(lineMesh);
  }

  update(dt: number): void {}
}

// 13. Magic System
export interface MagicOptions {
  count?: number;
  radius?: number;
  speed?: number;
  colors?: Color[];
}

export class MagicSystem extends Points {
  constructor(options: MagicOptions = {}) {
    const count = options.count || 300;
    const radius = options.radius || 3.5;

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const mat = new PointsMaterial({ color: 0xaa66ff, size: 0.12, sizeAttenuation: true });
    super(geo, mat);
    this.name = 'MagicSystem';
  }

  update(time: number): void {
    this.rotation.y = time * 0.5;
  }
}
