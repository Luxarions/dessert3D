/**
 * LXRN Spline
 * @module Spline
 */

import { Vec3 } from './Vec3.js';
import { clamp } from './MathUtils.js';

class Spline {
  constructor(points = []) {
    this.isSpline = true;
    this.points = points;
  }

  set(points) {
    this.points = points;
    return this;
  }

  clone() {
    return new Spline(this.points.map(p => p.clone()));
  }

  copy(spline) {
    this.points = spline.points.map(p => p.clone());
    return this;
  }

  getPoint(t, target = new Vec3()) {
    if (this.points.length === 0) return target.set(0, 0, 0);
    if (this.points.length === 1) return target.copy(this.points[0]);

    const point = (this.points.length - 1) * t;
    const intPoint = Math.floor(point);
    const weight = point - intPoint;

    const p0 = this.points[intPoint === 0 ? intPoint : intPoint - 1];
    const p1 = this.points[intPoint];
    const p2 = this.points[intPoint > this.points.length - 2 ? this.points.length - 1 : intPoint + 1];
    const p3 = this.points[intPoint > this.points.length - 3 ? this.points.length - 1 : intPoint + 2];

    const w2 = weight * weight;
    const w3 = weight * w2;

    target.x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * weight + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * w2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * w3);
    target.y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * weight + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * w2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * w3);
    target.z = 0.5 * ((2 * p1.z) + (-p0.z + p2.z) * weight + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * w2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * w3);

    return target;
  }
}

export { Spline };
