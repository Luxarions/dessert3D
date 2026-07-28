/**
 * LXRN Mat3
 * @module Mat3
 */

export class Mat3 {
  public isMat3 = true;
  public elements: Float32Array;
  public __type = 'mat3';
  public __version = 1;

  constructor(
    n11?: number, n12?: number, n13?: number,
    n21?: number, n22?: number, n23?: number,
    n31?: number, n32?: number, n33?: number
  ) {
    this.elements = new Float32Array(9);
    if (n11 !== undefined) {
      this.set(n11, n12!, n13!, n21!, n22!, n23!, n31!, n32!, n33!);
    } else {
      this.identity();
    }
  }

  set(
    n11: number, n12: number, n13: number,
    n21: number, n22: number, n23: number,
    n31: number, n32: number, n33: number
  ): this {
    const te = this.elements;
    te[0] = n11; te[3] = n12; te[6] = n13;
    te[1] = n21; te[4] = n22; te[7] = n23;
    te[2] = n31; te[5] = n32; te[8] = n33;
    return this;
  }

  identity(): this {
    this.set(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
    return this;
  }

  clone(): Mat3 {
    return new Mat3().fromArray(this.elements);
  }

  copy(m: Mat3): this {
    const te = this.elements;
    const me = m.elements;
    for (let i = 0; i < 9; i++) {
      te[i] = me[i];
    }
    return this;
  }

  extractBasis(xAxis: any, yAxis: any, zAxis: any): this {
    xAxis.setFromMat3Column(this, 0);
    yAxis.setFromMat3Column(this, 1);
    zAxis.setFromMat3Column(this, 2);
    return this;
  }

  setFromMatrix4(m: { elements: Float32Array | number[] }): this {
    const me = m.elements;
    this.set(
      me[0], me[4], me[8],
      me[1], me[5], me[9],
      me[2], me[6], me[10]
    );
    return this;
  }

  multiply(m: Mat3): this {
    return this.multiplyMatrices(this, m);
  }

  premultiply(m: Mat3): this {
    return this.multiplyMatrices(m, this);
  }

  multiplyMatrices(a: Mat3, b: Mat3): this {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[0], a12 = ae[3], a13 = ae[6];
    const a21 = ae[1], a22 = ae[4], a23 = ae[7];
    const a31 = ae[2], a32 = ae[5], a33 = ae[8];

    const b11 = be[0], b12 = be[3], b13 = be[6];
    const b21 = be[1], b22 = be[4], b23 = be[7];
    const b31 = be[2], b32 = be[5], b33 = be[8];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  multiplyScalar(s: number): this {
    const te = this.elements;
    for (let i = 0; i < 9; i++) te[i] *= s;
    return this;
  }

  determinant(): number {
    const te = this.elements;

    const a = te[0], b = te[1], c = te[2];
    const d = te[3], e = te[4], f = te[5];
    const g = te[6], h = te[7], i = te[8];

    return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
  }

  invert(): this {
    const te = this.elements;

    const n11 = te[0], n21 = te[1], n31 = te[2];
    const n12 = te[3], n22 = te[4], n32 = te[5];
    const n13 = te[6], n23 = te[7], n33 = te[8];

    const t11 = n33 * n22 - n23 * n32;
    const t12 = n23 * n31 - n33 * n21;
    const t13 = n32 * n21 - n22 * n31;

    const det = n11 * t11 + n12 * t12 + n13 * t13;

    if (det === 0) return this.identity();

    const detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = t12 * detInv;
    te[2] = t13 * detInv;

    te[3] = (n13 * n32 - n33 * n12) * detInv;
    te[4] = (n33 * n11 - n13 * n31) * detInv;
    te[5] = (n12 * n31 - n32 * n11) * detInv;

    te[6] = (n23 * n12 - n13 * n22) * detInv;
    te[7] = (n13 * n21 - n23 * n11) * detInv;
    te[8] = (n22 * n11 - n12 * n21) * detInv;

    return this;
  }

  transpose(): this {
    let tmp;
    const m = this.elements;

    tmp = m[1]; m[1] = m[3]; m[3] = tmp;
    tmp = m[2]; m[2] = m[6]; m[6] = tmp;
    tmp = m[5]; m[5] = m[7]; m[7] = tmp;

    return this;
  }

  getNormalMatrix(matrix4: { elements: Float32Array | number[] }): this {
    return this.setFromMatrix4(matrix4).invert().transpose();
  }

  transposeIntoArray(r: number[] | Float32Array): this {
    const m = this.elements;

    r[0] = m[0];
    r[1] = m[3];
    r[2] = m[6];
    r[3] = m[1];
    r[4] = m[4];
    r[5] = m[7];
    r[6] = m[2];
    r[7] = m[5];
    r[8] = m[8];

    return this;
  }

  setUvTransform(tx: number, ty: number, sx: number, sy: number, rotation: number, cx: number, cy: number): this {
    const c = Math.cos(rotation);
    const s = Math.sin(rotation);

    this.set(
      sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx,
      -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty,
      0, 0, 1
    );

    return this;
  }

  scale(sx: number, sy: number): this {
    this.premultiply(new Mat3().set(
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    ));
    return this;
  }

  rotate(theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.premultiply(new Mat3().set(
      c, -s, 0,
      s, c, 0,
      0, 0, 1
    ));

    return this;
  }

  translate(tx: number, ty: number): this {
    this.premultiply(new Mat3().set(
      1, 0, tx,
      0, 1, ty,
      0, 0, 1
    ));
    return this;
  }

  equals(matrix: Mat3): boolean {
    const te = this.elements;
    const me = matrix.elements;

    for (let i = 0; i < 9; i++) {
      if (te[i] !== me[i]) return false;
    }

    return true;
  }

  fromArray(array: number[] | Float32Array, offset: number = 0): this {
    for (let i = 0; i < 9; i++) {
      this.elements[i] = array[i + offset];
    }
    return this;
  }

  toArray(array: number[] = [], offset: number = 0): number[] {
    const te = this.elements;
    for (let i = 0; i < 9; i++) {
      array[offset + i] = te[i];
    }
    return array;
  }
}
