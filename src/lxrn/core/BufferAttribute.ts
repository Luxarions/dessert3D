/**
 * LXRN BufferAttribute
 * TypedArray GPU memory attribute buffer wrapper
 * @module core/BufferAttribute
 */

export class BufferAttribute {
  name: string = '';
  array: Float32Array | Int32Array | Uint32Array | Uint16Array | Uint8Array;
  itemSize: number;
  count: number;
  normalized: boolean;
  usage: number; // GL_STATIC_DRAW, GL_DYNAMIC_DRAW, etc.
  version: number = 0;

  constructor(
    array: Float32Array | Int32Array | Uint32Array | Uint16Array | Uint8Array,
    itemSize: number,
    normalized: boolean = false
  ) {
    this.array = array;
    this.itemSize = itemSize;
    this.count = array ? array.length / itemSize : 0;
    this.normalized = normalized;
    this.usage = 0x88e4; // STATIC_DRAW default
  }

  set needsUpdate(value: boolean) {
    if (value) this.version++;
  }

  setX(index: number, x: number): this {
    this.array[index * this.itemSize] = x;
    return this;
  }

  setY(index: number, y: number): this {
    this.array[index * this.itemSize + 1] = y;
    return this;
  }

  setZ(index: number, z: number): this {
    this.array[index * this.itemSize + 2] = z;
    return this;
  }

  setW(index: number, w: number): this {
    this.array[index * this.itemSize + 3] = w;
    return this;
  }

  setXYZ(index: number, x: number, y: number, z: number): this {
    const i = index * this.itemSize;
    this.array[i] = x;
    this.array[i + 1] = y;
    this.array[i + 2] = z;
    return this;
  }

  setXYZW(index: number, x: number, y: number, z: number, w: number): this {
    const i = index * this.itemSize;
    this.array[i] = x;
    this.array[i + 1] = y;
    this.array[i + 2] = z;
    this.array[i + 3] = w;
    return this;
  }

  getX(index: number): number {
    return this.array[index * this.itemSize];
  }

  getY(index: number): number {
    return this.array[index * this.itemSize + 1];
  }

  getZ(index: number): number {
    return this.array[index * this.itemSize + 2];
  }

  getW(index: number): number {
    return this.array[index * this.itemSize + 3];
  }

  clone(): BufferAttribute {
    const ClonedArray = this.array.constructor as any;
    return new BufferAttribute(new ClonedArray(this.array), this.itemSize, this.normalized);
  }
}

export class Float32BufferAttribute extends BufferAttribute {
  constructor(array: Float32Array | number[], itemSize: number, normalized: boolean = false) {
    super(array instanceof Float32Array ? array : new Float32Array(array), itemSize, normalized);
  }
}
