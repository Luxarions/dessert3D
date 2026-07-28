/**
 * LXRN Matrix (Generic m x n matrix)
 * @module Matrix
 */

export class Matrix {
  public rows: number;
  public cols: number;
  public elements: Float32Array;

  constructor(rows: number = 4, cols: number = 4, data?: number[] | Float32Array) {
    this.rows = rows;
    this.cols = cols;
    this.elements = new Float32Array(rows * cols);
    if (data) {
      for (let i = 0; i < Math.min(this.elements.length, data.length); i++) {
        this.elements[i] = data[i];
      }
    }
  }

  get(r: number, c: number): number {
    return this.elements[r * this.cols + c];
  }

  set(r: number, c: number, val: number): this {
    this.elements[r * this.cols + c] = val;
    return this;
  }

  identity(): this {
    this.elements.fill(0);
    const min = Math.min(this.rows, this.cols);
    for (let i = 0; i < min; i++) {
      this.elements[i * this.cols + i] = 1;
    }
    return this;
  }

  clone(): Matrix {
    return new Matrix(this.rows, this.cols, this.elements);
  }

  copy(m: Matrix): this {
    this.rows = m.rows;
    this.cols = m.cols;
    this.elements = new Float32Array(m.elements);
    return this;
  }

  add(m: Matrix): this {
    if (this.rows !== m.rows || this.cols !== m.cols) {
      throw new Error('Matrix dimensions must match for addition');
    }
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] += m.elements[i];
    }
    return this;
  }

  sub(m: Matrix): this {
    if (this.rows !== m.rows || this.cols !== m.cols) {
      throw new Error('Matrix dimensions must match for subtraction');
    }
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] -= m.elements[i];
    }
    return this;
  }

  multiplyScalar(s: number): this {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] *= s;
    }
    return this;
  }

  multiply(m: Matrix): Matrix {
    if (this.cols !== m.rows) {
      throw new Error('Matrix multiplication dimension mismatch');
    }
    const result = new Matrix(this.rows, m.cols);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < m.cols; c++) {
        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          sum += this.get(r, k) * m.get(k, c);
        }
        result.set(r, c, sum);
      }
    }
    return result;
  }

  transpose(): Matrix {
    const result = new Matrix(this.cols, this.rows);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        result.set(c, r, this.get(r, c));
      }
    }
    return result;
  }
}
