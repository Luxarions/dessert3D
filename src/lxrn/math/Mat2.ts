/**
 * LXRN Mat2
 * @module Mat2
 */

export class Mat2 {
  public isMat2 = true;
  public elements: Float32Array;
  public __type = 'mat2';
  public __version = 1;

  constructor(n11?: number, n12?: number, n21?: number, n22?: number) {
    this.elements = new Float32Array(4);
    if (n11 !== undefined) {
      this.set(n11, n12!, n21!, n22!);
    } else {
      this.identity();
    }
  }

  set(n11: number, n12: number, n21: number, n22: number): this {
    const te = this.elements;
    te[0] = n11; te[2] = n12;
    te[1] = n21; te[3] = n22;
    return this;
  }

  identity(): this {
    this.set(
      1, 0,
      0, 1
    );
    return this;
  }

  clone(): Mat2 {
    return new Mat2().fromArray(this.elements);
  }

  copy(m: Mat2): this {
    const te = this.elements;
    const me = m.elements;
    te[0] = me[0]; te[1] = me[1];
    te[2] = me[2]; te[3] = me[3];
    return this;
  }

  determinant(): number {
    const te = this.elements;
    return te[0] * te[3] - te[2] * te[1];
  }

  invert(): this {
    const te = this.elements;
    const a = te[0], b = te[2], c = te[1], d = te[3];
    const det = a * d - b * c;
    if (det === 0) return this.identity();
    const invDet = 1 / det;
    te[0] = d * invDet;
    te[2] = -b * invDet;
    te[1] = -c * invDet;
    te[3] = a * invDet;
    return this;
  }

  transpose(): this {
    const te = this.elements;
    let tmp = te[1];
    te[1] = te[2];
    te[2] = tmp;
    return this;
  }

  multiply(m: Mat2): this {
    return this.multiplyMatrices(this, m);
  }

  premultiply(m: Mat2): this {
    return this.multiplyMatrices(m, this);
  }

  multiplyMatrices(a: Mat2, b: Mat2): this {
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

  multiplyScalar(s: number): this {
    const te = this.elements;
    te[0] *= s; te[2] *= s;
    te[1] *= s; te[3] *= s;
    return this;
  }

  equals(matrix: Mat2): boolean {
    const te = this.elements;
    const me = matrix.elements;
    for (let i = 0; i < 4; i++) {
      if (te[i] !== me[i]) return false;
    }
    return true;
  }

  fromArray(array: number[] | Float32Array, offset: number = 0): this {
    for (let i = 0; i < 4; i++) {
      this.elements[i] = array[i + offset];
    }
    return this;
  }

  toArray(array: number[] = [], offset: number = 0): number[] {
    const te = this.elements;
    for (let i = 0; i < 4; i++) {
      array[offset + i] = te[i];
    }
    return array;
  }
}
