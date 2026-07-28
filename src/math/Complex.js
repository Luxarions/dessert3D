/**
 * LXRN Complex
 * @module Complex
 */

import { clamp } from './MathUtils.js';

class Complex {
  constructor(real = 0, imag = 0) {
    this.isComplex = true;
    this.real = real;
    this.imag = imag;
  }

  set(real, imag) {
    this.real = real;
    this.imag = imag;
    return this;
  }

  clone() {
    return new Complex(this.real, this.imag);
  }

  copy(c) {
    this.real = c.real;
    this.imag = c.imag;
    return this;
  }

  add(c) {
    this.real += c.real;
    this.imag += c.imag;
    return this;
  }

  sub(c) {
    this.real -= c.real;
    this.imag -= c.imag;
    return this;
  }

  multiply(c) {
    const r = this.real * c.real - this.imag * c.imag;
    const i = this.real * c.imag + this.imag * c.real;
    this.real = r;
    this.imag = i;
    return this;
  }

  multiplyScalar(s) {
    this.real *= s;
    this.imag *= s;
    return this;
  }

  divide(c) {
    const denom = c.real * c.real + c.imag * c.imag;
    if (denom === 0) throw new Error('LXRN.Complex: Division by zero.');
    const r = (this.real * c.real + this.imag * c.imag) / denom;
    const i = (this.imag * c.real - this.real * c.imag) / denom;
    this.real = r;
    this.imag = i;
    return this;
  }

  conjugate() {
    this.imag = -this.imag;
    return this;
  }

  abs() {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  arg() {
    return Math.atan2(this.imag, this.real);
  }

  exp() {
    const r = Math.exp(this.real);
    this.real = r * Math.cos(this.imag);
    this.imag = r * Math.sin(this.imag);
    return this;
  }

  log() {
    const r = this.abs();
    const i = this.arg();
    this.real = Math.log(r);
    this.imag = i;
    return this;
  }

  pow(p) {
    const log = this.clone().log();
    log.multiplyScalar(p);
    return this.copy(log.exp());
  }

  equals(c) {
    return this.real === c.real && this.imag === c.imag;
  }
}

export { Complex };
