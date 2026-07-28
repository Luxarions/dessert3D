/**
 * LXRN BSpline
 * @module BSpline
 */

import { Vec3 } from './Vec3.js';
import { clamp } from './MathUtils.js';

class BSpline {
  constructor(controlPoints = [], degree = 3, knots = null) {
    this.isBSpline = true;
    this.controlPoints = controlPoints;
    this.degree = degree;
    this.knots = knots || this.generateUniformKnots();
  }

  generateUniformKnots() {
    const n = this.controlPoints.length;
    const p = this.degree;
    const knots = [];
    const totalKnots = n + p + 1;

    for (let i = 0; i < totalKnots; i++) {
      if (i < p + 1) {
        knots.push(0);
      } else if (i >= totalKnots - (p + 1)) {
        knots.push(1);
      } else {
        knots.push((i - p) / (n - p));
      }
    }
    return knots;
  }

  basisFunction(i, p, u) {
    const knots = this.knots;
    if (p === 0) {
      return (u >= knots[i] && u < knots[i + 1]) || (u === 1 && u <= knots[i + 1] && knots[i + 1] === 1) ? 1 : 0;
    }

    let left = 0;
    const denom1 = knots[i + p] - knots[i];
    if (denom1 !== 0) {
      left = ((u - knots[i]) / denom1) * this.basisFunction(i, p - 1, u);
    }

    let right = 0;
    const denom2 = knots[i + p + 1] - knots[i + 1];
    if (denom2 !== 0) {
      right = ((knots[i + p + 1] - u) / denom2) * this.basisFunction(i + 1, p - 1, u);
    }

    return left + right;
  }

  getPoint(u, target = new Vec3()) {
    target.set(0, 0, 0);
    const n = this.controlPoints.length;
    const p = this.degree;

    for (let i = 0; i < n; i++) {
      const N = this.basisFunction(i, p, u);
      if (N !== 0) {
        target.addScaledVector(this.controlPoints[i], N);
      }
    }

    return target;
  }
}

export { BSpline };
