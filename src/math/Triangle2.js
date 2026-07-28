/**
 * LXRN Triangle2
 * @module Triangle2
 */

import { Vec2 } from './Vec2.js';
import { Line2 } from './Line2.js';
import { clamp } from './MathUtils.js';

class Triangle2 {
  constructor(a = new Vec2(), b = new Vec2(), c = new Vec2()) {
    this.isTriangle2 = true;
    this.a = a;
    this.b = b;
    this.c = c;
  }

  set(a, b, c) {
    this.a.copy(a);
    this.b.copy(b);
    this.c.copy(c);
    return this;
  }

  clone() {
    return new Triangle2(this.a.clone(), this.b.clone(), this.c.clone());
  }

  copy(triangle) {
    this.a.copy(triangle.a);
    this.b.copy(triangle.b);
    this.c.copy(triangle.c);
    return this;
  }

  getArea() {
    return Math.abs((this.a.x * (this.b.y - this.c.y) + this.b.x * (this.c.y - this.a.y) + this.c.x * (this.a.y - this.b.y)) * 0.5);
  }

  getMidpoint(target = new Vec2()) {
    return target.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }

  containsPoint(point) {
    const p = point;
    const p0 = this.a;
    const p1 = this.b;
    const p2 = this.c;

    const A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    const sign = A < 0 ? -1 : 1;
    const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
  }

  closestPointToPoint(p, target = new Vec2()) {
    if (this.containsPoint(p)) return target.copy(p);

    const l0 = new Line2(this.a, this.b);
    const l1 = new Line2(this.b, this.c);
    const l2 = new Line2(this.c, this.a);

    const cp0 = l0.closestPointToPoint(p, new Vec2());
    const cp1 = l1.closestPointToPoint(p, new Vec2());
    const cp2 = l2.closestPointToPoint(p, new Vec2());

    const d0 = p.distanceToSquared(cp0);
    const d1 = p.distanceToSquared(cp1);
    const d2 = p.distanceToSquared(cp2);

    if (d0 <= d1 && d0 <= d2) return target.copy(cp0);
    if (d1 <= d0 && d1 <= d2) return target.copy(cp1);
    return target.copy(cp2);
  }

  equals(triangle) {
    return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
  }
}

export { Triangle2 };
