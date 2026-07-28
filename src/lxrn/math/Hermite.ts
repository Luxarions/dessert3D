/**
 * LXRN Hermite Spline
 * @module Hermite
 */

import { Vec3 } from './Vec3';

export class HermiteCurve3 {
  public p0: Vec3;
  public p1: Vec3;
  public t0: Vec3;
  public t1: Vec3;

  constructor(p0: Vec3 = new Vec3(), p1: Vec3 = new Vec3(1, 0, 0), t0: Vec3 = new Vec3(0, 1, 0), t1: Vec3 = new Vec3(0, -1, 0)) {
    this.p0 = p0;
    this.p1 = p1;
    this.t0 = t0;
    this.t1 = t1;
  }

  getPoint(t: number, target: Vec3 = new Vec3()): Vec3 {
    const t2 = t * t;
    const t3 = t2 * t;

    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    target.x = h00 * this.p0.x + h10 * this.t0.x + h01 * this.p1.x + h11 * this.t1.x;
    target.y = h00 * this.p0.y + h10 * this.t0.y + h01 * this.p1.y + h11 * this.t1.y;
    target.z = h00 * this.p0.z + h10 * this.t0.z + h01 * this.p1.z + h11 * this.t1.z;

    return target;
  }

  getPoints(divisions: number = 50): Vec3[] {
    const pts: Vec3[] = [];
    for (let i = 0; i <= divisions; i++) {
      pts.push(this.getPoint(i / divisions));
    }
    return pts;
  }
}
