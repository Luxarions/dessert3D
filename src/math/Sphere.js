/**
 * LXRN Sphere
 * @module Sphere
 */

import { Vec3 } from './Vec3.js';
import { Bound3 } from './Bound3.js';

class Sphere {
  constructor(center = new Vec3(), radius = -1) {
    this.isSphere = true;
    this.center = center;
    this.radius = radius;
  }

  set(center, radius) {
    this.center.copy(center);
    this.radius = radius;
    return this;
  }

  setFromPoints(points, optionalCenter) {
    const center = this.center;

    if (optionalCenter !== undefined) {
      center.copy(optionalCenter);
    } else {
      const _box = new Bound3();
      _box.setFromPoints(points).getCenter(center);
    }

    let maxRadiusSq = 0;

    for (let i = 0, l = points.length; i < l; i++) {
      maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
    }

    this.radius = Math.sqrt(maxRadiusSq);

    return this;
  }

  clone() {
    return new Sphere(this.center.clone(), this.radius);
  }

  copy(sphere) {
    this.center.copy(sphere.center);
    this.radius = sphere.radius;
    return this;
  }

  isEmpty() {
    return (this.radius < 0);
  }

  makeEmpty() {
    this.center.set(0, 0, 0);
    this.radius = -1;
    return this;
  }

  containsPoint(point) {
    return (point.distanceToSquared(this.center) <= (this.radius * this.radius));
  }

  distanceToPoint(point) {
    return (point.distanceTo(this.center) - this.radius);
  }

  intersectsSphere(sphere) {
    const radiusSum = this.radius + sphere.radius;
    return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
  }

  intersectsBox(box) {
    return box.intersectsSphere(this);
  }

  intersectsPlane(plane) {
    return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
  }

  clampPoint(point, target = new Vec3()) {
    const deltaLengthSq = this.center.distanceToSquared(point);

    target.copy(point);

    if (deltaLengthSq > (this.radius * this.radius)) {
      target.sub(this.center).normalize();
      target.multiplyScalar(this.radius).add(this.center);
    }

    return target;
  }

  getBoundingBox(target = new Bound3()) {
    if (this.isEmpty()) {
      target.makeEmpty();
      return target;
    }

    target.set(this.center, this.center);
    target.expandByScalar(this.radius);

    return target;
  }

  applyMat4(matrix) {
    this.center.applyMat4(matrix);
    this.radius = this.radius * matrix.getMaxScaleOnAxis();
    return this;
  }

  translate(offset) {
    this.center.add(offset);
    return this;
  }

  equals(sphere) {
    return sphere.center.equals(this.center) && (sphere.radius === this.radius);
  }
}

export { Sphere };
