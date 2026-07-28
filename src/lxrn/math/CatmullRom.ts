/**
 * LXRN CatmullRom Curve
 * @module CatmullRom
 */

import { Vec3 } from './Vec3';

export class CatmullRomCurve3 {
  public points: Vec3[];
  public closed: boolean;
  public curveType: 'centripetal' | 'chordal' | 'catmullrom';
  public tension: number;

  constructor(points: Vec3[] = [], closed: boolean = false, curveType: 'centripetal' | 'chordal' | 'catmullrom' = 'centripetal', tension: number = 0.5) {
    this.points = points;
    this.closed = closed;
    this.curveType = curveType;
    this.tension = tension;
  }

  getPoint(t: number, target: Vec3 = new Vec3()): Vec3 {
    const points = this.points;
    const l = points.length;

    if (l < 2) return target.set(0, 0, 0);

    const p = (l - (this.closed ? 0 : 1)) * t;
    let intPoint = Math.floor(p);
    let weight = p - intPoint;

    if (this.closed) {
      intPoint += intPoint < 0 ? Math.floor(Math.abs(intPoint) / l) * l : 0;
    } else if (weight === 0 && intPoint === l - 1) {
      intPoint = l - 2;
      weight = 1;
    }

    let p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3;

    if (this.closed || intPoint > 0) {
      p0 = points[(intPoint - 1 + l) % l];
    } else {
      p0 = points[0].clone().sub(points[1]).add(points[0]);
    }

    p1 = points[intPoint % l];
    p2 = points[(intPoint + 1) % l];

    if (this.closed || intPoint + 2 < l) {
      p3 = points[(intPoint + 2) % l];
    } else {
      p3 = points[l - 1].clone().sub(points[l - 2]).add(points[l - 1]);
    }

    // Standard Catmull-Rom formulation
    const t2 = weight * weight;
    const t3 = t2 * weight;

    const v0 = (p2.x - p0.x) * 0.5;
    const v1 = (p3.x - p1.x) * 0.5;
    target.x = (2 * p1.x - 2 * p2.x + v0 + v1) * t3 + (-3 * p1.x + 3 * p2.x - 2 * v0 - v1) * t2 + v0 * weight + p1.x;

    const vy0 = (p2.y - p0.y) * 0.5;
    const vy1 = (p3.y - p1.y) * 0.5;
    target.y = (2 * p1.y - 2 * p2.y + vy0 + vy1) * t3 + (-3 * p1.y + 3 * p2.y - 2 * vy0 - vy1) * t2 + vy0 * weight + p1.y;

    const vz0 = (p2.z - p0.z) * 0.5;
    const vz1 = (p3.z - p1.z) * 0.5;
    target.z = (2 * p1.z - 2 * p2.z + vz0 + vz1) * t3 + (-3 * p1.z + 3 * p2.z - 2 * vz0 - vz1) * t2 + vz0 * weight + p1.z;

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
