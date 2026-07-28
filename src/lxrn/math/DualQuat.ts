/**
 * LXRN DualQuat
 * @module DualQuat
 */

import { Quat } from './Quat';
import { Vec3 } from './Vec3';
import { Mat4 } from './Mat4';

export class DualQuat {
  public real: Quat;
  public dual: Quat;

  constructor(real: Quat = new Quat(0, 0, 0, 1), dual: Quat = new Quat(0, 0, 0, 0)) {
    this.real = real.clone();
    this.dual = dual.clone();
  }

  set(real: Quat, dual: Quat): this {
    this.real.copy(real);
    this.dual.copy(dual);
    return this;
  }

  identity(): this {
    this.real.set(0, 0, 0, 1);
    this.dual.set(0, 0, 0, 0);
    return this;
  }

  clone(): DualQuat {
    return new DualQuat(this.real, this.dual);
  }

  copy(dq: DualQuat): this {
    this.real.copy(dq.real);
    this.dual.copy(dq.dual);
    return this;
  }

  setFromRotationTranslation(q: Quat, t: Vec3): this {
    this.real.copy(q).normalize();
    const tq = new Quat(t.x * 0.5, t.y * 0.5, t.z * 0.5, 0);
    this.dual.multiplyQuats(tq, this.real);
    return this;
  }

  setFromMat4(m: Mat4): this {
    const pos = new Vec3();
    const rot = new Quat();
    const scl = new Vec3();
    m.decompose(pos, rot, scl);
    return this.setFromRotationTranslation(rot, pos);
  }

  toMat4(target: Mat4 = new Mat4()): Mat4 {
    const len = this.real.length();
    const qr = this.real.clone().normalize();
    const qd = this.dual;

    const tq = new Quat().multiplyQuats(qd, qr.clone().conjugate());
    const t = new Vec3(tq.x * 2 / len, tq.y * 2 / len, tq.z * 2 / len);

    target.makeRotationFromQuaternion(qr);
    target.setPosition(t);
    return target;
  }

  multiply(dq: DualQuat): this {
    const r1 = this.real.clone(), d1 = this.dual.clone();
    const r2 = dq.real, d2 = dq.dual;

    this.real.multiplyQuats(r1, r2);

    const term1 = new Quat().multiplyQuats(r1, d2);
    const term2 = new Quat().multiplyQuats(d1, r2);

    this.dual.set(
      term1.x + term2.x,
      term1.y + term2.y,
      term1.z + term2.z,
      term1.w + term2.w
    );

    return this;
  }

  normalize(): this {
    const l = this.real.length();
    if (l === 0) return this.identity();
    const invL = 1 / l;
    this.real.multiplyScalar(invL);
    this.dual.multiplyScalar(invL);
    return this;
  }

  slerp(dq: DualQuat, t: number): this {
    let dot = this.real.dot(dq.real);
    let scale0 = 1 - t;
    let scale1 = t;

    if (dot < 0) {
      dot = -dot;
      scale1 = -scale1;
    }

    this.real.set(
      this.real.x * scale0 + dq.real.x * scale1,
      this.real.y * scale0 + dq.real.y * scale1,
      this.real.z * scale0 + dq.real.z * scale1,
      this.real.w * scale0 + dq.real.w * scale1
    ).normalize();

    this.dual.set(
      this.dual.x * scale0 + dq.dual.x * scale1,
      this.dual.y * scale0 + dq.dual.y * scale1,
      this.dual.z * scale0 + dq.dual.z * scale1,
      this.dual.w * scale0 + dq.dual.w * scale1
    );

    return this;
  }
}
