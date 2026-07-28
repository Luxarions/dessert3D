/**
 * LXRN Quat
 * @module Quat
 */

import { clamp } from './MathUtils';
import { warn } from '../utils/utils';

export class Quat {
  public isQuat = true;
  public _x: number;
  public _y: number;
  public _z: number;
  public _w: number;
  private _onChangeCallback: (() => void) | null = null;
  public __type = 'quat';
  public __version = 1;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
    this._onChangeCallback?.();
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
    this._onChangeCallback?.();
  }

  get z(): number {
    return this._z;
  }

  set z(value: number) {
    this._z = value;
    this._onChangeCallback?.();
  }

  get w(): number {
    return this._w;
  }

  set w(value: number) {
    this._w = value;
    this._onChangeCallback?.();
  }

  set(x: number, y: number, z: number, w: number): this {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    this._onChangeCallback?.();
    return this;
  }

  static slerpFlat(dst: number[] | Float32Array, dstOffset: number, src0: number[] | Float32Array, srcOffset0: number, src1: number[] | Float32Array, srcOffset1: number, t: number) {
    let x0 = src0[srcOffset0 + 0];
    let y0 = src0[srcOffset0 + 1];
    let z0 = src0[srcOffset0 + 2];
    let w0 = src0[srcOffset0 + 3];

    let x1 = src1[srcOffset1 + 0];
    let y1 = src1[srcOffset1 + 1];
    let z1 = src1[srcOffset1 + 2];
    let w1 = src1[srcOffset1 + 3];

    if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
      let dot = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1;

      if (dot < 0) {
        x1 = -x1;
        y1 = -y1;
        z1 = -z1;
        w1 = -w1;
        dot = -dot;
      }

      let s = 1 - t;

      if (dot < 0.9995) {
        const theta = Math.acos(dot);
        const sin = Math.sin(theta);
        s = Math.sin(s * theta) / sin;
        t = Math.sin(t * theta) / sin;

        x0 = x0 * s + x1 * t;
        y0 = y0 * s + y1 * t;
        z0 = z0 * s + z1 * t;
        w0 = w0 * s + w1 * t;
      } else {
        x0 = x0 * s + x1 * t;
        y0 = y0 * s + y1 * t;
        z0 = z0 * s + z1 * t;
        w0 = w0 * s + w1 * t;

        const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
        x0 *= f;
        y0 *= f;
        z0 *= f;
        w0 *= f;
      }
    }

    dst[dstOffset] = x0;
    dst[dstOffset + 1] = y0;
    dst[dstOffset + 2] = z0;
    dst[dstOffset + 3] = w0;
  }

  static multiplyQuatsFlat(dst: number[] | Float32Array, dstOffset: number, src0: number[] | Float32Array, srcOffset0: number, src1: number[] | Float32Array, srcOffset1: number) {
    const x0 = src0[srcOffset0];
    const y0 = src0[srcOffset0 + 1];
    const z0 = src0[srcOffset0 + 2];
    const w0 = src0[srcOffset0 + 3];

    const x1 = src1[srcOffset1];
    const y1 = src1[srcOffset1 + 1];
    const z1 = src1[srcOffset1 + 2];
    const w1 = src1[srcOffset1 + 3];

    dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
    dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
    dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
    dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;

    return dst;
  }

  clone(): Quat {
    return new Quat(this._x, this._y, this._z, this._w);
  }

  copy(quat: Quat): this {
    this._x = quat._x;
    this._y = quat._y;
    this._z = quat._z;
    this._w = quat._w;
    this._onChangeCallback?.();
    return this;
  }

  setFromEuler(euler: { _x: number; _y: number; _z: number; _order: string }, update: boolean = true): this {
    const x = euler._x, y = euler._y, z = euler._z, order = euler._order;
    const cos = Math.cos;
    const sin = Math.sin;

    const c1 = cos(x / 2);
    const c2 = cos(y / 2);
    const c3 = cos(z / 2);

    const s1 = sin(x / 2);
    const s2 = sin(y / 2);
    const s3 = sin(z / 2);

    switch (order) {
      case 'XYZ':
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case 'YXZ':
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 - s1 * s2 * c3;
        this._w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case 'ZXY':
        this._x = s1 * c2 * c3 - c1 * s2 * s3;
        this._y = c1 * s2 * c3 + s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case 'ZYX':
        this._x = s1 * c2 * c3 - c1 * s2 * s3;
        this._y = c1 * s2 * c3 + s1 * c2 * s3;
        this._z = c1 * c2 * s3 - s1 * s2 * c3;
        this._w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case 'YZX':
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 + s1 * c2 * s3;
        this._z = c1 * c2 * s3 - s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case 'XZY':
        this._x = s1 * c2 * c3 - c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      default:
        warn('Quat: .setFromEuler() encountered an unknown order: ' + order);
    }

    if (update === true) this._onChangeCallback?.();
    return this;
  }

  setFromAxisAngle(axis: { x: number; y: number; z: number }, angle: number): this {
    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);

    this._x = axis.x * s;
    this._y = axis.y * s;
    this._z = axis.z * s;
    this._w = Math.cos(halfAngle);

    this._onChangeCallback?.();
    return this;
  }

  setFromMat4(m: { elements: Float32Array | number[] }): this {
    const e = m.elements;

    const m11 = e[0], m12 = e[4], m13 = e[8];
    const m21 = e[1], m22 = e[5], m23 = e[9];
    const m31 = e[2], m32 = e[6], m33 = e[10];

    const trace = m11 + m22 + m33;

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0);

      this._w = 0.25 / s;
      this._x = (m32 - m23) * s;
      this._y = (m13 - m31) * s;
      this._z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

      this._w = (m32 - m23) / s;
      this._x = 0.25 * s;
      this._y = (m12 + m21) / s;
      this._z = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

      this._w = (m13 - m31) / s;
      this._x = (m12 + m21) / s;
      this._y = 0.25 * s;
      this._z = (m23 + m32) / s;
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

      this._w = (m21 - m12) / s;
      this._x = (m13 + m31) / s;
      this._y = (m23 + m32) / s;
      this._z = 0.25 * s;
    }

    this._onChangeCallback?.();
    return this;
  }

  setFromUnitVectors(vFrom: { x: number; y: number; z: number; dot: (v: any) => number }, vTo: { x: number; y: number; z: number }): this {
    let r = vFrom.dot(vTo) + 1;

    if (r < 1e-8) {
      r = 0;

      if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
        this._x = -vFrom.y;
        this._y = vFrom.x;
        this._z = 0;
        this._w = r;
      } else {
        this._x = 0;
        this._y = -vFrom.z;
        this._z = vFrom.y;
        this._w = r;
      }
    } else {
      this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
      this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
      this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
      this._w = r;
    }

    return this.normalize();
  }

  angleTo(q: Quat): number {
    return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
  }

  rotateTowards(q: Quat, step: number): this {
    const angle = this.angleTo(q);
    if (angle === 0) return this;
    const t = Math.min(1, step / angle);
    this.slerp(q, t);
    return this;
  }

  identity(): this {
    return this.set(0, 0, 0, 1);
  }

  invert(): this {
    return this.conjugate();
  }

  conjugate(): this {
    this._x *= -1;
    this._y *= -1;
    this._z *= -1;
    this._onChangeCallback?.();
    return this;
  }

  dot(q: Quat): number {
    return this._x * q._x + this._y * q._y + this._z * q._z + this._w * q._w;
  }

  lengthSq(): number {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }

  length(): number {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }

  normalize(): this {
    let l = this.length();

    if (l === 0) {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;
    } else {
      l = 1 / l;

      this._x = this._x * l;
      this._y = this._y * l;
      this._z = this._z * l;
      this._w = this._w * l;
    }

    this._onChangeCallback?.();
    return this;
  }

  multiply(q: Quat): this {
    return this.multiplyQuats(this, q);
  }

  premultiply(q: Quat): this {
    return this.multiplyQuats(q, this);
  }

  multiplyQuats(a: Quat, b: Quat): this {
    const ax = a._x, ay = a._y, az = a._z, aw = a._w;
    const bx = b._x, by = b._y, bz = b._z, bw = b._w;

    this._x = ax * bw + aw * bx + ay * bz - az * by;
    this._y = ay * bw + aw * by + az * bx - ax * bz;
    this._z = az * bw + aw * bz + ax * by - ay * bx;
    this._w = aw * bw - ax * bx - ay * by - az * bz;

    this._onChangeCallback?.();
    return this;
  }

  slerp(qb: Quat, t: number): this {
    let x = qb._x, y = qb._y, z = qb._z, w = qb._w;
    let dot = this.dot(qb);

    if (dot < 0) {
      x = -x;
      y = -y;
      z = -z;
      w = -w;
      dot = -dot;
    }

    let s = 1 - t;

    if (dot < 0.9995) {
      const theta = Math.acos(dot);
      const sin = Math.sin(theta);

      s = Math.sin(s * theta) / sin;
      t = Math.sin(t * theta) / sin;

      this._x = this._x * s + x * t;
      this._y = this._y * s + y * t;
      this._z = this._z * s + z * t;
      this._w = this._w * s + w * t;

      this._onChangeCallback?.();
    } else {
      this._x = this._x * s + x * t;
      this._y = this._y * s + y * t;
      this._z = this._z * s + z * t;
      this._w = this._w * s + w * t;

      this.normalize();
    }

    return this;
  }

  slerpQuats(qa: Quat, qb: Quat, t: number): this {
    return this.copy(qa).slerp(qb, t);
  }

  random(): this {
    const theta1 = 2 * Math.PI * Math.random();
    const theta2 = 2 * Math.PI * Math.random();

    const x0 = Math.random();
    const r1 = Math.sqrt(1 - x0);
    const r2 = Math.sqrt(x0);

    return this.set(
      r1 * Math.sin(theta1),
      r1 * Math.cos(theta1),
      r2 * Math.sin(theta2),
      r2 * Math.cos(theta2)
    );
  }

  equals(quat: Quat): boolean {
    return quat._x === this._x &&
           quat._y === this._y &&
           quat._z === this._z &&
           quat._w === this._w;
  }

  fromArray(array: number[] | Float32Array, offset: number = 0): this {
    this._x = array[offset];
    this._y = array[offset + 1];
    this._z = array[offset + 2];
    this._w = array[offset + 3];
    this._onChangeCallback?.();
    return this;
  }

  toArray(array: number[] = [], offset: number = 0): number[] {
    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._w;
    return array;
  }

  fromBufferAttribute(attribute: any, index: number): this {
    this._x = attribute.getX(index);
    this._y = attribute.getY(index);
    this._z = attribute.getZ(index);
    this._w = attribute.getW(index);
    this._onChangeCallback?.();
    return this;
  }

  toJSON(): number[] {
    return this.toArray();
  }

  _onChange(callback: () => void): this {
    this._onChangeCallback = callback;
    return this;
  }

  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._w;
  }
}
