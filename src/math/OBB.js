/**
 * LXRN OBB
 * @module OBB
 */

import { Vec3 } from './Vec3.js';
import { Mat3 } from './Mat3.js';
import { Mat4 } from './Mat4.js';
import { Quat } from './Quat.js';
import { Bound3 } from './Bound3.js';
import { Sphere } from './Sphere.js';

class OBB {
  constructor(center = new Vec3(), halfSizes = new Vec3(), rotation = new Mat3()) {
    this.isOBB = true;
    this.center = center;
    this.halfSizes = halfSizes;
    this.rotation = rotation;
  }

  set(center, halfSizes, rotation) {
    this.center.copy(center);
    this.halfSizes.copy(halfSizes);
    this.rotation.copy(rotation);
    return this;
  }

  copy(obb) {
    this.center.copy(obb.center);
    this.halfSizes.copy(obb.halfSizes);
    this.rotation.copy(obb.rotation);
    return this;
  }

  clone() {
    return new OBB(this.center.clone(), this.halfSizes.clone(), this.rotation.clone());
  }

  fromBound3(box3) {
    box3.getCenter(this.center);
    box3.getSize(this.halfSizes).multiplyScalar(0.5);
    this.rotation.identity();
    return this;
  }

  getSize(target = new Vec3()) {
    return target.copy(this.halfSizes).multiplyScalar(2);
  }

  clampPoint(point, target = new Vec3()) {
    const _v1 = new Vec3();
    const _m1 = new Mat3();

    _v1.subVectors(point, this.center);

    _m1.copy(this.rotation).transpose();
    _v1.applyMat3(_m1);

    _v1.x = Math.max(-this.halfSizes.x, Math.min(this.halfSizes.x, _v1.x));
    _v1.y = Math.max(-this.halfSizes.y, Math.min(this.halfSizes.y, _v1.y));
    _v1.z = Math.max(-this.halfSizes.z, Math.min(this.halfSizes.z, _v1.z));

    _v1.applyMat3(this.rotation);

    return target.addVectors(this.center, _v1);
  }

  containsPoint(point) {
    const _v1 = new Vec3();
    const _m1 = new Mat3();

    _v1.subVectors(point, this.center);
    _m1.copy(this.rotation).transpose();
    _v1.applyMat3(_m1);

    return Math.abs(_v1.x) <= this.halfSizes.x &&
           Math.abs(_v1.y) <= this.halfSizes.y &&
           Math.abs(_v1.z) <= this.halfSizes.z;
  }

