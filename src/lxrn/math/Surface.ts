/**
 * LXRN Parametric Surface
 * @module Surface
 */

import { Vec3 } from './Vec3';

export type ParametricSurfaceFunction = (u: number, v: number, target?: Vec3) => Vec3;

export class Surface {
  public func: ParametricSurfaceFunction;

  constructor(func: ParametricSurfaceFunction) {
    this.func = func;
  }

  getPoint(u: number, v: number, target: Vec3 = new Vec3()): Vec3 {
    return this.func(u, v, target);
  }

  generateGrid(uDivisions: number = 30, vDivisions: number = 30): { vertices: Vec3[]; indices: number[]; uvs: [number, number][] } {
    const vertices: Vec3[] = [];
    const uvs: [number, number][] = [];
    const indices: number[] = [];

    for (let j = 0; j <= vDivisions; j++) {
      const v = j / vDivisions;
      for (let i = 0; i <= uDivisions; i++) {
        const u = i / uDivisions;
        vertices.push(this.getPoint(u, v));
        uvs.push([u, v]);
      }
    }

    for (let j = 0; j < vDivisions; j++) {
      for (let i = 0; i < uDivisions; i++) {
        const row1 = j * (uDivisions + 1);
        const row2 = (j + 1) * (uDivisions + 1);

        const a = row1 + i;
        const b = row1 + i + 1;
        const c = row2 + i;
        const d = row2 + i + 1;

        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }

    return { vertices, indices, uvs };
  }
}
