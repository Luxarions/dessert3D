/**
 * LXRN Bound3
 * @module Bound3
 */

import { Vec3 } from './Vec3.js';

class Bound3 {
  constructor(min = new Vec3(Infinity, Infinity, Infinity), max = new Vec3(-Infinity, -Infinity, -Infinity)) {
    this.isBound3 = true;
    this.min = min;
    this.max = max;
  }

  set(min, max) {
    this.min.copy(min);
    this.max.copy(max);
    return this;
  }

  setFromPoints(points) {
    this.makeEmpty();
    for (let i = 0, l = points.length; i < l; i++) {
      this.expandByPoint(points[i]);
    }
    return this;
  }

  setFromCenterAndSize(center, size) {
    const halfSize = size.clone().multiplyScalar(0.5);
    this.min.copy(center).sub(halfSize);
    this.max.copy(center).add(halfSize);
    return this;
  }

  clone() {
    return new Bound3(this.min.clone(), this.max.clone());
  }

  copy(box) {
    this.min.copy(box.min);
    this.max.copy(box.max);
    return this;
  }

  makeEmpty() {
    this.min.x = this.min.y = this.min.z = Infinity;
    this.max.x = this.max.y = this.max.z = -Infinity;
    return this;
  }

  isEmpty() {
    return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
  }

  getCenter(target = new Vec3()) {
    return this.isEmpty() ? target.set(0, 0, 0) : target.addVectors(this.min, this.max).multiplyScalar(0.5);
  }

  getSize(target = new Vec3()) {
    return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min);
  }

  expandByPoint(point) {
    this.min.min(point);
    this.max.max(point);
    return this;
  }

  expandByVector(vector) {
    this.min.sub(vector);
    this.max.add(vector);
    return this;
  }

  expandByScalar(scalar) {
    this.min.addScalar(-scalar);
    this.max.addScalar(scalar);
    return this;
  }

  containsPoint(point) {
    return point.x >= this.min.x && point.x <= this.max.x &&
           point.y >= this.min.y && point.y <= this.max.y &&
           point.z >= this.min.z && point.z <= this.max.z;
  }

  containsBox(box) {
    return this.min.x <= box.min.x && box.max.x <= this.max.x &&
           this.min.y <= box.min.y && box.max.y <= this.max.y &&
           this.min.z <= box.min.z && box.max.z <= this.max.z;
  }

  intersectsBox(box) {
    return !(box.max.x < this.min.x || box.min.x > this.max.x ||
             box.max.y < this.min.y || box.min.y > this.max.y ||
             box.max.z < this.min.z || box.min.z > this.max.z);
  }

  clampPoint(point, target = new Vec3()) {
    return target.copy(point).clamp(this.min, this.max);
  }

  distanceToPoint(point) {
    const clampedPoint = this.clampPoint(point, new Vec3());
    return clampedPoint.distanceTo(point);
  }

  getBoundingSphere(target) {
    this.getCenter(target.center);
    target.radius = this.getSize(new Vec3()).length() * 0.5;
    return target;
  }

  intersect(box) {
    this.min.max(box.min);
    this.max.min(box.max);
    if (this.isEmpty()) this.makeEmpty();
    return this;
  }

  union(box) {
    this.min.min(box.min);
    this.max.max(box.max);
    return this;
  }

  applyMat4(matrix) {
    if (this.isEmpty()) return this;

    const points = [
      new Vec3(this.min.x, this.min.y, this.min.z).applyMat4(matrix),
      new Vec3(this.min.x, this.min.y, this.max.z).applyMat4(matrix),
      new Vec3(this.min.x, this.max.y, this.min.z).applyMat4(matrix),
      new Vec3(this.min.x, this.max.y, this.max.z).applyMat4(matrix),
      new Vec3(this.max.x, this.min.y, this.min.z).applyMat4(matrix),
      new Vec3(this.max.x, this.min.y, this.max.z).applyMat4(matrix),
      new Vec3(this.max.x, this.max.y, this.min.z).applyMat4(matrix),
      new Vec3(this.max.x, this.max.y, this.max.z).applyMat4(matrix)
    ];

    return this.setFromPoints(points);
  }

  equals(box) {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}

export { Bound3 };
