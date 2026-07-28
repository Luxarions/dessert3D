/**
 * LXRN NURBS Curve (Non-Uniform Rational B-Spline)
 * @module NURBS
 */

import { Vec3 } from './Vec3';
import { Vec4 } from './Vec4';

export class NURBSCurve3 {
  public controlPoints: Vec4[]; // Homogeneous coords (x,y,z,w)
  public degree: number;
  public knots: number[];

  constructor(controlPoints: Vec4[] = [], degree: number = 3, knots?: number[]) {
    this.controlPoints = controlPoints;
    this.degree = degree;
    this.knots = knots || this.generateUniformKnots();
  }

  generateUniformKnots(): number[] {
    const n = this.controlPoints.length - 1;
    const p = this.degree;
    const knots: number[] = [];
    for (let i = 0; i <= p; i++) knots.push(0);
    for (let i = 1; i <= n - p; i++) knots.push(i / (n - p + 1));
    for (let i = 0; i <= p; i++) knots.push(1);
    return knots;
  }

  basisFunction(i: number, p: number, u: number): number {
    const knots = this.knots;
    if (p === 0) {
      return (u >= knots[i] && u < knots[i + 1]) || (u === 1 && knots[i + 1] === 1) ? 1 : 0;
    }
    let denom1 = knots[i + p] - knots[i];
    let denom2 = knots[i + p + 1] - knots[i + 1];

    let term1 = denom1 > 0 ? ((u - knots[i]) / denom1) * this.basisFunction(i, p - 1, u) : 0;
    let term2 = denom2 > 0 ? ((knots[i + p + 1] - u) / denom2) * this.basisFunction(i + 1, p - 1, u) : 0;

    return term1 + term2;
  }

  getPoint(u: number, target: Vec3 = new Vec3()): Vec3 {
    let sumX = 0, sumY = 0, sumZ = 0, sumW = 0;
    const n = this.controlPoints.length - 1;

    for (let i = 0; i <= n; i++) {
      const N = this.basisFunction(i, this.degree, u);
      const cp = this.controlPoints[i];
      const w = cp.w;

      sumX += N * cp.x * w;
      sumY += N * cp.y * w;
      sumZ += N * cp.z * w;
      sumW += N * w;
    }

    if (sumW === 0) return target.set(0, 0, 0);

    return target.set(sumX / sumW, sumY / sumW, sumZ / sumW);
  }

  getPoints(divisions: number = 50): Vec3[] {
    const pts: Vec3[] = [];
    for (let i = 0; i <= divisions; i++) {
      pts.push(this.getPoint(i / divisions));
    }
    return pts;
  }
}
