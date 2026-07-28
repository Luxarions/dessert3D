/**
 * LXRN MatrixStack
 * @module MatrixStack
 */

import { Mat4 } from './Mat4';

export class MatrixStack {
  private stack: Mat4[];

  constructor() {
    this.stack = [new Mat4().identity()];
  }

  get current(): Mat4 {
    return this.stack[this.stack.length - 1];
  }

  push(): this {
    this.stack.push(this.current.clone());
    return this;
  }

  pop(): Mat4 {
    if (this.stack.length <= 1) {
      throw new Error('MatrixStack underflow');
    }
    return this.stack.pop()!;
  }

  loadIdentity(): this {
    this.current.identity();
    return this;
  }

  loadMatrix(m: Mat4): this {
    this.current.copy(m);
    return this;
  }

  multiply(m: Mat4): this {
    this.current.multiply(m);
    return this;
  }

  translate(x: number, y: number, z: number): this {
    this.current.multiply(new Mat4().makeTranslation(x, y, z));
    return this;
  }

  rotateX(angle: number): this {
    this.current.multiply(new Mat4().makeRotationX(angle));
    return this;
  }

  rotateY(angle: number): this {
    this.current.multiply(new Mat4().makeRotationY(angle));
    return this;
  }

  rotateZ(angle: number): this {
    this.current.multiply(new Mat4().makeRotationZ(angle));
    return this;
  }

  scale(x: number, y: number, z: number): this {
    this.current.multiply(new Mat4().makeScale(x, y, z));
    return this;
  }
}
