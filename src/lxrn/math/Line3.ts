/**
 * LXRN Line3 (3D Line Segment)
 * @module Line3
 */

import { Vec3 } from './Vec3';
import { Mat4 } from './Mat4';
import { clamp } from './MathUtils';

export class Line3 {
  public start: Vec3;
  public end: Vec3;

  constructor(start: Vec3 = new Vec3(), end: Vec3 = new Vec3()) {
    this.start = start;
    this.end = end;
  }

  set(start: Vec3, end: Vec3): this {
    this.start.copy(start);
    this.end.copy(end);
    return this;
  }

  clone(): Line3 {
    return new Line3(this.start.clone(), this.end.clone());
  }

  copy(line: Line3): this {
    this.start.copy(line.start);
    this.end.copy(line.end);
    return this;
  }

  getCenter(target: Vec3 = new Vec3()): Vec3 {
    return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  }

  delta(target: Vec3 = new Vec3()): Vec3 {
    return target.subVectors(this.end, this.start);
  }

  distanceSq(): number {
    return this.start.distanceToSquared(this.end);
  }

  distance(): number {
    return this.start.distanceTo(this.end);
  }

  at(t: number, target: Vec3 = new Vec3()): Vec3 {
    return this.delta(target).multiplyScalar(t).add(this.start);
  }

  closestPointToPointParameter(point: Vec3, clampToLine: boolean = true): number {
    const startP = new Vec3().subVectors(point, this.start);
    const startEnd = new Vec3().subVectors(this.end, this.start);

    const startEndSq = startEnd.lengthSq();

    if (startEndSq === 0) return 0;

    let t = startP.dot(startEnd) / startEndSq;

    if (clampToLine) {
      t = clamp(t, 0, 1);
    }

    return t;
  }

  closestPointToPoint(point: Vec3, clampToLine: boolean = true, target: Vec3 = new Vec3()): Vec3 {
    const t = this.closestPointToPointParameter(point, clampToLine);
    return this.delta(target).multiplyScalar(t).add(this.start);
  }

  applyMat4(m: Mat4): this {
    this.start.applyMat4(m);
    this.end.applyMat4(m);
    return this;
  }

  equals(line: Line3): boolean {
    return line.start.equals(this.start) && line.end.equals(this.end);
  }
}
