/**
 * LXRN Triangle2 (2D Triangle)
 * @module Triangle2
 */

import { Vec2 } from './Vec2';
import { Bound2 } from './Bound2';

export class Triangle2 {
  public a: Vec2;
  public b: Vec2;
  public c: Vec2;

  constructor(a: Vec2 = new Vec2(), b: Vec2 = new Vec2(), c: Vec2 = new Vec2()) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  set(a: Vec2, b: Vec2, c: Vec2): this {
    this.a.copy(a);
    this.b.copy(b);
    this.c.copy(c);
    return this;
  }

  clone(): Triangle2 {
    return new Triangle2(this.a.clone(), this.b.clone(), this.c.clone());
  }

  copy(triangle: Triangle2): this {
    this.a.copy(triangle.a);
    this.b.copy(triangle.b);
    this.c.copy(triangle.c);
    return this;
  }

  getArea(): number {
    return Math.abs((this.a.x * (this.b.y - this.c.y) + this.b.x * (this.c.y - this.a.y) + this.c.x * (this.a.y - this.b.y)) * 0.5);
  }

  getMidpoint(target: Vec2 = new Vec2()): Vec2 {
    return target.addVectors(this.a, this.b).add(this.c).divideScalar(3);
  }

  getBoundingBox(target: Bound2 = new Bound2()): Bound2 {
    return target.setFromPoints([this.a, this.b, this.c]);
  }

  containsPoint(point: Vec2): boolean {
    const p = point;
    const p0 = this.a, p1 = this.b, p2 = this.c;

    const A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    const sign = A < 0 ? -1 : 1;
    const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
  }
}
