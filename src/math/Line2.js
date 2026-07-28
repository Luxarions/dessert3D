/**
 * LXRN Line2
 * @module Line2
 */

import { Vec2 } from './Vec2.js';

class Line2 {
  constructor(start = new Vec2(), end = new Vec2()) {
    this.isLine2 = true;
    this.start = start;
    this.end = end;
  }

  set(start, end) {
    this.start.copy(start);
    this.end.copy(end);
    return this;
  }

  clone() {
    return new Line2(this.start.clone(), this.end.clone());
  }

  copy(line) {
    this.start.copy(line.start);
    this.end.copy(line.end);
    return this;
  }

  getCenter(target = new Vec2()) {
    return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  }

  delta(target = new Vec2()) {
    return target.subVectors(this.end, this.start);
  }

  distanceSq() {
    return this.start.distanceToSquared(this.end);
  }

  distance() {
    return this.start.distanceTo(this.end);
  }

  at(t, target = new Vec2()) {
    return this.delta(target).multiplyScalar(t).add(this.start);
  }

  closestPointToPointParameter(point, clampToLine = false) {
    const _startP = new Vec2().subVectors(point, this.start);
    const _startEnd = this.delta(new Vec2());

    const startEnd2 = _startEnd.dot(_startEnd);
    const startP_startEnd = _startP.dot(_startEnd);

    let t = startP_startEnd / startEnd2;

    if (clampToLine) {
      t = Math.max(0, Math.min(1, t));
    }

    return t;
  }

  closestPointToPoint(point, clampToLine = false, target = new Vec2()) {
    const t = this.closestPointToPointParameter(point, clampToLine);
    return this.at(t, target);
  }

  equals(line) {
    return line.start.equals(this.start) && line.end.equals(this.end);
  }
}

export { Line2 };
