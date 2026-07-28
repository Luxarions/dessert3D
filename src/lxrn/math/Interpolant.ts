/**
 * LXRN Interpolant
 * @module Interpolant
 */

import { Quat } from './Quat';
import { DualQuat } from './DualQuat';

export abstract class Interpolant {
  public parameterPositions: Float32Array | number[];
  public sampleValues: Float32Array | number[];
  public valueSize: number;
  public resultBuffer: Float32Array | number[];
  protected _cachedIndex: number = 0;

  constructor(parameterPositions: Float32Array | number[], sampleValues: Float32Array | number[], valueSize: number, resultBuffer?: Float32Array | number[]) {
    this.parameterPositions = parameterPositions;
    this.sampleValues = sampleValues;
    this.valueSize = valueSize;
    this.resultBuffer = resultBuffer || new Float32Array(valueSize);
  }

  evaluate(t: number): Float32Array | number[] {
    const pp = this.parameterPositions;
    let i = this._cachedIndex;

    if (t >= pp[i]) {
      while (i < pp.length - 1 && t >= pp[i + 1]) {
        i++;
      }
    } else {
      while (i > 0 && t < pp[i]) {
        i--;
      }
    }

    this._cachedIndex = i;

    if (i === 0 && t < pp[0]) {
      return this.interpolate_(0, pp[0], pp[0], t);
    }

    if (i === pp.length - 1) {
      return this.interpolate_(i, pp[i], pp[i], t);
    }

    return this.interpolate_(i, pp[i], pp[i + 1], t);
  }

  protected abstract interpolate_(i1: number, t0: number, t1: number, t: number): Float32Array | number[];
}

export class LinearInterpolant extends Interpolant {
  protected interpolate_(i1: number, t0: number, t1: number, t: number): Float32Array | number[] {
    const values = this.sampleValues;
    const stride = this.valueSize;
    const result = this.resultBuffer;

    if (t0 === t1) {
      const offset = i1 * stride;
      for (let k = 0; k < stride; k++) {
        result[k] = values[offset + k];
      }
      return result;
    }

    const weight = (t - t0) / (t1 - t0);
    const offset0 = i1 * stride;
    const offset1 = (i1 + 1) * stride;

    for (let k = 0; k < stride; k++) {
      result[k] = values[offset0 + k] + weight * (values[offset1 + k] - values[offset0 + k]);
    }

    return result;
  }
}

export class StepInterpolant extends Interpolant {
  protected interpolate_(i1: number, t0: number, t1: number, t: number): Float32Array | number[] {
    const values = this.sampleValues;
    const stride = this.valueSize;
    const result = this.resultBuffer;

    const offset = i1 * stride;
    for (let k = 0; k < stride; k++) {
      result[k] = values[offset + k];
    }

    return result;
  }
}

export class CubicSplineInterpolant extends Interpolant {
  protected interpolate_(i1: number, t0: number, t1: number, t: number): Float32Array | number[] {
    const values = this.sampleValues;
    const stride = this.valueSize;
    const result = this.resultBuffer;

    if (t0 === t1) {
      const offset = i1 * stride * 3 + stride;
      for (let k = 0; k < stride; k++) {
        result[k] = values[offset + k];
      }
      return result;
    }

    const dt = t1 - t0;
    const p = (t - t0) / dt;
    const pp = p * p;
    const ppp = pp * p;

    const h00 = 2 * ppp - 3 * pp + 1;
    const h10 = ppp - 2 * pp + p;
    const h01 = -2 * ppp + 3 * pp;
    const h11 = ppp - pp;

    const offset0 = i1 * stride * 3;
    const offset1 = (i1 + 1) * stride * 3;

    for (let k = 0; k < stride; k++) {
      const v0 = values[offset0 + stride + k];
      const m0 = values[offset0 + stride * 2 + k] * dt;
      const v1 = values[offset1 + stride + k];
      const m1 = values[offset1 + k] * dt;

      result[k] = h00 * v0 + h10 * m0 + h01 * v1 + h11 * m1;
    }

    return result;
  }
}

export class QuaternionLinearInterpolant extends Interpolant {
  protected interpolate_(i1: number, t0: number, t1: number, t: number): Float32Array | number[] {
    const result = this.resultBuffer;
    if (t0 === t1) {
      const offset = i1 * 4;
      result[0] = this.sampleValues[offset];
      result[1] = this.sampleValues[offset + 1];
      result[2] = this.sampleValues[offset + 2];
      result[3] = this.sampleValues[offset + 3];
      return result;
    }

    const weight = (t - t0) / (t1 - t0);
    Quat.slerpFlat(result, 0, this.sampleValues, i1 * 4, this.sampleValues, (i1 + 1) * 4, weight);
    return result;
  }
}
