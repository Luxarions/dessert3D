/**
 * LXRN Cylinder
 * @module Cylinder
 */

import { Vec3 } from './Vec3.js';
import { Sphere } from './Sphere.js';
import { Bound3 } from './Bound3.js';
import { Capsule } from './Capsule.js';

class Cylinder {
  constructor(center = new Vec3(), radius = 1, height = 2) {
    this.isCylinder = true;
    this.center = center;
    this.radius = radius;
    this.height = height;
  }

  set(center, radius, height) {
    this.center.copy(center);
    this.radius = radius;
    this.height = height;
    return this;
  }

  clone() {
    return new Cylinder(this.center.clone(), this.radius, this.height);
  }

  copy(cylinder) {
    this.center.copy(cylinder.center);
    this.radius = cylinder.radius;
    this.height = cylinder.height;
    return this;
  }

  containsPoint(point) {
    const halfHeight = this.height / 2;
    const dy = Math.abs(point.y - this.center.y);
    if (dy > halfHeight) return false;

    const dx = point.x - this.center.x;
    const dz = point.z - this.center.z;
    return (dx * dx + dz * dz) <= (this.radius * this.radius);
  }

  getBoundingBox(target = new Bound3()) {
    const halfHeight = this.height / 2;
    target.min.set(this.center.x - this.radius, this.center.y - halfHeight, this.center.z - this.radius);
    target.max.set(this.center.x + this.radius, this.center.y + halfHeight, this.center.z + this.radius);
    return target;
  }

  equals(cylinder) {
    return cylinder.center.equals(this.center) && cylinder.radius === this.radius && cylinder.height === this.height;
  }
}

export { Cylinder };
