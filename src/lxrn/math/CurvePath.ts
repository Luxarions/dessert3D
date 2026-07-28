/**
 * LXRN CurvePath (Composite multi-segment curve)
 * @module CurvePath
 */

import { Vec3 } from './Vec3';

export interface CurveSegment {
  getPoint(t: number, target?: Vec3): Vec3;
}

export class CurvePath {
  public curves: CurveSegment[];

  constructor(curves: CurveSegment[] = []) {
    this.curves = curves;
  }

  add(curve: CurveSegment): this {
    this.curves.push(curve);
    return this;
  }

  getPoint(t: number, target: Vec3 = new Vec3()): Vec3 {
    if (this.curves.length === 0) return target.set(0, 0, 0);

    const totalCurves = this.curves.length;
    const scaledT = t * totalCurves;
    let index = Math.floor(scaledT);
    let subT = scaledT - index;

    if (index >= totalCurves) {
      index = totalCurves - 1;
      subT = 1;
    }

    return this.curves[index].getPoint(subT, target);
  }

  getPoints(divisionsPerCurve: number = 20): Vec3[] {
    const pts: Vec3[] = [];
    for (let i = 0; i < this.curves.length; i++) {
      for (let d = 0; d <= divisionsPerCurve; d++) {
        if (i > 0 && d === 0) continue; // avoid duplicates
        pts.push(this.curves[i].getPoint(d / divisionsPerCurve));
      }
    }
    return pts;
  }
}
