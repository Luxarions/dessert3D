/**
 * LXRN Line2 (2D Line Segment)
 * @module Line2
 */

import { Vec2 } from './Vec2';

export class Line2 {
  public start: Vec2;
  public end: Vec2;

  constructor(start: Vec2 = new Vec2(), end: Vec2 = new Vec2()) {
    this.start = start;
    this.end = end;
  }

  set(start: Vec2, end: Vec2): this {
    this.start.copy(start);
    this.end.copy(end);
    return this;
  }

  clone(): Line2 {
    return new Line2(this.start.clone(), this.end.clone());
  }

  copy(line: Line2): this {
    this.start.copy(line.start);
    this.end.copy(line.end);
    return this;
  }

  getCenter(target: Vec2 = new Vec2()): Vec2 {
    return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  }

  delta(target: Vec2 = new Vec2()): Vec2 {
    return target.subVectors(this.end, this.start);
  }

  distanceSq(): number {
    return this.start.distanceToSquared(this.end);
  }

  distance(): number {
    return this.start.distanceTo(this.end);
  }

  at(t: number, target: Vec2 = new Vec2()): Vec2 {
    return this.delta(target).multiplyScalar(t).add(this.start);
  }

  closestPointToPointParameter(point: Vec2, clampToLine: boolean = true): number {
    const startP = new Vec2().subVectors(point, this.start);
    const startEnd = new Vec2().subVectors(this.end, this.start);

    const startEndSq = startEnd.lengthSq();

    if (startEndSq === 0) return 0;

    let t = startP.dot(startEnd) / startEndSq;

    if (clampToLine) {
      t = Math.max(0, Math.min(1, t));
    }

    return t;
  }

  closestPointToPoint(point: Vec2, clampToLine: boolean = true, target: Vec2 = new Vec2()): Vec2 {
    const t = this.closestPointToPointParameter(point, clampToLine);
    return this.delta(target).multiplyScalar(t).add(this.start);
  }
}
