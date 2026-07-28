/**
 * LXRN Bezier Curve (2D & 3D Bezier Evaluator)
 * @module Bezier
 */

import { Vec3 } from './Vec3';
import { Vec2 } from './Vec2';

export class Bezier3D {
  public controlPoints: Vec3[];

  constructor(controlPoints: Vec3[] = []) {
    this.controlPoints = controlPoints;
  }

  getPoint(t: number, target: Vec3 = new Vec3()): Vec3 {
    const pts = this.controlPoints;
    const n = pts.length - 1;
    if (n < 0) return target.set(0, 0, 0);
    if (n === 0) return target.copy(pts[0]);

    // De Casteljau's algorithm
    const temp = pts.map(p => p.clone());
    for (let r = 1; r <= n; r++) {
      for (let i = 0; i <= n - r; i++) {
        temp[i].lerp(temp[i + 1], t);
      }
    }
    return target.copy(temp[0]);
  }

  getTangent(t: number, target: Vec3 = new Vec3()): Vec3 {
    const delta = 0.0001;
    const p1 = this.getPoint(Math.max(0, t - delta));
    const p2 = this.getPoint(Math.min(1, t + delta));
    return target.subVectors(p2, p1).normalize();
  }

  getPoints(divisions: number = 50): Vec3[] {
    const points: Vec3[] = [];
    for (let i = 0; i <= divisions; i++) {
      points.push(this.getPoint(i / divisions));
    }
    return points;
  }
}

export class Bezier2D {
  public controlPoints: Vec2[];

  constructor(controlPoints: Vec2[] = []) {
    this.controlPoints = controlPoints;
  }

  getPoint(t: number, target: Vec2 = new Vec2()): Vec2 {
    const pts = this.controlPoints;
    const n = pts.length - 1;
    if (n < 0) return target.set(0, 0);
    if (n === 0) return target.copy(pts[0]);

    const temp = pts.map(p => p.clone());
    for (let r = 1; r <= n; r++) {
      for (let i = 0; i <= n - r; i++) {
        temp[i].lerp(temp[i + 1], t);
      }
    }
    return target.copy(temp[0]);
  }

  getPoints(divisions: number = 50): Vec2[] {
    const points: Vec2[] = [];
    for (let i = 0; i <= divisions; i++) {
      points.push(this.getPoint(i / divisions));
    }
    return points;
  }
}
