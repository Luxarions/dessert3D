/**
 * LXRN Capsule
 * @module Capsule
 */

import { Vec3 } from './Vec3.js';
import { Sphere } from './Sphere.js';
import { Line3 } from './Line3.js';
import { Bound3 } from './Bound3.js';

class Capsule {
  constructor(start = new Vec3(0, 0, 0), end = new Vec3(0, 1, 0), radius = 1) {
    this.isCapsule = true;
    this.start = start;
    this.end = end;
    this.radius = radius;
  }

  set(start, end, radius) {
    this.start.copy(start);
    this.end.copy(end);
    this.radius = radius;
    return this;
  }

  clone() {
    return new Capsule(this.start.clone(), this.end.clone(), this.radius);
  }

  copy(capsule) {
    this.start.copy(capsule.start);
    this.end.copy(capsule.end);
    this.radius = capsule.radius;
    return this;
  }

  getCenter(target = new Vec3()) {
    return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  }

  translate(v) {
    this.start.add(v);
    this.end.add(v);
    return this;
  }

  checkAABBSquared(box) {
    const _line = new Line3(this.start, this.end);
    const _v1 = new Vec3();
    const clampedPoint = box.clampPoint(this.start, _v1);
    return _line.closestPointToPoint(clampedPoint, true, _v1).distanceToSquared(clampedPoint) <= (this.radius * this.radius);
  }

  containsPoint(point) {
    const _line = new Line3(this.start, this.end);
    const _v1 = new Vec3();
    return _line.closestPointToPoint(point, true, _v1).distanceToSquared(point) <= (this.radius * this.radius);
  }

  intersectsBox(box) {
    return this.checkAABBSquared(box);
  }

  getBoundingBox(target = new Bound3()) {
    target.set(this.start, this.start);
    target.expandByPoint(this.end);
    target.expandByScalar(this.radius);
    return target;
  }

  applyMat4(matrix) {
    this.start.applyMat4(matrix);
    this.end.applyMat4(matrix);
    this.radius *= matrix.getMaxScaleOnAxis();
    return this;
  }

  equals(capsule) {
    return capsule.start.equals(this.start) && capsule.end.equals(this.end) && (capsule.radius === this.radius);
  }
}

export { Capsule };