  intersectsOBB(obb, epsilon = 0.000001) {
    const _v1 = new Vec3();
    const _v2 = new Vec3();

    const R = new Mat3();
    const AbsR = new Mat3();

    const eA = this.halfSizes;
    const eB = obb.halfSizes;

    const uA = new Array(3);
    const uB = new Array(3);

    for (let i = 0; i < 3; i++) {
      uA[i] = new Vec3().setFromMatrix3Column(this.rotation, i);
      uB[i] = new Vec3().setFromMatrix3Column(obb.rotation, i);
    }

    _v1.subVectors(obb.center, this.center);

    const t = new Vec3(
      _v1.dot(uA[0]),
      _v1.dot(uA[1]),
      _v1.dot(uA[2])
    );

    const re = R.elements;
    const absRe = AbsR.elements;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const val = uA[i].dot(uB[j]);
        re[i * 3 + j] = val;
        absRe[i * 3 + j] = Math.abs(val) + epsilon;
      }
    }

    let ra, rb;

    for (let i = 0; i < 3; i++) {
      ra = eA.getComponent(i);
      rb = eB.x * absRe[i * 3 + 0] + eB.y * absRe[i * 3 + 1] + eB.z * absRe[i * 3 + 2];
      if (Math.abs(t.getComponent(i)) > ra + rb) return false;
    }

    for (let i = 0; i < 3; i++) {
      ra = eA.x * absRe[0 * 3 + i] + eA.y * absRe[1 * 3 + i] + eA.z * absRe[2 * 3 + i];
      rb = eB.getComponent(i);
      if (Math.abs(t.x * re[0 * 3 + i] + t.y * re[1 * 3 + i] + t.z * re[2 * 3 + i]) > ra + rb) return false;
    }

    ra = eA.y * absRe[2 * 3 + 0] + eA.z * absRe[1 * 3 + 0];
    rb = eB.y * absRe[0 * 3 + 2] + eB.z * absRe[0 * 3 + 1];
    if (Math.abs(t.z * re[1 * 3 + 0] - t.y * re[2 * 3 + 0]) > ra + rb) return false;

    ra = eA.y * absRe[2 * 3 + 1] + eA.z * absRe[1 * 3 + 1];
    rb = eB.x * absRe[0 * 3 + 2] + eB.z * absRe[0 * 3 + 0];
    if (Math.abs(t.z * re[1 * 3 + 1] - t.y * re[2 * 3 + 1]) > ra + rb) return false;

    ra = eA.y * absRe[2 * 3 + 2] + eA.z * absRe[1 * 3 + 2];
    rb = eB.x * absRe[0 * 3 + 1] + eB.y * absRe[0 * 3 + 0];
    if (Math.abs(t.z * re[1 * 3 + 2] - t.y * re[2 * 3 + 2]) > ra + rb) return false;

    ra = eA.x * absRe[2 * 3 + 0] + eA.z * absRe[0 * 3 + 0];
    rb = eB.y * absRe[1 * 3 + 2] + eB.z * absRe[1 * 3 + 1];
    if (Math.abs(t.x * re[2 * 3 + 0] - t.z * re[0 * 3 + 0]) > ra + rb) return false;

    ra = eA.x * absRe[2 * 3 + 1] + eA.z * absRe[0 * 3 + 1];
    rb = eB.x * absRe[1 * 3 + 2] + eB.z * absRe[1 * 3 + 0];
    if (Math.abs(t.x * re[2 * 3 + 1] - t.z * re[0 * 3 + 1]) > ra + rb) return false;

    ra = eA.x * absRe[2 * 3 + 2] + eA.z * absRe[0 * 3 + 2];
    rb = eB.x * absRe[1 * 3 + 1] + eB.y * absRe[1 * 3 + 0];
    if (Math.abs(t.x * re[2 * 3 + 2] - t.z * re[0 * 3 + 2]) > ra + rb) return false;

    ra = eA.x * absRe[1 * 3 + 0] + eA.y * absRe[0 * 3 + 0];
    rb = eB.y * absRe[2 * 3 + 2] + eB.z * absRe[2 * 3 + 1];
    if (Math.abs(t.y * re[0 * 3 + 0] - t.x * re[1 * 3 + 0]) > ra + rb) return false;

    ra = eA.x * absRe[1 * 3 + 1] + eA.y * absRe[0 * 3 + 1];
    rb = eB.x * absRe[2 * 3 + 2] + eB.z * absRe[2 * 3 + 0];
    if (Math.abs(t.y * re[0 * 3 + 1] - t.x * re[1 * 3 + 1]) > ra + rb) return false;

    ra = eA.x * absRe[1 * 3 + 2] + eA.y * absRe[0 * 3 + 2];
    rb = eB.x * absRe[2 * 3 + 1] + eB.y * absRe[2 * 3 + 0];
    if (Math.abs(t.y * re[0 * 3 + 2] - t.x * re[1 * 3 + 2]) > ra + rb) return false;

    return true;
  }

  applyMat4(matrix) {
    const _v1 = new Vec3();
    const _q1 = new Quat();

    matrix.decompose(this.center, _q1, _v1);

    this.halfSizes.multiply(_v1);

    const _m1 = new Mat3();
    _m1.setFromMatrix4(matrix);

    this.rotation.multiply(_m1);

    return this;
  }

  equals(obb) {
    return obb.center.equals(this.center) &&
           obb.halfSizes.equals(this.halfSizes) &&
           obb.rotation.equals(this.rotation);
  }
}

export { OBB };
