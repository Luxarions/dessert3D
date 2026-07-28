/**
 * LXRN DualQuat
 * @module DualQuat
 */

import { Vec3 } from './Vec3.js';
import { Quat } from './Quat.js';
import { Mat4 } from './Mat4.js';

class DualQuat {
  constructor(real = new Quat(), dual = new Quat(0, 0, 0, 0)) {
    this.isDualQuat = true;
    this.real = real;
    this.dual = dual;
  }

  set(real, dual) {
    this.real.copy(real);
    this.dual.copy(dual);
    return this;
  }

  clone() {
    return new DualQuat(this.real.clone(), this.dual.clone());
  }

  copy(dq) {
    this.real.copy(dq.real);
    this.dual.copy(dq.dual);
    return this;
  }

  identity() {
    this.real.set(0, 0, 0, 1);
    this.dual.set(0, 0, 0, 0);
    return this;
  }

  setFromTranslationRotation(translation, rotation) {
    this.real.copy(rotation);
    const ax = translation.x, ay = translation.y, az = translation.z;
    const qx = rotation.x, qy = rotation.y, qz = rotation.z, qw = rotation.w;

    this.dual.x = 0.5 * (ax * qw + ay * qz - az * qy);
    this.dual.y = 0.5 * (-ax * qz + ay * qw + az * qx);
    this.dual.z = 0.5 * (ax * qy - ay * qx + az * qw);
    this.dual.w = -0.5 * (ax * qx + ay * qy + az * qz);

    return this;
  }

  setFromRotationTranslation(rotation, translation) {
    if (rotation && rotation.isVec3) {
      return this.setFromTranslationRotation(rotation, translation);
    }
    return this.setFromTranslationRotation(translation, rotation);
  }

  getTranslation(target = new Vec3()) {
    const rx = this.real.x, ry = this.real.y, rz = this.real.z, rw = this.real.w;
    const dx = this.dual.x, dy = this.dual.y, dz = this.dual.z, dw = this.dual.w;

    target.x = 2 * (-dw * rx + dx * rw - dy * rz + dz * ry);
    target.y = 2 * (-dw * ry + dx * rz + dy * rw - dz * rx);
    target.z = 2 * (-dw * rz - dx * ry + dy * rx + dz * rw);

    return target;
  }

  getRotation(target = new Quat()) {
    return target.copy(this.real);
  }

  getMat4(target = new Mat4()) {
    const t = new Vec3();
    this.getTranslation(t);
    target.compose(t, this.real, new Vec3(1, 1, 1));
    return target;
  }

  multiply(dq) {
    return this.multiplyDualQuaternions(this, dq);
  }

  multiplyDualQuaternions(a, b) {
    const real = new Quat().multiplyQuaternions(a.real, b.real);

    const dualA = new Quat().multiplyQuaternions(a.real, b.dual);
    const dualB = new Quat().multiplyQuaternions(a.dual, b.real);

    const dual = new Quat().set(
      dualA.x + dualB.x,
      dualA.y + dualB.y,
      dualA.z + dualB.z,
      dualA.w + dualB.w
    );

    this.real.copy(real);
    this.dual.copy(dual);

    return this;
  }

  normalize() {
    const norm = this.real.length();
    if (norm === 0) return this.identity();

    const invNorm = 1 / norm;
    this.real.multiplyScalar(invNorm);
    this.dual.multiplyScalar(invNorm);

    return this;
  }

  equals(dq) {
    return this.real.equals(dq.real) && this.dual.equals(dq.dual);
  }
}

export { DualQuat };
