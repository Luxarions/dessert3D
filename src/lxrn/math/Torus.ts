/**
 * LXRN Torus
 * @module Torus
 */

import { Vec3 } from './Vec3';

export class Torus {
  public center: Vec3;
  public majorRadius: number;
  public minorRadius: number;

  constructor(center: Vec3 = new Vec3(), majorRadius: number = 2, minorRadius: number = 0.5) {
    this.center = center;
    this.majorRadius = majorRadius;
    this.minorRadius = minorRadius;
  }

  set(center: Vec3, majorRadius: number, minorRadius: number): this {
    this.center.copy(center);
    this.majorRadius = majorRadius;
    this.minorRadius = minorRadius;
    return this;
  }

  clone(): Torus {
    return new Torus(this.center.clone(), this.majorRadius, this.minorRadius);
  }

  copy(t: Torus): this {
    this.center.copy(t.center);
    this.majorRadius = t.majorRadius;
    this.minorRadius = t.minorRadius;
    return this;
  }

  containsPoint(point: Vec3): boolean {
    const dx = point.x - this.center.x;
    const dy = point.y - this.center.y;
    const dz = point.z - this.center.z;

    const distXZ = Math.sqrt(dx * dx + dz * dz);
    const dMajor = distXZ - this.majorRadius;
    const distSqToTube = dMajor * dMajor + dy * dy;

    return distSqToTube <= (this.minorRadius * this.minorRadius);
  }

  getSDF(point: Vec3): number {
    const dx = point.x - this.center.x;
    const dy = point.y - this.center.y;
    const dz = point.z - this.center.z;

    const qx = Math.sqrt(dx * dx + dz * dz) - this.majorRadius;
    return Math.sqrt(qx * qx + dy * dy) - this.minorRadius;
  }
}
