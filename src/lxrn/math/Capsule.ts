/**
 * LXRN Capsule
 * @module Capsule
 */

import { Vec3 } from './Vec3';
import { Line3 } from './Line3';

export class Capsule {
  public start: Vec3;
  public end: Vec3;
  public radius: number;

  constructor(start: Vec3 = new Vec3(0, 0, 0), end: Vec3 = new Vec3(0, 1, 0), radius: number = 0.5) {
    this.start = start;
    this.end = end;
    this.radius = radius;
  }

  set(start: Vec3, end: Vec3, radius: number): this {
    this.start.copy(start);
    this.end.copy(end);
    this.radius = radius;
    return this;
  }

  clone(): Capsule {
    return new Capsule(this.start.clone(), this.end.clone(), this.radius);
  }

  copy(capsule: Capsule): this {
    this.start.copy(capsule.start);
    this.end.copy(capsule.end);
    this.radius = capsule.radius;
    return this;
  }

  getCenter(target: Vec3 = new Vec3()): Vec3 {
    return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  }

  getLine(): Line3 {
    return new Line3(this.start, this.end);
  }

  containsPoint(point: Vec3): boolean {
    const line = this.getLine();
    const closest = line.closestPointToPoint(point, true);
    return closest.distanceToSquared(point) <= (this.radius * this.radius);
  }

  intersectsBox(box: any): boolean {
    const line = this.getLine();
    const closestOnBox = box.clampPoint(this.getCenter());
    const closestOnLine = line.closestPointToPoint(closestOnBox, true);
    return box.clampPoint(closestOnLine).distanceToSquared(closestOnLine) <= (this.radius * this.radius);
  }
}
