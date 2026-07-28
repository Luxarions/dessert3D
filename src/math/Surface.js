/**
 * LXRN Surface
 * @module Surface
 */

import { Vec3 } from './Vec3.js';
import { Bound3 } from './Bound3.js';

class Surface {
  constructor(controlPoints = [[]]) {
    this.isSurface = true;
    this.controlPoints = controlPoints; // 2D array of Vec3
  }

  set(controlPoints) {
    this.controlPoints = controlPoints;
    return this;
  }

  getPoint(u, v, target = new Vec3()) {
    const rows = this.controlPoints.length;
    if (rows === 0) return target.set(0, 0, 0);
    const cols = this.controlPoints[0].length;
    if (cols === 0) return target.set(0, 0, 0);

    const r = (rows - 1) * u;
    const c = (cols - 1) * v;

    const r0 = Math.floor(r);
    const r1 = Math.min(r0 + 1, rows - 1);
    const c0 = Math.floor(c);
    const c1 = Math.min(c0 + 1, cols - 1);

    const ur = r - r0;
    const vc = c - c0;

    const p00 = this.controlPoints[r0][c0];
    const p01 = this.controlPoints[r0][c1];
    const p10 = this.controlPoints[r1][c0];
    const p11 = this.controlPoints[r1][c1];

    const top = p00.clone().lerp(p01, vc);
    const bottom = p10.clone().lerp(p11, vc);

    return target.copy(top.lerp(bottom, ur));
  }

  getBoundingBox(target = new Bound3()) {
    target.makeEmpty();
    for (let i = 0; i < this.controlPoints.length; i++) {
      for (let j = 0; j < this.controlPoints[i].length; j++) {
        target.expandByPoint(this.controlPoints[i][j]);
      }
    }
    return target;
  }
}

export { Surface };
