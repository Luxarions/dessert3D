/**
 * LXRN Mat2
 * @module Mat2
 */

import { warnOnce } from '../utils.js';

class Mat2 {
  constructor(n11, n12, n21, n22) {
    this.isMat2 = true;
    this.elements = [
      1, 0,
      0, 1
    ];

    if (n11 !== undefined) {
      this.set(n11, n12, n21, n22);
    }
  }

  set(n11, n12, n21, n22) {
    const te = this.elements;
    te[0] = n11; te[2] = n12;
    te[1] = n21; te[3] = n22;
    return this;
  }

  identity() {
    this.set(
      1, 0,
      0, 1
    );
    return this;
  }

  clone() {
    return new this.constructor().fromArray(this.elements);
  }

  copy(m) {
    const te = this.elements;
    const me = m.elements;

    te[0] = me[0]; te[1] = me[1];
    te[2] = me[2]; te[3] = me[3];

    return this;
  }

  extractBasis(xAxis, yAxis) {
    xAxis.setFromMatrix2Column(this, 0);
    yAxis.setFromMatrix2Column(this, 1);
    return this;
  }

  makeBasis(xAxis, yAxis) {
    this.set(
      xAxis.x, yAxis.x,
      xAxis.y, yAxis.y
    );
    return this;
  }

  multiply(m) {
    return this.multiplyMatrices(this, m);
  }

  premultiply(m) {
    return this.multiplyMatrices(m, this);
  }

  multiplyMatrices(a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[0], a12 = ae[2];
    const a21 = ae[1], a22 = ae[3];

    const b11 = be[0], b12 = be[2];
    const b21 = be[1], b22 = be[3];

    te[0] = a11 * b11 + a12 * b21;
    te[2] = a11 * b12 + a12 * b22;
    te[1] = a21 * b11 + a22 * b21;
    te[3] = a21 * b12 + a22 * b22;

    return this;
  }

  multiplyScalar(s) {
    const te = this.elements;
    te[0] *= s; te[2] *= s;
    te[1] *= s; te[3] *= s;
    return this;
  }

  determinant() {
    const te = this.elements;
    const a = te[0], b = te[2];
    const c = te[1], d = te[3];
    return a * d - b * c;
  }

  invert() {
    const te = this.elements;
    const a = te[0], b = te[2];
    const c = te[1], d = te[3];

    const det = a * d - b * c;

    if (det === 0) {
      warnOnce('LXRN.Mat2: Inversion failed. Determinant is 0.');
      return this.identity();
    }

    const detInv = 1.0 / det;

    te[0] = d * detInv;
    te[2] = -b * detInv;
    te[1] = -c * detInv;
    te[3] = a * detInv;

    return this;
  }

  transpose() {
    const te = this.elements;
    let tmp;

    tmp = te[1]; te[1] = te[2]; te[2] = tmp;

    return this;
  }

  makeScale(x, y) {
    this.set(
      x, 0,
      0, y
    );
    return this;
  }

  makeRotation(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.set(
      c, -s,
      s, c
    );

    return this;
  }

  scale(sx, sy) {
    const te = this.elements;

    te[0] *= sx; te[2] *= sy;
    te[1] *= sx; te[3] *= sy;

    return this;
  }

  rotate(theta) {
    const m = new Mat2().makeRotation(theta);
    return this.multiply(m);
  }

  equals(matrix) {
    const te = this.elements;
    const me = matrix.elements;

    for (let i = 0; i < 4; i++) {
      if (te[i] !== me[i]) return false;
    }

    return true;
  }

  fromArray(array, offset = 0) {
    for (let i = 0; i < 4; i++) {
      this.elements[i] = array[i + offset];
    }
    return this;
  }

  toArray(array = [], offset = 0) {
    const te = this.elements;

    array[offset] = te[0];
    array[offset + 1] = te[1];
    array[offset + 2] = te[2];
    array[offset + 3] = te[3];

    return array;
  }
}

export { Mat2 };
