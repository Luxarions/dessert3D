/**
 * LXRN Cone
 * @module Cone
 */

import { Vec3 } from './Vec3.js';
import { Sphere } from './Sphere.js';
import { Bound3 } from './Bound3.js';

class Cone {
  constructor(apex = new Vec3(0, 1, 0), direction = new Vec3(0, -1, 0), angle = Math.PI / 4, height = 2) {
    this.isCone = true;
    this.apex = apex;
    this.direction = direction;
    this.angle = angle;
    this.height = height;
  }

  set(apex, direction, angle, height) {
    this.apex.copy(apex);
    this.direction.copy(direction);
    this.angle = angle;
    this.height = height;
    return this;
  }

  clone() {
    return new Cone(this.apex.clone(), this.direction.clone(), this.angle, this.height);
  }

  copy(cone) {
    this.apex.copy(cone.apex);
    this.direction.copy(cone.direction);
    this.angle = cone.angle;
    this.height = cone.height;
    return this;
  }

  containsPoint(point) {
    const v = new Vec3().subVectors(point, this.apex);
    const proj = v.dot(this.direction);
    if (proj < 0 || proj > this.height) return false;

    const coneRadius = proj * Math.tan(this.angle);
    const distSq = v.lengthSq() - proj * proj;
    return distSq <= coneRadius * coneRadius;
  }

  getBoundingBox(target = new Bound3()) {
    const baseCenter = new Vec3().copy(this.apex).addScaledVector(this.direction, this.height);
    const radius = this.height * Math.tan(this.angle);

    target.set(this.apex, this.apex);
    target.expandByPoint(new Vec3(baseCenter.x - radius, baseCenter.y, baseCenter.z - radius));
    target.expandByPoint(new Vec3(baseCenter.x + radius, baseCenter.y, baseCenter.z + radius));
    return target;
  }

  equals(cone) {
    return cone.apex.equals(this.apex) && cone.direction.equals(this.direction) && cone.angle === this.angle && cone.height === this.height;
  }
}

export { Cone };
