/**
 * LXRN Bezier
 * @module Bezier
 */

import { Vec3 } from './Vec3.js';

class Bezier {
  constructor(v0 = new Vec3(), v1 = new Vec3(), v2 = new Vec3(), v3 = new Vec3()) {
    this.isBezier = true;
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
  }

  set(v0, v1, v2, v3) {
    this.v0.copy(v0);
    this.v1.copy(v1);
    this.v2.copy(v2);
    this.v3.copy(v3);
    return this;
  }

  clone() {
    return new Bezier(this.v0.clone(), this.v1.clone(), this.v2.clone(), this.v3.clone());
  }

  copy(bezier) {
    this.v0.copy(bezier.v0);
    this.v1.copy(bezier.v1);
    this.v2.copy(bezier.v2);
    this.v3.copy(bezier.v3);
    return this;
  }

  getPoint(t, target = new Vec3()) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    target.set(0, 0, 0);
    target.addScaledVector(this.v0, uuu);
    target.addScaledVector(this.v1, 3 * uu * t);
    target.addScaledVector(this.v2, 3 * u * tt);
    target.addScaledVector(this.v3, ttt);

    return target;
  }

  getTangent(t, target = new Vec3()) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;

    target.set(0, 0, 0);
    target.addScaledVector(this.v1.clone().sub(this.v0), 3 * uu);
    target.addScaledVector(this.v2.clone().sub(this.v1), 6 * u * t);
    target.addScaledVector(this.v3.clone().sub(this.v2), 3 * tt);

    return target.normalize();
  }

  getPoints(divisions = 5) {
    const points = [];
    for (let d = 0; d <= divisions; d++) {
      points.push(this.getPoint(d / divisions, new Vec3()));
    }
    return points;
  }
}

export { Bezier };
