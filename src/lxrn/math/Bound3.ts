/**
 * LXRN Bound3 (3D Bounding Box / AABB)
 * @module Bound3
 */

import { Vec3 } from './Vec3';
import { Mat4 } from './Mat4';

export class Bound3 {
  public min: Vec3;
  public max: Vec3;

  constructor(min: Vec3 = new Vec3(Infinity, Infinity, Infinity), max: Vec3 = new Vec3(-Infinity, -Infinity, -Infinity)) {
    this.min = min;
    this.max = max;
  }

  set(min: Vec3, max: Vec3): this {
    this.min.copy(min);
    this.max.copy(max);
    return this;
  }

  setFromPoints(points: Vec3[]): this {
    this.makeEmpty();
    for (let i = 0, l = points.length; i < l; i++) {
      this.expandByPoint(points[i]);
    }
    return this;
  }

  setFromCenterAndSize(center: Vec3, size: Vec3): this {
    const halfSize = size.clone().multiplyScalar(0.5);
    this.min.copy(center).sub(halfSize);
    this.max.copy(center).add(halfSize);
    return this;
  }

  clone(): Bound3 {
    return new Bound3(this.min.clone(), this.max.clone());
  }

  copy(box: Bound3): this {
    this.min.copy(box.min);
    this.max.copy(box.max);
    return this;
  }

  makeEmpty(): this {
    this.min.x = this.min.y = this.min.z = Infinity;
    this.max.x = this.max.y = this.max.z = -Infinity;
    return this;
  }

  isEmpty(): boolean {
    return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
  }

  getCenter(target: Vec3 = new Vec3()): Vec3 {
    return this.isEmpty() ? target.set(0, 0, 0) : target.addVectors(this.min, this.max).multiplyScalar(0.5);
  }

  getSize(target: Vec3 = new Vec3()): Vec3 {
    return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min);
  }

  expandByPoint(point: Vec3): this {
    this.min.min(point);
    this.max.max(point);
    return this;
  }

  expandByVector(vector: Vec3): this {
    this.min.sub(vector);
    this.max.add(vector);
    return this;
  }

  expandByScalar(scalar: number): this {
    this.min.addScalar(-scalar);
    this.max.addScalar(scalar);
    return this;
  }

  containsPoint(point: Vec3): boolean {
    return point.x >= this.min.x && point.x <= this.max.x &&
           point.y >= this.min.y && point.y <= this.max.y &&
           point.z >= this.min.z && point.z <= this.max.z;
  }

  containsBox(box: Bound3): boolean {
    return this.min.x <= box.min.x && box.max.x <= this.max.x &&
           this.min.y <= box.min.y && box.max.y <= this.max.y &&
           this.min.z <= box.min.z && box.max.z <= this.max.z;
  }

  intersectsBox(box: Bound3): boolean {
    return !(box.max.x < this.min.x || box.min.x > this.max.x ||
             box.max.y < this.min.y || box.min.y > this.max.y ||
             box.max.z < this.min.z || box.min.z > this.max.z);
  }

  intersectsSphere(sphere: { center: Vec3; radius: number }): boolean {
    const closestPoint = this.clampPoint(sphere.center);
    return closestPoint.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);
  }

  clampPoint(point: Vec3, target: Vec3 = new Vec3()): Vec3 {
    return target.copy(point).clamp(this.min, this.max);
  }

  distanceToPoint(point: Vec3): number {
    const clampedPoint = this.clampPoint(point);
    return clampedPoint.distanceTo(point);
  }

  applyMat4(m: Mat4): this {
    if (this.isEmpty()) return this;

    const points = [
      new Vec3(this.min.x, this.min.y, this.min.z).applyMat4(m),
      new Vec3(this.min.x, this.min.y, this.max.z).applyMat4(m),
      new Vec3(this.min.x, this.max.y, this.min.z).applyMat4(m),
      new Vec3(this.min.x, this.max.y, this.max.z).applyMat4(m),
      new Vec3(this.max.x, this.min.y, this.min.z).applyMat4(m),
      new Vec3(this.max.x, this.min.y, this.max.z).applyMat4(m),
      new Vec3(this.max.x, this.max.y, this.min.z).applyMat4(m),
      new Vec3(this.max.x, this.max.y, this.max.z).applyMat4(m),
    ];

    return this.setFromPoints(points);
  }

  intersect(box: Bound3): this {
    this.min.max(box.min);
    this.max.min(box.max);
    if (this.isEmpty()) this.makeEmpty();
    return this;
  }

  union(box: Bound3): this {
    this.min.min(box.min);
    this.max.max(box.max);
    return this;
  }

  translate(offset: Vec3): this {
    this.min.add(offset);
    this.max.add(offset);
    return this;
  }

  equals(box: Bound3): boolean {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}
