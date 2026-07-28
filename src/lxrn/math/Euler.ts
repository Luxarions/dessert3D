/**
 * LXRN Euler
 * @module Euler
 */

import { clamp } from './MathUtils';
import { Quat } from './Quat';
import { warn } from '../utils/utils';

export const DEFAULT_EULER_ORDER = 'XYZ';
export const EULER_ORDERS = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'] as const;

export class Euler {
  public isEuler = true;
  public _x: number;
  public _y: number;
  public _z: number;
  public _order: string;
  private _onChangeCallback: (() => void) | null = null;
  public __type = 'euler';
  public __version = 1;

  constructor(x: number = 0, y: number = 0, z: number = 0, order: string = DEFAULT_EULER_ORDER) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order;
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

  get order(): string {
    return this._order;
  }

  set order(value: string) {
    this._order = value;
    this._onChangeCallback?.();
  }

  set(x: number, y: number, z: number, order: string = this._order): this {
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order;
    this._onChangeCallback?.();
    return this;
  }

  clone(): Euler {
    return new Euler(this._x, this._y, this._z, this._order);
  }

  copy(euler: Euler): this {
    this._x = euler._x;
    this._y = euler._y;
    this._z = euler._z;
    this._order = euler._order;
    this._onChangeCallback?.();
    return this;
  }

  setFromRotationMatrix(m: { elements: Float32Array | number[] }, order: string = this._order, update: boolean = true): this {
    const clampFn = clamp;
    const te = m.elements;

    const m11 = te[0], m12 = te[4], m13 = te[8];
    const m21 = te[1], m22 = te[5], m23 = te[9];
    const m31 = te[2], m32 = te[6], m33 = te[10];

    switch (order) {
      case 'XYZ':
        this._y = Math.asin(clampFn(m13, -1, 1));
        if (Math.abs(m13) < 0.9999999) {
          this._x = Math.atan2(-m23, m33);
          this._z = Math.atan2(-m12, m11);
        } else {
          this._x = Math.atan2(m32, m22);
          this._z = 0;
        }
        break;
      case 'YXZ':
        this._x = Math.asin(-clampFn(m23, -1, 1));
        if (Math.abs(m23) < 0.9999999) {
          this._y = Math.atan2(m13, m33);
          this._z = Math.atan2(m21, m22);
        } else {
          this._y = Math.atan2(-m31, m11);
          this._z = 0;
        }
        break;
      case 'ZXY':
        this._x = Math.asin(clampFn(m32, -1, 1));
        if (Math.abs(m32) < 0.9999999) {
          this._y = Math.atan2(-m31, m33);
          this._z = Math.atan2(-m12, m22);
        } else {
          this._y = 0;
          this._z = Math.atan2(m21, m11);
        }
        break;
      case 'ZYX':
        this._y = Math.asin(-clampFn(m31, -1, 1));
        if (Math.abs(m31) < 0.9999999) {
          this._x = Math.atan2(m32, m33);
          this._z = Math.atan2(m21, m11);
        } else {
          this._x = 0;
          this._z = Math.atan2(-m12, m22);
        }
        break;
      case 'YZX':
        this._z = Math.asin(clampFn(m21, -1, 1));
        if (Math.abs(m21) < 0.9999999) {
          this._x = Math.atan2(-m23, m22);
          this._y = Math.atan2(-m31, m11);
        } else {
          this._x = 0;
          this._y = Math.atan2(m13, m33);
        }
        break;
      case 'XZY':
        this._z = Math.asin(-clampFn(m12, -1, 1));
        if (Math.abs(m12) < 0.9999999) {
          this._x = Math.atan2(m32, m22);
          this._y = Math.atan2(m13, m11);
        } else {
          this._x = Math.atan2(-m23, m33);
          this._y = 0;
        }
        break;
      default:
        warn('Euler: .setFromRotationMatrix() encountered an unknown order: ' + order);
    }

    this._order = order;
    if (update === true) this._onChangeCallback?.();
    return this;
  }

  setFromQuaternion(q: Quat, order: string = this._order, update: boolean = true): this {
    const qx = q._x, qy = q._y, qz = q._z, qw = q._w;
    const qx2 = qx * qx, qy2 = qy * qy, qz2 = qz * qz, qw2 = qw * qw;

    switch (order) {
      case 'XYZ':
        this._x = Math.atan2(2 * (qx * qw - qy * qz), qw2 - qx2 - qy2 + qz2);
        this._y = Math.asin(clamp(2 * (qx * qz + qy * qw), -1, 1));
        this._z = Math.atan2(2 * (qz * qw - qx * qy), qw2 + qx2 - qy2 - qz2);
        break;
      case 'YXZ':
        this._x = Math.asin(clamp(2 * (qx * qw - qy * qz), -1, 1));
        this._y = Math.atan2(2 * (qx * qz + qy * qw), qw2 - qx2 - qy2 + qz2);
        this._z = Math.atan2(2 * (qx * qy + qz * qw), qw2 - qx2 + qy2 - qz2);
        break;
      case 'ZXY':
        this._x = Math.asin(clamp(2 * (qx * qw + qy * qz), -1, 1));
        this._y = Math.atan2(2 * (qy * qw - qx * qz), qw2 - qx2 - qy2 + qz2);
        this._z = Math.atan2(2 * (qz * qw - qx * qy), qw2 - qx2 + qy2 - qz2);
        break;
      case 'ZYX':
        this._x = Math.atan2(2 * (qx * qw + qy * qz), qw2 - qx2 - qy2 + qz2);
        this._y = Math.asin(clamp(2 * (qy * qw - qx * qz), -1, 1));
        this._z = Math.atan2(2 * (qz * qw + qx * qy), qw2 + qx2 - qy2 - qz2);
        break;
      case 'YZX':
        this._x = Math.atan2(2 * (qx * qw - qz * qy), qw2 - qx2 + qy2 - qz2);
        this._y = Math.atan2(2 * (qy * qw - qx * qz), qw2 + qx2 - qy2 - qz2);
        this._z = Math.asin(clamp(2 * (qx * qy + qz * qw), -1, 1));
        break;
      case 'XZY':
        this._x = Math.atan2(2 * (qx * qw + qz * qy), qw2 - qx2 + qy2 - qz2);
        this._y = Math.atan2(2 * (qy * qw + qx * qz), qw2 + qx2 - qy2 - qz2);
        this._z = Math.asin(clamp(2 * (qz * qw - qx * qy), -1, 1));
        break;
      default:
        warn('Euler: .setFromQuaternion() encountered an unknown order: ' + order);
    }

    this._order = order;
    if (update === true) this._onChangeCallback?.();
    return this;
  }

  setFromVector3(v: { x: number; y: number; z: number }, order: string = this._order): this {
    return this.set(v.x, v.y, v.z, order);
  }

  reorder(newOrder: string): this {
    const q = new Quat().setFromEuler(this);
    return this.setFromQuaternion(q, newOrder);
  }

  equals(euler: Euler): boolean {
    return euler._x === this._x &&
           euler._y === this._y &&
           euler._z === this._z &&
           euler._order === this._order;
  }

  fromArray(array: any[]): this {
    this._x = array[0];
    this._y = array[1];
    this._z = array[2];
    if (array[3] !== undefined) this._order = array[3];
    this._onChangeCallback?.();
    return this;
  }

  toArray(array: any[] = [], offset: number = 0): any[] {
    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._order;
    return array;
  }

  onChange(callback: () => void): this {
    return this._onChange(callback);
  }

  _onChange(callback: () => void): this {
    this._onChangeCallback = callback;
    return this;
  }

  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._order;
  }
}
