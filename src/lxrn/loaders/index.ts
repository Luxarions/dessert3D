/**
 * LXRN Asset Loaders
 * Parsers for 3D geometry files (.OBJ, .STL, .GLTF, images)
 * @module loaders
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';
import { Texture } from '../textures';

export class OBJLoader {
  parse(text: string): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.name = 'OBJParsedGeometry';

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    const outPositions: number[] = [];
    const outNormals: number[] = [];
    const outUVs: number[] = [];

    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      const parts = line.split(/\s+/);
      const type = parts[0];

      if (type === 'v') {
        positions.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
      } else if (type === 'vn') {
        normals.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
      } else if (type === 'vt') {
        uvs.push(parseFloat(parts[1]), parseFloat(parts[2]));
      } else if (type === 'f') {
        for (let j = 1; j <= 3; j++) {
          const facePart = parts[j].split('/');
          const vIdx = (parseInt(facePart[0]) - 1) * 3;
          if (vIdx >= 0) {
            outPositions.push(positions[vIdx], positions[vIdx + 1], positions[vIdx + 2]);
          }

          if (facePart[1]) {
            const uvIdx = (parseInt(facePart[1]) - 1) * 2;
            outUVs.push(uvs[uvIdx], uvs[uvIdx + 1]);
          }

          if (facePart[2]) {
            const nIdx = (parseInt(facePart[2]) - 1) * 3;
            outNormals.push(normals[nIdx], normals[nIdx + 1], normals[nIdx + 2]);
          }
        }
      }
    }

    geometry.setAttribute('position', new BufferAttribute(new Float32Array(outPositions), 3));
    if (outNormals.length > 0) geometry.setAttribute('normal', new BufferAttribute(new Float32Array(outNormals), 3));
    if (outUVs.length > 0) geometry.setAttribute('uv', new BufferAttribute(new Float32Array(outUVs), 2));

    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return geometry;
  }
}

export class STLLoader {
  parse(data: ArrayBuffer | string): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.name = 'STLParsedGeometry';

    if (typeof data === 'string') {
      // ASCII STL
      const positions: number[] = [];
      const lines = data.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('vertex')) {
          const parts = line.split(/\s+/);
          positions.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
        }
      }
      geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    } else {
      // Binary STL
      const reader = new DataView(data);
      const faces = reader.getUint32(80, true);
      const positions = new Float32Array(faces * 9);

      let offset = 84;
      for (let i = 0; i < faces; i++) {
        offset += 12; // Skip normal
        for (let j = 0; j < 9; j++) {
          positions[i * 9 + j] = reader.getFloat32(offset, true);
          offset += 4;
        }
        offset += 2; // Skip attribute byte count
      }
      geometry.setAttribute('position', new BufferAttribute(positions, 3));
    }

    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return geometry;
  }
}

export class TextureLoader {
  load(url: string, onLoad?: (texture: Texture) => void): Texture {
    const texture = new Texture();
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      texture.image = image;
      texture.needsUpdate = true;
      if (onLoad) onLoad(texture);
    };
    image.src = url;
    return texture;
  }
}
