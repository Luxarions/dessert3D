/**
 * LXRN Color (Color management & math)
 * @module Color
 */

import { clamp } from './MathUtils';

export class Color {
  public r: number;
  public g: number;
  public b: number;

  constructor(r: number = 1, g: number = 1, b: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  set(r: number, g: number, b: number): this {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  setHex(hex: number): this {
    hex = Math.floor(hex);
    this.r = (hex >> 16 & 255) / 255;
    this.g = (hex >> 8 & 255) / 255;
    this.b = (hex & 255) / 255;
    return this;
  }

  setStyle(style: string): this {
    if (style.startsWith('#')) {
      const hex = parseInt(style.substring(1), 16);
      if (style.length === 4) {
        const r = (hex >> 8 & 0xf) * 17;
        const g = (hex >> 4 & 0xf) * 17;
        const b = (hex & 0xf) * 17;
        return this.set(r / 255, g / 255, b / 255);
      }
      return this.setHex(hex);
    }
    return this;
  }

  getHex(): number {
    return (Math.round(this.r * 255) << 16) ^ (Math.round(this.g * 255) << 8) ^ (Math.round(this.b * 255) << 0);
  }

  getHexString(): string {
    return '#' + ('000000' + this.getHex().toString(16)).slice(-6);
  }

  getStyle(): string {
    return `rgb(${Math.round(this.r * 255)},${Math.round(this.g * 255)},${Math.round(this.b * 255)})`;
  }

  clone(): Color {
    return new Color(this.r, this.g, this.b);
  }

  copy(c: Color): this {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    return this;
  }

  add(c: Color): this {
    this.r += c.r;
    this.g += c.g;
    this.b += c.b;
    return this;
  }

  multiplyScalar(s: number): this {
    this.r *= s;
    this.g *= s;
    this.b *= s;
    return this;
  }

  lerp(c: Color, alpha: number): this {
    this.r += (c.r - this.r) * alpha;
    this.g += (c.g - this.g) * alpha;
    this.b += (c.b - this.b) * alpha;
    return this;
  }
}
