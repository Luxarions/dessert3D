/**
 * LXRN Cone
 * @module Cone
 */

import { Vec3 } from './Vec3';

export class Cone {
  public apex: Vec3;
  public axis: Vec3; // Normalized direction from apex down to base center
  public radius: number;
  public height: number;

  constructor(apex: Vec3 = new Vec3(0, 1, 0), axis: Vec3 = new Vec3(0, -1, 0), radius: number = 1, height: number = 2) {
    this.apex = apex;
    this.axis = axis.normalize();
    this.radius = radius;
    this.height = height;
  }

  set(apex: Vec3, axis: Vec3, radius: number, height: number): this {
    this.apex.copy(apex);
    this.axis.copy(axis).normalize();
    this.radius = radius;
    this.height = height;
    return this;
  }

  clone(): Cone {
    return new Cone(this.apex.clone(), this.axis.clone(), this.radius, this.height);
  }

  copy(c: Cone): this {
    this.apex.copy(c.apex);
    this.axis.copy(c.axis);
    this.radius = c.radius;
    this.height = c.height;
    return this;
  }

  containsPoint(point: Vec3): boolean {
    const d = point.clone().sub(this.apex);
    const h = d.dot(this.axis);

    if (h < 0 || h > this.height) return false;

    const maxRadiusAtH = (h / this.height) * this.radius;
    const radialDistSq = d.lengthSq() - h * h;

    return radialDistSq <= (maxRadiusAtH * maxRadiusAtH);
  }
}
