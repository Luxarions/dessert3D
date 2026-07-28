/**
 * LXRN Triangle (3D)
 * @module Triangle
 */

import { Vec3 } from './Vec3';
import { Bound3 } from './Bound3';
import { Plane } from './Plane';

export class Triangle {
  public a: Vec3;
  public b: Vec3;
  public c: Vec3;

  constructor(a: Vec3 = new Vec3(), b: Vec3 = new Vec3(), c: Vec3 = new Vec3()) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  set(a: Vec3, b: Vec3, c: Vec3): this {
    this.a.copy(a);
    this.b.copy(b);
    this.c.copy(c);
    return this;
  }

  clone(): Triangle {
    return new Triangle(this.a.clone(), this.b.clone(), this.c.clone());
  }

  copy(triangle: Triangle): this {
    this.a.copy(triangle.a);
    this.b.copy(triangle.b);
    this.c.copy(triangle.c);
    return this;
  }

  getArea(): number {
    const v0 = new Vec3().subVectors(this.c, this.b);
    const v1 = new Vec3().subVectors(this.a, this.b);
    return v0.cross(v1).length() * 0.5;
  }

  getMidpoint(target: Vec3 = new Vec3()): Vec3 {
    return target.addVectors(this.a, this.b).add(this.c).divideScalar(3);
  }

  getNormal(target: Vec3 = new Vec3()): Vec3 {
    const v0 = new Vec3().subVectors(this.c, this.b);
    const v1 = new Vec3().subVectors(this.a, this.b);
    return target.crossVectors(v0, v1).normalize();
  }

  getPlane(target: Plane = new Plane()): Plane {
    return target.setFromCoplanarPoints(this.a, this.b, this.c);
  }

  getBoundingBox(target: Bound3 = new Bound3()): Bound3 {
    return target.setFromPoints([this.a, this.b, this.c]);
  }

  containsPoint(point: Vec3): boolean {
    const bary = this.getBarycoord(point);
    return (bary.x >= 0) && (bary.y >= 0) && (bary.x + bary.y <= 1);
  }

  getBarycoord(point: Vec3, target: Vec3 = new Vec3()): Vec3 {
    const v0 = new Vec3().subVectors(this.c, this.a);
    const v1 = new Vec3().subVectors(this.b, this.a);
    const v2 = new Vec3().subVectors(point, this.a);

    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);

    const denom = (dot00 * dot11 - dot01 * dot01);

    if (denom === 0) {
      return target.set(-2, -1, -1);
    }

    const invDenom = 1 / denom;
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return target.set(1 - u - v, v, u);
  }
}
