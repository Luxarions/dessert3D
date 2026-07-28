/**
 * LXRN Interpolant
 * @module Interpolant
 */

import { Vec2 } from './Vec2.js';
import { Vec3 } from './Vec3.js';
import { Vec4 } from './Vec4.js';
import { Quat } from './Quat.js';
import { clamp, lerp } from './MathUtils.js';

class Interpolant {
  constructor(parameterPositions, sampleValues, sampleSize, resultBuffer) {
    this.isInterpolant = true;
    this.times = parameterPositions;
    this.values = sampleValues;
    this.sampleSize = sampleSize;
    this.resultBuffer = resultBuffer || new Float32Array(sampleSize);

    this._cachedIndex = 0;
  }

  evaluate(t) {
    const times = this.times;
    let i = this._cachedIndex;

    if (t < times[0]) {
      return this.interpolate(0, 0, 0, t);
    }

    if (t >= times[times.length - 1]) {
      return this.interpolate(times.length - 1, times.length - 1, 0, t);
    }

    while (i < times.length - 1 && t >= times[i + 1]) i++;
    while (i > 0 && t < times[i]) i--;

    this._cachedIndex = i;

    const t0 = times[i];
    const t1 = times[i + 1];
    const weight = (t - t0) / (t1 - t0);

    return this.interpolate(i, i + 1, weight, t);
  }

  interpolate(i0, i1, weight, t) {
    const values = this.values;
    const stride = this.sampleSize;

    if (i0 === i1) {
      for (let j = 0; j < stride; j++) {
        this.resultBuffer[j] = values[i0 * stride + j];
      }
      return this.resultBuffer;
    }

    for (let j = 0; j < stride; j++) {
      const v0 = values[i0 * stride + j];
      const v1 = values[i1 * stride + j];
      this.resultBuffer[j] = lerp(v0, v1, weight);
    }

    return this.resultBuffer;
  }

  static cubicSpline(p0, p1, p2, p3, weight, target) {
    const t2 = weight * weight;
    const t3 = weight * t2;

    if (p1 && p1.isVec3) {
      const result = new Vec3();
      result.x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * weight +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      result.y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * weight +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );
      result.z = 0.5 * (
        (2 * p1.z) +
        (-p0.z + p2.z) * weight +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3
      );
      return target.copy(result);
    } else if (typeof p1 === 'number') {
      const num = 0.5 * (
        (2 * p1) +
        (-p0 + p2) * weight +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3
      );
      return num;
    }

    return target;
  }

  equals(interpolant) {
    if (this.times.length !== interpolant.times.length) return false;
    for (let i = 0; i < this.times.length; i++) {
      if (this.times[i] !== interpolant.times[i]) return false;
    }
    return true;
  }
}

export { Interpolant };
