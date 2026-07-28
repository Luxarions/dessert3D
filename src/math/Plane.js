/**
 * LXRN Plane
 * @module Plane
 */

import { Vec3 } from './Vec3.js';

class Plane {
  constructor(normal = new Vec3(1, 0, 0), constant = 0) {
    this.isPlane = true;
    this.normal = normal;
    this.constant = constant;
  }

  set(normal, constant) {
    this.normal.copy(normal);
    this.constant = constant;
    return this;
  }

  setComponents(x, y, z, w) {
    this.normal.set(x, y, z);
    this.constant = w;
    return this;
  }

  setFromNormalAndCoplanarPoint(normal, point) {
    this.normal.copy(normal);
    this.constant = -point.dot(this.normal);
    return this;
  }

  setFromCoplanarPoints(a, b, c) {
    const _v1 = new Vec3();
    const _v2 = new Vec3();

    const normal = _v1.subVectors(c, b).cross(_v2.subVectors(a, b)).normalize();
    this.setFromNormalAndCoplanarPoint(normal, a);
    return this;
  }

  clone() {
    return new Plane(this.normal.clone(), this.constant);
  }

  copy(plane) {
    this.normal.copy(plane.normal);
    this.constant = plane.constant;
    return this;
  }

  normalize() {
    const inverseNormalLength = 1.0 / this.normal.length();
    this.normal.multiplyScalar(inverseNormalLength);
    this.constant *= inverseNormalLength;
    return this;
  }

  negate() {
    this.constant *= -1;
    this.normal.negate();
    return this;
  }

  distanceToPoint(point) {
    return this.normal.dot(point) + this.constant;
  }

  distanceToSphere(sphere) {
    return this.distanceToPoint(sphere.center) - sphere.radius;
  }

  projectPoint(point, target = new Vec3()) {
    return target.copy(point).addScaledVector(this.normal, -this.distanceToPoint(point));
  }

  intersectLine(line, target = new Vec3()) {
    const direction = line.delta(new Vec3());
    const denominator = this.normal.dot(direction);

    if (denominator === 0) {
      if (this.distanceToPoint(line.start) === 0) {
        return target.copy(line.start);
      }
      return null;
    }

    const t = -(line.start.dot(this.normal) + this.constant) / denominator;

    if (t < 0 || t > 1) {
      return null;
    }

    return target.copy(line.start).addScaledVector(direction, t);
  }

  intersectsLine(line) {
    const startSign = this.distanceToPoint(line.start);
    const endSign = this.distanceToPoint(line.end);
    return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
  }

  intersectsBox(box) {
    return box.intersectsPlane(this);
  }

  intersectsSphere(sphere) {
    return sphere.intersectsPlane(this);
  }

  coplanarPoint(target = new Vec3()) {
    return target.copy(this.normal).multiplyScalar(-this.constant);
  }

  applyMat4(matrix, optionalNormalMatrix) {
    const _v1 = new Vec3();
    const _m1 = optionalNormalMatrix || new Vec3(); // or Mat3

    const referencePoint = this.coplanarPoint(_v1).applyMat4(matrix);

    const normal = this.normal.clone();
    if (optionalNormalMatrix) {
      normal.applyMat3(optionalNormalMatrix).normalize();
    } else {
      normal.transformDirection(matrix);
    }

    this.normal.copy(normal);
    this.constant = -referencePoint.dot(this.normal);

    return this;
  }

  translate(offset) {
    this.constant -= offset.dot(this.normal);
    return this;
  }

  equals(plane) {
    return plane.normal.equals(this.normal) && (plane.constant === this.constant);
  }
}

export { Plane };
