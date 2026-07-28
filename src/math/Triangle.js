/**
 * LXRN Triangle
 * @module Triangle
 */

import { Vec3 } from './Vec3.js';
import { clamp } from './MathUtils.js';

class Triangle {
  constructor(a = new Vec3(), b = new Vec3(), c = new Vec3()) {
    this.isTriangle = true;
    this.a = a;
    this.b = b;
    this.c = c;
  }

  static getNormal(a, b, c, target = new Vec3()) {
    const _v0 = new Vec3();
    target.subVectors(c, b);
    _v0.subVectors(a, b);
    target.cross(_v0);

    const targetLengthSq = target.lengthSq();
    if (targetLengthSq > 0) {
      return target.multiplyScalar(1 / Math.sqrt(targetLengthSq));
    }

    return target.set(0, 0, 0);
  }

  static getBarycoord(point, a, b, c, target = new Vec3()) {
    const _v0 = new Vec3().subVectors(c, a);
    const _v1 = new Vec3().subVectors(b, a);
    const _v2 = new Vec3().subVectors(point, a);

    const dot00 = _v0.dot(_v0);
    const dot01 = _v0.dot(_v1);
    const dot02 = _v0.dot(_v2);
    const dot11 = _v1.dot(_v1);
    const dot12 = _v1.dot(_v2);

    const denom = (dot00 * dot11 - dot01 * dot01);

    if (denom === 0) {
      return target.set(-2, -1, -1);
    }

    const invDenom = 1 / denom;
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return target.set(1 - u - v, v, u);
  }

  static containsPoint(point, a, b, c) {
    const _v1 = new Vec3();
    Triangle.getBarycoord(point, a, b, c, _v1);
    return (_v1.x >= 0) && (_v1.y >= 0) && ((_v1.x + _v1.y) <= 1);
  }

  static getInterpolatedAttribute(point, a, b, c, attrA, attrB, attrC, target) {
    const _v1 = new Vec3();
    Triangle.getBarycoord(point, a, b, c, _v1);

    target.setScalar(0);
    target.addScaledVector(attrA, _v1.x);
    target.addScaledVector(attrB, _v1.y);
    target.addScaledVector(attrC, _v1.z);

    return target;
  }

  static isFrontFacing(a, b, c, direction) {
    const _v0 = new Vec3();
    const _v1 = new Vec3();

    _v0.subVectors(c, b);
    _v1.subVectors(a, b);

    return (_v0.cross(_v1).dot(direction) < 0);
  }

  set(a, b, c) {
    this.a.copy(a);
    this.b.copy(b);
    this.c.copy(c);
    return this;
  }

  clone() {
    return new Triangle(this.a.clone(), this.b.clone(), this.c.clone());
  }

  copy(triangle) {
    this.a.copy(triangle.a);
    this.b.copy(triangle.b);
    this.c.copy(triangle.c);
    return this;
  }

  getArea() {
    const _v0 = new Vec3().subVectors(this.c, this.b);
    const _v1 = new Vec3().subVectors(this.a, this.b);
    return _v0.cross(_v1).length() * 0.5;
  }

  getMidpoint(target = new Vec3()) {
    return target.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }

  getNormal(target = new Vec3()) {
    return Triangle.getNormal(this.a, this.b, this.c, target);
  }

  getPlane(target) {
    return target.setFromCoplanarPoints(this.a, this.b, this.c);
  }

  getBarycoord(point, target = new Vec3()) {
    return Triangle.getBarycoord(point, this.a, this.b, this.c, target);
  }

  getInterpolatedAttribute(point, attrA, attrB, attrC, target) {
    return Triangle.getInterpolatedAttribute(point, this.a, this.b, this.c, attrA, attrB, attrC, target);
  }

  containsPoint(point) {
    return Triangle.containsPoint(point, this.a, this.b, this.c);
  }

  isFrontFacing(direction) {
    return Triangle.isFrontFacing(this.a, this.b, this.c, direction);
  }

  closestPointToPoint(p, target = new Vec3()) {
    const a = this.a, b = this.b, c = this.c;
    let v, w;

    const _v0 = new Vec3().subVectors(c, a);
    const _v1 = new Vec3().subVectors(b, a);
    const _v2 = new Vec3().subVectors(p, a);
    const ab = _v1;
    const ac = _v0;
    const ap = _v2;

    const d1 = ab.dot(ap);
    const d2 = ac.dot(ap);
    if (d1 <= 0 && d2 <= 0) return target.copy(a);

    const _v3 = new Vec3().subVectors(p, b);
    const bp = _v3;
    const d3 = ab.dot(bp);
    const d4 = ac.dot(bp);
    if (d3 >= 0 && d4 <= d3) return target.copy(b);

    const vc = d1 * d4 - d3 * d2;
    if (vc <= 0 && d1 >= 0 && d3 <= 0) {
      v = d1 / (d1 - d3);
      return target.copy(a).addScaledVector(ab, v);
    }

    const _v4 = new Vec3().subVectors(p, c);
    const cp = _v4;
    const d5 = ab.dot(cp);
    const d6 = ac.dot(cp);
    if (d6 >= 0 && d5 <= d6) return target.copy(c);

    const vb = d5 * d2 - d1 * d6;
    if (vb <= 0 && d2 >= 0 && d6 <= 0) {
      w = d2 / (d2 - d6);
      return target.copy(a).addScaledVector(ac, w);
    }

    const va = d3 * d6 - d5 * d4;
    if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
      const _v5 = new Vec3().subVectors(c, b);
      w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
      return target.copy(b).addScaledVector(_v5, w);
    }

    const denom = 1 / (va + vb + vc);
    v = vb * denom;
    w = vc * denom;

    return target.copy(a).addScaledVector(ab, v).addScaledVector(ac, w);
  }

  equals(triangle) {
    return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
  }
}

export { Triangle };
