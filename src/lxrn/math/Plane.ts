/**
 * LXRN Plane
 * @module Plane
 */

import { Vec3 } from './Vec3';
import { Mat3 } from './Mat3';
import { Mat4 } from './Mat4';
import { Sphere } from './Sphere';
import { Bound3 } from './Bound3';

export class Plane {
  public normal: Vec3;
  public constant: number;

  constructor(normal: Vec3 = new Vec3(1, 0, 0), constant: number = 0) {
    this.normal = normal;
    this.constant = constant;
  }

  set(normal: Vec3, constant: number): this {
    this.normal.copy(normal);
    this.constant = constant;
    return this;
  }

  setComponents(x: number, y: number, z: number, w: number): this {
    this.normal.set(x, y, z);
    this.constant = w;
    return this;
  }

  setFromNormalAndCoplanarPoint(normal: Vec3, point: Vec3): this {
    this.normal.copy(normal);
    this.constant = -point.dot(this.normal);
    return this;
  }

  setFromCoplanarPoints(a: Vec3, b: Vec3, c: Vec3): this {
    const v1 = new Vec3().subVectors(c, b);
    const v2 = new Vec3().subVectors(a, b);
    const normal = new Vec3().crossVectors(v1, v2).normalize();
    this.setFromNormalAndCoplanarPoint(normal, a);
    return this;
  }

  clone(): Plane {
    return new Plane(this.normal.clone(), this.constant);
  }

  copy(plane: Plane): this {
    this.normal.copy(plane.normal);
    this.constant = plane.constant;
    return this;
  }

  normalize(): this {
    const inverseNormalLength = 1.0 / this.normal.length();
    this.normal.multiplyScalar(inverseNormalLength);
    this.constant *= inverseNormalLength;
    return this;
  }

  negate(): this {
    this.constant *= -1;
    this.normal.negate();
    return this;
  }

  distanceToPoint(point: Vec3): number {
    return this.normal.dot(point) + this.constant;
  }

  distanceToSphere(sphere: Sphere): number {
    return this.distanceToPoint(sphere.center) - sphere.radius;
  }

  projectPoint(point: Vec3, target: Vec3 = new Vec3()): Vec3 {
    return target.copy(point).addScaledVector(this.normal, -this.distanceToPoint(point));
  }

  intersectsSphere(sphere: Sphere): boolean {
    return sphere.intersectsPlane ? sphere.intersectsPlane(this) : Math.abs(this.distanceToPoint(sphere.center)) <= sphere.radius;
  }

  intersectsBox(box: Bound3): boolean {
    return box.intersectsPlane ? box.intersectsPlane(this) : true;
  }

  coplanarPoint(target: Vec3 = new Vec3()): Vec3 {
    return target.copy(this.normal).multiplyScalar(-this.constant);
  }

  applyMat4(m: Mat4, optionalNormalMatrix?: Mat3): this {
    const normalMatrix = optionalNormalMatrix || new Mat3().getNormalMatrix(m);
    const referencePoint = this.coplanarPoint().applyMat4(m);
    const normal = this.normal.applyNormalMatrix(normalMatrix).normalize();
    this.setFromNormalAndCoplanarPoint(normal, referencePoint);
    return this;
  }

  translate(offset: Vec3): this {
    this.constant -= offset.dot(this.normal);
    return this;
  }

  equals(plane: Plane): boolean {
    return plane.normal.equals(this.normal) && (plane.constant === this.constant);
  }
}
