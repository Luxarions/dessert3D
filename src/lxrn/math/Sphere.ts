/**
 * LXRN Sphere
 * @module Sphere
 */

import { Vec3 } from './Vec3';
import { Bound3 } from './Bound3';
import { Mat4 } from './Mat4';

export class Sphere {
  public center: Vec3;
  public radius: number;

  constructor(center: Vec3 = new Vec3(), radius: number = 1) {
    this.center = center;
    this.radius = radius;
  }

  set(center: Vec3, radius: number): this {
    this.center.copy(center);
    this.radius = radius;
    return this;
  }

  setFromPoints(points: Vec3[], optionalCenter?: Vec3): this {
    const center = this.center;
    if (optionalCenter !== undefined) {
      center.copy(optionalCenter);
    } else {
      const box = new Bound3().setFromPoints(points);
      box.getCenter(center);
    }

    let maxRadiusSq = 0;
    for (let i = 0, l = points.length; i < l; i++) {
      maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
    }

    this.radius = Math.sqrt(maxRadiusSq);
    return this;
  }

  clone(): Sphere {
    return new Sphere(this.center.clone(), this.radius);
  }

  copy(sphere: Sphere): this {
    this.center.copy(sphere.center);
    this.radius = sphere.radius;
    return this;
  }

  isEmpty(): boolean {
    return this.radius <= 0;
  }

  makeEmpty(): this {
    this.center.set(0, 0, 0);
    this.radius = -1;
    return this;
  }

  containsPoint(point: Vec3): boolean {
    return point.distanceToSquared(this.center) <= (this.radius * this.radius);
  }

  distanceToPoint(point: Vec3): number {
    return point.distanceTo(this.center) - this.radius;
  }

  intersectsSphere(sphere: Sphere): boolean {
    const radiusSum = this.radius + sphere.radius;
    return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
  }

  intersectsPlane(plane: { distanceToPoint: (p: Vec3) => number }): boolean {
    return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
  }

  applyMatrix4(m: Mat4): this {
    return this.applyMat4(m);
  }

  intersectsBox(box: Bound3): boolean {
    return box.intersectsSphere(this);
  }

  clampPoint(point: Vec3, target: Vec3 = new Vec3()): Vec3 {
    const deltaLengthSq = this.center.distanceToSquared(point);
    target.copy(point);

    if (deltaLengthSq > (this.radius * this.radius)) {
      target.sub(this.center).normalize();
      target.multiplyScalar(this.radius).add(this.center);
    }

    return target;
  }

  getBoundingBox(target: Bound3 = new Bound3()): Bound3 {
    if (this.isEmpty()) {
      return target.makeEmpty();
    }
    target.set(this.center, this.center);
    target.expandByScalar(this.radius);
    return target;
  }

  applyMat4(m: Mat4): this {
    this.center.applyMat4(m);
    this.radius = this.radius * m.getMaxScaleOnAxis();
    return this;
  }

  translate(offset: Vec3): this {
    this.center.add(offset);
    return this;
  }

  equals(sphere: Sphere): boolean {
    return sphere.center.equals(this.center) && (sphere.radius === this.radius);
  }
}
