/**
 * LXRN Color (Color management & math)
 * @module Color
 */

import { clamp } from './MathUtils';

export class Color {
  public r: number;
  public g: number;
  public b: number;

  constructor(rOrStyle?: number | string, g?: number, b?: number) {
    if (typeof rOrStyle === 'string') {
      this.r = 1; this.g = 1; this.b = 1;
      this.setStyle(rOrStyle);
    } else if (typeof rOrStyle === 'number' && g === undefined) {
      this.r = 1; this.g = 1; this.b = 1;
      this.setHex(rOrStyle);
    } else {
      this.r = typeof rOrStyle === 'number' ? rOrStyle : 1;
      this.g = g ?? 1;
      this.b = b ?? 1;
    }
  }

  setHSL(h: number, s: number, l: number): this {
    if (s === 0) {
      this.r = this.g = this.b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      this.r = hue2rgb(p, q, h + 1/3);
      this.g = hue2rgb(p, q, h);
      this.b = hue2rgb(p, q, h - 1/3);
    }
    return this;
  }

  set(value: Color | number | string, g?: number, b?: number): this {
    if (value instanceof Color) {
      return this.copy(value);
    }
    if (typeof value === 'number' && g === undefined) {
      return this.setHex(value);
    }
    if (typeof value === 'string') {
      return this.setStyle(value);
    }
    if (typeof value === 'number' && typeof g === 'number' && typeof b === 'number') {
      this.r = value;
      this.g = g;
      this.b = b;
    }
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
