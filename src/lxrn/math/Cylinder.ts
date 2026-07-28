/**
 * LXRN Cylinder
 * @module Cylinder
 */

import { Vec3 } from './Vec3';

export class Cylinder {
  public center: Vec3;
  public radius: number;
  public height: number;

  constructor(center: Vec3 = new Vec3(), radius: number = 1, height: number = 2) {
    this.center = center;
    this.radius = radius;
    this.height = height;
  }

  set(center: Vec3, radius: number, height: number): this {
    this.center.copy(center);
    this.radius = radius;
    this.height = height;
    return this;
  }

  clone(): Cylinder {
    return new Cylinder(this.center.clone(), this.radius, this.height);
  }

  copy(c: Cylinder): this {
    this.center.copy(c.center);
    this.radius = c.radius;
    this.height = c.height;
    return this;
  }

  containsPoint(point: Vec3): boolean {
    const halfH = this.height * 0.5;
    if (Math.abs(point.y - this.center.y) > halfH) return false;
    const dx = point.x - this.center.x;
    const dz = point.z - this.center.z;
    return (dx * dx + dz * dz) <= (this.radius * this.radius);
  }
}
