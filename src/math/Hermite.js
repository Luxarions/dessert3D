/**
 * LXRN Hermite
 * @module Hermite
 */

import { Vec3 } from './Vec3.js';

class Hermite {
  constructor(p0 = new Vec3(), p1 = new Vec3(), t0 = new Vec3(), t1 = new Vec3()) {
    this.isHermite = true;
    this.p0 = p0;
    this.p1 = p1;
    this.t0 = t0;
    this.t1 = t1;
  }

  set(p0, p1, t0, t1) {
    this.p0.copy(p0);
    this.p1.copy(p1);
    this.t0.copy(t0);
    this.t1.copy(t1);
    return this;
  }

  getPoint(t, target = new Vec3()) {
    const t2 = t * t;
    const t3 = t2 * t;

    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    target.set(0, 0, 0);
    target.addScaledVector(this.p0, h00);
    target.addScaledVector(this.t0, h10);
    target.addScaledVector(this.p1, h01);
    target.addScaledVector(this.t1, h11);

    return target;
  }
}

export { Hermite };
