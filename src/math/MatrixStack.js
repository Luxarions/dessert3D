/**
 * LXRN MatrixStack
 * @module MatrixStack
 */

import { Mat4 } from './Mat4.js';

class MatrixStack {
  constructor() {
    this.isMatrixStack = true;
    this.stack = [new Mat4()];
  }

  get current() {
    return this.stack[this.stack.length - 1];
  }

  push() {
    const copy = this.current.clone();
    this.stack.push(copy);
    return this;
  }

  pop() {
    if (this.stack.length <= 1) {
      throw new Error('LXRN.MatrixStack: Stack underflow.');
    }
    this.stack.pop();
    return this;
  }

  identity() {
    this.current.identity();
    return this;
  }

  load(matrix) {
    this.current.copy(matrix);
    return this;
  }

  multiply(matrix) {
    this.current.multiply(matrix);
    return this;
  }

  premultiply(matrix) {
    this.current.premultiply(matrix);
    return this;
  }

  translate(x, y, z) {
    const _m1 = new Mat4();
    _m1.makeTranslation(x, y, z);
    this.current.multiply(_m1);
    return this;
  }

  rotateX(angle) {
    const _m1 = new Mat4();
    _m1.makeRotationX(angle);
    this.current.multiply(_m1);
    return this;
  }

  rotateY(angle) {
    const _m1 = new Mat4();
    _m1.makeRotationY(angle);
    this.current.multiply(_m1);
    return this;
  }

  rotateZ(angle) {
    const _m1 = new Mat4();
    _m1.makeRotationZ(angle);
    this.current.multiply(_m1);
    return this;
  }

  scale(x, y, z) {
    const _m1 = new Mat4();
    _m1.makeScale(x, y, z);
    this.current.multiply(_m1);
    return this;
  }

  clear() {
    this.stack = [new Mat4()];
    return this;
  }
}

export { MatrixStack };
