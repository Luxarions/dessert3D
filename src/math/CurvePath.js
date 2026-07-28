/**
 * LXRN CurvePath
 * @module CurvePath
 */

import { Vec3 } from './Vec3.js';
import { Spline } from './Spline.js';
import { Bezier } from './Bezier.js';
import { CatmullRom } from './CatmullRom.js';
import { clamp } from './MathUtils.js';

class CurvePath {
  constructor() {
    this.isCurvePath = true;
    this.curves = [];
    this.autoClose = false;
  }

  add(curve) {
    this.curves.push(curve);
  }

  closePath() {
    const startPoint = this.curves[0].getPoint(0, new Vec3());
    const endPoint = this.curves[this.curves.length - 1].getPoint(1, new Vec3());

    if (!startPoint.equals(endPoint)) {
      this.curves.push(new Spline([endPoint, startPoint]));
    }
  }

  getPoint(t, target = new Vec3()) {
    const d = t * this.curves.length;
    const i = Math.floor(d);
    const weight = d - i;

    const curveIndex = clamp(i, 0, this.curves.length - 1);
    return this.curves[curveIndex].getPoint(weight, target);
  }

  getCurveLengths() {
    const lengths = [];
    let sums = 0;

    for (let i = 0; i < this.curves.length; i++) {
      const l = this.curves[i].getPoints ? this.curves[i].getPoints(10).reduce((acc, p, idx, arr) => idx > 0 ? acc + p.distanceTo(arr[idx - 1]) : acc, 0) : 1;
      sums += l;
      lengths.push(sums);
    }

    return lengths;
  }
}

export { CurvePath };
