/**
 * LXRN Complex
 * @module Complex
 */

export class Complex {
  public r: number;
  public i: number;

  constructor(r: number = 0, i: number = 0) {
    this.r = r;
    this.i = i;
  }

  set(r: number, i: number): this {
    this.r = r;
    this.i = i;
    return this;
  }

  clone(): Complex {
    return new Complex(this.r, this.i);
  }

  copy(c: Complex): this {
    this.r = c.r;
    this.i = c.i;
    return this;
  }

  add(c: Complex): this {
    this.r += c.r;
    this.i += c.i;
    return this;
  }

  sub(c: Complex): this {
    this.r -= c.r;
    this.i -= c.i;
    return this;
  }

  multiply(c: Complex): this {
    const r = this.r * c.r - this.i * c.i;
    const i = this.r * c.i + this.i * c.r;
    this.r = r;
    this.i = i;
    return this;
  }

  multiplyScalar(s: number): this {
    this.r *= s;
    this.i *= s;
    return this;
  }

  divide(c: Complex): this {
    const denom = c.r * c.r + c.i * c.i;
    if (denom === 0) return this.set(0, 0);
    const r = (this.r * c.r + this.i * c.i) / denom;
    const i = (this.i * c.r - this.r * c.i) / denom;
    this.r = r;
    this.i = i;
    return this;
  }

  conjugate(): this {
    this.i = -this.i;
    return this;
  }

  magnitudeSq(): number {
    return this.r * this.r + this.i * this.i;
  }

  magnitude(): number {
    return Math.sqrt(this.r * this.r + this.i * this.i);
  }

  angle(): number {
    return Math.atan2(this.i, this.r);
  }

  exp(): this {
    const expR = Math.exp(this.r);
    this.r = expR * Math.cos(this.i);
    this.i = expR * Math.sin(this.i);
    return this;
  }
}
