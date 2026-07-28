/**
 * LXRN Matrix
 * @module Matrix
 */

import { clamp } from './MathUtils.js';

class Matrix {
  constructor(rows = 0, cols = 0, data = null) {
    this.isMatrix = true;
    this.rows = rows;
    this.cols = cols;
    this.elements = new Float32Array(rows * cols);

    if (data) {
      this.set(data);
    }
  }

  set(data) {
    if (data.length !== this.rows * this.cols) {
      throw new Error('LXRN.Matrix: Data size does not match matrix dimensions.');
    }
    this.elements.set(data);
    return this;
  }

  get(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error('LXRN.Matrix: Index out of bounds.');
    }
    return this.elements[row * this.cols + col];
  }

  setElement(row, col, value) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error('LXRN.Matrix: Index out of bounds.');
    }
    this.elements[row * this.cols + col] = value;
    return this;
  }

  identity() {
    if (this.rows !== this.cols) {
      throw new Error('LXRN.Matrix: Identity is only defined for square matrices.');
    }
    this.elements.fill(0);
    for (let i = 0; i < this.rows; i++) {
      this.elements[i * this.cols + i] = 1;
    }
    return this;
  }

  clone() {
    const m = new Matrix(this.rows, this.cols);
    m.elements.set(this.elements);
    return m;
  }

  copy(m) {
    if (this.rows !== m.rows || this.cols !== m.cols) {
      this.rows = m.rows;
      this.cols = m.cols;
      this.elements = new Float32Array(m.rows * m.cols);
    }
    this.elements.set(m.elements);
    return this;
  }

  add(m) {
    if (this.rows !== m.rows || this.cols !== m.cols) {
      throw new Error('LXRN.Matrix: Matrix dimensions must match for addition.');
    }
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] += m.elements[i];
    }
    return this;
  }

  sub(m) {
    if (this.rows !== m.rows || this.cols !== m.cols) {
      throw new Error('LXRN.Matrix: Matrix dimensions must match for subtraction.');
    }
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] -= m.elements[i];
    }
    return this;
  }

  multiplyScalar(s) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] *= s;
    }
    return this;
  }

  multiply(m) {
    if (this.cols !== m.rows) {
      throw new Error('LXRN.Matrix: Inner dimensions must match for multiplication.');
    }
    const result = new Matrix(this.rows, m.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          sum += this.get(i, k) * m.get(k, j);
        }
        result.setElement(i, j, sum);
      }
    }
    this.copy(result);
    return this;
  }

  transpose() {
    const result = new Matrix(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.setElement(j, i, this.get(i, j));
      }
    }
    this.rows = result.rows;
    this.cols = result.cols;
    this.elements = result.elements;
    return this;
  }

  equals(m) {
    if (this.rows !== m.rows || this.cols !== m.cols) return false;
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i] !== m.elements[i]) return false;
    }
    return true;
  }
}

export { Matrix };
