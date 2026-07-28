/**
 * LXRN Torus
 * @module Torus
 */

import { Vec3 } from './Vec3.js';
import { Sphere } from './Sphere.js';
import { Bound3 } from './Bound3.js';

class Torus {
  constructor(center = new Vec3(), majorRadius = 2, minorRadius = 0.5) {
    this.isTorus = true;
    this.center = center;
    this.majorRadius = majorRadius;
    this.minorRadius = minorRadius;
  }

  set(center, majorRadius, minorRadius) {
    this.center.copy(center);
    this.majorRadius = majorRadius;
    this.minorRadius = minorRadius;
    return this;
  }

  clone() {
    return new Torus(this.center.clone(), this.majorRadius, this.minorRadius);
  }

  copy(torus) {
    this.center.copy(torus.center);
    this.majorRadius = torus.majorRadius;
    this.minorRadius = torus.minorRadius;
    return this;
  }

  containsPoint(point) {
    const dx = point.x - this.center.x;
    const dy = point.y - this.center.y;
    const dz = point.z - this.center.z;

    const dXZ = Math.sqrt(dx * dx + dz * dz);
    const dMajor = dXZ - this.majorRadius;

    return (dMajor * dMajor + dy * dy) <= (this.minorRadius * this.minorRadius);
  }

  getBoundingBox(target = new Bound3()) {
    const totalRadius = this.majorRadius + this.minorRadius;
    target.min.set(this.center.x - totalRadius, this.center.y - this.minorRadius, this.center.z - totalRadius);
    target.max.set(this.center.x + totalRadius, this.center.y + this.minorRadius, this.center.z + totalRadius);
    return target;
  }

  equals(torus) {
    return torus.center.equals(this.center) && torus.majorRadius === this.majorRadius && torus.minorRadius === this.minorRadius;
  }
}

export { Torus };
