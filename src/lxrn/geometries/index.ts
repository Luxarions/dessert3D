/**
 * LXRN Parametric Geometry Generators
 * @module geometries
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';
import { Vec3 } from '../math/Vec3';

export class BoxGeometry extends BufferGeometry {
  constructor(
    width: number = 1,
    height: number = 1,
    depth: number = 1,
    widthSegments: number = 1,
    heightSegments: number = 1,
    depthSegments: number = 1
  ) {
    super();
    this.name = 'BoxGeometry';

    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    let numberOfVertices = 0;

    const buildPlane = (
      u: number,
      v: number,
      w: number,
      udir: number,
      vdir: number,
      width: number,
      height: number,
      depth: number,
      gridX: number,
      gridY: number
    ) => {
      const segmentWidth = width / gridX;
      const segmentHeight = height / gridY;
      const widthHalf = width / 2;
      const heightHalf = height / 2;
      const depthHalf = depth / 2;
      const gridX1 = gridX + 1;
      const gridY1 = gridY + 1;
      let vertexCounter = 0;

      const vector = new Vec3();

      for (let iy = 0; iy < gridY1; iy++) {
        const y = iy * segmentHeight - heightHalf;
        for (let ix = 0; ix < gridX1; ix++) {
          const x = ix * segmentWidth - widthHalf;

          vector.setComponent(u, x * udir);
          vector.setComponent(v, y * vdir);
          vector.setComponent(w, depthHalf);

          vertices.push(vector.x, vector.y, vector.z);

          vector.setComponent(u, 0);
          vector.setComponent(v, 0);
          vector.setComponent(w, depthHalf > 0 ? 1 : -1);

          normals.push(vector.x, vector.y, vector.z);
          uvs.push(ix / gridX, 1 - iy / gridY);

          vertexCounter += 1;
        }
      }

      for (let iy = 0; iy < gridY; iy++) {
        for (let ix = 0; ix < gridX; ix++) {
          const a = numberOfVertices + ix + gridX1 * iy;
          const b = numberOfVertices + ix + gridX1 * (iy + 1);
          const c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
          const d = numberOfVertices + (ix + 1) + gridX1 * iy;

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      numberOfVertices += vertexCounter;
    };

    // px, nx, py, ny, pz, nz
    buildPlane(2, 1, 0, -1, -1, depth, height, width, depthSegments, heightSegments);
    buildPlane(2, 1, 0, 1, -1, depth, height, -width, depthSegments, heightSegments);
    buildPlane(0, 2, 1, 1, 1, width, depth, height, widthSegments, depthSegments);
    buildPlane(0, 2, 1, 1, -1, width, depth, -height, widthSegments, depthSegments);
    buildPlane(0, 1, 2, 1, -1, width, height, depth, widthSegments, heightSegments);
    buildPlane(0, 1, 2, -1, -1, width, height, -depth, widthSegments, heightSegments);

    this.setIndex(indices);
    this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}

export class SphereGeometry extends BufferGeometry {
  constructor(
    radius: number = 1,
    widthSegments: number = 32,
    heightSegments: number = 16,
    phiStart: number = 0,
    phiLength: number = Math.PI * 2,
    thetaStart: number = 0,
    thetaLength: number = Math.PI
  ) {
    super();
    this.name = 'SphereGeometry';

    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));

    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    const grid: number[][] = [];
    let index = 0;

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow: number[] = [];
      const v = iy / heightSegments;

      let uOffset = 0;
      if (iy === 0 && thetaStart === 0) {
        uOffset = 0.5 / widthSegments;
      } else if (iy === heightSegments && thetaStart + thetaLength === Math.PI) {
        uOffset = -0.5 / widthSegments;
      }

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;

        const x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        const y = radius * Math.cos(thetaStart + v * thetaLength);
        const z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

        vertices.push(x, y, z);

        const normal = new Vec3(x, y, z).normalize();
        normals.push(normal.x, normal.y, normal.z);
        uvs.push(u + uOffset, 1 - v);

        verticesRow.push(index++);
      }

      grid.push(verticesRow);
    }

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];

        if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
        if (iy !== heightSegments - 1 || thetaStart + thetaLength < Math.PI) indices.push(b, c, d);
      }
    }

    this.setIndex(indices);
    this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}

export class PlaneGeometry extends BufferGeometry {
  constructor(
    width: number = 1,
    height: number = 1,
    widthSegments: number = 1,
    heightSegments: number = 1
  ) {
    super();
    this.name = 'PlaneGeometry';

    const widthHalf = width / 2;
    const heightHalf = height / 2;
    const gridX = Math.floor(widthSegments);
    const gridY = Math.floor(heightSegments);
    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;
    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;

    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    for (let iy = 0; iy < gridY1; iy++) {
      const y = iy * segmentHeight - heightHalf;
      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segmentWidth - widthHalf;

        vertices.push(x, -y, 0);
        normals.push(0, 0, 1);
        uvs.push(ix / gridX, 1 - iy / gridY);
      }
    }

    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + gridX1 * iy;
        const b = ix + gridX1 * (iy + 1);
        const c = ix + 1 + gridX1 * (iy + 1);
        const d = ix + 1 + gridX1 * iy;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.setIndex(indices);
    this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}

export class CylinderGeometry extends BufferGeometry {
  constructor(
    radiusTop: number = 1,
    radiusBottom: number = 1,
    height: number = 1,
    radialSegments: number = 32,
    heightSegments: number = 1
  ) {
    super();
    this.name = 'CylinderGeometry';

    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const halfHeight = height / 2;
    let index = 0;

    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const radius = v * (radiusBottom - radiusTop) + radiusTop;
      const py = -v * height + halfHeight;

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;

        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        vertices.push(radius * sinTheta, py, radius * cosTheta);
        const n = new Vec3(sinTheta, (radiusTop - radiusBottom) / height, cosTheta).normalize();
        normals.push(n.x, n.y, n.z);
        uvs.push(u, 1 - v);

        if (x < radialSegments && y < heightSegments) {
          const a = index;
          const b = index + radialSegments + 1;
          const c = index + radialSegments + 2;
          const d = index + 1;

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
        index++;
      }
    }

    this.setIndex(indices);
    this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}

export class ConeGeometry extends CylinderGeometry {
  constructor(radius: number = 1, height: number = 1, radialSegments: number = 32) {
    super(0, radius, height, radialSegments, 1);
    this.name = 'ConeGeometry';
  }
}

export class TorusGeometry extends BufferGeometry {
  constructor(radius: number = 1, tube: number = 0.4, radialSegments: number = 16, tubularSegments: number = 32) {
    super();
    this.name = 'TorusGeometry';

    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const center = new Vec3();
    const vertex = new Vec3();
    const normal = new Vec3();

    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = (i / tubularSegments) * Math.PI * 2;
        const v = (j / radialSegments) * Math.PI * 2;

        vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
        vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u);
        vertex.z = tube * Math.sin(v);

        vertices.push(vertex.x, vertex.y, vertex.z);

        center.x = radius * Math.cos(u);
        center.y = radius * Math.sin(u);
        normal.subVectors(vertex, center).normalize();

        normals.push(normal.x, normal.y, normal.z);
        uvs.push(i / tubularSegments, j / radialSegments);
      }
    }

    for (let j = 1; j <= radialSegments; j++) {
      for (let i = 1; i <= tubularSegments; i++) {
        const a = (tubularSegments + 1) * j + i - 1;
        const b = (tubularSegments + 1) * (j - 1) + i - 1;
        const c = (tubularSegments + 1) * (j - 1) + i;
        const d = (tubularSegments + 1) * j + i;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.setIndex(indices);
    this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}

export class TorusKnotGeometry extends BufferGeometry {
  constructor(radius: number = 1, tube: number = 0.4, tubularSegments: number = 64, radialSegments: number = 8, p: number = 2, q: number = 3) {
    super();
    this.name = 'TorusKnotGeometry';

    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const calculatePosition = (u: number): Vec3 => {
      const cu = Math.cos(u);
      const su = Math.sin(u);
      const quOverP = (q / p) * u;
      const cs = Math.cos(quOverP);

      const x = radius * (2 + cs) * 0.5 * cu;
      const y = radius * (2 + cs) * 0.5 * su;
      const z = radius * Math.sin(quOverP) * 0.5;
      return new Vec3(x, y, z);
    };

    for (let i = 0; i <= tubularSegments; ++i) {
      const u = (i / tubularSegments) * p * Math.PI * 2;
      const p1 = calculatePosition(u);
      const p2 = calculatePosition(u + 0.01);

      const T = new Vec3().subVectors(p2, p1).normalize();
      const B = new Vec3().crossVectors(T, new Vec3(0, 0, 1)).normalize();
      const N = new Vec3().crossVectors(B, T).normalize();

      for (let j = 0; j <= radialSegments; ++j) {
        const v = (j / radialSegments) * Math.PI * 2;
        const cx = -tube * Math.cos(v);
        const cy = tube * Math.sin(v);

        const x = p1.x + (cx * N.x + cy * B.x);
        const y = p1.y + (cx * N.y + cy * B.y);
        const z = p1.z + (cx * N.z + cy * B.z);

        vertices.push(x, y, z);

        const normal = new Vec3(x - p1.x, y - p1.y, z - p1.z).normalize();
        normals.push(normal.x, normal.y, normal.z);
        uvs.push(i / tubularSegments, j / radialSegments);
      }
    }

    for (let j = 1; j <= tubularSegments; j++) {
      for (let i = 1; i <= radialSegments; i++) {
        const a = (radialSegments + 1) * (j - 1) + (i - 1);
        const b = (radialSegments + 1) * j + (i - 1);
        const c = (radialSegments + 1) * j + i;
        const d = (radialSegments + 1) * (j - 1) + i;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.setIndex(indices);
    this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}
