/**
 * LXRN CatmullRom
 * @module CatmullRom
 */

import { Vec3 } from './Vec3.js';
import { clamp } from './MathUtils.js';
import { Hermite } from './Hermite.js';

class CatmullRom {
  constructor(points = [], closed = false, curveType = 'centripetal', tension = 0.5) {
    this.isCatmullRom = true;
    this.points = points;
    this.closed = closed;
    this.curveType = curveType;
    this.tension = tension;
  }

  getPoint(t, target = new Vec3()) {
    const l = this.points.length;
    if (l === 0) return target.set(0, 0, 0);
    if (l === 1) return target.copy(this.points[0]);

    const p = (l - (this.closed ? 0 : 1)) * t;
    let intPoint = Math.floor(p);
    let weight = p - intPoint;

    if (this.closed) {
      intPoint += intPoint < 0 ? Math.floor(Math.abs(intPoint) / l) * l : 0;
    } else if (weight === 0 && intPoint === l - 1) {
      intPoint = l - 2;
      weight = 1;
    }

    let p0, p1, p2, p3;

    if (this.closed || intPoint > 0) {
      p0 = this.points[(intPoint - 1 + l) % l];
    } else {
      p0 = new Vec3().subVectors(this.points[0], this.points[1]).add(this.points[0]);
    }

    p1 = this.points[intPoint % l];
    p2 = this.points[(intPoint + 1) % l];

    if (this.closed || intPoint + 2 < l) {
      p3 = this.points[(intPoint + 2) % l];
    } else {
      p3 = new Vec3().subVectors(this.points[l - 1], this.points[l - 2]).add(this.points[l - 1]);
    }

    if (this.curveType === 'centripetal' || this.curveType === 'chordal') {
      let pow = this.curveType === 'centripetal' ? 0.25 : 0.5;

      let dt0 = Math.pow(p0.distanceToSquared(p1), pow);
      let dt1 = Math.pow(p1.distanceToSquared(p2), pow);
      let dt2 = Math.pow(p2.distanceToSquared(p3), pow);

      if (dt1 < 0.0001) dt1 = 1.0;
      if (dt0 < 0.0001) dt0 = dt1;
      if (dt2 < 0.0001) dt2 = dt1;

      const t1 = (p1.clone().sub(p0).divideScalar(dt0).sub(p2.clone().sub(p0).divideScalar(dt0 + dt1)).add(p2.clone().sub(p1).divideScalar(dt1))).multiplyScalar(dt1);
      const t2 = (p2.clone().sub(p1).divideScalar(dt1).sub(p3.clone().sub(p1).divideScalar(dt1 + dt2)).add(p3.clone().sub(p2).divideScalar(dt2))).multiplyScalar(dt1);

      const hermite = new Hermite(p1, p2, t1, t2);
      return hermite.getPoint(weight, target);
    } else {
      const w2 = weight * weight;
      const w3 = weight * w2;

      target.x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * weight + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * w2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * w3);
      target.y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * weight + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * w2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * w3);
      target.z = 0.5 * ((2 * p1.z) + (-p0.z + p2.z) * weight + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * w2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * w3);

      return target;
    }
  }
}

export { CatmullRom };
